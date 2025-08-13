// hooks/useInfiniteScroll.js
import { useEffect, useRef } from "react";

const useInfiniteScroll = ({ callback, enabled }) => {
  const timeoutRef = useRef();

  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        const scrollPosition =
          window.innerHeight + document.documentElement.scrollTop;
        const bottom = document.documentElement.offsetHeight - 1500;

        if (scrollPosition >= bottom) {
          callback();
        }
      }, 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutRef.current);
    };
  }, [callback, enabled]);
};

export default useInfiniteScroll;
