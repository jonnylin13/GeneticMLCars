import { line, point } from '../types/space';

export default class Physics {
  // For some more help on collision
  // Check out Jeffery Thompson's website
  // http://www.jeffreythompson.org/collision-detection/table_of_contents.php
  private static isPointInCircle(point: point, center: point, radius: number) {
    let dist = (point.x - center.x) ** 2 + (point.y - center.y) ** 2;
    return dist <= radius ** 2;
  }

  private static doesPointCollideWithCircle(
    A: point,
    B: point,
    center: point,
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
    A: point,
    B: point,
    center: point,
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
    line: line,
    center: point,
    radius: number
  ): boolean {
    const A: point = line.origin;
    const B: point = line.destination;

    if (this.doesPointCollideWithCircle(A, B, center, radius) === false)
      return false;

    const AB: point = { x: 0, y: 0 },
      AC: point = { x: 0, y: 0 },
      BC: point = { x: 0, y: 0 };

    AB.x = B.x - A.x;
    AB.y = B.y - A.y;
    AC.x = center.x - A.x;
    AC.y = center.y - A.y;
    BC.x = center.x - B.x;
    BC.y = center.y - B.y;

    const scalar1 = AB.x * AC.x + AB.y * AC.y;
    const scalar2 = -AB.x * BC.x + -AB.y * BC.y;

    if (scalar1 >= 0 && scalar2 >= 0) return true;

    // Simple check
    if (
      this.isPointInCircle(A, center, radius) ||
      this.isPointInCircle(B, center, radius)
    )
      return true;
    return false;
  }

  static rotateVec2D(point: point, center: point, angle: number): point {
    const rotated: point = { x: 0, y: 0 };
    const cos_a: number = Math.cos(angle);
    const sin_a: number = Math.sin(angle);

    rotated.x =
      center.x + (point.x - center.x) * cos_a + (point.y - center.y) * sin_a;
    rotated.y =
      center.y + (point.x - center.x) * sin_a - (point.y - center.y) * cos_a;
    return rotated;
  }

  static doLineSegmentsCollide(lineA: line, lineB: line) {
    // https://gamedev.stackexchange.com/questions/26004/how-to-detect-2d-line-on-line-collision
    let A = lineA.origin;
    let B = lineA.destination;
    let C = lineB.origin;
    let D = lineB.destination;
    let AC: point = { x: 0, y: 0 },
      AD: point = { x: 0, y: 0 },
      AB: point = { x: 0, y: 0 };

    AB.x = B.x - A.x;
    AB.y = B.y - A.y;
    AD.x = D.x - A.x;
    AD.y = D.y - A.y;
    AC.x = C.x - A.x;
    AC.y = C.y - A.y;

    return (AB.x * AD.y - AB.y * AD.x) * (AB.x * AC.y - AB.y * AC.x) < 0.0;
  }

  static getSegmentCollisionDistance(lineA: line, lineB: line): number {
    if (!this.doLineSegmentsCollide(lineA, lineB)) return 1.0;

    const A = lineA.origin;
    const B = lineA.destination;
    const C = lineB.origin;
    const D = lineB.destination;

    let AB: point = { x: 0, y: 0 },
      CD: point = { x: 0, y: 0 };

    AB.x = B.x - A.x;
    AB.y = B.y - A.y;
    CD.x = D.x - C.x;
    CD.y = D.y - C.y;

    return (
      -(A.x * CD.y - C.x * CD.y - CD.x * A.y + CD.x * C.y) /
      (AB.x * CD.y - AB.y * CD.x)
    );
  }
}
