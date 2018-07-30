import Bunyan from "bunyan";
import * as _ from 'lodash';
import { EventEmitter2 } from 'eventemitter2';

import { authedKraken } from '../twitch/kraken';
import { BetterTwitchOptions } from "../options";

export abstract class BaseAuth extends EventEmitter2 {
  readonly logger: Bunyan;
  protected _accessToken: string | null = null;

  constructor(baseLogger: Bunyan) {
    super();

    this.logger = baseLogger.child({ twitchBetterApi: 'auth' });
  }

  get initialized(): boolean { return !!this._accessToken; }
  get accessToken(): string {
    // HACK: clean this up eventually (legacy of ES6 origins)
    const ret = this._accessToken;
    if (!ret) {
      throw new Error("No access token configured in the auth system.");
    }

    return ret;
  }

  async initialize(options: BetterTwitchOptions) {
    this._accessToken = await this.doInitialize(options);
    this.emit("initialize");

    return this;
  }

  abstract async doInitialize(_options: BetterTwitchOptions): Promise<string | null>;

  async refresh(options: any) {
    this._accessToken = await this.doRefresh(options);
    this.emit("refresh");

    return this;
  }

  abstract async doRefresh(options: BetterTwitchOptions): Promise<string | null>;

  async validate() {
    try {
      const kraken = authedKraken(this.accessToken);
      const _resp = await kraken.get("/");

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
