import Qs from 'qs';
import Axios, { AxiosInstance } from 'axios';

import { HelixCursor } from './HelixCursor';

export type UnauthedHelix = AxiosInstance;
export type AuthedHelix =
  AxiosInstance & { getCursor(endpoint: string, parameters: object): HelixCursor };

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

  ret.getCursor = (endpoint: string, parameters: object) => new HelixCursor(ret, endpoint, parameters);

  return ret;
};
