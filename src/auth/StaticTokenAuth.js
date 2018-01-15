import BaseAuth from './BaseAuth';

export default class StaticTokenAuth extends BaseAuth {
  constructor(token, logger) {
    super(logger);
    this._logger = this.logger.child({ type: 'static' });
    this._accessToken = token;
  }

  async doInitialize(_options) {
    this.logger.debug("Initialize no-op for StaticTokenAuth.");
  }

  async doRefresh(_options) {
    this.logger.debug("Refresh no-op for StaticTokenAuth.");
  }
}
