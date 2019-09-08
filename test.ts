const map_number_array = (x: number[]) => x.reduce((a, b) => a + b);
const map_string_array = (x: string[]) => x.join(', ');
console.log(map_number_array([1, 2, 3]));
console.log(map_string_array(['a', 'b', 'c']));

