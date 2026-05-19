import '../common/reset.css'
import './index.less'
import '@/assets/global.less'
import $ from 'jquery'

import '../common/header'
import '../common/footer'

$(function () {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const syncHeaderHeight = () => {
        const headerHeight = $('.site-header').outerHeight() || 72
        document.documentElement.style.setProperty('--header-height', `${headerHeight}px`)
        return headerHeight
    }

    const getHeaderOffset = () => {
        const headerHeight = syncHeaderHeight()
        return Math.max(headerHeight + 24, 96)
    }

    const smoothScrollTo = targetTop => {
        const scrollTop = Math.max(targetTop - getHeaderOffset(), 0)

        if (prefersReducedMotion) {
            window.scrollTo(0, scrollTop)
            return
        }

        $('html, body').stop().animate({ scrollTop }, 420)
    }

    const updateScrollProgress = () => {
        const progressBar = document.getElementById('scrollProgress')

        if (!progressBar) {
            return
        }

        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
        const scrolled = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0
        progressBar.style.width = `${Math.min(Math.max(scrolled, 0), 100)}%`
    }

    const setupRevealSections = () => {
        const sections = document.querySelectorAll('[data-reveal]')

        if (!sections.length) {
            return
        }

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            sections.forEach(section => section.classList.add('is-visible'))
            return
        }

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible')
                    observer.unobserve(entry.target)
                }
            })
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -8% 0px'
        })

        sections.forEach(section => observer.observe(section))
    }

    const renderCounterValue = (element, value) => {
        const suffix = element.getAttribute('data-count-suffix') || ''
        element.textContent = `${Math.floor(value).toLocaleString()}${suffix}`
    }

    const setupCounters = () => {
        const counters = document.querySelectorAll('[data-count-target]')

        if (!counters.length) {
            return
        }

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            counters.forEach(element => {
                const target = Number(element.getAttribute('data-count-target') || 0)
                renderCounterValue(element, target)
            })
            return
        }

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    return
                }

                const element = entry.target
                const target = Number(element.getAttribute('data-count-target') || 0)
                const duration = 900
                const startTime = performance.now()

                const tick = now => {
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
        }, {
            threshold: 0.45
        })

        counters.forEach(element => observer.observe(element))
    }

    const setupBackToTop = () => {
        const $button = $('#back-to-top').first()

        if (!$button.length) {
            return
        }

        const toggleButton = () => {
            const shouldShow = window.scrollY > Math.max(window.innerHeight * 0.7, 420)
            $button.toggleClass('is-visible', shouldShow)
        }

        $button.on('click', event => {
            event.preventDefault()
            smoothScrollTo(0)
        })

        $(window).on('scroll.backToTop resize.backToTop', toggleButton)
        toggleButton()
    }

    syncHeaderHeight()
    updateScrollProgress()
    setupRevealSections()
    setupCounters()
    setupBackToTop()

    $('a[href^="#"]').on('click', event => {
        const href = String($(event.currentTarget).attr('href') || '')

        if (!href || href === '#') {
            return
        }

        const $target = $(href)
        if (!$target.length) {
            return
        }

        event.preventDefault()
        smoothScrollTo($target.offset().top)
    })

    if (window.location.hash) {
        const $initialTarget = $(window.location.hash)
        if ($initialTarget.length) {
            window.setTimeout(() => {
                smoothScrollTo($initialTarget.offset().top)
            }, 0)
        }
    }

    $(window).on('scroll.progress resize.progress', updateScrollProgress)
    $(window).on('resize.homePage', syncHeaderHeight)

    const $form = $('#home-contact-form')

    if (!$form.length) {
        return
    }

    const $feedback = $('#home-contact-feedback')

    const validators = {
        companyName: value => value.trim() ? '' : '请填写公司或品牌名称',
        contactPerson: value => value.trim() ? '' : '请填写联系人姓名或岗位',
        contactPhone: value => /^1\d{10}$/.test(value.replace(/\s+/g, '')) ? '' : '请填写方便联系的手机号',
        contactDemand: value => value.trim().length >= 6 ? '' : '请至少填写 6 个字，并尽量补充业务场景'
    }

    const setFieldError = ($input, message) => {
        const name = $input.attr('name')
        const $error = $form.find(`[data-error-for="${name}"]`)

        $input.toggleClass('is-invalid', Boolean(message))
        $input.attr('aria-invalid', message ? 'true' : 'false')

        const element = $input.get(0)
        if (element) {
            element.setCustomValidity(message || '')
        }

        $error.text(message)
    }

    const clearFeedback = () => {
        $feedback.removeClass('is-success is-error').text('')
    }

    const validateInput = $input => {
        const name = $input.attr('name')
        const validate = validators[name]
        const message = validate ? validate(String($input.val() || '')) : ''

        setFieldError($input, message)
        return message
    }

    $form.on('submit', event => {
        event.preventDefault()
        clearFeedback()

        let hasError = false

        $form.find('input[name], textarea[name]').each((_, element) => {
            const $input = $(element)
            const message = validateInput($input)
            $input.attr('data-touched', 'true')

            if (message) {
                hasError = true
            }
        })

        if (hasError) {
            $feedback.addClass('is-error').text('请先补全必填项，并检查手机号格式。')
            const $firstInvalid = $form.find('.is-invalid').first()
            if ($firstInvalid.length) {
                $firstInvalid.trigger('focus')
            }
            return
        }

        $feedback
            .addClass('is-success')
            .text('已收到信息，我们会尽快与你联系。')

        $form[0].reset()
        $form.find('input[name], textarea[name]').removeAttr('data-touched').removeClass('is-invalid').attr('aria-invalid', 'false')
    })

    $form.find('input[name], textarea[name]').on('blur', event => {
        const $input = $(event.currentTarget)
        $input.attr('data-touched', 'true')
        const message = validateInput($input)

        if (!message && $feedback.hasClass('is-error')) {
            clearFeedback()
        }
    })

    $form.find('input[name], textarea[name]').on('input', event => {
        const $input = $(event.currentTarget)

        if ($input.attr('data-touched') === 'true' || $input.hasClass('is-invalid')) {
            const message = validateInput($input)

            if (!message && $feedback.hasClass('is-error')) {
                clearFeedback()
            }
            return
        }

        if ($feedback.text()) {
            clearFeedback()
        }
    })
})
