import { OperationCategory } from './OperationCategory';
import { Session } from '../Session';

export class StreamsCategory extends OperationCategory {
  constructor(session: Session) {
    super("stream", session);
  }

  getStreamsCursor(params) {
    return this.helix.getCursor("/streams", params);
  }
}
