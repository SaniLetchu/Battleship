/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/gameboard.js":
/*!**************************!*\
  !*** ./src/gameboard.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const gameboard = () => {
  const map = {};
  const hits = {};
  const ships = [];
  // Gameboard is 10 x 10
  for (let i = 0; i < 10; i += 1) {
    for (let j = 0; j < 10; j += 1) {
      const coordinates = [j, i];
      // Every coordinate starts as empty
      map[coordinates] = null;
      // Separate coordinate dictionary for checking if it's hit
      hits[coordinates] = false;
    }
  }
  // Check if ship is inside the map
  const shipInsideMap = (ship, coordinates) => {
    if (ship.isVertical()) {
      if (ship.length + coordinates[1] - 1 < 10) {
        return true;
      }
      return false;
    }
    if (ship.length + coordinates[0] - 1 < 10) {
      return true;
    }
    return false;
  };

  const containsShip = (coordinates) => {
    if(map[coordinates] != null) {
      return true;
    }
    
      return false;
    
  }

  // Checks that ship is not next or ontop of another ship
  const shipNotOnTopOfOrNextToAnotherShip = (ship, coordinates) => {
    const newCoordinates = [coordinates[0] - 1, coordinates[1] - 1];

    if (ship.isVertical()) {
      for (let x = 0; x < 3; x += 1) {
        for (let y = 0; y < ship.length + 2; y += 1) {
          const checkX = x + newCoordinates[0];
          const checkY = y + newCoordinates[1];
          if (checkX > -1 && checkX < 10 && checkY > -1 && checkY < 10) {
            if (map[[checkX, checkY]] != null) {
              return false;
            }
          }
        }
      }
    } else {
      for (let y = 0; y < 3; y += 1) {
        for (let x = 0; x < ship.length + 2; x += 1) {
          const checkX = x + newCoordinates[0];
          const checkY = y + newCoordinates[1];
          if (checkX > -1 && checkX < 10 && checkY > -1 && checkY < 10) {
            if (map[[checkX, checkY]] != null) {
              return false;
            }
          }
        }
      }
    }

    return true;
  };

  const legalPlaceForShip = (ship, coordinates) => {
    if (
      shipInsideMap(ship, coordinates) &&
      shipNotOnTopOfOrNextToAnotherShip(ship, coordinates)
    ) {
      return true;
    }
    return false;
  };
  const placeShip = (ship, coordinates) => {
    if (legalPlaceForShip(ship, coordinates)) {
      const x = coordinates[0];
      const y = coordinates[1];
      ships.push(ship);
      if (ship.isVertical()) {
        for (let i = 0; i < ship.length; i += 1) {
          map[[x, y + i]] = [ship, i];
        }
      } else {
        for (let i = 0; i < ship.length; i += 1) {
          map[[x + i, y]] = [ship, i];
        }
      }
    }
  };
  const alreadyHit = (coordinates) => hits[coordinates];
  const receiveAttack = (coordinates) => {
    hits[coordinates] = true;
    if (map[coordinates] != null) {
      const partOfShip = map[coordinates][1];
      const ship = map[coordinates][0];
      ship.hit(partOfShip);
    }
  };
  const fleetDestroyed = () => ships.every((ship) => ship.isSunk());

  return {
    map,
    hits,
    placeShip,
    legalPlaceForShip,
    alreadyHit,
    receiveAttack,
    fleetDestroyed,
    containsShip,
  };
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (gameboard);


/***/ }),

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AI": () => (/* binding */ AI),
/* harmony export */   "Player": () => (/* binding */ Player)
/* harmony export */ });
const Player = (myBoard, enemyBoard) => {
  const lost = () => myBoard.fleetDestroyed();
  const attack = (coordinates) => {
    if (!enemyBoard.alreadyHit(coordinates)) {
      enemyBoard.receiveAttack(coordinates);
      return true;
    }

    return false;
  };
  const won = () => enemyBoard.fleetDestroyed();
  return { lost, attack, won };
};

const AI = (myBoard, enemyBoard) => {
  const lost = () => myBoard.fleetDestroyed();
  const randomCoordinates = () => {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);
    return [x, y];
  };
  const attack = (coordinates) => {
    if (!enemyBoard.alreadyHit(coordinates)) {
      enemyBoard.receiveAttack(coordinates);
      return true;
    }

    return false;
  };
  const AIAttack = () => {
    for (;;) {
      const cord = randomCoordinates();
      if (attack(cord)) {
        return cord;
      }
    }
  };
  const won = () => enemyBoard.fleetDestroyed();
  return { lost, attack, won, AIAttack };
};




