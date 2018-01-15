export default class Cursor {
  constructor(endpoint, parameters) {
    this._endpoint = endpoint;
    this._parameters = parameters;

    this._started = false;
    this._error = null;
    this._total = null;
    this._data = null;
  }

  get started() { return this._started; }
  get error() { return this._error; }
  get total() { return this._total; }
  get data() { return this._data; }

  async next() {
    throw new Error(`${this.constructor.name}.next() must be implemented.`);
  }
}
