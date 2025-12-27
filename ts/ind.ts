let text: string = "Dylan";
let word = "https://it-cheat-sheets-21aa0a.gitlab.io/typescript-cheat-sheet.html";

let quantity: number = 100;
let condition: boolean = true;
let noexiste: null = null;
let notassigner: undefined = undefined;
let big: bigint = 9007199254741991n;

let id: { name: string; age: number } = {
    name: "A",
    age: 1,
};

type person = {
    name: string;
    age: number;
};

let user: person = { name: "B", age: 2 };


interface definition {
    fake: string;
    spy: boolean;
    mal: number;
}

let definitions: definition = { fake: "yes", spy: true, mal: 3 };

enum direction {
    up,
    down,
    left,
    right,
}   

let move: direction = direction.up;

const enum Size {   
    Small = "S",   
    Medium = "M",   
    Large = "L",   
}

let tshirtSize: Size = Size.Medium;

function add(x: number, y: number): number {   
    return x + y;   
}

console.log(add(5, 10)); // Output: 15

function interactive(word: string, output?: string): string {   
    return `x, ${word}! ${output || "word"}`;   
}

console.log(interactive("Hello")); // Output: x, Hello! word
console.log(interactive("Hello", "Welcome")); // Output: x, Hello! Welcome