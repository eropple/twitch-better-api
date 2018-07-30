import * as _ from 'lodash';
import Joi from 'joi';
import Axios from 'axios';

import { OperationCategory } from './OperationCategory';
import { Session } from '../Session';
import { BoxArtDimensions } from '../types';
import { transformTwitchResponse } from '../utils';
import { HelixGame, MapOf, KrakenGameSearchResult } from './models';
import { HelixCursor } from '../twitch/HelixCursor';

export default class GamesCategory extends OperationCategory {
  constructor(session: Session) {
    super("games", session);
  }

  async getGamesById(ids: Array<string>): Promise<MapOf<HelixGame>> {
    ids = _.flatten([ids]);

    const params = { id: ids };

    const resp: any = await this.helixCall("get", "/games", { params });
    const items: Array<HelixGame> = resp.data.map((i: any) => transformTwitchResponse<HelixGame>(i));

    return _.keyBy(items, "id");
  }

  async getGamesByName(names: Array<string>): Promise<MapOf<HelixGame>> {
    names = _.flatten([names]);

    const params = { name: names };
    const resp: any = await this.helixCall("get", "/games", { params });
    const items: Array<HelixGame> = resp.data.map((i: any) => transformTwitchResponse<HelixGame>(i));

    return _.keyBy(items, "name");
  }

  getTopGamesCursor(): HelixCursor<HelixGame> {
    return this.helix.getCursor(
      "/games/top",
      i => transformTwitchResponse<HelixGame>(i),
      {});
  }

  async searchGames(query: string, live: boolean = false) {
    const params = { query, live };
    const resp: any[] = (await this.krakenCall("get", "/search/games", { params }) as any).games;
    return resp.map(i => transformTwitchResponse<KrakenGameSearchResult>(i));
  }
}

const GET_BOX_ART_BY_ID_VALIDATOR =
  Joi.object().keys({
    width: Joi.number().integer(),
    height: Joi.number().integer()
  }).xor('width', 'height');
