interface Square {
  side: number;
}
interface Circle {
  radius: number;
}

const perimeter = (square: Square) => 4 * square.side;
const perimeter = (circle: Circle) => 2 * Math.PI * circle.radius;

const square: Square = { side: 4 };
const circle: Circle = { radius: 2 };

console.log(perimeter(square));
console.log(perimeter(circle));
