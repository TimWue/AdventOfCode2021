import * as fs from "fs";

let bingoNumbers: string[] = [];
const allFileContents = fs.readFileSync("./day4/inputNumbers.txt", "utf-8");
allFileContents.split(/\r?\n/).forEach((line) => {
  bingoNumbers.push(line);
});

let numbers = bingoNumbers[0].split(",").map((value) => parseInt(value));

let boards: string[] = [];
const content = fs.readFileSync("./day4/inputBoards.txt", "utf-8");
content.split(/\r?\n/).forEach((line) => {
  boards.push(line);
});

let bingoBoards: number[][][] = [];
let board: any = [];
for (let i = 0; i < boards.length; i++) {
  let line = boards[i];
  if (line.length < 1) {
    bingoBoards.push(board);
    board = [];
  } else {
    board.push(
      line
        .split(" ")
        .filter((value) => value !== "")
        .map((value) => parseInt(value))
    );
    if (i === boards.length - 1) {
      bingoBoards.push(board);
    }
  }
}

const markBoard = (
  boardScore: number[][],
  board: number[][],
  bingoNumber: number
): number[][] => {
  for (let i = 0; i < board.length; i++) {
    let boardLine = board[i];
    for (let j = 0; j < boardLine.length; j++) {
      if (boardLine[j] === bingoNumber) {
        boardScore[i][j] = 1;
      }
    }
  }
  return boardScore;
};

const checkVertical = (score: number[][], board: number[][]) => {
  let matrix = score[0].map((val, index) =>
    score.map((row) => row[index]).reverse()
  );

  for (let i = 0; i < matrix.length; i++) {
    if (matrix[i].reduce((acc, el) => acc + el) === 5) {
      return matrix[i];
    }
  }
  return [];
};

const hasWon = (score: number[][], board: number[][]) => {
  for (let i = 0; i < board.length; i++) {
    if (score[i].reduce((acc, el) => acc + el) === 5) {
      return board[i];
    }
  }
  return checkVertical(score, board);
};

const calculateScore = (
  board: number[][],
  score: number[][],
  lastNumber: number
): number => {
  let sum = 0;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (score[i][j] === 0) {
        sum += board[i][j];
      }
    }
  }
  return sum * lastNumber;
};

let scoreBoards = bingoBoards.map((board) =>
  board.map((line) => line.map((value) => 0))
);
let noWin = true;
let index = 0;
let winnerBoard: number[][] = [];
let winnerScore: number[][] = [];
let lastNumber = 0;
while (noWin) {
  const bingoNumber = numbers[index];
  for (let i = 0; i < bingoBoards.length; i++) {
    scoreBoards[i] = markBoard(scoreBoards[i], bingoBoards[i], bingoNumber);
    let result = hasWon(scoreBoards[i], bingoBoards[i]);
    if (result.length > 1) {
      noWin = false;
      winnerBoard = bingoBoards[i];
      winnerScore = scoreBoards[i];
      lastNumber = bingoNumber;
    }
  }
  index++;
}
console.log(calculateScore(winnerBoard, winnerScore, lastNumber));

scoreBoards = bingoBoards.map((board) =>
  board.map((line) => line.map((value) => 0))
);
winnerBoard = [];
winnerScore = [];
let score: any[] = [];
let indexes: any[] = [];
numbers.forEach((theNumber) => {
  for (let i = 0; i < bingoBoards.length; i++) {
    scoreBoards[i] = markBoard(scoreBoards[i], bingoBoards[i], theNumber);
    let result = hasWon(scoreBoards[i], bingoBoards[i]);
    if (result.length > 1) {
      noWin = false;
      winnerBoard = bingoBoards[i];
      winnerScore = scoreBoards[i];

      if (!indexes.includes(i)) {
        indexes.push(i);
        score.push(calculateScore(winnerBoard, winnerScore, theNumber));
      }
    }
  }
});

console.log(score);
console.log(indexes);
