import * as THREE from 'three';

/**
 * GeminiCapsule - Modello 3D capsula Gemini
 * Complessità: O(1) per creazione, O(k) per geometria (k = vertici)
 */
export class GeminiCapsule {
  constructor(scale = 1.0) {
    this.scale = scale;
    this.mesh = null;
    this._build();
  }

  /**
   * Costruisce geometria capsula Gemini
   * O(k) - k = numero vertici geometria
   */
  _build() {
    // Corpo principale (cono tronco)
    const bodyGeometry = new THREE.ConeGeometry(0.5, 2.0, 16);
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      emissive: 0x222222,
      shininess: 30
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);

    // Heat shield (base)
    const shieldGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
    const shieldMaterial = new THREE.MeshPhongMaterial({
      color: 0x333333,
      emissive: 0x111111
    });
    const shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
    shield.position.y = -1.05;
    body.add(shield);

    // Finestre (2)
    const windowGeometry = new THREE.RingGeometry(0.15, 0.25, 16);
    const windowMaterial = new THREE.MeshPhongMaterial({
      color: 0x0066ff,
      transparent: true,
      opacity: 0.7,
      emissive: 0x001133
    });
    
    const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
    window1.position.set(0.55, 0.3, 0);
    window1.rotation.y = Math.PI / 2;
    body.add(window1);

    const window2 = new THREE.Mesh(windowGeometry, windowMaterial);
    window2.position.set(-0.55, 0.3, 0);
    window2.rotation.y = -Math.PI / 2;
    body.add(window2);

    // Retro rockets (4)
    const retroGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.2, 8);
    const retroMaterial = new THREE.MeshPhongMaterial({
      color: 0xff6600,
      emissive: 0x331100
    });

    const positions = [
      [0.4, -0.8, 0],
      [-0.4, -0.8, 0],
      [0, -0.8, 0.4],
      [0, -0.8, -0.4]
    ];

    positions.forEach(([x, y, z]) => {
      const retro = new THREE.Mesh(retroGeometry, retroMaterial);
      retro.position.set(x, y, z);
      retro.rotation.x = Math.PI / 2;
      body.add(retro);
    });

    // Docking adapter (top)
    const adapterGeometry = new THREE.CylinderGeometry(0.3, 0.4, 0.3, 16);
    const adapterMaterial = new THREE.MeshPhongMaterial({
      color: 0xcccccc,
      emissive: 0x222222
    });
    const adapter = new THREE.Mesh(adapterGeometry, adapterMaterial);
    adapter.position.y = 1.15;
    body.add(adapter);

    // Scala applicata
    body.scale.set(this.scale, this.scale, this.scale);

    this.mesh = body;
  }

  /**
   * Aggiorna posizione/orientazione usando Matrix4
   * O(1) - trasformazione costante
   */
  setTransform(position, rotation, scale) {
    if (!this.mesh) return;
    
    const matrix = new THREE.Matrix4();
    matrix.compose(
      position,
      rotation.isQuaternion ? rotation : new THREE.Quaternion().setFromEuler(rotation),
      scale
    );
    this.mesh.matrix.copy(matrix);
    this.mesh.matrixAutoUpdate = false;
  }

  /**
   * Get mesh per aggiunta alla scena
   */
  getMesh() {
    return this.mesh;
  }

  /**
   * Cleanup
   */
  dispose() {
    if (this.mesh) {
      this.mesh.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
    }
  }
}

