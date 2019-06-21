import { Sprite, Graphics } from 'pixi.js';
import { line } from '../../types/space';

export class CircleSprite extends Sprite {
  gfx: Graphics;

  constructor() {
    super();

    this.gfx = new Graphics();
    this.gfx.beginFill(0xf00000, 0.8);
    this.gfx.drawCircle(100, 100, 20);
    this.addChild(this.gfx);
  }
}

export class CarSprite extends Sprite {
  static HEIGHT: number = 50;
  static WIDTH: number = 25;

  color!: number;
  gfx: Graphics;

  constructor(color: number) {
    super();
    this.gfx = new Graphics();
    this.draw(color);
  }

  draw(color: number) {
    this.color = color;

    // Styling
    this.gfx.beginFill(color, 0.2);
    this.gfx.drawRect(0, 0, CarSprite.WIDTH, CarSprite.HEIGHT);

    // Outline
    this.gfx.lineStyle(2, color);
    this.gfx.moveTo(0, 0);
    this.gfx.lineTo(CarSprite.WIDTH, 0);
    this.gfx.lineTo(CarSprite.WIDTH, CarSprite.HEIGHT);
    this.gfx.lineTo(0, CarSprite.HEIGHT);
    this.gfx.lineTo(0, 0);

    // Set anchor and pivot
    this.anchor.set(0.5, 0.5);
    this.pivot.set(CarSprite.WIDTH / 2, CarSprite.HEIGHT / 2);

    this.addChild(this.gfx);
  }
}

export class LineSprite extends Sprite {
  gfx: Graphics;

  constructor(lines: Array<line>, color: number = 0x000000) {
    super();
    this.gfx = new Graphics();
    this.gfx.lineStyle(1, color);
    for (let line of lines) {
      this.gfx.moveTo(line.origin.x, line.origin.y);
      this.gfx.lineTo(line.destination.x, line.destination.y);
    }

    this.addChild(this.gfx);
  }
}
