import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const Modal = ({
  isOpen = false,
  onClose,
  title,
  size = "md",
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  children,
  className = "",
}) => {
  // Refs for focus management
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Size variants
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-xl",
    xl: "max-w-4xl",
    full: "max-w-full mx-4",
  };

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (closeOnEscape && event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousFocusRef.current = document.activeElement;

      // Focus the modal
      if (modalRef.current) {
        modalRef.current.focus();
      }

      // Prevent body scroll
      document.body.style.overflow = "hidden";
    } else {
      // Restore focus to previously focused element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle overlay click
  const handleOverlayClick = (event) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  // Don't render if modal is not open
  if (!isOpen) return null;

  // Modal content
  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80">
      {/* Backdrop/Overlay */}
      <div
        onClick={handleOverlayClick}
        className="overlayDiv fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-fade-in"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`
          relative bg-white rounded-lg shadow-xl transform transition-all animate-slide-up
          ${sizeClasses[size]} w-full max-h-[90vh] overflow-hidden
          ${className}
        `}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="relative p-6 border-b border-gray-200">
            {title && (
              <h2
                id="modal-title"
                className="text-lg font-semibold text-gray-900"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X aria-hidden="true" className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="">{children}</div>
      </div>
    </div>
  );

  // Render modal using Portal (renders outside of parent component tree)
  return createPortal(modalContent, document.body);
};

// Modal sub-components for better organization
const ModalHeader = ({ children, className = "" }) => (
  <div className={`p-6 border-b border-gray-200 ${className}`}>{children}</div>
);

const ModalBody = ({ children, className = "" }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const ModalFooter = ({ children, className = "" }) => (
  <div className={`p-6 border-t border-gray-200 bg-gray-50 ${className}`}>
    {children}
  </div>
);

// Attach sub-components
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
