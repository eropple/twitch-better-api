import * as _ from 'lodash';

export default class OperationCategory {
  constructor(session) {
    this._session = session;

    this._logger = session.logger.child({ category: this.name });
  }

  get name() { return this.constructor.categoryName; }
  get logger() { return this._logger; }

  get kraken() { return this._session.kraken; }
  get helix() { return this._session.helix; }

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
