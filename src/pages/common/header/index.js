import './index.less'
import $ from 'jquery'

$(function () {
    const $body = $('body')
    const $drawer = $('.mobile-nav-drawer')
    const $overlay = $('.mobile-nav-overlay')
    const $button = $('.mobile-nav-button')

    const closeDrawer = () => {
        $body.removeClass('mobile-nav-open')
        $button.attr('aria-expanded', 'false')
        $drawer.attr('aria-hidden', 'true')
    }

    const openDrawer = () => {
        $body.addClass('mobile-nav-open')
        $button.attr('aria-expanded', 'true')
        $drawer.attr('aria-hidden', 'false')
    }

    const toggleDrawer = () => {
        if ($body.hasClass('mobile-nav-open')) {
            closeDrawer()
            return
        }
        openDrawer()
    }

    const syncActiveNav = () => {
        const { pathname, hash } = location
        let activeKey = ''

        if (pathname.endsWith('/') || pathname.endsWith('/index.html') || pathname === '/index.html') {
            activeKey = hash === '#contact' ? 'contact' : 'home'
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

        $('.nav-link').removeClass('active')
        if (activeKey) {
            $(`.nav-link[data-nav="${activeKey}"]`).addClass('active')
        }
    }

    syncActiveNav()

    $button.on('click', toggleDrawer)
    $overlay.on('click', closeDrawer)
    $('.mobile-nav-close, .mobile-nav-links a').on('click', closeDrawer)

    $(window).on('hashchange', syncActiveNav)
    $(window).on('resize', () => {
        if (window.innerWidth > 960) {
            closeDrawer()
        }
    })

    $(document).on('keyup', event => {
        if (event.key === 'Escape') {
            closeDrawer()
        }
    })
})
