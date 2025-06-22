import React, { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUp, ArrowDown, Search } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface InvoiceEntry {
  project: string;
  currency: string; // always "Sales"
  amount_po_currency: number;
  amount_local_currency: number;
  current_local: number;
  current_invoice: number;
  accumulated: number;
}

interface InvoiceReviewTableProps {
  invoiceData: Record<string, InvoiceEntry[]>;
}

const PAGE_SIZE = 100;

function downloadInvoiceExcel(data: InvoiceEntry[], month: string) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");
  XLSX.writeFile(workbook, `invoices_summary_${month}.xlsx`);
}

function getPreviousMonth(currentMonth: string): string {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const [abbr, year] = currentMonth.split("-");
  const idx = months.indexOf(abbr);
  if (idx === -1) return "";
  const prevIdx = idx === 0 ? 11 : idx - 1;
  const newYear = idx === 0 ? `${parseInt(year) - 1}` : year;
  return `${months[prevIdx]}-${newYear}`;
}

const InvoiceReviewTable: React.FC<InvoiceReviewTableProps> = ({ invoiceData }) => {
  const months = Object.keys(invoiceData);
  const [selectedMonth, setSelectedMonth] = useState(months[0] || "");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<{ valueKey?: keyof InvoiceEntry; asc: boolean }>({ asc: true });
  const [page, setPage] = useState(0);

  // Reset page if month changes
  React.useEffect(() => setPage(0), [selectedMonth]);

  // Filter, sort, paginate
  const filteredProjects = useMemo(() => {
    let data = invoiceData[selectedMonth] || [];
    if (search) {
      data = data.filter((row) => row.project?.toLowerCase().includes(search.toLowerCase()));
    }
    if (sort.valueKey) {
      data = [...data].sort((a, b) => {
        const diff = Number(a[sort.valueKey!]) - Number(b[sort.valueKey!]);
        return sort.asc ? diff : -diff;
      });
    }
    return data;
  }, [invoiceData, selectedMonth, search, sort]);

  const paged = useMemo(
    () => filteredProjects.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [filteredProjects, page]
  );

  // Helper for sortable headers
  const SortableTh = ({
    label,
    valueKey
  }: { label: string; valueKey: keyof InvoiceEntry }) => (
    <th
      className="border px-3 py-2 cursor-pointer select-none group"
      onClick={() =>
        setSort((prev) => ({
          valueKey,
          asc: prev.valueKey === valueKey ? !prev.asc : true,
        }))
      }
    >
      <span className="flex items-center gap-1">
        {label}
        {sort.valueKey === valueKey &&
          (sort.asc ? (
            <ArrowUp className="w-3 h-3 text-blue-600 group-hover:text-blue-800" />
          ) : (
            <ArrowDown className="w-3 h-3 text-blue-600 group-hover:text-blue-800" />
          ))}
      </span>
    </th>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4 items-end justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-blue-900 flex-shrink-0">🧾 Facturation (Sales)</h2>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-40 bg-white">
              <SelectValue placeholder="Mois" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 ml-2">
            <Search className="w-4 h-4" />
            <Input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un projet"
              className="max-w-[180px]"
            />
          </div>
        </div>
        <Button variant="outline" onClick={() => downloadInvoiceExcel(filteredProjects, selectedMonth)}>
          Exporter Excel
        </Button>
        <span className="text-xs text-gray-500 ml-2">{filteredProjects.length} lignes</span>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="min-w-[950px] w-full text-xs md:text-sm">
          <thead>
            <tr className="bg-blue-100 text-gray-900">
              <th className="border px-3 py-2" rowSpan={2}>Projet</th>
              <th className="border px-3 py-2" rowSpan={2}>-</th>
              <th className="border px-3 py-2 text-center" colSpan={2}>
                Opening as at {getPreviousMonth(selectedMonth)}
              </th>
              <th className="border px-3 py-2 text-center" colSpan={2}>{selectedMonth}</th>
              <th className="border px-3 py-2 text-center" colSpan={2}>
                Accumulated as at {selectedMonth}
              </th>
            </tr>
            <tr className="bg-blue-50 text-gray-800">
              <SortableTh label="PO Curr." valueKey="amount_po_currency" />
              <SortableTh label="Local Curr." valueKey="amount_local_currency" />
              <SortableTh label="PO Curr." valueKey="current_invoice" />
              <SortableTh label="Local Curr." valueKey="current_invoice" />
              <SortableTh label="PO Curr." valueKey="accumulated" />
              <SortableTh label="Local Curr." valueKey="accumulated" />
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-gray-400 py-3">
                  Aucun projet trouvé.
                </td>
              </tr>
            )}
            {paged.map((row, idx) => (
              <tr key={idx} className="even:bg-blue-50/30">
                <td className="border px-3 py-2 font-medium">{row.project}</td>
                <td className="border px-3 py-2 text-center">-</td>
                <td className="border px-3 py-2 text-right">{row.amount_local_currency}</td>
                <td className="border px-3 py-2 text-right">{row.amount_po_currency}</td>
                <td className="border px-3 py-2 text-right">{row.current_invoice}</td>
                <td className="border px-3 py-2 text-right">{row.current_invoice}</td>
                <td className="border px-3 py-2 text-right">{row.accumulated?.toLocaleString() ?? "-"}</td>
                <td className="border px-3 py-2 text-right">{row.accumulated?.toLocaleString() ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {Math.ceil(filteredProjects.length / PAGE_SIZE) > 1 && (
        <div className="flex justify-center items-center gap-2 mt-2">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
          >
            Précédent
          </Button>
          <span className="text-sm">
            Page {page + 1} / {Math.ceil(filteredProjects.length / PAGE_SIZE)}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={page === Math.ceil(filteredProjects.length / PAGE_SIZE) - 1}
            onClick={() => setPage((p) => Math.min(p + 1, Math.ceil(filteredProjects.length / PAGE_SIZE) - 1))}
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
};

export default InvoiceReviewTable;
