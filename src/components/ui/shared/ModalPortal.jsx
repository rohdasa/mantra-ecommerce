// src/components/ui/ModalPortal.jsx
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

const ModalPortal = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const modalRoot = document.getElementById("modal-root");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !modalRoot) return null;

  return createPortal(children, modalRoot);
};

export default ModalPortal;
