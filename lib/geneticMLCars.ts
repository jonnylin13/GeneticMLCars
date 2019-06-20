import * as P from 'pixi.js';
import { LineSprite, CarSprite } from './gfx/sprites/shapes';
import { NeuralNetworkSprite, RaySprite } from './gfx/sprites/info';
import Car from './game/car';

export default class GeneticMLCarsGame {
  private _app: P.Application;
  private _stage: P.Container;

  trackSprite: LineSprite;
  checkpointSprite: LineSprite;
  networkSprite: NeuralNetworkSprite;
  carSprites: Array<CarSprite>;
  sensorSprites: Array<RaySprite>;

  tracking: Car;

  constructor(app: P.Application) {
    this._app = app;
    this._stage = new P.Container();
    this._app.stage.addChild(this._stage);

    window.onresize = () => {
      this._app.renderer.resize(window.innerWidth, window.innerHeight);
    };
  }

  start(): void {}

  private setTrack(track: Track) {
    if (this.trackSprite !== null) {
      this._stage.removeChild(this.trackSprite);
      this._stage.removeChild(this.checkpointSprite);
    }

    this.trackSprite = new LineSprite(track.walls);
    this._stage.addChild(this.trackSprite);

    this.checkpointSprite = new LineSprite(track.checkpoints, 0xfdfdfd);
    this._stage.addChild(this.checkpointSprite);
  }

  private updateCars(cars: Array<Car>) {
    this.sensorSprites.forEach(sprite => {
      this._stage.removeChild(sprite);
    });
    this.sensorSprites = [];

    if (this.carSprites.length < cars.length) {
      let numNeeded = cars.length - this.carSprites.length;
      for (let i = 0; i < numNeeded; i++) {
        let sprite = new CarSprite(0xffffff * Math.random());
        this._stage.addChild(sprite);
        this.carSprites.push(sprite);
      }
    } else if (this.carSprites.length > cars.length) {
      for (let i = 0; i < this.carSprites.length - cars.length; i++) {
        let sprite = this.carSprites.pop();
        this._stage.removeChild(sprite!);
        sprite!.destroy();
      }
    }

    for (let i in cars) {
      let car = cars[i];
      let sprite = this.carSprites[i];
      sprite.position.set(car.position.x, car.position.y);
      sprite.rotation = car.angle + Math.PI / 2;
      if (car.color !== sprite.color) {
        sprite.graphics.clear();
        sprite.setColor(car.color);
      }
    }

    this.tracking = this.getBestCar(cars);
    this.updateCameraPosition(this.tracking);
    this.renderNeuralNetwork(this.tracking);
    this.renderSensors(this.tracking);
  }

  private getBestCar(cars: Array<Car>) {}
}
