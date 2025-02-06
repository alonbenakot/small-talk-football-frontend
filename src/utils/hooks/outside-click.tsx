import { useEffect, useRef, useState } from "react";

const useOutsideClick = <T extends HTMLElement>() => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (elementRef.current && !elementRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return {isOpen, setIsOpen, elementRef};
}

export default useOutsideClick;