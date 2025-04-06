import { useEffect } from 'react';

const useKeyboardNavigation = (containerRef, itemSelector, onSelect) => {
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let currentFocus = -1;

    const handleKeyDown = (e) => {
      const items = container.querySelectorAll(itemSelector);
      if (!items.length) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          currentFocus = (currentFocus + 1) % items.length;
          items[currentFocus].focus();
          break;
        case 'ArrowUp':
          e.preventDefault();
          currentFocus = currentFocus <= 0 ? items.length - 1 : currentFocus - 1;
          items[currentFocus].focus();
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (currentFocus >= 0) {
            onSelect?.(items[currentFocus]);
          }
          break;
        default:
          break;
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [containerRef, itemSelector, onSelect]);
};

export default useKeyboardNavigation;
