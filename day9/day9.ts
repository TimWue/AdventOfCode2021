import * as fs from "fs";
import * as assert from "assert";

let heightMap: number[][] = [];
const allFileContents = fs.readFileSync("./day9/example.txt", "utf-8");
allFileContents.split(/\r?\n/).forEach((line) => {
  heightMap.push(line.split("").map((value) => parseInt(value)));
});

const findNeighborIndexes = (
  indX: number,
  indY: number,
  map: number[][],
  lengthX: number,
  lengthY: number
): number[][] => {
  let neighbors: number[][] = [];

  if (indX > 0) {
    neighbors.push([indX - 1, indY]);
    if (indX < lengthX - 1) {
      neighbors.push([indX + 1, indY]);
    }
  }
  if (indX === 0) {
    neighbors.push([indX + 1, indY]);
  }

  if (indY > 0) {
    neighbors.push([indX, indY - 1]);
    if (indY < lengthY - 1) {
      neighbors.push([indX, indY + 1]);
    }
  }

  if (indY === 0) {
    neighbors.push([indX, indY + 1]);
  }
  return neighbors;
};

const isMin = (value: number, neighbours: number[]): boolean => {
  return value < Math.min(...neighbours);
};

const calcRisk = (value: number): number => {
  return value + 1;
};

const identifyMinima = (): number[][] => {
  let minimaIndexes: number[][] = [];
  const lengthX = heightMap.length;
  const lengthY = heightMap[0].length;
  for (let indx = 0; indx < lengthX; indx++) {
    for (let indy = 0; indy < lengthY; indy++) {
      const value = heightMap[indx][indy];
      const neighbours = findNeighborIndexes(
        indx,
        indy,
        heightMap,
        lengthX,
        lengthY
      ).map((indexes) => heightMap[indexes[0]][indexes[1]]);
      const isLow = isMin(value, neighbours);
      if (isLow) {
        minimaIndexes.push([indx, indy]);
      }
    }
  }
  return minimaIndexes;
};

const partOne = (): number => {
  const minima = identifyMinima();
  const values = minima.map((indexes) => heightMap[indexes[0]][indexes[1]]);
  return [0, ...values].reduce((acc, val) => acc + calcRisk(val));
};

const partTwo = (): number => {
  const minimaIndexes = identifyMinima();
  const lengthX = heightMap.length;
  const lengthY = heightMap[0].length;
  const basinSizes: number[] = [];
  for (let i = 0; i < minimaIndexes.length; i++) {
    const minimum = minimaIndexes[i];

    //Initialize
    let visited = Array(lengthX)
      .fill(false)
      .map(() => Array(lengthY).fill(false));
    let count = 0;
    let toVisit: number[][] = [];

    toVisit.push(minimum);
    while (toVisit.length !== 0) {
      const value = toVisit.pop();
      if (value) {
        //Did we visit the the point already?
        if (!visited[value[0]][value[1]]) {
          count++;
        }
        visited[value[0]][value[1]] = true;
        const neighbourIndexes = findNeighborIndexes(
          value[0],
          value[1],
          heightMap,
          lengthX,
          lengthY
        );

        neighbourIndexes
          .filter(
            (indexes) =>
              !visited[indexes[0]][indexes[1]] &&
              heightMap[indexes[0]][indexes[1]] !== 9
          )
          .map((indexes) => toVisit.push(indexes));
      }
    }
    basinSizes.push(count);
  }

  const sorted = basinSizes.sort((a, b) => b - a);
  return sorted.slice(0, 3).reduce((acc, val) => acc * val);
};

console.log(partOne());
console.log(partTwo());
