import * as fs from "fs";

let input: string[][] = [];
const allFileContents = fs.readFileSync("./day10/input.txt", "utf-8");
allFileContents.split(/\r?\n/).forEach((line) => {
  input.push(line.split(""));
});

interface BracketMapping {
  opener: string;
  closer: string;
  errorPoints: number;
  insertPoints: number;
}

const map: BracketMapping[] = [
  { opener: "(", closer: ")", errorPoints: 3, insertPoints: 1 },
  { opener: "[", closer: "]", errorPoints: 57, insertPoints: 2 },
  { opener: "{", closer: "}", errorPoints: 1197, insertPoints: 3 },
  { opener: "<", closer: ">", errorPoints: 25137, insertPoints: 4 },
];

const calculatePoints = (
  opener: string,
  potentialCloser: string,
  map: BracketMapping[]
): number => {
  const bracketMapping = map.filter(
    (mapping) => mapping.closer === potentialCloser
  )[0];
  return bracketMapping.opener === opener ? 0 : bracketMapping.errorPoints;
};

const calculatePointsForLine = (line: string[], openers: string[]): number => {
  let points = 0;
  let stack: string[] = [];
  line.forEach((value) => {
    if (openers.includes(value)) {
      stack.push(value);
    } else {
      const opener = stack.pop();
      if (opener) {
        points += calculatePoints(opener, value, map);
      }
    }
  });
  return points;
};

const partOne = (subsystem: string[][], map: BracketMapping[]): number => {
  const openers = map.map((mapping) => mapping.opener);
  let totalPoints = 0;
  subsystem.forEach((line) => {
    totalPoints += calculatePointsForLine(line, openers);
  });
  return totalPoints;
};

const handleNotCorruptedLine = (
  stack: string[],
  map: BracketMapping[]
): number => {
  let insertPoints = 0;
  let value = stack.pop();
  while (value) {
    const mapping = map.filter((mapping) => mapping.opener === value)[0];
    insertPoints = insertPoints * 5 + mapping.insertPoints;
    value = stack.pop();
  }
  return insertPoints;
};

const partTwo = (subsystem: string[][], map: BracketMapping[]): number => {
  const openers = map.map((mapping) => mapping.opener);
  let totalPoints: number[] = [];
  subsystem.forEach((line) => {
    let stack: string[] = [];
    let isCorrupt = false;

    line.forEach((value) => {
      if (openers.includes(value)) {
        stack.push(value);
      } else {
        const opener = stack.pop();
        if (opener) {
          if (calculatePoints(opener, value, map) > 0) {
            isCorrupt = true;
          }
        }
      }
    });

    if (!isCorrupt && stack.length > 0) {
      totalPoints.push(handleNotCorruptedLine(stack, map));
    }
  });

  const sorted = totalPoints.sort((a, b) => b - a);
  return sorted[Math.floor(sorted.length / 2)];
};

console.log(partOne(input, map));
console.log(partTwo(input, map));