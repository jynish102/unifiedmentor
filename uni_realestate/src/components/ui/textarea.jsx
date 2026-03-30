import * as React from "react";

export function Textarea({ className = "", rows = 3, ...props }) {
  return (
    <textarea
      rows={rows}
      className={`w-full min-h-[80px] rounded-md border border-gray-300 px-3 py-2 text-sm 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
      disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    />
  );
}
