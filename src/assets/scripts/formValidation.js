window.onCaptchaHuman = async function (payload, formId) {
    // get form
    const form = document.getElementById(formId)
    // add a listener to the onSubmit event of the form
    if (form) {
        // add the payload to the form
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = 'procaptcha-response'
        input.value = JSON.stringify(payload)
        form.appendChild(input)
        // recheck the form and enable the submit button if everything is filled
        console.log("human")
        window.checkForm(formId)
    }

    // submit onHuman event
    window.plausible('Captcha Success', { props: { payload } })
}

window.onCaptchaFailed = function () {
    // submit onFailed event
    window.plausible('Captcha Failed')
}

window.onCaptchaError = function () {
    // submit onError event
    window.plausible('Captcha Error')
}

window.onCaptchaExpired = function () {
    // submit onExpired event
    window.plausible('Captcha Expired')
}

window.onCaptchaClose = function () {
    // submit onClose event
    window.plausible('Captcha Close')
}

window.onCaptchaChalexpired = function () {
    // submit onChalexpired event
    window.plausible('Captcha Challenge Expired')
}

window.onCaptchaOpen = function () {
    // submit onOpen event
    window.plausible('Captcha Open')
}

// email validator
const validateEmail = function (email) {
    const re = /\S+@\S+\.\S+/
    return re.test(email)
}

// url validator
const validateUrl = function (url) {
    const re = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,63})([/\w .-]*)*\/?$/
    return re.test(url)
}

// Check the form elements are all filled before enabling the submit button
window.checkForm = function (formId, fieldsTypes ) {
    const form = document.getElementById(formId)
    if(typeof(fieldsType) === "undefined") {
        fieldsTypes = [
            { id: 'email', type: 'email' },
            { id: 'url', type: 'url' },
        ]
    }
    const inputs = Array.from(form.getElementsByTagName('INPUT'))
    const submit = document.querySelector('button[type="submit"]')
    const isFilled = inputs.every((input) => input.value.length > 0)
    let isValid = false
    for (const field of fieldsTypes) {
        const input = document.getElementById(field.id)
        if(input) {
            isValid = field.type === 'email' ? validateEmail(input.value) : field.type === 'url' ? validateUrl(input.value) : true
            if (!isValid) {
                break
            }
        }
    }
    const procaptchaCheckbox = form.querySelector('.procaptcha').querySelector('input')
    const isHumanChecked = procaptchaCheckbox.checked
    console.log("checked",procaptchaCheckbox.checked)
    console.log(procaptchaCheckbox.getAttribute('checked'))
    submit.disabled = !(isFilled && isValid && isHumanChecked)
}

window.checkBox = function () {
    const checkbox = document.getElementById('procaptchaCheckbox')
    checkbox.style.display = 'none'
    const spinner = document.getElementById('procaptchaLoadingSpinner')
    spinner.style.display = 'flex'
    // wait 2000ms then hide the spinner and show the checkbox, checking the checkbox
    setTimeout(() => {
        // set the checked property
        checkbox.style.display = 'flex'
        checkbox.setAttribute('checked', 'checked')
        checkbox.style.setProperty('display', 'flex', 'important')
        checkbox.style.setProperty('appearance', 'auto', 'important')
        spinner.style.display = 'none'
        checkbox.checked = true
        window.checkForm()
    }, 2000)
}

window.onClickFormElement = function (el) {
    window.plausible(`Click ${el.name[0].toUpperCase()}${el.name.slice(1)}`)
}
