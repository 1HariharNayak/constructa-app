import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 select-none disabled:opacity-50 disabled:pointer-events-none rounded-xl';

  const sizeClasses = {
    xs: 'px-2.5 py-1 text-xs gap-1.5',
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-xs font-semibold gap-2',
    lg: 'px-5 py-2.5 text-sm font-semibold gap-2.5',
  }[size] || 'px-4 py-2 text-xs font-semibold gap-2';

  const variantClasses = {
    primary: 'bg-[#A77B50] hover:bg-[#926A42] text-white shadow-sm focus:ring-[#A77B50]/40 active:scale-[0.98]',
    secondary: 'bg-[#657A6A] hover:bg-[#536557] text-white shadow-sm focus:ring-[#657A6A]/40 active:scale-[0.98]',
    outline: 'border border-[#E7E9E3] bg-white text-[#242B27] hover:bg-[#F6F6F2] hover:border-[#D3D8CE] shadow-sm focus:ring-[#A77B50]/20',
    ghost: 'text-[#242B27] hover:bg-[#E7E9E3]/50 focus:ring-[#A77B50]/15',
    danger: 'bg-[#C66C62] hover:bg-[#B35950] text-white shadow-sm focus:ring-[#C66C62]/40 active:scale-[0.98]',
    bronzeSubtle: 'bg-[#F3ECE5] hover:bg-[#E9DFD5] text-[#A77B50] border border-[#A77B50]/20',
  }[variant] || 'bg-[#A77B50] text-white';

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="w-3.5 h-3.5 shrink-0" />}
    </button>
  );
}
