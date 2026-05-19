import './index.less'
import $ from 'jquery'

const SCROLL_RESET_KEY = 'nake:scroll-reset-top'
const TRANSITION_SCROLL_LOCK_CLASS = 'page-transition-scroll-lock'
const TRANSITION_SCROLL_LOCK_MS = 960
const EXIT_SCROLL_LOCK_MS = 260
const SCROLL_RESET_DELAYS = [0, 120, 320, 560, 820, 1120]
const SCROLL_INPUT_KEYS = new Set(['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ', 'Spacebar'])

let releaseTransitionScrollLock = null
let instantScrollRestoreTimer = 0

const normalizePathname = pathname => {
    if (!pathname || pathname === '/') {
        return '/index.html'
    }

    return pathname.endsWith('/') ? `${pathname}index.html` : pathname
}

const getNavigationType = () => {
    return performance.getEntriesByType('navigation')[0]?.type || ''
}

const setInstantScrollMode = () => {
    const root = document.documentElement
    const body = document.body

    if (!root) {
        return
    }

    window.clearTimeout(instantScrollRestoreTimer)

    root.style.scrollBehavior = 'auto'
    if (body) {
        body.style.scrollBehavior = 'auto'
    }

    instantScrollRestoreTimer = window.setTimeout(() => {
        if (root.classList.contains(TRANSITION_SCROLL_LOCK_CLASS)) {
            return
        }

        root.style.scrollBehavior = ''
        if (body) {
            body.style.scrollBehavior = ''
        }
    }, 0)
}

const jumpWindowTo = top => {
    const nextTop = Math.max(top, 0)
    setInstantScrollMode()
    document.documentElement.scrollTop = nextTop
    document.body.scrollTop = nextTop
    window.scrollTo({
        top: nextTop,
        left: 0,
        behavior: 'auto'
    })
}

const scheduleScrollReset = top => {
    jumpWindowTo(top)
    requestAnimationFrame(() => jumpWindowTo(top))
    requestAnimationFrame(() => requestAnimationFrame(() => jumpWindowTo(top)))

    SCROLL_RESET_DELAYS.forEach(delay => {
        window.setTimeout(() => jumpWindowTo(top), delay)
    })
}

const isScrollInputKey = key => SCROLL_INPUT_KEYS.has(key)

const blockScrollInput = event => {
    if (event.type === 'keydown' && !isScrollInputKey(event.key)) {
        return
    }

    event.preventDefault()
}

const applyTransitionScrollLock = ({ top = 0, duration = TRANSITION_SCROLL_LOCK_MS } = {}) => {
    if (!document.body) {
        scheduleScrollReset(top)
        return
    }

    releaseTransitionScrollLock?.()

    const root = document.documentElement
    const body = document.body
    const previousState = {
        rootOverflow: root.style.overflow,
        bodyOverflow: body.style.overflow,
        rootScrollBehavior: root.style.scrollBehavior,
        bodyScrollBehavior: body.style.scrollBehavior,
        rootOverscrollBehavior: root.style.overscrollBehavior,
        bodyOverscrollBehavior: body.style.overscrollBehavior,
        bodyTouchAction: body.style.touchAction
    }

    const timerIds = []
    const enforceScrollPosition = () => {
        if (Math.abs(window.scrollY - top) > 1) {
            jumpWindowTo(top)
        }
    }

    root.classList.add(TRANSITION_SCROLL_LOCK_CLASS)
    body.classList.add(TRANSITION_SCROLL_LOCK_CLASS)
    root.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    root.style.scrollBehavior = 'auto'
    body.style.scrollBehavior = 'auto'
    root.style.overscrollBehavior = 'none'
    body.style.overscrollBehavior = 'none'
    body.style.touchAction = 'none'

    scheduleScrollReset(top)

    window.addEventListener('wheel', blockScrollInput, {
        capture: true,
        passive: false
    })
    window.addEventListener('scroll', enforceScrollPosition, { passive: true })
    document.addEventListener('touchmove', blockScrollInput, {
        capture: true,
        passive: false
    })
    document.addEventListener('keydown', blockScrollInput, true)

    const release = () => {
        timerIds.forEach(timerId => window.clearTimeout(timerId))
        window.removeEventListener('wheel', blockScrollInput, true)
        window.removeEventListener('scroll', enforceScrollPosition)
        document.removeEventListener('touchmove', blockScrollInput, true)
        document.removeEventListener('keydown', blockScrollInput, true)
        root.classList.remove(TRANSITION_SCROLL_LOCK_CLASS)
        body.classList.remove(TRANSITION_SCROLL_LOCK_CLASS)
        root.style.overflow = previousState.rootOverflow
        body.style.overflow = previousState.bodyOverflow
        root.style.scrollBehavior = previousState.rootScrollBehavior
        body.style.scrollBehavior = previousState.bodyScrollBehavior
        root.style.overscrollBehavior = previousState.rootOverscrollBehavior
        body.style.overscrollBehavior = previousState.bodyOverscrollBehavior
        body.style.touchAction = previousState.bodyTouchAction

        if (releaseTransitionScrollLock === release) {
            releaseTransitionScrollLock = null
        }
    }

    timerIds.push(window.setTimeout(release, duration))
    releaseTransitionScrollLock = release
}

