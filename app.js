class AudioVisualizer {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.sphere = null;
        this.audioContext = null;
        this.analyser = null;
        this.audioSource = null;
        this.audioElement = null;
        this.dataArray = null;
        this.isPlaying = false;
        this.currentFile = null;
        this.animationId = null;
        this.particles = [];
        this.isInitialized = false;
        // Visualization settings
        this.visualizationMode = 'frequency';
        this.sensitivity = 1.0;
    }

    async init() {
        console.log('Initializing AudioVisualizer...');
        try {
            // Wait for Three.js to be loaded
            await this.waitForThree();
            this.initThree();
            this.createSphere();
            this.setupLighting();
            this.setupControls();
            this.setupEventListeners();
            this.animate();
            this.isInitialized = true;
            console.log('AudioVisualizer initialized successfully');
        } catch (error) {
            console.error('Failed to initialize AudioVisualizer:', error);
            this.showError('Failed to initialize 3D visualizer: ' + error.message);
        }
    }

    waitForThree() {
        return new Promise((resolve, reject) => {
            if (window.THREE) {
                resolve();
                return;
            }

            let attempts = 0;
            const maxAttempts = 50; // 5 seconds
            const checkThree = () => {
                attempts++;
                if (window.THREE) {
                    resolve();
                } else if (attempts >= maxAttempts) {
                    reject(new Error('Three.js failed to load'));
                } else {
                    setTimeout(checkThree, 100);
                }
            };
            checkThree();
        });
    }

    initThree() {
        const canvas = document.getElementById('visualizerCanvas');
        const container = document.getElementById('canvasContainer');
        if (!canvas || !container) {
            throw new Error('Canvas or container not found');
        }

        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x2D1B69); // Changed to purple background

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            container.offsetWidth / container.offsetHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 5);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: false
        });
        this.renderer.setSize(container.offsetWidth, container.offsetHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Handle resize
        window.addEventListener('resize', () => this.onWindowResize());
        console.log('Three.js scene initialized');
    }

    createSphere() {
        if (!this.scene) {
            throw new Error('Scene not initialized');
        }

        // Create sphere geometry with enough segments for smooth deformation
        const geometry = new THREE.SphereGeometry(1.5, 64, 32);

        // Create material with new orange color
        const material = new THREE.MeshPhongMaterial({
            color: 0xFF6B35, // Changed to orange sphere color
            wireframe: false,
            transparent: true,
            opacity: 0.9,
            shininess: 100
        });

        this.sphere = new THREE.Mesh(geometry, material);
        this.sphere.castShadow = true;
        this.sphere.receiveShadow = true;
        this.scene.add(this.sphere);

        // Store original positions for animation
        this.originalPositions = this.sphere.geometry.attributes.position.array.slice();

        // Create particle system
        this.createParticles();
        console.log('3D sphere created and added to scene');
    }

    createParticles() {
        const particleCount = 1000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            // Random positions around sphere
            const radius = 2 + Math.random() * 3;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);

            // Updated particle colors to complement orange sphere
            colors[i * 3] = 0.9 + Math.random() * 0.1;     // More red
            colors[i * 3 + 1] = 0.4 + Math.random() * 0.3;  // Orange-ish green
            colors[i * 3 + 2] = 0.1 + Math.random() * 0.3;  // Less blue
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });

        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
        this.particleSystem.visible = false;
        console.log('Particle system created');
    }

    setupLighting() {
        if (!this.scene) return;

        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        // Main point light - updated to complement orange sphere
        const pointLight = new THREE.PointLight(0xFF6B35, 1.5, 100);
        pointLight.position.set(0, 5, 5);
        pointLight.castShadow = true;
        this.scene.add(pointLight);

        // Additional colored lights - updated colors
        const light1 = new THREE.PointLight(0xFF8C42, 0.8, 50); // Orange-red
        light1.position.set(-5, 0, 0);
        this.scene.add(light1);

        const light2 = new THREE.PointLight(0xFFD23F, 0.8, 50); // Golden yellow
        light2.position.set(5, 0, 0);
        this.scene.add(light2);

        const light3 = new THREE.PointLight(0x9B59B6, 0.8, 50); // Purple to match background
        light3.position.set(0, 0, -5);
        this.scene.add(light3);

        console.log('Lighting setup complete');
    }

    setupControls() {
        if (!this.camera || !this.renderer) return;

        // Check if OrbitControls is available
        if (window.THREE && window.THREE.OrbitControls) {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.enableZoom = true;
            this.controls.enableRotate = true;
            this.controls.autoRotate = true;
            this.controls.autoRotateSpeed = 0.5;
            this.controls.minDistance = 2;
            this.controls.maxDistance = 10;
            console.log('OrbitControls initialized');
        } else {
            console.warn('OrbitControls not available, using basic rotation');
        }
    }

    setupEventListeners() {
        // File input events
        this.setupFileEvents();
        // Audio control events
        this.setupAudioControlEvents();
        // Visualization control events
        this.setupVisualizationEvents();
        // Modal events
        this.setupModalEvents();
        console.log('Event listeners setup complete');
    }

    setupFileEvents() {
        const fileInput = document.getElementById('audioFile');
        const fileButton = document.getElementById('fileButton');
        const dropZone = document.getElementById('dropZone');

        if (fileButton && fileInput) {
            // File button click
            fileButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('File button clicked');
                fileInput.click();
            });

            // File input change
            fileInput.addEventListener('change', (e) => {
                console.log('File input changed', e.target.files);
                if (e.target.files && e.target.files.length > 0) {
                    this.handleFileSelect(e.target.files[0]);
                }
            });
            console.log('File input events attached');
        } else {
            console.error('File button or input not found');
        }

        // Drag and drop events
        if (dropZone) {
            dropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
            dropZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            dropZone.addEventListener('drop', (e) => this.handleDrop(e));

            // Click on drop zone
            dropZone.addEventListener('click', (e) => {
                if (!fileButton.contains(e.target)) {
                    fileInput.click();
                }
            });
        }
    }

    setupAudioControlEvents() {
        const playPauseBtn = document.getElementById('playPauseBtn');
        const volumeSlider = document.getElementById('volumeSlider');
        const progressBar = document.getElementById('progressBar');

        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => {
                console.log('Play/pause button clicked');
                this.togglePlayPause();
            });
        }

        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        }

        if (progressBar) {
            progressBar.addEventListener('click', (e) => this.seek(e));
        }
    }

    setupVisualizationEvents() {
        const visualizationMode = document.getElementById('visualizationMode');
        const sensitivitySlider = document.getElementById('sensitivitySlider');

        if (visualizationMode) {
            visualizationMode.addEventListener('change', (e) => {
                this.visualizationMode = e.target.value;
                this.updateVisualizationMode();
            });
        }

        if (sensitivitySlider) {
            sensitivitySlider.addEventListener('input', (e) => {
                this.sensitivity = parseFloat(e.target.value);
            });
        }
    }

    setupModalEvents() {
        const closeErrorModal = document.getElementById('closeErrorModal');
        const okErrorModal = document.getElementById('okErrorModal');

        if (closeErrorModal) {
            closeErrorModal.addEventListener('click', () => this.closeErrorModal());
        }

        if (okErrorModal) {
            okErrorModal.addEventListener('click', () => this.closeErrorModal());
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        const dropZone = document.getElementById('dropZone');
        if (dropZone) {
            dropZone.classList.add('dragover');
        }
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        const dropZone = document.getElementById('dropZone');
        if (dropZone) {
            dropZone.classList.remove('dragover');
        }
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        const dropZone = document.getElementById('dropZone');
        if (dropZone) {
            dropZone.classList.remove('dragover');
        }

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.handleFileSelect(files[0]);
        }
    }

    async handleFileSelect(file) {
        if (!file) {
            console.log('No file provided');
            return;
        }

        console.log('Processing file:', file.name, 'Type:', file.type, 'Size:', file.size);

        // Validate file type
        const validTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/x-m4a'];
        const validExtensions = /\.(mp3|wav|ogg|m4a)$/i;

        if (!validTypes.includes(file.type) && !validExtensions.test(file.name)) {
            this.showError('Please select a valid audio file (MP3, WAV, OGG, or M4A)');
            return;
        }

        this.currentFile = file;
        this.showLoadingIndicator(true);

        try {
            await this.loadAudioFile(file);
            this.updateFileInfo(file.name);
            this.enableControls();
            console.log('Audio file loaded successfully');
        } catch (error) {
            console.error('Error loading audio file:', error);
            this.showError('Error loading audio file: ' + error.message);
        } finally {
            this.showLoadingIndicator(false);
        }
    }

    async loadAudioFile(file) {
        // Initialize audio context if not already done
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.analyser = this.audioContext.createAnalyser();
                this.analyser.fftSize = 256;
                this.analyser.smoothingTimeConstant = 0.8;
                this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
                console.log('Audio context created');
            } catch (error) {
                throw new Error('Failed to create audio context: ' + error.message);
            }
        }

        // Resume audio context if suspended
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }

        // Create audio element
        if (this.audioElement) {
            this.audioElement.pause();
            if (this.audioElement.src && this.audioElement.src.startsWith('blob:')) {
                URL.revokeObjectURL(this.audioElement.src);
            }
        }

        this.audioElement = new Audio();
        this.audioElement.crossOrigin = 'anonymous';
        this.audioElement.preload = 'auto';

        // Create blob URL
        const audioURL = URL.createObjectURL(file);
        this.audioElement.src = audioURL;

        // Setup audio source
        if (this.audioSource) {
            this.audioSource.disconnect();
        }

        try {
            this.audioSource = this.audioContext.createMediaElementSource(this.audioElement);
            this.audioSource.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
        } catch (error) {
            throw new Error('Failed to create audio source: ' + error.message);
        }

        // Setup audio event listeners
        this.setupAudioElementEvents();

        // Load the audio
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Audio loading timeout'));
            }, 30000); // 30 second timeout

            const onCanPlay = () => {
                clearTimeout(timeout);
                this.audioElement.removeEventListener('canplaythrough', onCanPlay);
                this.audioElement.removeEventListener('error', onError);
                console.log('Audio can play through');
                resolve();
            };

            const onError = (e) => {
                clearTimeout(timeout);
                this.audioElement.removeEventListener('canplaythrough', onCanPlay);
                this.audioElement.removeEventListener('error', onError);
                console.error('Audio loading error:', e);
                reject(new Error('Failed to load audio file'));
            };

            this.audioElement.addEventListener('canplaythrough', onCanPlay);
            this.audioElement.addEventListener('error', onError);
            this.audioElement.load();
        });
    }

    setupAudioElementEvents() {
        if (!this.audioElement) return;

        this.audioElement.addEventListener('loadedmetadata', () => {
            console.log('Audio metadata loaded, duration:', this.audioElement.duration);
            this.updateDuration();
        });

        this.audioElement.addEventListener('timeupdate', () => {
            this.updateProgress();
        });

        this.audioElement.addEventListener('ended', () => {
            console.log('Audio playback ended');
            this.isPlaying = false;
            this.updatePlayButton();
        });

        this.audioElement.addEventListener('play', () => {
            console.log('Audio started playing');
            this.isPlaying = true;
            this.updatePlayButton();
        });

        this.audioElement.addEventListener('pause', () => {
            console.log('Audio paused');
            this.isPlaying = false;
            this.updatePlayButton();
        });
    }

    async togglePlayPause() {
        if (!this.audioElement || !this.currentFile) {
            console.warn('No audio file loaded');
            this.showError('Please load an audio file first');
            return;
        }

        try {
            // Ensure audio context is running
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }

            if (this.isPlaying) {
                this.audioElement.pause();
            } else {
                await this.audioElement.play();
            }
        } catch (error) {
            console.error('Error toggling playback:', error);
            this.showError('Error controlling audio playback: ' + error.message);
        }
    }

    setVolume(value) {
        if (this.audioElement) {
            this.audioElement.volume = Math.max(0, Math.min(1, value / 100));
        }
    }

    seek(e) {
        if (!this.audioElement || !this.audioElement.duration) return;

        const rect = e.target.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        this.audioElement.currentTime = percent * this.audioElement.duration;
    }

    updateVisualizationMode() {
        if (this.visualizationMode === 'particles') {
            if (this.sphere) this.sphere.visible = false;
            if (this.particleSystem) this.particleSystem.visible = true;
        } else {
            if (this.sphere) this.sphere.visible = true;
            if (this.particleSystem) this.particleSystem.visible = false;
        }
        console.log('Visualization mode changed to:', this.visualizationMode);
    }

    updateFileInfo(fileName) {
        const fileNameElement = document.getElementById('fileName');
        const fileInfoElement = document.getElementById('fileInfo');

        if (fileNameElement) {
            fileNameElement.textContent = fileName;
        }

        if (fileInfoElement) {
            fileInfoElement.classList.remove('hidden');
        }
    }

    updatePlayButton() {
        const playIcon = document.querySelector('.play-icon');
        const pauseIcon = document.querySelector('.pause-icon');

        if (playIcon && pauseIcon) {
            if (this.isPlaying) {
                playIcon.classList.add('hidden');
                pauseIcon.classList.remove('hidden');
            } else {
                playIcon.classList.remove('hidden');
                pauseIcon.classList.add('hidden');
            }
        }
    }

    updateDuration() {
        const durationElement = document.getElementById('duration');
        if (this.audioElement && durationElement) {
            const duration = this.audioElement.duration || 0;
            durationElement.textContent = this.formatTime(duration);
        }
    }

    updateProgress() {
        if (!this.audioElement) return;

        const progressFill = document.getElementById('progressFill');
        const currentTimeElement = document.getElementById('currentTime');

        if (progressFill) {
            const currentTime = this.audioElement.currentTime || 0;
            const duration = this.audioElement.duration || 1;
            const progress = (currentTime / duration) * 100;
            progressFill.style.width = Math.max(0, Math.min(100, progress)) + '%';
        }

        if (currentTimeElement) {
            currentTimeElement.textContent = this.formatTime(this.audioElement.currentTime || 0);
        }
    }

    formatTime(seconds) {
        if (!isFinite(seconds) || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    enableControls() {
        const playPauseBtn = document.getElementById('playPauseBtn');
        if (playPauseBtn) {
            playPauseBtn.disabled = false;
            playPauseBtn.classList.remove('btn--disabled');
            console.log('Audio controls enabled');
        }
    }

    disableControls() {
        const playPauseBtn = document.getElementById('playPauseBtn');
        if (playPauseBtn) {
            playPauseBtn.disabled = true;
            playPauseBtn.classList.add('btn--disabled');
            console.log('Audio controls disabled');
        }
    }

    showLoadingIndicator(show) {
        const indicator = document.getElementById('loadingIndicator');
        if (indicator) {
            if (show) {
                indicator.classList.remove('hidden');
            } else {
                indicator.classList.add('hidden');
            }
        }
    }

    showError(message) {
        console.error('Showing error:', message);
        const errorMessageElement = document.getElementById('errorMessage');
        const errorModal = document.getElementById('errorModal');

        if (errorMessageElement && errorModal) {
            errorMessageElement.textContent = message;
            errorModal.classList.remove('hidden');
        }
    }

    closeErrorModal() {
        const errorModal = document.getElementById('errorModal');
        if (errorModal) {
            errorModal.classList.add('hidden');
        }
    }

    onWindowResize() {
        const container = document.getElementById('canvasContainer');
        if (container && this.camera && this.renderer) {
            const width = container.offsetWidth;
            const height = container.offsetHeight;
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        }
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        // Update controls
        if (this.controls) {
            this.controls.update();
        } else if (this.sphere) {
            // Basic rotation if controls aren't available
            this.sphere.rotation.y += 0.005;
            this.sphere.rotation.x += 0.002;
        }

        // Update visualization based on audio data
        if (this.analyser && this.isPlaying && this.dataArray) {
            this.analyser.getByteFrequencyData(this.dataArray);
            this.updateVisualization();
        }

        // Render
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    updateVisualization() {
        if (!this.dataArray || !this.isInitialized) return;

        try {
            if (this.visualizationMode === 'frequency') {
                this.updateFrequencyVisualization();
            } else if (this.visualizationMode === 'waveform') {
                this.updateWaveformVisualization();
            } else if (this.visualizationMode === 'particles') {
                this.updateParticleVisualization();
            }
        } catch (error) {
            console.error('Error updating visualization:', error);
        }
    }

    updateFrequencyVisualization() {
        if (!this.sphere || !this.originalPositions) return;

        const positions = this.sphere.geometry.attributes.position;
        const originalPositions = this.originalPositions;

        for (let i = 0; i < positions.count; i++) {
            const i3 = i * 3;

            // Get frequency data for this vertex
            const freqIndex = Math.floor((i / positions.count) * this.dataArray.length);
            const amplitude = (this.dataArray[freqIndex] / 255) * this.sensitivity;

            // Calculate original position
            const x = originalPositions[i3];
            const y = originalPositions[i3 + 1];
            const z = originalPositions[i3 + 2];

            // Apply displacement along normal
            const length = Math.sqrt(x * x + y * y + z * z);
            const scale = 1 + amplitude * 0.3;

            positions.array[i3] = (x / length) * scale * 1.5;
            positions.array[i3 + 1] = (y / length) * scale * 1.5;
            positions.array[i3 + 2] = (z / length) * scale * 1.5;
        }

        positions.needsUpdate = true;

        // Update material color based on average frequency - changed to orange range
        const avgFreq = this.dataArray.reduce((a, b) => a + b) / this.dataArray.length;
        const hue = (avgFreq / 255) * 0.1 + 0.08; // Orange range (0.08 to 0.18 in HSL)
        this.sphere.material.color.setHSL(hue, 0.9, 0.6);
    }

    updateWaveformVisualization() {
        if (!this.sphere || !this.originalPositions) return;

        const time = Date.now() * 0.001;
        const positions = this.sphere.geometry.attributes.position;
        const originalPositions = this.originalPositions;

        for (let i = 0; i < positions.count; i++) {
            const i3 = i * 3;
            const x = originalPositions[i3];
            const y = originalPositions[i3 + 1];
            const z = originalPositions[i3 + 2];

            // Create wave effect
            const wave1 = Math.sin(time * 2 + x * 5) * 0.1;
            const wave2 = Math.sin(time * 3 + y * 8) * 0.1;
            const wave3 = Math.sin(time * 1.5 + z * 6) * 0.1;

            // Get audio amplitude
            const freqIndex = Math.floor((i / positions.count) * this.dataArray.length);
            const amplitude = (this.dataArray[freqIndex] / 255) * this.sensitivity;

            const displacement = (wave1 + wave2 + wave3) * amplitude * 0.5;
            const length = Math.sqrt(x * x + y * y + z * z);

            positions.array[i3] = x + (x / length) * displacement;
            positions.array[i3 + 1] = y + (y / length) * displacement;
            positions.array[i3 + 2] = z + (z / length) * displacement;
        }

        positions.needsUpdate = true;
    }

    updateParticleVisualization() {
        if (!this.particleSystem) return;

        const colors = this.particleSystem.geometry.attributes.color;

        for (let i = 0; i < colors.count; i++) {
            const i3 = i * 3;

            // Get frequency data
            const freqIndex = Math.floor((i / colors.count) * this.dataArray.length);
            const amplitude = (this.dataArray[freqIndex] / 255) * this.sensitivity;

            // Update particle colors to complement orange theme
            colors.array[i3] = 0.9 + amplitude * 0.1;     // High red for orange
            colors.array[i3 + 1] = 0.4 + amplitude * 0.4;  // Medium green for orange
            colors.array[i3 + 2] = 0.1 + amplitude * 0.2;  // Low blue for orange
        }

        colors.needsUpdate = true;

        // Rotate particle system
        this.particleSystem.rotation.y += 0.005;
        this.particleSystem.rotation.x += 0.002;
    }

    destroy() {
        console.log('Destroying AudioVisualizer...');

        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        if (this.audioElement) {
            this.audioElement.pause();
            if (this.audioElement.src && this.audioElement.src.startsWith('blob:')) {
                URL.revokeObjectURL(this.audioElement.src);
            }
        }

        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close().catch(console.error);
        }

        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}

// Browser compatibility check
function checkBrowserSupport() {
    const errors = [];

    if (!window.AudioContext && !window.webkitAudioContext) {
        errors.push('Web Audio API not supported');
    }

    if (!window.WebGLRenderingContext) {
        errors.push('WebGL not supported');
    }

    if (!window.THREE) {
        errors.push('Three.js library not loaded');
    }

    if (errors.length > 0) {
        console.error('Browser compatibility errors:', errors);
        const errorMessageElement = document.getElementById('errorMessage');
        const errorModal = document.getElementById('errorModal');

        if (errorMessageElement && errorModal) {
            errorMessageElement.textContent =
                'Your browser does not support required features: ' + errors.join(', ');
            errorModal.classList.remove('hidden');
        }
        return false;
    }

    return true;
}

// Initialize the application
let audioVisualizer = null;

async function initializeApp() {
    console.log('Starting application initialization...');

    if (!checkBrowserSupport()) {
        return;
    }

    try {
        audioVisualizer = new AudioVisualizer();
        await audioVisualizer.init();
        // Ensure controls are disabled initially
        audioVisualizer.disableControls();
    } catch (error) {
        console.error('Failed to initialize application:', error);
        const errorMessageElement = document.getElementById('errorMessage');
        const errorModal = document.getElementById('errorModal');

        if (errorMessageElement && errorModal) {
            errorMessageElement.textContent = 'Failed to initialize 3D visualizer: ' + error.message;
            errorModal.classList.remove('hidden');
        }
    }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeApp, 200);
    });
} else {
    setTimeout(initializeApp, 200);
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (audioVisualizer) {
        audioVisualizer.destroy();
    }
});