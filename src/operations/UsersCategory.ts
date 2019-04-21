import * as _ from 'lodash';

import { OperationCategory } from './OperationCategory';
import { Session } from '../Session';
import { transformTwitchResponse } from '../utils';
import { HelixUser, HelixFollow } from './models';
import { HelixCursor } from '../twitch/HelixCursor';

export class UsersCategory extends OperationCategory {
  constructor(session: Session) {
    super("users", session);
  }

  async getCurrentUser() {
    const resp: any = (await this.helixCall("get", "/users") as any).data[0];
    return transformTwitchResponse<HelixUser>(resp);
  }

  async getUsersById(ids: Array<string>) {
    const params = { id: _.flatten([ids]) };
    const resp = (await this.helixCall("get", "/users", { params }) as any).data;
    const items: Array<HelixUser> = resp.map((i: any) => transformTwitchResponse<HelixUser>(i));
    return _.keyBy(items, (u) => u.id);
  }

  async getUsersByLogin(logins: Array<String>) {
    const params = { login: _.flatten([logins]) };
    const resp = (await this.helixCall("get", "/users", { params }) as any).data;
    const items: Array<HelixUser> = resp.map((i: any) => transformTwitchResponse<HelixUser>(i));
    return _.keyBy(items, (u) => u.login);
  }

  getUserFollowersCursor(followedId: string, limit: number | null = null): HelixCursor<HelixFollow> {
    return this.helix.getCursor(
      "/users/follows",
      i => transformTwitchResponse<HelixFollow>(i),
      { first: limit, to_id: followedId }
    );
  }

  getUsersFollowedCursor(followerId: string, limit: number | null = null) {
    return this.helix.getCursor(
      "/users/follows",
      i => transformTwitchResponse<HelixFollow>(i),
      { first: limit, from_id: followerId }
    );
  }
}
