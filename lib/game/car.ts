import { Point, Line, Ray } from '../types/space';
import Brain from '../ai/brain';
import Course from '../game/course';
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

  constructor(course: Course) {
    this.setCourse(course);
  }

  private setCourse(course: Course) {
    this.setCheckpoints(course);
    this.pos = { x: course.startingPos.x, y: course.startingPos.y };
    this.angle = course.startingAngle;
  }

  private setCheckpoints(course: Course) {
    this.checkpointsLeft = course.checkpoints.slice(
      1,
      course.checkpoints.length - 1
    );
  }

  private processCheckpoints() {
    let i: number = 0;
    // We are removing checkpoints, so we cannot use a cached index
    while (i < this.checkpointsLeft.length) {}
  }
}
