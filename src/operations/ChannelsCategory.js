import * as _ from 'lodash';
import OperationCategory from './OperationCategory';

export default class ChannelsCategory extends OperationCategory {
  static categoryName = "channels";

  async getChannelById(id) {
    return (await this.krakenCall("get", `/channels/${id}`));
  }

  async updateChannel(id, params) {
    return (await this.krakenCall("put", `/channels/${id}`, { params }));
  }

  getChannelFollowersCursor(id) {
    return this.kraken.getTokenCursor(`/channels/${id}/follows`, ["follows"]);
  }

  async getChannelTeams(id) {
    return (await this.krakenCall("get", `/channels/${id}/teams`)).teams;
  }

  getChannelSubscribersCursor(id) {
    return this.kraken.getTokenCursor(`/channels/${id}/subscriptions`, ["subscriptions"]);
  }

  getChannelVideosCursor(id) {
    return this.kraken.getOffsetCursor(`/channels/${id}/videos`, ["videos"]);
  }

  getChannelCommunitiesCursor(id) {
    return this.kraken.getOffsetCursor(`/channels/${id}/communities`, ["communities"]);
  }

  async setChannelCommunities(id, communityIds) {
    const data = { community_ids: communityIds };
    return (await this.krakenCall("post", `/channels/${id}/communities`), { data });
  }

  async clearChannelCommunities(id) {
    return (await this.krakenCall("delete", `/channels/${id}/communities`));
  }

  async startChannelCommercial(id, length) {
    const data = { length };
    return (await this.krakenCall("post", `/channels/${id}/commercial`), { data });
  }

  searchChannelsCursor(query) {
    return this.kraken.getOffsetCursor("/search/channels", ["channels"], { query });
  }
}
