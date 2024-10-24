export default interface Tile {
  row: number;
  col: number
  isWall: boolean;
  isCell: boolean
  isStart: boolean;
  isEnd: boolean;
  isVisited: boolean;

  isPath?: boolean;
  previousTile?: Tile;
}
