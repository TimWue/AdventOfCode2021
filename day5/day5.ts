import * as fs from "fs";

let commands: string[] = [];
const allFileContents = fs.readFileSync("./day5/input.txt", "utf-8");
allFileContents.split(/\r?\n/).forEach((line) => {
  commands.push(line);
});

const calculatePoints = (
  start: number[],
  end: number[],
  partOne: boolean
): number[][] | undefined => {
  const x1 = start[0];
  const y1 = start[1];
  const x2 = end[0];
  const y2 = end[1];
  let xStep = 0;
  if (x2 !== x1) {
    xStep = x2 > x1 ? 1 : -1;
  }
  let yStep = 0;
  if (y2 !== y1) {
    yStep = y2 > y1 ? 1 : -1;
  }

  let newX = x1;
  let newY = y1;
  let xPoints: number[] = [];
  let yPoints: number[] = [];

  if (partOne) {
    if (xStep !== 0 && yStep !== 0) {
      return undefined;
    }
  }
  while (!(newX === x2 && newY === y2)) {
    xPoints.push(newX);
    yPoints.push(newY);
    newX += xStep;
    newY += yStep;
  }
  xPoints.push(x2);
  yPoints.push(y2);
  return [xPoints, yPoints];
};

const readLine = (line: string, readX: boolean) => {
  const index = readX ? 0 : 1;
  let step1 = line.split(" -> ");
  return step1[index].split(",").map((value) => parseInt(value));
};

function defaultMatrix(size: number, defaultValue = 0): number[][] {
  return Array(size)
    .fill(0)
    .map(() => {
      return Array(size).fill(defaultValue);
    });
}

let matrix = defaultMatrix(1000, 0);
commands.forEach((line) => {
  const start = readLine(line, true);
  const end = readLine(line, false);
  const points = calculatePoints(start, end, false);
  if (points) {
    const xPoints = points[0];
    const yPoints = points[1];
    for (let i = 0; i < xPoints.length; i++) {
      matrix[xPoints[i]][yPoints[i]] += 1;
    }
  }
});

let count = 0;
for (let i = 0; i < matrix.length; i++) {
  for (let j = 0; j < matrix[0].length; j++) {
    if (matrix[i][j] > 1) {
      count += 1;
    }
  }
}
console.log(count);
