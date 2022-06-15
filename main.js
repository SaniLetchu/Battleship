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

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RSxFQUFFO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5RUFBeUUsUUFBUSxFQUFFLFFBQVE7QUFDM0Y7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsZ0JBQWdCO0FBQ3JDLHFEQUFxRCxlQUFlLEVBQUUsbUJBQW1CO0FBQ3pGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixnQkFBZ0I7QUFDckMscURBQXFELG1CQUFtQixFQUFFLGVBQWU7QUFDekY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGdhbWVib2FyZCA9ICgpID0+IHtcbiAgY29uc3QgbWFwID0ge307XG4gIGNvbnN0IGhpdHMgPSB7fTtcbiAgY29uc3Qgc2hpcHMgPSBbXTtcbiAgLy8gR2FtZWJvYXJkIGlzIDEwIHggMTBcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSArPSAxKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaiArPSAxKSB7XG4gICAgICBjb25zdCBjb29yZGluYXRlcyA9IFtqLCBpXTtcbiAgICAgIC8vIEV2ZXJ5IGNvb3JkaW5hdGUgc3RhcnRzIGFzIGVtcHR5XG4gICAgICBtYXBbY29vcmRpbmF0ZXNdID0gbnVsbDtcbiAgICAgIC8vIFNlcGFyYXRlIGNvb3JkaW5hdGUgZGljdGlvbmFyeSBmb3IgY2hlY2tpbmcgaWYgaXQncyBoaXRcbiAgICAgIGhpdHNbY29vcmRpbmF0ZXNdID0gZmFsc2U7XG4gICAgfVxuICB9XG4gIC8vIENoZWNrIGlmIHNoaXAgaXMgaW5zaWRlIHRoZSBtYXBcbiAgY29uc3Qgc2hpcEluc2lkZU1hcCA9IChzaGlwLCBjb29yZGluYXRlcykgPT4ge1xuICAgIGlmIChzaGlwLmlzVmVydGljYWwoKSkge1xuICAgICAgaWYgKHNoaXAubGVuZ3RoICsgY29vcmRpbmF0ZXNbMV0gLSAxIDwgMTApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChzaGlwLmxlbmd0aCArIGNvb3JkaW5hdGVzWzBdIC0gMSA8IDEwKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIGNvbnN0IGNvbnRhaW5zU2hpcCA9IChjb29yZGluYXRlcykgPT4ge1xuICAgIGlmKG1hcFtjb29yZGluYXRlc10gIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIFxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIFxuICB9XG5cbiAgLy8gQ2hlY2tzIHRoYXQgc2hpcCBpcyBub3QgbmV4dCBvciBvbnRvcCBvZiBhbm90aGVyIHNoaXBcbiAgY29uc3Qgc2hpcE5vdE9uVG9wT2ZPck5leHRUb0Fub3RoZXJTaGlwID0gKHNoaXAsIGNvb3JkaW5hdGVzKSA9PiB7XG4gICAgY29uc3QgbmV3Q29vcmRpbmF0ZXMgPSBbY29vcmRpbmF0ZXNbMF0gLSAxLCBjb29yZGluYXRlc1sxXSAtIDFdO1xuXG4gICAgaWYgKHNoaXAuaXNWZXJ0aWNhbCgpKSB7XG4gICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IDM7IHggKz0gMSkge1xuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHNoaXAubGVuZ3RoICsgMjsgeSArPSAxKSB7XG4gICAgICAgICAgY29uc3QgY2hlY2tYID0geCArIG5ld0Nvb3JkaW5hdGVzWzBdO1xuICAgICAgICAgIGNvbnN0IGNoZWNrWSA9IHkgKyBuZXdDb29yZGluYXRlc1sxXTtcbiAgICAgICAgICBpZiAoY2hlY2tYID4gLTEgJiYgY2hlY2tYIDwgMTAgJiYgY2hlY2tZID4gLTEgJiYgY2hlY2tZIDwgMTApIHtcbiAgICAgICAgICAgIGlmIChtYXBbW2NoZWNrWCwgY2hlY2tZXV0gIT0gbnVsbCkge1xuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgMzsgeSArPSAxKSB7XG4gICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgc2hpcC5sZW5ndGggKyAyOyB4ICs9IDEpIHtcbiAgICAgICAgICBjb25zdCBjaGVja1ggPSB4ICsgbmV3Q29vcmRpbmF0ZXNbMF07XG4gICAgICAgICAgY29uc3QgY2hlY2tZID0geSArIG5ld0Nvb3JkaW5hdGVzWzFdO1xuICAgICAgICAgIGlmIChjaGVja1ggPiAtMSAmJiBjaGVja1ggPCAxMCAmJiBjaGVja1kgPiAtMSAmJiBjaGVja1kgPCAxMCkge1xuICAgICAgICAgICAgaWYgKG1hcFtbY2hlY2tYLCBjaGVja1ldXSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCBsZWdhbFBsYWNlRm9yU2hpcCA9IChzaGlwLCBjb29yZGluYXRlcykgPT4ge1xuICAgIGlmIChcbiAgICAgIHNoaXBJbnNpZGVNYXAoc2hpcCwgY29vcmRpbmF0ZXMpICYmXG4gICAgICBzaGlwTm90T25Ub3BPZk9yTmV4dFRvQW5vdGhlclNoaXAoc2hpcCwgY29vcmRpbmF0ZXMpXG4gICAgKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuICBjb25zdCBwbGFjZVNoaXAgPSAoc2hpcCwgY29vcmRpbmF0ZXMpID0+IHtcbiAgICBpZiAobGVnYWxQbGFjZUZvclNoaXAoc2hpcCwgY29vcmRpbmF0ZXMpKSB7XG4gICAgICBjb25zdCB4ID0gY29vcmRpbmF0ZXNbMF07XG4gICAgICBjb25zdCB5ID0gY29vcmRpbmF0ZXNbMV07XG4gICAgICBzaGlwcy5wdXNoKHNoaXApO1xuICAgICAgaWYgKHNoaXAuaXNWZXJ0aWNhbCgpKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgIG1hcFtbeCwgeSArIGldXSA9IFtzaGlwLCBpXTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgbWFwW1t4ICsgaSwgeV1dID0gW3NoaXAsIGldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBjb25zdCBhbHJlYWR5SGl0ID0gKGNvb3JkaW5hdGVzKSA9PiBoaXRzW2Nvb3JkaW5hdGVzXTtcbiAgY29uc3QgcmVjZWl2ZUF0dGFjayA9IChjb29yZGluYXRlcykgPT4ge1xuICAgIGhpdHNbY29vcmRpbmF0ZXNdID0gdHJ1ZTtcbiAgICBpZiAobWFwW2Nvb3JkaW5hdGVzXSAhPSBudWxsKSB7XG4gICAgICBjb25zdCBwYXJ0T2ZTaGlwID0gbWFwW2Nvb3JkaW5hdGVzXVsxXTtcbiAgICAgIGNvbnN0IHNoaXAgPSBtYXBbY29vcmRpbmF0ZXNdWzBdO1xuICAgICAgc2hpcC5oaXQocGFydE9mU2hpcCk7XG4gICAgfVxuICB9O1xuICBjb25zdCBmbGVldERlc3Ryb3llZCA9ICgpID0+IHNoaXBzLmV2ZXJ5KChzaGlwKSA9PiBzaGlwLmlzU3VuaygpKTtcblxuICByZXR1cm4ge1xuICAgIG1hcCxcbiAgICBoaXRzLFxuICAgIHBsYWNlU2hpcCxcbiAgICBsZWdhbFBsYWNlRm9yU2hpcCxcbiAgICBhbHJlYWR5SGl0LFxuICAgIHJlY2VpdmVBdHRhY2ssXG4gICAgZmxlZXREZXN0cm95ZWQsXG4gICAgY29udGFpbnNTaGlwLFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2FtZWJvYXJkO1xuIiwiY29uc3QgUGxheWVyID0gKG15Qm9hcmQsIGVuZW15Qm9hcmQpID0+IHtcbiAgY29uc3QgbG9zdCA9ICgpID0+IG15Qm9hcmQuZmxlZXREZXN0cm95ZWQoKTtcbiAgY29uc3QgYXR0YWNrID0gKGNvb3JkaW5hdGVzKSA9PiB7XG4gICAgaWYgKCFlbmVteUJvYXJkLmFscmVhZHlIaXQoY29vcmRpbmF0ZXMpKSB7XG4gICAgICBlbmVteUJvYXJkLnJlY2VpdmVBdHRhY2soY29vcmRpbmF0ZXMpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuICBjb25zdCB3b24gPSAoKSA9PiBlbmVteUJvYXJkLmZsZWV0RGVzdHJveWVkKCk7XG4gIHJldHVybiB7IGxvc3QsIGF0dGFjaywgd29uIH07XG59O1xuXG5jb25zdCBBSSA9IChteUJvYXJkLCBlbmVteUJvYXJkKSA9PiB7XG4gIGNvbnN0IGxvc3QgPSAoKSA9PiBteUJvYXJkLmZsZWV0RGVzdHJveWVkKCk7XG4gIGNvbnN0IHJhbmRvbUNvb3JkaW5hdGVzID0gKCkgPT4ge1xuICAgIGNvbnN0IHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgY29uc3QgeSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICByZXR1cm4gW3gsIHldO1xuICB9O1xuICBjb25zdCBhdHRhY2sgPSAoY29vcmRpbmF0ZXMpID0+IHtcbiAgICBpZiAoIWVuZW15Qm9hcmQuYWxyZWFkeUhpdChjb29yZGluYXRlcykpIHtcbiAgICAgIGVuZW15Qm9hcmQucmVjZWl2ZUF0dGFjayhjb29yZGluYXRlcyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIGNvbnN0IEFJQXR0YWNrID0gKCkgPT4ge1xuICAgIGZvciAoOzspIHtcbiAgICAgIGNvbnN0IGNvcmQgPSByYW5kb21Db29yZGluYXRlcygpO1xuICAgICAgaWYgKGF0dGFjayhjb3JkKSkge1xuICAgICAgICByZXR1cm4gY29yZDtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIGNvbnN0IHdvbiA9ICgpID0+IGVuZW15Qm9hcmQuZmxlZXREZXN0cm95ZWQoKTtcbiAgcmV0dXJuIHsgbG9zdCwgYXR0YWNrLCB3b24sIEFJQXR0YWNrIH07XG59O1xuXG5leHBvcnQgeyBQbGF5ZXIsIEFJIH07XG4iLCJjb25zdCBzaGlwID0gKGxlbmd0aCkgPT4ge1xuICBjb25zdCBjb250YWluZXIgPSBbXTtcbiAgbGV0IHZlcnRpY2FsID0gZmFsc2U7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICBjb250YWluZXIucHVzaCgwKTtcbiAgfVxuICBjb25zdCBpc1ZlcnRpY2FsID0gKCkgPT4gdmVydGljYWw7XG4gIGNvbnN0IHJvdGF0ZSA9ICgpID0+IHtcbiAgICBpZiAodmVydGljYWwpIHtcbiAgICAgIHZlcnRpY2FsID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZlcnRpY2FsID0gdHJ1ZTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IGhpdCA9IChwb3NpdGlvbikgPT4ge1xuICAgIGNvbnRhaW5lcltwb3NpdGlvbl0gPSAxO1xuICB9O1xuICBjb25zdCBpc1N1bmsgPSAoKSA9PiB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb250YWluZXIubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGlmIChjb250YWluZXJbaV0gPT09IDApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcbiAgcmV0dXJuIHsgY29udGFpbmVyLCBpc1N1bmssIGlzVmVydGljYWwsIGhpdCwgcm90YXRlLCBsZW5ndGggfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHNoaXA7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IFBsYXllciwgQUkgfSBmcm9tIFwiLi9wbGF5ZXJcIjtcbmltcG9ydCBnYW1lYm9hcmQgZnJvbSBcIi4vZ2FtZWJvYXJkXCI7XG5pbXBvcnQgc2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5cbmNvbnN0IHBsYXllckJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5wbGF5ZXJib2FyZFwiKTtcbmNvbnN0IHBsYXllckJvYXJkUGxhY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYXllcmJvYXJkcGxhY2VcIik7XG5jb25zdCBlbmVteUJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5lbmVteWJvYXJkXCIpO1xuXG5jb25zdCBteVNoaXBzID0gW3NoaXAoNSksIHNoaXAoNCksIHNoaXAoMyksIHNoaXAoMyksIHNoaXAoMildO1xubGV0IG15U2hpcE51bWJlciA9IDA7XG5jb25zdCBlbmVteVNoaXBzID0gW3NoaXAoNSksIHNoaXAoNCksIHNoaXAoMyksIHNoaXAoMyksIHNoaXAoMildO1xubGV0IGVuZW15U2hpcE51bWJlciA9IDA7XG5cbmxldCBwbGF5ZXJUdXJuID0gdHJ1ZTtcblxuY29uc3QgbXlCb2FyZDEgPSBnYW1lYm9hcmQoKTtcbmNvbnN0IHBsYWNlQm9hcmQgPSBnYW1lYm9hcmQoKTtcbmNvbnN0IGVuZW15Qm9hcmQxID0gZ2FtZWJvYXJkKCk7XG5cbmNvbnN0IHBsYXllck9uZSA9IFBsYXllcihteUJvYXJkMSwgZW5lbXlCb2FyZDEpO1xuY29uc3QgYWkgPSBBSShlbmVteUJvYXJkMSwgbXlCb2FyZDEpO1xuXG5mdW5jdGlvbiBjcmVhdGVIaXRNYXJrZXIoYm9hcmQsIGNvb3JkaW5hdGVzLCBkaXYpIHtcbiAgaWYoYm9hcmQuY29udGFpbnNTaGlwKGNvb3JkaW5hdGVzKSkge1xuICAgIGRpdi5zdHlsZSA9IFwiYmFja2dyb3VuZC1pbWFnZTogdXJsKGhpdC5zdmcpXCI7XG4gIH1cbiAgZWxzZSB7XG4gICAgZGl2LnN0eWxlID0gXCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwobWlzcy5zdmcpXCI7XG4gIH1cbn1cblxuXG5cblxuLy8gUGxheWVyYm9hcmRcbmZvcihsZXQgaSA9IDA7IGkgPCAxMDsgaSs9MSkge1xuICBmb3IobGV0IGogPSAwOyBqIDwgMTA7IGorPTEpIHtcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGRpdi5jbGFzc0xpc3QuYWRkKGBwbGF5ZXIke2p9JHtpfWApO1xuICAgIHBsYXllckJvYXJkLmFwcGVuZENoaWxkKGRpdik7XG4gIH1cbn1cblxuZnVuY3Rpb24gZHJhd1BsYWNlbWVudChjb29yZGluYXRlcykge1xuICBjb25zdCBjdXJyZW50U2hpcCA9IG15U2hpcHNbbXlTaGlwTnVtYmVyXTtcbiAgY29uc3Qgc2hpcExlbmd0aCA9IGN1cnJlbnRTaGlwLmxlbmd0aDtcbiAgaWYoY3VycmVudFNoaXAuaXNWZXJ0aWNhbCgpKSB7XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGg7IGkrPTEpIHtcbiAgICAgIGNvbnN0IGNoZWNrUGxhY2UgPSBjb29yZGluYXRlc1sxXSArIGk7XG4gICAgICBpZihjaGVja1BsYWNlIDwgMTApIHtcbiAgICAgICAgY29uc3QgZGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLnBsYXllcnBsYWNlJHtjb29yZGluYXRlc1swXX0ke2NoZWNrUGxhY2V9YCk7XG4gICAgICAgIGlmKHBsYWNlQm9hcmQubGVnYWxQbGFjZUZvclNoaXAoY3VycmVudFNoaXAsIGNvb3JkaW5hdGVzKSkge1xuICAgICAgICAgIGRpdi5zdHlsZSA9IFwiYmFja2dyb3VuZC1jb2xvcjogcmdiYSg2MCwgMTc5LCAxMTMsIDAuNzUpXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZGl2LnN0eWxlID0gXCJiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMCwgMCwgMC43NSlcIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBlbHNlIHtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aDsgaSs9MSkge1xuICAgICAgY29uc3QgY2hlY2tQbGFjZSA9IGNvb3JkaW5hdGVzWzBdICsgaTtcbiAgICAgIGlmKGNoZWNrUGxhY2UgPCAxMCkge1xuICAgICAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAucGxheWVycGxhY2Uke2NoZWNrUGxhY2V9JHtjb29yZGluYXRlc1sxXX1gKTtcbiAgICAgICAgaWYocGxhY2VCb2FyZC5sZWdhbFBsYWNlRm9yU2hpcChjdXJyZW50U2hpcCwgY29vcmRpbmF0ZXMpKSB7XG4gICAgICAgICAgZGl2LnN0eWxlID0gXCJiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDYwLCAxNzksIDExMywgMC43NSlcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBkaXYuc3R5bGUgPSBcImJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAwLCAwLCAwLjc1KVwiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVBsYWNlbWVudCgpIHtcbiAgY29uc3QgY2hpbGRyZW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYXllcmJvYXJkcGxhY2VcIikuY2hpbGROb2RlcztcbiAgY2hpbGRyZW4uZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICBlbGVtZW50LnN0eWxlID0gXCJiYWNrZ3JvdW5kLWNvbG9yOiBub25lXCI7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBwbGFjZVNoaXAoY29vcmRpbmF0ZXMsIGJvYXJkKSB7XG4gIGNvbnN0IHNoaXBwcGVuID0gbXlTaGlwc1tteVNoaXBOdW1iZXJdO1xuICBpZihib2FyZC5sZWdhbFBsYWNlRm9yU2hpcChzaGlwcHBlbiwgY29vcmRpbmF0ZXMpKSB7XG4gICAgcmVtb3ZlUGxhY2VtZW50KCk7XG4gICAgY29uc3Qgc2hpcExlbmd0aCA9IHNoaXBwcGVuLmxlbmd0aDtcbiAgICBteVNoaXBOdW1iZXIrPTE7XG4gICAgbXlCb2FyZDEucGxhY2VTaGlwKHNoaXBwcGVuLCBjb29yZGluYXRlcyk7XG4gICAgcGxhY2VCb2FyZC5wbGFjZVNoaXAoc2hpcHBwZW4sIGNvb3JkaW5hdGVzKTtcbiAgICBpZihzaGlwcHBlbi5pc1ZlcnRpY2FsKCkpIHtcbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3RoOyBpKz0xKSB7XG4gICAgICAgIGNvbnN0IGRpdjIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAucGxheWVycGxhY2Uke2Nvb3JkaW5hdGVzWzBdfSR7Y29vcmRpbmF0ZXNbMV0gKyBpfWApO1xuICAgICAgICBjb25zdCBkaXYzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLnBsYXllciR7Y29vcmRpbmF0ZXNbMF19JHtjb29yZGluYXRlc1sxXSArIGl9YCk7XG4gICAgICAgIGNvbnN0IGJsYWNrYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgYmxhY2tib3guY2xhc3NMaXN0LmFkZChcInNoaXBcIik7XG4gICAgICAgIGNvbnN0IGJsYWNrYm94MSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGJsYWNrYm94MS5jbGFzc0xpc3QuYWRkKFwic2hpcFwiKTtcbiAgICAgICAgZGl2Mi5hcHBlbmRDaGlsZChibGFja2JveDEpO1xuICAgICAgICBkaXYzLmFwcGVuZENoaWxkKGJsYWNrYm94KTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBmb3IobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aDsgaSs9MSkge1xuICAgICAgICBjb25zdCBkaXYyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLnBsYXllcnBsYWNlJHtjb29yZGluYXRlc1swXSArIGl9JHtjb29yZGluYXRlc1sxXX1gKTtcbiAgICAgICAgY29uc3QgZGl2MyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC5wbGF5ZXIke2Nvb3JkaW5hdGVzWzBdICsgaX0ke2Nvb3JkaW5hdGVzWzFdfWApO1xuICAgICAgICBjb25zdCBibGFja2JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGJsYWNrYm94LmNsYXNzTGlzdC5hZGQoXCJzaGlwXCIpO1xuICAgICAgICBjb25zdCBibGFja2JveDEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBibGFja2JveDEuY2xhc3NMaXN0LmFkZChcInNoaXBcIik7XG4gICAgICAgIGRpdjIuYXBwZW5kQ2hpbGQoYmxhY2tib3gxKTtcbiAgICAgICAgZGl2My5hcHBlbmRDaGlsZChibGFja2JveCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8vIFBsYXllcmJvYXJkUExhY2VcbmZvcihsZXQgaSA9IDA7IGkgPCAxMDsgaSs9MSkge1xuICBmb3IobGV0IGogPSAwOyBqIDwgMTA7IGorPTEpIHtcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGRpdi5jbGFzc0xpc3QuYWRkKGBwbGF5ZXJwbGFjZSR7an0ke2l9YCk7XG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW92ZXJcIiwgKCkgPT4ge1xuICAgICAgZHJhd1BsYWNlbWVudChbaixpXSk7XG4gICAgfSk7XG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW91dFwiLCAoKSA9PiB7XG4gICAgICByZW1vdmVQbGFjZW1lbnQoKTtcbiAgICB9KTtcbiAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIHBsYWNlU2hpcChbaixpXSwgbXlCb2FyZDEpO1xuICAgICAgaWYobXlTaGlwTnVtYmVyID09IDUpIHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tb2RhbFwiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcGxheWVyQm9hcmRQbGFjZS5hcHBlbmRDaGlsZChkaXYpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJvdGF0ZVNoaXAoc2hpcHBlbikge1xuICBzaGlwcGVuLnJvdGF0ZSgpO1xufVxuXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnJvdGF0ZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICByb3RhdGVTaGlwKG15U2hpcHNbbXlTaGlwTnVtYmVyXSk7XG59KVxuXG4vLyBFbmVteWJvYXJkXG5mb3IobGV0IGkgPSAwOyBpIDwgMTA7IGkrPTEpIHtcbiAgZm9yKGxldCBqID0gMDsgaiA8IDEwOyBqKz0xKSB7XG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBkaXYuY2xhc3NMaXN0LmFkZChgZW5lbXkke2p9JHtpfWApO1xuICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgaWYocGxheWVyVHVybiAmJiAhcGxheWVyT25lLndvbigpICYmICFwbGF5ZXJPbmUubG9zdCgpICYmIHBsYXllck9uZS5hdHRhY2soW2osIGldKSkge1xuICAgICAgICBwbGF5ZXJUdXJuID0gZmFsc2U7XG4gICAgICAgIGNyZWF0ZUhpdE1hcmtlcihlbmVteUJvYXJkMSwgW2osIGldLCBkaXYpO1xuICAgICAgICBjb25zdCBjb3JkID0gYWkuQUlBdHRhY2soKTtcbiAgICAgICAgY3JlYXRlSGl0TWFya2VyKG15Qm9hcmQxLCBjb3JkLCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAucGxheWVyJHtjb3JkWzBdfSR7Y29yZFsxXX1gKSk7XG4gICAgICAgIHBsYXllclR1cm4gPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGVuZW15Qm9hcmQuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwbGFjZUFJU2hpcChjb29yZGluYXRlcywgYm9hcmQpIHtcbiAgY29uc3Qgc2hpcHBwZW4gPSBlbmVteVNoaXBzW2VuZW15U2hpcE51bWJlcl07XG4gIGlmKGJvYXJkLmxlZ2FsUGxhY2VGb3JTaGlwKHNoaXBwcGVuLCBjb29yZGluYXRlcykpIHtcbiAgICBjb25zdCBzaGlwTGVuZ3RoID0gc2hpcHBwZW4ubGVuZ3RoO1xuICAgIGVuZW15U2hpcE51bWJlcis9MTtcbiAgICBlbmVteUJvYXJkMS5wbGFjZVNoaXAoc2hpcHBwZW4sIGNvb3JkaW5hdGVzKTtcbiAgICBpZihzaGlwcHBlbi5pc1ZlcnRpY2FsKCkpIHtcbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3RoOyBpKz0xKSB7XG4gICAgICAgIGNvbnN0IGRpdjMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuZW5lbXkke2Nvb3JkaW5hdGVzWzBdfSR7Y29vcmRpbmF0ZXNbMV0gKyBpfWApO1xuICAgICAgICBjb25zdCBibGFja2JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGJsYWNrYm94LmNsYXNzTGlzdC5hZGQoXCJzaGlwZW5lbXlcIik7XG4gICAgICAgIGRpdjMuYXBwZW5kQ2hpbGQoYmxhY2tib3gpO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3RoOyBpKz0xKSB7XG4gICAgICAgIGNvbnN0IGRpdjMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuZW5lbXkke2Nvb3JkaW5hdGVzWzBdICsgaX0ke2Nvb3JkaW5hdGVzWzFdfWApO1xuICAgICAgICBjb25zdCBibGFja2JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGJsYWNrYm94LmNsYXNzTGlzdC5hZGQoXCJzaGlwZW5lbXlcIik7XG4gICAgICAgIGRpdjMuYXBwZW5kQ2hpbGQoYmxhY2tib3gpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBwbGFjZUFJQm9hcmQoKSB7XG4gIHdoaWxlKGVuZW15U2hpcE51bWJlciAhPT0gNSkge1xuICAgIHJvdGF0ZVNoaXAoZW5lbXlTaGlwc1tlbmVteVNoaXBOdW1iZXJdKTtcbiAgICBwbGFjZUFJU2hpcChbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApLE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKV0sIGVuZW15Qm9hcmQxKVxuICB9XG59XG5cbnBsYWNlQUlCb2FyZCgpO1xuXG5mdW5jdGlvbiByZXZlYWxFbmVteVNoaXBzKCkge1xuICBjb25zdCBzaGlwcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc2hpcGVuZW15XCIpO1xuICBzaGlwcy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgIGVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IFwiMC43NVwiO1xuICB9KTtcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==