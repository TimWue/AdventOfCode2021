import * as fs from "fs";

let dotInput: number[][] = [];
const dotInputFile = fs.readFileSync("./day13/inputDots.txt", "utf-8");
dotInputFile.split(/\r?\n/).forEach((line) => {
  dotInput.push(line.split(",").map((value) => parseInt(value)));
});

let instInput: string[][] = [];
const instInputFile = fs.readFileSync("./day13/inputInstructions.txt", "utf-8");
instInputFile.split(/\r?\n/).forEach((line) => {
  instInput.push(line.replace("fold along ", "").split("="));
});

const findMax = (input: number[][], index: 0 | 1): number => {
  return input
    .map((valuePair) => valuePair[index])
    .reduce((acc, val) => (val > acc ? val : acc));
};

const buildInitial = (dots: number[][], nX: number, nY: number): number[][] => {
  const blank = Array(nY)
    .fill(0)
    .map((row) => Array(nX).fill(0));

  dots.forEach((dot) => {
    const x = dot[0];
    const y = dot[1];
    blank[y][x] = 1;
  });
  return blank;
};

const combineLines = (line1: number[], line2: number[]): number[] => {
  const result: number[] = [];
  for (let i = 0; i < line1.length; i++) {
    result.push(Math.min(line1[i] + line2[i], 1));
  }
  return result;
};

const foldYDown = (matrix: number[][], index: number): number[][] => {
  for (let i = 0; i < index; i++) {
    matrix[index + i + 1] = combineLines(
      matrix[index + i + 1],
      matrix[index - i - 1]
    );
  }
  return matrix.slice(index + 1, matrix.length);
};

const foldYUp = (matrix: number[][], index: number): number[][] => {
  const newIndex = matrix.length - index - 1;
  return foldYDown(matrix.reverse(), newIndex).reverse();
};

const countDots = (paper: number[][]): number => {
  let result = 0;
  paper.forEach((line) => line.forEach((value) => (result += value)));
  return result;
};

const turn90deg = (matrix: number[][]): number[][] => {
  return matrix[0].map((x, i) => matrix.map((x) => x[i]));
};

const foldXUp = (matrix: number[][], index: number): number[][] => {
  return turn90deg(turn90deg(turn90deg(foldYUp(turn90deg(matrix), index))));
};

const foldXRight = (matrix: number[][], index: number): number[][] => {
  return turn90deg(turn90deg(turn90deg(foldYDown(turn90deg(matrix), index))));
};

const makeVisible = (matrix: number[][]) => {
  console.log(
    matrix.map((line) =>
      line.map((value) => (value === 1 ? "#" : ".")).join("")
    )
  );
};

const foldPaper = (dots: number[][], inst: string[][]): number[][] => {
  const nx = findMax(dots, 0) + 1; //we assume to start at 0
  const ny = findMax(dots, 1) + 1;
  let folded = buildInitial(dots, nx, ny);

  inst.forEach((instruction) => {
    const index = parseInt(instruction[1]);
    if (instruction[0] === "y") {
      folded =
        index <= folded.length / 2
          ? foldYUp(folded, index)
          : foldYDown(folded, index);
    } else {
      folded =
        index <= folded.length / 2
          ? foldXRight(folded, index)
          : foldXUp(folded, index);
    }
    console.log("Dots counted: " + countDots(folded));
  });
  return folded;
};

// Result for part 2
const folded = foldPaper(dotInput, instInput);
makeVisible(folded);
