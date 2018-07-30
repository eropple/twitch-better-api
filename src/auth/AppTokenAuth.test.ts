import Bunyan from 'bunyan';
import { AppTokenAuth } from './AppTokenAuth';

const logger = Bunyan.createLogger({ name: 'twitch-better-api-test' });

test('gets token on initialize', async () => {
  const auth = new AppTokenAuth(
    process.env.TWITCH_OAUTH_CLIENT_ID as string,
    process.env.TWITCH_OAUTH_CLIENT_SECRET as string,
    logger
  );

  expect(auth.initialized).toBe(false);
  await auth.initialize({ scopes: ["user_read", "channel_commercial"] });
  expect(auth.initialized).toBe(true);
});

test.skip('fails to validate tokens without initialize (throws)', async () => {
  const auth = new AppTokenAuth(
    process.env.TWITCH_OAUTH_CLIENT_ID as string,
    process.env.TWITCH_OAUTH_CLIENT_SECRET as string,
    logger
  );

  expect(async () => await auth.validate()).toThrow();
});
