import * as _ from 'lodash';

import { OperationCategory } from './OperationCategory';
import { Session } from '../Session';

export class VideosCategory extends OperationCategory {
  constructor(session: Session) {
    super("videos", session);
  }

  async getVideosById(ids) {
    ids = _.flatten([ids]);
    return _.keyBy(
      (await this.helixCall("get", "/videos", { params: { id: ids } })).data,
      "id"
    )
  }

  getVideosForUser(userId) {
    return this.helix.getCursor("/videos", { user_id: userId });
  }

  getVideosForGame(gameId) {
    return this.helix.getCursor("/videos", { game_id: gameId });
  }
}
