export default class SessionDataRow {
  time: number;
  x: number;
  y: number;
  z: number;
  norm: number;
  constructor(time: number, x: number, y: number, z: number) {
    this.time = time;
    this.x = x;
    this.y = y;
    this.z = z;
    this.norm = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
  }
}
