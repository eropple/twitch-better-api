import * as _ from 'lodash';

import Cursor from './Cursor';

export default class KrakenOffsetCursor extends Cursor {
  constructor(kraken, endpoint, digPath, parameters) {
    super(endpoint, _.merge({}, { limit: 25 }, parameters));
    this._kraken = kraken;
    this._digPath = digPath;

    this._offset = null;
  }

  async next() {
    if (this._error) {
      throw this._error;
    }

    const params = _.merge({}, this._parameters);

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
      if (this._data.length === 0) {
        this._offset = null;
      }

      return this._data;
    } catch (err) {
      this._error = err;
      throw err;
    }
  }
}
