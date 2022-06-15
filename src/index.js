import { Player, AI } from "./player";
import gameboard from "./gameboard";
import ship from "./ship";

const playerBoard = document.querySelector(".playerboard");
const playerBoardPlace = document.querySelector(".playerboardplace");
const enemyBoard = document.querySelector(".enemyboard");

const myShips = [ship(5), ship(4), ship(3), ship(3), ship(2)];
const myShipNumber = 0;
const enemyShips = [ship(5), ship(4), ship(3), ship(3), ship(2)];
const enemyShipNumber = 0;

let playerTurn = true;

const myBoard1 = gameboard();
const placeBoard = gameboard();
const enemyBoard1 = gameboard();

const playerOne = Player(myBoard1, enemyBoard1);
const ai = AI(enemyBoard1, myBoard1);

function createHitMarker(board, coordinates, div) {
  if(board.containsShip(coordinates)) {
    div.style = "background-image: url(hit.svg)";
  }
  else {
    div.style = "background-image: url(miss.svg)";
  }
} 


// Playerboard
for(let i = 0; i < 10; i+=1) {
  for(let j = 0; j < 10; j+=1) {
    const div = document.createElement("div");
    div.classList.add(`player${j}${i}`);
    playerBoard.appendChild(div);
  }
}

function drawPlacement(coordinates, currentShip) {
  const shipLength = currentShip.length;
  if(currentShip.isVertical()) {
    for(let i = 0; i < shipLength; i+=1) {
      const checkPlace = coordinates[1] + i;
      if(checkPlace < 10) {
        const div = document.querySelector(`.playerplace${coordinates[0]}${checkPlace}`);
        if(placeBoard.legalPlaceForShip(currentShip, coordinates)) {
          div.style = "background-color: rgba(60, 179, 113, 0.75)";
        }
        else {
          div.style = "background-color: rgba(255, 0, 0, 0.75)";
        }
      }
    }
  }
  else {
    for(let i = 0; i < shipLength; i+=1) {
      const checkPlace = coordinates[0] + i;
      if(checkPlace < 10) {
        const div = document.querySelector(`.playerplace${checkPlace}${coordinates[1]}`);
        if(placeBoard.legalPlaceForShip(currentShip, coordinates)) {
          div.style = "background-color: rgba(60, 179, 113, 0.75)";
        }
        else {
          div.style = "background-color: rgba(255, 0, 0, 0.75)";
        }
      }
    }
  }
}

function removePlacement() {
  const children = document.querySelector(".playerboardplace").childNodes;
  children.forEach(element => {
    element.style = "background-color: none";
  });
}

// PlayerboardPLace
for(let i = 0; i < 10; i+=1) {
  for(let j = 0; j < 10; j+=1) {
    const div = document.createElement("div");
    div.classList.add(`playerplace${j}${i}`);
    div.addEventListener("mouseover", () => {
      drawPlacement([j,i], myShips[myShipNumber]);
    });
    div.addEventListener("mouseout", () => {
      removePlacement();
    });
    playerBoardPlace.appendChild(div);
  }
}

function rotateShip(shippen) {
  shippen.rotate();
}

document.querySelector("button").addEventListener("click", () => {
  rotateShip(myShips[myShipNumber]);
})

// Enemyboard
for(let i = 0; i < 10; i+=1) {
  for(let j = 0; j < 10; j+=1) {
    const div = document.createElement("div");
    div.classList.add(`enemy${j}${i}`);
    div.addEventListener("click", () => {
      if(playerOne.attack([j, i]) && playerTurn) { // && !playerOne.won() && !playerOne.lost()
        playerTurn = false;
        createHitMarker(enemyBoard1, [j, i], div);
        const cord = ai.AIAttack();
        createHitMarker(myBoard1, cord, document.querySelector(`.player${cord[0]}${cord[1]}`));
        playerTurn = true;
      }
    });
    enemyBoard.appendChild(div);
  }
}