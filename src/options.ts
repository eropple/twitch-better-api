import * as _ from "lodash";
import Joi from 'joi';

export interface BetterTwitchOptions {
  readonly scopes: ReadonlyArray<string>;
}

export const OPTIONS_VALIDATOR =
  Joi.object().keys({
    scopes: Joi.array().items(Joi.string())
  }).required();

export const DEFAULT_OPTIONS: BetterTwitchOptions = {
  scopes: []
};

export function ensureOptions(opts: Partial<BetterTwitchOptions>): BetterTwitchOptions {
  return _.merge({}, DEFAULT_OPTIONS, opts);
}
