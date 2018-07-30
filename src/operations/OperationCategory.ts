import Bunyan from "bunyan";
import * as _ from 'lodash';

import { Session } from '../Session';

export class OperationCategory {
  readonly logger: Bunyan;

  constructor(readonly name: string, private readonly session: Session) {
    this.logger = session.logger.child({ category: this.name });
  }

  get kraken() { return this.session.kraken; }
  get helix() { return this.session.helix; }

  async helixCall(method: string, endpoint: string, parameters: object | null = null) {
    return this.session.helixCall(method, endpoint, parameters);
  }

  async krakenCall(method: string, endpoint: string, parameters: object | null = null) {
    return this.session.krakenCall(method, endpoint, parameters);
  }
}
