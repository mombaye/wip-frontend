import { useState, useRef } from 'react';
import { CheckCircle, Loader2, Save, FileDown, FileSpreadsheet } from 'lucide-react';
import { motion } from 'framer-motion';
import { uploadClosingCheckFile, saveClosingChecks, checkConflicts, uploadExistingData } from '@/services/closingCheckService';
import { toast } from 'react-toastify';
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
} from '@mui/x-data-grid';
import { Button } from '@mui/material';
import * as XLSX from 'xlsx';
import { useAdaptiveWidth } from '@/hooks/useAdaptiveWidth';
import { useAdaptiveHeight } from '@/hooks/useAdaptiveHeight';
import FileUploader from '@/components/FileUploader';
import api from '@/services/api';
import { confirmAlert } from 'react-confirm-alert';
import CogsSection from '@/components/cogs/CogsSection';
import ConflictModal from '@/components/modals/ConflictModal';
import { Button as AppButton } from '@/ui/button'; // si tu veux remplacer tous les Button MUI plus tard
import CogsReviewTable from '@/components/cogs/CogsReviewTable';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/ui/select';

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/ui/tabs";
import InvoiceReviewTable from '@/components/invoices/InvoiceReviewTableProps';
import { Info } from 'lucide-react';
import { useBoolean } from '@/hooks/useBoolean';
import WIPReviewTable from '@/components/wip/WIPReviewTable';
import { ProgressBar } from '@/components/tools/ProgressBar';
import { ErrorModal } from '@/components/modals/ErrorModal';
import { BatchErrorReport, BatchSaveError } from '@/types/types';


function downloadCSV(data: any[], filename = 'closing_check_export.csv') {
  const keys = Object.keys(data[0]);
  const csvRows = [
    keys.join(','),
    ...data.map((row) => keys.map((k) => `"${row[k] ?? ''}"`).join(',')),
  ];
  
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

function downloadExcel(data: any[], filename = 'closing_check_export.xlsx') {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, filename);
}

function CustomToolbar({ rows }: { rows: any[] }) {
  return (
    <GridToolbarContainer className="sticky top-0 z-10 bg-white border-b flex justify-end pr-4 py-2 gap-2">
      <Button
        size="small"
        variant="outlined"
        onClick={() => downloadCSV(rows)}
        startIcon={<FileDown size={16} />}
      >
        CSV
      </Button>
      <Button
        size="small"
        variant="outlined"
        onClick={() => downloadExcel(rows)}
        startIcon={<FileDown size={16} />}
      >
        Excel
      </Button>
    </GridToolbarContainer>
  );
}

type COGS = { [key: string]: any };      // Ou adapte avec ton vrai type
type Invoice = { [key: string]: any };
type WIP = { [key: string]: any };

type BatchSaveResult = {
  saved: number;
  updated: number;
  errors: { entry: any; error: string }[];
};
type BatchResponse = {
  cogs: BatchSaveResult;
  invoices: BatchSaveResult;
  wip: BatchSaveResult;
  message: string;
};

const steps = [
  { id: 1, label: 'Upload' },
  { id: 2, label: 'Mapping' },
  { id: 3, label: 'Prévisualisation' },
  { id: 4, label: 'Validation' },
  { id: 5, label: 'COGS Générés' },
];

const BATCH_SIZE = 10000; 

