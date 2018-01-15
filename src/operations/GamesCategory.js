import * as _ from 'lodash';
import OperationCategory from './OperationCategory';

export default class GamesCategory extends OperationCategory {
  static categoryName = "games";

  async getGamesById(ids) {
    ids = _.flatten([ids]);
    return _.keyBy(
      (await this.helixCall("get", "/games", { params: { id: ids } })).data,
      "id"
    );
  }

  async getGamesByName(names) {
    names = _.flatten([names]);
    return _.keyBy(
      (await this.helixCall("get", "/games", { params: { name: names } })).data,
      "name"
    );
  }

  getTopGamesCursor() {
    return this.helix.getCursor("/games/top");
  }
}
