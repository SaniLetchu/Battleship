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
      for (let x = 0; x < 4; x += 1) {
        for (let y = 0; y < ship.length + 3; y += 1) {
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
      for (let y = 0; y < 4; y += 1) {
        for (let x = 0; x < ship.length + 3; x += 1) {
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
const myShipNumber = 0;
const enemyShips = [(0,_ship__WEBPACK_IMPORTED_MODULE_2__["default"])(5), (0,_ship__WEBPACK_IMPORTED_MODULE_2__["default"])(4), (0,_ship__WEBPACK_IMPORTED_MODULE_2__["default"])(3), (0,_ship__WEBPACK_IMPORTED_MODULE_2__["default"])(3), (0,_ship__WEBPACK_IMPORTED_MODULE_2__["default"])(2)];
const enemyShipNumber = 0;

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
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFpQixRQUFRO0FBQ3pCO0FBQ0EsK0JBQStCLEVBQUUsRUFBRSxFQUFFO0FBQ3JDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsZ0JBQWdCO0FBQ25DO0FBQ0E7QUFDQSwwREFBMEQsZUFBZSxFQUFFLFdBQVc7QUFDdEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsZ0JBQWdCO0FBQ25DO0FBQ0E7QUFDQSwwREFBMEQsV0FBVyxFQUFFLGVBQWU7QUFDdEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQSxlQUFlLFFBQVE7QUFDdkIsaUJBQWlCLFFBQVE7QUFDekI7QUFDQSxvQ0FBb0MsRUFBRSxFQUFFLEVBQUU7QUFDMUM7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQSxlQUFlLFFBQVE7QUFDdkIsaUJBQWlCLFFBQVE7QUFDekI7QUFDQSw4QkFBOEIsRUFBRSxFQUFFLEVBQUU7QUFDcEM7QUFDQSxtREFBbUQ7QUFDbkQ7QUFDQTtBQUNBO0FBQ0EseUVBQXlFLFFBQVEsRUFBRSxRQUFRO0FBQzNGO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZ2FtZWJvYXJkID0gKCkgPT4ge1xuICBjb25zdCBtYXAgPSB7fTtcbiAgY29uc3QgaGl0cyA9IHt9O1xuICBjb25zdCBzaGlwcyA9IFtdO1xuICAvLyBHYW1lYm9hcmQgaXMgMTAgeCAxMFxuICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpICs9IDEpIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqICs9IDEpIHtcbiAgICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gW2osIGldO1xuICAgICAgLy8gRXZlcnkgY29vcmRpbmF0ZSBzdGFydHMgYXMgZW1wdHlcbiAgICAgIG1hcFtjb29yZGluYXRlc10gPSBudWxsO1xuICAgICAgLy8gU2VwYXJhdGUgY29vcmRpbmF0ZSBkaWN0aW9uYXJ5IGZvciBjaGVja2luZyBpZiBpdCdzIGhpdFxuICAgICAgaGl0c1tjb29yZGluYXRlc10gPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgLy8gQ2hlY2sgaWYgc2hpcCBpcyBpbnNpZGUgdGhlIG1hcFxuICBjb25zdCBzaGlwSW5zaWRlTWFwID0gKHNoaXAsIGNvb3JkaW5hdGVzKSA9PiB7XG4gICAgaWYgKHNoaXAuaXNWZXJ0aWNhbCgpKSB7XG4gICAgICBpZiAoc2hpcC5sZW5ndGggKyBjb29yZGluYXRlc1sxXSAtIDEgPCAxMCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHNoaXAubGVuZ3RoICsgY29vcmRpbmF0ZXNbMF0gLSAxIDwgMTApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgY29uc3QgY29udGFpbnNTaGlwID0gKGNvb3JkaW5hdGVzKSA9PiB7XG4gICAgaWYobWFwW2Nvb3JkaW5hdGVzXSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgXG4gIH1cblxuICAvLyBDaGVja3MgdGhhdCBzaGlwIGlzIG5vdCBuZXh0IG9yIG9udG9wIG9mIGFub3RoZXIgc2hpcFxuICBjb25zdCBzaGlwTm90T25Ub3BPZk9yTmV4dFRvQW5vdGhlclNoaXAgPSAoc2hpcCwgY29vcmRpbmF0ZXMpID0+IHtcbiAgICBjb25zdCBuZXdDb29yZGluYXRlcyA9IFtjb29yZGluYXRlc1swXSAtIDEsIGNvb3JkaW5hdGVzWzFdIC0gMV07XG5cbiAgICBpZiAoc2hpcC5pc1ZlcnRpY2FsKCkpIHtcbiAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgNDsgeCArPSAxKSB7XG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgc2hpcC5sZW5ndGggKyAzOyB5ICs9IDEpIHtcbiAgICAgICAgICBjb25zdCBjaGVja1ggPSB4ICsgbmV3Q29vcmRpbmF0ZXNbMF07XG4gICAgICAgICAgY29uc3QgY2hlY2tZID0geSArIG5ld0Nvb3JkaW5hdGVzWzFdO1xuICAgICAgICAgIGlmIChjaGVja1ggPiAtMSAmJiBjaGVja1ggPCAxMCAmJiBjaGVja1kgPiAtMSAmJiBjaGVja1kgPCAxMCkge1xuICAgICAgICAgICAgaWYgKG1hcFtbY2hlY2tYLCBjaGVja1ldXSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCA0OyB5ICs9IDEpIHtcbiAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBzaGlwLmxlbmd0aCArIDM7IHggKz0gMSkge1xuICAgICAgICAgIGNvbnN0IGNoZWNrWCA9IHggKyBuZXdDb29yZGluYXRlc1swXTtcbiAgICAgICAgICBjb25zdCBjaGVja1kgPSB5ICsgbmV3Q29vcmRpbmF0ZXNbMV07XG4gICAgICAgICAgaWYgKGNoZWNrWCA+IC0xICYmIGNoZWNrWCA8IDEwICYmIGNoZWNrWSA+IC0xICYmIGNoZWNrWSA8IDEwKSB7XG4gICAgICAgICAgICBpZiAobWFwW1tjaGVja1gsIGNoZWNrWV1dICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IGxlZ2FsUGxhY2VGb3JTaGlwID0gKHNoaXAsIGNvb3JkaW5hdGVzKSA9PiB7XG4gICAgaWYgKFxuICAgICAgc2hpcEluc2lkZU1hcChzaGlwLCBjb29yZGluYXRlcykgJiZcbiAgICAgIHNoaXBOb3RPblRvcE9mT3JOZXh0VG9Bbm90aGVyU2hpcChzaGlwLCBjb29yZGluYXRlcylcbiAgICApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIGNvbnN0IHBsYWNlU2hpcCA9IChzaGlwLCBjb29yZGluYXRlcykgPT4ge1xuICAgIGlmIChsZWdhbFBsYWNlRm9yU2hpcChzaGlwLCBjb29yZGluYXRlcykpIHtcbiAgICAgIGNvbnN0IHggPSBjb29yZGluYXRlc1swXTtcbiAgICAgIGNvbnN0IHkgPSBjb29yZGluYXRlc1sxXTtcbiAgICAgIHNoaXBzLnB1c2goc2hpcCk7XG4gICAgICBpZiAoc2hpcC5pc1ZlcnRpY2FsKCkpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgbWFwW1t4LCB5ICsgaV1dID0gW3NoaXAsIGldO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICBtYXBbW3ggKyBpLCB5XV0gPSBbc2hpcCwgaV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIGNvbnN0IGFscmVhZHlIaXQgPSAoY29vcmRpbmF0ZXMpID0+IGhpdHNbY29vcmRpbmF0ZXNdO1xuICBjb25zdCByZWNlaXZlQXR0YWNrID0gKGNvb3JkaW5hdGVzKSA9PiB7XG4gICAgaGl0c1tjb29yZGluYXRlc10gPSB0cnVlO1xuICAgIGlmIChtYXBbY29vcmRpbmF0ZXNdICE9IG51bGwpIHtcbiAgICAgIGNvbnN0IHBhcnRPZlNoaXAgPSBtYXBbY29vcmRpbmF0ZXNdWzFdO1xuICAgICAgY29uc3Qgc2hpcCA9IG1hcFtjb29yZGluYXRlc11bMF07XG4gICAgICBzaGlwLmhpdChwYXJ0T2ZTaGlwKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IGZsZWV0RGVzdHJveWVkID0gKCkgPT4gc2hpcHMuZXZlcnkoKHNoaXApID0+IHNoaXAuaXNTdW5rKCkpO1xuXG4gIHJldHVybiB7XG4gICAgbWFwLFxuICAgIGhpdHMsXG4gICAgcGxhY2VTaGlwLFxuICAgIGxlZ2FsUGxhY2VGb3JTaGlwLFxuICAgIGFscmVhZHlIaXQsXG4gICAgcmVjZWl2ZUF0dGFjayxcbiAgICBmbGVldERlc3Ryb3llZCxcbiAgICBjb250YWluc1NoaXAsXG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnYW1lYm9hcmQ7XG4iLCJjb25zdCBQbGF5ZXIgPSAobXlCb2FyZCwgZW5lbXlCb2FyZCkgPT4ge1xuICBjb25zdCBsb3N0ID0gKCkgPT4gbXlCb2FyZC5mbGVldERlc3Ryb3llZCgpO1xuICBjb25zdCBhdHRhY2sgPSAoY29vcmRpbmF0ZXMpID0+IHtcbiAgICBpZiAoIWVuZW15Qm9hcmQuYWxyZWFkeUhpdChjb29yZGluYXRlcykpIHtcbiAgICAgIGVuZW15Qm9hcmQucmVjZWl2ZUF0dGFjayhjb29yZGluYXRlcyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIGNvbnN0IHdvbiA9ICgpID0+IGVuZW15Qm9hcmQuZmxlZXREZXN0cm95ZWQoKTtcbiAgcmV0dXJuIHsgbG9zdCwgYXR0YWNrLCB3b24gfTtcbn07XG5cbmNvbnN0IEFJID0gKG15Qm9hcmQsIGVuZW15Qm9hcmQpID0+IHtcbiAgY29uc3QgbG9zdCA9ICgpID0+IG15Qm9hcmQuZmxlZXREZXN0cm95ZWQoKTtcbiAgY29uc3QgcmFuZG9tQ29vcmRpbmF0ZXMgPSAoKSA9PiB7XG4gICAgY29uc3QgeCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICBjb25zdCB5ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgIHJldHVybiBbeCwgeV07XG4gIH07XG4gIGNvbnN0IGF0dGFjayA9IChjb29yZGluYXRlcykgPT4ge1xuICAgIGlmICghZW5lbXlCb2FyZC5hbHJlYWR5SGl0KGNvb3JkaW5hdGVzKSkge1xuICAgICAgZW5lbXlCb2FyZC5yZWNlaXZlQXR0YWNrKGNvb3JkaW5hdGVzKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgY29uc3QgQUlBdHRhY2sgPSAoKSA9PiB7XG4gICAgZm9yICg7Oykge1xuICAgICAgY29uc3QgY29yZCA9IHJhbmRvbUNvb3JkaW5hdGVzKCk7XG4gICAgICBpZiAoYXR0YWNrKGNvcmQpKSB7XG4gICAgICAgIHJldHVybiBjb3JkO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgY29uc3Qgd29uID0gKCkgPT4gZW5lbXlCb2FyZC5mbGVldERlc3Ryb3llZCgpO1xuICByZXR1cm4geyBsb3N0LCBhdHRhY2ssIHdvbiwgQUlBdHRhY2sgfTtcbn07XG5cbmV4cG9ydCB7IFBsYXllciwgQUkgfTtcbiIsImNvbnN0IHNoaXAgPSAobGVuZ3RoKSA9PiB7XG4gIGNvbnN0IGNvbnRhaW5lciA9IFtdO1xuICBsZXQgdmVydGljYWwgPSBmYWxzZTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgIGNvbnRhaW5lci5wdXNoKDApO1xuICB9XG4gIGNvbnN0IGlzVmVydGljYWwgPSAoKSA9PiB2ZXJ0aWNhbDtcbiAgY29uc3Qgcm90YXRlID0gKCkgPT4ge1xuICAgIGlmICh2ZXJ0aWNhbCkge1xuICAgICAgdmVydGljYWwgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmVydGljYWwgPSB0cnVlO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgaGl0ID0gKHBvc2l0aW9uKSA9PiB7XG4gICAgY29udGFpbmVyW3Bvc2l0aW9uXSA9IDE7XG4gIH07XG4gIGNvbnN0IGlzU3VuayA9ICgpID0+IHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbnRhaW5lci5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgaWYgKGNvbnRhaW5lcltpXSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuICByZXR1cm4geyBjb250YWluZXIsIGlzU3VuaywgaXNWZXJ0aWNhbCwgaGl0LCByb3RhdGUsIGxlbmd0aCB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgc2hpcDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgUGxheWVyLCBBSSB9IGZyb20gXCIuL3BsYXllclwiO1xuaW1wb3J0IGdhbWVib2FyZCBmcm9tIFwiLi9nYW1lYm9hcmRcIjtcbmltcG9ydCBzaGlwIGZyb20gXCIuL3NoaXBcIjtcblxuY29uc3QgcGxheWVyQm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYXllcmJvYXJkXCIpO1xuY29uc3QgcGxheWVyQm9hcmRQbGFjZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheWVyYm9hcmRwbGFjZVwiKTtcbmNvbnN0IGVuZW15Qm9hcmQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmVuZW15Ym9hcmRcIik7XG5cbmNvbnN0IG15U2hpcHMgPSBbc2hpcCg1KSwgc2hpcCg0KSwgc2hpcCgzKSwgc2hpcCgzKSwgc2hpcCgyKV07XG5jb25zdCBteVNoaXBOdW1iZXIgPSAwO1xuY29uc3QgZW5lbXlTaGlwcyA9IFtzaGlwKDUpLCBzaGlwKDQpLCBzaGlwKDMpLCBzaGlwKDMpLCBzaGlwKDIpXTtcbmNvbnN0IGVuZW15U2hpcE51bWJlciA9IDA7XG5cbmxldCBwbGF5ZXJUdXJuID0gdHJ1ZTtcblxuY29uc3QgbXlCb2FyZDEgPSBnYW1lYm9hcmQoKTtcbmNvbnN0IHBsYWNlQm9hcmQgPSBnYW1lYm9hcmQoKTtcbmNvbnN0IGVuZW15Qm9hcmQxID0gZ2FtZWJvYXJkKCk7XG5cbmNvbnN0IHBsYXllck9uZSA9IFBsYXllcihteUJvYXJkMSwgZW5lbXlCb2FyZDEpO1xuY29uc3QgYWkgPSBBSShlbmVteUJvYXJkMSwgbXlCb2FyZDEpO1xuXG5mdW5jdGlvbiBjcmVhdGVIaXRNYXJrZXIoYm9hcmQsIGNvb3JkaW5hdGVzLCBkaXYpIHtcbiAgaWYoYm9hcmQuY29udGFpbnNTaGlwKGNvb3JkaW5hdGVzKSkge1xuICAgIGRpdi5zdHlsZSA9IFwiYmFja2dyb3VuZC1pbWFnZTogdXJsKGhpdC5zdmcpXCI7XG4gIH1cbiAgZWxzZSB7XG4gICAgZGl2LnN0eWxlID0gXCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwobWlzcy5zdmcpXCI7XG4gIH1cbn0gXG5cblxuLy8gUGxheWVyYm9hcmRcbmZvcihsZXQgaSA9IDA7IGkgPCAxMDsgaSs9MSkge1xuICBmb3IobGV0IGogPSAwOyBqIDwgMTA7IGorPTEpIHtcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGRpdi5jbGFzc0xpc3QuYWRkKGBwbGF5ZXIke2p9JHtpfWApO1xuICAgIHBsYXllckJvYXJkLmFwcGVuZENoaWxkKGRpdik7XG4gIH1cbn1cblxuZnVuY3Rpb24gZHJhd1BsYWNlbWVudChjb29yZGluYXRlcywgY3VycmVudFNoaXApIHtcbiAgY29uc3Qgc2hpcExlbmd0aCA9IGN1cnJlbnRTaGlwLmxlbmd0aDtcbiAgaWYoY3VycmVudFNoaXAuaXNWZXJ0aWNhbCgpKSB7XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGg7IGkrPTEpIHtcbiAgICAgIGNvbnN0IGNoZWNrUGxhY2UgPSBjb29yZGluYXRlc1sxXSArIGk7XG4gICAgICBpZihjaGVja1BsYWNlIDwgMTApIHtcbiAgICAgICAgY29uc3QgZGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLnBsYXllcnBsYWNlJHtjb29yZGluYXRlc1swXX0ke2NoZWNrUGxhY2V9YCk7XG4gICAgICAgIGlmKHBsYWNlQm9hcmQubGVnYWxQbGFjZUZvclNoaXAoY3VycmVudFNoaXAsIGNvb3JkaW5hdGVzKSkge1xuICAgICAgICAgIGRpdi5zdHlsZSA9IFwiYmFja2dyb3VuZC1jb2xvcjogcmdiYSg2MCwgMTc5LCAxMTMsIDAuNzUpXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZGl2LnN0eWxlID0gXCJiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMCwgMCwgMC43NSlcIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBlbHNlIHtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aDsgaSs9MSkge1xuICAgICAgY29uc3QgY2hlY2tQbGFjZSA9IGNvb3JkaW5hdGVzWzBdICsgaTtcbiAgICAgIGlmKGNoZWNrUGxhY2UgPCAxMCkge1xuICAgICAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAucGxheWVycGxhY2Uke2NoZWNrUGxhY2V9JHtjb29yZGluYXRlc1sxXX1gKTtcbiAgICAgICAgaWYocGxhY2VCb2FyZC5sZWdhbFBsYWNlRm9yU2hpcChjdXJyZW50U2hpcCwgY29vcmRpbmF0ZXMpKSB7XG4gICAgICAgICAgZGl2LnN0eWxlID0gXCJiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDYwLCAxNzksIDExMywgMC43NSlcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBkaXYuc3R5bGUgPSBcImJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAwLCAwLCAwLjc1KVwiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVBsYWNlbWVudCgpIHtcbiAgY29uc3QgY2hpbGRyZW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBsYXllcmJvYXJkcGxhY2VcIikuY2hpbGROb2RlcztcbiAgY2hpbGRyZW4uZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICBlbGVtZW50LnN0eWxlID0gXCJiYWNrZ3JvdW5kLWNvbG9yOiBub25lXCI7XG4gIH0pO1xufVxuXG4vLyBQbGF5ZXJib2FyZFBMYWNlXG5mb3IobGV0IGkgPSAwOyBpIDwgMTA7IGkrPTEpIHtcbiAgZm9yKGxldCBqID0gMDsgaiA8IDEwOyBqKz0xKSB7XG4gICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBkaXYuY2xhc3NMaXN0LmFkZChgcGxheWVycGxhY2Uke2p9JHtpfWApO1xuICAgIGRpdi5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdmVyXCIsICgpID0+IHtcbiAgICAgIGRyYXdQbGFjZW1lbnQoW2osaV0sIG15U2hpcHNbbXlTaGlwTnVtYmVyXSk7XG4gICAgfSk7XG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW91dFwiLCAoKSA9PiB7XG4gICAgICByZW1vdmVQbGFjZW1lbnQoKTtcbiAgICB9KTtcbiAgICBwbGF5ZXJCb2FyZFBsYWNlLmFwcGVuZENoaWxkKGRpdik7XG4gIH1cbn1cblxuZnVuY3Rpb24gcm90YXRlU2hpcChzaGlwcGVuKSB7XG4gIHNoaXBwZW4ucm90YXRlKCk7XG59XG5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJidXR0b25cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgcm90YXRlU2hpcChteVNoaXBzW215U2hpcE51bWJlcl0pO1xufSlcblxuLy8gRW5lbXlib2FyZFxuZm9yKGxldCBpID0gMDsgaSA8IDEwOyBpKz0xKSB7XG4gIGZvcihsZXQgaiA9IDA7IGogPCAxMDsgais9MSkge1xuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgZGl2LmNsYXNzTGlzdC5hZGQoYGVuZW15JHtqfSR7aX1gKTtcbiAgICBkaXYuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIGlmKHBsYXllck9uZS5hdHRhY2soW2osIGldKSAmJiBwbGF5ZXJUdXJuKSB7IC8vICYmICFwbGF5ZXJPbmUud29uKCkgJiYgIXBsYXllck9uZS5sb3N0KClcbiAgICAgICAgcGxheWVyVHVybiA9IGZhbHNlO1xuICAgICAgICBjcmVhdGVIaXRNYXJrZXIoZW5lbXlCb2FyZDEsIFtqLCBpXSwgZGl2KTtcbiAgICAgICAgY29uc3QgY29yZCA9IGFpLkFJQXR0YWNrKCk7XG4gICAgICAgIGNyZWF0ZUhpdE1hcmtlcihteUJvYXJkMSwgY29yZCwgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLnBsYXllciR7Y29yZFswXX0ke2NvcmRbMV19YCkpO1xuICAgICAgICBwbGF5ZXJUdXJuID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBlbmVteUJvYXJkLmFwcGVuZENoaWxkKGRpdik7XG4gIH1cbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=