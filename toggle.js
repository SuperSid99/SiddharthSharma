

// let ignoreButtons;

// Initial countdown times in seconds for each timer
let leftTime; // for left box
let rightTime; // for right box
let startTime; // for resetting
let increment; // The increment
let currentTimer;

let defaultTime = 600
let defaultIncrement = 5



let intervalId = null;
let isRunning = false; // Track if the countdown is running


let popup;
let shuffleButton;


startTime =leftTime=rightTime = defaultTime;
increment = defaultIncrement;


document.addEventListener("DOMContentLoaded", function () {
    popup = document.getElementById("popup");
    shuffleButton = document.getElementById("shuffleButton");
    
    console.log(popup)
    window.addEventListener("load", showPopup);
});


// Function to show the popup
function showPopup() {
    popup.classList.remove("hidden");
    popup.classList.add("showflex");
}

// Function to hide the popup
function hidePopup() {
    popup.classList.add("hidden");
    popup.classList.remove("showflex");
}

// Function to submit the start time
function submitStartTime() {
    startTime = parseInt(document.getElementById("startTime").value);
    increment = parseInt(document.getElementById("increment").value);

    if (startTime === NaN){
        startTime =leftTime=rightTime = defaultTime;
        increment = defaultIncrement;
        updateTimerDisplay();
        hidePopup(); // Hide the popup after setting the time
    }
    else{
        leftTime=rightTime = startTime;
        // increment = defaultIncrement;
        updateTimerDisplay();
        hidePopup(); // Hide the popup after setting the time
    }
}

function startDefault() {
    updateTimerDisplay();
    hidePopup(); // Hide the popup after setting the time
}





function toggleColors() {
    const container = document.querySelector('.container');
    container.classList.toggle('swapped'); // Toggles the 'swapped' class
    currentTimer = startwhite();
}


function startwhite() {
    const container = document.querySelector('.container');
    if (container.classList.contains('swapped')){
        return 'right';
    }
    else{
        return 'left';
    }
}

document.addEventListener("DOMContentLoaded", function () {
    currentTimer = startwhite();
});

document.addEventListener("DOMContentLoaded", function () {
    touchBox = document.querySelectorAll('.touchBox');
    // touchBox.join(document.querySelectorAll('.box','.counter'));
    console.log(touchBox);
});

// Format seconds into MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// Update timer displays initially
function updateTimerDisplay() {
    document.getElementById('left-timer').textContent = formatTime(leftTime);
    document.getElementById('right-timer').textContent = formatTime(rightTime);
}

// Start or continue countdown in the active timer box
function startCountdown() {
    // Clear any existing interval to prevent multiple intervals
    if (intervalId) clearInterval(intervalId);

    // Start countdown on the active timer
    intervalId = setInterval(() => {
        if (currentTimer === 'left' && leftTime > 0) {
            leftTime--;
            document.getElementById('left-timer').textContent = formatTime(leftTime);
            
            const leftbox = document.querySelector('.left-box .counter');
            leftbox.classList.add('active'); // adds the 'active' class  
            
            const rightbox = document.querySelector('.right-box .counter');
            rightbox.classList.remove('active'); // removes the 'active' class  
        } 
        
        else if (currentTimer === 'right' && rightTime > 0) {
            rightTime--;
            document.getElementById('right-timer').textContent = formatTime(rightTime);

            const leftbox = document.querySelector('.left-box .counter');
            leftbox.classList.remove('active'); // removes the 'active' class  
            
            const rightbox = document.querySelector('.right-box .counter');
            rightbox.classList.add('active'); // adds the 'active' class  
        } 
        
        else {
            // Stop countdown when time reaches zero
            clearInterval(intervalId);
            isRunning = false;
        }
    }, 1000);
}

// Switch active timer between left and right boxes
function switchTimer() {
    // Toggle current timer between left and right
    // currentTimer = currentTimer === 'left' ? 'right' : 'left';

    if (currentTimer === 'left') {
        leftTime+=increment;
        document.getElementById('left-timer').textContent = formatTime(leftTime);
        currentTimer='right';
        const leftbox = document.querySelector('.left-box .counter');
        leftbox.classList.remove('active'); // removes the 'active' class  
        
        const rightbox = document.querySelector('.right-box .counter');
        rightbox.classList.add('active'); // adds the 'active' class  
    }

    else if (currentTimer === 'right') {
        rightTime+=increment;
        document.getElementById('right-timer').textContent = formatTime(rightTime);
        currentTimer='left';
        const leftbox = document.querySelector('.left-box .counter');
        leftbox.classList.add('active'); // adds the 'active' class  
        
        const rightbox = document.querySelector('.right-box .counter');
        rightbox.classList.remove('active'); // removes the 'active' class  
    }
    

    // Restart countdown on the new active timer
    startCountdown();
}

function togglePause() {
   
    const pauseIcon = document.getElementById("pause-icon");
    if (!isRunning) {
        clearInterval(intervalId); // Pause countdown
        pauseIcon.setAttribute("name", "play-outline"); // Change icon to play
        pauseIcon.classList.add("play-state"); // Add play-state class for offset
    }
    
    else {
        if (isRunning) {
            startCountdown(); // Resume countdown if running
        }
        pauseIcon.setAttribute("name", "pause-outline"); // Change icon to pause
        pauseIcon.classList.remove("play-state"); // Remove offset for pause state
    }
}

function pauseCountdown() {
    isRunning = !isRunning; // Toggle the paused state
    if (!isRunning) {
        clearInterval(intervalId); // Stop the countdown
    } 
    
    else if (isRunning) {
        startCountdown(); // Resume countdown if it was already running
    }
}

function stopCountdown() {
    const pauseIcon = document.getElementById("pause-icon");
    clearInterval(intervalId); // Stop the countdown
    pauseIcon.setAttribute("name", "play-outline"); // Change icon to play
    pauseIcon.classList.add("play-state"); // Add play-state class for offset
}


function refreshCountdown() {

    const pauseIcon = document.getElementById("pause-icon");
    clearInterval(intervalId); // Stop the countdown
    pauseIcon.setAttribute("name", "play-outline"); // Change icon to play
    pauseIcon.classList.add("play-state"); // Add play-state class for offset
    
    leftTime=rightTime = startTime;
    currentTimer = startwhite(); // Start with the left timer
    // intervalId = null;
    isRunning = false; // Track if the countdown is running


    const leftbox = document.querySelector('.left-box .counter');
    leftbox.classList.remove('active'); // removes the 'active' class  
    
    const rightbox = document.querySelector('.right-box .counter');
    rightbox.classList.remove('active'); // removes the 'active' class  


    updateTimerDisplay();
}


// Spacebar event listener to control start/switch of countdown
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault(); // Prevent default spacebar behavior (scrolling)

        if (!isRunning) {
            // Start countdown if not already running
            isRunning = true;
            togglePause()
            startCountdown();
        } else {
            // If already running, switch timer
            switchTimer();
        }
    }
});

// touch event listener to control start/switch of countdown
document.addEventListener('touchstart', (event) => {

    console.log(event.target,Array.from(touchBox),Array.from(touchBox).includes(event.target))

    if (Array.from(touchBox).includes(event.target)) {

        if (!isRunning) {
            // Start countdown if not already running
            isRunning = true;
            togglePause();
            startCountdown();
        } else {
            // If already running, switch timer
            switchTimer();
        }
    }
});

// Initialize the timer display
updateTimerDisplay();
