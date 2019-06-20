export default class TrackLoader {
  static load(path: string): Promise<Array<Array<number>>> {
    return new Promise(resolve => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', path, true);
      xhr.send();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) resolve(JSON.parse(xhr.responseText));
      };
    });
  }
}
