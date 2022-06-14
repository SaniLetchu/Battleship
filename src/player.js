const player = (myBoard, enemyBoard) => {
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
      if (attack(randomCoordinates())) {
        break;
      }
    }
  };
  const won = () => enemyBoard.fleetDestroyed();
  return { lost, attack, won, AIAttack };
};

export { player, AI };
