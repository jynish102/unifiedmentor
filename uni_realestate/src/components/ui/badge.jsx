export function Badge({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
}
