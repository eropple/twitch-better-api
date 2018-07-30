import { authedHelix } from './helix';
import { authedKraken } from './kraken';

export default function(oauthToken: string) {
  return {
    helix: authedHelix(oauthToken),
    kraken: authedKraken(oauthToken)
  };
}
