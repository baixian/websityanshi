import '../common/reset.css'
import './index.less'
import '@/assets/global.less'

import '../common/header'
import '../common/footer'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const updateProgress = () => {
  const progressBar = document.querySelector('.products-progress-bar')
  if (!progressBar) return

  const doc = document.documentElement
  const scrollable = doc.scrollHeight - window.innerHeight
  const ratio = scrollable > 0 ? clamp(window.scrollY / scrollable, 0, 1) : 0

  progressBar.style.width = `${ratio * 100}%`
}

const setupReveal = () => {
  const revealItems = document.querySelectorAll('.reveal-item')
  if (!revealItems.length) return

  if (!('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'))
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.18,
      rootMargin: '0px 0px -8% 0px'
    }
  )

  revealItems.forEach((item) => observer.observe(item))
}

const initProductsPage = () => {
  updateProgress()
  setupReveal()

  window.addEventListener('scroll', updateProgress, { passive: true })
  window.addEventListener('resize', updateProgress)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProductsPage)
} else {
  initProductsPage()
}
