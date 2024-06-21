import {Injectable} from '@angular/core';

export interface GridState {
  grid: Map<string, string>;
  height: number;
  width: number;
}

@Injectable({
  providedIn: 'root'
})
export class GridService {

  constructor() {
  }
}
