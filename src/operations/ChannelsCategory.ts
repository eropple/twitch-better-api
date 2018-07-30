import * as _ from 'lodash';
import { OperationCategory } from './OperationCategory';
import { Session } from '../Session';

export class ChannelsCategory extends OperationCategory {
  constructor(session: Session) {
    super("channels", session);
  }

  async getChannelById(id: string) {
    return (await this.krakenCall("get", `/channels/${id}`));
  }

  async updateChannel(id: string, params: object) {
    return (await this.krakenCall("put", `/channels/${id}`, { params }));
  }

  getChannelFollowersCursor(id: string) {
    return this.kraken.getTokenCursor(`/channels/${id}/follows`, ["follows"]);
  }

  async getChannelTeams(id: string) {
    return (await this.krakenCall("get", `/channels/${id}/teams`)).teams;
  }

  getChannelSubscribersCursor(id: string) {
    return this.kraken.getTokenCursor(`/channels/${id}/subscriptions`, ["subscriptions"]);
  }

  getChannelVideosCursor(id: string) {
    return this.kraken.getOffsetCursor(`/channels/${id}/videos`, ["videos"]);
  }

  getChannelCommunitiesCursor(id: string) {
    return this.kraken.getOffsetCursor(`/channels/${id}/communities`, ["communities"]);
  }

  async setChannelCommunities(id: string, communityIds: Array<string>) {
    const data = { community_ids: communityIds };
    return (await this.krakenCall("post", `/channels/${id}/communities`), { data });
  }

  async clearChannelCommunities(id: string) {
    return (await this.krakenCall("delete", `/channels/${id}/communities`));
  }

  async startChannelCommercial(id: string, length: number) {
    const data = { length };
    return (await this.krakenCall("post", `/channels/${id}/commercial`), { data });
  }

  searchChannelsCursor(query: any) {
    return this.kraken.getOffsetCursor("/search/channels", ["channels"], { query });
  }
}
