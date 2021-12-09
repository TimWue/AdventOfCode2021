import * as fs from "fs";

let commands: string[] = [];
const allFileContents = fs.readFileSync("./day6/input.txt", "utf-8");
allFileContents.split(/\r?\n/).forEach((line) => {
  commands.push(line);
});

const transformCounter = (counter: number[]) => {
  let newCounter = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < counter.length - 1; i++) {
    newCounter[i] = counter[i + 1];
  }
  newCounter[8] = counter[0];
  newCounter[6] = newCounter[6] + counter[0];
  return newCounter;
};

const calcPopulation = (totalDays: number, initial: number[]): number => {
  let counter = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let h = 0; h < initial.length; h++) {
    counter[initial[h]]++;
  }
  for (let i = 0; i < totalDays; i++) {
    let newCounter = transformCounter(counter);
    counter = newCounter;
  }
  return counter.reduce((acc, value) => acc + value);
};

const initial = commands[0].split(",").map((value) => parseInt(value));
console.log(calcPopulation(80, initial));
console.log(calcPopulation(256, initial));
