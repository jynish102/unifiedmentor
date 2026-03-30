import React, { useState } from "react";

// ROOT
export function Select({ children, value, onValueChange }) {
  const [open, setOpen] = useState(false);

  return React.Children.map(children, (child) =>
    React.cloneElement(child, {
      open,
      setOpen,
      value,
      onValueChange,
    }),
  );
}

// TRIGGER
export function SelectTrigger({ children, open, setOpen }) {
  return (
    <div
      onClick={() => setOpen(!open)}
      className="border rounded-md px-3 py-2 cursor-pointer bg-white text-sm flex justify-between items-center"
    >
      {children}
    </div>
  );
}

// VALUE
export function SelectValue({ value, placeholder }) {
  return (
    <span className="text-sm text-slate-700">
      {value ? value : placeholder}
    </span>
  );
}

// CONTENT (dropdown)
export function SelectContent({ children, open }) {
  if (!open) return null;

  return (
    <div className="border rounded-md mt-1 bg-white shadow-md absolute z-50 w-[180px]">
      {children}
    </div>
  );
}

// ITEM
export function SelectItem({ children, value, onValueChange, setOpen }) {
  return (
    <div
      onClick={() => {
        onValueChange(value);
        setOpen(false);
      }}
      className="px-3 py-2 hover:bg-slate-100 cursor-pointer text-sm"
    >
      {children}
    </div>
  );
}
