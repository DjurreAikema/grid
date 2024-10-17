import {Component, OnInit} from '@angular/core';
import Tile from "../shared/model/tile.model";
import {NgClass, NgForOf} from "@angular/common";

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
        <div *ngFor="let tile of row"
             [ngClass]="{'tile' : true, 'wall': tile.isWall}"
             (mousedown)="onMouseDown($event, tile)"
             (mouseenter)="onMouseEnter(tile)">
        </div>

      </div>

    </div>
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
  `]
})
export default class GridComponent implements OnInit {

  grid: Tile[][] = [];
  readonly ROWS = 20;
  readonly COLS = 20;

  ngOnInit() {
    this.createGrid();
  }

  private createGrid() {
    for (let i = 0; i < this.ROWS; i++) {
      const currentRow: Tile[] = [];

      for (let j = 0; j < this.COLS; j++) {
        currentRow.push({row: 1, col: j, isWall: false});
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

}
