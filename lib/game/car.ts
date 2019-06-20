import { point, line, ray } from '../types/space';
import Brain from '../ai/brain';
import Track from './track';
import Physics from '../util/physics';
import { ALGORITHM } from '../constants';

export default class Car {
  pos: point = { x: 0, y: 0 };
  angle: number = 0;

  brain: Brain;
  alive: boolean = true;
  health: number = 100;
  timeAlive: number = 0;
  fitness: number = 1;
  checkpointsLeft: Array<line> = [];
  sensors: Array<ray> = [];
  color: number = 0xffffff * Math.random();

  constructor(track: Track) {
    this.setTrack(track);
    this.brain = new Brain(true);
  }

  public update(delta: number, track: Track) {
    if (!this.alive) return;
    this.timeAlive++;
    this.sensors = this.processSensors(track.walls);

    const input: Array<number> = [];
    for (let sensor of this.sensors) {
      input.push(sensor.distance);
    }
    const result: Array<number> = this.brain.process(input);

    const angleDelta = result[0];
    this.angle += angleDelta * ALGORITHM.stepAmt * delta;

    let speed: number = result[1] * 30;
    speed = Math.min(30, Math.max(speed, -30));

    this.pos.x += Math.cos(this.angle) * speed * ALGORITHM.stepAmt * delta;
    this.pos.y += Math.sin(this.angle) * speed * ALGORITHM.stepAmt * delta;

    this.processCheckpoints();

    if (this.doesCollideWithWalls(track.walls)) this.kill();

    if (this.health > 0) this.health--;
    if (this.health <= 0) this.kill();
  }

  // Physics functions

  private doesCollideWithWalls(walls: Array<line>): boolean {
    // Needs testing
    for (let wall of walls) {
      if (Physics.doesLineCollideWithCircle(wall, this.pos, 10)) return true;
    }
    return false;
  }

  // Track functions

  private setTrack(track: Track) {
    this.setCheckpoints(track);
    this.pos = { x: track.startingPos.x, y: track.startingPos.y };
    this.angle = track.startingAngle;
  }

  private setCheckpoints(track: Track) {
    this.checkpointsLeft = track.checkpoints.slice(
      1,
      track.checkpoints.length - 1
    );
  }

  private processCheckpoints() {
    let i: number = 0;
    // We are removing checkpoints, so we cannot use a cached index
    while (i < this.checkpointsLeft.length) {
      let cp = this.checkpointsLeft[i];
      if (Physics.doesLineCollideWithCircle(cp, this.pos, 15)) {
        this.checkpointsLeft.splice(i, 1);
        this.health = 100;
        this.fitness++;
      } else {
        i++;
      }
    }
    if (this.checkpointsLeft.length === 0) {
      this.fitness += 1000.0 / this.timeAlive;
      this.kill();
    }
  }

  // Entity functions
  private kill() {
    this.alive = false;
    this.color = 0xdd0000;
  }

  private respawn(track: Track) {
    this.health = 100;
    this.timeAlive = 0;
    this.fitness = 0;
    this.color = 0xffffff * Math.random();
    this.alive = true;
    this.setCheckpoints(track);
  }

  private processSensors(walls: Array<line>): Array<ray> {
    let sensors: Array<ray> = [];
    const angles: Array<number> = [
      Math.PI / 4,
      Math.PI / 2,
      0,
      -Math.PI / 2,
      -Math.PI / 4
    ];

    for (let angle of angles) {
      let sensor = {
        line: {
          origin: { x: this.pos.x, y: this.pos.y },
          destination: {
            x: this.pos.x + 100 * Math.cos(angle),
            y: this.pos.y + 100 * Math.sin(angle)
          }
        },
        distance: 1
      };
      sensor.line.origin = Physics.rotateVec2D(
        sensor.line.origin,
        this.pos,
        this.angle
      );
      sensor.line.destination = Physics.rotateVec2D(
        sensor.line.destination,
        this.pos,
        this.angle
      );

      for (let wall of walls) {
        const segmentCollisionDist = Physics.getSegmentCollisionDistance(
          sensor.line,
          wall
        );
        // Cut the line short
        if (
          segmentCollisionDist >= 0.0 &&
          segmentCollisionDist < 1.0 &&
          sensor.distance > segmentCollisionDist
        )
          sensor.distance = segmentCollisionDist;
      }
      sensors.push(sensor);
    }
    return sensors;
  }
}
