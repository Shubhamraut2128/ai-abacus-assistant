// ================= AI ASSISTANT =================

async function solveMath() {
    const question = document.getElementById("question").value;

    const response = await fetch("http://127.0.0.1:8000/solve", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ question })
    });

    const data = await response.json();

    document.getElementById("result").innerHTML = `
        <p><b>Steps:</b></p>
        <pre>${JSON.stringify(data.steps, null, 2)}</pre>

        <p><b>Explanation:</b></p>
        <p>${data.explanation}</p>
    `;
}


// ================= VOICE INPUT =================

function startVoice() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById("question").value = transcript;
    };

    recognition.start();
}


// ================= TEXT TO SPEECH =================

function speak(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
}


// ================= ABACUS UI =================

const abacus = document.getElementById("abacus");

for (let i = 0; i < 3; i++) {

    const rod = document.createElement("div");
    rod.className = "rod";

    // Upper bead
    const upper = createBead("upper");
    rod.appendChild(upper);

    // Lower beads
    for (let j = 0; j < 4; j++) {
        const lower = createBead("lower");
        rod.appendChild(lower);
    }

    abacus.appendChild(rod);
}


// ================= DRAG LOGIC =================

function createBead(type) {
    const bead = document.createElement("div");
    bead.className = `bead ${type}`;

    let isDragging = false;
    let startY = 0;

    bead.addEventListener("mousedown", (e) => {
        isDragging = true;
        startY = e.clientY;
        bead.style.transition = "none";
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;

        let diff = e.clientY - startY;
        bead.style.transform = `translateY(${diff}px)`;
    });

    document.addEventListener("mouseup", () => {
        if (!isDragging) return;
        isDragging = false;

        bead.style.transition = "0.3s ease";

        let matrix = new DOMMatrixReadOnly(
            window.getComputedStyle(bead).transform
        );

        let y = matrix.m42;

        if (y < -30) {
            bead.style.transform = "translateY(-60px)";
            speak("Bead moved upward");
        } else if (y > 30) {
            bead.style.transform = "translateY(60px)";
            speak("Bead moved downward");
        } else {
            bead.style.transform = "translateY(0px)";
        }
    });

    return bead;
}


// ================= TEACH MODE =================

// Show / Hide Teach Mode
function enableTeachMode() {
    document.getElementById("teachSection").style.display = "block";
}

function disableTeachMode() {
    document.getElementById("teachSection").style.display = "none";
    document.getElementById("teachSteps").innerHTML = "";
}


// Add step UI
function addStep(text) {
    const stepsDiv = document.getElementById("teachSteps");
    const p = document.createElement("p");
    p.innerText = text;
    stepsDiv.appendChild(p);
}


// Highlight beads
function highlightBeads(upperUsed, lowerUsed) {
    const rods = document.querySelectorAll(".rod");

    rods.forEach(rod => {
        const upper = rod.querySelector(".upper");
        const lowers = rod.querySelectorAll(".lower");

        // Reset
        upper.classList.remove("active-upper");
        lowers.forEach(l => l.classList.remove("active-lower"));

        // Upper bead
        if (upperUsed === 1) {
            upper.classList.add("active-upper");
        }

        // Lower beads
        for (let i = 0; i < lowerUsed; i++) {
            if (lowers[i]) {
                lowers[i].classList.add("active-lower");
            }
        }
    });
}


// Teach number logic
function teachNumber() {
    const num = parseInt(document.getElementById("teachNumber").value);

    if (isNaN(num) || num < 0 || num > 9) {
        alert("Enter number between 0-9");
        return;
    }

    const stepsDiv = document.getElementById("teachSteps");
    stepsDiv.innerHTML = "";

    let upperUsed = 0;
    let lowerUsed = 0;
    let remaining = num;

    // Step 1: Upper bead
    if (remaining >= 5) {
        upperUsed = 1;
        remaining -= 5;

        addStep("Step 1: Move upper bead down (value = 5)");
        speak("Move upper bead down for five");
    }

    // Step 2: Lower beads
    if (remaining > 0) {
        lowerUsed = remaining;

        addStep(`Step 2: Move ${remaining} lower bead(s) up`);
        speak(`Move ${remaining} lower beads up`);
    }

    // Step 3: Final
    addStep(`Final number = ${num}`);
    speak(`Final number is ${num}`);

    // Visual highlight
    highlightBeads(upperUsed, lowerUsed);
}