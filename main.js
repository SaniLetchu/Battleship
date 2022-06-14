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
const enemyBoard = document.querySelector(".enemyboard");

const myBoard1 = (0,_gameboard__WEBPACK_IMPORTED_MODULE_1__["default"])();
const enemyBoard1 = (0,_gameboard__WEBPACK_IMPORTED_MODULE_1__["default"])();

const playerOne = (0,_player__WEBPACK_IMPORTED_MODULE_0__.Player)(myBoard1, enemyBoard1);
const ai = (0,_player__WEBPACK_IMPORTED_MODULE_0__.AI)(enemyBoard1, myBoard1);


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
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsUUFBUTtBQUMxQixvQkFBb0IsUUFBUTtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHNCQUFzQixPQUFPO0FBQzdCLHdCQUF3QixxQkFBcUI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOLHNCQUFzQixPQUFPO0FBQzdCLHdCQUF3QixxQkFBcUI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsaUJBQWlCO0FBQ3pDO0FBQ0E7QUFDQSxRQUFRO0FBQ1Isd0JBQXdCLGlCQUFpQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsU0FBUyxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDNUd6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDs7QUFFc0I7Ozs7Ozs7Ozs7Ozs7OztBQ3pDdEI7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLFlBQVk7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHNCQUFzQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7O0FBRUEsaUVBQWUsSUFBSSxFQUFDOzs7Ozs7O1VDNUJwQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7QUNOc0M7QUFDRjtBQUNWOztBQUUxQjtBQUNBOztBQUVBLGlCQUFpQixzREFBUztBQUMxQixvQkFBb0Isc0RBQVM7O0FBRTdCLGtCQUFrQiwrQ0FBTTtBQUN4QixXQUFXLDJDQUFFOzs7QUFHYjtBQUNBLGVBQWUsUUFBUTtBQUN2QixpQkFBaUIsUUFBUTtBQUN6QjtBQUNBLHlCQUF5QixFQUFFLEVBQUUsRUFBRTtBQUMvQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxlQUFlLFFBQVE7QUFDdkIsaUJBQWlCLFFBQVE7QUFDekI7QUFDQSx5QkFBeUIsRUFBRSxFQUFFLEVBQUU7QUFDL0I7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBnYW1lYm9hcmQgPSAoKSA9PiB7XG4gIGNvbnN0IG1hcCA9IHt9O1xuICBjb25zdCBoaXRzID0ge307XG4gIGNvbnN0IHNoaXBzID0gW107XG4gIC8vIEdhbWVib2FyZCBpcyAxMCB4IDEwXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkgKz0gMSkge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGogKz0gMSkge1xuICAgICAgY29uc3QgY29vcmRpbmF0ZXMgPSBbaiwgaV07XG4gICAgICAvLyBFdmVyeSBjb29yZGluYXRlIHN0YXJ0cyBhcyBlbXB0eVxuICAgICAgbWFwW2Nvb3JkaW5hdGVzXSA9IG51bGw7XG4gICAgICAvLyBTZXBhcmF0ZSBjb29yZGluYXRlIGRpY3Rpb25hcnkgZm9yIGNoZWNraW5nIGlmIGl0J3MgaGl0XG4gICAgICBoaXRzW2Nvb3JkaW5hdGVzXSA9IGZhbHNlO1xuICAgIH1cbiAgfVxuICAvLyBDaGVjayBpZiBzaGlwIGlzIGluc2lkZSB0aGUgbWFwXG4gIGNvbnN0IHNoaXBJbnNpZGVNYXAgPSAoc2hpcCwgY29vcmRpbmF0ZXMpID0+IHtcbiAgICBpZiAoc2hpcC5pc1ZlcnRpY2FsKCkpIHtcbiAgICAgIGlmIChzaGlwLmxlbmd0aCArIGNvb3JkaW5hdGVzWzFdIC0gMSA8IDEwKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoc2hpcC5sZW5ndGggKyBjb29yZGluYXRlc1swXSAtIDEgPCAxMCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICAvLyBDaGVja3MgdGhhdCBzaGlwIGlzIG5vdCBuZXh0IG9yIG9udG9wIG9mIGFub3RoZXIgc2hpcFxuICBjb25zdCBzaGlwTm90T25Ub3BPZk9yTmV4dFRvQW5vdGhlclNoaXAgPSAoc2hpcCwgY29vcmRpbmF0ZXMpID0+IHtcbiAgICBjb25zdCBuZXdDb29yZGluYXRlcyA9IFtjb29yZGluYXRlc1swXSAtIDEsIGNvb3JkaW5hdGVzWzFdIC0gMV07XG5cbiAgICBpZiAoc2hpcC5pc1ZlcnRpY2FsKCkpIHtcbiAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgNDsgeCArPSAxKSB7XG4gICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgc2hpcC5sZW5ndGggKyAzOyB5ICs9IDEpIHtcbiAgICAgICAgICBjb25zdCBjaGVja1ggPSB4ICsgbmV3Q29vcmRpbmF0ZXNbMF07XG4gICAgICAgICAgY29uc3QgY2hlY2tZID0geSArIG5ld0Nvb3JkaW5hdGVzWzFdO1xuICAgICAgICAgIGlmIChjaGVja1ggPiAtMSAmJiBjaGVja1ggPCAxMCAmJiBjaGVja1kgPiAtMSAmJiBjaGVja1kgPCAxMCkge1xuICAgICAgICAgICAgaWYgKG1hcFtbY2hlY2tYLCBjaGVja1ldXSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCA0OyB5ICs9IDEpIHtcbiAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBzaGlwLmxlbmd0aCArIDM7IHggKz0gMSkge1xuICAgICAgICAgIGNvbnN0IGNoZWNrWCA9IHggKyBuZXdDb29yZGluYXRlc1swXTtcbiAgICAgICAgICBjb25zdCBjaGVja1kgPSB5ICsgbmV3Q29vcmRpbmF0ZXNbMV07XG4gICAgICAgICAgaWYgKGNoZWNrWCA+IC0xICYmIGNoZWNrWCA8IDEwICYmIGNoZWNrWSA+IC0xICYmIGNoZWNrWSA8IDEwKSB7XG4gICAgICAgICAgICBpZiAobWFwW1tjaGVja1gsIGNoZWNrWV1dICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IGxlZ2FsUGxhY2VGb3JTaGlwID0gKHNoaXAsIGNvb3JkaW5hdGVzKSA9PiB7XG4gICAgaWYgKFxuICAgICAgc2hpcEluc2lkZU1hcChzaGlwLCBjb29yZGluYXRlcykgJiZcbiAgICAgIHNoaXBOb3RPblRvcE9mT3JOZXh0VG9Bbm90aGVyU2hpcChzaGlwLCBjb29yZGluYXRlcylcbiAgICApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIGNvbnN0IHBsYWNlU2hpcCA9IChzaGlwLCBjb29yZGluYXRlcykgPT4ge1xuICAgIGlmIChsZWdhbFBsYWNlRm9yU2hpcChzaGlwLCBjb29yZGluYXRlcykpIHtcbiAgICAgIGNvbnN0IHggPSBjb29yZGluYXRlc1swXTtcbiAgICAgIGNvbnN0IHkgPSBjb29yZGluYXRlc1sxXTtcbiAgICAgIHNoaXBzLnB1c2goc2hpcCk7XG4gICAgICBpZiAoc2hpcC5pc1ZlcnRpY2FsKCkpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgbWFwW1t4LCB5ICsgaV1dID0gW3NoaXAsIGldO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICBtYXBbW3ggKyBpLCB5XV0gPSBbc2hpcCwgaV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIGNvbnN0IGFscmVhZHlIaXQgPSAoY29vcmRpbmF0ZXMpID0+IGhpdHNbY29vcmRpbmF0ZXNdO1xuICBjb25zdCByZWNlaXZlQXR0YWNrID0gKGNvb3JkaW5hdGVzKSA9PiB7XG4gICAgaGl0c1tjb29yZGluYXRlc10gPSB0cnVlO1xuICAgIGlmIChtYXBbY29vcmRpbmF0ZXNdICE9IG51bGwpIHtcbiAgICAgIGNvbnN0IHBhcnRPZlNoaXAgPSBtYXBbY29vcmRpbmF0ZXNdWzFdO1xuICAgICAgY29uc3Qgc2hpcCA9IG1hcFtjb29yZGluYXRlc11bMF07XG4gICAgICBzaGlwLmhpdChwYXJ0T2ZTaGlwKTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IGZsZWV0RGVzdHJveWVkID0gKCkgPT4gc2hpcHMuZXZlcnkoKHNoaXApID0+IHNoaXAuaXNTdW5rKCkpO1xuXG4gIHJldHVybiB7XG4gICAgbWFwLFxuICAgIGhpdHMsXG4gICAgcGxhY2VTaGlwLFxuICAgIGxlZ2FsUGxhY2VGb3JTaGlwLFxuICAgIGFscmVhZHlIaXQsXG4gICAgcmVjZWl2ZUF0dGFjayxcbiAgICBmbGVldERlc3Ryb3llZCxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdhbWVib2FyZDtcbiIsImNvbnN0IFBsYXllciA9IChteUJvYXJkLCBlbmVteUJvYXJkKSA9PiB7XG4gIGNvbnN0IGxvc3QgPSAoKSA9PiBteUJvYXJkLmZsZWV0RGVzdHJveWVkKCk7XG4gIGNvbnN0IGF0dGFjayA9IChjb29yZGluYXRlcykgPT4ge1xuICAgIGlmICghZW5lbXlCb2FyZC5hbHJlYWR5SGl0KGNvb3JkaW5hdGVzKSkge1xuICAgICAgZW5lbXlCb2FyZC5yZWNlaXZlQXR0YWNrKGNvb3JkaW5hdGVzKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgY29uc3Qgd29uID0gKCkgPT4gZW5lbXlCb2FyZC5mbGVldERlc3Ryb3llZCgpO1xuICByZXR1cm4geyBsb3N0LCBhdHRhY2ssIHdvbiB9O1xufTtcblxuY29uc3QgQUkgPSAobXlCb2FyZCwgZW5lbXlCb2FyZCkgPT4ge1xuICBjb25zdCBsb3N0ID0gKCkgPT4gbXlCb2FyZC5mbGVldERlc3Ryb3llZCgpO1xuICBjb25zdCByYW5kb21Db29yZGluYXRlcyA9ICgpID0+IHtcbiAgICBjb25zdCB4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgIGNvbnN0IHkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgcmV0dXJuIFt4LCB5XTtcbiAgfTtcbiAgY29uc3QgYXR0YWNrID0gKGNvb3JkaW5hdGVzKSA9PiB7XG4gICAgaWYgKCFlbmVteUJvYXJkLmFscmVhZHlIaXQoY29vcmRpbmF0ZXMpKSB7XG4gICAgICBlbmVteUJvYXJkLnJlY2VpdmVBdHRhY2soY29vcmRpbmF0ZXMpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuICBjb25zdCBBSUF0dGFjayA9ICgpID0+IHtcbiAgICBmb3IgKDs7KSB7XG4gICAgICBjb25zdCBjb3JkID0gcmFuZG9tQ29vcmRpbmF0ZXMoKTtcbiAgICAgIGlmIChhdHRhY2soY29yZCkpIHtcbiAgICAgICAgcmV0dXJuIGNvcmQ7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBjb25zdCB3b24gPSAoKSA9PiBlbmVteUJvYXJkLmZsZWV0RGVzdHJveWVkKCk7XG4gIHJldHVybiB7IGxvc3QsIGF0dGFjaywgd29uLCBBSUF0dGFjayB9O1xufTtcblxuZXhwb3J0IHsgUGxheWVyLCBBSSB9O1xuIiwiY29uc3Qgc2hpcCA9IChsZW5ndGgpID0+IHtcbiAgY29uc3QgY29udGFpbmVyID0gW107XG4gIGxldCB2ZXJ0aWNhbCA9IGZhbHNlO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgY29udGFpbmVyLnB1c2goMCk7XG4gIH1cbiAgY29uc3QgaXNWZXJ0aWNhbCA9ICgpID0+IHZlcnRpY2FsO1xuICBjb25zdCByb3RhdGUgPSAoKSA9PiB7XG4gICAgaWYgKHZlcnRpY2FsKSB7XG4gICAgICB2ZXJ0aWNhbCA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICB2ZXJ0aWNhbCA9IHRydWU7XG4gICAgfVxuICB9O1xuICBjb25zdCBoaXQgPSAocG9zaXRpb24pID0+IHtcbiAgICBjb250YWluZXJbcG9zaXRpb25dID0gMTtcbiAgfTtcbiAgY29uc3QgaXNTdW5rID0gKCkgPT4ge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29udGFpbmVyLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBpZiAoY29udGFpbmVyW2ldID09PSAwKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG4gIHJldHVybiB7IGNvbnRhaW5lciwgaXNTdW5rLCBpc1ZlcnRpY2FsLCBoaXQsIHJvdGF0ZSwgbGVuZ3RoIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBzaGlwO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBQbGF5ZXIsIEFJIH0gZnJvbSBcIi4vcGxheWVyXCI7XG5pbXBvcnQgZ2FtZWJvYXJkIGZyb20gXCIuL2dhbWVib2FyZFwiO1xuaW1wb3J0IHNoaXAgZnJvbSBcIi4vc2hpcFwiO1xuXG5jb25zdCBwbGF5ZXJCb2FyZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucGxheWVyYm9hcmRcIik7XG5jb25zdCBlbmVteUJvYXJkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5lbmVteWJvYXJkXCIpO1xuXG5jb25zdCBteUJvYXJkMSA9IGdhbWVib2FyZCgpO1xuY29uc3QgZW5lbXlCb2FyZDEgPSBnYW1lYm9hcmQoKTtcblxuY29uc3QgcGxheWVyT25lID0gUGxheWVyKG15Qm9hcmQxLCBlbmVteUJvYXJkMSk7XG5jb25zdCBhaSA9IEFJKGVuZW15Qm9hcmQxLCBteUJvYXJkMSk7XG5cblxuLy8gUGxheWVyYm9hcmRcbmZvcihsZXQgaSA9IDA7IGkgPCAxMDsgaSs9MSkge1xuICBmb3IobGV0IGogPSAwOyBqIDwgMTA7IGorPTEpIHtcbiAgICBjb25zdCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGRpdi5jbGFzc0xpc3QuYWRkKGAke2p9JHtpfWApO1xuICAgIHBsYXllckJvYXJkLmFwcGVuZENoaWxkKGRpdik7XG4gIH1cbn1cblxuLy8gRW5lbXlib2FyZFxuZm9yKGxldCBpID0gMDsgaSA8IDEwOyBpKz0xKSB7XG4gIGZvcihsZXQgaiA9IDA7IGogPCAxMDsgais9MSkge1xuICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgZGl2LmNsYXNzTGlzdC5hZGQoYCR7an0ke2l9YCk7XG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgIFxuICAgIH0pO1xuICAgIGVuZW15Qm9hcmQuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgfVxufSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==