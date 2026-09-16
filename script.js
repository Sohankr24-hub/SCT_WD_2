/* ==========================================
   CHRONOX STOPWATCH
   SkillCraft Technology - SCT_WD_2
   ========================================== */


/* ---------------- ELEMENTS ---------------- */

const display = document.getElementById("display");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const lapBtn = document.getElementById("lapBtn");

const lapList = document.getElementById("lapList");
const lapCount = document.getElementById("lapCount");

const statusText = document.getElementById("statusText");
const emptyState = document.getElementById("emptyState");


/* ---------------- VARIABLES ---------------- */

let startTime = 0;
let elapsedTime = 0;

let timerInterval = null;

let isRunning = false;

let previousLapTime = 0;
let lapNumber = 0;


/* ---------------- FORMAT TIME ---------------- */

function formatTime(time) {

    let milliseconds = Math.floor((time % 1000) / 10);

    let totalSeconds = Math.floor(time / 1000);

    let seconds = totalSeconds % 60;

    let totalMinutes = Math.floor(totalSeconds / 60);

    let minutes = totalMinutes % 60;

    let hours = Math.floor(totalMinutes / 60);


    return (
        String(hours).padStart(2, "0") +
        ":" +
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0") +
        "." +
        String(milliseconds).padStart(2, "0")
    );
}


/* ---------------- UPDATE DISPLAY ---------------- */

function updateDisplay() {

    const currentTime = Date.now();

    const currentElapsed =
        currentTime - startTime + elapsedTime;

    display.textContent = formatTime(currentElapsed);
}


/* ---------------- START ---------------- */

function startStopwatch() {

    if (isRunning) return;

    startTime = Date.now();

    isRunning = true;

    timerInterval = setInterval(updateDisplay, 10);

    statusText.textContent = "RUNNING";

    startBtn.style.opacity = "0.55";
}


/* ---------------- PAUSE ---------------- */

function pauseStopwatch() {

    if (!isRunning) return;

    elapsedTime += Date.now() - startTime;

    clearInterval(timerInterval);

    timerInterval = null;

    isRunning = false;

    statusText.textContent = "PAUSED";

    startBtn.style.opacity = "1";

    updateDisplay();
}


/* ---------------- RESET ---------------- */

function resetStopwatch() {

    clearInterval(timerInterval);

    timerInterval = null;

    startTime = 0;

    elapsedTime = 0;

    previousLapTime = 0;

    lapNumber = 0;

    isRunning = false;

    display.textContent = "00:00:00.00";

    statusText.textContent = "READY";

    startBtn.style.opacity = "1";

    lapCount.textContent = "0";

    lapList.innerHTML = "";

    lapList.appendChild(emptyState);

    emptyState.style.display = "block";
}


/* ---------------- GET CURRENT TIME ---------------- */

function getCurrentElapsedTime() {

    if (isRunning) {

        return Date.now() - startTime + elapsedTime;

    }

    return elapsedTime;
}


/* ---------------- LAP ---------------- */

function recordLap() {

    const currentTime = getCurrentElapsedTime();

    if (currentTime <= 0) return;


    lapNumber++;

    const lapTime = currentTime - previousLapTime;

    previousLapTime = currentTime;


    /* Remove empty message */

    if (emptyState) {
        emptyState.style.display = "none";
    }


    /* Create row */

    const row = document.createElement("div");

    row.className = "lap-row";


    row.innerHTML = `

        <div class="lap-number">
            LAP ${String(lapNumber).padStart(2, "0")}
        </div>

        <div class="lap-time">
            ${formatTime(lapTime)}
        </div>

        <div class="lap-total">
            ${formatTime(currentTime)}
        </div>

    `;


    lapList.prepend(row);

    lapCount.textContent = lapNumber;
}


/* ---------------- BUTTON EVENTS ---------------- */

startBtn.addEventListener("click", startStopwatch);

pauseBtn.addEventListener("click", pauseStopwatch);

resetBtn.addEventListener("click", resetStopwatch);

lapBtn.addEventListener("click", recordLap);


/* ---------------- KEYBOARD SHORTCUTS ---------------- */

document.addEventListener("keydown", function(event) {

    /* Space = Start / Pause */

    if (event.code === "Space") {

        event.preventDefault();

        if (isRunning) {
            pauseStopwatch();
        } else {
            startStopwatch();
        }
    }


    /* L = Lap */

    if (event.key.toLowerCase() === "l") {

        recordLap();
    }


    /* R = Reset */

    if (event.key.toLowerCase() === "r") {

        resetStopwatch();
    }

});
