import Bunyan from 'bunyan';
import StaticTokenAuth from '../auth/StaticTokenAuth';

import { authedHelix } from './helix';
import HelixCursor from './HelixCursor';

const logger = Bunyan.createLogger({ name: 'twitch-better-api-test' });

test('can issue a cursor command', async () => {
  // this is a little hacky, but it should hold for now as long as PUBG has at
  // least three pages of streams. And so long as the first on the third page
  // has less than the first on the first page did about two seconds before. So,
  // a while anyway.
  const auth =
    await (new StaticTokenAuth(process.env.TWITCH_OAUTH_ACCESS_TOKEN, logger)).initialize();

  const helix = authedHelix(auth.accessToken);

  const parameters = { game_id: "493057" }; // 493057 - PUBG
  const cursor = helix.getCursor("/streams", parameters);
  expect(cursor).toBeInstanceOf(HelixCursor);

  expect(cursor.data).toBeFalsy();
  let data = await cursor.next();
  expect(cursor.data).toBeDefined();
  expect(cursor._cursor).toBeDefined();

  const firstPageCount = data[0].viewer_count;

  data = await cursor.next();
  data = await cursor.next();

  const secondPageCount = data[0].viewer_count;

  expect(secondPageCount).toBeLessThan(firstPageCount);
});
