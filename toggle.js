function toggleColors() {
    const container = document.querySelector('.container');
    container.classList.toggle('swapped'); // Toggles the 'swapped' class
}




// Initial countdown times in seconds for each timer
let leftTime; // for left box
let rightTime; // for right box

leftTime=rightTime = 600;

let currentTimer = 'left'; // Start with the left timer
let intervalId = null;
let isRunning = false; // Track if the countdown is running

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
        } else if (currentTimer === 'right' && rightTime > 0) {
            rightTime--;
            document.getElementById('right-timer').textContent = formatTime(rightTime);
        } else {
            // Stop countdown when time reaches zero
            clearInterval(intervalId);
            isRunning = false;
        }
    }, 1000);
}

// Switch active timer between left and right boxes
function switchTimer() {
    // Toggle current timer between left and right
    currentTimer = currentTimer === 'left' ? 'right' : 'left';

    // Restart countdown on the new active timer
    startCountdown();
}

function togglePause() {
   
    const pauseIcon = document.getElementById("pause-icon");
    if (!isRunning) {
        clearInterval(intervalId); // Pause countdown
        pauseIcon.setAttribute("name", "play-outline"); // Change icon to play
        pauseIcon.classList.add("play-state"); // Add play-state class for offset
    } else {
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
    } else if (isRunning) {
        startCountdown(); // Resume countdown if it was already running
    }
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

// Initialize the timer display
updateTimerDisplay();