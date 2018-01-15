import OperationCategory from './OperationCategory';

export default class StreamsCategory extends OperationCategory {
  static categoryName = "streams";

  getStreamsCursor(params) {
    return this.helix.getCursor("/streams", params);
  }
}
