// Schedules the Discord message with node-cron inside a long-running
// Docker container (the container stays alive between runs).
//
// Environment variables:
//   CRON_SCHEDULE - crontab expression in UTC (default "45 21 * * *")
//   RUN_ON_START  - set to "true" to run the job once at startup (for testing)
//   ...plus everything `send-message.js` reads:
//     DISCORD_TOKEN, DISCORD_CHANNEL_ID, DISCORD_MESSAGE, SEND_DAY

const cron = require("node-cron");
const { run } = require("./send-message");

const schedule = process.env.CRON_SCHEDULE || "45 21 * * *";

async function tick() {
  try {
    const result = await run();
    if (result.skipped) {
      console.log(`Skipping: ${result.skipped}`);
    } else {
      console.log(`Message sent (id: ${result.sent})`);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

if (!cron.validate(schedule)) {
  console.error(`Error: invalid CRON_SCHEDULE "${schedule}"`);
  process.exit(1);
}

cron.schedule(schedule, () => void tick(), { timezone: "Etc/UTC" });

console.log(`Cron scheduler running: "${schedule}" (UTC)`);

if (process.env.RUN_ON_START === "true") {
  console.log("RUN_ON_START is set, running the job once now");
  void tick();
}
