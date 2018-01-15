import Axios from 'axios';

export const unauthedKraken =
  Axios.create({
    baseURL: "https://api.twitch.tv/kraken",
    headers: {
      "Accept": "application/vnd.twitchtv.v5+json"
    }
  });

export function authedKraken(oauthToken) {
  return Axios.create({
    baseURL: "https://api.twitch.tv/kraken",
    headers: {
      "Accept": "application/vnd.twitchtv.v5+json",
      "Authorization": `OAuth ${oauthToken}`
    }
  })
};
