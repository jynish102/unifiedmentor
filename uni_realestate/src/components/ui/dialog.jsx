import * as React from "react";

// Main Dialog Wrapper
export function Dialog({ open, onOpenChange, children }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => onOpenChange(false)} // close on backdrop click
    >
      {children}
    </div>
  );
}

// Trigger Button
export function DialogTrigger({ children, asChild }) {
  return children;
}

// Dialog Box Content
export function DialogContent({ children }) {
  return (
    <div
      className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg"
      onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
    >
      {children}
    </div>
  );
}

// Header Section
export function DialogHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}

// Title
export function DialogTitle({ children }) {
  return <h2 className="text-lg font-semibold">{children}</h2>;
}
