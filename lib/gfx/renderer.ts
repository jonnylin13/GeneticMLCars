import * as P from 'pixi.js';
import { LineSprite, CarSprite } from '../gfx/sprites/shapes';
import { NeuralNetworkSprite, RaySprite } from '../gfx/sprites/info';
import Car from '../game/car';
import { SETTINGS } from '../constants';
import Track from '../game/track';

export default class Renderer {
  private _app: P.Application;
  private _stage: P.Container;

  trackSprite!: LineSprite;
  checkpointSprite!: LineSprite;
  networkSprite!: NeuralNetworkSprite | null;
  carSprites!: Array<CarSprite>;
  sensorSprites!: Array<RaySprite>;

  tracking!: Car;

  constructor(app: P.Application) {
    this._app = app;
    this._stage = new P.Container();
    this._app.stage.addChild(this._stage);

    window.onresize = () => {
      this._app.renderer.resize(window.innerWidth, window.innerHeight);
    };
  }

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
      const numNeeded = cars.length - this.carSprites.length;
      for (let i = 0; i < numNeeded; i++) {
        const sprite = new CarSprite(0xffffff * Math.random());
        this._stage.addChild(sprite);
        this.carSprites.push(sprite);
      }
    } else if (this.carSprites.length > cars.length) {
      for (let i = 0; i < this.carSprites.length - cars.length; i++) {
        const sprite = this.carSprites.pop();
        this._stage.removeChild(sprite!);
        sprite!.destroy();
      }
    }

    for (let i in cars) {
      const car = cars[i];
      const sprite = this.carSprites[i];
      sprite.position.set(car.pos.x, car.pos.y);
      sprite.rotation = car.angle + Math.PI / 2;
      if (car.color !== sprite.color) {
        sprite.gfx.clear();
        sprite.setColor(car.color);
      }
    }

    this.tracking = this.getBestCar(cars);
    this.trackCar(this.tracking);
    this.renderNeuralNetwork(this.tracking);
    this.renderSensors(this.tracking);
  }

  private getBestCar(cars: Array<Car>) {
    let best: Car = cars[0];
    for (let car of cars) {
      if (car.alive && car.fitness > best.fitness) best = car;
    }

    if (
      this.tracking === null ||
      !this.tracking.alive ||
      best.fitness - 2 >= this.tracking.fitness
    ) {
      this._app.stage.removeChild(this.networkSprite!);
      this.networkSprite = null;
      return best;
    } else {
      return this.tracking;
    }
  }

  private trackCar(tracking: Car) {
    const zoom = SETTINGS.zoom * 10;
    this._stage.pivot.set(
      tracking.pos.x - window.innerWidth / (zoom * 2),
      tracking.pos.y - window.innerHeight / (zoom * 2)
    );
    this._stage.scale.set(zoom, zoom);
  }

  private renderNeuralNetwork(car: Car) {
    if (SETTINGS.renderNeuralNetwork) {
      if (!this.networkSprite) {
        this.networkSprite = new NeuralNetworkSprite(car.brain);
        this.networkSprite.position.set(50, 50);
        this.networkSprite.scale.set(1.5, 1.5);
        this._app.stage.addChild(this.networkSprite);
      }
    } else {
      if (this.networkSprite) {
        this._stage.removeChild(this.networkSprite!);
        this.networkSprite = null;
      }
    }
  }

  private renderSensors(car: Car) {
    if (car.alive && SETTINGS.renderSensors) {
      for (let sensor of car.sensors) {
        const sensorSprite = new RaySprite(sensor);
        this._stage.addChild(sensorSprite);
        this.sensorSprites.push(sensorSprite);
      }
    }
  }
}
