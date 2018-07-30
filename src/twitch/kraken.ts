import Axios, { AxiosInstance } from 'axios';

import { KrakenOffsetCursor } from './KrakenOffsetCursor';
import { KrakenTokenCursor } from './KrakenTokenCursor';

export type UnauthedKraken = AxiosInstance;
export type AuthedKraken =
  AxiosInstance & {
    getOffsetCursor(endpoint: string, digPath: ReadonlyArray<string>, parameters?: object): KrakenOffsetCursor;
    getTokenCursor(endpoint: string, digPath: ReadonlyArray<string>, parameters?: object): KrakenTokenCursor;
  }

export const unauthedKraken: UnauthedKraken =
  Axios.create({
    baseURL: "https://api.twitch.tv/kraken",
    headers: {
      "Accept": "application/vnd.twitchtv.v5+json"
    }
  });

export function authedKraken(oauthToken: string): AuthedKraken {
  const ret = Axios.create({
    baseURL: "https://api.twitch.tv/kraken",
    headers: {
      "Accept": "application/vnd.twitchtv.v5+json",
      "Authorization": `OAuth ${oauthToken}`
    }
  }) as any;

  ret.getOffsetCursor = (endpoint: string, digPath: ReadonlyArray<string>, parameters?: object) =>
    new KrakenOffsetCursor(ret, endpoint, digPath, parameters || {});
  ret.getTokenCursor = (endpoint: string, digPath: ReadonlyArray<string>, parameters?: object) =>
    new KrakenTokenCursor(ret, endpoint, digPath, parameters || {});

  return ret;
};
