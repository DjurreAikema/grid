import {Component, computed, effect, ElementRef, inject, input, InputSignal, output, OutputEmitterRef, Renderer2} from '@angular/core';
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
      width: 100%;
      height: 100%;

      display: flex;
      flex-direction: column;
      user-select: none;
    }

    .row {
      display: flex;
    }

    .tile {
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

  private elementRef: ElementRef = inject(ElementRef);
  private renderer: Renderer2 = inject(Renderer2);

  // --- Inputs
  grid: InputSignal<Tile[][]> = input.required<Tile[][]>();

  // --- Outputs
  tileClicked: OutputEmitterRef<Tile> = output<Tile>();


  // --- Attributes
  private isMouseDown: boolean = false;

  protected numberOfRows = computed(() => this.grid().length);
  protected numberOfCols = computed(() => this.grid().length > 0 ? this.grid()[0].length : 0);

  constructor() {
    effect(() => {
      if (this.grid() && this.numberOfRows() > 0 && this.numberOfCols() > 0) {
        this.updateTileSize();
      }
    });
  }

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

  private updateTileSize(): void {
    const gridEl = this.elementRef.nativeElement.querySelector('.grid');
    const gridWidth: number = gridEl.clientWidth;
    const gridHeight: number = gridEl.clientHeight;

    const tileWidth: number = gridWidth / this.numberOfCols();
    const tileHeight: number = gridHeight / this.numberOfRows();
    const tileSize: number = Math.min(tileWidth, tileHeight);

    const tiles = gridEl.querySelectorAll('.tile');
    tiles.forEach((tile: HTMLElement) => {
      this.renderer.setStyle(tile, 'width', `${tileSize}px`);
      this.renderer.setStyle(tile, 'height', `${tileSize}px`);
    });
  }
}
