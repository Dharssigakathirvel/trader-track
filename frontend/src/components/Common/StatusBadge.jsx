import React from 'react';
import { getStatusBadgeClass } from '../../utils/formatters.js';

export const StatusBadge = ({ status }) => {
  if (!status) return null;

  return (
    <span className={`badge ${getStatusBadgeClass(status)}`}>
      {status}
    </span>
  );
};

export default StatusBadge;