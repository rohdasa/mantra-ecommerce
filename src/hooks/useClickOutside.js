// hooks/useClickOutside.js
import { useEffect } from "react";

const useClickOutside = (ref, onClickOutside) => {
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClickOutside();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, onClickOutside]);
};

export default useClickOutside;
