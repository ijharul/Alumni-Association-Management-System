import React from 'react';

const Input = React.forwardRef(({ 
  className = '', 
  icon: Icon,
  error,
  ...props 
}, ref) => {
  return (
    <div className="w-full relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400 focus-within:text-indigo-600 dark:focus-within:text-purple-400">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      )}
      <input
        ref={ref}
        className={`
          block w-full rounded-lg border-0 py-2.5 shadow-sm ring-1 ring-inset 
          text-gray-800 bg-white dark:text-gray-200 dark:bg-slate-900 
          ${error ? 'ring-red-500 focus:ring-red-500' : 'ring-gray-300 dark:ring-slate-700 focus:ring-indigo-600 dark:focus:ring-purple-500'} 
          focus:ring-2 focus:ring-inset text-sm sm:leading-6 transition-all
          ${Icon ? 'pl-10' : 'pl-3'}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-red-600 font-medium">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
