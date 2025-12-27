---
agent: agent
---
---
agent: agent
---

## 🎯 Obiettivo del Task
Definire con precisione il compito da svolgere, includendo:
- requisiti specifici,
- vincoli tecnici e operativi,
- criteri di successo misurabili.

Questa sezione serve come fondazione per qualsiasi agente, workflow o automazione, garantendo chiarezza e allineamento prima dell’esecuzione.

---

## 📌 Requisiti Specifici

- Il task deve essere descritto in modo **chiaro, conciso e operativo**.
- Devono essere elencati **tutti gli input necessari** (file, parametri, contesto, dipendenze).
- Devono essere definiti **gli output attesi**, con formato e struttura.
- Devono essere identificati eventuali **vincoli**:
  - tecnici (linguaggi, runtime, compatibilità),
  - temporali (deadline, step),
  - qualitativi (performance, leggibilità, modularità),
  - di sicurezza o etici.
- Il task deve essere formulato in modo da poter essere eseguito da un agente senza ambiguità.

---

## 🚧 Vincoli

- Nessuna ambiguità: ogni termine deve essere definito.
- Nessuna dipendenza nascosta: tutto ciò che serve deve essere esplicitato.
- Il task non deve richiedere azioni non consentite (esecuzione di codice locale, accesso a file non forniti, attività non etiche).
- Il task deve essere realizzabile con gli strumenti disponibili all’agente.

---

## ✅ Criteri di Successo

Il task è considerato completato con successo quando:

1. **Tutti i requisiti specificati sono soddisfatti.**
2. **Gli output generati corrispondono esattamente ai formati richiesti.**
3. **Non ci sono ambiguità residue** nella definizione o nell’esecuzione.
4. **Il risultato è verificabile**, riproducibile e coerente con gli obiettivi iniziali.
5. **I vincoli sono rispettati** senza eccezioni.

---

## 🧪 Esempio di struttura di un task ben definito

- **Titolo:** Generare un’architettura modulare per un’app WebGL.
- **Input richiesti:** descrizione del progetto, target browser, librerie disponibili.
- **Output atteso:** schema architetturale in Markdown + diagramma testuale dei moduli.
- **Vincoli:** compatibilità con WebGL2, nessuna dipendenza esterna non dichiarata.
- **Success criteria:** documento chiaro, completo, implementabile senza ulteriori domande.

---

## 🧭 Note Finali

Questa definizione funge da template universale per qualsiasi task complesso.  
Può essere riutilizzata, estesa o integrata in sistemi più ampi (MCP, cockpit, pipeline, agenti specializzati).
