import Qs from 'qs';
import Axios, { AxiosInstance } from 'axios';

import { HelixCursor } from './HelixCursor';

export type UnauthedHelix = AxiosInstance;
export type AuthedHelix =
  AxiosInstance & {
    getCursor<TReturnType>(
      endpoint: string,
      transformFunction: (item: any) => TReturnType,
      parameters: object
    ): HelixCursor<TReturnType>
  };

export const unauthedHelix: UnauthedHelix =
  Axios.create({
    baseURL: "https://api.twitch.tv/helix",
    headers: {
    },
    paramsSerializer: function(params) {
      return Qs.stringify(params, {arrayFormat: 'brackets'})
    }
  });

export function authedHelix(oauthToken: string): AuthedHelix {
  const ret: any = Axios.create({
    baseURL: "https://api.twitch.tv/helix",
    headers: {
      "Authorization": `Bearer ${oauthToken}`
    },
    paramsSerializer: function(params) {
      return Qs.stringify(params, {arrayFormat: 'brackets'})
    }
  });

  ret.getCursor =
    <TReturnType>(endpoint: string, transformFunction: (item: any) => TReturnType, parameters: object) =>
      new HelixCursor<TReturnType>(ret, endpoint, transformFunction, parameters);

  return ret;
};
