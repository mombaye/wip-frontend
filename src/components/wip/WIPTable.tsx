import React, { useEffect, useState } from "react";
import { fetchWIP, importWIPFile, updateWIP } from "@/services/wipService";
import { WIPRow } from "@/types/types";
import { toast } from "react-toastify";
import { Save, RefreshCw, Upload, Loader2 } from "lucide-react";
import { MONTHS, YEARS } from "@/utils/constants";
import { wipColumnGroups, wipColumnsFlat, editableFields } from "@/utils/columnsWIP";

const ROWS_PER_PAGE = 50;

export default function WIPTable() {
  const [rows, setRows] = useState<WIPRow[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("Jan");
  const [selectedYear, setSelectedYear] = useState(YEARS[YEARS.length - 2].value);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [dirtyRows, setDirtyRows] = useState<Record<string, Partial<WIPRow>>>({});
  const [importing, setImporting] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetchWIP(selectedMonth, selectedYear)
      .then(data => {
        setRows(data);
        setPage(1);
      })
      .finally(() => setLoading(false));
  }, [selectedMonth, selectedYear]);

  const handleCellEdit = (rowIdx: number, field: string, value: any) => {
    const updatedRows = [...rows];
    updatedRows[rowIdx] = { ...updatedRows[rowIdx], [field]: value };
    setRows(updatedRows);
    setDirtyRows((prev) => ({
      ...prev,
      [updatedRows[rowIdx].project_code]: {
        ...(prev[updatedRows[rowIdx].project_code] || {}),
        [field]: value,
      }
    }));
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      await importWIPFile(file, selectedMonth, selectedYear);
      toast.success("Fichier importé avec succès !");
      fetchWIP(selectedMonth, selectedYear).then(setRows);
      setDirtyRows({});
    } catch (e) {
      toast.error("Erreur import fichier");
    }
    setImporting(false);
  };

  const handleSave = async () => {
    const updates = Object.entries(dirtyRows).map(([project_code, changes]) => ({
      project_code,
      ...changes,
      month: selectedMonth,
      year: selectedYear
    }));
    if (updates.length === 0) return;
    setLoading(true);
    try {
      await updateWIP(updates);
      toast.success("Modifications sauvegardées !");
      setDirtyRows({});
      fetchWIP(selectedMonth, selectedYear).then(setRows);
    } catch (e) {
      toast.error("Erreur lors de la sauvegarde");
    }
    setLoading(false);
  };

  const handleReload = () => {
    setLoading(true);
    fetchWIP(selectedMonth, selectedYear)
      .then(data => setRows(data))
      .finally(() => setLoading(false));
    setDirtyRows({});
    setPage(1);
  };

  // Filtrage
  const filteredRows = !search
    ? rows
    : rows.filter(
      r =>
        r.project_code?.toLowerCase().includes(search.toLowerCase()) ||
        (r.client || "").toLowerCase().includes(search.toLowerCase()) ||
        (r.status || "").toLowerCase().includes(search.toLowerCase())
    );

  // Pagination
  const pageCount = Math.ceil(filteredRows.length / ROWS_PER_PAGE);
  const paginatedRows = filteredRows.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  // Calcul sticky left pour chaque colonne
  const stickyLefts: (number | null)[] = [];
  let total = 0;
  for (let i = 0; i < wipColumnsFlat.length; i++) {
    if (wipColumnsFlat[i].sticky) {
      stickyLefts.push(total);
      total += 140;
    } else {
      stickyLefts.push(null);
    }
  }

  return (
    <div className="relative bg-white rounded-xl shadow-lg overflow-auto max-w-[99vw]">
      {/* Header/filter bar */}
      <div className="flex flex-wrap gap-2 items-center p-4 border-b sticky top-0 bg-white z-20">
        <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}
          className="border rounded px-3 py-1 text-sm">
          {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
        <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}
          className="border rounded px-3 py-1 text-sm">
          {YEARS.map(y => <option key={y.value} value={y.value}>{y.label}</option>)}
        </select>
        <input type="text" placeholder="Recherche..." value={search} onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-1 text-sm min-w-[160px]" />
        <button onClick={handleReload} className="ml-2 px-3 py-1 bg-gray-100 hover:bg-blue-50 rounded border flex items-center gap-1 text-sm">
          <RefreshCw size={16}/> Recharger
        </button>
        <label className="ml-2 flex items-center gap-1 cursor-pointer bg-gray-100 hover:bg-blue-50 border rounded px-3 py-1 text-sm">
          <Upload size={16}/> Importer
          <input type="file" className="hidden" accept=".xlsx,.csv" onChange={handleImport} disabled={importing} />
        </label>
        <button onClick={handleSave} className="ml-2 px-3 py-1 bg-blue-700 text-white hover:bg-blue-900 rounded flex items-center gap-1 text-sm disabled:opacity-60" disabled={Object.keys(dirtyRows).length === 0 || loading}>
          <Save size={16}/> Sauvegarder
        </button>
        {loading || importing ? <Loader2 className="animate-spin text-blue-700 ml-3" size={22}/> : null}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs border-separate border-spacing-y-1">
          {/* Header groupes */}
          <thead>
            {/* Header 1 (groupes Excel style) */}
            <tr>
              {wipColumnGroups.map((grp, idx) =>
                <th key={grp.group + idx}
                    colSpan={grp.columns.length}
                    className={`font-bold text-center border-x border-white ${grp.group === "Automatic" ? "bg-gray-100 text-gray-800" : "bg-blue-50 text-blue-900"}`}>
                  {grp.group}
                </th>
              )}
            </tr>
            {/* Header 2 (colonnes flat) */}
            <tr>
              {wipColumnsFlat.map((col, i) => (
                <th key={col.field}
                  className={`px-3 py-2 text-left font-bold ${col.sticky ? "bg-blue-900 text-white sticky left-0 z-10" : "bg-blue-50"} whitespace-nowrap`}
                  style={col.sticky && typeof stickyLefts[i] === "number" ? { left: stickyLefts[i], minWidth: 140 } : { minWidth: 140 }}>
                  {col.label}
                  {col.calculated && (
                    <span className="ml-1 text-gray-400" title="Champ calculé automatiquement">🛠️</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={wipColumnsFlat.length} className="py-8 text-center text-blue-700">Chargement des WIP...</td></tr>
            ) : paginatedRows.length === 0 ? (
              <tr><td colSpan={wipColumnsFlat.length} className="py-8 text-center text-gray-400">Aucune donnée</td></tr>
            ) : (
              paginatedRows.map((row, rowIdx) => (
                <tr key={row.project_code || rowIdx}
                  className={`${rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition`}>
                  {wipColumnsFlat.map((col, colIdx) => (
                    <td key={col.field}
                        className={`px-3 py-1 ${col.sticky ? "bg-white sticky left-0 z-10" : ""} ${col.calculated ? "bg-gray-200 text-gray-700" : ""}`}
                        style={col.sticky && typeof stickyLefts[colIdx] === "number" ? { left: stickyLefts[colIdx], minWidth: 140 } : { minWidth: 140 }}>
                      {editableFields.includes(col.field) && !col.calculated ? (
                        <input
                          value={(row as any)[col.field] ?? ""}
                          onChange={e => handleCellEdit((page - 1) * ROWS_PER_PAGE + rowIdx, col.field, e.target.value)}
                          className="bg-white border border-gray-200 rounded px-1 py-1 w-full text-xs"
                          disabled={loading}
                        />
                      ) : (
                        <span>{(row as any)[col.field] ?? "-"}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between py-3 px-4 bg-gray-50 border-t sticky bottom-0">
        <div className="text-xs text-gray-600">
          {filteredRows.length > 0
            ? `Page ${page} / ${pageCount} (Total: ${filteredRows.length} lignes)`
            : "Aucune donnée"}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50">&lt;</button>
          <input
            type="number"
            min={1}
            max={pageCount}
            value={page}
            onChange={e => setPage(Math.max(1, Math.min(pageCount, Number(e.target.value) || 1)))}
            className="w-10 px-1 border border-gray-300 rounded text-center text-xs"
          />
          <button onClick={() => setPage(p => Math.min(pageCount, p + 1))} disabled={page >= pageCount} className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50">&gt;</button>
        </div>
      </div>
    </div>
  );
}
