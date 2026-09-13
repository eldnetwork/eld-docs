import { useEffect } from 'react'
import clsx from 'clsx'
import ErrorBoundary from '@docusaurus/ErrorBoundary'
import {
  PageMetadata,
  SkipToContentFallbackId,
  ThemeClassNames,
  useColorMode,
} from '@docusaurus/theme-common'
import { useKeyboardNavigation } from '@docusaurus/theme-common/internal'
import SkipToContent from '@theme/SkipToContent'
import AnnouncementBar from '@theme/AnnouncementBar'
import Navbar from '@theme/Navbar'
import Footer from '@theme/Footer'
import LayoutProvider from '@theme/Layout/Provider'
import ErrorPageContent from '@theme/ErrorPageContent'
import styles from './styles.module.css'

function useEldThemeSync() {
  const { setColorMode } = useColorMode()

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    const stored = window.localStorage.getItem('eld-home-theme')
    setColorMode(stored === 'light' ? 'light' : 'dark')
  }, [setColorMode])
}

function LayoutShell({ children, noFooter, wrapperClassName, title, description }) {
  const { colorMode } = useColorMode()
  useEldThemeSync()

  const isLight = colorMode === 'light'

  return (
    <>
      <PageMetadata title={title} description={description} />

      <div
        className={clsx(
          'eld-docs-shell',
          'explorer-home-shell',
          isLight && 'explorer-home-shell--light',
        )}
      >
        <SkipToContent />
        <AnnouncementBar />
        <Navbar />

        <div className="eld-docs-shell__main">
          <div
            id={SkipToContentFallbackId}
            className={clsx(
              ThemeClassNames.layout.main.container,
              ThemeClassNames.wrapper.main,
              styles.mainWrapper,
              wrapperClassName,
            )}
          >
            <ErrorBoundary fallback={(params) => <ErrorPageContent {...params} />}>
              {children}
            </ErrorBoundary>
          </div>

          {!noFooter && <Footer />}
        </div>
      </div>
    </>
  )
}

export default function Layout(props) {
  const { children, noFooter, wrapperClassName, title, description } = props

  useKeyboardNavigation()

  return (
    <LayoutProvider>
      <LayoutShell
        noFooter={noFooter}
        wrapperClassName={wrapperClassName}
        title={title}
        description={description}
      >
        {children}
      </LayoutShell>
    </LayoutProvider>
  )
}
