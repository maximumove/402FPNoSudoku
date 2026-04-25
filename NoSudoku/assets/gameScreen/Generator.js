export default class Generator {
    constructor(seed = null) {
        this.seed = seed ?? Date.now(); // random seed if none provided
        this.genVersion = "Generation Version: 1.0";

        this.random = this.seededRandom(this.seed);

        this.board = this.createEmptyBoard();
        this.fillBoard();
    }

    // ============================= 

    getVersion() {
        return this.genVersion;
    }

    getSeed() {
        return this.seed;
    }

    getBoard() {

        return this.board.map(row => [...row]);
    }

    // ============================= 

    createEmptyBoard() {
        return Array.from({ length: 9 }, () => Array(9).fill(0));
    }

    fillBoard() {
        return this.solve(0, 0);
    }

    solve(row, col) {
        if (row === 9) return true;

        const nextRow = col === 8 ? row + 1 : row;
        const nextCol = col === 8 ? 0 : col + 1;

        if (this.board[row][col] !== 0) {
            return this.solve(nextRow, nextCol);
        }

        let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        numbers = this.shuffle(numbers);

        for (let num of numbers) {
            if (this.isValid(row, col, num)) {
                this.board[row][col] = num;

                if (this.solve(nextRow, nextCol)) return true;

                this.board[row][col] = 0;
            }
        }

        return false;
    }

    isValid(row, col, value) {
        // row + col check
        for (let i = 0; i < 9; i++) {
            if (this.board[row][i] === value) return false;
            if (this.board[i][col] === value) return false;
        }

        const rowStart = Math.floor(row / 3) * 3;
        const colStart = Math.floor(col / 3) * 3;

        for (let r = rowStart; r < rowStart + 3; r++) {
            for (let c = colStart; c < colStart + 3; c++) {
                if (this.board[r][c] === value) return false;
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
            const j = Math.floor(this.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }

        return arr;
    }
}
