import * as _ from 'lodash';
import Bunyan from 'bunyan';

import StaticTokenAuth from './auth/StaticTokenAuth';
import Session from './Session';

import KrakenOffsetCursor from './twitch/KrakenOffsetCursor';
import KrakenTokenCursor from './twitch/KrakenTokenCursor';

const logger = Bunyan.createLogger({ name: 'twitch-better-api-test' });

test('constructs with categories', async () => {
  const auth =
    await (new StaticTokenAuth(process.env.TWITCH_OAUTH_ACCESS_TOKEN, logger)).initialize();

  const session = new Session(auth, logger, {});
  expect(session.games).toBeDefined();
  expect(session.streams).toBeDefined();
});

describe('games', () => {
  test('get games by name (helix request + name map)', async () => {
    const auth =
      await (new StaticTokenAuth(process.env.TWITCH_OAUTH_ACCESS_TOKEN, logger)).initialize();

    const session = new Session(auth, logger, {});

    const games = await session.games.getGamesByName(["Suikoden", "Vandal Hearts"]);
    expect(games["Suikoden"].id).toBe("8076");
    expect(games["Vandal Hearts"].id).toBe("18207");
  }, 20000);

  test('get games by id (helix request + id map)', async () => {
    const auth =
      await (new StaticTokenAuth(process.env.TWITCH_OAUTH_ACCESS_TOKEN, logger)).initialize();

    const session = new Session(auth, logger, {});

    const games = await session.games.getGamesById(["8076", "18207"]);
    expect(games["8076"].name).toBe("Suikoden");
    expect(games["18207"].name).toBe("Vandal Hearts");
  }, 20000);

  test('get box art by id (kraken + image fetch)', async () => {
    const auth =
      await (new StaticTokenAuth(process.env.TWITCH_OAUTH_ACCESS_TOKEN, logger)).initialize();

    const session = new Session(auth, logger, {});

    // Vandal Hearts (18207) doesn't have box art. THIS TEST MAY BREAK IN THE
    // FUTURE IF THEY GET BOX ART FOR IT. FIX IT THEN. K. BYE.
    const games = await session.games.getBoxArtById(["8076", "18207"]);
    expect(games["8076"]).toBeInstanceOf(Buffer);
    expect(games["18207"]).toBeFalsy();
  }, 20000);
});

describe('channels', () => {
  test('channel search (kraken offset cursor)', async () => {
    const auth =
      await (new StaticTokenAuth(process.env.TWITCH_OAUTH_ACCESS_TOKEN, logger)).initialize();

    const session = new Session(auth, logger, {});

    const cursor = session.channels.searchChannelsCursor("starcraft");
    expect(cursor).toBeInstanceOf(KrakenOffsetCursor);

    expect(cursor.data).toBeFalsy();
    let data1 = await cursor.next();
    expect(cursor.total).toBeTruthy();
    expect(cursor.data).toBeTruthy();

    let data2 = await cursor.next();
    let data3 = await cursor.next();

    const ids = _.uniq(_.flatten([data1, data2, data3]).map((ch) => ch._id));
    // This is a bit hacky; it'd be really weird for more than five channels to
    // shuffle in the time it takes for the cursor to run, so I'm OK with it
    // until it's proven bad.
    expect(ids.length).toBeGreaterThan(70);
  }, 20000);
});

describe('clips', () => {
  test('top clips (kraken token cursor)', async () => {
    const auth =
      await (new StaticTokenAuth(process.env.TWITCH_OAUTH_ACCESS_TOKEN, logger)).initialize();

    const session = new Session(auth, logger, {});

    const cursor = session.clips.getTopClipsCursor();
    expect(cursor).toBeInstanceOf(KrakenTokenCursor);

    expect(cursor.data).toBeFalsy();
    let data1 = await cursor.next();
    expect(cursor.total).toBeFalsy(); // this call is "top", not "how many"
    expect(cursor.data).toBeTruthy();

    let data2 = await cursor.next();
    let data3 = await cursor.next();

    const slugs = _.uniq(_.flatten([data1, data2, data3]).map((ch) => ch.slug));
    // This is a bit hacky; it'd be really weird for more than five channels to
    // shuffle in the time it takes for the cursor to run, so I'm OK with it
    // until it's proven bad.
    expect(slugs.length).toBeGreaterThan(70);
  }, 20000);
});
