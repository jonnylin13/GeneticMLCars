import Car from '../game/car';
import Track from '../game/track';
import Brain from './brain';
import { ALGORITHM } from '../constants';
import '../util/arrayDeepCopy';

export default class Breeder {
  alphaBrain: Brain | undefined;
  alphaCarFitness: number = -1;

  constructor() {}

  breed(cars: Array<Car>, track: Track) {
    let sorted = this.sortByFitness(cars);
    let spawnList: Array<Car> = [];

    let bestCar = sorted[0];
    if (this.alphaCarFitness < bestCar.fitness) {
      this.alphaBrain = bestCar.brain;
      this.alphaCarFitness = bestCar.fitness;
    }

    if (this.alphaBrain !== undefined) {
      for (let i = 0; i < ALGORITHM.numAlphaClones; i++) {
        let newCar = new Car(track);
        newCar.brain = new Brain(false);
        newCar.brain.connections = this.alphaBrain.connections.deepCopy();
        this.mutate(newCar.brain);
        spawnList.push(newCar);
      }
    }

    let totalFitness: number = 0;
    for (let i = 0; i < ALGORITHM.amtToSelect; i++)
      totalFitness += sorted[i].fitness;

    for (let i = 0; i < ALGORITHM.amtToSelect; i++) {
      let currentCar = sorted[i];

      let amtToSpawn =
        (currentCar.fitness / totalFitness) * ALGORITHM.amtToBreed;
      for (let j = 0; j < amtToSpawn; j++) {
        let baby = new Car(track);
        baby.brain = new Brain(false);
        baby.brain.connections = currentCar.brain.connections.deepCopy();
        this.mutate(baby.brain);
        spawnList.push(baby);
      }
    }

    return spawnList;
  }

  private mutate(brain: Brain) {
    for (let layer of brain.connections) {
      for (let weights of layer) {
        for (let i in weights) {
          if (Math.random() > ALGORITHM.mutationChance) continue;
          weights[i] +=
            (Math.random() - Math.random()) * ALGORITHM.mutationFactor;
        }
      }
    }
  }

  private sortByFitness(cars: Array<Car>): Array<Car> {
    return cars.sort(
      (a, b): number => {
        return b.fitness - a.fitness;
      }
    );
  }
}
