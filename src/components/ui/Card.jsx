import React from "react";

/**
 * Reusable Card Component
 *
 * This follows the Compound Component Pattern - Card has sub-components
 * that work together but can be used independently
 *
 * Usage:
 * <Card>
 *   <Card.Header>
 *     <Card.Title>Title</Card.Title>
 *     <Card.Description>Description</Card.Description>
 *   </Card.Header>
 *   <Card.Content>
 *     Content goes here
 *   </Card.Content>
 *   <Card.Footer>
 *     Footer content
 *   </Card.Footer>
 * </Card>
 */

// Main Card Container
const Card = ({
  children,
  className = "",
  hover = false,
  padding = true,
  shadow = "sm",
  ...props
}) => {
  // Base card styles
  const baseStyles =
    "bg-white rounded-lg border border-gray-200 transition-all duration-200";

  // Shadow variants
  const shadows = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  };

  // Hover effect
  const hoverStyles = hover
    ? "hover:shadow-md hover:-translate-y-1 cursor-pointer"
    : "";

  // Padding
  const paddingStyles = padding ? "p-6" : "";

  const cardStyles = `${baseStyles} ${shadows[shadow]} ${hoverStyles} ${paddingStyles} ${className}`;

  return (
    <div className={cardStyles} {...props}>
      {children}
    </div>
  );
};

// Card Header Sub-component
const CardHeader = ({ children, className = "" }) => {
  return <div className={`mb-4 ${className}`}>{children}</div>;
};

// Card Title Sub-component
const CardTitle = ({ children, className = "", as: Tag = "h3" }) => {
  const baseStyles = "text-lg font-semibold text-gray-900 leading-tight mt-4";

  return <Tag className={`${baseStyles} ${className}`}>{children}</Tag>;
};

// Card Description Sub-component
const CardDescription = ({ children, className = "" }) => {
  return (
    <p className={`text-sm text-gray-600 mt-1 ${className}`}>{children}</p>
  );
};

// Card Content Sub-component
const CardContent = ({ children, className = "" }) => {
  return <div className={`${className}`}>{children}</div>;
};

// Card Footer Sub-component
const CardFooter = ({ children, className = "" }) => {
  return (
    <div className={`mt-4 pt-4 border-t border-gray-100 ${className}`}>
      {children}
    </div>
  );
};

// Card Image Sub-component (useful for product cards)
const CardImage = ({
  src,
  alt,
  className = "",
  aspectRatio = "h-60",
  objectFit = "object-cover",
}) => {
  return (
    <div className={`overflow-hidden rounded-t-lg ${className} ${aspectRatio}`}>
      <img
        src={src}
        alt={alt}
        className={`w-full h-full ${objectFit} transition-transform duration-300 hover:scale-105`}
      />
    </div>
  );
};

// Attach sub-components to main Card component
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;
Card.Image = CardImage;

export default Card;
