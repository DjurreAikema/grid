import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-game-of-life',
  standalone: true,
  imports: [],
  template: `
    <canvas #gameCanvas width="1200" height="800"></canvas>
  `,
  styles: [`
    canvas {
      border: 1px solid black;
    }
  `]
})
export default class GameOfLifeComponent implements AfterViewInit {

  @ViewChild('gameCanvas', {static: true}) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  GRID_WIDTH = 100;
  GRID_HEIGHT = 80;
  grid: boolean[][] = [];

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.initializeGame();

    // Add a click event listener to toggle cells
    this.canvas.nativeElement.addEventListener('click', (event: MouseEvent) => {
      const rect = this.canvas.nativeElement.getBoundingClientRect();
      const x = Math.floor((event.clientX - rect.left) / (this.canvas.nativeElement.width / this.GRID_WIDTH));
      const y = Math.floor((event.clientY - rect.top) / (this.canvas.nativeElement.height / this.GRID_HEIGHT));
      this.grid[y][x] = !this.grid[y][x]; // Toggle the cell's state
      this.drawGrid();
    });

    // Start the game loop
    setInterval(() => {
      this.nextGeneration();
    }, 10); // Update elke 100 milliseconden
  }

  initializeGame(): void {
    // Initialize the grid with some random alive cells
    this.grid = Array.from({length: this.GRID_HEIGHT}, () => Array(this.GRID_WIDTH).fill(false));

    // Randomly initialize some cells as alive
    for (let y = 0; y < this.GRID_HEIGHT; y++) {
      for (let x = 0; x < this.GRID_WIDTH; x++) {
        this.grid[y][x] = Math.random() > 0.8; // About 20% chance for a cell to start alive
      }
    }

    this.drawGrid();
  }

  drawGrid(): void {
    const cellWidth = this.canvas.nativeElement.width / this.GRID_WIDTH;
    const cellHeight = this.canvas.nativeElement.height / this.GRID_HEIGHT;

    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    for (let y = 0; y < this.GRID_HEIGHT; y++) {
      for (let x = 0; x < this.GRID_WIDTH; x++) {
        if (this.grid[y][x]) {
          this.ctx.fillStyle = 'black'; // Alive cells
          this.ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
        } else {
          this.ctx.strokeStyle = '#333'; // Grid lines for dead cells
          this.ctx.strokeRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
        }
      }
    }
  }

  nextGeneration(): void {
    const newGrid = Array.from({length: this.GRID_HEIGHT}, () => Array(this.GRID_WIDTH).fill(false));

    for (let y = 0; y < this.GRID_HEIGHT; y++) {
      for (let x = 0; x < this.GRID_WIDTH; x++) {
        const neighbors = this.countNeighbors(x, y);
        if (this.grid[y][x]) {
          newGrid[y][x] = neighbors === 2 || neighbors === 3; // Survive if 2 or 3 neighbors
        } else {
          newGrid[y][x] = neighbors === 3; // Become alive if exactly 3 neighbors
        }
      }
    }

    this.grid = newGrid;
    this.drawGrid();
  }

  countNeighbors(x: number, y: number): number {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue; // Skip the current cell itself
        const nx = x + i;
        const ny = y + j;
        if (nx >= 0 && nx < this.GRID_WIDTH && ny >= 0 && ny < this.GRID_HEIGHT && this.grid[ny][nx]) {
          count++;
        }
      }
    }
    return count;
  }
}
