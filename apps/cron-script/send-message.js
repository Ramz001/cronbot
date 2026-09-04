// Module that posts a message to a Discord channel.
//
// Runs from:
//   - CLI mode:  `node send-message.js` (CI / manual runs)
//   - Scheduler: `cron.js` (node-cron container) via `require`.
//
// Configuration comes from environment variables:
//   DISCORD_TOKEN         - the Discord Authorization header value
//                           (e.g. "Bot <token>" for a bot, or a user/bearer token)
//   DISCORD_CHANNEL_ID    - the target channel id
//   DISCORD_MESSAGE       - the message content to send
//   SEND_DAY              - "odd" (default) or "even": only send when the
//                           current GMT+5 day-of-month matches; "off" disables
//                           sending entirely
//   CRON_SCHEDULE         - crontab expression (UTC) the scheduler runs on.
//                           The send window is anchored to the most recent
//                           run of this schedule — it is NOT hardcoded.
//                           Supports 5 fields ("0 22 * * *"), an optional
//                           leading seconds field, and nicknames ("@daily").
//   SEND_WINDOW_MINUTES   - how many minutes after a scheduled run a send is
//                           still accepted (default 30). Keeps late or
//                           duplicate runs from posting outside the window.
//   MANUAL_SEND           - "true" to force a send for one-shot/manual testing:
//                           skips the send-window check and the SEND_DAY gate,
//                           so running it any time posts now
//
// A run more than SEND_WINDOW_MINUTES after the most recent run scheduled by
// CRON_SCHEDULE fails instead of sending — unless MANUAL_SEND is "true".
//
// Everything else (API base URL, headers, endpoint shape, HTTP method) is
// intentionally hardcoded.

const DISCORD_API = "https://discord.com/api/v9";

const DEFAULT_WINDOW_MINUTES = 30;
const GMT5_OFFSET_MS = 5 * 60 * 60 * 1000;
// How far back to search for a previous scheduled run before giving up.
// Covers yearly schedules (incl. leap years) with room to spare.
const SEARCH_LIMIT_MS = 400 * 24 * 60 * 60 * 1000;

// ---------------------------------------------------------------------------
// Minimal UTC crontab support — enough to answer "when was the most recent
// run of CRON_SCHEDULE?" so the send window follows the schedule instead of
// a hardcoded time. Mirrors the syntax node-cron accepts for this use case:
// 5 standard fields (minute hour day-of-month month day-of-week), an optional
// leading seconds field, nicknames (@daily etc.), numeric values, steps (*/n),
// ranges (a-b), lists (a,b), "?" as a wildcard in the day fields, and month /
// weekday names. day-of-week 0 and 7 both mean Sunday.
// ---------------------------------------------------------------------------

const NICKNAMES = {
  "@yearly": "0 0 1 1 *",
  "@annually": "0 0 1 1 *",
  "@monthly": "0 0 1 * *",
  "@weekly": "0 0 * * 0",
  "@daily": "0 0 * * *",
  "@midnight": "0 0 * * *",
  "@hourly": "0 * * * *",
};

const MONTH_NAMES = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};
const WEEKDAY_NAMES = {
  sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6,
};
const MONTH_NAME_RE = /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/gi;
const WEEKDAY_NAME_RE = /(sun|mon|tue|wed|thu|fri|sat)/gi;

function parseField(expr, min, max, names) {
  const source = names
    ? String(expr).replace(
        names.re,
        (name) => String(names.map[name.toLowerCase()]),
      )
    : String(expr);
  const values = new Set();
  for (const part of source.split(",")) {
    const match = part.match(/^(\*|\d+)(?:-(\d+))?(?:\/(\d+))?$/);
    if (!match) {
      throw new Error(`Unsupported cron field value "${part}" in "${expr}"`);
    }
    const start = match[1] === "*" ? min : Number(match[1]);
    let end = match[2] !== undefined ? Number(match[2]) : start;
    if (match[1] === "*") end = max;
    if (start < min || end > max || start > end) {
      throw new Error(`Cron field out of range in "${expr}"`);
    }
    const step = match[3] !== undefined ? Number(match[3]) : 1;
    if (step < 1) throw new Error(`Cron field step must be >= 1 in "${expr}"`);
    for (let value = start; value <= end; value += step) values.add(value);
  }
  return values;
}

