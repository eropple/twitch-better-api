import * as _ from 'lodash';
import OperationCategory from './OperationCategory';

export default class ChannelsCategory extends OperationCategory {
  static categoryName = "channels";

  searchChannelsCursor(query) {
    return this.kraken.getOffsetCursor("/search/channels", ["channels"], { query });
  }
}
