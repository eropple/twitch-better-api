import { OperationCategory } from './OperationCategory';
import { Session } from '../Session';
import { GetStreamsRequest } from './requests';
import { HelixCursor } from '../twitch/HelixCursor';
import { transformTwitchResponse } from '../utils';
import { HelixStream } from './models';

export class StreamsCategory extends OperationCategory {
  constructor(session: Session) {
    super("stream", session);
  }

  getStreamsCursor(req: GetStreamsRequest): HelixCursor<HelixStream> {
    const { communityId, gameId, language, userId, userLogin } = req;

    const params = {
      community_id: communityId,
      game_id: gameId,
      language,
      user_id: userId,
      user_login: userLogin
    };

    return this.helix.getCursor(
      "/streams",
      i => transformTwitchResponse<HelixStream>(i),
      params);
  }
}
