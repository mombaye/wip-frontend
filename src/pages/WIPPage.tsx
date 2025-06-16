import { useState } from 'react';

const tabItems = [
  'Summary',
  'WIP',
  'Non WIP',
  'Facturation',
  'WIP Part Etrangere',
  'WIP old',
  'WIP old Clean',
  'Non WIP Clean',
  'Wip Clean',
  'COGS',
  'audit trail',
  'Project & Exchange rate'
];

const WIPPage = () => {
  const [activeTab, setActiveTab] = useState(tabItems[0]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-blue-900">WIP Reporting</h1>

      <div className="border-b border-gray-200">
        <div className="flex gap-4 flex-wrap">
          {tabItems.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-blue-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="text-sm text-gray-600">Contenu de l&apos;onglet <strong>{activeTab}</strong> ici...</div>
      </div>
    </div>
  );
};

export default WIPPage;
