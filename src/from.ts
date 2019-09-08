const map = (x: number[]) => x.reduce((a, b) => a + b);
const map = (x: string[]) => x.join(', ');

console.log(map([1, 2, 3]));
console.log(map(['a', 'b', 'c']));
