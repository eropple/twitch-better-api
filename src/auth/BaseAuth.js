import * as _ from 'lodash';
import EventEmitter2 from 'eventemitter2';

import twitch from '../twitch';

export default class BaseAuth extends EventEmitter2 {
  constructor(logger) {
    super();

    this._logger = logger.child({ twitchBetterApi: 'auth' });

    this.initialize = this.initialize.bind(this);
  }

  get logger() { return this._logger; }
  get initialized() { return !!this._accessToken; }
  get accessToken() {
    const ret = this._accessToken;

    if (typeof(ret) !== 'string') {
      throw new Error("Invalid access token; badly configured auth.");
    }

    return ret;
  }

  async initialize(options) {
    await this.doInitialize(options);
    this.emit("initialize");

    return this;
  }

  async doInitialize(_options) {
    throw new Error(`${this.constructor.name}#doInitialize(options) must be implemented.`);
  }

  async refresh(options) {
    this.doRefresh(options);
    this.emit("refresh");

    return this;
  }

  async doRefresh(_options) {
    throw new Error(`${this.constructor.name}#doRefresh(options) must be implemented.`);
  }

  async validate() {
    try {
      const api = twitch(this.accessToken);
      const _resp = await api.kraken.get("/");

      const expiresIn = _resp.data.token.expires_in;
      this.logger.info(`OAuth token validated; expires in ${expiresIn}s.`);

      return true;
    } catch (err) {
      this.logger.warn(
        { error: _.get(err, ["response", "data"]) },
        "Error when validating with Twitch."
      );
      return false;
    }
  }
}
