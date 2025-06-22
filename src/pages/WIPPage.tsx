import { useState } from 'react';
import CogsTable from '@/components/cogs/CogsTable';
import InvoicesTable from '@/components/invoices/InvoicesTable';

import WIPTable from '@/components/wip/WIPTable';

const tabItems = [
  'Summary',
  'WIP',
  'Non WIP',
  'COGS',
  'Facturation',
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

      {activeTab === 'COGS' ? (
        <CogsTable />
      ) : activeTab === 'Facturation' ? (
        <InvoicesTable />
      ) : activeTab === 'WIP' ? (
        <WIPTable />
      ) : (
        <div className="text-sm text-gray-600">
          Contenu de l&apos;onglet <strong>{activeTab}</strong> ici...
        </div>
      )}
    </div>
  );
};

export default WIPPage;
