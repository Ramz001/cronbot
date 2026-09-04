// Schedules the Discord message with node-cron inside a long-running
// Docker container (the container stays alive between runs).
//
// Environment variables:
//   CRON_SCHEDULE - crontab expression in UTC (required, e.g. "0 22 * * *")
//   RUN_ON_START  - set to "true" to run the job once at startup (for testing)
//   ...plus everything `send-message.js` reads:
//     DISCORD_TOKEN, DISCORD_CHANNEL_ID, DISCORD_MESSAGE, SEND_DAY
//
// A failed run (e.g. Discord API returns 401 or any non-2xx, bad config, or
// a run outside the send window) is fatal: the process logs the error and
// exits non-zero so the container crashes and Docker can restart it.

const cron = require("node-cron");
const { run } = require("./send-message");

const schedule = process.env.CRON_SCHEDULE;

async function tick() {
  // Throws on any failure (missing config, outside the send window, or a
  // non-2xx Discord API response such as 401). Deliberately not caught here —
  // the caller decides how to handle the error.
  const result = await run();
  if (result.skipped) {
    console.log(`Skipping: ${result.skipped}`);
  } else {
    console.log(`Message sent (id: ${result.sent})`);
  }
}

// Any failed run is fatal for the scheduler: log the full error (message +
// stack + Discord response body) and crash with a non-zero exit code so the
// container stops. With `restart: unless-stopped` Docker will restart it, and
// the failure is loud and visible in `docker logs` instead of being silently
// swallowed and retried forever.
function crash(error) {
  console.error("");
  console.error("Cron run failed — crashing container");
  if (error && error.stack) {
    console.error(error.stack); // stack's first line already includes the message
  } else {
    console.error(error && error.message ? error.message : String(error));
  }
  // Let in-flight I/O (the Discord fetch) settle before exiting, so the exit
  // is clean on every platform (Node on Windows can assert on immediate exit).
  process.exitCode = 1;
  setTimeout(() => process.exit(1), 100);
}

if (!cron.validate(schedule)) {
  console.error(`Error: invalid CRON_SCHEDULE "${schedule}"`);
  process.exit(1);
}

cron.schedule(schedule, () => tick().catch(crash), { timezone: "Etc/UTC" });

console.log(`Cron scheduler running: "${schedule}" (UTC)`);

if (process.env.RUN_ON_START === "true") {
  console.log("RUN_ON_START is set, running the job once now");
  tick().catch(crash);
}
