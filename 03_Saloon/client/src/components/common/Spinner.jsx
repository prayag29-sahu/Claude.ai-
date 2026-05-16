import React from "react";
export default function Spinner({ size = "md" }) {
  const sizes = { sm: "w-5 h-5", md: "w-10 h-10", lg: "w-16 h-16" };
  return (
    <div className="flex items-center justify-center py-12">
      <div className={`${sizes[size]} border-2 border-dark-600 border-t-gold-500 rounded-full animate-spin`} />
    </div>
  );
}
