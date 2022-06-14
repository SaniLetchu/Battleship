import { player, AI, AI } from "./player";
import gameboard from "./gameboard";
import ship from "./ship";

const playerBoard = document.querySelector(".playerboard");
const enemyBoard = document.querySelector(".enemyboard");

const myBoard1 = gameboard();
const enemyBoard1 = gameboard();

let playerTurn = True;

const playerOne = new player(myBoard1, enemyBoard1);
const ai = new AI(enemyBoard1, myBoard1);


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
    div.addEventListener("click", function() {
      if(playerOne.attack([j, i])) {
        playerTurn = false;

        const cord = ai.AIAttack();
        const myDiv = document.querySelector(`.playerboard > .${cord[0]}${cord[1]}`);
        
      }
    });
    enemyBoard.appendChild(div);
  }
}