import React from "react";
import { Loader2 } from "lucide-react";

const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  children,
  className = "",
  onClick,
  type = "button",
  ...props
}) => {
  // Base styles that all buttons share
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  // Different button variants (following design system)
  const variants = {
    primary:
      "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white focus:ring-primary-500 shadow-sm hover:shadow-md transform hover:-translate-y-0.5",
    secondary:
      "bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white focus:ring-secondary-500 shadow-sm hover:shadow-md transform hover:-translate-y-0.5",
    accent:
      "bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white focus:ring-accent-500 shadow-sm hover:shadow-md transform hover:-translate-y-0.5",
    outline:
      "border-2 border-primary-200 bg-white hover:bg-primary-50 text-primary-700 hover:border-primary-300 focus:ring-primary-500",
    ghost:
      "bg-transparent hover:bg-primary-50 text-primary-700 focus:ring-primary-500",
    danger:
      "bg-gradient-to-r from-danger-600 to-danger-700 hover:from-danger-700 hover:to-danger-800 text-white focus:ring-danger-500 shadow-sm hover:shadow-md",
  };

  // Different button sizes
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  // Combine all styles
  const buttonStyles = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      type={type}
      className={buttonStyles}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
