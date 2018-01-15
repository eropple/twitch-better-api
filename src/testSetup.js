module.exports = async function() {
  const requiredEnvVars = [
    "TWITCH_OAUTH_CLIENT_ID",
    "TWITCH_OAUTH_CLIENT_SECRET",
    "TWITCH_OAUTH_ACCESS_TOKEN"
  ];

  const missingEnvVars = requiredEnvVars.filter((n) => !process.env[n]);

  if (missingEnvVars.length > 0) {
    throw new Error(`Missing env vars for test: ${missingEnvVars.join(", ")}`);
  }
}
