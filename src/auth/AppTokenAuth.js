import * as _ from 'lodash';
import Qs from 'qs';
import { complement } from 'set-manipulator';

import BaseAuth from './BaseAuth';
import { unauthedKraken } from '../twitch/kraken';


export default class AppTokenAuth extends BaseAuth {
  constructor(oauthClientId, oauthClientSecret, logger) {
    super(logger);
    this._logger = this.logger.child({ type: 'appToken' });

    this._oauthClientId = oauthClientId;
    this._oauthClientSecret = oauthClientSecret;
    this._refreshCanceller = null;

    this._acquireToken = this._acquireToken.bind(this);
  }

  async doInitialize(options) {
    await this._acquireToken(options.scopes);
  }

  async doRefresh(options) {
    await this._acquireToken(options.scopes);
  }

  async _acquireToken(scopes) {
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
      const missingScopes = complement(askedScopes, returnedScopes);
      if (missingScopes.length > 0) {
        throw new Error(`Missing scopes in returned token: ${missingScopes.join(" ")}`);
      }

      this._accessToken = resp.data.access_token;

      const expiresInSeconds = resp.data.expires_in;
      const timeoutSeconds = (expiresInSeconds - 480);

      this.logger.info(`New token acquired with scopes: '${scopes.join(" ")}'`);

      if (this._refreshCanceller) {
        clearTimeout(this._refreshCanceller);
        this._refreshCanceller = null;
      }

      this._refreshCanceller = setTimeout(() => {
        this._acquireToken(scopes);
      })

      this.logger.info(`Set refresh timeout for ${timeoutSeconds} secs.`);
    } catch (err) {
      this.logger.error(
        { error: _.get(err, ["response", "data"]) },
        "Error when acquiring token."
      );

      this._accessToken = null;
    }
  }
}
