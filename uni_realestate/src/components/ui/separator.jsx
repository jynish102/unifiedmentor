import React from "react";

export function Separator({ className = "", orientation = "horizontal" }) {
  return orientation === "vertical" ? (
    <div className={`w-px h-full bg-gray-200 ${className}`} />
  ) : (
    <div className={`w-full h-px bg-gray-200 ${className}`} />
  );
}
