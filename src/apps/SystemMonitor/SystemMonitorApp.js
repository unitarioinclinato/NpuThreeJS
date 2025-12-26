import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { AntigravityEngine } from '/src/core/AntigravityEngine.js';

/**
 * SystemMonitorApp - Dashboard tempo reale con design moderno
 * Complessità: O(1) per update, O(n) per rendering
 */
export class SystemMonitorApp {
  constructor(container) {
    this.container = container;
    
    // Engine
    this.engine = new AntigravityEngine(container, {
      antialias: true,
      alpha: true
    });
    
    // Stato sistema
    this.state = {
      operations: [],
      metrics: {
        cpu: 0,
        memory: 0,
        network: 0,
        activeConnections: 0,
        fps: 60
      },
      logs: [],
      modules: new Map()
    };
    
    // Visualizzazioni 3D
    this.particles = [];
    this.connections = [];
    this.nodes = [];
    
    // UI
    this.ui = {
      logPanel: null,
      metricsPanel: null,
      operationsPanel: null
    };
    
    this._init();
    this._startMonitoring();
  }

  /**
   * Inizializzazione
   * O(1) - setup costante
   */
  _init() {
    // Background gradient moderno
    this._createModernBackground();
    
    // Particelle sistema eleganti
    this._createParticleSystem();
    
    // Nodi moduli con design moderno
    this._createModuleNodes();
    
    // UI moderna
    this._createModernUI();
    
    // Event listeners
    this._setupEventListeners();
    
    // Animation
    this.animate();
  }

