import { layer } from '../types/nn';

export default class Brain {
  // Based on Brain.js

  // Nodes per layer
  topology: Array<number> = [5, 2];

  // Array of 2d arrays
  // For multiple hidden layers
  connections: Array<layer> = [];

  constructor(random: boolean = true) {
    this.initWeights(random);
  }

  initWeights(random: boolean) {
    let previousLayer: number = this.topology[0];

    // For each hidden layer
    for (let i = 1; i < this.topology.length; i++) {
      let currentLayer: number = this.topology[i];
      let layer: layer = [];
      for (let j = 0; j < currentLayer; j++) {
        // All the connections to a single node
        let connections: Array<number> = [];

        for (let k = 0; k < previousLayer; k++) {
          // Each connection from the previous layer gets a random weight
          let val: number = 0;
          if (random) val = Math.random() - Math.random();
          connections.push(val);
        }
        layer.push(connections);
      }
      this.connections.push(layer);
      previousLayer = currentLayer;
    }
  }

  process(inputValues: Array<number>): Array<number> {
    let output: Array<number> = [];

    for (let i in this.connections) {
      let currentLayer: layer = this.connections[i];
      let outputValues: Array<number> = [];
      for (let j in currentLayer) {
        let sum: number = 0;
        for (let k in inputValues) {
          sum += inputValues[k] * currentLayer[j][k];
        }
        outputValues.push(sum);
        if (parseInt(i) == this.connections.length - 1) {
          output.push(sum);
        }
      }
      // The output of the previous layer is the input to the next
      inputValues = outputValues;
    }
    return output;
  }
}