/**
 * Parses a crontab expression into a set of matching values.
 * Accepts 5 fields (or 6 with a leading seconds field — seconds are ignored
 * because the send window only needs minute precision), nicknames, names and
 * "?" wildcards.
 * @param {string} expression e.g. "0 22 * * *" or "@daily"
 */
function parseSchedule(expression) {
  const normalized = String(expression).trim().toLowerCase();
  const resolved = NICKNAMES[normalized] ?? normalized;
  const fields = resolved.split(/\s+/);
  if (fields.length === 6) fields.shift(); // optional leading seconds field
  if (fields.length !== 5) {
    throw new Error(
      `CRON_SCHEDULE must have 5 fields (or 6 with a leading seconds field, or a nickname like @daily), got ${fields.length}: "${expression}"`,
    );
  }
  if (fields[2] === "?") fields[2] = "*"; // day-of-month wildcard
  if (fields[4] === "?") fields[4] = "*"; // day-of-week wildcard
  const daysOfWeek = parseField(fields[4], 0, 7, {
    re: WEEKDAY_NAME_RE,
    map: WEEKDAY_NAMES,
  });
  if (daysOfWeek.has(7)) daysOfWeek.add(0); // Sunday may be written as 0 or 7
  return {
    minutes: parseField(fields[0], 0, 59),
    hours: parseField(fields[1], 0, 23),
    daysOfMonth: parseField(fields[2], 1, 31),
    months: parseField(fields[3], 1, 12, {
      re: MONTH_NAME_RE,
      map: MONTH_NAMES,
    }),
    daysOfWeek,
    dayOfMonthRestricted: fields[2] !== "*",
    dayOfWeekRestricted: fields[4] !== "*",
  };
}

function dayMatches(schedule, date) {
  if (!schedule.months.has(date.getUTCMonth() + 1)) return false;
  const domOk = schedule.daysOfMonth.has(date.getUTCDate());
  const dowOk = schedule.daysOfWeek.has(date.getUTCDay());
  if (schedule.dayOfMonthRestricted && schedule.dayOfWeekRestricted) {
    return domOk || dowOk; // vixie-cron: either restricted field may match
  }
  if (schedule.dayOfMonthRestricted) return domOk;
  if (schedule.dayOfWeekRestricted) return dowOk;
  return true;
}

/**
 * The most recent instant at which `schedule` fires at or before `from`
 * (a Date, floored to the minute).
 * @returns {Date}
 */
function previousOccurrence(schedule, from) {
  const result = new Date(from);
  result.setUTCSeconds(0, 0);
  const earliest = result.getTime() - SEARCH_LIMIT_MS;

  for (;;) {
    if (result.getTime() < earliest) {
      throw new Error(
        "No scheduled run found within the last 400 days — CRON_SCHEDULE never fires, fires less often than that, or is invalid",
      );
    }
    const year = result.getUTCFullYear();
    const month = result.getUTCMonth() + 1;
    const day = result.getUTCDate();
    const startOfDay = Date.UTC(year, month - 1, day);

    if (dayMatches(schedule, result)) {
      // Latest matching (hour, minute) at or before the current time-of-day.
      const limitHour = result.getUTCHours();
      const limitMinute = result.getUTCMinutes();
      const hours = [...schedule.hours].sort((a, b) => b - a);
      for (const hour of hours) {
        if (hour > limitHour) continue;
        const maxMinute = hour === limitHour ? limitMinute : 59;
        const minutes = [...schedule.minutes].sort((a, b) => b - a);
        for (const minute of minutes) {
          if (minute > maxMinute) continue;
          return new Date(Date.UTC(year, month - 1, day, hour, minute));
        }
      }
    }

    // No (earlier) matching time on this day — move to the previous day.
    result.setTime(startOfDay - 1);
    result.setUTCSeconds(0, 0);
  }
}