const CalculWIPPage = () => {
  const width = useAdaptiveWidth();
  const height = useAdaptiveHeight();

  const [currentStep, setCurrentStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [cogsData, setCogsData] = useState<Record<string, any>>({});
  const [conflictModalOpen, setConflictModalOpen] = useState(false);
  const [conflictMonths, setConflictMonths] = useState<string[]>([]);
  const [pendingRowData, setPendingRowData] = useState<any[]>([]);
  const [generatingCogs, setGeneratingCogs] = useState(false);
  const [showCOGS, setShowCOGS] = useState(false);
  const [existingType, setExistingType] = useState<'audit' | 'cogs' | 'invoices' | ''>('');
  // En haut du composant
  const [showImporter, setShowImporter] = useState(false);
  const [availableSheets, setAvailableSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [tabLoading, setTabLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('cogs');
  const [showFinalSuccess, setShowFinalSuccess] = useState(false);
  const [finalSaving, setFinalSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [allErrors, setAllErrors] = useState<BatchErrorReport[]>([]);
  // ... dans CalculWIPPage
  const [importSessionId, setImportSessionId] = useState(null);






  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const enrichedData = await uploadClosingCheckFile(file);

      const keys = Object.keys(enrichedData[0]);
      const formattedColumns: GridColDef[] = keys.map((key) => ({
        field: key,
        headerName: key,
        flex: 1,
        editable: true,
        headerClassName: 'bg-blue-50',
        cellClassName: (params) => {
          if (key === 'Net') {
            return parseFloat(params.value) < 0 ? 'text-red-600' : 'text-green-600';
          }
          return '';
        },
      }));

      const formattedRows = enrichedData.map((row: any, index: number) => ({ id: index, ...row }));
      setColumns(formattedColumns);
      setRows(formattedRows);
      setCurrentStep(3);
    } catch (err) {
      toast.error("Erreur lors de l'import");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

    const normalizeWithKnownMappings = (row: Record<string, any>) => {
      const knownMappings: Record<string, string> = {
        "AccountDesc": "account_desc",
        "TrCode": "tr_code",
        "Description": "description",
        "Project": "project",
        "USER": "user",
        "Debit": "debit",
        "Credit": "credit",
        "Net": "net",
        "country report": "country_report",
        "BL / CAT": "bl_category",
        "Month": "month",
        "project margin": "project_margin",
        "Talentia account": "talentia_account",
        "Talentia reporting": "talentia_reporting",
        "EBITDA": "ebitda",
        "Category": "category",
        "Final client": "final_client",
        "Country of project": "country_of_project",
        "country code": "country_code",
        "Talentia code": "talentia_code",
        "Account": "account",
        "Date": "date",
        "Year": "year",
        "Audit trail number": "audit_trail_number"
      };

      const numericFields = ['debit', 'credit', 'net'];

      const result: Record<string, any> = {};
      for (const key in row) {
        const cleanKey = key.trim();
        const mappedKey = knownMappings[cleanKey] || cleanKey.replace(/\s+/g, "_").toLowerCase();

        result[mappedKey] = numericFields.includes(mappedKey)
          ? parseFloat(row[key] || 0)
          : row[key];
      }

      return result;
    };

    const extractMonthYearFromRow = (row: any): string | null => {
    if (row.month) return row.month;
    if (row.date) {
      const date = new Date(row.date);
      return !isNaN(date.getTime()) ? date.toLocaleString('default', { month: 'short', year: 'numeric' }).replace(' ', '-') : null;
    }
    if (row.year && row.month) return `${row.month}-${row.year}`;
    return null;
  };
    function chunkArray<T>(array: T[], chunkSize: number): T[][] {
      const results: T[][] = [];
      for (let i = 0; i < array.length; i += chunkSize) {
        results.push(array.slice(i, i + chunkSize));
      }
      return results;
    }

    // ... (garde tes imports et useState)
    const saveAllChunks = async (
      setErrorModalOpen: (b: boolean) => void,
      setAllErrors: (errors: BatchErrorReport[]) => void,
      setFinalSaving: (b: boolean) => void,
      setProgress: (n: number) => void,
      setShowFinalSuccess: (b: boolean) => void,
      importSessionId: string | null
    ) => {
      if (!importSessionId) {
        toast.error("Aucune session d'import trouvée.");
        return;
      }
      setFinalSaving(true);
      setProgress(0);

      try {
        // Un seul appel, ultra rapide (pas de batch)
        const { data } = await api.post('/upload/cogs/save-batch', { import_session_id: importSessionId }, {
          headers: { 'Content-Type': 'application/json' },
          // timeout: 180000, // optionnel
        });

        // Gestion du report d'erreurs/retour
        const allErrors = [
          ...(data.cogs?.errors || []),
          ...(data.invoices?.errors || []),
          ...(data.wip?.errors || []),
        ];
        setProgress(1);

        if (allErrors.length > 0) {
          toast.warn(`⚠️ ${allErrors.length} erreurs sur certains lots. Consultez le rapport.`);
          setAllErrors(allErrors);
          setErrorModalOpen(true);
        } else {
          toast.success('✅ Toutes les données ont bien été sauvegardées !');
          setShowFinalSuccess(true);
        }

      } catch (err: any) {
        toast.error(`Erreur lors de la sauvegarde : ${err?.message || err}`);
      } finally {
        setFinalSaving(false);
        setProgress(1);
      }
    };

        
    const handleImportExistingExcelFile = (file: File, type: 'audit' | 'cogs' | 'invoices') => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        // Cherche les feuilles candidates
        let candidates: string[] = [];
        if (type === 'audit') {
          candidates = workbook.SheetNames.filter((sn) =>
            sn.toLowerCase().includes('audit')
          );
        } else if (type === 'cogs') {
          candidates = workbook.SheetNames.filter((sn) =>
            sn.toLowerCase().includes('cogs')
          );
        } else if (type === 'invoices') {
          candidates = workbook.SheetNames.filter((sn) =>
            sn.toLowerCase().includes('facturation') || sn.toLowerCase().includes('invoice')
          );
        }

        if (candidates.length === 0) {
          toast.error(`❌ Aucune feuille trouvée pour "${type}".`);
          return;
        }

        // Si une seule feuille candidate : on l’upload direct
        if (candidates.length === 1) {
          uploadSheetToBackend(file, type, candidates[0]);
          return;
        }

        // Sinon, on affiche la sélection
        setAvailableSheets(candidates);
        setPendingFile(file);
      };
      reader.readAsArrayBuffer(file);
    };


    const uploadSheetToBackend = async (
      file: File,
      type: 'audit' | 'cogs' | 'invoices',
      sheetName: string
    ) => {
      try {
        setUploading(true);
        const result = await uploadExistingData(file, type, sheetName);
        console.log("Upload result:", result);
        toast.success(result.message || "✅ Données importées !");
        setCogsData(result.data || {});
        setCurrentStep(5);
        setAvailableSheets([]);
        setSelectedSheet('');
        setPendingFile(null);
      } catch (err) {
        toast.error("❌ Erreur lors de l’import backend.");
      } finally {
        setUploading(false);
      }
    };



    const handleSave = async () => {
      setSaving(true);
      try {
        const rowData = rows.map(({ id, ...rest }) => normalizeWithKnownMappings(rest));
        const conflicts = await checkConflicts(rowData);

        
        if (conflicts.length > 0) {
          setConflictModalOpen(true);
          setConflictMonths(conflicts);
          setPendingRowData(rowData);
          return;
        }
        setGeneratingCogs(true);
        const response = await api.post('/upload/closing-checks/bulk-save', rowData);
        setCogsData(response.data);
        setCurrentStep(5); 
      } catch (err) {
        toast.error('❌ Erreur lors de la sauvegarde');
        console.error(err);
      } finally {
        setSaving(false);
        setGeneratingCogs(false);
      }
    };


    const handleConflictConfirmation = async (actions: Record<string, string>) => {
      setConflictModalOpen(false);

      const grouped = pendingRowData.reduce((acc, row) => {
        const month = row.month;
        if (!actions[month] || actions[month] === 'cancel') return acc;
        acc[month] = acc[month] || [];
        acc[month].push(row);
        return acc;
      }, {} as Record<string, any[]>);

      const finalPayload = Object.values(grouped).flat();

      const queryString = Object.entries(actions)
        .filter(([_, act]) => act !== 'cancel')
        .map(([month, act]) => `action_${month}=${act}`)
        .join('&');

      try {
         setGeneratingCogs(true);
        const response = await api.post(`/upload/closing-checks/bulk-save?${queryString}`, finalPayload);
        toast.success("✅ Données sauvegardées !");
        setImportSessionId(response.data.import_session_id);
        setCogsData(response.data.data);
        setCurrentStep(5); // étape COGS
      } catch (err) {
        toast.error('❌ Erreur lors de la sauvegarde');
        console.error(err);
      } finally {
        setGeneratingCogs(false);
      }
    };





  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-blue-900">Calcul WIP</h1>

    

      
      <div className="flex items-center justify-between bg-blue-50 border border-blue-200 px-4 py-3 rounded-md">
        <div className="flex items-center gap-2">
          <Info className="text-blue-700" size={20} />
          <p className="text-blue-800 text-sm">
            Vous avez déjà des données sauvegardées ? Importez-les ici pour les afficher.
          </p>
        </div>
        <AppButton onClick={() => setShowImporter(prev => !prev)} variant="outline">
          {showImporter ? "Masquer l'import existant" : "Charger des données existantes"}
        </AppButton>
      </div>

      {showImporter && (
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-dashed border-blue-200 bg-blue-50 rounded-md mt-2">
          <div className="w-64">
            <Select value={existingType} onValueChange={(value) => setExistingType(value as any)}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Type de données à charger" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="audit">Audit Trail</SelectItem>
                <SelectItem value="cogs">COGS</SelectItem>
                <SelectItem value="invoices">Facturation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <label htmlFor="existing-upload" className="flex items-center gap-2 bg-white border border-gray-300 rounded px-4 py-2 cursor-pointer hover:border-blue-500 hover:text-blue-600 shadow-sm transition-all duration-200">
            <FileSpreadsheet size={16} className="text-blue-600" />
            <span className="text-sm font-medium">Choisir un fichier Excel</span>
            <input
              id="existing-upload"
              type="file"
              accept=".xlsx,.xlsm,.xls"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && existingType) handleImportExistingExcelFile(file, existingType);
              }}
              className="hidden"
            />
          </label>
        </div>
      )}

      {availableSheets.length > 1 && pendingFile && (
        <div className="flex flex-col gap-2 mt-2">
          <span className="font-medium text-blue-900">Sélectionnez la feuille à importer :</span>
          <Select value={selectedSheet} onValueChange={value => setSelectedSheet(value)}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Choisir une feuille" />
            </SelectTrigger>
            <SelectContent>
              {availableSheets.map(sn => (
                <SelectItem key={sn} value={sn}>
                  {sn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <AppButton
            onClick={() => {
              if (selectedSheet) uploadSheetToBackend(pendingFile, existingType as 'audit' | 'cogs' | 'invoices', selectedSheet);
            }}
            disabled={!selectedSheet}
            className="mt-2"
            variant="default"
          >
            Importer cette feuille
          </AppButton>
        </div>
      )}




      {generatingCogs && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-white bg-opacity-60 backdrop-blur-md z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-4 p-6 bg-white shadow-lg rounded-lg border border-blue-100"
          >
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="text-sm text-blue-800 font-medium">
              Génération des COGS en cours... Veuillez patienter.
            </p>
          </motion.div>
        </motion.div>
      )}


      <div className="relative w-full mb-6">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div key={step.id} className="relative flex-1 text-center">
              <div className="flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto z-10
                    ${step.id < currentStep ? 'bg-green-500 text-white' :
                      step.id === currentStep ? 'bg-blue-600 text-white animate-pulse' :
                      'bg-gray-300 text-gray-700'}`}
                >
                  {step.id < currentStep ? <CheckCircle size={18} /> : step.id === currentStep ? <Loader2 className="animate-spin" size={18} /> : step.id}
                </motion.div>
              </div>
              <div className="mt-1 text-xs text-gray-600 font-medium">{step.label}</div>
              {index < steps.length - 1 && (
                <div className="absolute top-5 left-1/2 w-full border-t border-dashed border-gray-300 z-0" style={{ transform: 'translateX(50%)' }}></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border mt-4">
        {uploading && (
          <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 p-3 rounded mb-4">
            <Loader2 className="animate-spin" size={18} />
            <span>Traitement du fichier en cours, veuillez patienter...</span>
          </div>
        )}

        {currentStep === 1 && !uploading && (
          <FileUploader onUpload={handleFileUpload} />
        )}

        {currentStep === 2 && (
          <div>
            <p className="text-sm text-gray-700">Traitement en cours... (Mapping et enrichissement des données)</p>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-sm text-green-600 bg-green-50 border border-green-200 px-4 py-2 rounded mb-4"
            >
              ✅ Données chargées avec succès. Vous pouvez les consulter ou les modifier avant sauvegarde.
            </motion.div>

            {saving && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-white bg-opacity-60 backdrop-blur-md z-50 flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center gap-4 p-6 bg-white shadow-lg rounded-lg border border-blue-100"
                  >
                    <Loader2 className="animate-spin text-blue-600" size={40} />
                    <p className="text-sm text-blue-800 font-medium">
                      Sauvegarde des données en cours... Veuillez patienter.
                    </p>
                  </motion.div>
                </motion.div>
              )}


            <div className="flex justify-end gap-2 mb-2">
              <Button
                size="small"
                variant="outlined"
                onClick={() => downloadExcel(rows)}
                startIcon={<FileSpreadsheet size={16} />}
              >
                Exporter Excel
              </Button>
              <Button onClick={() => handleSave()} className="gap-2">
                <Save size={16} /> Sauvegarder
              </Button>
            </div>

            <div style={{ height, width }} className="rounded border shadow">
              <DataGrid
                rows={rows}
                columns={columns}
                pageSizeOptions={[20, 50, 100]}
                processRowUpdate={(updatedRow, oldRow) => {
                  setRows((prev) =>
                    prev.map((row) => (row.id === oldRow.id ? updatedRow : row))
                  );
                  return updatedRow;
                }}
                disableRowSelectionOnClick
              />
            </div>
          </div>
        )}

        {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4"
              >
                <CheckCircle className="text-green-600" size={40} />
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg font-semibold text-green-800"
              >
                ✅ Données sauvegardées avec succès !
              </motion.p>
            </motion.div>
        )}

        {currentStep === 5 && (
          <div className="mt-4">
            <div className="flex justify-end mb-4">
              <AppButton
                  variant="default"
                  onClick={async () => {
                    await saveAllChunks(
                      setErrorModalOpen,
                      setAllErrors,
                      setFinalSaving,
                      setProgress,
                      setShowFinalSuccess,
                      importSessionId // <-- C’est tout !
                    );
                  }}
                  className="gap-2"
                  disabled={finalSaving}
                >
                  {finalSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={16} />}
                  Sauvegarder les données générées
              </AppButton>


            </div>

            <Tabs value={selectedTab} onValueChange={(value) => {
              setTabLoading(true);
              setSelectedTab(value);
              setTimeout(() => setTabLoading(false), 700); // simulate load
            }} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="cogs">🧮 COGS</TabsTrigger>
                <TabsTrigger value="invoices">🧾 Facturation</TabsTrigger>
                <TabsTrigger value="wip">📊 WIP</TabsTrigger>
              </TabsList>
              {tabLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full flex justify-center items-center py-12"
              >
                <Loader2 className="animate-spin text-blue-600" size={40} />
                <span className="ml-3 text-blue-700 font-medium text-sm">Chargement du contenu...</span>
              </motion.div>
            )}

              <TabsContent value="cogs">
                {!tabLoading && <CogsReviewTable cogsData={cogsData || {}} />}
              </TabsContent>

              <TabsContent value="invoices">
                {!tabLoading && (
                  <InvoiceReviewTable invoiceData={
                    Object.fromEntries(
                      Object.entries(cogsData).map(([month, result]) => [month, result.invoices || []])
                    )
                  } />
                )}
              </TabsContent>

              <TabsContent value="wip">
                {!tabLoading && (
                  <WIPReviewTable wipData={
                    Object.fromEntries(
                      Object.entries(cogsData).map(([month, result]) => [month, result.wip || []])
                    )
                  } />
                )}
              </TabsContent>

            </Tabs>
          </div>
        )}


        {conflictModalOpen && (
        <ConflictModal
          conflicts={conflictMonths}
          onClose={() => setConflictModalOpen(false)}
          onConfirm={handleConflictConfirmation}
        />
      )}

        {finalSaving && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-white bg-opacity-70 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-5 p-8 bg-white shadow-2xl rounded-xl border border-blue-100"
            >
              <Loader2 className="animate-spin text-blue-600" size={50} />
              <div className="text-lg text-blue-900 font-semibold text-center">
                Sauvegarde finale en cours...<br />
                Veuillez patienter pendant l’enregistrement de toutes les données générées.
              </div>
            </motion.div>
          </motion.div>
        )}

        {finalSaving && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-white/80 backdrop-blur-md z-50 flex flex-col items-center justify-center"
          >
            <div className="bg-white p-8 rounded-xl border border-blue-100 shadow-xl flex flex-col items-center gap-6 w-[340px]">
              <Loader2 className="animate-spin text-blue-600 mb-2" size={36} />
              <div className="text-lg text-blue-900 font-semibold mb-2 text-center">
                Sauvegarde massive en cours…<br />
                Cette opération peut prendre plusieurs minutes.<br />
              </div>
             
              <span className="text-xs text-gray-500 mt-2">Merci de patienter...</span>
            </div>
          </motion.div>
        )}


        {showFinalSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white px-8 py-10 rounded-2xl shadow-2xl flex flex-col items-center border border-blue-200 max-w-md w-full"
            >
              <CheckCircle className="text-green-500 mb-3" size={64} />
              <h2 className="text-2xl font-bold mb-2 text-blue-900">Processus terminé avec succès !</h2>
              <p className="text-base text-gray-700 mb-5 text-center">
                Toutes les données COGS, Factures et WIP ont bien été sauvegardées.<br />
                Vous pouvez maintenant revenir à l’accueil ou exporter votre rapport.
              </p>
              <div className="flex gap-4">
                <AppButton
                  variant="default"
                  onClick={() => {
                    setShowFinalSuccess(false);
                    window.location.href = "/"; // ou vers la page d’accueil/dash
                  }}
                >
                  Retour à l’accueil
                </AppButton>
                <AppButton
                  variant="outline"
                  onClick={() => {
                    // Ajoute ici ta fonction d’export si besoin, sinon retire ce bouton
                  }}
                >
                  Exporter le rapport
                </AppButton>
              </div>
            </motion.div>
          </motion.div>
        )}


        {errorModalOpen && (
          <ErrorModal
            open={errorModalOpen}
            onClose={() => setErrorModalOpen(false)}
            errors={allErrors}
          />
        )}

      </div>
    </div>
  );
};

export default CalculWIPPage;
