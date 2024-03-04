/*global jQuery */
/* Description: Custom JS file */

;(function ($) {
    'use strict'
    $(document).ready(function () {
        /* Navbar Scripts */
        // jQuery to collapse the navbar on scroll
        $(window).on('scroll load', function () {
            const navBar = $('.navbar')
            if (navBar.length > 0) {
                if (navBar.offset().top > 60) {
                    $('.fixed-top').addClass('top-nav-collapse')
                } else {
                    $('.fixed-top').removeClass('top-nav-collapse')
                }
            }
        })

        // offcanvas script from Bootstrap + added element to close menu on click in small viewport
        $('[data-toggle="offcanvas"], .navbar-nav li a:not(.dropdown-toggle)').on('click', function () {
            $('.offcanvas-collapse').toggleClass('open')
        })

        window.hiddenElemDisplay = {}

        function showElem(id) {
            document.getElementById(id).style.display = window.hiddenElemDisplay[id] || 'inherit'
        }

        function setElemText(id, text) {
            document.getElementById(id).textContent = text
        }

        function hideElem(id) {
            const element = document.getElementById(id)
            if (!element) return
            window.hiddenElemDisplay[id] = getComputedStyle(element).display
            // since we set visibility to hidden in .njk files for first renders, we need to revert that here
            element.style.visibility = 'visible'
            element.style.display = 'none'
        }

        hideElem('signup-loader')
        hideElem('signup-success')

        function setEmailError(err) {
            document.getElementById('signup-error').textContent = err
        }

        const submitForm = async function (event) {
            event.preventDefault()
            hideElem('signup')
            showElem('signup-loader')
            try {
                window.loader = true
                const form = document.getElementById('signup')
                const inputs = Array.from(form.getElementsByTagName('INPUT'))
                const formData = {}
                inputs.forEach((input) => {
                    if (input.name.length > 0) {
                        if (input.name === 'procaptcha-response') {
                            formData[input.name] = JSON.parse(input.value)
                        } else {
                            formData[input.name] = input.value
                        }
                    }
                })
                const res = await fetch('/.netlify/functions/subscribe', {
                    body: JSON.stringify(formData),
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                // 499 - set as Mongo error on backend
                if (res.status === 404 || res.status === 499) {
                    throw new Error('Something went wrong! Please try again later!')
                }

                const json = await res.json()
                if (res.status !== 200) {
                    throw new Error(json.message)
                }

                setElemText('signup-success', json.message)
                hideElem('signup-loader')
                showElem('signup-success')

                // submit Signup event
                window.plausible('Signup', { props: { email: formData.email } })
            } catch (err) {
                setEmailError(err.message)
            }
            hideElem('signup-loader')
        }
        const signup = document.getElementById('signup')
        if (signup) {
            document.getElementById('signup').addEventListener('submit', submitForm)
        }
        const submitContactForm = async function (event) {
            event.preventDefault()
            hideElem('contact-form')
            showElem('contact-loader')
            try {
                window.loader = true
                const form = document.getElementById('contact-form')
                const inputs = Array.from(form.getElementsByTagName('INPUT'))
                const formData = {}
                inputs.forEach((input) => {
                    if (input.name.length > 0) {
                        formData[input.name] = input.value
                    }
                })
                const res = await fetch('/.netlify/functions/contact', {
                    body: JSON.stringify(formData),
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                // 499 - set as Mongo error on backend
                if (res.status === 404 || res.status === 499) {
                    throw new Error('Something went wrong! Please try again later!')
                }

                const json = await res.json()
                if (res.status !== 200) {
                    throw new Error(json.message)
                }

                setElemText('contact-success', json.message)
                hideElem('contact-loader')
                showElem('contact-success')

                // submit Contact event
                window.plausible('Contact', { props: { email: formData.email } })
            } catch (err) {
                setEmailError(err.message)
            }
            hideElem('contact-loader')
        }
        const contactForm = document.getElementById('contact-form')
        if (contactForm) {
            document.getElementById('contact-form').addEventListener('submit', submitContactForm)
        }
    })
})(jQuery)
