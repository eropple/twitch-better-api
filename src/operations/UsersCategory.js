import * as _ from 'lodash';
import OperationCategory from './OperationCategory';

export default class UsersCategory extends OperationCategory {
  static categoryName = "users";

  async getCurrentUser() {
    return (await this.helixCall("get", "/users")).data[0];
  }

  async getUsersById(ids) {
    ids = _.flatten([ids]);
    const resp = (await this.helixCall("get", "/users", { params: { id: ids } }));
    return _.keyBy(resp.data, (u) => u.id)
  }

  async getUsersByLogin(logins) {
    logins = _.flatten([logins]);
    const resp = (await this.helixCall("get", "/users", { params: { login: logins } }));
    return _.keyBy(resp.data, (u) => u.login);
  }

  getUserFollowersCursor(followedId, limit = null) {
    return this.helix.getCursor("/users/follows", { first: limit, to_id: followedId });
  }

  getUsersFollowedCursor(followerId, limit = null) {
    return this.helix.getCursor("/users/follows", { first: limit, from_id: followerId });
  }
}
