import {useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import ReactGA from 'react-ga4'

export function Analytics() {
  const location = useLocation()

  useEffect(() => {
    if (import.meta.env.VITE_GA_TRACKING_ID) {
      ReactGA.send({
        hitType: 'pageview',
        page: location.pathname + location.search,
      })
    }
  }, [location])

  return null
}