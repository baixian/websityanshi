import '../common/reset.css'
import './index.less'
import '@/assets/global.less'

import '../common/header'
import '../common/footer'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const getHeaderOffset = () => {
    const header = document.querySelector('.site-header')
    const headerHeight = header ? header.getBoundingClientRect().height : 72
    return Math.max(headerHeight + 24, 96)
}

const updateProgress = () => {
    const progressBar = document.querySelector('.security-progress-bar')

    if (!progressBar) {
        return
    }

    const doc = document.documentElement
    const scrollable = doc.scrollHeight - window.innerHeight
    const ratio = scrollable > 0 ? clamp(window.scrollY / scrollable, 0, 1) : 0

    progressBar.style.width = `${ratio * 100}%`
}

const smoothScrollTo = targetTop => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const scrollTop = Math.max(targetTop - getHeaderOffset(), 0)

    if (prefersReducedMotion) {
        window.scrollTo(0, scrollTop)
        return
    }

    window.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
    })
}

const setupAnchors = () => {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', event => {
            const href = String(link.getAttribute('href') || '')

            if (!href || href === '#') {
                return
            }

            const target = document.querySelector(href)

            if (!target) {
                return
            }

            event.preventDefault()
            smoothScrollTo(target.getBoundingClientRect().top + window.scrollY)
        })
    })

    if (window.location.hash) {
        const target = document.querySelector(window.location.hash)

        if (target) {
            window.setTimeout(() => {
                smoothScrollTo(target.getBoundingClientRect().top + window.scrollY)
            }, 0)
        }
    }
}

const initSecurityPage = () => {
    updateProgress()
    setupAnchors()

    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSecurityPage)
} else {
    initSecurityPage()
}
