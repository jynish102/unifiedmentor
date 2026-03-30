import * as React from "react";

export function Switch({
  checked = false,
  onCheckedChange,
  className = "",
  ...props
}) {
  const [isOn, setIsOn] = React.useState(checked);

  const toggle = () => {
    const newValue = !isOn;
    setIsOn(newValue);
    if (onCheckedChange) {
      onCheckedChange(newValue);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition 
      ${isOn ? "bg-blue-600" : "bg-gray-300"} ${className}`}
      {...props}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition 
        ${isOn ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  );
}
