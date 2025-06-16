import React from 'react';

const CogsSection = ({ cogsData }: { cogsData: Record<string, any> }) => {
  console.log(cogsData)
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-blue-900">📊 Résumé des COGS générés</h2>
      {Object.entries(cogsData).map(([month, result]) => (
        <div key={month} className="bg-blue-50 border border-blue-200 rounded p-4 shadow-sm">
          <h3 className="text-md font-bold text-blue-800 mb-2">Mois : {month}</h3>
          {result.cogs && result.cogs.length > 0 ? (
            <div className="overflow-auto">
              <table className="text-sm w-full border-collapse">
                <thead>
                  <tr className="bg-blue-100">
                    {Object.keys(result.cogs[0]).map((key) => (
                      <th key={key} className="border px-3 py-1 text-left">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.cogs.map((row: any, i: number) => (
                    <tr key={i} className="bg-white even:bg-blue-50">
                      {Object.values(row).map((val, j) => (
                        <td key={j} className="border px-3 py-1">{String(val)}</td>

                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-600">Aucune ligne COGS générée pour ce mois.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default CogsSection;
