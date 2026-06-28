export const TRANSACTION_TYPES = {
  GIVEN: 'GIVEN',
  RECEIVED: 'RECEIVED'
};

export const STATUS_TYPES = {
  PENDING: 'Pending',
  PARTIAL: 'Partial',
  COMPLETED: 'Completed'
};

export const FILTER_OPTIONS = [
  { value: 'All', label: 'All Companies' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Partial', label: 'Partial' },
  { value: 'Completed', label: 'Completed' }
];

export const SORT_OPTIONS = [
  { value: '', label: 'Recent' },
  { value: 'highest-pending', label: 'Highest Pending' },
  { value: 'latest-transaction', label: 'Latest Transaction' }
];

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check the form and try again.'
};

export const SUCCESS_MESSAGES = {
  COMPANY_CREATED: 'Company created successfully',
  COMPANY_UPDATED: 'Company updated successfully',
  COMPANY_DELETED: 'Company deleted successfully',
  TRANSACTION_ADDED: 'Transaction added successfully',
  TRANSACTION_DELETED: 'Transaction deleted successfully'
};

export const PAGE_SIZE = 10;

export const CHART_COLORS = {
  primary: '#15803d',
  secondary: '#1d4ed8',
  success: '#16a34a',
  warning: '#d97706',
  danger: '#dc2626',
  info: '#2563eb'
};

export default {
  TRANSACTION_TYPES,
  STATUS_TYPES,
  FILTER_OPTIONS,
  SORT_OPTIONS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PAGE_SIZE,
  CHART_COLORS
};