/***/ }),

/***/ "./src/ship.js":
/*!*********************!*\
  !*** ./src/ship.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const ship = (length) => {
  const container = [];
  let vertical = false;
  for (let i = 0; i < length; i += 1) {
    container.push(0);
  }
  const isVertical = () => vertical;
  const rotate = () => {
    if (vertical) {
      vertical = false;
    } else {
      vertical = true;
    }
  };
  const hit = (position) => {
    container[position] = 1;
  };
  const isSunk = () => {
    for (let i = 0; i < container.length; i += 1) {
      if (container[i] === 0) {
        return false;
      }
    }
    return true;
  };
  return { container, isSunk, isVertical, hit, rotate, length };
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ship);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./player */ "./src/player.js");
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gameboard */ "./src/gameboard.js");
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ship */ "./src/ship.js");




const playerBoard = document.querySelector(".playerboard");
const playerBoardPlace = document.querySelector(".playerboardplace");
const enemyBoard = document.querySelector(".enemyboard");

const myShips = [(0,_ship__WEBPACK_IMPORTED_MODULE_2__["default"])(5), (0,_ship__WEBPACK_IMPORTED_MODULE_2__["default"])(4), (0,_ship__WEBPACK_IMPORTED_MODULE_2__["default"])(3), (0,_ship__WEBPACK_IMPORTED_MODULE_2__["default"])(3), (0,_ship__WEBPACK_IMPORTED_MODULE_2__["default"])(2)];
let myShipNumber = 0;
const enemyShips = [(0,_ship__WEBPACK_IMPORTED_MODULE_2__["default"])(5), (0,_ship__WEBPACK_IMPORTED_MODULE_2__["default"])(4), (0,_ship__WEBPACK_IMPORTED_MODULE_2__["default"])(3), (0,_ship__WEBPACK_IMPORTED_MODULE_2__["default"])(3), (0,_ship__WEBPACK_IMPORTED_MODULE_2__["default"])(2)];
let enemyShipNumber = 0;

let playerTurn = true;

const myBoard1 = (0,_gameboard__WEBPACK_IMPORTED_MODULE_1__["default"])();
const placeBoard = (0,_gameboard__WEBPACK_IMPORTED_MODULE_1__["default"])();
const enemyBoard1 = (0,_gameboard__WEBPACK_IMPORTED_MODULE_1__["default"])();

