import * as _ from 'lodash';
import Joi from 'joi';
import deepFreeze from 'deep-freeze-es6';

import { authedKraken } from './twitch/kraken';
import { authedHelix } from './twitch/helix';

import { CATEGORIES } from './operations';
import { OPTIONS_VALIDATOR, DEFAULT_OPTIONS } from './options';

export default class Session {
  constructor(auth, logger, options) {
    this._auth = auth;
    this._options = deepFreeze(_.merge({}, DEFAULT_OPTIONS, options));

    this._logger = logger.child({ twitchBetterApi: 'session' });
    Joi.assert(this._options, OPTIONS_VALIDATOR, "Invalid options provided.");

    this._categories = Object.freeze(CATEGORIES.map((op) => new op(this)));

    this._categories.forEach((cat) => {
      Object.defineProperty(this, cat.name, {
        value: cat,
        writable: false
      });
    });
  }

  get auth() { return this._auth; }
  get logger() { return this._logger; }
  get options() { return this._options; }
  get categories() { return this._categories; }

  get kraken() { return authedKraken(this.auth.accessToken); }
  get helix() { return authedHelix(this.auth.accessToken); }

  async helixCall(method, endpoint, options) {
    const fullOptions = _.merge({}, { method, url: endpoint }, options);

    try {
      this.logger.debug({ options: fullOptions });
      const resp = await this.helix(_.merge({}, { method, url: endpoint }, options));
      return resp.data;
    } catch (err) {
      const {response} = err;
      this.logger.error({ response, options: fullOptions });
      throw err;
    }
  }

  async krakenCall(method, endpoint, options) {
    const fullOptions = _.merge({}, { method, url: endpoint }, options);

    try {
      this.logger.debug({ options: fullOptions });
      const resp = await this.kraken(_.merge({}, { method, url: endpoint }, options));
      return resp.data;
    } catch (err) {
      const {response} = err;
      this.logger.error({ response, options: fullOptions });
      throw err;
    }
  }
}
