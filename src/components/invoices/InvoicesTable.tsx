import React, { useEffect, useState } from "react";
import { fetchInvoices } from "@/services/invoiceService"; // Assure-toi que ce service est bien défini
// Typage
interface InvoiceRow {
  project: string;
  status: string;
  amount_po_currency_opening: number;
  amount_local_currency_opening: number;
  current_invoice: number;
  accumulated_po: number;
  accumulated_local: number;
}
interface InvoiceApiRow {
  project: string;
  month: string;
  year: string;
  category: string; // 'Sales'
  currency: string;
  current_invoice: number;
  amount_po_currency: number;
  amount_local_currency: number;
  accumulated: number;
}
const MONTHS = [
  { label: "Jan", value: "Jan" }, { label: "Feb", value: "Feb" }, { label: "Mar", value: "Mar" },
  { label: "Apr", value: "Apr" }, { label: "May", value: "May" }, { label: "Jun", value: "Jun" },
  { label: "Jul", value: "Jul" }, { label: "Aug", value: "Aug" }, { label: "Sep", value: "Sep" },
  { label: "Oct", value: "Oct" }, { label: "Nov", value: "Nov" }, { label: "Dec", value: "Dec" },
];
const startYear = 2023;
const endYear = new Date().getFullYear() + 1;
const YEARS = Array.from(
  { length: endYear - startYear + 1 },
  (_, i) => {
    const y = (startYear + i).toString().slice(-2);
    return { label: `${y}`, value: y };
  }
);

function groupInvoicesRows(data: InvoiceApiRow[]): InvoiceRow[] {
  return data.map(row => ({
    project: row.project,
    status: "", // Ajoute ici si tu as un status
    amount_po_currency_opening: row.amount_po_currency,
    amount_local_currency_opening: row.amount_local_currency,
    current_invoice: row.current_invoice,
    accumulated_po: row.accumulated,
    accumulated_local: row.accumulated, // adapte si tu as les 2
  }));
}

function getPreviousMonthYear(month: string, year: string) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let idx = months.indexOf(month);
  let prevMonth: string;
  let prevYear: string = year;
  if (idx === -1) {
    prevMonth = month;
  } else if (idx === 0) {
    prevMonth = "Dec";
    // Prend l'année précédente (attention au format "24" → "23")
    let yearNum = parseInt(year, 10);
    prevYear = (yearNum - 1).toString().padStart(2, "0");
  } else {
    prevMonth = months[idx - 1];
  }
  return `${prevMonth}-${prevYear}`;
}



export default function InvoicesTable() {
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[2].value); // Mar
  const [selectedYear, setSelectedYear] = useState(YEARS[1].value);    // '24
  const [rows, setRows] = useState<InvoiceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    fetchInvoices(selectedMonth, selectedYear)
      .then((data: InvoiceApiRow[]) => setRows(groupInvoicesRows(data)))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [selectedMonth, selectedYear]);

  const filteredRows = !search
    ? rows
    : rows.filter(r => r.project.toLowerCase().includes(search.trim().toLowerCase()));

  // Libellés dynamiques
  const billedLabel = `${selectedMonth}-${selectedYear}`;
  const accumulatedLabel = `Accumulated as at ${selectedMonth}-${selectedYear}`;
  const prevLabel = getPreviousMonthYear(selectedMonth, selectedYear);
  // → exemple : "Feb-24" si tu es sur Mar-24
  const accumulatedFromLabel = `Accumulated as from Jul-18 to ${prevLabel}`;

  return (
    <div className="rounded-2xl shadow-lg bg-white p-4 w-full max-w-[99vw] overflow-auto">
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            className="border border-gray-300 rounded px-2 py-2 text-sm"
            placeholder="Search project..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ minWidth: 160 }}
          />
          <select
            className="border border-gray-300 p-2 rounded bg-gray-50 text-sm"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
          >
            {MONTHS.map(m => (
              <option value={m.value} key={m.value}>{m.label}</option>
            ))}
          </select>
          <select
            className="border border-gray-300 p-2 rounded bg-gray-50 text-sm"
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
          >
            {YEARS.map(y => (
              <option value={y.value} key={y.value}>{y.label}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-700 text-white rounded px-4 py-2 font-semibold hover:bg-blue-900 transition">Importer</button>
          <button className="bg-green-600 text-white rounded px-4 py-2 font-semibold hover:bg-green-700 transition">Exporter</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-12 text-blue-700 animate-pulse">Chargement des factures...</div>
        ) : (
          <table className="min-w-full text-xs text-center border-separate border-spacing-y-1">
            <thead>
              <tr>
                <th className="bg-yellow-900 text-white rounded-l-xl" rowSpan={2}>Project</th>
                <th className="bg-yellow-900 text-white" rowSpan={2}>Stat</th>
                <th className="bg-gray-300 text-gray-800 font-bold" colSpan={2}>{accumulatedFromLabel}</th>
                <th className="bg-yellow-100 text-yellow-900 font-bold border-x-2 border-white" colSpan={1}>Billed (Facturation)</th>
                <th className="bg-gray-300 text-gray-800 font-bold" colSpan={2}>{accumulatedLabel}</th>
              </tr>
              <tr>
                <th className="bg-gray-50 text-gray-700 font-medium">Amount in PO currency</th>
                <th className="bg-gray-50 text-gray-700 font-medium">Amount in Local currency</th>
                <th className="bg-yellow-50 text-yellow-900 font-medium">{billedLabel} <br />(Amount in PO currency)</th>
                <th className="bg-gray-50 text-gray-700 font-medium">Amount in PO currency</th>
                <th className="bg-gray-50 text-gray-700 font-medium">Amount in Local currency</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-gray-400 py-8">Aucune donnée pour ce mois/année.</td>
                </tr>
              ) : (
                filteredRows.map((row, idx) => (
                  <tr
                    key={row.project}
                    className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-yellow-50 transition`}
                  >
                    <td className="rounded-l-xl font-semibold">{row.project}</td>
                    <td>{row.status}</td>
                    <td>{row.amount_po_currency_opening?.toLocaleString("fr-FR")}</td>
                    <td>{row.amount_local_currency_opening?.toLocaleString("fr-FR")}</td>
                    <td>{row.current_invoice?.toLocaleString("fr-FR")}</td>
                    <td>{row.accumulated_po?.toLocaleString("fr-FR")}</td>
                    <td>{row.accumulated_local?.toLocaleString("fr-FR")}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
