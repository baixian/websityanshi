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
    const progressBar = document.querySelector('.contact-progress-bar')

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

const scrollFieldIntoView = field => {
    if (!field) {
        return
    }

    const top = field.getBoundingClientRect().top + window.scrollY - getHeaderOffset() - 12

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.scrollTo(0, Math.max(top, 0))
        return
    }

    window.scrollTo({
        top: Math.max(top, 0),
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

const setupForm = () => {
    const form = document.querySelector('[data-contact-form]')

    if (!form) {
        return
    }

    const status = form.querySelector('[data-form-status]')
    const requiredFields = Array.from(form.querySelectorAll('[data-required]'))

    const setFieldError = (field, message = '') => {
        const errorNode = form.querySelector(`[data-error-for="${field.name}"]`)
        const fieldWrapper = field.closest('.field')

        field.classList.toggle('is-invalid', Boolean(message))
        field.setAttribute('aria-invalid', message ? 'true' : 'false')
        field.setCustomValidity(message)

        if (fieldWrapper) {
            fieldWrapper.classList.toggle('has-error', Boolean(message))
        }

        if (errorNode) {
            errorNode.textContent = message
        }
    }

    const clearStatus = () => {
        if (!status) {
            return
        }

        status.textContent = ''
        status.classList.remove('is-success', 'is-error')
    }

    const validateField = field => {
        const value = field.value.trim()
        const requiredMessage = field.dataset.required || '此项为必填项'

        if (!value) {
            setFieldError(field, requiredMessage)
            return false
        }

        if (field.name === 'phone' && !/^1\d{10}$/.test(value.replace(/\s+/g, ''))) {
            setFieldError(field, '请填写方便联系的手机号')
            return false
        }

        if (field.name === 'message' && value.length < 6) {
            setFieldError(field, '请尽量补充当前重点场景，至少填写 6 个字')
            return false
        }

        setFieldError(field)
        return true
    }

    requiredFields.forEach(field => {
        field.addEventListener('blur', () => {
            field.dataset.touched = 'true'
            validateField(field)
            clearStatus()
        })

        field.addEventListener('input', () => {
            if (field.dataset.touched === 'true' || field.classList.contains('is-invalid')) {
                validateField(field)
            }

            clearStatus()
        })
    })

    form.addEventListener('submit', event => {
        event.preventDefault()

        let isValid = true

        requiredFields.forEach(field => {
            field.dataset.touched = 'true'

            if (!validateField(field)) {
                isValid = false
            }
        })

        if (!isValid) {
            if (status) {
                status.textContent = '请填写方便联系的手机号，并尽量补充当前重点场景。'
                status.classList.add('is-error')
            }

            const firstInvalidField = requiredFields.find(field => field.classList.contains('is-invalid'))

            if (firstInvalidField) {
                scrollFieldIntoView(firstInvalidField)
                firstInvalidField.focus()
            }

            return
        }

        if (status) {
            status.textContent = '已收到信息，我们会尽快与你联系。'
            status.classList.add('is-success')
        }

        form.reset()
        requiredFields.forEach(field => {
            delete field.dataset.touched
            setFieldError(field)
        })
    })
}

const initContactPage = () => {
    updateProgress()
    setupAnchors()
    setupForm()

    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactPage)
} else {
    initContactPage()
}
