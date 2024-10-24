import {Component, output} from '@angular/core';

@Component({
  selector: 'app-grid-controls',
  standalone: true,
  imports: [],
  template: `
    <button (click)="generateMaze.emit()">Generate Maze</button>
    <button (click)="runAlgorithm.emit()">Run Algorithm</button>
    <button (click)="resetGrid.emit()">Reset Grid</button>
  `,
  styles: ``
})
export class GridControlsComponent {

  // --- Outputs
  generateMaze = output();
  runAlgorithm = output();
  resetGrid = output();

}
