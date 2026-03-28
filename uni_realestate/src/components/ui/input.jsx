export function Input({ className = "", type = "text", ...props }) {
  return (
    <input
      type={type}
      {...props}
      className={`border rounded px-3 py-2 outline-none ${className}`}
    />
  );
}
