# System Monitor - Dashboard Tempo Reale

Dashboard interattiva 3D che mostra in tempo reale le operazioni del sistema NpuThreeJS.

## Caratteristiche

- **Visualizzazione 3D**: Nodi moduli, connessioni, particelle sistema
- **Log Tempo Reale**: Tracciamento operazioni in corso
- **Metriche Sistema**: CPU, Memory, Network, Connections
- **Operazioni Attive**: Lista operazioni con durata
- **Auto-Update**: Aggiornamento continuo ogni 500ms

## Utilizzo

```bash
# Avvia server
npm run monitor:serve

# Oppure
npx serve . -p 3001
```

Apri: `http://localhost:3001/src/apps/SystemMonitor/index.html`

## Componenti

- **Log Panel**: Log sistema in tempo reale
- **Metrics Panel**: Metriche CPU/Memory/Network
- **Operations Panel**: Operazioni attive con durata
- **3D Visualization**: Nodi moduli con animazioni

## API

```javascript
// Aggiungi log
systemMonitor.addLog('Message', 'info|warning|error');

// Aggiungi operazione
systemMonitor.addOperation('Operation name', 'running');

// Rimuovi operazione
systemMonitor.removeOperation('Operation name');
```

## Architettura

- Usa `AntigravityEngine` per rendering 3D
- Matrix4/Quaternion only
- Zero garbage design
- ESM modules


