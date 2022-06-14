import { Player, AI } from "./player";
import gameboard from "./gameboard";
import ship from "./ship";

const playerBoard = document.querySelector(".playerboard");
const enemyBoard = document.querySelector(".enemyboard");

const myBoard1 = gameboard();
const enemyBoard1 = gameboard();

const playerOne = Player(myBoard1, enemyBoard1);
const ai = AI(enemyBoard1, myBoard1);


// Playerboard
for(let i = 0; i < 10; i+=1) {
  for(let j = 0; j < 10; j+=1) {
    const div = document.createElement("div");
    div.classList.add(`${j}${i}`);
    playerBoard.appendChild(div);
  }
}

// Enemyboard
for(let i = 0; i < 10; i+=1) {
  for(let j = 0; j < 10; j+=1) {
    const div = document.createElement("div");
    div.classList.add(`${j}${i}`);
    div.addEventListener("click", () => {
     
    });
    enemyBoard.appendChild(div);
  }
}