const rememberTopResetTarget = pathname => {
    if (!pathname) {
        sessionStorage.removeItem(SCROLL_RESET_KEY)
        return
    }

    sessionStorage.setItem(SCROLL_RESET_KEY, normalizePathname(pathname))
}

const forcePageTopOnEntry = () => {
    const currentPath = normalizePathname(window.location.pathname)
    const pendingResetTarget = normalizePathname(sessionStorage.getItem(SCROLL_RESET_KEY) || '')
    const shouldForceReset = pendingResetTarget === currentPath
    const shouldResetForFreshEntry = !window.location.hash && getNavigationType() !== 'back_forward'

    if (!shouldForceReset && !shouldResetForFreshEntry) {
        return
    }

    if (shouldForceReset) {
        sessionStorage.removeItem(SCROLL_RESET_KEY)
    }

    if (shouldForceReset) {
        applyTransitionScrollLock({
            top: 0,
            duration: TRANSITION_SCROLL_LOCK_MS
        })
        return
    }

    scheduleScrollReset(0)
}

if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'
}

document.addEventListener('click', event => {
    const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null

    if (!anchor || event.defaultPrevented) {
        return
    }

    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
        return
    }

    if (anchor.hasAttribute('download') || anchor.getAttribute('target') === '_blank') {
        return
    }

    const href = anchor.getAttribute('href') || ''

    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return
    }

    const targetUrl = new URL(href, window.location.href)
    const currentPath = normalizePathname(window.location.pathname)
    const targetPath = normalizePathname(targetUrl.pathname)

    if (targetUrl.origin !== window.location.origin) {
        return
    }

    if (targetUrl.hash || currentPath === targetPath) {
        rememberTopResetTarget('')
        return
    }

    applyTransitionScrollLock({
        top: window.scrollY,
        duration: EXIT_SCROLL_LOCK_MS
    })
    rememberTopResetTarget(targetPath)
}, true)

window.addEventListener('pageshow', forcePageTopOnEntry)
window.addEventListener('load', forcePageTopOnEntry)

$(function () {
    const $body = $('body')
    const $header = $('.site-header')
    const $drawer = $('.mobile-nav-drawer')
    const $overlay = $('.mobile-nav-overlay')
    const $button = $('.mobile-nav-button')
    const $closeButton = $('.mobile-nav-close')
    const focusableSelector = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    let lastFocusedElement = null

    const drawerIsOpen = () => $body.hasClass('mobile-nav-open')
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const scrollPageToTop = ({ smooth = true } = {}) => {
        window.scrollTo({
            top: 0,
            behavior: smooth && !prefersReducedMotion ? 'smooth' : 'auto'
        })
    }

    const getFocusableElements = () => {
        return $drawer
            .find(focusableSelector)
            .filter((_, element) => $(element).is(':visible'))
    }

    const setPageInert = isInert => {
        const mainContent = document.getElementById('main-content')
        if (mainContent) {
            mainContent.inert = isInert
        }
    }

    const syncToggleLabels = isOpen => {
        $button.attr('aria-label', isOpen ? '关闭导航' : '打开导航')
        $closeButton.attr('aria-label', '关闭导航')
    }

    const closeDrawer = ({ restoreFocus = true } = {}) => {
        if (!drawerIsOpen()) {
            return
        }

        $body.removeClass('mobile-nav-open')
        $button.attr('aria-expanded', 'false')
        $drawer.attr('aria-hidden', 'true')
        setPageInert(false)
        syncToggleLabels(false)

        if (restoreFocus) {
            const focusTarget = lastFocusedElement instanceof HTMLElement ? lastFocusedElement : $button.get(0)
            focusTarget?.focus()
        }

        lastFocusedElement = null
    }

    const openDrawer = () => {
        if (drawerIsOpen()) {
            return
        }

        lastFocusedElement = document.activeElement
        $body.addClass('mobile-nav-open')
        $button.attr('aria-expanded', 'true')
        $drawer.attr('aria-hidden', 'false')
        setPageInert(true)
        syncToggleLabels(true)

        requestAnimationFrame(() => {
            const focusTarget = $closeButton.get(0) || getFocusableElements().get(0) || $drawer.get(0)
            focusTarget?.focus()
        })
    }

    const toggleDrawer = () => {
        if (drawerIsOpen()) {
            closeDrawer()
            return
        }
        openDrawer()
    }

    const syncActiveNav = () => {
        const { pathname } = location
        let activeKey = ''

        if (pathname.endsWith('/') || pathname.endsWith('/index.html') || pathname === '/index.html') {
            activeKey = 'home'
        } else if (pathname.endsWith('/contact.html') || pathname === '/contact.html') {
            activeKey = 'contact'
        } else if (pathname.endsWith('/security.html') || pathname === '/security.html') {
            activeKey = 'security'
        } else if (pathname.endsWith('/models.html') || pathname === '/models.html') {
            activeKey = 'models'
        } else if (pathname.endsWith('/cases.html') || pathname === '/cases.html') {
            activeKey = 'cases'
        } else if (pathname.endsWith('/industries.html') || pathname === '/industries.html') {
            activeKey = 'industries'
        } else if (pathname.endsWith('/solution.html') || pathname === '/solution.html') {
            activeKey = 'solution'
        } else if (pathname.endsWith('/products.html') || pathname === '/products.html') {
            activeKey = 'products'
        }

        $('.nav-link').removeClass('active').removeAttr('aria-current')
        if (activeKey) {
            $(`.nav-link[data-nav="${activeKey}"]`).addClass('active').attr('aria-current', 'page')
        }
    }

    const syncHeaderState = () => {
        $header.toggleClass('is-scrolled', window.scrollY > 18)
    }

    const handlePrimaryNavigation = event => {
        const href = String($(event.currentTarget).attr('href') || '')

        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
            return
        }

        const targetUrl = new URL(href, window.location.href)
        const isSameOrigin = targetUrl.origin === window.location.origin

        if (!isSameOrigin) {
            return
        }

        const currentPath = normalizePathname(window.location.pathname)
        const targetPath = normalizePathname(targetUrl.pathname)

        if (currentPath === targetPath && !targetUrl.hash) {
            event.preventDefault()
            closeDrawer({ restoreFocus: false })
            scrollPageToTop()
            return
        }

        if (!targetUrl.hash) {
            applyTransitionScrollLock({
                top: window.scrollY,
                duration: EXIT_SCROLL_LOCK_MS
            })
            rememberTopResetTarget(targetPath)
        }
    }

    const setupReveal = () => {
        const $revealNodes = $('[data-reveal]')

        if (!$revealNodes.length) {
            return
        }

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            $revealNodes.addClass('is-visible')
            return
        }

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    return
                }

                $(entry.target).addClass('is-visible')
                observer.unobserve(entry.target)
            })
        }, {
            threshold: 0.16,
            rootMargin: '0px 0px -10% 0px'
        })

        $revealNodes.each((index, element) => {
            if (!element.style.getPropertyValue('--reveal-delay')) {
                element.style.setProperty('--reveal-delay', `${Math.min(index * 40, 160)}ms`)
            }
            observer.observe(element)
        })
    }

    forcePageTopOnEntry()
    syncActiveNav()
    syncHeaderState()
    setupReveal()
    syncToggleLabels(false)

    $button.on('click', toggleDrawer)
    $overlay.on('click', closeDrawer)
    $('.brand, .site-nav a, .mobile-nav-links a, .mobile-nav-cta').on('click', handlePrimaryNavigation)
    $('.mobile-nav-close, .mobile-nav-links a, .mobile-nav-cta').on('click', () => {
        closeDrawer({ restoreFocus: false })
    })

    $(window).on('hashchange', syncActiveNav)
    $(window).on('scroll', syncHeaderState)
    $(window).on('resize', () => {
        if (window.innerWidth > 960) {
            closeDrawer({ restoreFocus: false })
        }
    })

    $(document).on('keydown', event => {
        if (!drawerIsOpen()) {
            return
        }

        if (event.key === 'Escape') {
            closeDrawer()
            return
        }

        if (event.key !== 'Tab') {
            return
        }

        const $focusableElements = getFocusableElements()
        const firstElement = $focusableElements.get(0)
        const lastElement = $focusableElements.get($focusableElements.length - 1)

        if (!firstElement || !lastElement) {
            event.preventDefault()
            $drawer.trigger('focus')
            return
        }

        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault()
            lastElement.focus()
            return
        }

        if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault()
            firstElement.focus()
        }
    })
})
