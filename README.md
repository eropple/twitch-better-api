# `twitch-better-api` #
Twitch is cool. Games are fun, streaming is fun.

The Twitch API is a mess. They're onto "Helix" now, as if `v3` and `v5` weren't
enough, and Helix is not only incomplete but `v5` is scheduled to be shut down
at the end of 2018. So that's fun. And while the rest of the world has mostly
moved on to providing OpenAPI/Swagger docs or at least generating clients _for_
you like Twitch's own parent company does with the AWS/Seahorse stuff, Twitch is
happy to make its end users make clients for their chaotic APIs.

It's no real surprise, then, that Twitch API clients are in the state they're
in. People have done their best, but the quality of the existing API clients is
hit-or-miss and they're all an exercise in frustration. You might be able to get
completeness, for `v5` anyway, but even something as simple as "get game by ID"
requires Helix and on top of that you get callback hell or singletons or any
number of other pains in our collective ass.

So, fine. Let's make a Twitch client that doesn't suck. I think this is a good
start.

## Changelog ##
- `0.3.0-rc.1`: updated TypeScript to 3.4.4 and rebuilt with declarations
  enabled in `tsconfig.json` (whoops).

## Requirements ##
`twitch-better-api` is designed for use with Node. I don't use older versions of
Node, so I've specified a minimum version of `8.0.0`; this may migrate upward
over time. If you encounter bugs using a version of Node prior to `8.0.0`, I
will accept pull requests but will otherwise not spend time addressing issues
filed to that effect.

