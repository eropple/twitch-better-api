import * as _ from 'lodash';
import OperationCategory from './OperationCategory';

export default class UsersCategory extends OperationCategory {
  static categoryName = "users";

  async getCurrentUser() {
    return (await this.helixCall("get", "/users")).data[0];
  }

  async getUsersById(ids) {
    ids = _.flatten([ids]);
    return _.keyBy(
      (await this.helixCall("get", "/users", { params: { id: ids } })).data,
      "id"
    )
  }

  async getUsersByLogin(logins) {
    logins = _.flatten([logins]);
    return _.keyBy(
      (await this.helixCall("get", "/users", { params: { login: logins } })).data,
      "name"
    );
  }

  getUserFollowersCursor(followedId) {
    return this.helix.getCursor("/follows", { to_id: followedId });
  }

  getUsersFollowedCursor(followerId) {
    return this.helix.getCursor("/follows", { from_id: followerId });
  }
}
