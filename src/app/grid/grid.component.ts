// grid.component.ts
import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import Tile from '../shared/model/tile.model';
import {NgClass, NgForOf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Queue} from 'queue-typescript';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [NgForOf, NgClass, FormsModule],
  template: `
    <!-- Buttons -->
    <button (click)="generateMaze()">Generate Maze</button>
    <button (click)="runAlgorithm()">Run Algorithm</button>
    <button (click)="resetGrid()">Reset Grid</button>

    <!-- Grid -->
    <div class="grid" (mouseup)="onMouseUp()">
      <!-- Row -->
      <div class="row" *ngFor="let row of grid">
        <!-- Tile -->
        <div
          *ngFor="let tile of row"
          [ngClass]="{
            tile: true,
            wall: tile.isWall,
            cell: tile.isCell && !tile.isWall,
            start: tile.isStart,
            end: tile.isEnd,
            visited: tile.isVisited,
            path: tile.isPath
          }"
          (mousedown)="onMouseDown($event, tile)"
          (mouseenter)="onMouseEnter(tile)"
        ></div>
      </div>
    </div>
  `,
  styles: [
    `
      .grid {
        display: flex;
        flex-direction: column;
        user-select: none;
      }

      .row {
        display: flex;
      }

      .tile {
        width: 20px;
        height: 20px;
        box-sizing: border-box;
      }

      .wall {
        background-color: black;
      }

      .cell {
        background-color: white;
        border: 1px solid #ddd;
      }

      .start {
        background-color: green;
      }

      .end {
        background-color: red;
      }

      .visited {
        background-color: lightblue;
      }

      .path {
        background-color: yellow;
      }
    `,
  ],
})
export default class GridComponent implements OnInit {
  grid: Tile[][] = [];

  readonly ROWS = 21; // Must be odd
  readonly COLS = 21; // Must be odd

  START_ROW = 1;
  START_COL = 1;

  END_ROW = this.ROWS - 2;
  END_COL = this.COLS - 2;

  isMouseDown = false;
  private mazeGenerated = false;

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.createGrid();
  }

  private createGrid() {
    this.grid = [];
    for (let i = 0; i < this.ROWS; i++) {
      const currentRow: Tile[] = [];
      for (let j = 0; j < this.COLS; j++) {
        const isCell = i % 2 !== 0 && j % 2 !== 0;
        currentRow.push({
          row: i,
          col: j,
          isWall: !isCell,
          isCell: isCell,
          isStart: i === this.START_ROW && j === this.START_COL,
          isEnd: i === this.END_ROW && j === this.END_COL,
          isVisited: false,
          isPath: false,
          previousTile: undefined,
        });
      }
      this.grid.push(currentRow);
    }
  }

  toggleWall(tile: Tile) {
    if (!this.mazeGenerated && !tile.isStart && !tile.isEnd) {
      tile.isWall = !tile.isWall;
    }
  }

  onMouseDown(event: MouseEvent, tile: Tile) {
    this.isMouseDown = true;
    this.toggleWall(tile);
  }

  onMouseUp() {
    this.isMouseDown = false;
  }

  onMouseEnter(tile: Tile) {
    if (this.isMouseDown) {
      this.toggleWall(tile);
    }
  }

  async runAlgorithm() {
    const visited = new Set<Tile>();
    const queue = new Queue<Tile>();
    const startTile = this.grid[this.START_ROW][this.START_COL];
    queue.enqueue(startTile);
    visited.add(startTile);

    while (queue.length) {
      const currentTile = queue.dequeue();

      if (currentTile.isEnd) {
        // Path found, backtrack to mark the shortest path
        await this.backtrackPath(currentTile);
        return;
      }

      const neighbors = this.getNeighbors(currentTile);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor) && !neighbor.isWall) {
          visited.add(neighbor);
          neighbor.previousTile = currentTile; // Track the path
          queue.enqueue(neighbor);
          neighbor.isVisited = true;
        }
      }

      await this.sleep(10);
      this.cdr.detectChanges();
    }

    // If we reach here, no path was found
    alert('No path found!');
  }

  getNeighbors(tile: Tile): Tile[] {
    const neighbors = [];
    const {row, col} = tile;
    const directions = [
      [-1, 0], // Up
      [1, 0],  // Down
      [0, -1], // Left
      [0, 1],  // Right
    ];

    for (const [dRow, dCol] of directions) {
      const nRow = row + dRow;
      const nCol = col + dCol;
      if (nRow >= 0 && nRow < this.ROWS && nCol >= 0 && nCol < this.COLS) {
        neighbors.push(this.grid[nRow][nCol]);
      }
    }
    return neighbors;
  }

  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async backtrackPath(endTile: Tile) {
    let current = endTile.previousTile;
    while (current && !current.isStart) {
      current.isPath = true;
      this.cdr.detectChanges();
      await this.sleep(50); // Adjust delay for animation effect
      current = current.previousTile;
    }
  }

  resetGrid() {
    this.mazeGenerated = false;
    this.createGrid();
    this.cdr.detectChanges();
  }

  async generateMaze() {
    this.resetGrid();

    this.mazeGenerated = true;
    // Initialize sets for each cell
    const cellSets = new Map<string, Set<string>>();

    for (let i = 1; i < this.ROWS - 1; i += 2) {
      for (let j = 1; j < this.COLS - 1; j += 2) {
        const cellKey = `${i}-${j}`;
        const cellSet = new Set<string>();
        cellSet.add(cellKey);
        cellSets.set(cellKey, cellSet);
      }
    }

    // List all walls between cells
    const walls: Tile[] = [];

    for (let i = 1; i < this.ROWS - 1; i += 2) {
      for (let j = 1; j < this.COLS - 1; j += 2) {
        // Right wall
        if (j + 2 < this.COLS) {
          walls.push(this.grid[i][j + 1]);
        }
        // Bottom wall
        if (i + 2 < this.ROWS) {
          walls.push(this.grid[i + 1][j]);
        }
      }
    }

    // Shuffle walls
    this.shuffleArray(walls);

    // Process walls
    for (const wall of walls) {
      const {row, col} = wall;

      let cell1Row: number, cell1Col: number;
      let cell2Row: number, cell2Col: number;

      if (row % 2 === 0) {
        // Horizontal wall between cells vertically
        cell1Row = row - 1;
        cell1Col = col;
        cell2Row = row + 1;
        cell2Col = col;
      } else {
        // Vertical wall between cells horizontally
        cell1Row = row;
        cell1Col = col - 1;
        cell2Row = row;
        cell2Col = col + 1;
      }

      const cell1Key = `${cell1Row}-${cell1Col}`;
      const cell2Key = `${cell2Row}-${cell2Col}`;

      const set1 = cellSets.get(cell1Key)!;
      const set2 = cellSets.get(cell2Key)!;

      if (set1 !== set2) {
        // Remove the wall
        wall.isWall = false;

        // Merge sets
        const mergedSet = new Set([...set1, ...set2]);
        for (const cellKey of mergedSet) {
          cellSets.set(cellKey, mergedSet);
        }

        // Visualize the wall removal
        this.cdr.detectChanges();
        await this.sleep(10);
      }
    }
  }

  private shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(this.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  private random() {
    return Math.random();
  }
}
