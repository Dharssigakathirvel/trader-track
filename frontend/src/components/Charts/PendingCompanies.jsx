import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Card from '../Common/Card.jsx';

const COLORS = ['#15803d', '#1d4ed8', '#b45309', '#065f46', '#1e3a8a', '#92400e'];

export const PendingCompanies = ({ companies = [] }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (companies.length > 0) {
      setData(
        companies.filter(c => c.balance > 0)
          .sort((a, b) => b.balance - a.balance).slice(0, 6)
          .map(c => ({ name: c.companyName, value: parseFloat(c.balance.toFixed(2)) }))
      );
    }
  }, [companies]);

  return (
    <Card className="p-6">
      <h3 className="text-base font-bold text-gray-900 mb-6">Pending Balance Distribution</h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" outerRadius={90}
              label={({ name, percent }) => `${name.substring(0,10)}: ${(percent*100).toFixed(0)}%`}
              labelLine={false} dataKey="value">
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip formatter={v => `₹${v.toLocaleString('en-IN')}`} />
          </PieChart>
        </ResponsiveContainer>
      ) : <p className="text-center text-gray-400 py-8">All payments completed!</p>}
    </Card>
  );
};

export default PendingCompanies;