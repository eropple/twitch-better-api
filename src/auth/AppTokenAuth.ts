import Bunyan from "bunyan";
import * as _ from 'lodash';
import Qs from 'qs';

import { BaseAuth } from './BaseAuth';
import { unauthedKraken } from '../twitch/kraken';
import { BetterTwitchOptions } from "../options";

const { complement } = require("set-manipulator");

export class AppTokenAuth extends BaseAuth {
  private _refreshCanceller: NodeJS.Timer | null = null;

  constructor(
    private readonly _oauthClientId: string,
    private readonly _oauthClientSecret: string,
    logger: Bunyan
  ) {
    super(logger.child({ type: "appToken "}));
  }

  async doInitialize(options: BetterTwitchOptions): Promise<string | null> {
    return this._acquireToken(options.scopes);
  }

  async doRefresh(options: BetterTwitchOptions): Promise<string | null> {
    return this._acquireToken(options.scopes);
  }

  private async _acquireToken(scopes: ReadonlyArray<string> = []): Promise<string | null> {
    const p = {
      client_id: this._oauthClientId,
      client_secret: this._oauthClientSecret,
      grant_type: "client_credentials",
      scope: scopes.join(" ")
    };

    try {
      const resp = await unauthedKraken.post("/oauth2/token", Qs.stringify(p));

      const askedScopes = new Set(scopes);
      const returnedScopes = new Set(resp.data.scope);
      const missingScopes = complement(askedScopes, returnedScopes) as Array<string>;
      if (missingScopes.length > 0) {
        throw new Error(`Missing scopes in returned token: ${missingScopes.join(" ")}`);
      }

      const expiresInSeconds = resp.data.expires_in;
      const timeoutSeconds = (expiresInSeconds - 480);

      this.logger.info(`New token acquired with scopes: '${scopes.join(" ")}'`);

      if (this._refreshCanceller) {
        clearTimeout(this._refreshCanceller);
        this._refreshCanceller = null;
      }

      this._refreshCanceller = setTimeout(() => {
        this._acquireToken(scopes);
      }, 60 * 60 * 1000)

      this.logger.info(`Set refresh timeout for ${timeoutSeconds} secs.`);
      return resp.data.access_token;

    } catch (err) {
      this.logger.error(
        { error: _.get(err, ["response", "data"]) },
        "Error when acquiring token."
      );

      this._accessToken = null;
      return null;
    }
  }
}
