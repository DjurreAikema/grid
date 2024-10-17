import {Component, OnInit} from '@angular/core';
import Tile from "../shared/model/tile.model";
import {NgClass, NgForOf} from "@angular/common";
import {Queue} from 'queue-typescript';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [
    NgForOf,
    NgClass
  ],
  template: `
    <!-- Grid -->
    <div class="grid" (mouseup)="onMouseUp()">

      <!-- Row -->
      <div class="row" *ngFor="let row of grid">

        <!-- Tile -->
        <div
          *ngFor="let tile of row"
          [ngClass]="{
                        'tile': true,
                        'wall': tile.isWall,
                        'start': tile.isStart,
                        'end': tile.isEnd
                      }"
          (mousedown)="onMouseDown($event, tile)"
          (mouseenter)="onMouseEnter(tile)"
        ></div>

      </div>

    </div>

    <button (click)="runAlgorithm()">Run Algorithm</button>
    <button (click)="resetGrid()">Reset Grid</button>
  `,
  styles: [`
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
      border: 1px solid #ddd;
    }

    .wall {
      background-color: black;
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
  `]
})
export default class GridComponent implements OnInit {

  grid: Tile[][] = [];

  readonly ROWS = 20;
  readonly COLS = 20;

  readonly START_ROW = 0;
  readonly START_COL = 0;

  readonly END_ROW = 19;
  readonly END_COL = 19;

  ngOnInit() {
    this.createGrid();
  }

  private createGrid() {
    for (let i = 0; i < this.ROWS; i++) {
      const currentRow: Tile[] = [];

      for (let j = 0; j < this.COLS; j++) {
        currentRow.push({
          row: i,
          col: j,
          isWall: false,
          isStart: i === this.START_ROW && j === this.START_COL,
          isEnd: i === this.END_ROW && j === this.END_COL,
          isVisited: false,
        });
      }

      this.grid.push(currentRow);
    }
  }

  isMouseDown = false;

  toggleWall(tile: Tile) {
    tile.isWall = !tile.isWall;
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
    const visited = new Set();
    const queue = new Queue<Tile>();
    const startTile = this.grid[this.START_ROW][this.START_COL];
    queue.enqueue(startTile);

    while (queue.length) {
      const currentTile = queue.dequeue();
      if (currentTile.isEnd) {
        // Path found
        return;
      }

      this.getNeighbors(currentTile).forEach(neighbor => {
        if (!visited.has(neighbor) && !neighbor.isWall) {
          visited.add(neighbor);
          queue.enqueue(neighbor);
          // Optionally, mark the cell as visited for visualization
          neighbor.isVisited = true;
        }
      });

      await this.sleep(10);
    }
  }

  getNeighbors(tile: Tile): Tile[] {
    const neighbors = [];
    const {row, col} = tile;
    if (row > 0) neighbors.push(this.grid[row - 1][col]);
    if (row < this.ROWS - 1) neighbors.push(this.grid[row + 1][col]);
    if (col > 0) neighbors.push(this.grid[row][col - 1]);
    if (col < this.COLS - 1) neighbors.push(this.grid[row][col + 1]);
    return neighbors;
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  resetGrid() {
    this.grid.forEach(row => {
      row.forEach(cell => {
        cell.isWall = false;
        cell.isVisited = false;
        // Reset other properties as needed
      });
    });
  }
}
