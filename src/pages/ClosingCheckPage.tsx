import { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
// assure-toi d'avoir un composant Tabs ou adapte ici

const tabItems = [
  { id: 'audit', label: 'Audit trail' },
  { id: 'expense', label: 'Building & General Expense' },
  { id: 'budget', label: 'Budget' },
  { id: 'pl', label: 'P&L' },
];

const ClosingCheckPage = () => {
  const [activeTab, setActiveTab] = useState('audit');

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-blue-900">Closing Check</h1>

      <div className="border-b border-gray-200">
        <div className="flex gap-4">
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-4 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-blue-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'audit' && <div>Contenu de l&apos;onglet Audit trail</div>}
        {activeTab === 'expense' && <div>Contenu de l&apos;onglet Building & General Expense</div>}
        {activeTab === 'budget' && <div>Contenu de l&apos;onglet Budget</div>}
        {activeTab === 'pl' && <div>Contenu de l&apos;onglet P&amp;L</div>}
      </div>
    </div>
  );
};

export default ClosingCheckPage;
