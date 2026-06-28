import React from 'react';

export const Card = ({ children, className = '', onClick = null, hover = true }) => {
  return (
    <div
      className={`card ${hover ? 'shadow-soft hover:shadow-md' : ''} ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;