interface NodoMappa {
    x: number;
    y: number;
    nome: string;
    attivo?: boolean; // Il '?' significa: questo nel JSON può anche mancare!
}

const mappa: NodoMappa[] = [
    { x: 10, y: 20, nome: "Inizio", attivo: true },
    { x: 15, y: 25, nome: "Punto di Controllo" },
    { x: 20, y: 30, nome: "Fine", attivo: false }
];  
for (const nodo of mappa) {
    const stato = nodo.attivo ? "attivo" : "inattivo";
    console.log(`Nodo "${nodo.nome}" a (${nodo.x}, ${nodo.y}) è ${stato}.`);
}
