// 引入公共 css
import '../common/reset.css'
import './index.less'
import '@/assets/global.less'
import $ from 'jquery'

// 引入公共页面 js
import '../common/header'
import '../common/footer'

$(function () {
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
        $('html, body').stop().animate({
            scrollTop: Math.max($target.offset().top - 96, 0)
        }, 360)
    })

    const $form = $('#home-contact-form')

    if (!$form.length) {
        return
    }

    const $feedback = $('#home-contact-feedback')
    const fieldLabels = {
        companyName: '公司名称',
        contactPerson: '联系人',
        contactPhone: '手机号',
        contactDemand: '当前需求'
    }

    const validators = {
        companyName: value => value.trim() ? '' : '请填写公司名称',
        contactPerson: value => value.trim() ? '' : '请填写联系人',
        contactPhone: value => /^1\d{10}$/.test(value.replace(/\s+/g, '')) ? '' : '请填写有效的手机号',
        contactDemand: value => value.trim().length >= 6 ? '' : '请至少填写 6 个字的需求说明'
    }

    const setFieldError = ($input, message) => {
        const name = $input.attr('name')
        const $error = $form.find(`[data-error-for="${name}"]`)

        $input.toggleClass('is-invalid', Boolean(message))
        $error.text(message)
    }

    const clearFeedback = () => {
        $feedback.removeClass('is-success is-error').text('')
    }

    $form.on('submit', event => {
        event.preventDefault()
        clearFeedback()

        let hasError = false

        $form.find('input[name], textarea[name]').each((_, element) => {
            const $input = $(element)
            const name = $input.attr('name')
            const validate = validators[name]
            const message = validate ? validate($input.val()) : ''

            setFieldError($input, message)
            if (message) {
                hasError = true
            }
        })

        if (hasError) {
            $feedback.addClass('is-error').text('请先补全表单信息后再提交。')
            const $firstInvalid = $form.find('.is-invalid').first()
            if ($firstInvalid.length) {
                $firstInvalid.trigger('focus')
            }
            return
        }

        $feedback
            .addClass('is-success')
            .text('提交成功，我们已收到你的咨询信息，相关顾问会尽快与你联系。')

        $form[0].reset()
    })

    $form.find('input[name], textarea[name]').on('input blur', event => {
        const $input = $(event.currentTarget)
        const name = $input.attr('name')
        const validate = validators[name]
        const message = validate ? validate($input.val()) : ''

        setFieldError($input, message)
        if (!message && $feedback.hasClass('is-error')) {
            clearFeedback()
        }
    })
})
