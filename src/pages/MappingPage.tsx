import { useState } from 'react';
import AccountMappingTab from '@/components/mappings/AccountMappingTab';
import ProjectMappingTab from '@/components/mappings/ProjectMappingTab';
//import ProjectMappingTab from '@/components/mapping/ProjectMappingTab';
//import ReportingAccountMappingTab from '@/components/mapping/ReportingAccountMappingTab';

const tabs = [
  { id: 'account', label: 'Account Mapping' },
  { id: 'project', label: 'Project Mapping' },
  { id: 'reporting', label: 'Reporting Account Mapping' },
];

const MappingPage = () => {
  const [activeTab, setActiveTab] = useState('account');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return <AccountMappingTab />;
      case 'project':
        //return <ProjectMappingTab />;
        return <ProjectMappingTab />
      case 'reporting':
        //return <ReportingAccountMappingTab />;
        return <h1>Ici Epibda</h1>
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <main className="flex-1 ml-0 lg:ml-64 bg-gray-100 p-6 min-h-screen">
            <h1 className="text-2xl font-bold text-blue-900 mb-6">Gestion des Mappings</h1>

            <div className="flex space-x-4 mb-6">
                {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-md font-medium ${
                    activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    {tab.label}
                </button>
                ))}
            </div>

            <div className="bg-white p-4 rounded shadow">{renderTabContent()}</div>
      </main>
      
    </div>
  );
};

export default MappingPage;
