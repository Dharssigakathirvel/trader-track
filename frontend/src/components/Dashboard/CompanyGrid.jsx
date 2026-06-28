import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import Card from '../Common/Card.jsx';
import StatusBadge from '../Common/StatusBadge.jsx';
import { formatCurrency, calculateBalancePercentage } from '../../utils/formatters.js';

export const CompanyGrid = ({ companies = [], loading = false }) => {
  const navigate = useNavigate();

  if (loading) return <div className="text-center py-12"><p className="text-gray-400">Loading companies...</p></div>;
  if (!companies || companies.length === 0) return (
    <div className="text-center py-12">
      <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-400">No companies found. Create one to get started.</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {companies.map(company => {
        const percentage = calculateBalancePercentage(company.totalReceived, company.totalGiven);
        return (
          <Card key={company._id} className="p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(`/company/${company._id}`)}>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900 flex-1 pr-2">{company.companyName}</h3>
              <StatusBadge status={company.status} />
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{percentage.toFixed(0)}% received</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="progress-bar h-2" style={{ width: `${Math.min(percentage, 100)}%` }} />
              </div>
            </div>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Given</span>
                <span className="font-semibold text-gray-900">{formatCurrency(company.totalGiven)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Received</span>
                <span className="font-semibold text-green-700">{formatCurrency(company.totalReceived)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-500 font-medium">Pending</span>
                <span className="font-bold text-orange-600">{formatCurrency(company.balance)}</span>
              </div>
            </div>

            <button className="w-full py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ background: '#f0fdf4', color: '#15803d' }}
              onMouseEnter={e => e.target.style.background = '#dcfce7'}
              onMouseLeave={e => e.target.style.background = '#f0fdf4'}>
              View Details →
            </button>
          </Card>
        );
      })}
    </div>
  );
};

export default CompanyGrid;