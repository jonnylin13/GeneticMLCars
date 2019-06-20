import { Line, Point } from '../models/space';

export default class Physics {
  static rotateVec2D(point: Point, center: Point, angle: number): Point {
    let rotated: Point = { x: 0, y: 0 };
    const cos_a = Math.cos(angle);
    const sin_a = Math.sin(angle);

    rotated.x =
      center.x + (point.x - center.x) * cos_a + (point.y - center.y) * sin_a;
    rotated.y =
      center.y + (point.x - center.x) * sin_a - (point.y - center.y) * cos_a;
    return rotated;
  }
}
