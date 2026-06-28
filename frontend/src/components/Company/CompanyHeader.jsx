import React from 'react';
import StatusBadge from '../Common/StatusBadge.jsx';

export const CompanyHeader = ({ company }) => {
  if (!company) return null;
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">{company.companyName}</h1>
      <div className="mt-2"><StatusBadge status={company.status} /></div>
    </div>
  );
};

export default CompanyHeader;