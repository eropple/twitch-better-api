import Bunyan from "bunyan";
import * as _ from 'lodash';
import Joi from 'joi';

import { authedKraken, AuthedKraken } from './twitch/kraken';
import { authedHelix, AuthedHelix } from './twitch/helix';

import { OPTIONS_VALIDATOR, DEFAULT_OPTIONS, BetterTwitchOptions } from './options';
import { BaseAuth } from './auth/BaseAuth';
import { ChannelsCategory } from "./operations/ChannelsCategory";
import ClipsCategory from "./operations/ClipsCategory";
import GamesCategory from "./operations/GamesCategory";
import { StreamsCategory } from "./operations/StreamsCategory";
import { UsersCategory } from "./operations/UsersCategory";
import { VideosCategory } from "./operations/VideosCategory";

export class Session {
  readonly logger: Bunyan;

  readonly channels: ChannelsCategory;
  readonly clips: ClipsCategory;
  readonly games: GamesCategory;
  readonly streams: StreamsCategory;
  readonly users: UsersCategory;
  readonly videos: VideosCategory;

  constructor(
    readonly auth: BaseAuth,
    logger: Bunyan,
    readonly options: BetterTwitchOptions
  ) {

    this.logger = logger.child({ twitchBetterApi: 'session' });
    Joi.assert(this.options, OPTIONS_VALIDATOR, "Invalid options provided.");

    this.channels = new ChannelsCategory(this);
    this.clips = new ClipsCategory(this);
    this.games = new GamesCategory(this);
    this.streams = new StreamsCategory(this);
    this.users = new UsersCategory(this);
    this.videos = new VideosCategory(this);
  }

  get kraken(): AuthedKraken { return authedKraken(this.auth.accessToken); }
  get helix(): AuthedHelix { return authedHelix(this.auth.accessToken); }

  async helixCall<T>(method: string, endpoint: string, options: object | null) {
    const fullOptions = _.merge({}, { method, url: endpoint }, options);

    try {
      this.logger.debug({ options: fullOptions });
      const resp = await this.helix.request(_.merge({}, { method, url: endpoint }, options));
      return resp.data as T;
    } catch (err) {
      const {response} = err;
      this.logger.error({ response, options: fullOptions });
      throw err;
    }
  }

  async krakenCall<T>(method: string, endpoint: string, options: object | null) {
    const fullOptions = _.merge({}, { method, url: endpoint }, options);

    try {
      this.logger.debug({ options: fullOptions });
      const resp = await this.kraken.request(_.merge({}, { method, url: endpoint }, options));
      return resp.data as T;
    } catch (err) {
      const {response} = err;
      this.logger.error({ response, options: fullOptions });
      throw err;
    }
  }

  static build(auth: BaseAuth, logger: Bunyan, options: BetterTwitchOptions): Session {
    return new Session(auth, logger, _.merge({}, DEFAULT_OPTIONS, options));
  }
}
