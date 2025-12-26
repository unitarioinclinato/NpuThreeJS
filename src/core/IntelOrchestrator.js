import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

/**
 * IntelOrchestrator - Tracciamento satellitare OSINT e geospaziale
 * Complessità: O(n log n) per sorting satelliti, O(1) per lookup posizione
 */
export class IntelOrchestrator {
  constructor(engine) {
    this.engine = engine;
    
    // Satellite tracking
    this.satellites = new Map(); // id -> {position, orbit, metadata}
    this.orbitLines = new Map(); // id -> THREE.Line
    
    // Geospatial data
    this.geoMarkers = new Map();
    this.geoOverlays = [];
    
    // RTC (Relative To Center) per coordinate planetarie
    this.planetCenter = new THREE.Vector3(0, 0, 0);
    this.earthRadius = 6371000; // metri
    
    // Culling per dataset geospaziali
    this.frustumCuller = new THREE.Frustum();
    this.occlusionCuller = null; // placeholder per occlusion culling custom
  }

  /**
   * Aggiunge satellite con orbita
   * O(1) - inserimento costante
   */
  addSatellite(id, tleData, metadata = {}) {
    // TLE (Two-Line Element) parsing placeholder
    const orbit = this._parseTLE(tleData);
    
    this.satellites.set(id, {
      id,
      orbit,
      metadata,
      position: new THREE.Vector3(),
      lastUpdate: Date.now()
    });
    
    // Visualizza orbita
    this._visualizeOrbit(id, orbit);
  }

  /**
   * Parsing TLE (placeholder per libreria SGP4)
   * O(1) - parsing costante
   */
  _parseTLE(tleData) {
    // TODO: Integrazione con satellite.js o sgp4
    return {
      semiMajorAxis: 7000000, // metri
      eccentricity: 0.01,
      inclination: 51.6, // gradi
      raan: 0, // Right Ascension of Ascending Node
      argumentOfPeriapsis: 0,
      meanAnomaly: 0
    };
  }

  /**
   * Visualizza orbita come Line
   * O(k) - k = punti orbita (tipicamente 100-200)
   */
  _visualizeOrbit(id, orbit) {
    const points = [];
    const segments = 100;
    
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      // Calcolo posizione orbita (semplificato)
      const x = orbit.semiMajorAxis * Math.cos(angle);
      const y = orbit.semiMajorAxis * Math.sin(angle) * Math.sin(orbit.inclination * Math.PI / 180);
      const z = orbit.semiMajorAxis * Math.sin(angle) * Math.cos(orbit.inclination * Math.PI / 180);
      
      // RTC: relativizza al centro pianeta
      const rtcPos = new THREE.Vector3(x, y, z).add(this.planetCenter);
      points.push(rtcPos);
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const line = new THREE.Line(geometry, material);
    
    this.engine.scene.add(line);
    this.orbitLines.set(id, line);
  }

  /**
   * Aggiorna posizione satellite al tempo t
   * O(1) - calcolo posizione costante
   */
  updateSatellitePosition(id, time) {
    const sat = this.satellites.get(id);
    if (!sat) return;
    
    // Calcolo posizione orbitale (semplificato, usa SGP4 per precisione)
    const t = (time - sat.lastUpdate) / 1000; // secondi
    const angle = (t * 0.001) % (Math.PI * 2); // velocità angolare semplificata
    
    const x = sat.orbit.semiMajorAxis * Math.cos(angle);
    const y = sat.orbit.semiMajorAxis * Math.sin(angle) * Math.sin(sat.orbit.inclination * Math.PI / 180);
    const z = sat.orbit.semiMajorAxis * Math.sin(angle) * Math.cos(sat.orbit.inclination * Math.PI / 180);
    
    // RTC
    sat.position.set(x, y, z).add(this.planetCenter);
    sat.lastUpdate = time;
    
    // Aggiorna marker visivo se esiste
    const marker = this.geoMarkers.get(id);
    if (marker) {
      this.engine.setTransform(
        marker,
        sat.position,
        new THREE.Quaternion(),
        new THREE.Vector3(1, 1, 1)
      );
    }
  }

  /**
   * Aggiunge marker geospaziale (lat/lon -> RTC)
   * O(1) - conversione costante
   */
  addGeoMarker(id, lat, lon, altitude = 0) {
    // Conversione lat/lon a RTC
    const rtcPos = this._latLonToRTC(lat, lon, altitude);
    
    // Marker visivo
    const geometry = new THREE.SphereGeometry(10000, 16, 16); // 10km radius
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const marker = new THREE.Mesh(geometry, material);
    
    this.engine.setTransform(
      marker,
      rtcPos,
      new THREE.Quaternion(),
      new THREE.Vector3(1, 1, 1)
    );
    
    this.engine.scene.add(marker);
    this.geoMarkers.set(id, marker);
    
    return marker;
  }

  /**
   * Conversione lat/lon/alt a RTC (Relative To Center)
   * O(1) - conversione costante
   */
  _latLonToRTC(lat, lon, alt) {
    const phi = (90 - lat) * Math.PI / 180; // colatitude
    const theta = (lon + 180) * Math.PI / 180; // longitude
    
    const radius = this.earthRadius + alt;
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    
    return new THREE.Vector3(x, y, z).add(this.planetCenter);
  }

  /**
   * Frustum culling per markers geospaziali
   * O(n) - n = numero markers
   */
  cullGeoMarkers(camera) {
    const matrix = new THREE.Matrix4().multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse
    );
    this.frustumCuller.setFromProjectionMatrix(matrix);
    
    let culled = 0;
    this.geoMarkers.forEach((marker, id) => {
      if (!this.frustumCuller.intersectsObject(marker)) {
        marker.visible = false;
        culled++;
      } else {
        marker.visible = true;
      }
    });
    
    return culled;
  }

  /**
   * Update loop
   * O(n) - n = numero satelliti
   */
  update(time = Date.now()) {
    this.satellites.forEach((sat, id) => {
      this.updateSatellitePosition(id, time);
    });
  }

  /**
   * Cleanup
   * O(n) - n = numero risorse
   */
  dispose() {
    this.orbitLines.forEach(line => {
      line.geometry.dispose();
      line.material.dispose();
      this.engine.scene.remove(line);
    });
    
    this.geoMarkers.forEach(marker => {
      marker.geometry.dispose();
      marker.material.dispose();
      this.engine.scene.remove(marker);
    });
    
    this.satellites.clear();
    this.orbitLines.clear();
    this.geoMarkers.clear();
  }
}

