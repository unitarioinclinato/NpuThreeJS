import * as THREE from 'three';
import { AntigravityEngine } from '/src/core/AntigravityEngine.js';
import { GeminiCapsule } from '/src/apps/GeminiEyes/GeminiCapsule.js';
import { GeminiOrbit } from '/src/apps/GeminiEyes/GeminiOrbit.js';
import { GEMINI_MISSIONS, getMission } from '/src/apps/GeminiEyes/GeminiMissionData.js';

/**
 * GeminiEyesApp - Applicazione principale replica NASA Eyes per Gemini
 * Complessità: O(n) per rendering, O(1) per update singolo elemento
 */
export class GeminiEyesApp {
  constructor(container) {
    this.container = container;
    
    // Engine core
    this.engine = new AntigravityEngine(container, {
      antialias: true,
      alpha: true
    });
    
    // Missione corrente
    this.currentMission = null;
    this.capsule = null;
    this.orbit = null;
    
    // Timeline
    this.timeline = {
      startTime: null,
      currentTime: null,
      speed: 1.0, // moltiplicatore velocità
      paused: false
    };
    
    // Earth model
    this.earth = null;
    
    // UI state
    this.ui = {
      missionSelector: null,
      timelineControl: null,
      infoPanel: null
    };
    
    // Controls
    this.controls = {
      cameraMode: 'follow', // 'follow', 'free', 'earth'
      autoRotate: true
    };
    
    this._init();
  }

  /**
   * Inizializzazione
   * O(1) - setup costante
   */
  _init() {
    // Earth model
    this._createEarth();
    
    // Lighting
    this._setupLighting();
    
    // UI
    this._createUI();
    
    // Event listeners
    this._setupEventListeners();
    
    // Start con prima missione
    this.loadMission('gemini-3');
    
    // Animation loop
    this.animate();
  }

