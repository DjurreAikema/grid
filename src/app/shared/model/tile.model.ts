export default interface Tile {
  row: number;
  col: number
  isWall: boolean;
  isStart: boolean;
  isEnd: boolean;
  isVisited: boolean;
}
