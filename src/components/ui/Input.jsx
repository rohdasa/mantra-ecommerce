import React, { forwardRef, useState } from "react";
import { useId } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

/**
 * Reusable Input Component
 *
 * Props:
 * - type: 'text', 'email', 'password', 'number', 'tel', etc.
 * - placeholder: placeholder text
 * - value: controlled input value
 * - onChange: change handler function
 * - error: error message string
 * - disabled: boolean
 * - required: boolean
 * - label: input label
 * - helperText: additional help text
 * - leftIcon: icon component to show on left
 * - rightIcon: icon component to show on right
 * - className: additional CSS classes
 */

const Input = forwardRef(
  (
    {
      type = "text",
      placeholder,
      value,
      onChange,
      error,
      disabled = false,
      required = false,
      label,
      helperText,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      className = "",
      id,
      name,
      ...props
    },
    ref
  ) => {
    // State for password visibility toggle
    const [showPassword, setShowPassword] = useState(false);

    // Generate unique ID if not provided
    const autoId = useId();
    const inputId = id || autoId;

    // Determine actual input type (handle password visibility)
    const inputType = type === "password" && showPassword ? "text" : type;

    // Base input styles
    const baseInputStyles =
      "w-full px-3 py-2 border rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed";

    // Conditional styles based on state
    const inputStyles = error
      ? `${baseInputStyles} border-red-300 focus:ring-red-500 focus:border-red-500`
      : `${baseInputStyles} border-gray-300 focus:ring-primary-500 focus:border-primary-500`;

    // Handle icon padding
    const paddingStyles = `${LeftIcon ? "pl-10" : ""} ${
      RightIcon || type === "password" ? "pr-10" : ""
    }`;

    return (
      <div className={`space-y-1 ${className}`}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {LeftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LeftIcon className="h-5 w-5 text-gray-400" />
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={inputType}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={`${inputStyles} ${paddingStyles}`}
            {...props}
          />

          {/* Right Icon or Password Toggle */}
          {type === "password" ? (
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          ) : RightIcon ? (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <RightIcon className="h-5 w-5 text-gray-400" />
            </div>
          ) : null}
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center mt-1">
            <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
            <span className="text-sm text-red-600">{error}</span>
          </div>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

// Set display name for debugging
Input.displayName = "Input";

export default Input;
