// src/components/revenue/RevenueTable.tsx
const transactions = [
    {
      id: 'TXN-001',
      property: 'Modern Downtown Loft',
      client: 'John Smith',
      date: '2023-06-15',
      amount: 4500,
      type: 'Commission',
      status: 'Completed',
    },
    {
      id: 'TXN-002',
      property: 'Suburban Family Home',
      client: 'Sarah Johnson',
      date: '2023-06-14',
      amount: 7500,
      type: 'Commission',
      status: 'Completed',
    },
    {
      id: 'TXN-003',
      property: 'Luxury Waterfront Villa',
      client: 'Michael Brown',
      date: '2023-06-12',
      amount: 25000,
      type: 'Commission',
      status: 'Completed',
      },
    {
      id: 'TXN-004',
      property: 'City Center Penthouse',
      client: 'Emily Davis',
      date: '2023-06-10',
      amount: 12000,
      type: 'Commission',
      status: 'Pending',
    },
    {
      id: 'TXN-005',
      property: 'Mountain View Cabin',
      client: 'David Wilson',
      date: '2023-06-08',
      amount: 3500,
      type: 'Commission',
      status: 'Pending',
    },
    {
      id: 'TXN-006',
      property: 'Historic Townhouse',
      client: 'Jessica Taylor',
      date: '2023-06-05',
      amount: 6500,
      type: 'Commission',
      status: 'Refunded',
    },
  ];
  
  export default function RevenueTable() {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Property
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Client
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((txn) => (
                <tr key={txn.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                    {txn.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {txn.property}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {txn.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {txn.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    ${txn.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {txn.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      txn.status === 'Completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : txn.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }