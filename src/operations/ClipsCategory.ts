import * as _ from 'lodash';

import { OperationCategory } from './OperationCategory';
import { Session } from '../Session';

export default class ClipsCategory extends OperationCategory {
  constructor(session: Session) {
    super("clips", session);
  }

  getTopClipsCursor() {
    return this.kraken.getTokenCursor("/clips/top", ["clips"]);
  }
}
