# Gemini Eyes - NASA Eyes Replica

Replica interattiva di [NASA Eyes](https://eyes.nasa.gov/apps/mars2020/#/home) per il Programma Gemini (1965-1966).

## Caratteristiche

- **Visualizzazione 3D**: Terra, orbite, capsule Gemini
- **Timeline Interattiva**: Navigazione temporale delle missioni
- **10 Missioni Gemini**: Dati storici completi
- **Tracciamento Orbitale**: Calcolo posizioni in tempo reale
- **Controlli Camera**: Follow, free, earth view
- **UI Stile NASA**: Interfaccia simile a NASA Eyes

## Missioni Incluse

- Gemini 3 (Grissom, Young)
- Gemini 4 (McDivitt, White) - Prima EVA USA
- Gemini 5 (Cooper, Conrad) - Record durata 8 giorni
- Gemini 6A/7 (Schirra/Stafford, Borman/Lovell) - Primo rendezvous
- Gemini 8 (Armstrong, Scott) - Primo docking
- Gemini 9A (Stafford, Cernan)
- Gemini 10 (Young, Collins)
- Gemini 11 (Conrad, Gordon) - Record altitudine
- Gemini 12 (Lovell, Aldrin) - Missione finale

## Utilizzo

```bash
# Installa dipendenze
npm install

# Avvia server locale (serve index.html)
npx serve src/apps/GeminiEyes
```

## Controlli

- **Spazio**: Play/Pause timeline
- **C**: Cambia modalità camera (follow/free)
- **Mouse**: Interazione UI

## Architettura

- `GeminiEyesApp.js`: Applicazione principale
- `GeminiMissionData.js`: Dati storici missioni
- `GeminiCapsule.js`: Modello 3D capsula
- `GeminiOrbit.js`: Calcolo orbite ellittiche
- Usa `AntigravityEngine` e `IntelOrchestrator` da core

## Tecnologie

- Three.js per rendering 3D
- Matrix4/Quaternion only (no Euler)
- RTC per coordinate planetarie
- Object pooling per performance

