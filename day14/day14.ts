import * as fs from "fs";

let insertions: string[][] = [];
const insertFile = fs.readFileSync("./day14/input.txt", "utf-8");
insertFile.split(/\r?\n/).forEach((line) => {
  insertions.push(line.split(" -> "));
});

const applyMatchingRule = (
  input: string,
  insertions: string[][],
  isLast: boolean
): string | undefined => {
  const rule = insertions.filter((insertion) => insertion[0] === input);
  if (rule) {
    const start = rule[0][0].at(0) ? rule[0][0].at(0) : undefined;
    const middle = rule[0][1].at(0) ? rule[0][1].at(0) : undefined;
    const end = rule[0][0].at(1) ? rule[0][0].at(1) : undefined;
    if (!start || !middle || !end) {
      return undefined;
    }
    return isLast ? start + middle + end : start + middle;
  }
  return undefined;
};

const findUniqueLetters = (polymer: string): string => {
  // @ts-ignore
  return String.prototype.concat(...new Set(polymer));
};

const generateLetterMap = (polymer: string) => {
  let counting: any[][] = [];
  const uniqueLetters = findUniqueLetters(polymer);
  for (let i = 0; i < uniqueLetters.length; i++) {
    // @ts-ignore
    counting.push([
      uniqueLetters[i],
      [...polymer.matchAll(new RegExp(uniqueLetters[i], "gi"))].length,
    ]);
  }
  return counting;
};

const doInsertions = (
  initial: string,
  insertions: string[][],
  maxStep: number
): string => {
  let polymer = initial;
  for (let i = 0; i < maxStep; i++) {
    let polymerNextStep: string = "";

    for (let j = 0; j < polymer.length - 1; j++) {
      const input = polymer[j] + polymer[j + 1];
      const result = applyMatchingRule(
        input,
        insertions,
        j === polymer.length - 2
      );
      if (result) {
        polymerNextStep += result;
      }
    }

    polymer = polymerNextStep;
  }
  return polymer;
};

const combineCounters = (counter: any[][], newCounter: any[][]): any[][] => {
  let result: any[][] = [];
  const combined: any[][] = [...counter, ...newCounter];
  const letters = findUniqueLetters(
    combined.map((result) => result[0]).join("")
  );
  for (let i = 0; i < letters.length; i++) {
    const filtered = combined.filter((values) => values[0] === letters.at(i));
    const count =
      filtered.length > 0
        ? filtered.map((values) => values[1]).reduce((acc, val) => acc + val)
        : 0;
    result.push([letters.at(i), count]);
  }
  return result;
};

const reduceCounter = (counter: any[][], letter: string) => {
  let newCounter: any[][] = [];
  counter.forEach((count) => {
    const newCount = count[0] === letter ? count[1] - 1 : count[1];
    newCounter.push([count[0], newCount]);
  });
  return newCounter;
};

const simulateInsertionResult = (
  insertions: string[][],
  steps: number
): any[][] => {
  let map: any[][] = [];
  for (let j = 0; j < insertions.length; j++) {
    const polymer = doInsertions(insertions[j][0], insertions, steps);
    map.push([insertions[j][0], generateLetterMap(polymer), polymer]);
  }
  return map;
};

const countResultFromMap = (counter: any[][]): number => {
  const counts = counter.map((values) => values[1]);
  return Math.max(...counts) - Math.min(...counts);
};

const doInsertionsSplitedInHalf = (
  initial: string,
  insertions: string[][],
  maxSteps: number
): any[][] => {
  if (maxSteps % 2 !== 0) {
    throw new Error("maxSteps must be an even number");
  }
  const steps = maxSteps / 2;

  // Simulate how basic polymer parts are evolved after half of maxSteps
  const map = simulateInsertionResult(insertions, steps);

  // Simulate how initial polymer is evolved after half of maxSteps
  const polymer = doInsertions(initial, insertions, steps);

  // Add mapping to polymer to get letter-count after maxSteps
  let initialCounter: any[][] = [];
  for (let i = 0; i < polymer.length - 1; i++) {
    let counter = map
      .filter((item) => item[0] === polymer[i] + polymer[i + 1])
      .map((item) => item[1])[0];

    if (counter) {
      // We need to decrease the count of the last letter, if its not the last letter of the polymer
      if (i !== polymer.length - 2) {
        counter = reduceCounter(counter, polymer[i + 1]);
      }
      initialCounter = combineCounters(initialCounter, counter);
    }
  }
  return initialCounter;
};

const input = "SHHBNFBCKNHCNOSHHVFF";
const inputExample = "NNCB";

console.log(
  "Part 1: " +
    countResultFromMap(doInsertionsSplitedInHalf(input, insertions, 10))
);

// This takes a long time
//console.log("Part 2: " + countResultFromMap(doInsertionsSplitedInHalf(input, insertions, 40)));
