// ====== State ======
let leftTime;      // for left box
let rightTime;     // for right box
let startTime;     // for resetting (in seconds)
let increment;     // increment (in seconds)
let currentTimer;

let defaultTime = 600;       // 10 minutes in seconds
let defaultIncrement = 5;    // 5 seconds increment
let intervalId = null;
let isRunning = false;
let popup;
let shuffleButton;
let touchBox;

// ====== Mode/Presets Definitions (unchanged presets) ======
const PRESETS = {
  bullet: [
    { label: "1|0",  minutes: 1,  inc: 0 },
    { label: "1|1",  minutes: 1,  inc: 1 },
    { label: "2|1",  minutes: 2,  inc: 1 }
  ],
  blitz: [
    { label: "3|0",  minutes: 3,  inc: 0 },
    { label: "3|2",  minutes: 3,  inc: 2 },
    { label: "5|0",  minutes: 5,  inc: 0 },
    { label: "5|3",  minutes: 5,  inc: 3 }
  ],
  rapid: [
    { label: "10|0", minutes:10, inc: 0 },
    { label: "10|5", minutes:10, inc: 5 },
    { label: "15|10",minutes:15, inc:10 },
    { label: "25|10",minutes:25, inc:10 }
  ],
  classical: [
    { label: "30|0", minutes:30, inc: 0 },
    { label: "45|45",minutes:45, inc:45 },
    { label: "60|0", minutes:60, inc: 0 },
    { label: "90|30",minutes:90, inc:30 }
  ]
};

const MODES = [
  { key: "bullet",    title: "Bullet",    icon: "flash-outline" },
  { key: "blitz",     title: "Blitz",     icon: "speedometer-outline" },
  { key: "rapid",     title: "Rapid",     icon: "timer-outline" },
  { key: "classical", title: "Classical", icon: "hourglass-outline" },
  { key: "custom",    title: "Custom",    icon: "construct-outline" }
];

let currentMode = "custom";
let selectedPreset = null;

// ====== Helpers ======
function minutesToSeconds(m){ return Math.max(0, Math.round(m * 60)); }
function qs(id){ return document.getElementById(id); }
function ensurePairGrid(el){ if (el && !el.classList.contains("pair-grid")) el.classList.add("pair-grid"); }

function setInputsByPreset(minutes, incSec){
  const startInput = qs("startTime");
  const incInput = qs("increment");
  if (startInput) startInput.value = minutesToSeconds(minutes);
  if (incInput) incInput.value = incSec;
}

function renderModes(){
  const grid = qs("modeGrid");
  if (!grid) return;
  ensurePairGrid(grid);
  grid.innerHTML = "";

  MODES.forEach(({key, title, icon})=>{
    const btn = document.createElement("button");
    btn.className = "mode-btn" + (currentMode===key ? " active" : "");
    btn.setAttribute("data-mode", key);
    btn.innerHTML = `
      <ion-icon name="${icon}"></ion-icon>
      <div style="font-size:10px;line-height:1;margin-top:2px;">${title}</div>
    `;
    btn.addEventListener("click", ()=>selectMode(key));
    grid.appendChild(btn);
  });

  // If odd count, center the last item over the axis
  if (MODES.length % 2 === 1) {
    grid.lastElementChild.classList.add("center-span");
  }
}

function renderPresets(modeKey){
  const presetGrid = qs("presetGrid");
  if (!presetGrid) return;
  ensurePairGrid(presetGrid);
  presetGrid.innerHTML = "";

  const list = PRESETS[modeKey] || [];
  list.forEach(p=>{
    const b = document.createElement("button");
    b.className = "preset-btn";
    b.textContent = p.label;
    b.addEventListener("click", ()=>{
      [...presetGrid.querySelectorAll(".preset-btn")].forEach(x => x.classList.remove("selected"));
      b.classList.add("selected");
      selectedPreset = p;
      setInputsByPreset(p.minutes, p.inc);
    });
    presetGrid.appendChild(b);
  });

  // If odd count, center the last preset across both columns
  if (list.length % 2 === 1 && presetGrid.lastElementChild) {
    presetGrid.lastElementChild.classList.add("center-span");
  }
}

