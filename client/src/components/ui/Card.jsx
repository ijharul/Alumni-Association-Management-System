import React from 'react';

export const Card = ({ className = '', children, ...props }) => {
  return (
    <div 
      className={`bg-white dark:bg-slate-800 shadow-md dark:shadow-lg border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden transition-colors duration-200 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className = '', children, ...props }) => {
  return (
    <div className={`px-6 py-5 border-b border-gray-100 dark:border-slate-700 transition-colors duration-200 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ className = '', children, ...props }) => {
  return (
    <h3 className={`text-lg leading-6 font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-200 ${className}`} {...props}>
      {children}
    </h3>
  );
};

export const CardContent = ({ className = '', children, ...props }) => {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ className = '', children, ...props }) => {
  return (
    <div className={`px-6 py-4 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-700 transition-colors duration-200 ${className}`} {...props}>
      {children}
    </div>
  );
};
