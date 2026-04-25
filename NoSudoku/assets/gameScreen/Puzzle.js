import Generator from "./Generator";

export default class Puzzle {
  constructor(difficulty = "E", seed = null) {
    const gen = new Generator(seed);

    this.seed = gen.getSeed();
    this.genVersion = gen.getVersion();
    this.remVersion = "Removal Version: 1.0";

    this.rng = this.seededRandom(this.seed);

    this.solved = gen.getBoard();
    this.board = gen.getBoard();

    const tilesToRemove = this.getDifficulty(difficulty);
    this.removeTiles(tilesToRemove);
  }

  // ============================= 

  getSolvedBoard() {
    return this.solved.map(row => [...row]);
  }

  getPuzzleBoard() {
    return this.board.map(row => [...row]);
  }

  getSeed() {
    return this.seed;
  }

  getVersions() {
    return `${this.genVersion}\n${this.remVersion}\nSeed: ${this.seed}`;
  }

  // ============================= 

  getDifficulty(dif) {
    if (dif === "E") return 37 + Math.floor(this.rng() * 7);
    if (dif === "Me") return 44 + Math.floor(this.rng() * 3);
    if (dif === "H") return 47 + Math.floor(this.rng() * 4);
    return 40; // fallback
  }

  removeTiles(count) {
    let remaining = count;

    let positions = Array.from({ length: 81 }, (_, i) => i);
    positions = this.shuffle(positions);

    for (let index of positions) {
      if (remaining === 0) break;

      const row = Math.floor(index / 9);
      const col = index % 9;

      const backup = this.board[row][col];
      this.board[row][col] = 0;

      if (!this.hasUniqueSolution()) {
        this.board[row][col] = backup; // revert
      } else {
        remaining--;
      }
    }
  }

  // ============================= 
  // Uniqueness check

  hasUniqueSolution() {
    this.solutionCount = 0;
    const copy = this.board.map(row => [...row]);
    this.solveCount(copy);
    return this.solutionCount === 1;
  }

  solveCount(board) {
    if (this.solutionCount >= 2) return;

    const empty = this.findEmpty(board);
    if (!empty) {
      this.solutionCount++;
      return;
    }

    const [row, col] = empty;

    for (let num = 1; num <= 9; num++) {
      if (this.isValid(board, row, col, num)) {
        board[row][col] = num;
        this.solveCount(board);
        board[row][col] = 0;
      }
    }
  }

  findEmpty(board) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === 0) return [i, j];
      }
    }
    return null;
  }

  isValid(board, row, col, value) {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === value) return false;
      if (board[i][col] === value) return false;
    }

    const rowStart = Math.floor(row / 3) * 3;
    const colStart = Math.floor(col / 3) * 3;

    for (let r = rowStart; r < rowStart + 3; r++) {
      for (let c = colStart; c < colStart + 3; c++) {
        if (board[r][c] === value) return false;
      }
    }

    return true;
  }

  // ============================= 

  seededRandom(seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;

    return () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  shuffle(array) {
    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(this.rng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
  }
}
