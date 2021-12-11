import * as fs from "fs";

let input: number[][] = [];
const allFileContents = fs.readFileSync("./day11/input.txt", "utf-8");
allFileContents.split(/\r?\n/).forEach((line) => {
  input.push(line.split("").map((value) => parseInt(value)));
});

const findValidIndexes = (midInd: number, maxInd: number): number[] => {
  // @ts-ignore
  return [...Array(3).keys()]
    .map((value) => value + midInd - 1)
    .filter((ind) => ind > -1 && ind < maxInd + 1);
};

const combineArray = (array1: number[], array2: number[]): number[][] => {
  let combinedArray: number[][] = [];
  array1.map((value1) =>
    array2.map((value2) => combinedArray.push([value1, value2]))
  );
  return combinedArray;
};

const findNeighbourIndexes = (
  indx: number,
  indy: number,
  nx: number,
  ny: number
) => {
  const xArr = findValidIndexes(indx, nx - 1);
  const yArr = findValidIndexes(indy, ny - 1);
  return combineArray(xArr, yArr).filter(
    (indexPair) => indexPair !== [indx, indy]
  );
};

const handleFlashReaction = (energyLevel: number): number => {
  return energyLevel === 0 ? energyLevel : energyLevel + 1;
};

const handleFlash = (
  midIndexes: number[],
  indexes: number[][],
  energyMap: number[][]
): number[][] => {
  energyMap[midIndexes[0]][midIndexes[1]] = 0;
  indexes.forEach(
    (indexPair) =>
      (energyMap[indexPair[0]][indexPair[1]] = handleFlashReaction(
        energyMap[indexPair[0]][indexPair[1]]
      ))
  );
  return energyMap;
};

const countFlashes = (energyMap: number[][]): number => {
  let count = 0;
  energyMap.forEach((row) =>
    row.forEach((value) => {
      if (value === 0) {
        count++;
      }
    })
  );
  return count;
};

const findSquidAboutToFlash = (energyMap: number[][]): number[][] => {
  let indexes: number[][] = [];
  energyMap.forEach((row, indexX) =>
    row.forEach((value, indexY) => {
      if (value > 9) {
        indexes.push([indexX, indexY]);
      }
    })
  );
  return indexes;
};

const normalStep = (energyMap: number[][]): number[][] => {
  for (let i = 0; i < energyMap.length; i++) {
    for (let j = 0; j < energyMap[0].length; j++) {
      energyMap[i][j] = energyMap[i][j] + 1;
    }
  }
  //const newEnergyMap = energyMap.map((row) => row.map((value) => value++));
  return energyMap;
};

const partOne = (maxStep: number, initialMap: number[][]): number => {
  let flashCounter = 0;
  let energyMap = initialMap;
  const nx = energyMap[0].length;
  const ny = energyMap.length;
  for (let i = 0; i < maxStep; i++) {
    energyMap = normalStep(energyMap);
    let indexesAboutToFlash = findSquidAboutToFlash(energyMap);
    while (indexesAboutToFlash.length > 0) {
      indexesAboutToFlash.forEach((indexPair) => {
        const neighbors = findNeighbourIndexes(
          indexPair[0],
          indexPair[1],
          nx,
          ny
        );
        energyMap = handleFlash(indexPair, neighbors, energyMap);
        indexesAboutToFlash = findSquidAboutToFlash(energyMap);
      });
    }
    flashCounter += countFlashes(energyMap);
  }
  return flashCounter;
};

const partTwo = (initialMap: number[][]): number => {
  let energyMap = initialMap;
  const nx = energyMap[0].length;
  const ny = energyMap.length;
  let bigFlashNotHappened = true;
  let step = 0;

  while (bigFlashNotHappened) {
    step++;
    energyMap = normalStep(energyMap);
    let indexesAboutToFlash = findSquidAboutToFlash(energyMap);
    while (indexesAboutToFlash.length > 0) {
      indexesAboutToFlash.forEach((indexPair) => {
        const neighbors = findNeighbourIndexes(
          indexPair[0],
          indexPair[1],
          nx,
          ny
        );
        energyMap = handleFlash(indexPair, neighbors, energyMap);
        indexesAboutToFlash = findSquidAboutToFlash(energyMap);
      });
    }
    if (countFlashes(energyMap) === nx * ny) {
      bigFlashNotHappened = false;
    }
  }
  return step;
};

//console.log(partOne(100, input));
console.log(partTwo(input));