const playerOne = (0,_player__WEBPACK_IMPORTED_MODULE_0__.Player)(myBoard1, enemyBoard1);
const ai = (0,_player__WEBPACK_IMPORTED_MODULE_0__.AI)(enemyBoard1, myBoard1);

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
        if(!playerOne.won()) {
          const cord = ai.AIAttack();
          createHitMarker(myBoard1, cord, document.querySelector(`.player${cord[0]}${cord[1]}`));
          playerTurn = true;
          if(playerOne.lost()) {
            document.querySelector(".description").textContent = "YOU LOSE!";
            document.querySelector(".description").style = "font-size: 30px";
            document.querySelector(".description").style = "color: red";
            revealEnemyShips();
          }
        }
        else {
          document.querySelector(".description").textContent = "YOU WIN!";
          document.querySelector(".description").style = "font-size: 30px";
          document.querySelector(".description").style = "color: goldenrod";
          revealEnemyShips();
        }
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

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RSxFQUFFO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJFQUEyRSxRQUFRLEVBQUUsUUFBUTtBQUM3RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLGdCQUFnQjtBQUNyQyxxREFBcUQsZUFBZSxFQUFFLG1CQUFtQjtBQUN6RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsZ0JBQWdCO0FBQ3JDLHFEQUFxRCxtQkFBbUIsRUFBRSxlQUFlO0FBQ3pGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBnYW1lYm9hcmQgPSAoKSA9PiB7XG4gIGNvbnN0IG1hcCA9IHt9O1xuICBjb25zdCBoaXRzID0ge307XG4gIGNvbnN0IHNoaXBzID0gW107XG4gIC8vIEdhbWVib2FyZCBpcyAxMCB4IDEwXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkgKz0gMSkge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGogKz0gMSkge1xuICAgICAgY29uc3QgY29vcmRpbmF0ZXMgPSBbaiwgaV07XG4gICAgICAvLyBFdmVyeSBjb29yZGluYXRlIHN0YXJ0cyBhcyBlbXB0eVxuICAgICAgbWFwW2Nvb3JkaW5hdGVzXSA9IG51bGw7XG4gICAgICAvLyBTZXBhcmF0ZSBjb29yZGluYXRlIGRpY3Rpb25hcnkgZm9yIGNoZWNraW5nIGlmIGl0J3MgaGl0XG4gICAgICBoaXRzW2Nvb3JkaW5hdGVzXSA9IGZhbHNlO1xuICAgIH1cbiAgfVxuICAvLyBDaGVjayBpZiBzaGlwIGlzIGluc2lkZSB0aGUgbWFwXG4gIGNvbnN0IHNoaXBJbnNpZGVNYXAgPSAoc2hpcCwgY29vcmRpbmF0ZXMpID0+IHtcbiAgICBpZiAoc2hpcC5pc1ZlcnRpY2FsKCkpIHtcbiAgICAgIGlmIChzaGlwLmxlbmd0aCArIGNvb3JkaW5hdGVzWzFdIC0gMSA8IDEwKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoc2hpcC5sZW5ndGggKyBjb29yZGluYXRlc1swXSAtIDEgPCAxMCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBjb25zdCBjb250YWluc1NoaXAgPSAoY29vcmRpbmF0ZXMpID0+IHtcbiAgICBpZihtYXBbY29vcmRpbmF0ZXNdICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICBcbiAgfVxuXG4gIC8vIENoZWNrcyB0aGF0IHNoaXAgaXMgbm90IG5leHQgb3Igb250b3Agb2YgYW5vdGhlciBzaGlwXG4gIGNvbnN0IHNoaXBOb3RPblRvcE9mT3JOZXh0VG9Bbm90aGVyU2hpcCA9IChzaGlwLCBjb29yZGluYXRlcykgPT4ge1xuICAgIGNvbnN0IG5ld0Nvb3JkaW5hdGVzID0gW2Nvb3JkaW5hdGVzWzBdIC0gMSwgY29vcmRpbmF0ZXNbMV0gLSAxXTtcblxuICAgIGlmIChzaGlwLmlzVmVydGljYWwoKSkge1xuICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCAzOyB4ICs9IDEpIHtcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBzaGlwLmxlbmd0aCArIDI7IHkgKz0gMSkge1xuICAgICAgICAgIGNvbnN0IGNoZWNrWCA9IHggKyBuZXdDb29yZGluYXRlc1swXTtcbiAgICAgICAgICBjb25zdCBjaGVja1kgPSB5ICsgbmV3Q29vcmRpbmF0ZXNbMV07XG4gICAgICAgICAgaWYgKGNoZWNrWCA+IC0xICYmIGNoZWNrWCA8IDEwICYmIGNoZWNrWSA+IC0xICYmIGNoZWNrWSA8IDEwKSB7XG4gICAgICAgICAgICBpZiAobWFwW1tjaGVja1gsIGNoZWNrWV1dICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IDM7IHkgKz0gMSkge1xuICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHNoaXAubGVuZ3RoICsgMjsgeCArPSAxKSB7XG4gICAgICAgICAgY29uc3QgY2hlY2tYID0geCArIG5ld0Nvb3JkaW5hdGVzWzBdO1xuICAgICAgICAgIGNvbnN0IGNoZWNrWSA9IHkgKyBuZXdDb29yZGluYXRlc1sxXTtcbiAgICAgICAgICBpZiAoY2hlY2tYID4gLTEgJiYgY2hlY2tYIDwgMTAgJiYgY2hlY2tZID4gLTEgJiYgY2hlY2tZIDwgMTApIHtcbiAgICAgICAgICAgIGlmIChtYXBbW2NoZWNrWCwgY2hlY2tZXV0gIT0gbnVsbCkge1xuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgY29uc3QgbGVnYWxQbGFjZUZvclNoaXAgPSAoc2hpcCwgY29vcmRpbmF0ZXMpID0+IHtcbiAgICBpZiAoXG4gICAgICBzaGlwSW5zaWRlTWFwKHNoaXAsIGNvb3JkaW5hdGVzKSAmJlxuICAgICAgc2hpcE5vdE9uVG9wT2ZPck5leHRUb0Fub3RoZXJTaGlwKHNoaXAsIGNvb3JkaW5hdGVzKVxuICAgICkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgY29uc3QgcGxhY2VTaGlwID0gKHNoaXAsIGNvb3JkaW5hdGVzKSA9PiB7XG4gICAgaWYgKGxlZ2FsUGxhY2VGb3JTaGlwKHNoaXAsIGNvb3JkaW5hdGVzKSkge1xuICAgICAgY29uc3QgeCA9IGNvb3JkaW5hdGVzWzBdO1xuICAgICAgY29uc3QgeSA9IGNvb3JkaW5hdGVzWzFdO1xuICAgICAgc2hpcHMucHVzaChzaGlwKTtcbiAgICAgIGlmIChzaGlwLmlzVmVydGljYWwoKSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICBtYXBbW3gsIHkgKyBpXV0gPSBbc2hpcCwgaV07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgIG1hcFtbeCArIGksIHldXSA9IFtzaGlwLCBpXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgY29uc3QgYWxyZWFkeUhpdCA9IChjb29yZGluYXRlcykgPT4gaGl0c1tjb29yZGluYXRlc107XG4gIGNvbnN0IHJlY2VpdmVBdHRhY2sgPSAoY29vcmRpbmF0ZXMpID0+IHtcbiAgICBoaXRzW2Nvb3JkaW5hdGVzXSA9IHRydWU7XG4gICAgaWYgKG1hcFtjb29yZGluYXRlc10gIT0gbnVsbCkge1xuICAgICAgY29uc3QgcGFydE9mU2hpcCA9IG1hcFtjb29yZGluYXRlc11bMV07XG4gICAgICBjb25zdCBzaGlwID0gbWFwW2Nvb3JkaW5hdGVzXVswXTtcbiAgICAgIHNoaXAuaGl0KHBhcnRPZlNoaXApO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgZmxlZXREZXN0cm95ZWQgPSAoKSA9PiBzaGlwcy5ldmVyeSgoc2hpcCkgPT4gc2hpcC5pc1N1bmsoKSk7XG5cbiAgcmV0dXJuIHtcbiAgICBtYXAsXG4gICAgaGl0cyxcbiAgICBwbGFjZVNoaXAsXG4gICAgbGVnYWxQbGFjZUZvclNoaXAsXG4gICAgYWxyZWFkeUhpdCxcbiAgICByZWNlaXZlQXR0YWNrLFxuICAgIGZsZWV0RGVzdHJveWVkLFxuICAgIGNvbnRhaW5zU2hpcCxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdhbWVib2FyZDtcbiIsImNvbnN0IFBsYXllciA9IChteUJvYXJkLCBlbmVteUJvYXJkKSA9PiB7XG4gIGNvbnN0IGxvc3QgPSAoKSA9PiBteUJvYXJkLmZsZWV0RGVzdHJveWVkKCk7XG4gIGNvbnN0IGF0dGFjayA9IChjb29yZGluYXRlcykgPT4ge1xuICAgIGlmICghZW5lbXlCb2FyZC5hbHJlYWR5SGl0KGNvb3JkaW5hdGVzKSkge1xuICAgICAgZW5lbXlCb2FyZC5yZWNlaXZlQXR0YWNrKGNvb3JkaW5hdGVzKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgY29uc3Qgd29uID0gKCkgPT4gZW5lbXlCb2FyZC5mbGVldERlc3Ryb3llZCgpO1xuICByZXR1cm4geyBsb3N0LCBhdHRhY2ssIHdvbiB9O1xufTtcblxuY29uc3QgQUkgPSAobXlCb2FyZCwgZW5lbXlCb2FyZCkgPT4ge1xuICBjb25zdCBsb3N0ID0gKCkgPT4gbXlCb2FyZC5mbGVldERlc3Ryb3llZCgpO1xuICBjb25zdCByYW5kb21Db29yZGluYXRlcyA9ICgpID0+IHtcbiAgICBjb25zdCB4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgIGNvbnN0IHkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgcmV0dXJuIFt4LCB5XTtcbiAgfTtcbiAgY29uc3QgYXR0YWNrID0gKGNvb3JkaW5hdGVzKSA9PiB7XG4gICAgaWYgKCFlbmVteUJvYXJkLmFscmVhZHlIaXQoY29vcmRpbmF0ZXMpKSB7XG4gICAgICBlbmVteUJvYXJkLnJlY2VpdmVBdHRhY2soY29vcmRpbmF0ZXMpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuICBjb25zdCBBSUF0dGFjayA9ICgpID0+IHtcbiAgICBmb3IgKDs7KSB7XG4gICAgICBjb25zdCBjb3JkID0gcmFuZG9tQ29vcmRpbmF0ZXMoKTtcbiAgICAgIGlmIChhdHRhY2soY29yZCkpIHtcbiAgICAgICAgcmV0dXJuIGNvcmQ7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBjb25zdCB3b24gPSAoKSA9PiBlbmVteUJvYXJkLmZsZWV0RGVzdHJveWVkKCk7XG4gIHJldHVybiB7IGxvc3QsIGF0dGFjaywgd29uLCBBSUF0dGFjayB9O1xufTtcblxuZXhwb3J0IHsgUGxheWVyLCBBSSB9O1xuIiwiY29uc3Qgc2hpcCA9IChsZW5ndGgpID0+IHtcbiAgY29uc3QgY29udGFpbmVyID0gW107XG4gIGxldCB2ZXJ0aWNhbCA9IGZhbHNlO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgY29udGFpbmVyLnB1c2goMCk7XG4gIH1cbiAgY29uc3QgaXNWZXJ0aWNhbCA9ICgpID0+IHZlcnRpY2FsO1xuICBjb25zdCByb3RhdGUgPSAoKSA9PiB7XG4gICAgaWYgKHZlcnRpY2FsKSB7XG4gICAgICB2ZXJ0aWNhbCA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICB2ZXJ0aWNhbCA9IHRydWU7XG4gICAgfVxuICB9O1xuICBjb25zdCBoaXQgPSAocG9zaXRpb24pID0+IHtcbiAgICBjb250YWluZXJbcG9zaXRpb25dID0gMTtcbiAgfTtcbiAgY29uc3QgaXNTdW5rID0gKCkgPT4ge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29udGFpbmVyLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBpZiAoY29udGFpbmVyW2ldID09PSAwKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG4gIHJldHVybiB7IGNvbnRhaW5lciwgaXNTdW5rLCBpc1ZlcnRpY2FsLCBoaXQsIHJvdGF0ZSwgbGVuZ3RoIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBzaGlwO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBQbGF5ZXIsIEFJIH0gZnJvbSBcIi4vcGxheWVyXCI7XG5pbXBvcnQgZ2FtZWJvYXJkIGZyb20gXCIuL2dhbWVib2FyZFwiO1xuaW1wb3J0IHNoaXAgZnJvbSBcIi4vc2hpcFwiO1xuXG5jb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheWVyYm9hcmRcIik7XG5jb25zdCBwbGF5ZXJCb2FyZFBsYWNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5ZXJib2FyZHBsYWNlXCIpO1xuY29uc3QgZW5lbXlCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZW5lbXlib2FyZFwiKTtcblxuY29uc3QgbXlTaGlwcyA9IFtzaGlwKDUpLCBzaGlwKDQpLCBzaGlwKDMpLCBzaGlwKDMpLCBzaGlwKDIpXTtcbmxldCBteVNoaXBOdW1iZXIgPSAwO1xuY29uc3QgZW5lbXlTaGlwcyA9IFtzaGlwKDUpLCBzaGlwKDQpLCBzaGlwKDMpLCBzaGlwKDMpLCBzaGlwKDIpXTtcbmxldCBlbmVteVNoaXBOdW1iZXIgPSAwO1xuXG5sZXQgcGxheWVyVHVybiA9IHRydWU7XG5cbmNvbnN0IG15Qm9hcmQxID0gZ2FtZWJvYXJkKCk7XG5jb25zdCBwbGFjZUJvYXJkID0gZ2FtZWJvYXJkKCk7XG5jb25zdCBlbmVteUJvYXJkMSA9IGdhbWVib2FyZCgpO1xuXG5jb25zdCBwbGF5ZXJPbmUgPSBQbGF5ZXIobXlCb2FyZDEsIGVuZW15Qm9hcmQxKTtcbmNvbnN0IGFpID0gQUkoZW5lbXlCb2FyZDEsIG15Qm9hcmQxKTtcblxuZnVuY3Rpb24gY3JlYXRlSGl0TWFya2VyKGJvYXJkLCBjb29yZGluYXRlcywgZGl2KSB7XG4gIGlmKGJvYXJkLmNvbnRhaW5zU2hpcChjb29yZGluYXRlcykpIHtcbiAgICBkaXYuc3R5bGUgPSBcImJhY2tncm91bmQtaW1hZ2U6IHVybChoaXQuc3ZnKVwiO1xuICB9XG4gIGVsc2Uge1xuICAgIGRpdi5zdHlsZSA9IFwiYmFja2dyb3VuZC1pbWFnZTogdXJsKG1pc3Muc3ZnKVwiO1xuICB9XG59XG5cblxuXG5cbi8vIFBsYXllcmJvYXJkXG5mb3IobGV0IGkgPSAwOyBpIDwgMTA7IGkrPTEpIHtcbiAgZm9yKGxldCBqID0gMDsgaiA8IDEwOyBqKz0xKSB7XG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBkaXYuY2xhc3NMaXN0LmFkZChgcGxheWVyJHtqfSR7aX1gKTtcbiAgICBwbGF5ZXJCb2FyZC5hcHBlbmRDaGlsZChkaXYpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGRyYXdQbGFjZW1lbnQoY29vcmRpbmF0ZXMpIHtcbiAgY29uc3QgY3VycmVudFNoaXAgPSBteVNoaXBzW215U2hpcE51bWJlcl07XG4gIGNvbnN0IHNoaXBMZW5ndGggPSBjdXJyZW50U2hpcC5sZW5ndGg7XG4gIGlmKGN1cnJlbnRTaGlwLmlzVmVydGljYWwoKSkge1xuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3RoOyBpKz0xKSB7XG4gICAgICBjb25zdCBjaGVja1BsYWNlID0gY29vcmRpbmF0ZXNbMV0gKyBpO1xuICAgICAgaWYoY2hlY2tQbGFjZSA8IDEwKSB7XG4gICAgICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC5wbGF5ZXJwbGFjZSR7Y29vcmRpbmF0ZXNbMF19JHtjaGVja1BsYWNlfWApO1xuICAgICAgICBpZihwbGFjZUJvYXJkLmxlZ2FsUGxhY2VGb3JTaGlwKGN1cnJlbnRTaGlwLCBjb29yZGluYXRlcykpIHtcbiAgICAgICAgICBkaXYuc3R5bGUgPSBcImJhY2tncm91bmQtY29sb3I6IHJnYmEoNjAsIDE3OSwgMTEzLCAwLjc1KVwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGRpdi5zdHlsZSA9IFwiYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDAsIDAsIDAuNzUpXCI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZWxzZSB7XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGg7IGkrPTEpIHtcbiAgICAgIGNvbnN0IGNoZWNrUGxhY2UgPSBjb29yZGluYXRlc1swXSArIGk7XG4gICAgICBpZihjaGVja1BsYWNlIDwgMTApIHtcbiAgICAgICAgY29uc3QgZGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLnBsYXllcnBsYWNlJHtjaGVja1BsYWNlfSR7Y29vcmRpbmF0ZXNbMV19YCk7XG4gICAgICAgIGlmKHBsYWNlQm9hcmQubGVnYWxQbGFjZUZvclNoaXAoY3VycmVudFNoaXAsIGNvb3JkaW5hdGVzKSkge1xuICAgICAgICAgIGRpdi5zdHlsZSA9IFwiYmFja2dyb3VuZC1jb2xvcjogcmdiYSg2MCwgMTc5LCAxMTMsIDAuNzUpXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZGl2LnN0eWxlID0gXCJiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMCwgMCwgMC43NSlcIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiByZW1vdmVQbGFjZW1lbnQoKSB7XG4gIGNvbnN0IGNoaWxkcmVuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5ZXJib2FyZHBsYWNlXCIpLmNoaWxkTm9kZXM7XG4gIGNoaWxkcmVuLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgZWxlbWVudC5zdHlsZSA9IFwiYmFja2dyb3VuZC1jb2xvcjogbm9uZVwiO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcGxhY2VTaGlwKGNvb3JkaW5hdGVzLCBib2FyZCkge1xuICBjb25zdCBzaGlwcHBlbiA9IG15U2hpcHNbbXlTaGlwTnVtYmVyXTtcbiAgaWYoYm9hcmQubGVnYWxQbGFjZUZvclNoaXAoc2hpcHBwZW4sIGNvb3JkaW5hdGVzKSkge1xuICAgIHJlbW92ZVBsYWNlbWVudCgpO1xuICAgIGNvbnN0IHNoaXBMZW5ndGggPSBzaGlwcHBlbi5sZW5ndGg7XG4gICAgbXlTaGlwTnVtYmVyKz0xO1xuICAgIG15Qm9hcmQxLnBsYWNlU2hpcChzaGlwcHBlbiwgY29vcmRpbmF0ZXMpO1xuICAgIHBsYWNlQm9hcmQucGxhY2VTaGlwKHNoaXBwcGVuLCBjb29yZGluYXRlcyk7XG4gICAgaWYoc2hpcHBwZW4uaXNWZXJ0aWNhbCgpKSB7XG4gICAgICBmb3IobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aDsgaSs9MSkge1xuICAgICAgICBjb25zdCBkaXYyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLnBsYXllcnBsYWNlJHtjb29yZGluYXRlc1swXX0ke2Nvb3JkaW5hdGVzWzFdICsgaX1gKTtcbiAgICAgICAgY29uc3QgZGl2MyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC5wbGF5ZXIke2Nvb3JkaW5hdGVzWzBdfSR7Y29vcmRpbmF0ZXNbMV0gKyBpfWApO1xuICAgICAgICBjb25zdCBibGFja2JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGJsYWNrYm94LmNsYXNzTGlzdC5hZGQoXCJzaGlwXCIpO1xuICAgICAgICBjb25zdCBibGFja2JveDEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBibGFja2JveDEuY2xhc3NMaXN0LmFkZChcInNoaXBcIik7XG4gICAgICAgIGRpdjIuYXBwZW5kQ2hpbGQoYmxhY2tib3gxKTtcbiAgICAgICAgZGl2My5hcHBlbmRDaGlsZChibGFja2JveCk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGg7IGkrPTEpIHtcbiAgICAgICAgY29uc3QgZGl2MiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC5wbGF5ZXJwbGFjZSR7Y29vcmRpbmF0ZXNbMF0gKyBpfSR7Y29vcmRpbmF0ZXNbMV19YCk7XG4gICAgICAgIGNvbnN0IGRpdjMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAucGxheWVyJHtjb29yZGluYXRlc1swXSArIGl9JHtjb29yZGluYXRlc1sxXX1gKTtcbiAgICAgICAgY29uc3QgYmxhY2tib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBibGFja2JveC5jbGFzc0xpc3QuYWRkKFwic2hpcFwiKTtcbiAgICAgICAgY29uc3QgYmxhY2tib3gxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgYmxhY2tib3gxLmNsYXNzTGlzdC5hZGQoXCJzaGlwXCIpO1xuICAgICAgICBkaXYyLmFwcGVuZENoaWxkKGJsYWNrYm94MSk7XG4gICAgICAgIGRpdjMuYXBwZW5kQ2hpbGQoYmxhY2tib3gpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vLyBQbGF5ZXJib2FyZFBMYWNlXG5mb3IobGV0IGkgPSAwOyBpIDwgMTA7IGkrPTEpIHtcbiAgZm9yKGxldCBqID0gMDsgaiA8IDEwOyBqKz0xKSB7XG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBkaXYuY2xhc3NMaXN0LmFkZChgcGxheWVycGxhY2Uke2p9JHtpfWApO1xuICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdmVyXCIsICgpID0+IHtcbiAgICAgIGRyYXdQbGFjZW1lbnQoW2osaV0pO1xuICAgIH0pO1xuICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgKCkgPT4ge1xuICAgICAgcmVtb3ZlUGxhY2VtZW50KCk7XG4gICAgfSk7XG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICBwbGFjZVNoaXAoW2osaV0sIG15Qm9hcmQxKTtcbiAgICAgIGlmKG15U2hpcE51bWJlciA9PSA1KSB7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubW9kYWxcIikuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHBsYXllckJvYXJkUGxhY2UuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgfVxufVxuXG5mdW5jdGlvbiByb3RhdGVTaGlwKHNoaXBwZW4pIHtcbiAgc2hpcHBlbi5yb3RhdGUoKTtcbn1cblxuZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5yb3RhdGVcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgcm90YXRlU2hpcChteVNoaXBzW215U2hpcE51bWJlcl0pO1xufSlcblxuLy8gRW5lbXlib2FyZFxuZm9yKGxldCBpID0gMDsgaSA8IDEwOyBpKz0xKSB7XG4gIGZvcihsZXQgaiA9IDA7IGogPCAxMDsgais9MSkge1xuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgZGl2LmNsYXNzTGlzdC5hZGQoYGVuZW15JHtqfSR7aX1gKTtcbiAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIGlmKHBsYXllclR1cm4gJiYgIXBsYXllck9uZS53b24oKSAmJiAhcGxheWVyT25lLmxvc3QoKSAmJiBwbGF5ZXJPbmUuYXR0YWNrKFtqLCBpXSkpIHtcbiAgICAgICAgcGxheWVyVHVybiA9IGZhbHNlO1xuICAgICAgICBjcmVhdGVIaXRNYXJrZXIoZW5lbXlCb2FyZDEsIFtqLCBpXSwgZGl2KTtcbiAgICAgICAgaWYoIXBsYXllck9uZS53b24oKSkge1xuICAgICAgICAgIGNvbnN0IGNvcmQgPSBhaS5BSUF0dGFjaygpO1xuICAgICAgICAgIGNyZWF0ZUhpdE1hcmtlcihteUJvYXJkMSwgY29yZCwgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLnBsYXllciR7Y29yZFswXX0ke2NvcmRbMV19YCkpO1xuICAgICAgICAgIHBsYXllclR1cm4gPSB0cnVlO1xuICAgICAgICAgIGlmKHBsYXllck9uZS5sb3N0KCkpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGVzY3JpcHRpb25cIikudGV4dENvbnRlbnQgPSBcIllPVSBMT1NFIVwiO1xuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kZXNjcmlwdGlvblwiKS5zdHlsZSA9IFwiZm9udC1zaXplOiAzMHB4XCI7XG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRlc2NyaXB0aW9uXCIpLnN0eWxlID0gXCJjb2xvcjogcmVkXCI7XG4gICAgICAgICAgICByZXZlYWxFbmVteVNoaXBzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGVzY3JpcHRpb25cIikudGV4dENvbnRlbnQgPSBcIllPVSBXSU4hXCI7XG4gICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kZXNjcmlwdGlvblwiKS5zdHlsZSA9IFwiZm9udC1zaXplOiAzMHB4XCI7XG4gICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kZXNjcmlwdGlvblwiKS5zdHlsZSA9IFwiY29sb3I6IGdvbGRlbnJvZFwiO1xuICAgICAgICAgIHJldmVhbEVuZW15U2hpcHMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIGVuZW15Qm9hcmQuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwbGFjZUFJU2hpcChjb29yZGluYXRlcywgYm9hcmQpIHtcbiAgY29uc3Qgc2hpcHBwZW4gPSBlbmVteVNoaXBzW2VuZW15U2hpcE51bWJlcl07XG4gIGlmKGJvYXJkLmxlZ2FsUGxhY2VGb3JTaGlwKHNoaXBwcGVuLCBjb29yZGluYXRlcykpIHtcbiAgICBjb25zdCBzaGlwTGVuZ3RoID0gc2hpcHBwZW4ubGVuZ3RoO1xuICAgIGVuZW15U2hpcE51bWJlcis9MTtcbiAgICBlbmVteUJvYXJkMS5wbGFjZVNoaXAoc2hpcHBwZW4sIGNvb3JkaW5hdGVzKTtcbiAgICBpZihzaGlwcHBlbi5pc1ZlcnRpY2FsKCkpIHtcbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3RoOyBpKz0xKSB7XG4gICAgICAgIGNvbnN0IGRpdjMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuZW5lbXkke2Nvb3JkaW5hdGVzWzBdfSR7Y29vcmRpbmF0ZXNbMV0gKyBpfWApO1xuICAgICAgICBjb25zdCBibGFja2JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGJsYWNrYm94LmNsYXNzTGlzdC5hZGQoXCJzaGlwZW5lbXlcIik7XG4gICAgICAgIGRpdjMuYXBwZW5kQ2hpbGQoYmxhY2tib3gpO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3RoOyBpKz0xKSB7XG4gICAgICAgIGNvbnN0IGRpdjMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuZW5lbXkke2Nvb3JkaW5hdGVzWzBdICsgaX0ke2Nvb3JkaW5hdGVzWzFdfWApO1xuICAgICAgICBjb25zdCBibGFja2JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGJsYWNrYm94LmNsYXNzTGlzdC5hZGQoXCJzaGlwZW5lbXlcIik7XG4gICAgICAgIGRpdjMuYXBwZW5kQ2hpbGQoYmxhY2tib3gpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBwbGFjZUFJQm9hcmQoKSB7XG4gIHdoaWxlKGVuZW15U2hpcE51bWJlciAhPT0gNSkge1xuICAgIHJvdGF0ZVNoaXAoZW5lbXlTaGlwc1tlbmVteVNoaXBOdW1iZXJdKTtcbiAgICBwbGFjZUFJU2hpcChbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApLE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKV0sIGVuZW15Qm9hcmQxKVxuICB9XG59XG5cbnBsYWNlQUlCb2FyZCgpO1xuXG5mdW5jdGlvbiByZXZlYWxFbmVteVNoaXBzKCkge1xuICBjb25zdCBzaGlwcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc2hpcGVuZW15XCIpO1xuICBzaGlwcy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgIGVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IFwiMC43NVwiO1xuICB9KTtcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==