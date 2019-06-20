import { Sprite, Graphics, Point } from 'pixi.js';
import Brain from '../../ai/brain';
import { Ray } from '../../types/space';

export class NeuralNetworkSprite extends Sprite {
  gfx: Graphics;

  constructor(brain: Brain) {
    super();

    this.gfx = new Graphics();

    let positions: Array<Array<Point>> = [];
    // Number of layers
    for (let i = 0; i < brain.topology.length; i++) {
      let amt = brain.topology[i];
      let y = (1.0 - amt / 5.0) * 150;
      let x = i * 50;
      positions.push([]);

      for (let j = 0; j < amt; j++) {
        positions[i][j] = new Point(x, y);
        // Draw the connections if not first layer
        if (i != 0) {
          let connections: Array<number> = brain.connections[i - 1][j];
          for (let k = 0; k < connections.length; k++) {
            let color = 0x00ff00;
            if (connections[k] < 0) {
              color = 0xff0000;
            }

            // Width is proportional to its weight
            let width = Math.abs(connections[k]) * 10;
            width = Math.max(1, Math.min(width, 10));

            this.gfx.lineStyle(width, color, 0.5);
            this.gfx.moveTo(x, y);
            let dest = positions[i - 1][k];
            this.gfx.lineTo(dest.x, dest.y);
          }
        }
        y += 50;
      }
    }

    // Draw nodes
    for (let i = 0; i < positions.length; i++) {
      for (let j = 0; j < positions[i].length; j++) {
        let x = positions[i][j].x;
        let y = positions[i][j].y;

        this.gfx.beginFill(0xf0defa, 0.5);
        this.gfx.lineStyle(1, 0xf0defa, 0.5);
        this.gfx.drawCircle(x, y, 10);
        this.gfx.beginFill(0x003424, 1);
        this.gfx.drawCircle(x, y, 8);
      }
    }

    this.addChild(this.gfx);
  }
}

export class RaySprite extends Sprite {
  gfx: Graphics;
  constructor(ray: Ray) {
    super();
    this.gfx = new Graphics();
    const pos = RaySprite.calculatePosition(ray);

    this.gfx.lineStyle(1, 0x026300, 0.7);
    this.gfx.moveTo(ray.line.origin.x, ray.line.origin.y);
    this.gfx.lineTo(pos.x, pos.y);

    //Remainder of the line
    this.gfx.lineStyle(1, 0x500005, 0.6);
    this.gfx.moveTo(pos.x, pos.y);
    this.gfx.lineTo(ray.line.destination.x, ray.line.destination.y);

    this.addChild(this.gfx);
  }

  static calculatePosition(ray: Ray) {
    return {
      x:
        ray.line.origin.x +
        (ray.line.destination.x - ray.line.origin.x) * ray.distance,
      y:
        ray.line.origin.y +
        (ray.line.destination.y - ray.line.origin.y) * ray.distance
    };
  }
}
