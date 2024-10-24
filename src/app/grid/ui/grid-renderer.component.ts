import {Component, input, InputSignal, output, OutputEmitterRef} from '@angular/core';
import {NgClass, NgForOf} from "@angular/common";
import Tile from "../../shared/model/tile.model";

@Component({
  selector: 'app-grid-renderer',
  standalone: true,
  imports: [
    NgForOf,
    NgClass
  ],
  template: `
    <!-- Grid -->
    <div class="grid" (mouseup)="onMouseUp()">
      <!-- Row -->
      <div class="row" *ngFor="let row of grid()">
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
  `]
})
// Responsibility: TODO
export class GridRendererComponent {

  // --- Inputs
  grid: InputSignal<Tile[][]> = input.required<Tile[][]>();

  // --- Outputs
  tileClicked: OutputEmitterRef<Tile> = output<Tile>();


  // --- Attributes
  private isMouseDown: boolean = false;


  // --- Functions
  protected onMouseDown(_: MouseEvent, tile: Tile): void {
    this.isMouseDown = true;
    this.tileClicked.emit(tile);
  }

  protected onMouseUp(): void {
    this.isMouseDown = false;
  }

  protected onMouseEnter(tile: Tile): void {
    if (this.isMouseDown) this.tileClicked.emit(tile);
  }
}
