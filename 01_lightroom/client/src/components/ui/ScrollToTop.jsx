import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Scrolls the browser window to the top (0, 0) whenever the URL pathname changes.
 * Place this inside <BrowserRouter> so it has access to the router context.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}
