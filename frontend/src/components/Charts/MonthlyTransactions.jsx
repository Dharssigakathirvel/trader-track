import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../Common/Card.jsx';

export const MonthlyTransactions = ({ companies = [] }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Derive monthly totals from company createdAt dates as a proxy
    const monthMap = {};
    companies.forEach(c => {
      const month = new Date(c.createdAt).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
      if (!monthMap[month]) monthMap[month] = { month, given: 0, received: 0 };
      monthMap[month].given += c.totalGiven;
      monthMap[month].received += c.totalReceived;
    });
    setData(Object.values(monthMap).slice(-6));
  }, [companies]);

  return (
    <Card className="p-6">
      <h3 className="text-base font-bold text-gray-900 mb-6">Monthly Overview</h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={v => `₹${v.toLocaleString('en-IN')}`} />
            <Legend />
            <Line type="monotone" dataKey="given" stroke="#1d4ed8" strokeWidth={2} name="Given" dot={{ r: 4 }} />
            <Line type="monotone" dataKey="received" stroke="#15803d" strokeWidth={2} name="Received" dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      ) : <p className="text-center text-gray-400 py-8">No data available</p>}
    </Card>
  );
};

export default MonthlyTransactions;