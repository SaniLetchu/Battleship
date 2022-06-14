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

export default gameboard;
