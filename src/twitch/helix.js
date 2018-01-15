import Qs from 'qs';
import Axios from 'axios';

import HelixCursor from './HelixCursor';

export const unauthedHelix =
  Axios.create({
    baseURL: "https://api.twitch.tv/helix",
    headers: {
    },
    paramsSerializer: function(params) {
      return Qs.stringify(params, {arrayFormat: 'brackets'})
    }
  });

export function authedHelix(oauthToken) {
  const ret = Axios.create({
    baseURL: "https://api.twitch.tv/helix",
    headers: {
      "Authorization": `Bearer ${oauthToken}`
    },
    paramsSerializer: function(params) {
      return Qs.stringify(params, {arrayFormat: 'brackets'})
    }
  });

  ret.getCursor = (endpoint, parameters) => new HelixCursor(ret, endpoint, parameters);

  return ret;
};
