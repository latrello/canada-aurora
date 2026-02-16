
import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-white rounded-3xl p-4 soft-shadow ${className}`}>
    {children}
  </div>
);

export const Button: React.FC<{ 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
}> = ({ children, onClick, variant = 'primary', className = "" }) => {
  const base = "px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 ";
  const themes = {
    primary: "bg-[#88D8B0] text-white",
    secondary: "bg-white border-2 border-[#E0E5D5] text-[#5D6D7E]",
    danger: "bg-rose-400 text-white"
  };
  return <button onClick={onClick} className={`${base} ${themes[variant]} ${className}`}>{children}</button>;
};

export const SectionTitle: React.FC<{ title: string; icon?: string }> = ({ title, icon }) => (
  <div className="flex items-center gap-2 mb-4 px-2">
    {icon && <i className={`${icon} text-[#88D8B0] text-xl`}></i>}
    <h2 className="text-xl font-bold text-[#5D6D7E]">{title}</h2>
  </div>
);
