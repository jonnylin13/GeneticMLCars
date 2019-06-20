export default class TrackLoader {
  static load(path: string): Promise<Array<Array<number>>> {
    return new Promise((resolve, reject) => {
      console.log(path);
      resolve([[]]);
      reject([[]]);
    });
  }
}
