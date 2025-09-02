import React from "react";
import { Loader2 } from "lucide-react";

const Loading = ({
  variant = "spinner",
  size = "md",
  color = "primary",
  text,
  fullScreen = false,
  className = "",
}) => {
  // Size configurations
  const sizes = {
    sm: {
      spinner: "w-4 h-4",
      text: "text-sm",
      container: "gap-2",
    },
    md: {
      spinner: "w-6 h-6",
      text: "text-base",
      container: "gap-3",
    },
    lg: {
      spinner: "w-8 h-8",
      text: "text-lg",
      container: "gap-4",
    },
  };

  // Color configurations
  const colors = {
    primary: "text-primary-900",
    secondary: "text-secondary-700",
    white: "text-white",
  };

  const bgColors = {
    primary: "bg-primary-900",
    secondary: "bg-secondary-700",
    white: "bg-white",
  };

  // Base container styles
  const containerStyles = `flex items-center justify-center ${sizes[size].container} ${className}`;

  // Full screen overlay
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <LoadingContent
          variant={variant}
          size={size}
          color={color}
          text={text}
          sizes={sizes}
          colors={colors}
          bgColors={bgColors}
          containerStyles={containerStyles}
        />
      </div>
    );
  }

  return (
    <div className={containerStyles}>
      <LoadingContent
        variant={variant}
        size={size}
        color={color}
        text={text}
        sizes={sizes}
        colors={colors}
        bgColors={bgColors}
      />
    </div>
  );
};

// Separate component for loading content to avoid duplication
const LoadingContent = ({
  variant,
  size,
  color,
  text,
  sizes,
  colors,
  bgColors,
}) => {
  const renderLoadingVariant = () => {
    switch (variant) {
      case "spinner":
        return (
          <Loader2
            className={`${sizes[size].spinner} ${colors[color]} animate-spin`}
          />
        );

      case "dots":
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 ${bgColors[color].replace(
                  "text-",
                  "bg-"
                )} rounded-full animate-pulse`}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1s",
                }}
              />
            ))}
          </div>
        );

      case "pulse":
        return (
          <div
            className={`${sizes[size].spinner} ${bgColors[color].replace(
              "text-",
              "bg-"
            )} rounded-full animate-pulse`}
          />
        );

      case "skeleton":
        return (
          <div className="space-y-3 w-full max-w-sm">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
          </div>
        );

      case "overlay":
        return (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
            <Loader2
              className={`${sizes[size].spinner} ${colors[color]} animate-spin`}
            />
          </div>
        );

      default:
        return (
          <Loader2
            className={`${sizes[size].spinner} ${colors[color]} animate-spin`}
          />
        );
    }
  };

  return (
    <>
      {renderLoadingVariant()}
      {text && (
        <span className={`${sizes[size].text} ${colors[color]} font-medium`}>
          {text}
        </span>
      )}
    </>
  );
};

// Skeleton loading component for content placeholders
const Skeleton = ({ lines = 3, className = "", animate = true }) => {
  const animationClass = animate ? "animate-pulse" : "";

  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 bg-gray-200 rounded ${animationClass}`}
          style={{
            width: index === lines - 1 ? "75%" : "100%",
          }}
        />
      ))}
    </div>
  );
};

// Card skeleton for product loading
const CardSkeleton = ({ className = "" }) => {
  return (
    <div className={`border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="animate-pulse">
        {/* Image skeleton */}
        <div className="h-48 bg-gray-200 rounded mb-4" />

        {/* Title skeleton */}
        <div className="h-4 bg-gray-200 rounded mb-2" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />

        {/* Price skeleton */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="h-6 bg-gray-200 rounded w-20" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>

        {/* Button skeleton */}
        <div className="h-10 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

// Loading overlay for specific components
const LoadingOverlay = ({
  isLoading,
  children,
  className = "",
  spinnerSize = "md",
  backgroundColor = "bg-white bg-opacity-70",
}) => {
  return (
    <div className={`relative ${className}`}>
      {children}
      {isLoading && (
        <div
          className={`absolute inset-0 ${backgroundColor} flex items-center justify-center z-10`}
        >
          <Loading variant="spinner" size={spinnerSize} />
        </div>
      )}
    </div>
  );
};

// Button loading state
const LoadingButton = ({
  loading = false,
  children,
  disabled,
  className = "",
  ...props
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

// Attach utility components
Loading.Skeleton = Skeleton;
Loading.CardSkeleton = CardSkeleton;
Loading.Overlay = LoadingOverlay;
Loading.Button = LoadingButton;

export default Loading;
