import { authedHelix } from './helix';
import { authedKraken } from './kraken';

export default function(oauthToken) {
  return {
    helix: authedHelix(oauthToken),
    kraken: authedKraken(oauthToken)
  };
}
