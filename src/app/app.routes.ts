import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./grid/grid.component'),
  },
  {
    path: 'conway',
    loadComponent: () => import('./conways-game-of-life/game-of-life.component'),
  },
];
