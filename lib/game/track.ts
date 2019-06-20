import { Line, Point } from '../types/space';

export default class Track {
  checkpoints: Array<Line> = [];
  walls: Array<Line> = [];

  startingPos: Point;
  startingAngle: number;
  finishPos: Point;

  constructor(cpData: Array<Array<number>>) {
    this.checkpoints = this.convertCheckpoints(cpData);
    this.walls = this.generateWalls();

    this.startingPos = this.getCenter(this.checkpoints[0]);
    this.startingAngle = this.getStartingAngle();
    this.finishPos = this.getCenter(
      this.checkpoints[this.checkpoints.length - 1]
    );
  }

  private convertCheckpoints(cpData: Array<Array<number>>) {
    let cp: Array<Line> = [];
    for (let line of cpData) {
      cp.push({
        origin: { x: line[0], y: line[1] },
        destination: { x: line[2], y: line[3] }
      });
    }
    return cp;
  }

  private generateWalls() {
    let walls: Array<Line> = [];
    for (let i = 1; i < this.checkpoints.length; i++) {
      walls.push({
        origin: this.checkpoints[i - 1].origin,
        destination: this.checkpoints[i].origin
      });

      walls.push({
        origin: this.checkpoints[i - 1].destination,
        destination: this.checkpoints[i].destination
      });
    }
    return walls;
  }

  private getCenter(cp: Line): Point {
    return {
      x: cp.origin.x + (cp.destination.x - cp.origin.x) * 0.5,
      y: cp.origin.y + (cp.destination.y - cp.origin.y) * 0.5
    };
  }

  private getStartingAngle() {
    // Should be targeting the center of the second checkpoint
    let target = this.getCenter(this.checkpoints[1]);
    return Math.atan2(
      target.y - this.startingPos.y,
      target.x - this.startingPos.x
    );
  }
}
