import * as fs from "fs";

let input: string[][] = [];
const allFileContents = fs.readFileSync("./day12/example.txt", "utf-8");
allFileContents.split(/\r?\n/).forEach((line) => {
  input.push(line.split("-"));
});

const findConnectedCaves = (
  startCave: string,
  caveMap: string[][]
): string[] => {
  const mappings = caveMap.filter(
    (mapping) => mapping[0] === startCave || mapping[1] === startCave
  );

  return mappings.map(
    (mapping) => mapping.filter((entry) => entry !== startCave)[0]
  );
};

const isSmallCave = (cave: string): boolean => {
  return cave.match("[a-z]+") !== null;
};

const pathAlreadyExisting = (paths: string[][], newPath: string[]): boolean => {
  return paths.filter((path) => path === newPath).length > 0;
};

const doAllPathsEnd = (paths: string[][]): boolean => {
  let allEnd = true;
  paths.forEach((path) => {
    if (path.at(-1) !== "end") {
      allEnd = false;
    }
  });
  return allEnd;
};

const findDuplicates = (arr: string[]): string[] =>
  arr.filter((item, index) => arr.indexOf(item) != index);

const whichSmallCaveVisitedTwice = (path: string[]): string[] => {
  return findDuplicates(path).filter((cave) => isSmallCave(cave));
};

const filterStart = (possibleNextCaves: string[]): string[] => {
  return possibleNextCaves.filter((cave) => cave !== "start");
};

const canVisitSmallCave = (path: string[]): boolean => {
  return filterStart(whichSmallCaveVisitedTwice(path)).length === 0;
};

const filterPossibleNextCaves = (
  visitedCaves: string[],
  possibleNextCaves: string[],
  isPartOne: boolean
): string[] => {
  if (!isPartOne) {
    if (canVisitSmallCave(visitedCaves)) {
      return filterStart(possibleNextCaves);
    }
  }
  const smallCavesAlreadyVisited = visitedCaves.filter((cave) =>
    isSmallCave(cave)
  );
  return possibleNextCaves.filter(
    (nextCave) => !smallCavesAlreadyVisited.includes(nextCave)
  );
};

const findPaths = (caveMap: string[][], isPartOne: boolean): string[][] => {
  let paths: string[][] = [["start"]];
  let newPaths: string[][] = [];
  let allPathsEnded = false;

  while (!allPathsEnded) {
    for (let i = 0; i < paths.length; i++) {
      let path = paths[i];
      if (path.at(-1) === "end") {
        newPaths.push(path);
        continue;
      }

      const possibleNextCaves = filterPossibleNextCaves(
        path,
        findConnectedCaves(path.at(-1)!, caveMap),
        isPartOne
      );

      possibleNextCaves.forEach((cave) => {
        const possibleNewPath = [...path, cave];
        if (!pathAlreadyExisting(newPaths, possibleNewPath)) {
          newPaths.push(possibleNewPath);
        }
      });
    }

    paths = newPaths;
    newPaths = [];
    allPathsEnded = doAllPathsEnd(paths);
  }
  return paths;
};

console.log("Part 1: " + findPaths(input, true).length);
console.log("Part 2: " + findPaths(input, false).length);
