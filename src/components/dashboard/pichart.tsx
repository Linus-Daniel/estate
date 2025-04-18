"use client"
import React from 'react';
import {  Pie, Cell, Tooltip, Legend, PieChart } from 'recharts';

const data = [
  { name: 'Vacant', value: 400 },
  { name: 'Occupied', value: 300 },
  { name: 'Total', value: 300 },
];

const COLORS = ['#01a65b', '#dc4b38', '#01c1ef',];

const PieCharts = () => {
  return (
    <PieChart className=' p-10' width={500} height={400} style={{

    }}>
        <Tooltip />
        <Legend />
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
        outerRadius={120}
        fill="#8884d8"
        dataKey="value"
        strokeWidth={2}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  );
};

export default PieCharts;
