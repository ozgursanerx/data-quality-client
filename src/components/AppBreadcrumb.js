import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import {
  cilHome,
  cilStorage,
  cilMonitor,
  cilPuzzle,
  cilDataTransferDown,
  cilChartPie,
  cilDrop,
  cilCursor,
  cilNotes,
  cilStar,
  cilBell,
  cilCalculator,
} from '@coreui/icons'

import routes from '../routes'

import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'

// Path'e göre ikon eşleştirmesi
const getIconForPath = (pathname) => {
  const iconMap = {
    '/': cilHome,
    '/proclog': cilStorage,
    '/monitoring': cilMonitor,
    '/package-analysis': cilPuzzle,
    '/data-lineage': cilDataTransferDown,
    '/charts': cilChartPie,
    '/theme': cilDrop,
    '/theme/colors': cilDrop,
    '/theme/typography': cilDrop,
    '/buttons': cilCursor,
    '/forms': cilNotes,
    '/icons': cilStar,
    '/notifications': cilBell,
    '/widgets': cilCalculator,
  }

  // Exact match kontrolü
  if (iconMap[pathname]) {
    return iconMap[pathname]
  }

  // Prefix match kontrolü (örn: /base/accordion -> /base)
  for (const [path, icon] of Object.entries(iconMap)) {
    if (pathname.startsWith(path + '/') || pathname === path) {
      return icon
    }
  }

  return null
}

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname

  // Ana sayfada breadcrumb gösterme
  if (currentLocation === '/' || currentLocation === '') {
    return (
      <div className="d-flex align-items-center">
        <Link to="/" style={{ textDecoration: 'none', color: 'var(--cui-primary)' }}>
          <CIcon icon={cilHome} className="me-2" />
        </Link>
        <span style={{ color: 'var(--cui-body-color)', fontSize: '0.875rem', fontWeight: 500 }}>
          Ana Sayfa
        </span>
      </div>
    )
  }

  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname)
    return currentRoute ? currentRoute.name : false
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`
      const routeName = getRouteName(currentPathname, routes)
      if (routeName) {
        const icon = getIconForPath(currentPathname)
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index + 1 === array.length ? true : false,
          icon: icon,
        })
      }
      return currentPathname
    })
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  // Eğer breadcrumb yoksa veya sadece Home varsa, sadece Home ikonu göster
  if (breadcrumbs.length === 0 || (breadcrumbs.length === 1 && breadcrumbs[0].name === 'Home')) {
    return (
      <div className="d-flex align-items-center" style={{ minHeight: '1.5rem' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'var(--cui-primary)' }}>
          <CIcon icon={cilHome} className="me-2" />
        </Link>
        <span style={{ color: 'var(--cui-body-color)', fontSize: '0.875rem' }}>
          {breadcrumbs[0]?.name || 'Ana Sayfa'}
        </span>
      </div>
    )
  }

  return (
    <CBreadcrumb className="my-0">
      <CBreadcrumbItem>
        <Link to="/" style={{ textDecoration: 'none', color: 'var(--cui-primary)' }}>
          <CIcon icon={cilHome} style={{ fontSize: '0.875rem' }} />
        </Link>
      </CBreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => {
        const IconComponent = breadcrumb.icon
        return (
          <CBreadcrumbItem
            {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
            key={index}
          >
            <span className="d-flex align-items-center">
              {IconComponent && (
                <CIcon 
                  icon={IconComponent} 
                  className="me-1" 
                  style={{ fontSize: '0.875rem', opacity: breadcrumb.active ? 1 : 0.7 }}
                />
              )}
              <span>{breadcrumb.name}</span>
            </span>
          </CBreadcrumbItem>
        )
      })}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)
