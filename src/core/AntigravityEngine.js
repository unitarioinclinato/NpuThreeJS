import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

/**
 * AntigravityEngine - Core 3D engine usando solo Matrix4 e Quaternions
 * Complessità: O(1) per trasformazioni, O(n) per scene graph traversal
 */
export class AntigravityEngine {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      antialias: true,
      alpha: false,
      ...options
    };

    // Scene graph
    this.scene = new THREE.Scene();
    this.camera = null;
    this.renderer = null;
    
    // Transform pools (Zero Garbage)
    this.matrixPool = [];
    this.quaternionPool = [];
    this.vectorPool = [];
    
    // Google 3D Tiles placeholder
    this.tilesLoader = null;
    this.tileset = null;
    
    // Composer unificato
    this.composer = null;
    
    this._init();
  }

  /**
   * Inizializzazione Three.js con Matrix4/Quaternion only
   * O(1) - setup costante
   */
  _init() {
    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: this.options.antialias,
      alpha: this.options.alpha,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // Camera con trasformazioni Matrix4
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 10000);
    
    // Posizione iniziale usando Matrix4
    const initMatrix = new THREE.Matrix4();
    initMatrix.makeTranslation(0, 0, 5);
    this.camera.applyMatrix4(initMatrix);

    // Placeholder Google 3D Tiles
    this._initTilesPlaceholder();
  }

  /**
   * Placeholder per Google 3D Tiles
   * O(1) - setup placeholder
   */
  _initTilesPlaceholder() {
    // TODO: Integrazione futura con @loaders.gl/3d-tiles
    this.tilesLoader = {
      load: async (url) => {
        console.warn('[AntigravityEngine] 3D Tiles loader placeholder');
        return null;
      }
    };
  }

  /**
   * Aggiunge mesh alla scena con trasformazione Matrix4
   * O(1) - aggiunta costante
   */
  addMesh(geometry, material, transformMatrix = null) {
    const mesh = new THREE.Mesh(geometry, material);
    
    if (transformMatrix) {
      mesh.matrix.copy(transformMatrix);
      mesh.matrixAutoUpdate = false;
    }
    
    this.scene.add(mesh);
    return mesh;
  }

  /**
   * Aggiorna trasformazione usando solo Matrix4
   * O(1) - trasformazione costante
   */
  setTransform(object, position, rotation, scale) {
    const matrix = this._getMatrixFromPool();
    
    // Posizione
    const pos = this._getVectorFromPool();
    pos.set(position.x, position.y, position.z);
    
    // Rotazione (Quaternion, mai Euler)
    const quat = this._getQuaternionFromPool();
    if (rotation.isQuaternion) {
      quat.copy(rotation);
    } else {
      // Se arriva come axis-angle o altro, converti a quaternion
      quat.setFromAxisAngle(rotation.axis, rotation.angle);
    }
    
    // Scala
    const scl = this._getVectorFromPool();
    scl.set(scale.x, scale.y, scale.z);
    
    // Compone Matrix4
    matrix.compose(pos, quat, scl);
    object.matrix.copy(matrix);
    object.matrixAutoUpdate = false;
    
    // Release pools
    this._releaseMatrix(matrix);
    this._releaseVector(pos);
    this._releaseVector(scl);
    this._releaseQuaternion(quat);
  }

  /**
   * Object pooling per Matrix4
   */
  _getMatrixFromPool() {
    return this.matrixPool.pop() || new THREE.Matrix4();
  }

  _releaseMatrix(matrix) {
    matrix.identity();
    this.matrixPool.push(matrix);
  }

  /**
   * Object pooling per Quaternion
   */
  _getQuaternionFromPool() {
    return this.quaternionPool.pop() || new THREE.Quaternion();
  }

  _releaseQuaternion(quat) {
    quat.set(0, 0, 0, 1);
    this.quaternionPool.push(quat);
  }

  /**
   * Object pooling per Vector3
   */
  _getVectorFromPool() {
    return this.vectorPool.pop() || new THREE.Vector3();
  }

  _releaseVector(vec) {
    vec.set(0, 0, 0);
    this.vectorPool.push(vec);
  }

  /**
   * Render loop
   * O(n) - n = numero oggetti nella scena
   */
  render() {
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Animation loop
   * O(n) - n = numero oggetti animati
   */
  animate() {
    requestAnimationFrame(() => this.animate());
    this.render();
  }

  /**
   * Resize handler
   * O(1) - resize costante
   */
  onResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(width, height);
  }

  /**
   * Cleanup
   * O(n) - n = numero risorse da rilasciare
   */
  dispose() {
    this.scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });
    
    this.renderer.dispose();
    this.matrixPool = [];
    this.quaternionPool = [];
    this.vectorPool = [];
  }
}

