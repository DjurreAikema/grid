import {Component, output} from '@angular/core';

@Component({
  selector: 'app-grid-controls',
  standalone: true,
  imports: [],
  template: `
    <div class="wrapper">
      <button (click)="resetGrid.emit()">Reset Grid</button>

      <div class="row">
        <input type="checkbox"/>
        <button (click)="generateMaze.emit()">Generate Maze</button>
      </div>

      <button (click)="runAlgorithm.emit()">Run Algorithm</button>

      <div class="row">
        <label for="rows">Number of rows: </label><br>
        <input type="number" id="rows">
      </div>

      <div class="row">
        <label for="cols">Number of cols: </label><br>
        <input type="number" id="cols">
      </div>
    </div>
  `,
  styles: [`
    .wrapper {
      display: flex;
      flex-flow: column nowrap;
    }

    .row {
      display: flex;
      flex-flow: row nowrap;
    }
  `]
})
export class GridControlsComponent {

  // --- Outputs
  generateMaze = output();
  runAlgorithm = output();
  resetGrid = output();

}
