import Axios, { AxiosInstance } from 'axios';

import { KrakenOffsetCursor } from './KrakenOffsetCursor';
import { KrakenTokenCursor } from './KrakenTokenCursor';

export type UnauthedKraken = AxiosInstance;
export type AuthedKraken =
  AxiosInstance & {
    getOffsetCursor<TReturnType>(
      endpoint: string,
      digPath: ReadonlyArray<string>,
      transformFunction: (item: any) => TReturnType,
      parameters?: object
    ): KrakenOffsetCursor<TReturnType>;

    getTokenCursor<TReturnType>(
      endpoint: string,
      digPath: ReadonlyArray<string>,
      transformFunction: (item: any) => TReturnType,
      parameters?: object
    ): KrakenTokenCursor<TReturnType>;
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

  ret.getOffsetCursor =
    <TReturnType>(
      endpoint: string,
      digPath: ReadonlyArray<string>,
      transformFunction: (item: any) => TReturnType,
      parameters?: object
    ) => new KrakenOffsetCursor<TReturnType>(ret, endpoint, digPath, transformFunction, parameters || {});
  ret.getTokenCursor =
    <TReturnType>(
      endpoint: string,
      digPath: ReadonlyArray<string>,
      transformFunction: (item: any) => TReturnType,
      parameters?: object
    ) => new KrakenTokenCursor<TReturnType>(ret, endpoint, digPath, transformFunction, parameters || {});

  return ret;
};
