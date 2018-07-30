import Bunyan from "bunyan";

import { BaseAuth } from './BaseAuth';
import { BetterTwitchOptions } from "../options";

export class StaticTokenAuth extends BaseAuth {
  constructor(token: string, logger: Bunyan) {
    super(logger.child({ type: "static" }));
    this._accessToken = token;
  }

  async doInitialize(_options: BetterTwitchOptions): Promise<string> {
    this.logger.debug("Initialize no-op for StaticTokenAuth.");
    return this.accessToken;
  }

  async doRefresh(_options: BetterTwitchOptions): Promise<string> {
    this.logger.debug("Refresh no-op for StaticTokenAuth.");
    return this.accessToken;
  }
}
