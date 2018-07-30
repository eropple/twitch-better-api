import * as _ from 'lodash';
import Joi from 'joi';
import Axios from 'axios';

import { OperationCategory } from './OperationCategory';
import { Session } from '../Session';
import { BoxArtDimensions } from '../types';

export default class GamesCategory extends OperationCategory {
  constructor(session: Session) {
    super("games", session);
  }

  async getGamesById(ids: Array<string>) {
    ids = _.flatten([ids]);

    const params = { id: ids };
    return _.keyBy(
      (await this.helixCall("get", "/games", { params })).data,
      "id"
    );
  }

  async getGamesByName(names: Array<string>) {
    names = _.flatten([names]);

    const params = { name: names };
    return _.keyBy(
      (await this.helixCall("get", "/games", { params })).data,
      "name"
    );
  }

  getTopGamesCursor() {
    return this.helix.getCursor("/games/top");
  }

  async getBoxArtById(ids: Array<string>, dimension: BoxArtDimensions = { height: 800 }) {
    Joi.assert(
      dimension,
      GET_BOX_ART_BY_ID_VALIDATOR,
      "This call only takes a width OR a height (the other is calculated)."
    );

    if (dimension.width) {
      dimension.height = Math.ceil(dimension.width * (1 + 1/3));
    } else {
      dimension.width = Math.ceil(dimension.height! * 0.75);
    }

    ids = _.flatten([ids]);
    const games = Object.values(await this.getGamesById(ids));

    const promises = games.map(async (game) => {
      const boxArtUrl =
        game.box_art_url.replace("{width}", dimension.width)
                        .replace("{height}", dimension.height);

      const imageResp = await Axios.get(boxArtUrl, {
        // TODO: browser support probably will require some massaging here
        responseType: 'arraybuffer',
        maxContentLength: 25 * 1024 * 1024
      });

      const image = imageResp.request.path.includes("404_boxart") ? null : imageResp.data;

      return [game.id, image];
    });

    return _.fromPairs(await Promise.all(promises));
  }

  async searchGames(query: string, live: boolean = false) {
    const params = { query, live };
    return (await this.krakenCall("get", `/search/games?query=${encodeURIComponent(query)}`, { params })).games;
  }
}

const GET_BOX_ART_BY_ID_VALIDATOR =
  Joi.object().keys({
    width: Joi.number().integer(),
    height: Joi.number().integer()
  }).xor('width', 'height');