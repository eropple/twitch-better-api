import Bunyan from 'bunyan';
import { StaticTokenAuth } from './StaticTokenAuth';

const logger = Bunyan.createLogger({ name: 'twitch-better-api-test' });

test('constant in-out', () => {
  const auth = new StaticTokenAuth(process.env.TWITCH_OAUTH_ACCESS_TOKEN as string, logger);

  expect(auth.accessToken).toBe(process.env.TWITCH_OAUTH_ACCESS_TOKEN);
});

test('validates token', async () => {
  const auth = new StaticTokenAuth(process.env.TWITCH_OAUTH_ACCESS_TOKEN as string, logger);

  expect(await auth.validate()).toBe(true);
});

test("can't refresh these", async () => {
  const auth = new StaticTokenAuth(process.env.TWITCH_OAUTH_ACCESS_TOKEN as string, logger);

  expect(async () => {
    await auth.refresh({});
  }).not.toThrow();
});
