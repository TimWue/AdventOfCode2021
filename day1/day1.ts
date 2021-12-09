import * as fs from "fs";

let input: number[] = [];
const allFileContents = fs.readFileSync("./day1/input1.txt", "utf-8");
allFileContents.split(/\r?\n/).forEach((line) => {
  input.push(parseInt(line));
});

// Part 1
const getIncreased = (input: number[]): number => {
  let increased = 0;
  for (let i = 1; i < input.length + 1; i++) {
    if (input[i] - input[i - 1] > 0) {
      increased++;
    }
  }
  return increased;
};
console.log(getIncreased(input));

// Part 2
let newArray = [];
for (let i = 3; i < input.length + 1; i++) {
  const mean = input
    .slice(i - 3, i)
    .reduce((accumulator, curr) => accumulator + curr);
  newArray.push(mean);
}
console.log(getIncreased(newArray));