`twitch-better-api` expects, as with any good application, to be used in a
context where [Bunyan](https://github.com/trentm/node-bunyan) logging is used.
It will create a Bunyan logger if you don't give it one. If you use Winston,
that's fine, but it's up to you to add a Winston stream to the Bunyan logger.

`twitch-better-api` isn't intended for use in a browser, but can probably be
made to work in a browser without too much effort.


## Installation ##
Normal NPM package rules apply.

```
npm install @eropple/twitch-better-api
yarn add @eropple/twitch-better-api
```

`twitch-better-api` adheres to semver.

## Usage ##
`twitch-better-api` tries not to be prescriptive about how you use it. Unlike a
lot of existing API clients, it doesn't require you to deal with singletons and
it tries to handle its own business as much as possible.

### Options ###
Options are verified with Joi; if something's received that `twitch-better-api`
doesn't understand, it should scream. If there is an error related to options
that you've set that _isn't_ caught by Joi, please open an issue.

- `scopes`: a list of scopes that should be requested. If for some reason the
  scopes returned by the Twitch API differ, an error will be thrown.

### Connect ###
At its core, all of the `connect` methods in the API return an object that
inherits from `BaseAuth`. You can extend this yourself (if, say, you want to get
a Twitch API key from a remote data source and periodically refresh it), but the
two main ways of using the API are as follows:

- `export async function connectAsApp(oauthClientId, oauthClientSecret, logger, userOptions)`
- `export async function connectWithUserAccessToken(oauthToken, logger, userOptions)`

Both should be self-explanatory if you've read the Twitch documentation on auth;
if not, [I suggest that you do](https://dev.twitch.tv/docs/authentication) as a
basic understanding of OAuth is helpful even when using `twitch-better-api`.

You may not use `connectAsApp` if the library detects that you're in a browser.
This is bad-and-wrong. Besides, you're probably going to want to be able to act
as a client; to that end, you'll need the `connectWithUserAccessToken` flow
anyway. To use the client token method on a server, I recommend using
TwitchApps' [TokenGen]() to acquire a token.

Anyway, once you've called one of those (or the `connect` method that they just
wrap), you'll receive a `Session` object. You'll make your API calls on this
object. It includes the aforementioned `BaseAuth`-derived access token handlers;
if you're using the app token workflow, `AppTokenAuth` will periodically refresh
your token behind the scenes. Client tokens (using `StaticTokenAuth`) are not so
lucky, but they do last for about 60 days so the rollover isn't too bad. If you
are using `twitch-better-api` as part of a web app, you can just go back into
your OAuth flow; if you're using it in something like a broadcaster suite, 60
days is probably good enough for a manual token refresh.

### Getting Stuff Done ###
#### The Easy Way ####
##### Calls #####
Simple, friendly, asynchronous, `Promise`-based API calls. API calls are grouped
into Categories, which are found in `src/operations`. These categories are then
exposed inside of `Session`.

As a rule:
- Methods that accept a parameters object do so expecting that you pass in the
  params described by the method that underlies it. Consult the Twitch API docs
  if you're not sure what to pass.
- The API methods do the right thing as far as data envelopes go. `GET` requests
  will pass parameters as a query string. `POST`, `PUT`, and `PATCH` requests
  will pass parameters as a JSON body.
- If you request something by ID, i.e. `Session.games.getGamesById`, you will
  receive an object in return which contains ID to item mappings. If you request
  something by name, you'll receive an object with name to item mappings.
- Cursors act differently. See below.

##### Cursors #####
Twitch has three, count-'em-three, different implementations of cursors: two in
Kraken and one in Helix. This may seem preposterous at first, second, third, and
forty-ninth glance, I agree. It does not get less preposterous when you reach
the two hundred and eighth.

But I digress.

Fortunately, `twitch-better-api` has your back. Each cursor type is wrapped into
a unified interface which presents the following API:

- `async Cursor.next()`: fetches another page of data from the API and returns
  it. That data can also be fetched from `Cursor.data` afterwards. Will return
  null if the query has been exhausted.
- `Cursor.started`: true if data has been requested via this cursor.
- `Cursor.total`: an integer representing the total number of items available,
  or null if unavailable/inappropriate for the call.
- `Cursor.error`: If a call to Twitch has thrown an error, the details will be
  stored here. A cursor where `error` is non-null is broken; further calls to
  `Cursor.next()` will throw the same error object.
- `Cursor.data`: the current batch of data fetched. `null` before the first call
  to `Cursor.next()`.

The workflow for a `Cursor` is pretty simple: await on `Cursor.next()` in a loop
(or do the moral equivalent if you're pre-async/await) and collect data until
you're satisfied or until you hit a `null`, signaling the end of the cursor's
data set.

#### The Hard Way ####
If there's a call you need access to that isn't made available, we've got an
option for that. Two properties exist, `Session.helix` and `Session.kraken`,
which will yield to you properly authenticated clients for the Helix and the
`v5` APIs respectively. There are also helper methods, `Session.helixCall` and
`Session.krakenCall`, that make this a little less gross.

**Before you do this in your own code**, however, please consider writing an
operation that presents a nice interface for the problem you're trying to solve;
somebody else will probably need it someday and it's a good way to contribute
back.

Don't try to save and reuse `helix` or `kraken` objects outside of a given
method. They have a copy of the OAuth access token and will not be valid if the
API client refreshes its access token. Just use the property and it'll be taken
care of.

The API uses Axios under the hood, so every call to, say, `Session.helix.get`
returns a `Promise`.

## Testing ##
`twitch-better-api` is somewhat tested; the hot paths are tested because I used
the tests to build the client, but there are certainly edge and corner cases I
haven't dealt with and at least some of the API surface has probably not had
eyes on it. Pull requests to improve testing are gratefully solicited. **Any
pull requests for new functionality should come with tests.**

Since this is effectively an integration test, you'll need to set some
environment variables in order to test against Twitch's API. Specifically, the
following need to be set:

- `TWITCH_OAUTH_CLIENT_ID`
- `TWITCH_OAUTH_CLIENT_SECRET`
- `TWITCH_OAUTH_ACCESS_TOKEN`

These are automatically sourced when appropriate. See
`env_test_secrets.bash.example` (n.b.: `env_test_secrets.bash` is ignored via
`.gitignore`, because obviously).

Tests _must_ be non-mutating. Getters are OK--setters are not. In the future we
can consider the idea of more in-depth tests; for example, I have the two Twitch
accounts `tracecomplete` and `tracecomplete_test`, and I wouldn't mind running
mutating tests against `tracecomplete_test`. If you are interested in this, open
an issue and we can discuss it.

## Future Work ##
- There are a lot of calls not directly wrapped.
- Retry support is TBD. Backoff/repetition isn't that difficult but it does
  probably mean unwrapping async/await into `Promise`s and my own applications
  don't currently need it; my experience strongly leads me to think that most
  errors are of the `4xx` class and the only one that it seems like the client
  can really help with is `429 Too Many Requests`.
- Not for this gem specifically, but a little OAuth app that can be run on a
  local machine to get an OAuth token with scopes would be handy instead of
  relying on TwitchApps's [TokenGen]().

## License ##
This library is released under the terms of the [GNU AGPL 3.0]() and no later
version. Please ensure that you properly understand the terms and conditions to
which distribution of the AGPL binds you before using this library.

While I am not particularly big on the FSF's definition of Free, I am a little
annoyed that the poor quality of API support by Twitch necessitated going out of
my way and building this, so I selected the AGPL to safeguard open access to the
library. I do require the signature of a [Contributor License Agreement]()
before contributing to the project.

Non-AGPL licensure is available, as is custom feature work. Contact me at
ed+twitch-better-api@edropple.com for details.

[TokenGen]: https://twitchapps.com/tokengen
[GNU AGPL 3.0]: https://spdx.org/licenses/AGPL-3.0-only.html
[Contributor License Agreement]: https://www.clahub.com/agreements/eropple/twitch-better-api
