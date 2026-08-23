// Standalone script that posts a message to a Discord channel.
//
// Configuration comes from environment variables (provided as GitHub variables
// by the workflow that runs this script):
//   DISCORD_TOKEN       - the Discord Authorization header value
//                         (e.g. "Bot <token>" for a bot, or a user/bearer token)
//   DISCORD_CHANNEL_ID  - the target channel id
//   DISCORD_MESSAGE     - the message content to send
//
// Everything else (API base URL, headers, endpoint shape, HTTP method) is
// intentionally hardcoded.

const DISCORD_API = 'https://discord.com/api/v9';
const USER_AGENT = 'DiscordBot (cronbot, 1.0.0)';

const { DISCORD_TOKEN, DISCORD_CHANNEL_ID, DISCORD_MESSAGE } = process.env;

function fail(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}

if (!DISCORD_TOKEN) fail('DISCORD_TOKEN is not set');
if (!DISCORD_CHANNEL_ID) fail('DISCORD_CHANNEL_ID is not set');
if (!DISCORD_MESSAGE) fail('DISCORD_MESSAGE is not set');

const url = `${DISCORD_API}/channels/${DISCORD_CHANNEL_ID}/messages`;

async function main() {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: DISCORD_TOKEN,
      'Content-Type': 'application/json',
      'User-Agent': USER_AGENT,
    },
    body: JSON.stringify({ content: DISCORD_MESSAGE }),
  });

  if (!response.ok) {
    const body = await response.text();
    fail(`Discord API responded with ${response.status}: ${body}`);
  }

  const data = await response.json();
  console.log(`Message sent (id: ${data.id})`);
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
