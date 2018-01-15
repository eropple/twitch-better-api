import * as _ from 'lodash';
import Bunyan from 'bunyan';

import AppTokenAuth from './auth/AppTokenAuth';
import StaticTokenAuth from './auth/StaticTokenAuth';
import Session from './Session';

import * as TwitchBetterAPI from './index';

const logger = Bunyan.createLogger({ name: 'twitch-better-api-test' });

test('connects with static auth', async () => {
  const session = await TwitchBetterAPI.connectWithUserAccessToken(
    process.env.TWITCH_OAUTH_ACCESS_TOKEN, logger
  );
  expect(session).toBeInstanceOf(Session);
  expect(session.auth).toBeInstanceOf(StaticTokenAuth);
});

test('connects with app auth', async () => {
  const session = await TwitchBetterAPI.connectAsApp(
    process.env.TWITCH_OAUTH_CLIENT_ID,
    process.env.TWITCH_OAUTH_CLIENT_SECRET,
    logger
  );
  expect(session).toBeInstanceOf(Session);
  expect(session.auth).toBeInstanceOf(AppTokenAuth);
});
