
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Set initial value
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Create the media query list
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Define the callback function
    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
    }
    
    // Modern browsers
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange)
      return () => mql.removeEventListener("change", onChange)
    } 
    // Fallback for older browsers
    else {
      // @ts-ignore - deprecated API but needed for older browsers
      mql.addListener(onChange)
      return () => {
        // @ts-ignore - deprecated API but needed for older browsers
        mql.removeListener(onChange)
      }
    }
  }, [])

  // Return the current state
  return isMobile
}
