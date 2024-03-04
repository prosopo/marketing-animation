const PROGRESS_STEPS = 200
const EVENT_DEFS = [
    'click',
    'touchstart',
    'mousemove',
    'touchmove',
    'touchend',
    'mouseup',
    'mousedown',
    'touchcancel',
    'keydown',
    'keyup',
    'keypress',
    'scroll',
    'resize',
    'focus',
    'blur',
    'change',
    'submit',
    'reset',
    'select',
    'contextmenu',
    'dblclick',
    'wheel',
    'drag',
    'dragstart',
    'dragend',
    'dragover',
    'dragenter',
    'dragleave',
]
console.log(EVENT_DEFS)

document.addEventListener('DOMContentLoaded', () => {
    for (const eventName of EVENT_DEFS) {
        console.log("adding event for ", eventName)
        addEventListener(eventName, handleEvent)
    }
    window.progressBarMax = getMaxWidth()
})

const getIncrement = (maxWidth) => {
    return Math.floor(maxWidth / PROGRESS_STEPS)
}

const getMaxWidth = () => {
    if (window.progressBarMax) {
        return window.progressBarMax
    }
    const demo = document.getElementById('demo')
    const maxWidth = Math.max(Number(getComputedStyle(demo).width.replace(/px.*/, '')) - 2, 420)
    window.progressBarMax = maxWidth
    return maxWidth
}

const getProgressBar = () => {
    return document.getElementById('progress-bar')
}

const handleEvent = () => {
    console.log("event!")
    if (!window.progressBarFinished) {
        const elem = getProgressBar()
        const width = window.progressBar || getComputedStyle(elem).width.replace(/px.*/, '')
        const maxWidth = getMaxWidth()
        const newWidth = Number(width) + getIncrement(maxWidth)
        if (newWidth > maxWidth) {
            window.checkBox()
            window.progressBarFinished = true
            const procaptchaDemo = document.getElementById('procaptcha-demo')
            elem.classList.remove('animate-pulse')

            procaptchaDemo.classList.remove('animate-pulse')
            removeEventListeners()
        } else {
            window.progressBar = newWidth
            const newStyle = { ...elem.style, width: `${newWidth}px`, height: '128px' }
            //remove empty style properties
            Object.keys(newStyle).forEach((key) => {
                if (!newStyle[key]) {
                    delete newStyle[key]
                }
            })
            // convert style object to css string
            const newStyleStr = Object.entries(newStyle).reduce((acc, [key, value]) => {
                return `${acc}${key}:${value};`
            }, '')
            elem.setAttribute('style', newStyleStr)
        }
    }
    return void 0
}

const removeEventListeners = () => {
    for (const eventDef of EVENT_DEFS) {
        removeEventListener(eventDef, handleEvent)
    }
    const progressElement = getProgressBar()

    progressElement.classList.add('animate-fade')
    progressElement.style.backgroundColor = 'white'

    const demoSection = document.getElementById('demo-section')
    demoSection.classList.add('animate-fade')
}
