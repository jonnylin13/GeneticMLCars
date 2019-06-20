import { Point, Line, Ray } from '../types/space';
import Brain from '../ai/brain';
import Track from './track';
import Physics from '../physics';

export default class Car {
  pos: Point = { x: 0, y: 0 };
  angle: number = 0;

  brain: Brain;
  alive: boolean = true;
  health: number = 100;
  timeAlive: number = 0;
  fitness: number = 1;
  checkpointsLeft: Array<Line> = [];
  sensors: Array<Ray> = [];

  // Assign a random greyscale color
  color: number = 0xffffff * Math.random();

  constructor(track: Track) {
    this.setTrack(track);
    this.brain = new Brain(true);
  }

  private setTrack(track: Track) {
    this.setCheckpoints(track);
    this.pos = { x: track.startingPos.x, y: track.startingPos.y };
    this.angle = track.startingAngle;
  }

  private setCheckpoints(track: Track) {
    this.checkpointsLeft = track.checkpoints.slice(
      1,
      course.checkpoints.length - 1
    );
  }

  private processCheckpoints() {
    let i: number = 0;
    // We are removing checkpoints, so we cannot use a cached index
    while (i < this.checkpointsLeft.length) {
      let cp = this.checkpointsLeft[i];
    }
  }
}
