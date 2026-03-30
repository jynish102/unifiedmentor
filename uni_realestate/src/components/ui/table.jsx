export function Table({ children, className = "" }) {
  return <table className={`w-full text-sm ${className}`}>{children}</table>;
}

export function TableHeader({ children }) {
  return <thead className="border-b bg-slate-50">{children}</thead>;
}

export function TableBody({ children }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({ children }) {
  return <tr className="border-b hover:bg-slate-50 transition">{children}</tr>;
}

export function TableHead({ children }) {
  return (
    <th className="text-left p-3 font-semibold text-slate-600">{children}</th>
  );
}

export function TableCell({ children }) {
  return <td className="p-3 text-slate-700">{children}</td>;
}
