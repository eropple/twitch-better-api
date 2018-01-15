import * as _ from 'lodash';
import OperationCategory from './OperationCategory';

export default class VideosCategory extends OperationCategory {
  static categoryName = "videos";

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
