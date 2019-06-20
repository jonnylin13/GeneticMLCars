import * as P from 'pixi.js';
import Renderer from './gfx/renderer';
import TrackLoader from './util/trackLoader';
import { SETTINGS } from './constants';
import Track from './game/track';
import Breeder from './ai/breeder';
import Car from './game/car';
import Brain from './ai/brain';

export default class GeneticMLCarsGame {
  private _app: P.Application;

  constructor(app: P.Application) {
    this._app = app;
  }

  async start(numCars: number): Promise<boolean> {
    let renderer = new Renderer(this._app);
    let trackData: Array<Array<number>> = await TrackLoader.load(
      'courses/' + SETTINGS.defaultCourse + '.json'
    );

    let track = new Track(trackData);
    renderer.setTrack(track);

    // let tracks = await TrackLoader.load('courses/list.json');

    let cars: Array<Car> = [];
    for (let i = 0; i < numCars; i++) {
      let car = new Car(track);
      car.brain = new Brain();
      cars.push(car);
    }

    let breeder: Breeder = new Breeder();

    this._app.ticker.add(delta => {
      let anyoneAlive: boolean = false;
      for (let car of cars) {
        if (car.alive) {
          anyoneAlive = true;
          for (let i = 0; i < SETTINGS.speed; i++) {
            car.update(delta, track);
          }
        }
      }

      if (!anyoneAlive) {
        cars = breeder.breed(cars, track);
      }

      let input: Array<number> = [];
      for (let sensor of cars[0].sensors) input.push(sensor.distance);

      renderer.updateCars(cars);
    });
    return Promise.resolve(true);
  }
}
