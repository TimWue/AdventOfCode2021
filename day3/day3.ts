import * as fs from "fs";

let lines: string[] = [];
const allFileContents = fs.readFileSync("./day3/input3.txt", "utf-8");
allFileContents.split(/\r?\n/).forEach((line) => {
  lines.push(line);
});

let counter = new Array(lines[0].split("").length).fill(0);
lines.forEach((line) => {
  const letters = line.split("");
  for (let i = 0; i < letters.length; i++) {
    counter[i] = counter[i] + parseInt(letters[i]);
  }
});

let gamma: any = [];
let epsilon: any = [];
const n = lines.length;
counter.forEach((count) => {
  if (count > n / 2) {
    gamma.push(1);
    epsilon.push(0);
  } else {
    gamma.push(0);
    epsilon.push(1);
  }
});
const gammaString = gamma.join("");
const epsilonString = epsilon.join("");
const result = parseInt(gammaString, 2) * parseInt(epsilonString, 2);

console.log(result);

// Part 2

const getValues = (number: string, index: number, values: string[]) => {
  return values.filter((value) => value[index] === number);
};

const oneIsCommon = (index: number, values: string[], n: number): boolean => {
  let counter = 0;
  values.forEach((line) => {
    const letters = line.split("");
    counter = counter + parseInt(letters[index]);
  });
  return counter >= n / 2;
};

let valuesOx = lines;
let index = 0;
while (valuesOx.length > 1) {
  let isOne = oneIsCommon(index, valuesOx, valuesOx.length);
  valuesOx = getValues(isOne ? "1" : "0", index, valuesOx);
  index++;
}

let valuesCo = lines;
index = 0;
while (valuesCo.length > 1) {
  let isOne = oneIsCommon(index, valuesCo, valuesCo.length);
  valuesCo = getValues(isOne ? "0" : "1", index, valuesCo);
  index++;
}
console.log(valuesOx);
console.log(parseInt(valuesOx[0], 2) * parseInt(valuesCo[0], 2));
