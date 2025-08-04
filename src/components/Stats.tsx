// src/components/dashboard/DashboardStats.tsx
import { DollarSign, Home, Users, BarChart } from 'lucide-react';

export default  function DashboardStats({total,users,properties}:{total:number|undefined,
  users:number|undefined,
  properties:number | undefined}
) {
  
  const stats = [
    { 
      title: 'Total Revenue', 
      value: Number(total).toString(), 
      change: '+20.1% from last month', 
      icon: DollarSign,
      color: 'text-green-500'
    },
    { 
      title: 'Properties', 
      value: properties?.toString(), 
      change: '+18.1% from last month', 
      icon: Home,
      color: 'text-blue-500'
    },
    { 
      title: 'Active Users', 
      value: users?.toString(), 
      change: '+12% from last month', 
      icon: Users,
      color: 'text-purple-500'
    },
    { 
      title: 'Conversion Rate', 
      value: '24.3%', 
      change: '+2.6% from last month', 
      icon: BarChart,
      color: 'text-orange-500'
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="bg-white dark:bg-gray-800 rounded-xl border p-6 shadow-sm"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
              <h2 className="text-2xl font-bold mt-1">{stat.value}</h2>
            </div>
            <div className={`p-3 rounded-lg ${stat.color.replace('text', 'bg')}/10`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
          <p className="text-xs mt-3 text-gray-500 dark:text-gray-400">{stat.change}</p>
        </div>
      ))}
    </div>
  );
}