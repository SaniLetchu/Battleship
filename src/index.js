import { Player, AI } from "./player";
import gameboard from "./gameboard";
import ship from "./ship";

const playerBoard = document.querySelector(".playerboard");
const playerBoardPlace = document.querySelector(".playerboardplace");
const enemyBoard = document.querySelector(".enemyboard");

const myShips = [ship(5), ship(4), ship(3), ship(3), ship(2)];
let myShipNumber = 0;
const enemyShips = [ship(5), ship(4), ship(3), ship(3), ship(2)];
let enemyShipNumber = 0;

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

function drawPlacement(coordinates) {
  const currentShip = myShips[myShipNumber];
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

function placeShip(coordinates, board) {
  const shipppen = myShips[myShipNumber];
  if(board.legalPlaceForShip(shipppen, coordinates)) {
    removePlacement();
    const shipLength = shipppen.length;
    myShipNumber+=1;
    myBoard1.placeShip(shipppen, coordinates);
    placeBoard.placeShip(shipppen, coordinates);
    if(shipppen.isVertical()) {
      for(let i = 0; i < shipLength; i+=1) {
        const div2 = document.querySelector(`.playerplace${coordinates[0]}${coordinates[1] + i}`);
        const div3 = document.querySelector(`.player${coordinates[0]}${coordinates[1] + i}`);
        const blackbox = document.createElement("div");
        blackbox.classList.add("ship");
        const blackbox1 = document.createElement("div");
        blackbox1.classList.add("ship");
        div2.appendChild(blackbox1);
        div3.appendChild(blackbox);
      }
    }
    else {
      for(let i = 0; i < shipLength; i+=1) {
        const div2 = document.querySelector(`.playerplace${coordinates[0] + i}${coordinates[1]}`);
        const div3 = document.querySelector(`.player${coordinates[0] + i}${coordinates[1]}`);
        const blackbox = document.createElement("div");
        blackbox.classList.add("ship");
        const blackbox1 = document.createElement("div");
        blackbox1.classList.add("ship");
        div2.appendChild(blackbox1);
        div3.appendChild(blackbox);
      }
    }
  }
}

// PlayerboardPLace
for(let i = 0; i < 10; i+=1) {
  for(let j = 0; j < 10; j+=1) {
    const div = document.createElement("div");
    div.classList.add(`playerplace${j}${i}`);
    div.addEventListener("mouseover", () => {
      drawPlacement([j,i]);
    });
    div.addEventListener("mouseout", () => {
      removePlacement();
    });
    div.addEventListener("click", () => {
      placeShip([j,i], myBoard1);
      if(myShipNumber == 5) {
        document.querySelector(".modal").style.display = "none";
      }
    });
    playerBoardPlace.appendChild(div);
  }
}

function rotateShip(shippen) {
  shippen.rotate();
}

document.querySelector(".rotate").addEventListener("click", () => {
  rotateShip(myShips[myShipNumber]);
})

// Enemyboard
for(let i = 0; i < 10; i+=1) {
  for(let j = 0; j < 10; j+=1) {
    const div = document.createElement("div");
    div.classList.add(`enemy${j}${i}`);
    div.addEventListener("click", () => {
      if(playerTurn && !playerOne.won() && !playerOne.lost() && playerOne.attack([j, i])) {
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

function placeAIShip(coordinates, board) {
  const shipppen = enemyShips[enemyShipNumber];
  if(board.legalPlaceForShip(shipppen, coordinates)) {
    const shipLength = shipppen.length;
    enemyShipNumber+=1;
    enemyBoard1.placeShip(shipppen, coordinates);
    if(shipppen.isVertical()) {
      for(let i = 0; i < shipLength; i+=1) {
        const div3 = document.querySelector(`.enemy${coordinates[0]}${coordinates[1] + i}`);
        const blackbox = document.createElement("div");
        blackbox.classList.add("shipenemy");
        div3.appendChild(blackbox);
      }
    }
    else {
      for(let i = 0; i < shipLength; i+=1) {
        const div3 = document.querySelector(`.enemy${coordinates[0] + i}${coordinates[1]}`);
        const blackbox = document.createElement("div");
        blackbox.classList.add("shipenemy");
        div3.appendChild(blackbox);
      }
    }
  }
}

function placeAIBoard() {
  while(enemyShipNumber !== 5) {
    rotateShip(enemyShips[enemyShipNumber]);
    placeAIShip([Math.floor(Math.random() * 10),Math.floor(Math.random() * 10)], enemyBoard1)
  }
}

placeAIBoard();

function revealEnemyShips() {
  const ships = document.querySelectorAll(".shipenemy");
  ships.forEach(element => {
    element.style.opacity = "0.75";
  });
}
