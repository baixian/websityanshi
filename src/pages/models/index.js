import '../common/reset.css'
import './index.less'
import '@/assets/global.less'

import '../common/header'
import '../common/footer'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const updateProgress = () => {
  const progressBar = document.querySelector('.models-progress-bar')
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

const setupModelSelection = () => {
  const decisionCards = Array.from(document.querySelectorAll('.models-decision-card[data-model-target]'))
  const choiceCards = Array.from(document.querySelectorAll('.models-choice-card[data-model-card]'))
  const summaryPanels = Array.from(document.querySelectorAll('.models-decision-copy[data-model-panel]'))

  if (!decisionCards.length) return

  const setActiveModel = (modelKey) => {
    decisionCards.forEach((card) => {
      const isActive = card.getAttribute('data-model-target') === modelKey
      card.classList.toggle('is-active', isActive)
      card.setAttribute('aria-pressed', String(isActive))
    })

    choiceCards.forEach((card) => {
      const isActive = card.getAttribute('data-model-card') === modelKey
      card.classList.toggle('is-active', isActive)
      card.classList.toggle('is-featured', isActive)
    })

    summaryPanels.forEach((panel) => {
      panel.hidden = panel.getAttribute('data-model-panel') !== modelKey
    })
  }

  decisionCards.forEach((card) => {
    card.addEventListener('click', () => {
      const modelKey = card.getAttribute('data-model-target')
      if (!modelKey) return
      setActiveModel(modelKey)
    })
  })
}

const initModelsPage = () => {
  updateProgress()
  setupReveal()
  setupModelSelection()

  window.addEventListener('scroll', updateProgress, { passive: true })
  window.addEventListener('resize', updateProgress)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initModelsPage)
} else {
  initModelsPage()
}
