// 3D gallery with rooms, procedural art, and Easter egg effects
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('three-canvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1);

// Rooms (simple cubes for walls/floors)
const room1 = createRoom(0x222222);
const room2 = createRoom(0x333333);
room2.visible = false;
scene.add(room1, room2);

// Art pieces
const art1Geometry = new THREE.PlaneGeometry(2, 2);
const art1Material = new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 } },
    vertexShader: `
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        void main() {
            vec2 uv = gl_FragCoord.xy / vec2(800.0, 600.0);
            float wave = sin(uv.x * 10.0 + time) * 0.5 + 0.5;
            gl_FragColor = vec4(wave, 0.5, 1.0 - wave, 1.0);
        }
    `,
});
const art1 = new THREE.Mesh(art1Geometry, art1Material);
art1.position.set(0, 0, -2);
room1.add(art1);

const art2Geometry = new THREE.BoxGeometry(1, 1, 1);
const art2Material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const art2 = new THREE.Mesh(art2Geometry, art2Material);
art2.position.set(0, 0, -2);
room2.add(art2);

// Secret art (Easter egg)
const secretArtGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const secretArtMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x004400 });
const secretArt = new THREE.Mesh(secretArtGeometry, secretArtMaterial);
secretArt.position.set(0, 0, -2);
secretArt.visible = false;
scene.add(secretArt);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(0, 10, 0);
scene.add(spotLight);

// Camera
camera.position.set(0, 0, 5);

// Room switching
window.switchRoom = (roomNum) => {
    room1.visible = roomNum === 1;
    room2.visible = roomNum === 2;
    currentRoom = roomNum;
};

// Voice-controlled functions
window.zoomIn = () => { camera.position.z -= 0.5; };
window.zoomOut = () => { camera.position.z += 0.5; };
window.rotateArt = () => {
    if (currentRoom === 1) art1.rotation.y += 0.1;
    else if (currentRoom === 2) art2.rotation.x += 0.1;
};
window.makeGlow = () => {
    if (currentRoom === 1) art1Material.emissive.setHex(0x444444);
    else if (currentRoom === 2) art2Material.emissive.setHex(0x444444);
};
window.revealSecret = () => { secretArt.visible = true; };

// Easter egg triggers
window.triggerEasterEgg = (type) => {
    if (type === 'fireworks') {
        // Temporary particle burst
        const particleGeometry = new THREE.SphereGeometry(0.05, 8, 8);
        for (let i = 0; i < 20; i++) {
            const particle = new THREE.Mesh(particleGeometry, new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff }));
            particle.position.set(Math.random() * 4 - 2, Math.random() * 4 - 2, Math.random() * 4 - 2);
            scene.add(particle);
            setTimeout(() => scene.remove(particle), 3000);
        }
    } else if (type === 'reveal') {
        secretArt.visible = true;
    } else if (type === 'shake') {
        camera.position.x += Math.random() * 0.2 - 0.1;
        camera.position.y += Math.random() * 0.2 - 0.1;
    }
};

// Helper: Create room
function createRoom(color) {
    const room = new THREE.Group();
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshLambertMaterial({ color }));
    floor.rotation.x = -Math.PI / 2;
    room.add(floor);
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), new THREE.MeshLambertMaterial({ color }));
    wall.position.z = -5;
    room.add(wall);
    return room;
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    art1Material.uniforms.time.value += 0.01; // Animate shader
    renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
