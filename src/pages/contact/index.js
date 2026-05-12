import '../common/reset.css'
import './index.less'
import '@/assets/global.less'

import '../common/header'
import '../common/footer'

const form = document.querySelector('[data-contact-form]')

if (form) {
    const status = form.querySelector('[data-form-status]')
    const requiredFields = Array.from(form.querySelectorAll('[data-required]'))

    const setFieldError = (field, message = '') => {
        const errorNode = form.querySelector(`[data-error-for="${field.name}"]`)
        const fieldWrapper = field.closest('.field')

        field.classList.toggle('is-invalid', Boolean(message))
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
        status.classList.remove('is-success')
    }

    const validateField = field => {
        const value = field.value.trim()
        const requiredMessage = field.dataset.required || '此项为必填项'

        if (!value) {
            setFieldError(field, requiredMessage)
            return false
        }

        if (field.name === 'phone' && !/^[\d+\-\s()]{6,20}$/.test(value)) {
            setFieldError(field, '请填写有效的联系电话')
            return false
        }

        setFieldError(field)
        return true
    }

    requiredFields.forEach(field => {
        field.addEventListener('input', () => {
            validateField(field)
            clearStatus()
        })
    })

    form.addEventListener('submit', event => {
        event.preventDefault()

        const isValid = requiredFields.every(validateField)

        if (!isValid) {
            clearStatus()
            const firstInvalidField = requiredFields.find(field => field.classList.contains('is-invalid'))
            if (firstInvalidField) {
                firstInvalidField.focus()
            }
            return
        }

        if (status) {
            status.textContent = '提交成功，我们已收到你的咨询信息，相关顾问会尽快与你联系。'
            status.classList.add('is-success')
        }

        form.reset()
        requiredFields.forEach(field => {
            setFieldError(field)
        })
    })
}
