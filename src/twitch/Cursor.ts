export abstract class Cursor {
  protected _started: boolean = false;
  protected _error: Error | null = null;
  protected _total: number | null = null;
  protected _data: Array<object> | null = null;

  constructor(
    protected readonly _endpoint: string,
    protected readonly _parameters: object
  ) {
  }

  get started() { return this._started; }
  get error() { return this._error; }
  get total() { return this._total; }
  get data() { return this._data; }

  abstract async next(): Promise<null | Array<object>>;
}
