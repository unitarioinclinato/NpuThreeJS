import * as THREE from 'three';

/**
 * GeminiOrbit - Calcolo e visualizzazione orbita Gemini
 * Complessità: O(k) per generazione orbita (k = punti)
 */
export class GeminiOrbit {
  constructor(orbitData, earthRadius = 6371000) {
    this.orbitData = orbitData;
    this.earthRadius = earthRadius;
    this.line = null;
    this._build();
  }

  /**
   * Genera geometria orbita ellittica
   * O(k) - k = numero punti orbita
   */
  _build() {
    const points = [];
    const segments = 200;
    
    // Conversione km a metri
    const apogee = this.orbitData.apogee * 1000;
    const perigee = this.orbitData.perigee * 1000;
    const inclination = this.orbitData.inclination * Math.PI / 180;
    
    // Parametri orbita ellittica
    const semiMajorAxis = (apogee + perigee) / 2;
    const eccentricity = (apogee - perigee) / (apogee + perigee);
    
    for (let i = 0; i <= segments; i++) {
      const trueAnomaly = (i / segments) * Math.PI * 2;
      
      // Distanza dal centro Terra
      const r = semiMajorAxis * (1 - eccentricity * eccentricity) / 
                (1 + eccentricity * Math.cos(trueAnomaly));
      
      // Coordinate orbitali
      const x = r * Math.cos(trueAnomaly);
      const y = r * Math.sin(trueAnomaly) * Math.sin(inclination);
      const z = r * Math.sin(trueAnomaly) * Math.cos(inclination);
      
      points.push(new THREE.Vector3(x, y, z));
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.6,
      linewidth: 2
    });
    
    this.line = new THREE.Line(geometry, material);
  }

  /**
   * Calcola posizione satellite al tempo t (secondi)
   * O(1) - calcolo costante
   */
  getPositionAtTime(t) {
    const apogee = this.orbitData.apogee * 1000;
    const perigee = this.orbitData.perigee * 1000;
    const semiMajorAxis = (apogee + perigee) / 2;
    const eccentricity = (apogee - perigee) / (apogee + perigee);
    const inclination = this.orbitData.inclination * Math.PI / 180;
    
    // Mean anomaly (semplificato)
    const meanMotion = 2 * Math.PI / (this.orbitData.period * 60); // rad/s
    const meanAnomaly = meanMotion * t;
    
    // True anomaly (approssimazione)
    const trueAnomaly = meanAnomaly + 2 * eccentricity * Math.sin(meanAnomaly);
    
    // Distanza
    const r = semiMajorAxis * (1 - eccentricity * eccentricity) / 
              (1 + eccentricity * Math.cos(trueAnomaly));
    
    // Posizione RTC
    const x = r * Math.cos(trueAnomaly);
    const y = r * Math.sin(trueAnomaly) * Math.sin(inclination);
    const z = r * Math.sin(trueAnomaly) * Math.cos(inclination);
    
    return new THREE.Vector3(x, y, z);
  }

  /**
   * Get line mesh
   */
  getLine() {
    return this.line;
  }

  /**
   * Cleanup
   */
  dispose() {
    if (this.line) {
      this.line.geometry.dispose();
      this.line.material.dispose();
    }
  }
}

