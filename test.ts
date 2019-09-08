interface Square {
    side: number;
}
interface Circle {
    radius: number;
}
const perimeter_Square = (square: Square) => 4 * square.side;
const perimeter_Circle = (circle: Circle) => 2 * Math.PI * circle.radius;
const square: Square = { side: 4 };
const circle: Circle = { radius: 2 };
console.log(perimeter_Square(square));
console.log(perimeter_Circle(circle));

