"use client"
import Card from "@/components/dashboard/Card";
import LineCharts from "@/components/dashboard/lineChart";
import PieCharts from "@/components/dashboard/pichart";
import { details } from "@/constant";
import { motion } from "framer-motion";

function DashBoard() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {details.map((item, index) => (
          <Card key={index} item={item} index={index} />
        ))}
      </motion.section>

      {/* Charts Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div className="bg-white rounded-xl shadow-sm p-4">
          <LineCharts />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <PieCharts />
        </div>
      </motion.section>

      {/* Recent Activity (Example additional section) */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 bg-white rounded-xl shadow-sm p-4"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-start pb-4 border-b border-gray-100 last:border-0">
              <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-800">New property added</p>
                <p className="text-sm text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>
    </main>
  );
}

export default DashBoard;