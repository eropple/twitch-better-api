import * as _ from 'lodash';

export default class HelixCursor {
  constructor(helix, endpoint, parameters) {
    this._helix = helix;
    this._endpoint = endpoint;
    this._parameters = parameters;

    this._started = false;
    this._data = null;
    this._cursor = null;
  }

  get started() { return this._started; }
  get data() { return this._data; }

  async next() {
    const params = _.merge({}, this._parameters);

    if (this._started) {
      if (this._cursor) {
        params.after = this._cursor;
      } else {
        return null;
      }
    }

    this._started = true;

    const resp = await this._helix.get(this._endpoint, { params });
    const {data} = resp;

    this._data = _.get(data, ["data"]);
    this._cursor = _.get(data, ["pagination", "cursor"]);

    return this._data;
  }
}
