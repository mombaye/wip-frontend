// src/pages/DashboardPage.tsx
import Sidebar from "@/components/Sidebar";

const DashboardPage = () => {
  return (
     <div className="flex">
     
      <main className="flex-1 ml-0 lg:ml-64 bg-gray-100 p-6 min-h-screen">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="bg-white shadow-md rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total demandes</h3>
              <p className="text-3xl font-bold text-blue-900">128</p>
            </div>

            <div className="bg-white shadow-md rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">WIP en cours</h3>
              <p className="text-3xl font-bold text-blue-900">42</p>
            </div>

            <div className="bg-white shadow-md rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Validations en attente</h3>
              <p className="text-3xl font-bold text-blue-900">7</p>
            </div>
          </div>
      </main>
      </div>
    
  );
};

export default DashboardPage;
