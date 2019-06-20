import { Line, Point } from '../types/space';

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

  static doLineSegmentsCollide(lineA: Line, lineB: Line) {
    // https://gamedev.stackexchange.com/questions/26004/how-to-detect-2d-line-on-line-collision
    const A = lineA.origin;
    const B = lineA.origin;
    const C = lineB.destination;
    const D = lineB.destination;
    let AC: Point = { x: 0, y: 0 },
      AD: Point = { x: 0, y: 0 },
      AB: Point = { x: 0, y: 0 };

    AC.x = A.x - C.x;
    AC.y = A.y - C.y;
    AB.x = B.x - A.x;
    AB.y = B.y - A.y;
    AD.x = D.x - A.x;
    AD.y = D.y - A.y;

    return (AB.x * AD.y - AB.y * AD.x) * (AB.x * AC.y - AB.y * AC.x) < 0.0;
  }

  static collisionLineCircle(A: Point, B: Point, C: Point, radius: number) {}
}
