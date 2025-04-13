
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  const [orientation, setOrientation] = React.useState<'portrait' | 'landscape'>('portrait')

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape')
    }
    
    mql.addEventListener("change", onChange)
    onChange() // Initial check
    
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return { isMobile: !!isMobile, orientation }
}
