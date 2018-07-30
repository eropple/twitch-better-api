import * as _ from 'lodash';

import { OperationCategory } from './OperationCategory';
import { Session } from '../Session';
import { GetTopClipsRequest } from './requests';
import { transformTwitchResponse } from '../utils';
import { KrakenTokenCursor } from '../twitch/KrakenTokenCursor';
import { KrakenClip, KrakenClipChannel } from './models';

function clipConvert(item: any): KrakenClip {
  const c = transformTwitchResponse<KrakenClip>(item);
  c.broadcaster = transformTwitchResponse<KrakenClipChannel>(c.broadcaster);
  c.curator = transformTwitchResponse<KrakenClipChannel>(c.curator);

  return c;
}

export default class ClipsCategory extends OperationCategory {
  constructor(session: Session) {
    super("clips", session);
  }

  getTopClipsCursor(req: GetTopClipsRequest): KrakenTokenCursor<KrakenClip> {
    return this.kraken.getTokenCursor(
      "/clips/top",
      ["clips"],
      clipConvert,
      {params: req }
    );
  }

  async getClip(slug: string): Promise<KrakenClip> {
    const resp: any = await this.krakenCall("get", `/clips/${slug}`);
    return clipConvert(resp);
  }
}
