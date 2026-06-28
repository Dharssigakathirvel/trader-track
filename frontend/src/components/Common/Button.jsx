import React from 'react';

export const Button = ({ children, variant = 'primary', size = 'md', loading = false, disabled = false, className = '', ...props }) => {
  const base = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors';
  const variants = {
    primary:   'text-white disabled:opacity-50',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50',
    outline:   'border-2 border-green-700 text-green-700 hover:bg-green-50 disabled:opacity-40',
    danger:    'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50',
    success:   'bg-green-600 text-white hover:bg-green-700 disabled:opacity-50',
  };
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2', lg: 'px-6 py-3 text-lg' };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      style={variant === 'primary' ? { background: disabled || loading ? '#86efac' : '#15803d' } : {}}
      onMouseEnter={e => { if (variant === 'primary' && !disabled && !loading) e.currentTarget.style.background = '#14532d'; }}
      onMouseLeave={e => { if (variant === 'primary') e.currentTarget.style.background = '#15803d'; }}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? <><span className="animate-spin mr-2">⟳</span>Loading...</> : children}
    </button>
  );
};

export default Button;