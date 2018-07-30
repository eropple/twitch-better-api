import * as _ from 'lodash';
import Bunyan from 'bunyan';

import { Session } from "./Session";
import { BaseAuth } from "./auth/BaseAuth";
import { AppTokenAuth } from "./auth/AppTokenAuth";
import { StaticTokenAuth } from "./auth/StaticTokenAuth";
import { BetterTwitchOptions, ensureOptions } from './options';
export { Session } from "./Session";
export { BaseAuth } from "./auth/BaseAuth";
export { AppTokenAuth } from "./auth/AppTokenAuth";
export { StaticTokenAuth } from "./auth/StaticTokenAuth";


function ensureLogger(logger: Bunyan | null): Bunyan {
  if (!logger) {
    logger = Bunyan.createLogger({ name: 'twitch-better-api' });
  } else {
    logger = logger.child({ lib: 'twitch-better-api' });
  }

  return logger;
}

export async function connectAsApp(
  oauthClientId: string,
  oauthClientSecret: string,
  logger: Bunyan | null,
  userOptions: Partial<BetterTwitchOptions> = {}
) {
  // TODO: see about re-enabling this check, but we don't have window in-scope
  // HACK: this is gross, but I can't figure out how to run the related test
  //       only for node and not also for browser testing. Suggestions welcome.
  // if (typeof(window) !== 'undefined' && typeof(__TEST__) === 'undefined') {
  //   console.log(typeof(window))
  //   throw new Error("connectAsApp flow must not be used in a browser.");
  // }

  const ensuredLogger = ensureLogger(logger);
  const auth = new AppTokenAuth(oauthClientId, oauthClientSecret, ensuredLogger);

  return connect(auth, ensuredLogger, userOptions);
}

export async function connectWithUserAccessToken(
  oauthToken: string,
  logger: Bunyan | null,
  userOptions: Partial<BetterTwitchOptions> = {}
) {
  const ensuredLogger = ensureLogger(logger);
  const auth = new StaticTokenAuth(oauthToken, ensuredLogger);

  return connect(auth, ensuredLogger, userOptions);
}

export async function connect(
  auth: BaseAuth,
  logger: Bunyan | null,
  userOptions: Partial<BetterTwitchOptions> = {}
) {
  const ensuredLogger = ensureLogger(logger);
  const ensuredOptions = ensureOptions(userOptions);
  ensuredLogger.info("Initializing Twitch API authentication.");
  await auth.initialize(ensuredOptions);

  return Session.build(auth, ensuredLogger, ensuredOptions);
}
