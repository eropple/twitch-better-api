import * as _ from 'lodash';

import { OperationCategory } from './OperationCategory';
import { Session } from '../Session';
import { GetVideosRequest } from './requests';
import { transformTwitchResponse } from '../utils';
import { HelixVideo } from './models';
import { HelixCursor } from '../twitch/HelixCursor';

export class VideosCategory extends OperationCategory {
  constructor(session: Session) {
    super("videos", session);
  }

  async getVideosById(req: GetVideosRequest): Promise<Array<HelixVideo>> {
    const params = { id: req.id, game_id: req.gameId, user_id: req.userId };

    const resp: any[] = (await this.helixCall("get", "/videos", { params }) as any).data;
    return resp.map(i => transformTwitchResponse<HelixVideo>(i));
  }

  getVideosForUser(userId: string): HelixCursor<HelixVideo> {
    return this.helix.getCursor<HelixVideo>(
      "/videos",
      i => transformTwitchResponse<HelixVideo>(i),
      { user_id: userId }
    );
  }

  getVideosForGame(gameId: string): HelixCursor<HelixVideo> {
    return this.helix.getCursor<HelixVideo>(
      "/videos",
      i => transformTwitchResponse<HelixVideo>(i),
      { game_id: gameId }
    );
  }
}
