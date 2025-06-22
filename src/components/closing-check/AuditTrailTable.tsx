import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Loader2, FileDown } from "lucide-react";
import { fetchAuditTrail } from "@/services/closingCheckService";
import type { AuditTrailRow } from "@/types/auditTrail";
import * as XLSX from "xlsx";

type Column<T> = {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
};

const columns: Column<AuditTrailRow>[] = [
  { key: "created_at", label: "Date création", render: v => dayjs(v).format("DD/MM/YYYY HH:mm") },
  { key: "account_desc", label: "Description Compte" },
  { key: "tr_code", label: "Code Tr" },
  { key: "description", label: "Description" },
  { key: "project", label: "Projet" },
  { key: "user", label: "Utilisateur" },
  { key: "debit", label: "Débit" },
  { key: "credit", label: "Crédit" },
  { key: "net", label: "Net" },
  { key: "country_report", label: "Pays report" },
  { key: "bl_category", label: "Catégorie BL" },
  { key: "month", label: "Mois" },
  { key: "year", label: "Année" },
  { key: "project_margin", label: "Marge Projet" },
  { key: "talentia_account", label: "Compte Talentia" },
  { key: "talentia_reporting", label: "Reporting Talentia" },
  { key: "ebitda", label: "EBITDA" },
  { key: "category", label: "Catégorie" },
  { key: "final_client", label: "Client Final" },
  { key: "country_of_project", label: "Pays Projet" },
  { key: "country_code", label: "Code Pays" },
  { key: "talentia_code", label: "Code Talentia" },
];

const PAGE_SIZE = 20;
const getDefaultStart = () => dayjs().startOf("year").format("YYYY-MM-DD");
const getDefaultEnd = () => dayjs().format("YYYY-MM-DD");

export default function AuditTrailTable() {
  const [rows, setRows] = useState<AuditTrailRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateStart, setDateStart] = useState(getDefaultStart());
  const [dateEnd, setDateEnd] = useState(getDefaultEnd());
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Recherche + pagination
  const filteredRows = rows.filter((row) =>
    search === "" ||
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  const paginatedRows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageCount = Math.ceil(filteredRows.length / PAGE_SIZE);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data: AuditTrailRow[] = await fetchAuditTrail(dateStart, dateEnd);
        setRows(data);
        setPage(1);
      } catch (e) {
        // TODO: toast error
      }
      setLoading(false);
    };
    fetchData();
  }, [dateStart, dateEnd]);

  // Export Excel
  const handleExportExcel = () => {
    const exportRows = filteredRows.map(row => {
      const rowObj: any = {};
      columns.forEach(col => {
        rowObj[col.label] = col.render
          ? col.render(row[col.key], row)
          : row[col.key] ?? "";
      });
      return rowObj;
    });
    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Audit Trail");
    XLSX.writeFile(workbook, `audit_trail_${dateStart}_to_${dateEnd}.xlsx`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row gap-4 md:items-end mb-4">
        <div>
          <label className="block text-xs font-semibold mb-1 text-gray-700">Début</label>
          <input
            type="date"
            value={dateStart}
            max={dateEnd}
            onChange={(e) => setDateStart(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 text-gray-700">Fin</label>
          <input
            type="date"
            value={dateEnd}
            min={dateStart}
            max={getDefaultEnd()}
            onChange={(e) => setDateEnd(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-semibold mb-1 text-gray-700">Recherche</label>
          <input
            type="text"
            placeholder="Rechercher…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-xl px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
        <button
          onClick={handleExportExcel}
          className="h-10 mt-6 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
        >
          <FileDown size={18} />
          Export Excel
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-auto rounded-xl border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50 sticky top-0 z-10">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="px-4 py-3 text-left text-xs font-bold text-blue-900 uppercase tracking-wider whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-6 text-center">
                  <Loader2 className="mx-auto animate-spin text-blue-500" size={32} />
                </td>
              </tr>
            ) : paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-6 text-center text-gray-500">
                  Aucun résultat
                </td>
              </tr>
            ) : (
              paginatedRows.map((row) => (
                <tr key={row.id}>
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className="px-4 py-2 text-sm text-gray-800 whitespace-nowrap border-b"
                    >
                      {col.render
                        ? col.render(row[col.key], row)
                        : row[col.key] ?? ""}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end items-center gap-3 mt-3">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-2 py-1 rounded-lg border text-sm text-blue-700 border-blue-200 disabled:opacity-50"
        >
          Précédent
        </button>
        <span className="text-sm font-medium">
          {page} / {pageCount || 1}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
          disabled={page === pageCount || pageCount === 0}
          className="px-2 py-1 rounded-lg border text-sm text-blue-700 border-blue-200 disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
