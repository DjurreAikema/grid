import {computed, effect, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import Tile from "../../shared/model/tile.model";
import {map, merge, Observable, of, Subject} from "rxjs";
import {connect} from "ngxtension/connect";

// State interface
export interface GridState {
  grid: Tile[][];
  numberOfCols: number;
  numberOfRows: number;
  startCol: number;
  startRow: number;
  endCol: number;
  endRow: number;
}

@Injectable({
  providedIn: 'root'
})
export class GridService {

  // --- State
  private state: WritableSignal<GridState> = signal<GridState>({
    grid: [],
    numberOfCols: 31,
    numberOfRows: 31,
    startCol: 1,
    startRow: 1,
    endCol: 1,
    endRow: 1
  });

  // --- Selectors
  public grid: Signal<Tile[][]> = computed(() => this.state().grid);

  public numberOfCols: Signal<number> = computed(() => this.state().numberOfCols);
  public numberOfRows: Signal<number> = computed(() => this.state().numberOfRows);

  public startCol: Signal<number> = computed(() => this.state().startCol);
  public startRow: Signal<number> = computed(() => this.state().startRow);
  public endCol: Signal<number> = computed(() => this.state().endCol);
  public endRow: Signal<number> = computed(() => this.state().endRow);

  // --- Sources
  public resetGrid$: Subject<void> = new Subject<void>();

  private generateGrid$: Observable<Tile[][]> = this.createGrid();

  // --- Reducers
  constructor() {
    const nextState$ = merge(
      this.generateGrid$.pipe(map((grid) => ({
        grid: grid
      }))),
    );

    connect(this.state)
      .with(nextState$);

    // --- Effects
    effect(() => {
      // if (this.numberOfCols() > 0 && this.numberOfRows() > 0) {
      //   this.resetGrid$.next();
      // }
    });
  }

  // --- Functions
  private createGrid(): Observable<Tile[][]> {
    const grid: Tile[][] = [];

    for (let i = 0; i < this.numberOfRows(); i++) {
      const currentRow: Tile[] = [];

      for (let j = 0; j < this.numberOfCols(); j++) {
        const isCell = i % 2 !== 0 && j % 2 !== 0;
        currentRow.push({
          row: i,
          col: j,
          isWall: !isCell,
          isCell: isCell,
          isStart: i === this.startRow() && j === this.startCol(),
          isEnd: i === this.endRow() && j === this.endCol(),
          isVisited: false,
          isPath: false,
          previousTile: undefined,
        });
      }
      grid.push(currentRow);
    }

    return of(grid);
  }
}
