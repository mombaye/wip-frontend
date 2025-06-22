import React, { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "react-toastify";
import { saveFinalCogs } from "@/services/cogsService";
import { ArrowUp, ArrowDown, Search, Filter } from "lucide-react";

interface CogsEntry {
  project: string;
  category: string;
  opening: number;
  current: number;
  accumulated: number;
}

interface MonthResult {
  cogs: CogsEntry[];
  status?: string;
  saved?: number;
  unsaved?: any[];
  message?: string;
}

interface CogsReviewTableProps {
  cogsData: Record<string, MonthResult>;
  onConfirm?: (month: string) => void;
}

const categories = [
  { key: "raw_materials", label: "Raw Materials" },
  { key: "subcontractor", label: "Subcontractor" },
  { key: "other_cogs", label: "Other COGS" },
] as const;

const valueTypes = [
  { key: "opening", label: "Opening" },
  { key: "current", label: "Current" },
  { key: "accumulated", label: "Accumulated" },
] as const;

function downloadCogsExcel(data: CogsEntry[], month: string) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "COGS");
  XLSX.writeFile(workbook, `cogs_summary_${month}.xlsx`);
}

const getLabel = (key: string, month: string): string => {
  switch (key) {
    case "opening":
      return `Opening as at ${getPreviousMonth(month)}`;
    case "current":
      return `${month}`;
    case "accumulated":
      return `Accumulated as at ${month}`;
    default:
      return key;
  }
};

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

export const CogsReviewTable: React.FC<CogsReviewTableProps> = ({ cogsData }) => {

  // UI state
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sort, setSort] = useState<{ category?: string; valueType?: string; asc: boolean }>({ asc: true });

  // For each month section
  return (
    <div className="space-y-10">
      <h2 className="text-xl font-semibold text-blue-900">📊 Revue des COGS (pré-sauvegarde)</h2>
      {Object.entries(cogsData).map(([month, result]) => {
        // Filter + sort projects
        let projects = Array.from(new Set(result.cogs.map((c) => c.project)));
        if (search) {
          projects = projects.filter((p) =>
            p.toLowerCase().includes(search.toLowerCase())
          );
        }

        // Sorting logic
        if (sort.category && sort.valueType) {
          projects = [...projects].sort((a, b) => {
            const getVal = (p: string) =>
              result.cogs.find(
                (c) => c.project === p && c.category === sort.category
              )?.[sort.valueType as keyof CogsEntry] ?? 0;
            const diff = Number(getVal(a)) - Number(getVal(b));
            return sort.asc ? diff : -diff;
          });
        }

        // Filter cogs entries for rendering
        const renderCategories =
          filterCategory === "all"
            ? categories.map((cat) => cat.key)
            : [filterCategory];

        return (
          <div
            key={month}
            className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md"
          >
            <div className="flex flex-wrap gap-4 items-end justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="text-md font-bold text-blue-800 mr-4">
                  Mois : <span className="underline">{month}</span>
                </span>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  <Input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher un projet"
                    className="max-w-[180px]"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      {filterCategory === "all"
                        ? "Toutes catégories"
                        : categories.find((c) => c.key === filterCategory)?.label}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      onClick={() => setFilterCategory("all")}
                      className="cursor-pointer"
                    >
                      Toutes catégories
                    </DropdownMenuItem>
                    {categories.map((cat) => (
                      <DropdownMenuItem
                        key={cat.key}
                        onClick={() => setFilterCategory(cat.key)}
                        className="cursor-pointer"
                      >
                        {cat.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => downloadCogsExcel(result.cogs, month)}
                >
                  Exporter Excel
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      const allEntries = Object.entries(cogsData).flatMap(
                        ([m, res]) =>
                          res.cogs.map((entry) => ({ ...entry, month: m }))
                      );
                      await saveFinalCogs(allEntries);
                      toast.success(
                        "✅ Tous les COGS ont été sauvegardés avec succès."
                      );
                    } catch (err) {
                      toast.error("❌ Erreur lors de la sauvegarde des COGS.");
                      console.error(err);
                    }
                  }}
                >
                  Sauvegarder
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto rounded-xl border">
              <table className="min-w-[900px] w-full text-xs md:text-sm">
                <thead>
                  <tr className="bg-blue-100 text-gray-900">
                    <th className="border px-3 py-2" rowSpan={2}>Projet</th>
                    <th className="border px-3 py-2" rowSpan={2}>-</th>
                    {/* Catégories en header groupé */}
                    {categories
                      .filter((cat) => renderCategories.includes(cat.key))
                      .map((cat) => (
                        <th
                          key={cat.key}
                          className="border px-3 py-2 text-center"
                          colSpan={valueTypes.length}
                        >
                          {cat.label}
                        </th>
                      ))}
                  </tr>
                  <tr className="bg-blue-50 text-gray-800">
                    {/* Sous-colonnes pour chaque catégorie */}
                    {categories
                      .filter((cat) => renderCategories.includes(cat.key))
                      .flatMap((cat) =>
                        valueTypes.map((val) => (
                          <th
                            key={`${cat.key}_${val.key}`}
                            className="border px-3 py-2 cursor-pointer select-none group"
                            onClick={() =>
                              setSort((prev) => ({
                                category: cat.key,
                                valueType: val.key,
                                asc:
                                  prev.category === cat.key &&
                                  prev.valueType === val.key
                                    ? !prev.asc
                                    : true,
                              }))
                            }
                          >
                            <span className="flex items-center gap-1">
                              {getLabel(val.key, month)}
                              {sort.category === cat.key &&
                                sort.valueType === val.key &&
                                (sort.asc ? (
                                  <ArrowUp className="w-3 h-3 text-blue-600 group-hover:text-blue-800" />
                                ) : (
                                  <ArrowDown className="w-3 h-3 text-blue-600 group-hover:text-blue-800" />
                                ))}
                            </span>
                          </th>
                        ))
                      )}
                  </tr>
                </thead>

                <tbody>
                  {projects.length === 0 && (
                    <tr>
                      <td colSpan={12} className="text-center text-gray-400 py-4">
                        Aucun projet trouvé.
                      </td>
                    </tr>
                  )}
                  {projects.map((project) => (
                    <tr key={project} className="even:bg-blue-50/30">
                      <td className="border px-3 py-2 font-medium">{project}</td>
                      <td className="border px-3 py-2 text-center">-</td>
                      {categories
                        .filter((cat) => renderCategories.includes(cat.key))
                        .map((cat) =>
                          valueTypes.map((val) => {
                            const entry = result.cogs.find(
                              (c) => c.project === project && c.category === cat.key
                            );
                            return (
                              <td
                                key={`${project}_${cat.key}_${val.key}`}
                                className={`border px-3 py-2 text-right ${
                                  val.key === "current"
                                    ? "font-semibold text-blue-900"
                                    : "text-gray-800"
                                }`}
                              >
                                {entry?.[val.key]?.toLocaleString() ?? "-"}
                              </td>
                            );
                          })
                        )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CogsReviewTable;