  /**
   * Crea modello Terra
   * O(k) - k = vertici sfera
   */
  _createEarth() {
    const geometry = new THREE.SphereGeometry(6371000, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    
    // Placeholder texture (usa texture reale se disponibile)
    const material = new THREE.MeshPhongMaterial({
      color: 0x2233ff,
      emissive: 0x001122,
      shininess: 10
    });
    
    this.earth = new THREE.Mesh(geometry, material);
    this.engine.scene.add(this.earth);
    
    // Continents outline (semplificato)
    const continentsGeometry = new THREE.SphereGeometry(6371100, 64, 64);
    const continentsMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const continents = new THREE.Mesh(continentsGeometry, continentsMaterial);
    this.engine.scene.add(continents);
  }

  /**
   * Setup lighting
   * O(1) - setup costante
   */
  _setupLighting() {
    // Sun light
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
    sunLight.position.set(150000000, 0, 0);
    this.engine.scene.add(sunLight);
    
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    this.engine.scene.add(ambientLight);
  }

  /**
   * Crea UI
   * O(1) - setup costante
   */
  _createUI() {
    const uiContainer = document.createElement('div');
    uiContainer.id = 'gemini-eyes-ui';
    uiContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      font-family: 'Arial', sans-serif;
      color: white;
    `;
    
    // Mission selector
    const missionSelector = document.createElement('div');
    missionSelector.style.cssText = `
      position: absolute;
      top: 20px;
      left: 20px;
      background: rgba(0, 0, 0, 0.7);
      padding: 15px;
      border-radius: 8px;
      pointer-events: auto;
    `;
    
    const select = document.createElement('select');
    select.style.cssText = `
      padding: 8px;
      background: #1a1a1a;
      color: white;
      border: 1px solid #444;
      border-radius: 4px;
      cursor: pointer;
    `;
    
    GEMINI_MISSIONS.forEach(mission => {
      const option = document.createElement('option');
      option.value = mission.id;
      option.textContent = `${mission.name} (${mission.date})`;
      select.appendChild(option);
    });
    
    select.addEventListener('change', (e) => {
      this.loadMission(e.target.value);
    });
    
    missionSelector.appendChild(select);
    uiContainer.appendChild(missionSelector);
    
    // Timeline control
    const timelineControl = document.createElement('div');
    timelineControl.style.cssText = `
      position: absolute;
      bottom: 20px;
      left: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.7);
      padding: 15px;
      border-radius: 8px;
      pointer-events: auto;
    `;
    
    const playPause = document.createElement('button');
    playPause.textContent = '⏸';
    playPause.style.cssText = `
      padding: 8px 16px;
      background: #0066ff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 10px;
    `;
    playPause.addEventListener('click', () => {
      this.timeline.paused = !this.timeline.paused;
      playPause.textContent = this.timeline.paused ? '▶' : '⏸';
    });
    
    const speedInput = document.createElement('input');
    speedInput.type = 'range';
    speedInput.min = '0.1';
    speedInput.max = '100';
    speedInput.value = '1';
    speedInput.step = '0.1';
    speedInput.style.cssText = 'width: 200px; margin: 0 10px;';
    speedInput.addEventListener('input', (e) => {
      this.timeline.speed = parseFloat(e.target.value);
    });
    
    const speedLabel = document.createElement('span');
    speedLabel.textContent = 'Speed: 1.0x';
    speedInput.addEventListener('input', (e) => {
      speedLabel.textContent = `Speed: ${parseFloat(e.target.value).toFixed(1)}x`;
    });
    
    timelineControl.appendChild(playPause);
    timelineControl.appendChild(speedInput);
    timelineControl.appendChild(speedLabel);
    uiContainer.appendChild(timelineControl);
    
    // Info panel
    const infoPanel = document.createElement('div');
    infoPanel.id = 'info-panel';
    infoPanel.style.cssText = `
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.7);
      padding: 15px;
      border-radius: 8px;
      min-width: 250px;
      pointer-events: auto;
    `;
    uiContainer.appendChild(infoPanel);
    
    this.ui.missionSelector = select;
    this.ui.timelineControl = timelineControl;
    this.ui.infoPanel = infoPanel;
    
    this.container.appendChild(uiContainer);
  }

  /**
   * Setup event listeners
   * O(1) - setup costante
   */
  _setupEventListeners() {
    window.addEventListener('resize', () => {
      this.engine.onResize();
    });
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      switch(e.key) {
        case ' ':
          this.timeline.paused = !this.timeline.paused;
          break;
        case 'c':
          this.controls.cameraMode = 
            this.controls.cameraMode === 'follow' ? 'free' : 'follow';
          break;
      }
    });
  }

  /**
   * Carica missione
   * O(1) - setup costante
   */
  loadMission(missionId) {
    const mission = getMission(missionId);
    if (!mission) return;
    
    this.currentMission = mission;
    
    // Cleanup precedente
    if (this.capsule) {
      this.capsule.dispose();
      this.engine.scene.remove(this.capsule.getMesh());
    }
    if (this.orbit) {
      this.orbit.dispose();
      this.engine.scene.remove(this.orbit.getLine());
    }
    
    // Nuova capsula
    this.capsule = new GeminiCapsule(10000); // 10km scale
    this.engine.scene.add(this.capsule.getMesh());
    
    // Nuova orbita
    this.orbit = new GeminiOrbit(mission.orbit);
    this.engine.scene.add(this.orbit.getLine());
    
    // Timeline reset
    this.timeline.startTime = new Date(mission.date).getTime();
    this.timeline.currentTime = this.timeline.startTime;
    
    // Update UI
    this._updateInfoPanel();
    
    // Camera follow
    this._updateCamera();
  }

  /**
   * Update info panel
   * O(1) - update costante
   */
  _updateInfoPanel() {
    if (!this.currentMission) return;
    
    const m = this.currentMission;
    this.ui.infoPanel.innerHTML = `
      <h3 style="margin-top: 0;">${m.name}</h3>
      <p><strong>Date:</strong> ${m.date}</p>
      <p><strong>Crew:</strong> ${m.crew.join(', ')}</p>
      <p><strong>Duration:</strong> ${m.duration}</p>
      <p><strong>Objectives:</strong></p>
      <ul style="margin: 5px 0; padding-left: 20px;">
        ${m.objectives.map(obj => `<li>${obj}</li>`).join('')}
      </ul>
      <p><strong>Orbit:</strong></p>
      <ul style="margin: 5px 0; padding-left: 20px;">
        <li>Apogee: ${m.orbit.apogee} km</li>
        <li>Perigee: ${m.orbit.perigee} km</li>
        <li>Inclination: ${m.orbit.inclination}°</li>
      </ul>
    `;
  }

  /**
   * Update camera
   * O(1) - update costante
   */
  _updateCamera() {
    if (!this.capsule || this.controls.cameraMode !== 'follow') return;
    
    const capsulePos = this.capsule.getMesh().position;
    const distance = 500000; // 500km
    
    // Camera segue capsula
    const cameraPos = new THREE.Vector3(
      capsulePos.x + distance,
      capsulePos.y + distance * 0.5,
      capsulePos.z + distance
    );
    
    const matrix = new THREE.Matrix4();
    matrix.makeTranslation(cameraPos.x, cameraPos.y, cameraPos.z);
    this.engine.camera.matrix.copy(matrix);
    this.engine.camera.matrixAutoUpdate = false;
    this.engine.camera.lookAt(capsulePos);
  }

  /**
   * Update loop
   * O(1) - update costante per frame
   */
  update() {
    if (!this.currentMission || !this.capsule || !this.orbit) return;
    
    if (!this.timeline.paused) {
      const deltaTime = 16.67 * this.timeline.speed; // ms
      this.timeline.currentTime += deltaTime;
    }
    
    // Calcola tempo missione (secondi)
    const missionTime = (this.timeline.currentTime - this.timeline.startTime) / 1000;
    
    // Posizione capsula
    const position = this.orbit.getPositionAtTime(missionTime);
    
    // Orientamento (semplificato: sempre verso velocità)
    const quaternion = new THREE.Quaternion();
    quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), missionTime * 0.001);
    
    // Aggiorna capsula
    this.capsule.setTransform(
      position,
      quaternion,
      new THREE.Vector3(1, 1, 1)
    );
    
    // Update camera
    if (this.controls.cameraMode === 'follow') {
      this._updateCamera();
    }
    
    // Rotazione Terra (semplificata)
    if (this.earth && this.controls.autoRotate) {
      const rotation = new THREE.Quaternion();
      rotation.setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        missionTime * 0.0000727 // rotazione terrestre
      );
      const earthMatrix = new THREE.Matrix4();
      earthMatrix.compose(
        new THREE.Vector3(0, 0, 0),
        rotation,
        new THREE.Vector3(1, 1, 1)
      );
      this.earth.matrix.copy(earthMatrix);
      this.earth.matrixAutoUpdate = false;
    }
  }

  /**
   * Animation loop
   * O(n) - n = elementi da renderizzare
   */
  animate() {
    requestAnimationFrame(() => this.animate());
    this.update();
    this.engine.render();
  }

  /**
   * Cleanup
   * O(n) - n = risorse da rilasciare
   */
  dispose() {
    if (this.capsule) this.capsule.dispose();
    if (this.orbit) this.orbit.dispose();
    if (this.earth) {
      this.earth.geometry.dispose();
      this.earth.material.dispose();
    }
    this.engine.dispose();
  }
}

