import * as _ from 'lodash';
import Bunyan from 'bunyan';

import { StaticTokenAuth } from './auth/StaticTokenAuth';
import { Session } from './Session';

import { KrakenOffsetCursor } from './twitch/KrakenOffsetCursor';
import { KrakenTokenCursor } from './twitch/KrakenTokenCursor';

const logger = Bunyan.createLogger({ name: 'twitch-better-api-test' });

test('constructs with categories', async () => {
  const token = process.env.TWITCH_OAUTH_ACCESS_TOKEN || "";
  const auth = new StaticTokenAuth(token, logger)

  const session = new Session(auth, logger, { scopes: [] });
  expect((session as any).games).toBeDefined();
  expect((session as any).streams).toBeDefined();
});

describe('games', () => {
  test('get games by name (helix request + name map)', async () => {
    const auth = new StaticTokenAuth(process.env.TWITCH_OAUTH_ACCESS_TOKEN || "", logger);

    const session = new Session(auth, logger, { scopes: [] });
    const games = await session.games.getGamesByName(["Suikoden", "Vandal Hearts"]);
    expect(games["Suikoden"].id).toBe("8076");
    expect(games["Vandal Hearts"].id).toBe("18207");
  }, 20000);

  test('get games by id (helix request + id map)', async () => {
    const auth = new StaticTokenAuth(process.env.TWITCH_OAUTH_ACCESS_TOKEN || "", logger);

    const session = new Session(auth, logger, { scopes: [] });
    const games = await (session as any).games.getGamesById(["8076", "18207"]);
    expect(games["8076"].name).toBe("Suikoden");
    expect(games["18207"].name).toBe("Vandal Hearts");
  }, 20000);
});

describe('channels', () => {
  test('channel search (kraken offset cursor)', async () => {
    try {
      const auth = new StaticTokenAuth(process.env.TWITCH_OAUTH_ACCESS_TOKEN || "", logger);

      const session = new Session(auth, logger, { scopes: [] });

      const cursor = session.channels.searchChannelsCursor("starcraft");
      expect(cursor).toBeInstanceOf(KrakenOffsetCursor);

      expect(cursor.data).toBeFalsy();
      let data1 = await cursor.next();

      expect(cursor.total).toBeTruthy();
      expect(cursor.data).toBeTruthy();

      let data2 = await cursor.next();
      let data3 = await cursor.next();

      const ids = _.uniq(_.flatten([data1 || [], data2 || [], data3 || []]).map((ch) => ch.id));
      expect(ids.length).toBeGreaterThan(70);
    } catch (err) {
      console.log(err)
      throw err;
    }
  }, 20000);
});

describe('clips', () => {
  test('top clips (kraken token cursor)', async () => {
    const auth = new StaticTokenAuth(process.env.TWITCH_OAUTH_ACCESS_TOKEN || "", logger);

    const session = new Session(auth, logger, { scopes: [] });

    const cursor = session.clips.getTopClipsCursor({});
    expect(cursor).toBeInstanceOf(KrakenTokenCursor);

    expect(cursor.data).toBeFalsy();
    let data1 = await cursor.next();
    expect(cursor.total).toBeFalsy(); // this call is "top", not "how many"
    expect(cursor.data).toBeTruthy();

    let data2 = await cursor.next();
    let data3 = await cursor.next();

    const slugs = _.uniq(_.flatten([data1 || [], data2 || [], data3 || []]).map((ch) => ch.slug));
    expect(slugs.length).toBeGreaterThan(70);
  }, 20000);
});
