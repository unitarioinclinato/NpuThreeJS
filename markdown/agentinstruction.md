---
applyTo: '**'
---

# 📦 Project Context & Coding Guidelines

Queste linee guida definiscono il contesto del progetto e le regole che l’AI deve seguire quando:
- genera codice,
- risponde a domande tecniche,
- revisiona modifiche o PR,
- propone architetture o refactor.

Servono a garantire coerenza, qualità e un flusso di lavoro prevedibile.

---

## 🧭 Project Context

- Il progetto utilizza un approccio **modulare**, **scalabile** e **manutenibile**.
- Il codice deve essere scritto pensando a:
  - leggibilità,
  - estendibilità,
  - performance,
  - sicurezza,
  - chiarezza operativa.
- Le tecnologie principali (se rilevanti) devono essere rispettate: runtime, framework, librerie, standard del linguaggio.
- Le risposte devono essere orientate a **soluzioni reali**, non a tutorial generici.
- L’AI deve sempre preferire:
  - esempi concreti,
  - spiegazioni operative,
  - strutture chiare,
  - ragionamento modulare.

---

## 🧑‍💻 Coding Guidelines

### 1. **Stile del Codice**
- Usa nomi chiari e descrittivi.
- Mantieni funzioni e moduli piccoli e con responsabilità singola.
- Evita side‑effects non necessari.
- Commenta solo quando serve davvero (perché, non cosa).
- Segui le convenzioni del linguaggio (camelCase, PascalCase, snake_case, ecc.).

### 2. **Struttura**
- Preferisci composizione a ereditarietà.
- Mantieni separazione tra:
  - logica,
  - dati,
  - presentazione,
  - configurazione.
- Evita accoppiamento stretto tra moduli.

### 3. **Error Handling**
- Gestisci errori in modo esplicito.
- Non nascondere eccezioni.
- Fornisci messaggi utili per il debugging.

### 4. **Performance**
- Evita allocazioni inutili.
- Minimizza operazioni costose nei loop.
- Usa strutture dati appropriate.

### 5. **Sicurezza**
- Non inserire segreti o credenziali.
- Valida input e parametri.
- Evita pattern vulnerabili (eval, injection, ecc.).

---

## 🧪 Guidelines per Risposte Tecniche

Quando l’AI risponde a una domanda tecnica deve:

- fornire **soluzioni dirette**, non vaghe;
- spiegare *perché* una scelta è migliore di un’altra;
- proporre alternative quando sensato;
- chiedere chiarimenti solo se indispensabili;
- evitare contenuti superflui o scolastici;
- mantenere un tono professionale, chiaro e orientato all’azione.

---

## 🔍 Guidelines per Code Review

Quando l’AI revisiona codice deve:

- identificare problemi reali, non pedanterie;
- proporre fix concreti e implementabili;
- evidenziare rischi, edge case e incoerenze;
- suggerire refactor solo se portano valore;
- mantenere un tono costruttivo e collaborativo.

---

## 📤 Output Attesi

Ogni output dell’AI deve essere:

- coerente con queste linee guida,
- completo ma non prolisso,
- strutturato in sezioni chiare,
- pronto all’uso (copiabile/incollabile),
- tecnicamente accurato.

---

## 🧩 Obiettivo Finale

Garantire che ogni contributo dell’AI:
- migliori la qualità del progetto,
- riduca ambiguità,
- acceleri il lavoro,
- mantenga coerenza tecnica e stilistica.
