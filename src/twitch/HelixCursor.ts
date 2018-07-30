import * as _ from 'lodash';

import { Cursor } from './Cursor';
import { AuthedHelix } from './helix';

export class HelixCursor extends Cursor {
  private _cursor: string | null = null;

  constructor(
    protected readonly _helix: AuthedHelix,
    endpoint: string,
    parameters: object
  ) {
    super(endpoint, parameters);
  }

  async next() {
    if (this._error) {
      throw this._error;
    }

    const params: any = _.merge({}, this._parameters);
    params.first = params.first || 25;

    if (this._started) {
      // a null offset, after starting, means that we've run out of values.
      if (this._cursor) {
        params.after = this._cursor;
      } else {
        return null;
      }
    }

    this._started = true;

    try {
      const resp = await this._helix.get(this._endpoint, { params });
      const {data} = resp;

      this._total = data.total;
      this._data = data.data || [];
      // HACK: still not typesafe
      if (this._data!.length === 0) {
        this._cursor = null;
      }
      this._cursor = _.get(data, ["pagination", "cursor"]);

      return this._data;
    } catch (err) {
      this._error = err;
      throw err;
    }
  }
}
