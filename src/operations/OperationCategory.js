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
    return this._session.helixCall(method, endpoint, options);
  }

  async krakenCall(method, endpoint, options) {
    return this._session.krakenCall(method, endpoint, options);
  }
}
