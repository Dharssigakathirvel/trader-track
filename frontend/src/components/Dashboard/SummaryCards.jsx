import React from 'react';
import { Users, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import Card from '../Common/Card.jsx';
import { formatCurrency } from '../../utils/formatters.js';

export const SummaryCards = ({ summary = {} }) => {
  const { totalCompanies = 0, totalGiven = 0, totalReceived = 0, pendingBalance = 0 } = summary;

  const stats = [
    { label: 'Total Companies', value: totalCompanies, icon: <Users className="w-5 h-5" />, format: 'number', bg: '#dbeafe', color: '#1d4ed8' },
    { label: 'Total Given',     value: totalGiven,     icon: <TrendingUp className="w-5 h-5" />, format: 'currency', bg: '#dcfce7', color: '#15803d' },
    { label: 'Total Received',  value: totalReceived,  icon: <TrendingDown className="w-5 h-5" />, format: 'currency', bg: '#d1fae5', color: '#065f46' },
    { label: 'Pending Balance', value: pendingBalance, icon: <AlertCircle className="w-5 h-5" />, format: 'currency', bg: '#fef3c7', color: '#b45309' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, i) => (
        <Card key={i} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stat.format === 'currency' ? formatCurrency(stat.value) : stat.value.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: stat.bg, color: stat.color }}>
              {stat.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SummaryCards;