/**
 * Minutes elapsed since the most recent run of `cronExpression` (UTC)
 * at or before `now`.
 */
function minutesSinceLastRun(now, cronExpression) {
  const schedule = parseSchedule(cronExpression);
  return (now - previousOccurrence(schedule, now)) / 60_000;
}

/**
 * Attempts to send the Discord message.
 *
 * @param {NodeJS.ProcessEnv} [env] - configuration (defaults to process.env)
 * @param {Date} [now] - current time, injectable for tests (defaults to now)
 * @returns {Promise<{skipped: string} | {sent: string}>}
 *   - `{ skipped }` when the run is intentionally skipped (SEND_DAY mismatch / off)
 *   - `{ sent: id }` when the message was posted
 * @throws on missing/invalid configuration, a run outside the send window
 *         (SEND_WINDOW_MINUTES after the most recent CRON_SCHEDULE run),
 *         or a failed Discord API call
 */
async function run(env = process.env, now = new Date()) {
  const {
    DISCORD_TOKEN,
    DISCORD_CHANNEL_ID,
    DISCORD_MESSAGE,
    SEND_DAY = "odd",
    CRON_SCHEDULE,
    SEND_WINDOW_MINUTES = String(DEFAULT_WINDOW_MINUTES),
    MANUAL_SEND = "false",
  } = env;

  if (!DISCORD_TOKEN) throw new Error("DISCORD_TOKEN is not set");
  if (!DISCORD_CHANNEL_ID) throw new Error("DISCORD_CHANNEL_ID is not set");
  if (!DISCORD_MESSAGE) throw new Error("DISCORD_MESSAGE is not set");

  const windowMinutes = Number(SEND_WINDOW_MINUTES);
  if (!Number.isFinite(windowMinutes) || windowMinutes < 0) {
    throw new Error("SEND_WINDOW_MINUTES must be a non-negative number");
  }

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

  // Send-window gate: a send is accepted only within SEND_WINDOW_MINUTES
  // after the most recent run scheduled by CRON_SCHEDULE (UTC). The anchor
  // is derived from the schedule rather than hardcoded, so changing
  // CRON_SCHEDULE moves the window automatically. Running outside the window
  // is a hard failure. Manual one-shot runs (MANUAL_SEND=true) skip it.
  if (!manualSend) {
    if (!CRON_SCHEDULE || !String(CRON_SCHEDULE).trim()) {
      throw new Error(
        "CRON_SCHEDULE is not set (required when MANUAL_SEND is not true)",
      );
    }
    const elapsedMinutes = minutesSinceLastRun(now, CRON_SCHEDULE);
    if (elapsedMinutes > windowMinutes) {
      throw new Error(
        `${Math.round(elapsedMinutes)} min since the last scheduled run (CRON_SCHEDULE="${CRON_SCHEDULE}") is outside the ${windowMinutes}-minute send window`,
      );
    }
  }

  // Day of month in GMT+5 (UTC+5), so parity matches the configured schedule.
  const localDayOfMonth = new Date(now.getTime() + GMT5_OFFSET_MS).getUTCDate();
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
    const body = (await response.text()).trim();
    const hint =
      response.status === 401 || response.status === 403
        ? " — check DISCORD_TOKEN (valid token with permission to post in this channel)"
        : response.status >= 500
          ? " — Discord API error, retry later"
          : "";
    throw new Error(
      `Discord API POST ${url} failed with HTTP ${response.status} ${response.statusText}${hint}. Response: ${body}`,
    );
  }

  const data = await response.json();
  return { sent: data.id };
}

module.exports = {
  run,
  parseSchedule,
  previousOccurrence,
  minutesSinceLastRun,
};

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
