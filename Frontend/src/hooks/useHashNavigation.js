import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_PAGE, isValidPage } from '../config/navigation'

const readPageFromHash = () => {
  const page = window.location.hash.replace('#', '')
  return isValidPage(page) ? page : DEFAULT_PAGE
}

export default function useHashNavigation() {
  const [activePage, setActivePage] = useState(readPageFromHash)

  useEffect(() => {
    const handleHashChange = () => setActivePage(readPageFromHash())
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigate = useCallback((page) => {
    const nextPage = isValidPage(page) ? page : DEFAULT_PAGE
    setActivePage(nextPage)
    window.location.hash = nextPage
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return { activePage, navigate }
}
