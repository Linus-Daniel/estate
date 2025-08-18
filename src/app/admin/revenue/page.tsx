import RevenueTable from '@/components/RevenueTable';
import RevenueSummary from '@/components/RevenueSummary';
import { fetchTransaction } from '@/lib/Revenue';


export default async function RevenuePage() {
  const transactions = await fetchTransaction()
  console.log(transactions)
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Revenue Management</h1>
        <div className="flex space-x-2">
          <button className="bg-white dark:bg-gray-800 border px-4 py-2 rounded-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Export
          </button>
        </div>
      </div>
      
      <RevenueSummary />
      {/* <RevenueFilters /> */}
      <RevenueTable />
    </div>
  );
}