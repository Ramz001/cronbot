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
// The script also only sends within a 30-minute window after the scheduled
// time (21:45 UTC); runs outside that window are skipped.
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

// Only send within a 30-minute window after the scheduled time (21:45 UTC).
const SCHEDULE_HOUR_UTC = 21;
const SCHEDULE_MINUTE_UTC = 45;
const WINDOW_MINUTES = 30;

function minutesSinceSchedule(now) {
  const scheduled = new Date(now);
  scheduled.setUTCHours(SCHEDULE_HOUR_UTC, SCHEDULE_MINUTE_UTC, 0, 0);
  if (scheduled > now) {
    scheduled.setUTCDate(scheduled.getUTCDate() - 1);
  }
  return (now - scheduled) / 60_000;
}

const elapsedMinutes = minutesSinceSchedule(new Date());
if (elapsedMinutes > WINDOW_MINUTES) {
  console.log(
    `Skipping: ${Math.round(elapsedMinutes)} min since 21:45 UTC is outside the ${WINDOW_MINUTES}-minute window`,
  );
  process.exit(0);
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
