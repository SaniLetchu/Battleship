import { player, AI } from "./player";
import gameboard from "./gameboard";
import ship from "./ship";

const playerBoard = document.querySelector(".playerboard");
const enemyBoard = document.querySelector(".enemyboard");

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
    enemyBoard.appendChild(div);
  }
}