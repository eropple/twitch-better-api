import Axios from 'axios';

import KrakenOffsetCursor from './KrakenOffsetCursor';
import KrakenTokenCursor from './KrakenTokenCursor';

export const unauthedKraken =
  Axios.create({
    baseURL: "https://api.twitch.tv/kraken",
    headers: {
      "Accept": "application/vnd.twitchtv.v5+json"
    }
  });

export function authedKraken(oauthToken) {
  const ret = Axios.create({
    baseURL: "https://api.twitch.tv/kraken",
    headers: {
      "Accept": "application/vnd.twitchtv.v5+json",
      "Authorization": `OAuth ${oauthToken}`
    }
  });

  ret.getOffsetCursor = (endpoint, digPath, parameters) =>
    new KrakenOffsetCursor(ret, endpoint, digPath, parameters);
  ret.getTokenCursor = (endpoint, digPath, parameters) =>
    new KrakenTokenCursor(ret, endpoint, digPath, parameters);

  return ret;
};
