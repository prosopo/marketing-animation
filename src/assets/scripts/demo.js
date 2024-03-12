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

// create a common function to retrieve the maximum width of the progress bar
const getProgressWidth = () => {
    const demo = document.getElementById('demo');
    const maxWidth = Math.max(Number(getComputedStyle(demo).width.replace(/px.*/, '')) - 2, 420);
    window.progressBarMax = maxWidth;
  
    return maxWidth;
}

const getIncrement = (maxWidth) => {
    return Math.floor(maxWidth / PROGRESS_STEPS)
}

const getMaxWidth = () => {
    if (window.progressBarMax) {
        return window.progressBarMax
    }
    return getProgressWidth();
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
            // enable the checkbox when the progress bar is not progressing
            document.getElementById("procaptchaCheckbox").disabled = false;
            
            window.checkBox()
            window.progressBarFinished = true
            const procaptchaDemo = document.getElementById('procaptcha-demo')
            elem.classList.remove('animate-pulse')

            procaptchaDemo.classList.remove('animate-pulse')
            removeEventListeners()
        } else {
            // disable the checkbox while the progress bar is in progress
            document.getElementById("procaptchaCheckbox").disabled = true;

            // reset the progress bar when the window size changes.
            window.addEventListener('resize', () => { 
              getProgressWidth();
              window.progressBar = '0px';
            });

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
