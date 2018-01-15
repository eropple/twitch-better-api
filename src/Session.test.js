import Bunyan from 'bunyan';

import StaticTokenAuth from './auth/StaticTokenAuth';
import Session from './Session';

const logger = Bunyan.createLogger({ name: 'twitch-better-api-test' });

test('constructs with categories', async () => {
  const auth =
    await (new StaticTokenAuth(process.env.TWITCH_OAUTH_ACCESS_TOKEN, logger)).initialize();

  const session = new Session(auth, logger, {});
  expect(session.games).toBeDefined();
  expect(session.streams).toBeDefined();
});

describe('games', () => {
  test('get games by name', async () => {
    const auth =
      await (new StaticTokenAuth(process.env.TWITCH_OAUTH_ACCESS_TOKEN, logger)).initialize();

    const session = new Session(auth, logger, {});

    const games = await session.games.getGamesByName(["Suikoden", "Vandal Hearts"]);
    expect(games["Suikoden"].id).toBe("8076");
    expect(games["Vandal Hearts"].id).toBe("18207");
  });

  test('get games by id', async () => {
    const auth =
      await (new StaticTokenAuth(process.env.TWITCH_OAUTH_ACCESS_TOKEN, logger)).initialize();

    const session = new Session(auth, logger, {});

    const games = await session.games.getGamesById(["8076", "18207"]);
    expect(games["8076"].name).toBe("Suikoden");
    expect(games["18207"].name).toBe("Vandal Hearts");
  });
});
