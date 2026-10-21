/* =========================================
   LOADING SCREEN
========================================= */

let progress = 0;

const progressBar = document.getElementById("progressBar");
const percentage = document.getElementById("percentage");
const loadingText = document.getElementById("loadingText");

const loadingMessages = [
    "Initializing...",
    "Loading smart tools...",
    "Preparing workspace...",
    "Almost ready...",
    "Welcome to NovaHub!"
];

const loadingInterval = setInterval(() => {

    progress++;

    progressBar.style.width = progress + "%";
    percentage.textContent = progress;

    if (progress === 20) {
        loadingText.textContent = loadingMessages[1];
    }

    if (progress === 45) {
        loadingText.textContent = loadingMessages[2];
    }

    if (progress === 75) {
        loadingText.textContent = loadingMessages[3];
    }

    if (progress === 100) {

        loadingText.textContent = loadingMessages[4];

        clearInterval(loadingInterval);

        setTimeout(() => {

            document
                .getElementById("loadingScreen")
                .classList.add("hidden");

            document
                .getElementById("logoScreen")
                .classList.remove("hidden");

            setTimeout(() => {

                document
                    .getElementById("logoScreen")
                    .classList.add("hidden");

                document
                    .getElementById("homeScreen")
                    .classList.remove("hidden");

            }, 2000);

        }, 500);

    }

}, 35);


/* =========================================
   TOOL NAVIGATION
========================================= */

function openTool(tool) {

    document
        .getElementById("homeScreen")
        .classList.add("hidden");

    document
        .getElementById(tool + "Tool")
        .classList.remove("hidden");

    if (tool === "notes") {
        loadNotes();
    }

    if (tool === "gallery") {
        loadGallery();
    }

    if (tool === "clock") {
        updateClock();
    }

}


function closeTool() {

    document
        .querySelectorAll(".tool-page")
        .forEach(page => {
            page.classList.add("hidden");
        });

    document
        .getElementById("homeScreen")
        .classList.remove("hidden");

}


/* =========================================
   HEADER CLOCK
========================================= */

function updateHeaderClock() {

    const now = new Date();

    const time = now.toLocaleTimeString();

    document.getElementById("headerTime").textContent = time;

}

setInterval(updateHeaderClock, 1000);
updateHeaderClock();


/* =========================================
   CALCULATOR
========================================= */

let calcValue = "";

function addNumber(number) {

    calcValue += number;

    document.getElementById("calcDisplay").value = calcValue;

}


function addOperator(operator) {

    if (calcValue === "") return;

    calcValue += operator;

    document.getElementById("calcDisplay").value = calcValue;

}


function clearCalculator() {

    calcValue = "";

    document.getElementById("calcDisplay").value = "";

}


function deleteNumber() {

    calcValue = calcValue.slice(0, -1);

    document.getElementById("calcDisplay").value = calcValue;

}


function calculate() {

    try {

        const result = Function(
            '"use strict"; return (' + calcValue + ')'
        )();

        calcValue = String(result);

        document.getElementById("calcDisplay").value = calcValue;

    } catch {

        document.getElementById("calcDisplay").value = "Error";

        calcValue = "";

    }

}


function calculatePercent() {

    try {

        const result = Function(
            '"use strict"; return (' + calcValue + ')'
        )();

        calcValue = String(result / 100);

        document.getElementById("calcDisplay").value = calcValue;

    } catch {

        clearCalculator();

    }

}


/* =========================================
   NOTES
========================================= */

function saveNote() {

    const title =
        document.getElementById("noteTitle").value.trim();

    const content =
        document.getElementById("noteContent").value.trim();

    if (!title && !content) {

        alert("Please write something first.");

        return;

    }

    const notes =
        JSON.parse(localStorage.getItem("novaNotes")) || [];

    notes.unshift({

        id: Date.now(),

        title: title || "Untitled Note",

        content: content,

        date: new Date().toLocaleString()

    });

    localStorage.setItem(
        "novaNotes",
        JSON.stringify(notes)
    );

    document.getElementById("noteTitle").value = "";
    document.getElementById("noteContent").value = "";

    loadNotes();

}


function loadNotes() {

    const notes =
        JSON.parse(localStorage.getItem("novaNotes")) || [];

    const notesList =
        document.getElementById("notesList");

    notesList.innerHTML = "";

    if (notes.length === 0) {

        notesList.innerHTML = `
            <div class="note">
                <p>No notes yet. Create your first note!</p>
            </div>
        `;

        return;

    }

    notes.forEach(note => {

        const noteElement =
            document.createElement("div");

        noteElement.className = "note";

        noteElement.innerHTML = `

            <h3>${escapeHTML(note.title)}</h3>

            <p>${escapeHTML(note.content)}</p>

            <small>${note.date}</small>

            <br>

            <button
                class="delete-note"
                onclick="deleteNote(${note.id})"
            >
                Delete
            </button>

        `;

        notesList.appendChild(noteElement);

    });

}


