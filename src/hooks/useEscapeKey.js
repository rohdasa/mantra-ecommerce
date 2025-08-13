// hooks/useEscapeKey.js
import { useEffect } from "react";

const useEscapeKey = (onEscape) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onEscape();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onEscape]);
};

export default useEscapeKey;
