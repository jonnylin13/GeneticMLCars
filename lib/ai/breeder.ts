import Car from '../game/car';
import Track from '../game/track';
import Brain from './brain';
import { ALGORITHM } from '../constants';
import { deepCopy } from '../util/arrayUtil';

export default class Breeder {
  alphaBrain!: Brain;
  alphaCarFitness: number = -1;

  constructor() {}

  breed(cars: Array<Car>, track: Track) {
    console.log('Breeding...');
    const sorted = this.sortByFitness(cars);
    const spawnList: Array<Car> = [];
    const bestCar = sorted[0];

    // Check for better fitness
    if (this.alphaCarFitness < bestCar.fitness) {
      this.alphaBrain = bestCar.brain;
      this.alphaCarFitness = bestCar.fitness;
      console.log('New alpha: ' + bestCar.fitness);
    }

    // Spawn alpha clones
    if (this.alphaBrain !== undefined) {
      for (let i = 0; i < ALGORITHM.numAlphaClones; i++) {
        const newCar = new Car(track);
        newCar.brain = new Brain(false);
        newCar.brain.connections = deepCopy(this.alphaBrain.connections);
        this.mutate(newCar.brain);
        spawnList.push(newCar);
      }
    }

    let totalFitness: number = 0;
    for (let i = 0; i < ALGORITHM.amtToSelect; i++)
      totalFitness += sorted[i].fitness;

    for (let i = 0; i < ALGORITHM.amtToSelect; i++) {
      const currentCar = sorted[i];

      const amtToSpawn =
        (currentCar.fitness / totalFitness) * ALGORITHM.amtToBreed;
      for (let j = 0; j < amtToSpawn; j++) {
        const baby = new Car(track);
        baby.brain = new Brain(false);
        baby.brain.connections = deepCopy(currentCar.brain.connections);
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
