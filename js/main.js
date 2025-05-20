let laserAdded = false;
let gratingAdded = false;
let screenAdded = false;
let simulationStarted = false;

function startSimulation() {
    simulationStarted = true;
    document.getElementById("message").innerText = ">> Simulator Running";
    document.getElementById("diffractionScreen").style.display = "flex"; // Change to "flex"
    document.getElementById("range-container").style.display = "block";
    disableButtonsAfterStart();
    updateMessage();
    initializePositions();
}

function resetSimulation() {
    document.getElementById("message").innerText = ">> Simulator Reset";
    document.getElementById("diffractionScreen").style.display = "none";
    document.getElementById("range-container").style.display = "none";
    document.getElementById("distance").value = 5;
    document.getElementById("distance-value").innerText = "5 cm";
    resetButtons();
    initializePositions();
    setTimeout(() => {
        document.getElementById("message").innerText = ">> Simulation Reset";
    }, 500);
}

document.getElementById("distance").addEventListener("input", function () {
    const value = this.value;
    const dots = document.querySelectorAll(".dot");
    const spacing = value * 4;
    dots[0].style.left = `calc(50% - ${spacing * 2}px)`;
    dots[1].style.left = `calc(50% - ${spacing}px)`;
    dots[2].style.left = `50%`;
    dots[3].style.left = `calc(50% + ${spacing}px)`;
    dots[4].style.left = `calc(50% + ${spacing * 2}px)`;
});

document.getElementById("distance").addEventListener("input", function () {
    let distanceValue = parseFloat(this.value);
    document.getElementById("distance-value").innerText = this.value + " cm";
    updateMessage();
    moveGrating(distanceValue);
});

function updateMessage() {
    const distance = parseFloat(document.getElementById("distance").value);
    const S1 = (distance - 7.9).toFixed(1);
    const S2 = (distance + 20.5).toFixed(1);
    document.getElementById("message").innerText =
        `>> Distance Between Screen and Grating: ${distance} cm\n` +
        `>> 0th Order and 1st Order Interference (S1): ${S1} cm\n` +
        `>> 0th Order and 2nd Order Interference (S2): ${S2} cm`;
}

function toggleLaser() {
    if (!simulationStarted) {
        const laser = document.getElementById("laser");
        if (laser.style.display === "none" || laser.style.display === "") {
            laser.style.display = "block"; // Show the laser
            document.getElementById("message").innerText = ">> Laser Source Added"; // Update the message box
        } else {
            laser.style.display = "none"; // Hide the laser
            document.getElementById("message").innerText = ">> Laser Source Removed"; // Update the message box
        }
        laserAdded = !laserAdded;
        toggleTurnOnButton();
    }
}

function toggleGrating() {
    if (!simulationStarted) {
        const grating = document.getElementById("grating");
        if (grating.style.display === "none" || grating.style.display === "") {
            grating.style.display = "flex"; // Make it visible
            document.getElementById("message").innerText = ">> Grating Added"; // Update the message box
        } else {
            grating.style.display = "none"; // Hide the grating
            document.getElementById("message").innerText = ">> Grating Removed"; // Update the message box
        }
        gratingAdded = !gratingAdded;
        toggleTurnOnButton();
    }
}

function toggleScreen() {
    if (!simulationStarted) {
        const screen = document.getElementById("screen");
        if (screen.style.display === "none" || screen.style.display === "") {
            screen.style.display = "block"; // Show the screen
            document.getElementById("message").innerText = ">> Screen Added"; // Update the message box
        } else {
            screen.style.display = "none"; // Hide the screen
            document.getElementById("message").innerText = ">> Screen Removed"; // Update the message box
        }
        screenAdded = !screenAdded;
        toggleTurnOnButton();
    }
}

function toggleTurnOnButton() {
    const turnOnButton = document.getElementById("turnOn");
    if (laserAdded && gratingAdded && screenAdded) {
        turnOnButton.disabled = false;
    } else {
        turnOnButton.disabled = true;
    }
}

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
    simulationStarted = true;
    document.getElementById("laserBtn").disabled = true;
    document.getElementById("gratingBtn").disabled = true;
    document.getElementById("screenBtn").disabled = true;
}

function enableButtons() {
    simulationStarted = false;
    document.getElementById("laserBtn").disabled = false;
    document.getElementById("gratingBtn").disabled = false;
    document.getElementById("screenBtn").disabled = false;
}

// Set initial positions for the simulation elements
function initializePositions() {
    const defaultPosition = 0.21 * displayWidth + (20 / 40) * (0.7 - 0.21) * displayWidth;
    grating.style.left = `${defaultPosition}px`;
}



function moveGrating(distance) {
    const grating = document.getElementById("grating");
    const displayWidth = document.querySelector('.display-area').offsetWidth;
    const minPosition = 0.21 * displayWidth;
    const maxPosition = 0.7 * displayWidth;
    const newPosition = minPosition + (distance / 40) * (maxPosition - minPosition);

    grating.style.left = `${newPosition}px`;

}


