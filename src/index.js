import * as _ from 'lodash';
import Bunyan from 'bunyan';

import _Session from './Session';
import _BaseAuth from './auth/BaseAuth';
import _AppTokenAuth from './auth/AppTokenAuth';
import _StaticTokenAuth from './auth/StaticTokenAuth';
export const Session = _Session;
export const BaseAuth = _BaseAuth;
export const AppTokenAuth = _AppTokenAuth;
export const StaticTokenAuth = _StaticTokenAuth;


function ensureLogger(logger) {
  if (!logger) {
    logger = Bunyan.createLogger({ name: 'twitch-better-api' });
  } else {
    logger = logger.child({ lib: 'twitch-better-api' });
  }

  return logger;
}

export async function connectAsApp(oauthClientId, oauthClientSecret, logger, userOptions = {}) {
  // HACK: this is gross, but I can't figure out how to run the related test
  //       only for node and not also for browser testing. Suggestions welcome.
  if (typeof(window) !== 'undefined' && typeof(__TEST__) === 'undefined') {
    console.log(typeof(window))
    throw new Error("connectAsApp flow must not be used in a browser.");
  }

  logger = ensureLogger(logger);
  const auth = new AppTokenAuth(oauthClientId, oauthClientSecret, logger);

  return connect(auth, logger, userOptions);
}

export async function connectWithUserAccessToken(oauthToken, logger, userOptions) {
  logger = ensureLogger(logger);
  const auth = new StaticTokenAuth(oauthToken, logger);

  return connect(auth, logger, userOptions);
}

export async function connect(auth, logger, userOptions = {}) {
  logger = ensureLogger(logger);
  logger.info("Initializing Twitch API authentication.");
  await auth.initialize(userOptions);

  return Session.build(auth, logger, userOptions);
}
