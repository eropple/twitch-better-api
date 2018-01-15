import * as _ from 'lodash';
import OperationCategory from './OperationCategory';

export default class ClipsCategory extends OperationCategory {
  static categoryName = "clips";

  getTopClipsCursor() {
    return this.kraken.getTokenCursor("/clips/top", ["clips"]);
  }
}
