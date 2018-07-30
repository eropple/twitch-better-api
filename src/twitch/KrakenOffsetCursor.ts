import * as _ from 'lodash';

import { Cursor } from './Cursor';
import { AuthedKraken } from './kraken';

export class KrakenOffsetCursor extends Cursor {
  private _offset: number | null = null;

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
      if (this._offset) {
        params.offset = this._offset;
      } else {
        return null;
      }
    }

    this._started = true;

    try {
      const resp = await this._kraken.get(this._endpoint, { params });
      const {data} = resp;

      this._offset = (this._offset || 0) + params.limit;

      if (data._total) {
        this._total = data._total;
      }

      this._data = _.get(data, this._digPath) || [];
      // HACK: this is not really typesafe
      if (this._data!.length === 0) {
        this._offset = null;
      }

      return this._data;
    } catch (err) {
      this._error = err;
      throw err;
    }
  }
}
