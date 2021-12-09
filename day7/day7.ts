import * as fs from "fs";
import * as assert from "assert";

let positionsString: string[] = [];
const allFileContents = fs.readFileSync("./day7/input.txt", "utf-8");
allFileContents.split(/\r?\n/).forEach((line) => {
  positionsString.push(line);
});

const median = (values: number[]) => {
  values.sort(function (a, b) {
    return a - b;
  });
  var half = Math.floor(values.length / 2);
  if (values.length % 2) return values[half];
  return (values[half - 1] + values[half]) / 2.0;
};

const calculateFuel = (diff: number): number => {
  let add = 0;
  let sum = 0;
  for (let i = 0; i < diff; i++) {
    add++;
    sum += add;
  }
  return sum;
};

const part1 = (positions: number[]): number => {
  const aimPosition = Math.round(median(positions));
  let totalfuel = 0;
  for (let i = 0; i < positions.length; i++) {
    totalfuel += Math.abs(positions[i] - aimPosition);
  }
  return totalfuel;
};

const part2 = (positions: number[]): number => {
  let fuels: number[] = [];
  for (let j = 0; j < positions.length; j++) {
    const aimPosition = positions[j];
    let totalfuel = 0;
    for (let i = 0; i < positions.length; i++) {
      totalfuel += calculateFuel(Math.abs(positions[i] - aimPosition));
    }
    fuels.push(totalfuel);
  }
  return Math.min(...fuels);
};

const positions = positionsString[0].split(",").map((value) => parseInt(value));
console.log(part1(positions));
console.log(part2(positions));
