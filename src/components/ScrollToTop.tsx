import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component that scrolls the window to the top on every route change.
 * This fixes the issue where pages open halfway instead of from the top.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when the route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior, // Use 'instant' for immediate scroll
    });
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollToTop;