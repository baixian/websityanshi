import '../common/reset.css'
import './index.less'
import '@/assets/global.less'

import '../common/header'
import '../common/footer'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const syncHeaderHeight = () => {
  const header = document.querySelector('.site-header')
  const headerHeight = header ? header.getBoundingClientRect().height : 72
  document.documentElement.style.setProperty('--header-height', `${Math.round(headerHeight)}px`)
  return headerHeight
}

const getScrollOffset = () => Math.max(syncHeaderHeight() + 24, 96)

const updateProgress = () => {
  const progressBar = document.getElementById('casesProgressBar')
  if (!progressBar) return

  const doc = document.documentElement
  const scrollable = doc.scrollHeight - window.innerHeight
  const ratio = scrollable > 0 ? clamp(window.scrollY / scrollable, 0, 1) : 0

  progressBar.style.width = `${ratio * 100}%`
}

const setupReveal = () => {
  const revealItems = document.querySelectorAll('.reveal-item')
  if (!revealItems.length) return

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'))
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    },
    {
      threshold: 0.16,
      rootMargin: '0px 0px -10% 0px'
    }
  )

  revealItems.forEach((item) => observer.observe(item))
}

const renderCounterValue = (element, value) => {
  element.textContent = `${Math.floor(value)}`
}

const setupCounters = () => {
  const counters = document.querySelectorAll('[data-count-target]')
  if (!counters.length) return

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    counters.forEach((element) => {
      const target = Number(element.getAttribute('data-count-target') || 0)
      renderCounterValue(element, target)
    })
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return

        const element = entry.target
        const target = Number(element.getAttribute('data-count-target') || 0)
        const duration = 900
        const startTime = performance.now()

        const tick = (now) => {
          const progress = Math.min((now - startTime) / duration, 1)
          renderCounterValue(element, target * progress)

          if (progress < 1) {
            window.requestAnimationFrame(tick)
          } else {
            renderCounterValue(element, target)
          }
        }

        window.requestAnimationFrame(tick)
        observer.unobserve(element)
      })
    },
    {
      threshold: 0.4
    }
  )

  counters.forEach((element) => observer.observe(element))
}

const setupAnchorLinks = () => {
  const anchorLinks = document.querySelectorAll('a[href^="#"]')
  if (!anchorLinks.length) return

  anchorLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href') || ''
      if (!href || href === '#') return

      const target = document.querySelector(href)
      if (!target) return

      event.preventDefault()
      const targetTop = target.getBoundingClientRect().top + window.scrollY - getScrollOffset()

      if (prefersReducedMotion) {
        window.scrollTo(0, Math.max(targetTop, 0))
        return
      }

      window.scrollTo({
        top: Math.max(targetTop, 0),
        behavior: 'smooth'
      })
    })
  })
}

const setupActiveCaseAnchors = () => {
  const anchors = Array.from(document.querySelectorAll('[data-case-anchor]'))
  const sections = anchors
    .map((anchor) => {
      const id = anchor.getAttribute('data-case-anchor')
      return id ? document.getElementById(id) : null
    })
    .filter(Boolean)

  if (!anchors.length || !sections.length || !('IntersectionObserver' in window)) return

  const setActive = (id) => {
    anchors.forEach((anchor) => {
      anchor.classList.toggle('is-active', anchor.getAttribute('data-case-anchor') === id)
    })
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0]

      if (!visibleEntry) return
      setActive(visibleEntry.target.id)
    },
    {
      rootMargin: '-24% 0px -52% 0px',
      threshold: [0.2, 0.45, 0.7]
    }
  )

  sections.forEach((section) => observer.observe(section))

  if (sections[0]) {
    setActive(sections[0].id)
  }
}

const initCasesPage = () => {
  syncHeaderHeight()
  updateProgress()
  setupReveal()
  setupCounters()
  setupAnchorLinks()
  setupActiveCaseAnchors()

  window.addEventListener('scroll', updateProgress, { passive: true })
  window.addEventListener('resize', () => {
    syncHeaderHeight()
    updateProgress()
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCasesPage)
} else {
  initCasesPage()
}
