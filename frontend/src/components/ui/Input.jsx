import React from "react";

const Input = React.forwardRef(({ label, className = "", ...props }, ref) => (
  <div className="w-full">
    {label && <label className="block mb-1 text-sm font-medium text-gray-700">{label}</label>}
    <input
      ref={ref}
      className={`w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
      {...props}
    />
  </div>
));

export default Input;
