// src/components/dashboard/RevenueChart.tsx
'use client';

import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { month: 'Jan', revenue: 4000, expenses: 2400 },
  { month: 'Feb', revenue: 3000, expenses: 1398 },
  { month: 'Mar', revenue: 2000, expenses: 9800 },
  { month: 'Apr', revenue: 2780, expenses: 3908 },
  { month: 'May', revenue: 1890, expenses: 4800 },
  { month: 'Jun', revenue: 2390, expenses: 3800 },
  { month: 'Jul', revenue: 3490, expenses: 4300 },
  { month: 'Aug', revenue: 4200, expenses: 2000 },
  { month: 'Sep', revenue: 3800, expenses: 2500 },
  { month: 'Oct', revenue: 5200, expenses: 3000 },
  { month: 'Nov', revenue: 6100, expenses: 3200 },
  { month: 'Dec', revenue: 7300, expenses: 3500 },
];

export default function RevenueChart() {
  const [activeTab, setActiveTab] = useState('monthly');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">Revenue Overview</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-3 py-1 text-sm rounded-md ${
              activeTab === 'monthly'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setActiveTab('quarterly')}
            className={`px-3 py-1 text-sm rounded-md ${
              activeTab === 'quarterly'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Quarterly
          </button>
          <button
            onClick={() => setActiveTab('yearly')}
            className={`px-3 py-1 text-sm rounded-md ${
              activeTab === 'yearly'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Yearly
          </button>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#4f46e5" name="Revenue" />
            <Bar dataKey="expenses" fill="#10b981" name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}