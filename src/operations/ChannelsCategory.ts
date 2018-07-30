import * as _ from 'lodash';

import { OperationCategory } from './OperationCategory';
import { Session } from '../Session';
import { KrakenChannel, KrakenTeam, KrakenCommunity, KrakenChannelFollower, KrakenChannelSubscriber, KrakenVideo, KrakenVideoChannel } from './models';

import { transformTwitchResponse } from '../utils';
import { StartCommercialResponse } from './responses';
import { KrakenTokenCursor } from '../twitch/KrakenTokenCursor';
import { KrakenOffsetCursor } from '../twitch/KrakenOffsetCursor';
import { UpdateChannelRequest } from './requests';

//  TODO: clean...all of this up
//        I started this as a JavaScript library. It shows. This could use
//        a general re-think in order to express this better. Or Twitch
//        could make an API that self-documented and wasn't stupefyingly
//        awful. Y'know--any of these.

export class ChannelsCategory extends OperationCategory {
  constructor(session: Session) {
    super("channels", session);
  }

  async getChannelById(id: string): Promise<KrakenChannel> {
    const ch: any = await this.krakenCall("get", `/channels/${id}`);
    return transformTwitchResponse<KrakenChannel>(ch);
  }

  async updateChannel(id: string, update: UpdateChannelRequest): Promise<KrakenChannel> {
    const { status, game, delay, channelFeedEnabled } = update;

    const ch: any = this.krakenCall(
      "put",
      `/channels/${id}`,
      { params: {
          status,
          game,
          delay,
          channel_feed_enabled: channelFeedEnabled
        }
      }
    );
    return transformTwitchResponse<KrakenChannel>(ch);
  }

  getChannelFollowersCursor(id: string): KrakenTokenCursor<KrakenChannelFollower> {
    return this.kraken.getTokenCursor<KrakenChannelFollower>(
      `/channels/${id}/follows`,
      ["follows"],
      i => {
        const r = transformTwitchResponse<KrakenChannelFollower>(i);
        r.user = transformTwitchResponse<KrakenChannel>(r.user);

        return r;
      }
    );
  }

  async getChannelTeams(id: string): Promise<Array<KrakenTeam>> {
    const teams = (await this.krakenCall("get", `/channels/${id}/teams`) as any).teams;
    return teams.map((t: any) => transformTwitchResponse<KrakenTeam>(t));
  }

  getChannelSubscribersCursor(id: string): KrakenTokenCursor<KrakenChannelSubscriber> {
    return this.kraken.getTokenCursor<KrakenChannelSubscriber>(
      `/channels/${id}/subscriptions`,
      ["subscriptions"],
      i => {
        const s = transformTwitchResponse<KrakenChannelSubscriber>(i);
        s.user = transformTwitchResponse<KrakenChannel>(s.user);

        return s;
      }
    );
  }

  getChannelVideosCursor(id: string): KrakenOffsetCursor<KrakenVideo> {
    return this.kraken.getOffsetCursor<KrakenVideo>(
      `/channels/${id}/videos`,
      ["videos"],
      i => {
        const v = transformTwitchResponse<KrakenVideo>(i);
        v.channel = transformTwitchResponse<KrakenVideoChannel>(v.channel);

        return v;
      }
    );
  }

  async getChannelCommunities(id: string): Promise<KrakenCommunity> {
    const resp = (await this.krakenCall("get", `/channels/${id}/communities`) as any).communities;
    return resp.map((c: any) => transformTwitchResponse<KrakenCommunity>(c));
  }

  async setChannelCommunities(id: string, communityIds: Array<string>): Promise<any> {
    const data = { community_ids: communityIds };
    return this.krakenCall("post", `/channels/${id}/communities`);
  }

  async clearChannelCommunities(id: string): Promise<any> {
    return this.krakenCall("delete", `/channels/${id}/communities`);
  }

  async startChannelCommercial(id: string, length: number): Promise<StartCommercialResponse> {
    const data = { length };
    return this.krakenCall("post", `/channels/${id}/commercial`, data) as Promise<StartCommercialResponse>;
  }

  searchChannelsCursor(query: string): KrakenOffsetCursor<KrakenChannel> {
    return this.kraken.getOffsetCursor(
      "/search/channels",
      ["channels"],
      i => transformTwitchResponse<KrakenChannel>(i),
      { params: query }
    );
  }
}
