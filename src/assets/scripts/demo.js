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
    resetScroll({ duration: 500 });
    for (const eventName of EVENT_DEFS) {
        console.log("adding event for ", eventName)
        addEventListener(eventName, handleEvent)
    }
    window.prevWidth = window.innerWidth;
    window.progressSteps = window.innerWidth > 1000 ? 400 : 200; // set progress step according devices
});

// reset the progress bar when the window size changes.
window.addEventListener("resize", () => {
    const currentWidth = window.innerWidth; // current screen size
    const previousWidth = window.prevWidth; // previous screen size
    
    // if the current screen size does not match with the previous screen size
    if (currentWidth !== previousWidth) {
        window.progressSteps = window.innerWidth > 700 ? 400 : 200;
        resetScroll({ duration: 1000 });
        getProgressWidth(); // set the new max width for the progress bar
        window.progressBar = '0'; // reset the width of the progress bar
        window.prevWidth = window.innerWidth; // update the previous screen size

        const progressElement = getProgressBar(); // get the progress bar element
        progressElement.removeAttribute("style"); // removed progress bar styles
    }
});

const resetScroll = ({ duration = 1000 }) => {
    window.resizeScrolling = true;  // set the flag to true when resizing triggers scrolling
    window.scroll({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
        window.resizeScrolling = false;
    }, duration);
}

// create a common function to retrieve the maximum width of the progress bar
const getProgressWidth = () => {
    const demo = document.getElementById('demo');
    const maxWidth = Math.max(Number(getComputedStyle(demo).width.replace(/px.*/, '')));
    window.progressBarMax = maxWidth;
  
    return maxWidth;
}

const getIncrement = (maxWidth) => {
    return Math.floor(maxWidth / window.progressSteps)
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
    if (!window.progressBarFinished && !window.resizeScrolling) {
        const elem = getProgressBar()
        const width = window.progressBar || getComputedStyle(elem).width.replace(/px.*/, '')
        const maxWidth = getMaxWidth()
        const newWidth = Number(width) + getIncrement(maxWidth)
        // get checkbox element
        const getCheckboxElement = document.getElementById("procaptchaCheckbox");

        if (newWidth > maxWidth) {
          setTimeout(() => {
            // enable the checkbox when the progress bar is not progressing
            getCheckboxElement.disabled = false;
            getCheckboxElement.style.cursor = "pointer";
            document.getElementById('demo').style.backgroundColor = 'white';
            
            window.checkBox()
            window.progressBarFinished = true
            const procaptchaDemo = document.getElementById('procaptcha-demo')
            elem.classList.remove('animate-pulse')

            procaptchaDemo.classList.remove('animate-pulse')
            removeEventListeners()
          }, 2000);
        } else {
            // disable the checkbox while the progress bar is in progress
            getCheckboxElement.disabled = true;
            getCheckboxElement.style.cursor = "not-allowed";
            getCheckboxElement.style.backgroundColor = "rgb(227 227 227)";

            window.progressBar = newWidth
            const newStyle = { ...elem.style, width: `${newWidth}px`, height: '124px', border: '2px solid transparent', 'border-radius': '8px' }
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

    progressElement.style.backgroundColor = 'white';
    progressElement.style.width = '100%';

    const demoSection = document.getElementById('demo-section')
    demoSection.classList.add('animate-fade')
}