function selectMode(modeKey){
    currentMode = modeKey;
    selectedPreset = null;
    renderModes(); // if you have this; otherwise remove
  
    const presetGrid = document.getElementById("presetGrid");
    const customPanel = document.getElementById("customPanel");
  
    // Safety: if panes aren't present, bail quietly
    if (!presetGrid || !customPanel) return;
  
    if (modeKey === "custom") {
      // show custom, hide presets
      customPanel.classList.remove("hidden");
      presetGrid.classList.add("hidden");
      return;
    }
  
    // show presets, hide custom
    customPanel.classList.add("hidden");
    presetGrid.classList.remove("hidden");
  
    // (Re)render presets for the selected mode & seed inputs from first option
    renderPresets(modeKey);  // if you have this
    const first = PRESETS[modeKey]?.[0];
    if (first) setInputsByPreset(first.minutes, first.inc);
  }
  

// ====== Initialize base state ======
startTime = leftTime = rightTime = defaultTime;
increment = defaultIncrement;

document.addEventListener("DOMContentLoaded", function () {
  popup = document.getElementById("popup");
  shuffleButton = document.getElementById("shuffleButton");

  // Make grids symmetric
  ensurePairGrid(qs("modeGrid"));
  ensurePairGrid(qs("presetGrid"));
  // (Optional) If you want the two custom inputs to anchor at the center line even more strictly:
  // ensurePairGrid(qs("customPanel"));

  renderModes();
  selectMode("custom");

  window.addEventListener("load", showPopup);

  currentTimer = startwhite();

  touchBox = document.querySelectorAll('.touchBox');
});

// ====== Popup controls ======
function showPopup() {
  if (!popup) popup = document.getElementById("popup");
  if (!popup) return;
  popup.classList.remove("hidden");
  popup.classList.add("showflex");
}

function hidePopup() {
  if (!popup) popup = document.getElementById("popup");
  if (!popup) return;
  popup.classList.add("hidden");
  popup.classList.remove("showflex");
}

// ====== Submit / Defaults ======
function submitStartTime() {
  const startInputEl = document.getElementById("startTime");
  const incInputEl = document.getElementById("increment");

  const startVal = startInputEl ? parseInt(startInputEl.value) : NaN;
  const incVal = incInputEl ? parseInt(incInputEl.value) : NaN;

  if (!startInputEl || !startInputEl.value) {
    startTime = leftTime = rightTime = defaultTime;
    increment = isNaN(defaultIncrement) ? 0 : defaultIncrement;
  } else {
    startTime = isNaN(startVal) ? defaultTime : startVal;
    leftTime = rightTime = startTime;
    increment = (!incInputEl || !incInputEl.value) ? 0 : (isNaN(incVal) ? 0 : incVal);
  }

  updateTimerDisplay();
  hidePopup();
}

function startDefault() {
  updateTimerDisplay();
  hidePopup();
}

// ====== UI swap / who starts ======
function toggleColors() {
  const container = document.querySelector('.container');
  container.classList.toggle('swapped');
  currentTimer = startwhite();
}

function startwhite() {
  const container = document.querySelector('.container');
  if (container && container.classList.contains('swapped')){
    return 'right';
  } else {
    return 'left';
  }
}

// ====== Formatting & display ======
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

// cache elements after DOM is ready
let leftTimerEl, rightTimerEl;

document.addEventListener("DOMContentLoaded", () => {
  leftTimerEl  = document.getElementById("left-timer");
  rightTimerEl = document.getElementById("right-timer");

  // If we're on a page that doesn't have the timers (e.g., projects.html), bail out.
  if (!leftTimerEl || !rightTimerEl) return;

  updateTimerDisplay();   // safe to call now
});

// SAFE update function
function updateTimerDisplay() {
  if (!leftTimerEl || !rightTimerEl) return; // hard guard
  leftTimerEl.textContent  = formatTime(leftTime);
  rightTimerEl.textContent = formatTime(rightTime);
}


