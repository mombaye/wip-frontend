import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { FileSpreadsheet, Eye, EyeOff } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';

type WIPEntry = {
  [key: string]: any; // pour simplifier ici
};

type Props = {
  wipData: Record<string, WIPEntry[]>;
};

const WIPReviewTable: React.FC<Props> = ({ wipData }) => {
  const [search, setSearch] = useState('');
  const [showAllColumns, setShowAllColumns] = useState(false);

  // Charger le mode depuis localStorage
  useEffect(() => {
    const stored = localStorage.getItem('showAllColumns');
    if (stored) setShowAllColumns(stored === 'true');
  }, []);

  // Enregistrer le choix dans localStorage
  useEffect(() => {
    localStorage.setItem('showAllColumns', showAllColumns.toString());
  }, [showAllColumns]);

    const allRows: (WIPEntry & { id: string })[] = Object.entries(wipData).flatMap(([month, rows]) =>
    rows.map((row, index) => ({ id: `${month}-${index}`, ...row }))
    );

    const filteredRows = allRows.filter(
    (row) =>
        row.project_code?.toLowerCase().includes(search.toLowerCase()) ||
        row.client?.toLowerCase().includes(search.toLowerCase()) ||
        row.business_line?.toLowerCase().includes(search.toLowerCase())
    );


    const isColumnEmpty = (field: keyof WIPEntry) => {
    return filteredRows.every((row) => {
        const value = row[field];
        return value === null || value === undefined || value === '' || value === 0 || value === '0.0' || value === '-';});
    };


  const allColumns: GridColDef[] = [
    { field: 'nr_crt', headerName: 'Nr Crt', flex: 0.6 },
    { field: 'project_code', headerName: 'Project Code', flex: 1 },
    { field: 'client', headerName: 'Client', flex: 1 },
    { field: 'location_description', headerName: 'Location - description of the project', flex: 2 },
    { field: 'business_line', headerName: 'Business Line', flex: 1 },
    { field: 'multiple_business_line', headerName: 'Multiple business line', flex: 1 },
    { field: 'site_construction', headerName: 'Site construction', flex: 1 },
    { field: 'fiber_optic', headerName: 'Fiber Optic', flex: 1 },
    { field: 'energy', headerName: 'Energy', flex: 1 },
    { field: 'managed_services', headerName: 'Managed Services', flex: 1 },
    { field: 'installations', headerName: 'Installations', flex: 1 },
    { field: 'po_number', headerName: 'PO number', flex: 1 },
    { field: 'po_date', headerName: 'Date de PO', flex: 1 },
    { field: 'start_date', headerName: 'Start date of the project', flex: 1 },
    { field: 'estimated_completion_date', headerName: 'Estimated date of completion', flex: 1 },
    { field: 'initial_value_po', headerName: 'Initial Value of project/PO', flex: 1, type: 'number' },
    { field: 'final_value_po_currency', headerName: 'Final Value of project in currency of PO', flex: 1, type: 'number' },
    { field: 'po_currency', headerName: 'Currency', flex: 1 },
    { field: 'exchange_rate', headerName: 'Foreign exchange rate', flex: 1, type: 'number' },
    { field: 'final_value_local_currency', headerName: 'Final Value of project / PO - in local currency', flex: 1, type: 'number' },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'cancelled_amount_local', headerName: 'Cancelled / Blocked Amount - in local currency', flex: 1, type: 'number' },
    { field: 'cancel_reason', headerName: 'Reason for Cancelled / Blocked PO', flex: 1 },
    { field: 'estimated_margin', headerName: 'Estimated Gross margin', flex: 1, type: 'number' },
    { field: 'estimated_profit', headerName: 'Estimated profit', flex: 1, type: 'number' },
    { field: 'estimated_costs', headerName: 'Estimated costs', flex: 1, type: 'number' },
    { field: 'degree_of_completion', headerName: 'Degree of completion', flex: 1, type: 'number' },
    { field: 'revenue_completion', headerName: 'Revenue based on the degree of completion', flex: 1, type: 'number' },
    { field: 'fae', headerName: 'FAE - Invoices to be issued', flex: 1, type: 'number' },
    { field: 'pca', headerName: 'PCA - Deferred income', flex: 1, type: 'number' },
    { field: 'provision_for_losses', headerName: 'Provision for losses', flex: 1, type: 'number' },
    { field: 'invoices_local_ex_vat', headerName: 'Invoices issued (local currency - Excl. VAT)', flex: 1, type: 'number' },
    { field: 'invoices_po_ex_vat', headerName: 'Invoices issued (PO currency - Excl. VAT)', flex: 1, type: 'number' },
    { field: 'invoice_currency', headerName: 'Currency of PO', flex: 1 },
    { field: 'material_costs', headerName: 'Material costs', flex: 1, type: 'number' },
    { field: 'subcontractors_costs', headerName: 'Subcontractors', flex: 1, type: 'number' },
    { field: 'indirect_costs', headerName: 'Payroll and indirect costs', flex: 1, type: 'number' },
    { field: 'total_expenses', headerName: 'Total expenses', flex: 1, type: 'number' },
    { field: 'deferred_cost', headerName: 'Deferred Cost', flex: 1, type: 'number' },
  ];

  const columns = showAllColumns
    ? allColumns
    : allColumns.filter((col) => !isColumnEmpty(col.field));

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'WIP');
    XLSX.writeFile(workbook, 'wip_export.xlsx');
  };

  return (
    <Card className="p-4 shadow-lg border border-gray-200">
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <Input
            type="text"
            placeholder="🔍 Rechercher par projet, client ou BL..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-96"
          />
          <div className="flex gap-2">
            <Button onClick={handleExport} className="gap-2">
              <FileSpreadsheet size={16} /> Export Excel
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowAllColumns((prev) => !prev)}
              className="gap-2"
            >
              {showAllColumns ? (
                <>
                  <EyeOff size={16} /> Masquer colonnes vides
                </>
              ) : (
                <>
                  <Eye size={16} /> Afficher toutes les colonnes
                </>
              )}
            </Button>
          </div>
        </div>

        <div style={{ height: 650, width: '100%' }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            slots={{ toolbar: GridToolbar }}
            pageSizeOptions={[10, 20, 50]}
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f3f4f6',
                color: '#1f2937',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                borderBottom: '1px solid #e5e7eb',
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                whiteSpace: 'normal',
                lineHeight: '1.4',
              },
              '& .MuiDataGrid-cell': {
                fontSize: '0.85rem',
              }
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default WIPReviewTable;
