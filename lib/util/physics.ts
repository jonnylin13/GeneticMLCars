import { Line, Point } from '../types/space';

export default class Physics {
  // For some more help on collision
  // Check out Jeffery Thompson's website
  // http://www.jeffreythompson.org/collision-detection/table_of_contents.php
  private static isPointInCircle(point: Point, center: Point, radius: number) {
    let dist = (point.x - center.x) ** 2 + (point.y - center.y) ** 2;
    return dist <= radius ** 2;
  }

  private static doesPointCollideWithCircle(
    A: Point,
    B: Point,
    center: Point,
    radius: number
  ): boolean {
    if (!this.doesCircleCollideWithBB(A, B, center, radius)) return false;

    const AB = { x: B.x - A.x, y: B.y - A.y };
    const AC = { x: center.x - A.x, y: center.y - A.y };

    const dividend = Math.abs(AB.x * AC.y - AB.y * AC.x);
    const denominator = Math.sqrt(AB.x ** 2 + AB.y ** 2);
    const distance = dividend / denominator;
    return distance < radius;
  }

  private static doesCircleCollideWithBB(
    A: Point,
    B: Point,
    center: Point,
    radius: number
  ) {
    // Rewrite this in the future maybe
    const minAB = { x: Math.min(A.x, B.x), y: Math.min(A.y, B.y) };
    const maxAB = { x: Math.max(A.x, B.x), y: Math.max(A.y, B.y) };
    const minCenter = { x: center.x - radius, y: center.y - radius };
    const maxCenter = { x: center.x + radius, y: center.y + radius };

    return !(
      minAB.x > maxCenter.x ||
      maxAB.x < minCenter.x ||
      minAB.y > maxCenter.y ||
      maxAB.y < minCenter.y
    );
  }

  static doesLineCollideWithCircle(
    line: Line,
    center: Point,
    radius: number
  ): boolean {
    const A: Point = line.origin;
    const B: Point = line.destination;

    if (this.doesPointCollideWithCircle(A, B, center, radius) === false)
      return false;

    const AB: Point = { x: 0, y: 0 },
      AC: Point = { x: 0, y: 0 },
      BC: Point = { x: 0, y: 0 };

    AB.x = B.x - A.x;
    AB.y = B.y - A.y;
    AC.x = center.x - A.x;
    AC.y = center.y - A.y;
    BC.x = center.x - B.x;
    BC.y = center.y - B.y;

    const scalar1 = AB.x * AC.x + AB.y * AC.y;
    const scalar2 = -AB.x * BC.x + -AB.y * BC.y;

    if (scalar1 >= 0 && scalar2 > -0) return true;

    // Simple check
    if (
      this.isPointInCircle(A, C, radius) ||
      this.isPointInCircle(B, C, radius)
    )
      return true;
    return false;
  }

  static rotateVec2D(point: Point, center: Point, angle: number): Point {
    const rotated: Point = { x: 0, y: 0 };
    const cos_a: number = Math.cos(angle);
    const sin_a: number = Math.sin(angle);

    rotated.x =
      center.x + (point.x - center.x) * cos_a + (point.y - center.y) * sin_a;
    rotated.y =
      center.y + (point.x - center.x) * sin_a - (point.y - center.y) * cos_a;
    return rotated;
  }

  static doLineSegmentsCollide(lineA: Line, lineB: Line) {
    // https://gamedev.stackexchange.com/questions/26004/how-to-detect-2d-line-on-line-collision
    const A: Point = lineA.origin;
    const B: Point = lineA.origin;
    const C: Point = lineB.destination;
    const D: Point = lineB.destination;
    const AB: Point = { x: 0, y: 0 },
      AC: Point = { x: 0, y: 0 },
      AD: Point = { x: 0, y: 0 };

    AB.x = B.x - A.x;
    AB.y = B.y - A.y;
    AC.x = A.x - C.x;
    AC.y = A.y - C.y;
    AD.x = D.x - A.x;
    AD.y = D.y - A.y;

    return (AB.x * AD.y - AB.y * AD.x) * (AB.x * AC.y - AB.y * AC.x) < 0.0;
  }

  static getSegmentCollisionDistance(lineA: Line, lineB: Line): number {
    if (!this.doLineSegmentsCollide(lineA, lineB)) return 1.0;

    const A: Point = lineA.origin;
    const B: Point = lineA.destination;
    const C: Point = lineB.origin;
    const D: Point = lineB.destination;

    const AB: Point = { x: 0, y: 0 },
      CD: Point = { x: 0, y: 0 };
    AB.x = B.x - A.x;
    AB.y = B.y - A.y;
    CD.x = D.x - C.x;
    CD.y = D.y - D.x;

    return (
      -(A.x * CD.y - C.x * CD.y - CD.x * A.y + CD.x * C.y) /
      (AB.x * CD.y - AB.y * CD.x)
    );
  }
}
