import { useState, useRef } from 'react';
import { CheckCircle, Loader2, Save, FileDown, FileSpreadsheet } from 'lucide-react';
import { motion } from 'framer-motion';
import { uploadClosingCheckFile, saveClosingChecks } from '@/services/closingCheckService';
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

const steps = [
  { id: 1, label: 'Upload' },
  { id: 2, label: 'Mapping' },
  { id: 3, label: 'Prévisualisation' },
  { id: 4, label: 'Validation' },
];

const CalculWIPPage = () => {
  const width = useAdaptiveWidth();
  const height = useAdaptiveHeight();

  const [currentStep, setCurrentStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const enrichedData = await uploadClosingCheckFile(file);
      toast.success('✅ Fichier importé avec succès');

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

  const handleSave = async () => {
    try {
      const rowData = rows.map(({ id, ...rest }) => rest);
      await saveClosingChecks(rowData);
      toast.success('✅ Données sauvegardées avec succès');
      setCurrentStep(4);
    } catch (err) {
      toast.error('❌ Erreur lors de la sauvegarde');
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-blue-900">Calcul WIP</h1>

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
        {currentStep === 1 && (
          <FileUploader onUpload={handleFileUpload} />
        )}

        {currentStep === 2 && (
          <div>
            <p className="text-sm text-gray-700">Traitement en cours... (Mapping et enrichissement des données)</p>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <div className="flex justify-end gap-2 mb-2">
              <Button
                size="small"
                variant="outlined"
                onClick={() => downloadExcel(rows)}
                startIcon={<FileSpreadsheet size={16} />}
              >
                Exporter Excel
              </Button>
              <Button onClick={handleSave} className="gap-2">
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
          <div>
            <p className="text-sm text-green-700 font-medium">✅ Données sauvegardées avec succès !</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalculWIPPage;
