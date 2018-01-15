import OperationCategory from './OperationCategory';

export default class StreamsCategory extends OperationCategory {
  static categoryName = "streams";

  getStreamsCursor(params) {
    return this.twitch.helix.getCursor("/streams", params);
  }
}