// ====== Countdown logic ======
function startCountdown() {
  if (intervalId) clearInterval(intervalId);

  intervalId = setInterval(() => {
    if (currentTimer === 'left' && leftTime > 0) {
      leftTime--;
      const leftDisp = document.getElementById('left-timer');
      if (leftDisp) leftDisp.textContent = formatTime(leftTime);

      const leftbox = document.querySelector('.left-box .counter');
      if (leftbox) leftbox.classList.add('active');
      const rightbox = document.querySelector('.right-box .counter');
      if (rightbox) rightbox.classList.remove('active');
    } 
    else if (currentTimer === 'right' && rightTime > 0) {
      rightTime--;
      const rightDisp = document.getElementById('right-timer');
      if (rightDisp) rightDisp.textContent = formatTime(rightTime);

      const leftbox = document.querySelector('.left-box .counter');
      if (leftbox) leftbox.classList.remove('active');
      const rightbox = document.querySelector('.right-box .counter');
      if (rightbox) rightbox.classList.add('active');
    } 
    else {
      clearInterval(intervalId);
      isRunning = false;
    }
  }, 1000);
}

function switchTimer() {
  if (currentTimer === 'left') {
    leftTime += increment;
    const leftDisp = document.getElementById('left-timer');
    if (leftDisp) leftDisp.textContent = formatTime(leftTime);
    currentTimer = 'right';

    const leftbox = document.querySelector('.left-box .counter');
    if (leftbox) leftbox.classList.remove('active');
    const rightbox = document.querySelector('.right-box .counter');
    if (rightbox) rightbox.classList.add('active');
  } else if (currentTimer === 'right') {
    rightTime += increment;
    const rightDisp = document.getElementById('right-timer');
    if (rightDisp) rightDisp.textContent = formatTime(rightTime);
    currentTimer = 'left';

    const leftbox = document.querySelector('.left-box .counter');
    if (leftbox) leftbox.classList.add('active');
    const rightbox = document.querySelector('.right-box .counter');
    if (rightbox) rightbox.classList.remove('active');
  }

  startCountdown();
}

// ====== Pause / Stop / Refresh ======
function togglePause() {
  const pauseIcon = document.getElementById("pause-icon");
  if (!isRunning) {
    clearInterval(intervalId);
    if (pauseIcon) {
      pauseIcon.setAttribute("name", "play-outline");
      pauseIcon.classList.add("play-state");
    }
  } else {
    if (isRunning) startCountdown();
    if (pauseIcon) {
      pauseIcon.setAttribute("name", "pause-outline");
      pauseIcon.classList.remove("play-state");
    }
  }
}

function pauseCountdown() {
  isRunning = !isRunning;
  if (!isRunning) {
    clearInterval(intervalId);
  } else {
    startCountdown();
  }
}

function stopCountdown() {
  const pauseIcon = document.getElementById("pause-icon");
  clearInterval(intervalId);
  if (pauseIcon) {
    pauseIcon.setAttribute("name", "play-outline");
    pauseIcon.classList.add("play-state");
  }
}

function refreshCountdown() {
  const pauseIcon = document.getElementById("pause-icon");
  clearInterval(intervalId);
  if (pauseIcon) {
    pauseIcon.setAttribute("name", "play-outline");
    pauseIcon.classList.add("play-state");
  }

  leftTime = rightTime = startTime;
  currentTimer = startwhite();
  isRunning = false;

  const leftbox = document.querySelector('.left-box .counter');
  if (leftbox) leftbox.classList.remove('active');
  const rightbox = document.querySelector('.right-box .counter');
  if (rightbox) rightbox.classList.remove('active');

  updateTimerDisplay();
}

// ====== Keyboard / Touch controls ======
document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    event.preventDefault();

    if (!isRunning) {
      isRunning = true;
      togglePause();
      startCountdown();
    } else {
      switchTimer();
    }
  }
});

document.addEventListener('touchstart', (event) => {
  if (!touchBox) return;

  if (Array.from(touchBox).includes(event.target)) {
    if (!isRunning) {
      isRunning = true;
      togglePause();
      startCountdown();
    } else {
      switchTimer();
    }
  }
});

// ====== Initial paint ======
updateTimerDisplay();
