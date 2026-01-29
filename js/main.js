let laserAdded = false;
let gratingAdded = false;
let screenAdded = false;
let simulationStarted = false;

/* START / RESET SIMULATION */
function startSimulation() {
    simulationStarted = true;

    document.getElementById("message").innerText = ">> Simulator Running";
    document.getElementById("diffractionScreen").style.display = "flex";
    document.getElementById("range-container").style.display = "block";
    document.getElementById("addObservationBtn").disabled = false;

    disableButtonsAfterStart();
    updateMessage();
}

function resetSimulation() {
    document.getElementById("message").innerText = ">> Simulator Reset";

    document.getElementById("diffractionScreen").style.display = "none";
    document.getElementById("range-container").style.display = "none";
    document.getElementById("addObservationBtn").disabled = true;

    document.getElementById("distance").value = 5;
    document.getElementById("distance-value").innerText = "5 cm";

    resetButtons();
    completedDistances.clear();

    setTimeout(() => {
        document.getElementById("message").innerText = ">> Simulation Reset";
    }, 500);
}

/* SLIDER (SINGLE LISTENER) */
document.getElementById("distance").addEventListener("input", function () {
    const value = parseFloat(this.value);

    document.getElementById("distance-value").innerText = value + " cm";

    updateDots(value);
    moveGrating(value);
    updateMessage();
});

function updateDots(value) {
    const dots = document.querySelectorAll(".dot");
    const spacing = value * 4;

    dots[0].style.left = `calc(50% - ${spacing * 2}px)`;
    dots[1].style.left = `calc(50% - ${spacing}px)`;
    dots[2].style.left = `50%`;
    dots[3].style.left = `calc(50% + ${spacing}px)`;
    dots[4].style.left = `calc(50% + ${spacing * 2}px)`;
}

/* MESSAGE UPDATE */
function updateMessage() {
    const distance = parseFloat(document.getElementById("distance").value);

    const S1 = Math.abs(distance - 7.9).toFixed(1);
    const S2 = Math.abs(distance + 20.5).toFixed(1);

    document.getElementById("message").innerText =
        `>> Distance Between Screen and Grating: ${distance} cm\n` +
        `>> 0th Order and 1st Order Interference (S1): ${S1} cm\n` +
        `>> 0th Order and 2nd Order Interference (S2): ${S2} cm`;
}

/* TOGGLE COMPONENTS */
function toggleLaser() {
    if (simulationStarted) return;

    const laser = document.getElementById("laser");
    laser.style.display = (laser.style.display === "block") ? "none" : "block";

    laserAdded = !laserAdded;
    document.getElementById("message").innerText =
        laserAdded ? ">> Laser Source Added" : ">> Laser Source Removed";

    toggleTurnOnButton();
}

function toggleGrating() {
    if (simulationStarted) return;

    const grating = document.getElementById("grating");
    grating.style.display = (grating.style.display === "flex") ? "none" : "flex";

    gratingAdded = !gratingAdded;
    document.getElementById("message").innerText =
        gratingAdded ? ">> Grating Added" : ">> Grating Removed";

    toggleTurnOnButton();
}

function toggleScreen() {
    if (simulationStarted) return;

    const screen = document.getElementById("screen");
    screen.style.display = (screen.style.display === "block") ? "none" : "block";

    screenAdded = !screenAdded;
    document.getElementById("message").innerText =
        screenAdded ? ">> Screen Added" : ">> Screen Removed";

    toggleTurnOnButton();
}

function toggleTurnOnButton() {
    document.getElementById("turnOn").disabled = !(laserAdded && gratingAdded && screenAdded);
}

/* BUTTON STATE CONTROL */
function resetButtons() {
    laserAdded = gratingAdded = screenAdded = false;
    simulationStarted = false;

    document.getElementById("turnOn").disabled = true;
    document.getElementById("laser").style.display = "none";
    document.getElementById("grating").style.display = "none";
    document.getElementById("screen").style.display = "none";

    enableButtons();
}

function disableButtonsAfterStart() {
    document.getElementById("laserBtn").disabled = true;
    document.getElementById("gratingBtn").disabled = true;
    document.getElementById("screenBtn").disabled = true;
}

function enableButtons() {
    document.getElementById("laserBtn").disabled = false;
    document.getElementById("gratingBtn").disabled = false;
    document.getElementById("screenBtn").disabled = false;
}

/* GRATING MOVEMENT */
function moveGrating(distance) {
    const grating = document.getElementById("grating");
    const displayWidth = document.querySelector(".display-area").offsetWidth;

    const min = 0.21 * displayWidth;
    const max = 0.7 * displayWidth;

    const position = min + (distance / 40) * (max - min);
    grating.style.left = `${position}px`;
}

/* OBSERVATION TABLE */
let obsCount = 0;
const d = 1.8678e-4;
let completedDistances = new Set();

document.getElementById("addObservationBtn").addEventListener("click", () => {

    if (!simulationStarted) {
        alert("Please turn ON the simulator first");
        return;
    }

    const L = parseFloat(document.getElementById("distance").value);

    if (completedDistances.has(L)) {
        alert(`Observation for L = ${L} cm is already completed.`);
        return;
    }

    const S1 = Math.abs(L - 7.9);
    const S2 = Math.abs(L + 20.5);

    addRow(1, L, S1);
    addRow(2, L, S2);

    completedDistances.add(L);
});

function addRow(n, L, S) {
    const thetaRad = Math.atan(S / (2 * L));
    const thetaDeg = (thetaRad * 180 / Math.PI).toFixed(2);

    const lambda_cm = (d * Math.sin(thetaRad)) / n;
    const lambda_nm = (lambda_cm * 1e7).toFixed(2);

    obsCount++;

    const row = `
        <tr>
            <td>${obsCount}</td>
            <td>${n}</td>
            <td>${L}</td>
            <td>${S.toFixed(1)}</td>
            <td>${thetaDeg}</td>
            <td>1.8678 × 10⁻⁴</td>
            <td>${lambda_nm}</td>
        </tr>
    `;

    document.querySelector("#observationTable tbody")
        .insertAdjacentHTML("beforeend", row);
}

document.getElementById("clearObservationBtn").addEventListener("click", () => {
    document.querySelector("#observationTable tbody").innerHTML = "";
    obsCount = 0;
    completedDistances.clear();
});

/* PROCEDURE AUTO SHOW / HIDE */
window.addEventListener("load", () => {
    const box = document.getElementById("procedureBox");

    box.style.display = "block";

    setTimeout(() => {
        box.style.display = "none";
    }, 10000);
});

document.getElementById("procedureToggle").addEventListener("click", () => {
    const box = document.getElementById("procedureBox");
    box.style.display = (box.style.display === "none" || box.style.display === "")
        ? "block"
        : "none";
});
