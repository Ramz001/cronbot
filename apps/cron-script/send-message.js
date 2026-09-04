// Module that posts a message to a Discord channel.
//
// Runs from:
//   - CLI mode:  `node send-message.js` (CI / manual runs)
//   - Scheduler: `cron.js` (node-cron container) via `require`.
//
// Configuration comes from environment variables:
//   DISCORD_TOKEN       - the Discord Authorization header value
//                         (e.g. "Bot <token>" for a bot, or a user/bearer token)
//   DISCORD_CHANNEL_ID  - the target channel id
//   DISCORD_MESSAGE     - the message content to send
//   SEND_DAY            - "odd" (default) or "even": only send when the
//                         current GMT+5 day-of-month matches; "off" disables
//                         sending entirely
//   MANUAL_SEND         - "true" to force a send for one-shot/manual testing:
//                         skips the 21:45 UTC ±30-minute window check and the
//                         SEND_DAY gate, so running it any time posts now
//
// The cron runs every day; SEND_DAY decides which days actually send.
// A run outside the 30-minute window after the scheduled time (21:45 UTC)
// fails instead of sending — unless MANUAL_SEND is "true".
//
// Everything else (API base URL, headers, endpoint shape, HTTP method) is
// intentionally hardcoded.

const DISCORD_API = "https://discord.com/api/v9";

const SCHEDULE_HOUR_UTC = 21;
const SCHEDULE_MINUTE_UTC = 45;
const WINDOW_MINUTES = 30;
const GMT5_OFFSET_MS = 5 * 60 * 60 * 1000;

function minutesSinceSchedule(now) {
  const scheduled = new Date(now);
  scheduled.setUTCHours(SCHEDULE_HOUR_UTC, SCHEDULE_MINUTE_UTC, 0, 0);
  if (scheduled > now) {
    scheduled.setUTCDate(scheduled.getUTCDate() - 1);
  }
  return (now - scheduled) / 60_000;
}

/**
 * Attempts to send the Discord message.
 *
 * @returns {Promise<{skipped: string} | {sent: string}>}
 *   - `{ skipped }` when the run is intentionally skipped (SEND_DAY mismatch / off)
 *   - `{ sent: id }` when the message was posted
 * @throws on missing/invalid configuration, a run outside the 30-minute
 *         window, or a failed Discord API call
 */
async function run(env = process.env) {
  const {
    DISCORD_TOKEN,
    DISCORD_CHANNEL_ID,
    DISCORD_MESSAGE,
    SEND_DAY = "odd",
    MANUAL_SEND = "false",
  } = env;

  if (!DISCORD_TOKEN) throw new Error("DISCORD_TOKEN is not set");
  if (!DISCORD_CHANNEL_ID) throw new Error("DISCORD_CHANNEL_ID is not set");
  if (!DISCORD_MESSAGE) throw new Error("DISCORD_MESSAGE is not set");

  // Manual one-shot mode ("true") skips the schedule gates below so the
  // message is posted whenever it is run — for testing the container.
  const manualSend = MANUAL_SEND.toLowerCase() === "true";

  const sendDay = SEND_DAY.toLowerCase();
  if (sendDay !== "odd" && sendDay !== "even" && sendDay !== "off") {
    throw new Error('SEND_DAY must be "odd", "even" or "off"');
  }

  if (!manualSend && sendDay === "off") {
    return { skipped: "SEND_DAY is off" };
  }

  // Only send within a window after the scheduled time (21:45 UTC);
  // running outside the window is a hard failure. Manual one-shot runs
  // (MANUAL_SEND=true) skip this check.
  const elapsedMinutes = minutesSinceSchedule(new Date());
  if (!manualSend && elapsedMinutes > WINDOW_MINUTES) {
    throw new Error(
      `${Math.round(elapsedMinutes)} min since 21:45 UTC is outside the ${WINDOW_MINUTES}-minute window`,
    );
  }

  // Day of month in GMT+5 (UTC+5), so parity matches the configured schedule.
  const localDayOfMonth = new Date(Date.now() + GMT5_OFFSET_MS).getUTCDate();
  const isOddDay = localDayOfMonth % 2 === 1;

  if (!manualSend && (sendDay === "odd" ? !isOddDay : isOddDay)) {
    return {
      skipped: `day ${localDayOfMonth} is ${isOddDay ? "odd" : "even"}, SEND_DAY=${sendDay}`,
    };
  }

  const url = `${DISCORD_API}/channels/${DISCORD_CHANNEL_ID}/messages`;
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
    throw new Error(`Discord API responded with ${response.status}: ${body}`);
  }

  const data = await response.json();
  return { sent: data.id };
}

module.exports = { run };

// CLI mode (e.g. `node send-message.js`).
if (require.main === module) {
  run()
    .then((result) => {
      if (result.skipped) {
        console.log(`Skipping: ${result.skipped}`);
      } else {
        console.log(`Message sent (id: ${result.sent})`);
      }
    })
    .catch((error) => {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    });
}
