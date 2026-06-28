import { format, parseISO, formatDistanceToNow } from 'date-fns';

export const formatDate = (date) => {
  try {
    const d = typeof date === 'string' ? parseISO(date) : new Date(date);
    return format(d, 'MMM dd, yyyy');
  } catch {
    return 'Invalid date';
  }
};

export const formatDateTime = (date) => {
  try {
    const d = typeof date === 'string' ? parseISO(date) : new Date(date);
    return format(d, 'MMM dd, yyyy HH:mm');
  } catch {
    return 'Invalid date';
  }
};

export const formatRelativeTime = (date) => {
  try {
    const d = typeof date === 'string' ? parseISO(date) : new Date(date);
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return 'Unknown';
  }
};

export const formatCurrency = (amount, currency = 'INR') => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2
  });
  return formatter.format(amount);
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-IN').format(num);
};

export const formatPercentage = (percentage) => {
  return `${(percentage || 0).toFixed(2)}%`;
};

export const calculateBalancePercentage = (received, given) => {
  if (given === 0) return 0;
  return (received / given) * 100;
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'Completed': return 'bg-green-100 text-green-800';
    case 'Partial':   return 'bg-blue-100 text-blue-800';
    case 'Pending':   return 'bg-yellow-100 text-yellow-800';
    default:          return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Completed': return 'badge-completed';
    case 'Partial':   return 'badge-partial';
    case 'Pending':   return 'badge-pending';
    default:          return 'badge';
  }
};

export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const validatePhone = (phone) => /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(phone);
export const validateAmount = (amount) => { const n = parseFloat(amount); return !isNaN(n) && n >= 0; };

export default {
  formatDate, formatDateTime, formatRelativeTime, formatCurrency,
  formatNumber, formatPercentage, calculateBalancePercentage,
  getStatusColor, getStatusBadgeClass, validateEmail, validatePhone, validateAmount
};