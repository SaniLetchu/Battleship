import gameboard from "../gameboard";
import ship from "../ship";

const smallShip = ship(1);
const mediumShip = ship(3);
const largeShip = ship(5);
const gameboard1 = gameboard();

test("Test ship placement", () => {
  expect(gameboard1.map[[0, 0]]).toBe(null);
  expect(gameboard1.legalPlaceForShip(smallShip, [0, 0])).toBeTruthy();
  gameboard1.placeShip(smallShip, [0, 0]);
  expect(gameboard1.map[[0, 0]][0]).toBe(smallShip);
  expect(gameboard1.map[[0, 1]]).toBe(null);
  expect(gameboard1.map[[1, 0]]).toBe(null);

  expect(gameboard1.legalPlaceForShip(mediumShip, [0, 1])).toBeFalsy();
  expect(gameboard1.legalPlaceForShip(mediumShip, [0, 2])).toBeTruthy();
  mediumShip.rotate();
  gameboard1.placeShip(mediumShip, [0, 2]);
  expect(gameboard1.map[[0, 2]][0]).toBe(mediumShip);
  expect(gameboard1.map[[0, 3]][0]).toBe(mediumShip);
  expect(gameboard1.map[[0, 4]][0]).toBe(mediumShip);
  expect(gameboard1.map[[0, 5]]).toBe(null);

  expect(gameboard1.legalPlaceForShip(largeShip, [5, 0])).toBeTruthy();
  expect(gameboard1.legalPlaceForShip(largeShip, [6, 0])).toBeFalsy();
});

test("Test for hitting and receiving attacks and checking if fleet is destroyed", () => {
  expect(gameboard1.fleetDestroyed()).toBeFalsy();
  expect(gameboard1.alreadyHit([0, 0])).toBeFalsy();
  gameboard1.receiveAttack([0, 0]);
  expect(gameboard1.alreadyHit([0, 0])).toBeTruthy();
  gameboard1.receiveAttack([0, 2]);
  gameboard1.receiveAttack([0, 3]);
  gameboard1.receiveAttack([0, 4]);
  expect(gameboard1.fleetDestroyed()).toBeTruthy();
});
