// Handles voice commands, art data, and Easter eggs
const artPieces = [
    { title: 'Abstract Waves', desc: 'Procedural shader art simulating ocean waves.', room: 1 },
    { title: 'Geometric Sculpture', desc: 'Interactive 3D geometry that rotates on command.', room: 2 },
    { title: 'Secret Masterpiece', desc: 'Hidden art: A glowing fractal only revealed via Easter egg.', room: 'secret', hidden: true },
];

let currentRoom = 1;
let selectedArt = null;

// Voice recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition ? new SpeechRecognition() : null;
if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        processCommand(command);
    };
    recognition.start();
}

// Process commands
function processCommand(cmd) {
    if (cmd.includes('go to room 1')) window.switchRoom(1);
    else if (cmd.includes('go to room 2')) window.switchRoom(2);
    else if (cmd.includes('zoom in')) window.zoomIn();
    else if (cmd.includes('zoom out')) window.zoomOut();
    else if (cmd.includes('rotate')) window.rotateArt();
    else if (cmd.includes('glow')) window.makeGlow();
    else if (cmd.includes('easter egg')) window.triggerEasterEgg('fireworks');
    else if (cmd.includes('open sesame')) window.revealSecret();
    else if (cmd.includes('show art')) window.showArtDetails(artPieces.find(a => a.room === currentRoom));
    if (recognition) recognition.start();
}

// Fallback text input
document.getElementById('voice-fallback').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        processCommand(e.target.value.toLowerCase());
        e.target.value = '';
    }
});

// Art details UI
document.addEventListener('DOMContentLoaded', () => {
    const info = document.getElementById('art-info');
    const title = document.getElementById('art-title');
    const desc = document.getElementById('art-desc');
    const closeBtn = document.getElementById('close-btn');

    window.showArtDetails = (art) => {
        if (art) {
            selectedArt = art;
            title.textContent = art.title;
            desc.textContent = art.desc;
            info.classList.remove('hidden');
        }
    };

    closeBtn.addEventListener('click', () => {
        info.classList.add('hidden');
        selectedArt = null;
    });
});

// Easter egg: Konami code
let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
let konamiIndex = 0;
document.addEventListener('keydown', (e) => {
    if (e.code === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            window.triggerEasterEgg('reveal');
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

// Easter egg: Device shake
let shakeThreshold = 15;
let lastShake = { x: 0, y: 0, z: 0 };
if (window.DeviceOrientationEvent) {
    window.addEventListener('devicemotion', (e) => {
        const acc = e.accelerationIncludingGravity;
        const deltaX = Math.abs(acc.x - lastShake.x);
        const deltaY = Math.abs(acc.y - lastShake.y);
        const deltaZ = Math.abs(acc.z - lastShake.z);
        if (deltaX + deltaY + deltaZ > shakeThreshold) {
            window.triggerEasterEgg('shake');
        }
        lastShake = { x: acc.x, y: acc.y, z: acc.z };
    });
}
