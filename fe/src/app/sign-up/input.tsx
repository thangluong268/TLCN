import React from "react";
interface FrameFormInitProps {
  children: React.ReactNode;
  label: string;
}
function Input({ children, label }: FrameFormInitProps) {
  return (
    <div className="w-full mt-4">
      <label className="block text-sm font-medium text-black">{label}</label>
      {children}
    </div>
  );
}

export default Input;
