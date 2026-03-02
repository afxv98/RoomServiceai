'use client';

// Button component with different variants
export default function Button({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
  type = 'button',
  className = ''
}) {
  const baseStyles = 'px-6 py-3 rounded-sm font-bold text-sm tracking-wide uppercase shadow-md transition-all duration-300';

  const variants = {
    primary: 'bg-copper text-white hover:bg-copper-hover hover:-translate-y-0.5 hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed',
    secondary: 'border-2 border-gray-600 text-gray-700 hover:bg-gray-50 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed',
    danger: 'bg-red-600 text-white hover:bg-red-700 hover:-translate-y-0.5 hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed',
    outline: 'border-2 border-copper text-copper hover:bg-copper hover:text-white disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
