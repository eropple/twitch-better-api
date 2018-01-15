import * as _ from 'lodash';

import { default as twitchApi } from '../twitch';

export default class OperationCategory {
  constructor(session) {
    this._session = session;

    this._logger = session.logger.child({ category: this.name });
  }

  get name() { return this.constructor.categoryName; }
  get logger() { return this._logger; }
  get twitch() { return twitchApi(this._session.auth.accessToken); }

  async helixCall(method, endpoint, options) {
    const fullOptions = _.merge({}, { method, url: endpoint }, options);

    try {
      this.logger.debug({ options: fullOptions });
      const resp = await this.twitch.helix(_.merge({}, { method, url: endpoint }, options));
      return resp.data;
    } catch (err) {
      const {response} = err;
      this.logger.error({ response, options: fullOptions });
      throw err;
    }
  }
}
