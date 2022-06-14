import ship from "../ship";

const smallShip = ship(1);
const mediumShip = ship(3);

test("Ship vertical or horizontal test", () => {
  expect(smallShip.isVertical()).toBeFalsy();
  smallShip.rotate();
  expect(smallShip.isVertical()).toBeTruthy();
  smallShip.rotate();
  expect(mediumShip.isVertical()).toBeFalsy();
});

test("Hit function test", () => {
  expect(mediumShip.container).toBe([0, 0, 0]); 
  mediumShip.hit(0);
  expect(mediumShip.container).toBe([1, 0, 0]);
  mediumShip.hit(2);
  expect(mediumShip.container).toBe([1, 0, 1]); 
});

test("Ship sunk test", () => {
  expect(mediumShip.isSunk()).toBeFalsy();
  mediumShip.hit(1);
  expect(mediumShip.isSunk()).toBeTruthy();
});