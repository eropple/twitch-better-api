import * as _ from 'lodash';

import { Cursor } from './Cursor';
import { AuthedKraken } from './kraken';

export class KrakenTokenCursor extends Cursor {
  protected _cursor: string | null = null;

  constructor(
    protected readonly _kraken: AuthedKraken,
    endpoint: string,
    protected readonly _digPath: ReadonlyArray<string>,
    parameters: object
  ) {
    super(endpoint, _.merge({}, { limit: 25 }, parameters));
  }

  async next() {
    if (this._error) {
      throw this._error;
    }

    const params: any = _.merge({}, this._parameters);

    if (this._started) {
      // a null offset, after starting, means that we've run out of values.
      if (this._cursor) {
        params.cursor = this._cursor;
      } else {
        return null;
      }
    }

    this._started = true;

    try {
      const resp = await this._kraken.get(this._endpoint, { params });
      const {data} = resp;

      this._cursor = data._cursor;
      this._total = data.total;
      this._data = _.get(data, this._digPath);

      return this._data;
    } catch (err) {
      this._error = err;
      throw err;
    }
  }
}
