import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../Common/Card.jsx';

export const GivenVsReceived = ({ companies = [] }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (companies.length > 0) {
      setData(
        companies.sort((a, b) => b.balance - a.balance).slice(0, 8).map(c => ({
          name: c.companyName.substring(0, 12),
          given: c.totalGiven,
          received: c.totalReceived,
        }))
      );
    }
  }, [companies]);

  return (
    <Card className="p-6">
      <h3 className="text-base font-bold text-gray-900 mb-6">Given vs Received (Top 8)</h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={v => `₹${v.toLocaleString('en-IN')}`} contentStyle={{ fontSize: 12 }} />
            <Legend />
            <Bar dataKey="given" fill="#1d4ed8" name="Given" radius={[3,3,0,0]} />
            <Bar dataKey="received" fill="#15803d" name="Received" radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : <p className="text-center text-gray-400 py-8">No data available</p>}
    </Card>
  );
};

export default GivenVsReceived;