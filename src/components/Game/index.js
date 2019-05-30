import React, { Component } from 'react';
import './styles.css';

import Cell from '../Cell';

const CELL_SIZE = 5;
const WIDTH = 800;
const HEIGHT = 600;

class Game extends Component {
  constructor() {
    super();
    this.rows = HEIGHT / CELL_SIZE;
    this.cols = WIDTH / CELL_SIZE;

    this.board = this.makeEmptyBoard();
  }

  state = {
    cells: [],
    isRunning: false,
    interval: 100,
  };

  getElementOffset() {
    const rect = this.boardRef.getBoundingClientRect();
    const doc = document.documentElement;

    return {
      x: rect.left + window.pageXOffset - doc.clientLeft,
      y: rect.top + window.pageYOffset - doc.clientTop,
    };
  }

  handleClick = (event) => {
    const elemOffset = this.getElementOffset();
    const offsetX = event.clientX - elemOffset.x;
    const offsetY = event.clientY;

    const x = Math.floor(offsetX / CELL_SIZE);
    const y = Math.floor(offsetY / CELL_SIZE);

    if (x >= 0 && x <= this.cols && y >= 0 && y <= this.rows) {
      this.board[y][x] = !this.board[y][x];
    }

    this.setState({ cells: this.makeCells() });
  };

  runGame = () => {
    this.setState({ isRunning: true });
    this.runIteration();
  };

  stopGame = () => {
    this.setState({ isRunning: false });
    if (this.timeoutHandler) {
      window.clearTimeout(this.timeoutHandler);
      this.timeoutHandler = null;
    }
  };

  handleIntervalChange = (event) => {
    this.setState({ interval: event.target.value });
  };

  handleClear = () => {
    this.board = this.makeEmptyBoard();
    this.setState({ cells: this.makeCells() });
  };

  handleRandom = () => {
    for (let y = 0; y < this.rows; y += 1) {
      for (let x = 0; x < this.cols; x += 1) {
        this.board[y][x] = Math.random() <= 0.15;
      }
    }

    this.setState({ cells: this.makeCells() });
  };

  makeCells() {
    const cells = [];
    for (let y = 0; y < this.rows; y += 1) {
      for (let x = 0; x < this.cols; x += 1) {
        if (this.board[y][x]) {
          cells.push({ x, y });
        }
      }
    }

    return cells;
  }

  makeEmptyBoard() {
    const board = [];
    for (let y = 0; y < this.rows; y += 1) {
      board[y] = [];
      for (let x = 0; x < this.cols; x += 1) {
        board[y][x] = false;
      }
    }

    return board;
  }

  runIteration() {
    const newBoard = this.makeEmptyBoard();
    const { interval } = this.state;

    for (let y = 0; y < this.rows; y += 1) {
      for (let x = 0; x < this.cols; x += 1) {
        const neighbors = this.calculateNeighbors(this.board, x, y);
        if (this.board[y][x]) {
          if (neighbors >= 3) {
            newBoard[y][x] = true;
          } else {
            newBoard[y][x] = false;
          }
        } else if (!this.board[y][x] && neighbors >= 4) {
          newBoard[y][x] = true;
        }
      }
    }

    this.board = newBoard;
    this.setState({ cells: this.makeCells() });

    this.timeoutHandler = window.setTimeout(() => {
      this.runIteration();
    }, interval);
  }

  /**
   * Calculate the number of neighbors at point (x, y)
   * @param {Array} board
   * @param {int} x
   * @param {int} y
   */
  calculateNeighbors(board, x, y) {
    let neighbors = 0;
    const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
    for (let i = 0; i < dirs.length; i += 1) {
      const dir = dirs[i];
      const y1 = y + dir[0];
      const x1 = x + dir[1];

      if (x1 >= 0 && x1 < this.cols && y1 >= 0 && y1 < this.rows && board[y1][x1]) {
        neighbors += 1;
      }
    }

    return neighbors;
  }

  render() {
    const { cells, interval, isRunning } = this.state;
    return (
      <div>
        <div
          className="Board"
          style={{ width: WIDTH, height: HEIGHT, backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px` }}
          onClick={this.handleClick}
          ref={(n) => {
            this.boardRef = n;
          }}
        >
          {cells.map(cell => (
            <Cell x={cell.x} y={cell.y} size={CELL_SIZE} key={`${cell.x},${cell.y}`} />
          ))}
        </div>

        <div className="controls">
          Update every
          {' '}
          <input value={interval} onChange={this.handleIntervalChange} />
          {' '}
msec
          {isRunning ? (
            <button className="button" type="button" onClick={this.stopGame}>
              Stop
            </button>
          ) : (
            <button className="button" type="button" onClick={this.runGame}>
              Run
            </button>
          )}
          <button className="button" type="button" onClick={this.handleRandom}>
            Random
          </button>
          <button className="button" type="button" onClick={this.handleClear}>
            Clear
          </button>
        </div>
      </div>
    );
  }
}

export default Game;
