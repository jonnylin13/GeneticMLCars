import * as P from 'pixi.js';
import Renderer from './gfx/renderer';

export default class GeneticMLCarsGame {
  private _app: P.Application;

  constructor(app: P.Application) {
    this._app = app;
  }

  async start(numCars: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let renderer = new Renderer(this._app);
      let trackData: Array<Array<number>>;
    });
  }
}
