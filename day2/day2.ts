import * as fs from "fs";

let lines: string[] = [];
const allFileContents = fs.readFileSync("./day2/input2.txt", "utf-8");
allFileContents.split(/\r?\n/).forEach((line) => {
  lines.push(line);
});

let x = 0;
let depth = 0;
lines.forEach((line) => {
  const commands = line.split(" ");
  if (commands[0] === "forward") {
    x += parseInt(commands[1]);
  }
  if (commands[0] === "up") {
    depth -= parseInt(commands[1]);
  }

  if (commands[0] === "down") {
    depth += parseInt(commands[1]);
  }
});
console.log(depth * x);

// Part 2

x = 0;
depth = 0;
let aim = 0;
lines.forEach((line) => {
  const commands = line.split(" ");
  if (commands[0] === "forward") {
    x += parseInt(commands[1]);
    depth += aim * parseInt(commands[1]);
  }
  if (commands[0] === "up") {
    aim -= parseInt(commands[1]);
  }

  if (commands[0] === "down") {
    aim += parseInt(commands[1]);
  }
});
console.log(depth * x);
