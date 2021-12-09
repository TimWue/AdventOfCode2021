import * as fs from "fs";
import * as assert from "assert";

let digitInput: string[] = [];
const allFileContents = fs.readFileSync("./day8/input.txt", "utf-8");
allFileContents.split(/\r?\n/).forEach((line) => {
  digitInput.push(line);
});
const countEasyDigits = (digits: string[], counter: number[]): number[] => {
  console.log(counter);
  for (let i = 0; i < digits.length; i++) {
    // One
    if (digits[i].length === 2) {
      counter[1]++;
    }

    // Four
    if (digits[i].length === 4) {
      counter[5]++;
    }

    // Seven
    if (digits[i].length === 3) {
      counter[8]++;
    }

    // Eight
    if (digits[i].length === 7) {
      counter[9]++;
    }
  }
  console.log(counter);
  return counter;
};

const sum = (values: number[]): number => {
  return values.reduce((acc, val) => acc + val);
};

const partOne = (): number => {
  let counter = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < digitInput.length; i++) {
    const line = digitInput[i].split("|");
    counter = countEasyDigits(
      line[1].split(" ").filter((value) => value !== ""),
      counter
    );
  }
  return sum(counter);
};

const calcSegment = (
  numberLessSegments: string,
  numberOneMoreSegments: string
): string => {
  //console.log(numberLessSegments);
  for (let i = 0; i < numberOneMoreSegments.length; i++) {
    if (!numberLessSegments.includes(numberOneMoreSegments[i])) {
      return numberOneMoreSegments[i];
    }
  }
  return "noSegment";
};

const find9 = (number4: string, number7: string, values: string[]): string => {
  for (let i = 0; i < values.length; i++) {
    const akNumber = values[i];
    if (
      includesNumber(akNumber, number4) &&
      includesNumber(akNumber, number7) &&
      akNumber.length === number4.length + 2
    ) {
      return akNumber;
    }
  }
  return "no9";
};

const find0 = (
  num1: string,
  num8: string,
  num9: string,
  values: string[]
): string => {
  for (let i = 0; i < values.length; i++) {
    const akNumber = values[i];
    if (
      includesNumber(akNumber, num1) &&
      akNumber.includes(calcSegment(num9, num8)) &&
      akNumber.length === 6
    ) {
      return akNumber;
    }
  }
  return "no0";
};

const find3 = (num1: string, values: string[]): string => {
  for (let i = 0; i < values.length; i++) {
    const akNumber = values[i];
    if (includesNumber(akNumber, num1) && akNumber.length === 5) {
      return akNumber;
    }
  }
  return "no3";
};

const find5 = (
  num1: string,
  num8: string,
  num9: string,
  num3: string,
  values: string[]
): string => {
  for (let i = 0; i < values.length; i++) {
    const akNumber = values[i];
    if (
      !akNumber.includes(calcSegment(num9, num8)) &&
      akNumber.length === 5 &&
      akNumber !== num3
    ) {
      return akNumber;
    }
  }
  return "no5";
};

const includesNumber = (candidate: string, numberString: string) => {
  let isCandidate = true;

  for (let i = 0; i < numberString.length; i++) {
    if (!candidate.includes(numberString[i])) {
      isCandidate = false;
    }
  }
  return isCandidate;
};

const find2And6 = (wiring: string[], values: string[]): string[] => {
  for (let i = 0; i < values.length; i++) {
    const akNumber = values[i];
    if (
      akNumber !== wiring[0] &&
      akNumber !== wiring[1] &&
      akNumber !== wiring[3] &&
      akNumber !== wiring[4] &&
      akNumber !== wiring[5] &&
      akNumber !== wiring[7] &&
      akNumber !== wiring[8] &&
      akNumber !== wiring[9]
    ) {
      if (akNumber.length === 5) {
        wiring[2] = akNumber;
      }
      if (akNumber.length === 6) {
        wiring[6] = akNumber;
      }
    }
  }
  return wiring;
};

const findEasyDigits = (values: string[], wiring: string[]): string[] => {
  for (let i = 0; i < values.length; i++) {
    const akNumber = values[i];
    if (akNumber.length === 7) {
      // 8
      wiring[8] = akNumber;
    }
    if (akNumber.length === 2) {
      //1
      wiring[1] = akNumber;
    }
    if (akNumber.length === 3) {
      //7
      wiring[7] = akNumber;
    }
    if (akNumber.length === 4) {
      //4
      wiring[4] = akNumber;
    }
  }
  return wiring;
};

const sameString = (first: string, last: string): boolean => {
  if (first.length !== last.length) {
    return false;
  }
  for (let i = 0; i < first.length; i++) {
    if (!last.includes(first[i])) {
      return false;
    }
  }
  return true;
};
const calcFromResultSet = (values: string[], wiring: string[]): number => {
  let result = "";
  for (let i = 0; i < values.length; i++) {
    const akString = values[i];
    for (let j = 0; j < wiring.length; j++) {
      if (sameString(akString, wiring[j])) {
        result += j;
      }
    }
  }
  return parseInt(result);
};
const partTwo = () => {
  let sum = 0;
  for (let i = 0; i < digitInput.length; i++) {
    const line = digitInput[i].split("|");
    const train = line[0].split(" ").filter((value) => value !== "");
    const resultSet = line[1].split(" ").filter((value) => value !== "");

    let wiring = ["", "", "", "", "", "", "", ""];
    wiring = findEasyDigits(train, wiring);
    const num9 = find9(wiring[4], wiring[7], train);
    wiring[9] = num9;
    const num0 = find0(wiring[1], wiring[8], wiring[9], train);
    wiring[0] = num0;
    const num3 = find3(wiring[1], train);
    wiring[3] = num3;
    const num5 = find5(wiring[1], wiring[8], wiring[9], wiring[3], train);
    wiring[5] = num5;
    wiring = find2And6(wiring, train);
    const result = calcFromResultSet(resultSet, wiring);
    sum += result;
  }
  return sum;
};

console.log(partOne());
console.log(partTwo());