function deleteNote(id) {

    let notes =
        JSON.parse(localStorage.getItem("novaNotes")) || [];

    notes =
        notes.filter(note => note.id !== id);

    localStorage.setItem(
        "novaNotes",
        JSON.stringify(notes)
    );

    loadNotes();

}


function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* =========================================
   CLOCK
========================================= */

function updateClock() {

    const now = new Date();

    document.getElementById("bigClock")
        .textContent =
        now.toLocaleTimeString();

    document.getElementById("clockDate")
        .textContent =
        now.toLocaleDateString(
            undefined,
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );

}

setInterval(updateClock, 1000);
updateClock();


/* =========================================
   STOPWATCH
========================================= */

let stopwatchSeconds = 0;
let stopwatchInterval = null;


function updateStopwatchDisplay() {

    const hours =
        Math.floor(stopwatchSeconds / 3600);

    const minutes =
        Math.floor(
            (stopwatchSeconds % 3600) / 60
        );

    const seconds =
        stopwatchSeconds % 60;

    document.getElementById(
        "stopwatchDisplay"
    ).textContent =

        String(hours).padStart(2, "0") + ":" +

        String(minutes).padStart(2, "0") + ":" +

        String(seconds).padStart(2, "0");

}


function startStopwatch() {

    if (stopwatchInterval) return;

    stopwatchInterval =
        setInterval(() => {

            stopwatchSeconds++;

            updateStopwatchDisplay();

        }, 1000);

}


function stopStopwatch() {

    clearInterval(stopwatchInterval);

    stopwatchInterval = null;

}


function resetStopwatch() {

    stopStopwatch();

    stopwatchSeconds = 0;

    updateStopwatchDisplay();

}


/* =========================================
   CAMERA
========================================= */

let cameraStream = null;


async function startCamera() {

    try {

        cameraStream =
            await navigator.mediaDevices.getUserMedia({
                video: true
            });

        document.getElementById(
            "cameraVideo"
        ).srcObject = cameraStream;

        document.getElementById(
            "cameraMessage"
        ).textContent = "Camera is ready.";

    } catch (error) {

        document.getElementById(
            "cameraMessage"
        ).textContent =
            "Camera permission was denied or unavailable.";

    }

}


function takePhoto() {

    if (!cameraStream) {

        alert("Please start the camera first.");

        return;

    }

    const video =
        document.getElementById("cameraVideo");

    const canvas =
        document.getElementById("cameraCanvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context =
        canvas.getContext("2d");

    context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );

    canvas.toBlob(blob => {

        const reader =
            new FileReader();

        reader.onload = function () {

            saveGalleryImage(reader.result);

            alert("Photo captured!");

        };

        reader.readAsDataURL(blob);

    });

}


/* =========================================
   GALLERY
========================================= */

function saveGalleryImage(image) {

    const images =
        JSON.parse(
            localStorage.getItem("novaGallery")
        ) || [];

    images.unshift({

        id: Date.now(),

        image: image

    });

    localStorage.setItem(
        "novaGallery",
        JSON.stringify(images)
    );

}


function loadGallery() {

    const images =
        JSON.parse(
            localStorage.getItem("novaGallery")
        ) || [];

    const gallery =
        document.getElementById("galleryGrid");

    gallery.innerHTML = "";

    if (images.length === 0) {

        gallery.innerHTML = `
            <p style="color:#8c96ad">
                Your gallery is empty.
            </p>
        `;

        return;

    }

    images.forEach(item => {

        const div =
            document.createElement("div");

        div.className = "gallery-item";

        div.innerHTML = `

            <img src="${item.image}">

            <button
                class="gallery-delete"
                onclick="deleteImage(${item.id})"
            >
                ×
            </button>

        `;

        gallery.appendChild(div);

    });

}


function uploadImages(event) {

    const files = event.target.files;

    Array.from(files).forEach(file => {

        const reader =
            new FileReader();

        reader.onload = function () {

            saveGalleryImage(reader.result);

            loadGallery();

        };

        reader.readAsDataURL(file);

    });

}


function deleteImage(id) {

    let images =
        JSON.parse(
            localStorage.getItem("novaGallery")
        ) || [];

    images =
        images.filter(
            image => image.id !== id
        );

    localStorage.setItem(
        "novaGallery",
        JSON.stringify(images)
    );

    loadGallery();

}
