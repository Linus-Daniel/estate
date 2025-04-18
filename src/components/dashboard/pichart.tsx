"use client"
import React from 'react';
import { Pie, Cell, Tooltip, Legend, PieChart, ResponsiveContainer } from 'recharts';
import { motion } from "framer-motion";

const data = [
  { name: 'Vacant', value: 400 },
  { name: 'Occupied', value: 300 },
  { name: 'Total', value: 700 },
];

const COLORS = ['#10b981', '#ef4444', '#3b82f6'];

const PieCharts = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-80 lg:h-96 p-4"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Property Status</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Tooltip 
            formatter={(value, name) => [`${value} units`, name]}
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}
          />
          <Legend 
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: "20px" }}
          />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            innerRadius={50}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default PieCharts;