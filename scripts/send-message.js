// Standalone script that posts a message to a Discord channel.
//
// Configuration comes from environment variables (provided as GitHub variables
// by the workflow that runs this script):
//   DISCORD_TOKEN       - the Discord Authorization header value
//                         (e.g. "Bot <token>" for a bot, or a user/bearer token)
//   DISCORD_CHANNEL_ID  - the target channel id
//   DISCORD_MESSAGE     - the message content to send
//   SEND_DAY            - "odd" (default) or "even"; the message is only sent
//                         when the current GMT+5 day matches this parity
//
// Everything else (API base URL, headers, endpoint shape, HTTP method) is
// intentionally hardcoded.

const DISCORD_API = "https://discord.com/api/v9";

const {
  DISCORD_TOKEN,
  DISCORD_CHANNEL_ID,
  DISCORD_MESSAGE,
  SEND_DAY = "odd",
} = process.env;

function fail(message) {
  console.error(`Error: ${message}`);
  process.exit(1);
}

if (!DISCORD_TOKEN) fail("DISCORD_TOKEN is not set");
if (!DISCORD_CHANNEL_ID) fail("DISCORD_CHANNEL_ID is not set");
if (!DISCORD_MESSAGE) fail("DISCORD_MESSAGE is not set");

const sendDay = SEND_DAY.toLowerCase();
if (sendDay !== "odd" && sendDay !== "even") {
  fail('SEND_DAY must be "odd" or "even"');
}

// Day of month in GMT+5 (UTC+5), so parity matches the configured schedule.
const GMT5_OFFSET_MS = 5 * 60 * 60 * 1000;
const localDayOfMonth = new Date(Date.now() + GMT5_OFFSET_MS).getUTCDate();
const isOddDay = localDayOfMonth % 2 === 1;

if (sendDay === "odd" ? !isOddDay : isOddDay) {
  console.log(
    `Skipping: day ${localDayOfMonth} is ${isOddDay ? "odd" : "even"}, SEND_DAY=${sendDay}`,
  );
  process.exit(0);
}

const url = `${DISCORD_API}/channels/${DISCORD_CHANNEL_ID}/messages`;

async function main() {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: DISCORD_TOKEN,
      "Content-Type": "application/json",
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
  console.error("Error:", error);
  process.exit(1);
});