  /**
   * Crea background moderno con gradient
   * O(1) - setup costante
   */
  _createModernBackground() {
    // Rimuovi background vecchio se esiste
    const container = this.container;
    container.style.background = 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)';
  }

  /**
   * Crea sistema particelle elegante
   * O(n) - n = numero particelle
   */
  _createParticleSystem() {
    const particleCount = 300;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 80;
      positions[i3 + 1] = (Math.random() - 0.5) * 80;
      positions[i3 + 2] = (Math.random() - 0.5) * 80;
      
      // Colori moderni (blu/viola)
      const hue = 0.55 + Math.random() * 0.15;
      const color = new THREE.Color();
      color.setHSL(hue, 0.7, 0.6);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.3,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    
    const points = new THREE.Points(geometry, material);
    this.engine.scene.add(points);
    this.particles.push(points);
  }

  /**
   * Crea nodi moduli con design moderno
   * O(n) - n = numero moduli
   */
  _createModuleNodes() {
    const modules = [
      { name: 'AntigravityEngine', pos: [-15, 8, 0], color: 0x6366f1, icon: '⚡' },
      { name: 'IntelOrchestrator', pos: [15, 8, 0], color: 0x8b5cf6, icon: '🛰️' },
      { name: 'GeminiEyes', pos: [0, -8, 0], color: 0xec4899, icon: '👁️' },
      { name: 'SystemMonitor', pos: [0, 0, 0], color: 0x06b6d4, icon: '📊' }
    ];
    
    modules.forEach((mod, i) => {
      // Sfera principale
      const geometry = new THREE.SphereGeometry(1.2, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: mod.color,
        emissive: mod.color,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.9
      });
      const sphere = new THREE.Mesh(geometry, material);
      
      // Anello esterno
      const ringGeometry = new THREE.RingGeometry(1.3, 1.5, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: mod.color,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      sphere.add(ring);
      
      const matrix = new THREE.Matrix4();
      matrix.makeTranslation(mod.pos[0], mod.pos[1], mod.pos[2]);
      sphere.matrix.copy(matrix);
      sphere.matrixAutoUpdate = false;
      
      this.engine.scene.add(sphere);
      this.nodes.push({
        mesh: sphere,
        ring: ring,
        name: mod.name,
        position: new THREE.Vector3(...mod.pos),
        color: mod.color,
        activity: 0,
        icon: mod.icon
      });
      
      // Connessioni eleganti
      if (i > 0) {
        this._createConnection(this.nodes[0].position, this.nodes[i].position, mod.color);
      }
    });
  }

  /**
   * Crea connessione elegante tra nodi
   * O(1) - creazione costante
   */
  _createConnection(start, end, color) {
    const points = [start, end];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.2,
      linewidth: 1
    });
    const line = new THREE.Line(geometry, material);
    this.engine.scene.add(line);
    this.connections.push(line);
  }

  /**
   * Crea UI moderna (design ispirato a threejsresources.com)
   * O(1) - setup costante
   */
  _createModernUI() {
    const uiContainer = document.createElement('div');
    uiContainer.id = 'system-monitor-ui';
    uiContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      color: #e5e7eb;
    `;
    
    // Header moderno
    const header = document.createElement('div');
    header.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 60px;
      background: rgba(15, 15, 25, 0.8);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(99, 102, 241, 0.2);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 30px;
      pointer-events: auto;
    `;
    header.innerHTML = `
      <div style="display: flex; align-items: center; gap: 15px;">
        <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; animation: pulse 2s infinite;"></div>
        <h1 style="margin: 0; font-size: 18px; font-weight: 600; color: #f9fafb;">NpuThreeJS System Monitor</h1>
      </div>
      <div style="display: flex; gap: 20px; font-size: 14px; color: #9ca3af;">
        <span>FPS: <span id="fps-counter" style="color: #10b981;">60</span></span>
        <span>Uptime: <span id="uptime" style="color: #6366f1;">00:00:00</span></span>
      </div>
    `;
    uiContainer.appendChild(header);
    
    // Metrics Cards (design card-based)
    const metricsContainer = document.createElement('div');
    metricsContainer.style.cssText = `
      position: absolute;
      top: 80px;
      right: 30px;
      width: 320px;
      display: flex;
      flex-direction: column;
      gap: 15px;
      pointer-events: auto;
    `;
    
    // CPU Card
    const cpuCard = this._createMetricCard('CPU Usage', 'cpu', '#6366f1');
    metricsContainer.appendChild(cpuCard);
    
    // Memory Card
    const memoryCard = this._createMetricCard('Memory', 'memory', '#8b5cf6');
    metricsContainer.appendChild(memoryCard);
    
    // Network Card
    const networkCard = this._createMetricCard('Network', 'network', '#ec4899');
    metricsContainer.appendChild(networkCard);
    
    uiContainer.appendChild(metricsContainer);
    this.ui.metricsContainer = metricsContainer;
    
    // Log Panel moderno (sinistra)
    const logPanel = document.createElement('div');
    logPanel.id = 'log-panel';
    logPanel.style.cssText = `
      position: absolute;
      top: 80px;
      left: 30px;
      width: 450px;
      height: 300px;
      background: rgba(15, 15, 25, 0.7);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: 12px;
      padding: 20px;
      overflow-y: auto;
      pointer-events: auto;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    `;
    logPanel.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
        <div style="width: 4px; height: 20px; background: linear-gradient(180deg, #6366f1, #8b5cf6); border-radius: 2px;"></div>
        <h3 style="margin: 0; font-size: 14px; font-weight: 600; color: #f9fafb; text-transform: uppercase; letter-spacing: 0.5px;">System Log</h3>
      </div>
      <div id="log-content" style="font-family: 'SF Mono', 'Monaco', 'Cascadia Code', monospace; font-size: 12px; line-height: 1.6;"></div>
    `;
    uiContainer.appendChild(logPanel);
    this.ui.logPanel = document.getElementById('log-content');
    
    // Operations Panel moderno (basso)
    const operationsPanel = document.createElement('div');
    operationsPanel.id = 'operations-panel';
    operationsPanel.style.cssText = `
      position: absolute;
      bottom: 30px;
      left: 30px;
      right: 30px;
      height: 180px;
      background: rgba(15, 15, 25, 0.7);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: 12px;
      padding: 20px;
      overflow-y: auto;
      pointer-events: auto;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    `;
    operationsPanel.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
        <div style="width: 4px; height: 20px; background: linear-gradient(180deg, #ec4899, #f472b6); border-radius: 2px;"></div>
        <h3 style="margin: 0; font-size: 14px; font-weight: 600; color: #f9fafb; text-transform: uppercase; letter-spacing: 0.5px;">Active Operations</h3>
        <span id="ops-count" style="margin-left: auto; font-size: 12px; color: #9ca3af;">0</span>
      </div>
      <div id="operations-content" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 10px;"></div>
    `;
    uiContainer.appendChild(operationsPanel);
    this.ui.operationsPanel = document.getElementById('operations-content');
    this.ui.opsCount = document.getElementById('ops-count');
    
    // Uptime counter
    this.startTime = Date.now();
    setInterval(() => {
      const uptime = Math.floor((Date.now() - this.startTime) / 1000);
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = uptime % 60;
      const uptimeEl = document.getElementById('uptime');
      if (uptimeEl) {
        uptimeEl.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      }
    }, 1000);
    
    this.container.appendChild(uiContainer);
  }

  /**
   * Crea card metrica moderna
   * O(1) - creazione costante
   */
  _createMetricCard(title, id, color) {
    const card = document.createElement('div');
    card.style.cssText = `
      background: rgba(15, 15, 25, 0.7);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      transition: transform 0.2s, border-color 0.2s;
    `;
    card.onmouseenter = () => {
      card.style.transform = 'translateY(-2px)';
      card.style.borderColor = color + '40';
    };
    card.onmouseleave = () => {
      card.style.transform = 'translateY(0)';
      card.style.borderColor = 'rgba(99, 102, 241, 0.2)';
    };
    
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-size: 12px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;">${title}</span>
        <span id="${id}-value" style="font-size: 18px; font-weight: 700; color: ${color};">0%</span>
      </div>
      <div style="background: rgba(0, 0, 0, 0.3); height: 8px; border-radius: 4px; overflow: hidden;">
        <div id="${id}-bar" style="background: linear-gradient(90deg, ${color}, ${color}dd); height: 100%; width: 0%; transition: width 0.3s ease; border-radius: 4px;"></div>
      </div>
    `;
    
    return card;
  }

  /**
   * Setup event listeners
   * O(1) - setup costante
   */
  _setupEventListeners() {
    // Simula operazioni sistema
    setInterval(() => {
      this._simulateOperation();
    }, 2500);
    
    // Aggiorna metriche
    setInterval(() => {
      this._updateMetrics();
    }, 500);
    
    // FPS counter
    let lastTime = performance.now();
    let frameCount = 0;
    setInterval(() => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (now - lastTime));
        this.state.metrics.fps = fps;
        const fpsEl = document.getElementById('fps-counter');
        if (fpsEl) {
          fpsEl.textContent = fps;
          fpsEl.style.color = fps >= 55 ? '#10b981' : fps >= 30 ? '#f59e0b' : '#ef4444';
        }
        frameCount = 0;
        lastTime = now;
      }
    }, 100);
  }

  /**
   * Simula operazione sistema
   * O(1) - aggiunta costante
   */
  _simulateOperation() {
    const operations = [
      { name: 'Loading module', icon: '📦' },
      { name: 'Processing data', icon: '⚙️' },
      { name: 'Rendering frame', icon: '🎨' },
      { name: 'Updating cache', icon: '💾' },
      { name: 'Synchronizing state', icon: '🔄' },
      { name: 'Compiling shader', icon: '✨' },
      { name: 'Optimizing geometry', icon: '🔧' },
      { name: 'Calculating orbit', icon: '🛰️' },
      { name: 'Tracking satellite', icon: '📡' },
      { name: 'Updating UI', icon: '🎯' }
    ];
    
    const op = operations[Math.floor(Math.random() * operations.length)];
    const timestamp = new Date().toLocaleTimeString();
    
    this.addLog(`${op.icon} ${op.name}`, 'info');
    this.addOperation(op.name, 'running', op.icon);
    
    setTimeout(() => {
      this.removeOperation(op.name);
    }, 3000);
  }

  /**
   * Aggiorna metriche
   * O(1) - update costante
   */
  _updateMetrics() {
    this.state.metrics.cpu = 15 + Math.random() * 35;
    this.state.metrics.memory = 25 + Math.random() * 30;
    this.state.metrics.network = 8 + Math.random() * 15;
    this.state.metrics.activeConnections = Math.floor(4 + Math.random() * 8);
    
    this._renderMetrics();
    this._updateNodeActivity();
  }

  /**
   * Renderizza metriche
   * O(1) - render costante
   */
  _renderMetrics() {
    const m = this.state.metrics;
    
    // CPU
    const cpuValue = document.getElementById('cpu-value');
    const cpuBar = document.getElementById('cpu-bar');
    if (cpuValue) cpuValue.textContent = `${m.cpu.toFixed(1)}%`;
    if (cpuBar) cpuBar.style.width = `${m.cpu}%`;
    
    // Memory
    const memoryValue = document.getElementById('memory-value');
    const memoryBar = document.getElementById('memory-bar');
    if (memoryValue) memoryValue.textContent = `${m.memory.toFixed(1)}%`;
    if (memoryBar) memoryBar.style.width = `${m.memory}%`;
    
    // Network
    const networkValue = document.getElementById('network-value');
    const networkBar = document.getElementById('network-bar');
    if (networkValue) networkValue.textContent = `${m.network.toFixed(1)}%`;
    if (networkBar) networkBar.style.width = `${m.network}%`;
  }

  /**
   * Aggiorna attività nodi
   * O(n) - n = numero nodi
   */
  _updateNodeActivity() {
    this.nodes.forEach(node => {
      node.activity = 0.4 + Math.random() * 0.6;
      const intensity = node.activity;
      
      node.mesh.material.emissiveIntensity = intensity * 0.5;
      
      // Pulse effect elegante
      const scale = 1 + Math.sin(Date.now() * 0.003 + node.name.length) * 0.15;
      const matrix = new THREE.Matrix4();
      matrix.compose(
        node.position,
        new THREE.Quaternion(),
        new THREE.Vector3(scale, scale, scale)
      );
      node.mesh.matrix.copy(matrix);
      node.mesh.matrixAutoUpdate = false;
      
      // Rotazione anello
      if (node.ring) {
        node.ring.rotation.z += 0.01;
      }
    });
  }

  /**
   * Aggiunge log
   * O(1) - aggiunta costante
   */
  addLog(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = {
      timestamp,
      message,
      type
    };
    
    this.state.logs.push(logEntry);
    if (this.state.logs.length > 50) {
      this.state.logs.shift();
    }
    
    this._renderLogs();
  }

  /**
   * Renderizza logs
   * O(n) - n = numero logs
   */
  _renderLogs() {
    const recentLogs = this.state.logs.slice(-25);
    this.ui.logPanel.innerHTML = recentLogs.map(log => {
      const color = log.type === 'error' ? '#ef4444' : 
                   log.type === 'warning' ? '#f59e0b' : '#10b981';
      return `
        <div style="display: flex; gap: 12px; margin-bottom: 8px; color: #9ca3af;">
          <span style="color: ${color}; font-weight: 600;">[${log.timestamp}]</span>
          <span style="color: #e5e7eb;">${log.message}</span>
        </div>
      `;
    }).join('');
    this.ui.logPanel.scrollTop = this.ui.logPanel.scrollHeight;
  }

  /**
   * Aggiunge operazione
   * O(1) - aggiunta costante
   */
  addOperation(name, status, icon = '⚡') {
    this.state.operations.push({ name, status, startTime: Date.now(), icon });
    this._renderOperations();
  }

  /**
   * Rimuove operazione
   * O(n) - ricerca e rimozione
   */
  removeOperation(name) {
    const index = this.state.operations.findIndex(op => op.name === name);
    if (index !== -1) {
      this.state.operations.splice(index, 1);
      this._renderOperations();
    }
  }

  /**
   * Renderizza operazioni
   * O(n) - n = numero operazioni
   */
  _renderOperations() {
    if (this.ui.opsCount) {
      this.ui.opsCount.textContent = this.state.operations.length;
    }
    
    if (this.state.operations.length === 0) {
      this.ui.operationsPanel.innerHTML = '<div style="color: #6b7280; text-align: center; padding: 20px;">No active operations</div>';
      return;
    }
    
    this.ui.operationsPanel.innerHTML = this.state.operations.map(op => {
      const duration = ((Date.now() - op.startTime) / 1000).toFixed(1);
      return `
        <div style="
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 8px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.2s;
        " onmouseenter="this.style.background='rgba(99, 102, 241, 0.15)'" onmouseleave="this.style.background='rgba(99, 102, 241, 0.1)'">
          <span style="font-size: 18px;">${op.icon}</span>
          <div style="flex: 1;">
            <div style="font-size: 13px; font-weight: 600; color: #f9fafb;">${op.name}</div>
            <div style="font-size: 11px; color: #9ca3af;">${duration}s</div>
          </div>
          <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; animation: pulse 2s infinite;"></div>
        </div>
      `;
    }).join('');
  }

  /**
   * Update loop
   * O(n) - n = elementi da aggiornare
   */
  update() {
    // Rotazione particelle smooth
    this.particles.forEach(particle => {
      particle.rotation.y += 0.0005;
      particle.rotation.x += 0.0003;
    });
    
    // Camera orbit elegante
    const time = Date.now() * 0.00008;
    const distance = 25;
    const cameraPos = new THREE.Vector3(
      Math.cos(time) * distance,
      8 + Math.sin(time * 0.5) * 3,
      Math.sin(time) * distance
    );
    
    const matrix = new THREE.Matrix4();
    matrix.makeTranslation(cameraPos.x, cameraPos.y, cameraPos.z);
    this.engine.camera.matrix.copy(matrix);
    this.engine.camera.matrixAutoUpdate = false;
    this.engine.camera.lookAt(0, 0, 0);
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
    this.particles.forEach(p => {
      p.geometry.dispose();
      p.material.dispose();
    });
    this.connections.forEach(c => {
      c.geometry.dispose();
      c.material.dispose();
    });
    this.nodes.forEach(n => {
      n.mesh.geometry.dispose();
      n.mesh.material.dispose();
      if (n.ring) {
        n.ring.geometry.dispose();
        n.ring.material.dispose();
      }
    });
    this.engine.dispose();
  }
}
