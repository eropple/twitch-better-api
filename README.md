# `twitch-better-api` #
Twitch is cool. Games are fun, streaming is fun.

The Twitch API is a tire fire. They're onto "Helix" now, as if `v3` and `v5`
weren't enough, and Helix is not only incomplete but `v5` is scheduled to be
shut down at the end of 2018. So that's fun. And while the rest of the world has
mostly moved on to providing OpenAPI/Swagger docs or at least generating clients
_for_ you like Twitch's own parent company does with the AWS/Seahorse stuff,
Twitch is happy to make its end users make third-rate knockoff APIs.

It's no real surprise, then, that Twitch API clients are a mess. You can have
completeness, for `v5` anyway, but then you get callback hell or singletons or
any number of other pains in our collective ass.

So, fine. Let's make a Twitch API that doesn't suck. Because, as much as it
should be _their_ job, I guess it's not.

## Requirements ##
`twitch-better-api` is designed for use with Node. I don't use older versions of
Node, so I've specified a minimum version of `8.0.0`; this may migrate upward
over time. If you encounter bugs using a version of Node prior to `8.0.0`, I
will accept pull requests but will otherwise not spend time addressing issues
filed to that effect.

`twitch-better-api` expects, as with any good application, to be used in a
context where [Bunyan](https://github.com/trentm/node-bunyan) logging is used.
Bunyan is specified in `peerDependencies`, so you'll be obligated to specify a
version of Bunyan in your project. If a Bunyan logger is not provided during
client setup, it will then create its own logger. It will then make fun of you.

`twitch-better-api` isn't intended for use in a browser, but can probably be
made to work in a browser without too much effort.


## Installation ##
Normal NPM package rules apply.

```
yarn add @eropple/twitch-better-api
```

`twitch-better-api` adheres to semver.

## Usage ##
`twitch-better-api` tries not to be prescriptive about how you use it. Unlike
a lot of existing API clients, it doesn't require you to deal with singletons
and it tries to handle its own business as much as possible.

### Options ###
Options are verified with Joi; if something's received that `twitch-better-api`
doesn't understand, it should scream. If there is an error related to options
that you've set that _isn't_ caught by Joi, please open an issue.

- `scopes`: a list of scopes that should be

### Connect ###
At its core, all of the `connect` methods in the API return an object that
inherits from `BaseAuth`. You can extend this yourself (if, say, you want to
get a Twitch API key from a remote data source and periodically refresh it),
but the two main ways of using the API are as follows:

- `export async function connectAsApp(oauthClientId, oauthClientSecret, logger, userOptions)`
- `export async function connectWithUserAccessToken(oauthToken, logger, userOptions)`

Both should be self-explanatory if you've read the Twitch documentation on auth;
if not, [I suggest that you do](https://dev.twitch.tv/docs/authentication) as a
basic understanding of OAuth is helpful even when using `twitch-better-api`.

You may not use `connectAsApp` if the library detects that you're in a browser.
This is bad-and-wrong. Besides, you're probably going to want to be able to act
as a client; to that end, you'll need the `connectWithUserAccessToken` flow
anyway.

Anyway, once you've called one of those (or the `connect` method that they just
wrap), you'll receive a `Session` object. You'll make your API calls on this
object. It includes the aforementioned `BaseAuth`-derived access token handlers;
if you're using the app token workflow, `AppTokenAuth` will periodically refresh
your token behind the scenes. Client tokens (using `StaticTokenAuth`) are not so
lucky, but they do last for about 60 days so the rollover isn't too bad. If you
are using `twitch-better-api` as part of a web app, you can just go back into
your OAuth flow; if you're using it in something like a broadcaster suite, 60
days is probably good enough for a manual token refresh.

## Testing ##
`twitch-better-api` is somewhat tested; the hot paths are tested because I used
the tests to build the client, but there are certainly edge and corner cases I
haven't dealt with. Pull requests to improve testing are gratefully solicited.
Any pull requests for new functionality should come with tests.

Since this is effectively an integration test, you'll need to set some
environment variables in order to test against Twitch's API. Specifically, the
following need to be set:

- `TWITCH_OAUTH_CLIENT_ID`
- `TWITCH_OAUTH_CLIENT_SECRET`
- `TWITCH_OAUTH_ACCESS_TOKEN`

These are automatically sourced when appropriate. See
`env_test_secrets.bash.example` (n.b.: `env_test_secrets.bash` is ignored via
`.gitignore`, because obviously).

Tests _must_ be non-mutating. Getters are OK--setters are not. In the future
we can consider the idea of more in-depth tests; for example, I have the two
Twitch accounts `tracecomplete` and `tracecomplete_test`, and I wouldn't mind
running mutating tests against `tracecomplete_test`. If you are interested in
this, open an issue and we can discuss it.

## Future Work ##
- There are a lot of calls not directly wrapped.
- Not for this gem specifically, but a little OAuth app that can be run on a
  local machine to get an OAuth token with scopes would be handy instead of
  relying on TwitchApps's TokenGen.
