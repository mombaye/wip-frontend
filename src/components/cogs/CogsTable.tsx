import { fetchCogs } from "@/services/cogsService";
import React, { useEffect, useState } from "react";

type COGSCategory = "raw_materials" | "subcontractor" | "other_cogs";

interface COGSRow {
  project: string;
  status: string;
  raw_materials: { opening: number; current: number; accumulated: number };
  subcontractor: { opening: number; current: number; accumulated: number };
  other_cogs: { opening: number; current: number; accumulated: number };
}

interface COGSApiRow {
  project: string;
  month: string;
  year: string;
  category: COGSCategory;
  opening: number;
  current: number;
  accumulated: number;
}

const MONTHS = [
  { label: "Jan", value: "Jan" }, { label: "Feb", value: "Feb" }, { label: "Mar", value: "Mar" },
  { label: "Apr", value: "Apr" }, { label: "May", value: "May" }, { label: "Jun", value: "Jun" },
  { label: "Jul", value: "Jul" }, { label: "Aug", value: "Aug" }, { label: "Sep", value: "Sep" },
  { label: "Oct", value: "Oct" }, { label: "Nov", value: "Nov" }, { label: "Dec", value: "Dec" },
];

const startYear = 2018;
const endYear = new Date().getFullYear() + 1;
const YEARS = Array.from(
  { length: endYear - startYear + 1 },
  (_, i) => {
    const y = (startYear + i).toString().slice(-2);
    return { label: `${y}`, value: y };
  }
);

const columns = [
  {
    group: "Raw Materials (including Customs Duties)",
    groupKey: "raw_materials",
    color: "bg-blue-100 text-blue-900",
  },
  {
    group: "Outsourcing / Subcontractor",
    groupKey: "subcontractor",
    color: "bg-teal-100 text-teal-900",
  },
  {
    group: "Other COGS",
    groupKey: "other_cogs",
    color: "bg-orange-100 text-orange-900",
  },
];

function groupCogsRows(data: COGSApiRow[]): COGSRow[] {
  const grouped: Record<string, COGSRow> = {};
  for (const row of data) {
    if (!grouped[row.project]) {
      grouped[row.project] = {
        project: row.project,
        status: "",
        raw_materials: { opening: 0, current: 0, accumulated: 0 },
        subcontractor: { opening: 0, current: 0, accumulated: 0 },
        other_cogs: { opening: 0, current: 0, accumulated: 0 },
      };
    }
    if (["raw_materials", "subcontractor", "other_cogs"].includes(row.category)) {
      // @ts-ignore
      grouped[row.project][row.category] = {
        opening: row.opening,
        current: row.current,
        accumulated: row.accumulated,
      };
    }
  }
  return Object.values(grouped);
}

// Utility pour le mois précédent
function getPreviousMonthYear(month: string, year: string) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let idx = months.indexOf(month);
  let prevMonth: string;
  let prevYear: string = year;
  if (idx === -1) {
    prevMonth = month;
  } else if (idx === 0) {
    prevMonth = "Dec";
    let yearNum = parseInt(year, 10);
    prevYear = (yearNum - 1).toString().padStart(2, "0");
  } else {
    prevMonth = months[idx - 1];
  }
  return `${prevMonth}-${prevYear}`;
}

export default function CogsTable() {
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[2].value);
  const [selectedYear, setSelectedYear] = useState(YEARS[1].value);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<COGSRow[]>([]);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchCogs(selectedMonth, selectedYear)
      .then((data: COGSApiRow[]) => {
        if (!cancelled) setRows(groupCogsRows(data));
      })
      .catch(() => {
        if (!cancelled) setRows([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [selectedMonth, selectedYear]);

  const filteredRows = !search
    ? rows
    : rows.filter(r => r.project.toLowerCase().includes(search.trim().toLowerCase()));

  // Labels dynamiques
  const selectedLabel = `${selectedMonth}-${selectedYear}`;
  const accumulatedLabel = `Accumulated as at ${selectedLabel}`;
  const prevLabel = getPreviousMonthYear(selectedMonth, selectedYear);
  const accumulatedFromLabel = `Accumulated as from Jul-18 to ${prevLabel}`;

  return (
    <div className="rounded-2xl shadow-lg bg-white p-4 w-full max-w-[99vw] overflow-auto">
      {/* Header filtres + search */}
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

      {/* Tableau */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-12 text-blue-700 animate-pulse">Chargement des COGS...</div>
        ) : (
          <table className="min-w-full text-xs text-center border-separate border-spacing-y-1">
            <thead>
              <tr>
                <th className="bg-blue-800 text-white rounded-l-xl" rowSpan={2}>Project</th>
                <th className="bg-blue-800 text-white" rowSpan={2}>Status</th>
                {columns.map((col) => (
                  <th
                    className={`${col.color} font-bold border-x-2 border-white`}
                    colSpan={3}
                    key={col.group}
                  >
                    {col.group}
                  </th>
                ))}
              </tr>
              <tr>
                {columns.map((col) =>
                  ["opening", "current", "accumulated"].map((key) => {
                    let label = "";
                    if (key === "opening") label = accumulatedFromLabel;
                    else if (key === "current") label = selectedLabel;
                    else if (key === "accumulated") label = accumulatedLabel;
                    return (
                      <th className="bg-gray-50 text-gray-700 font-medium" key={col.group + key}>
                        {label}
                      </th>
                    );
                  })
                )}
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-gray-400 py-8">Aucune donnée pour ce mois/année.</td>
                </tr>
              ) : (
                filteredRows.map((row, idx) => (
                  <tr
                    key={row.project}
                    className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition`}
                  >
                    <td className="rounded-l-xl font-semibold">{row.project}</td>
                    <td>{row.status}</td>
                    {columns.map(col =>
                      ["opening", "current", "accumulated"].map(field => (
                        <td key={col.group + field}>
                          {row[col.groupKey as COGSCategory][field as keyof typeof row.raw_materials]?.toLocaleString("fr-FR")}
                        </td>
                      ))
                    )}
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
