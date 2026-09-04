"use strict";

// Mock tests for the cron-script send-message module.
// Run with: node --test test/   (no extra dependencies; uses node:test)
//
// The Discord HTTP layer is mocked by stubbing global fetch, and time is
// injected into run(env, now), so nothing here touches the real API.

const { describe, test } = require("node:test");
const assert = require("node:assert/strict");

const {
  run,
  parseSchedule,
  previousOccurrence,
  minutesSinceLastRun,
} = require("../send-message");

const at = (iso) => new Date(iso);

// ---------------------------------------------------------------------------
// fetch mocking
// ---------------------------------------------------------------------------

function mockResponse(status, body = {}) {
  const payload = typeof body === "string" ? body : JSON.stringify(body);
  const statusText =
    status === 401
      ? "Unauthorized"
      : status === 403
        ? "Forbidden"
        : status >= 500
          ? "Internal Server Error"
          : "OK";
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText,
    text: async () => payload,
    json: async () => JSON.parse(payload),
  };
}

async function withFetchStubbed(status, body, action) {
  const original = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init });
    return mockResponse(status, body);
  };
  try {
    await action(calls);
  } finally {
    globalThis.fetch = original;
  }
}

const baseEnv = {
  DISCORD_TOKEN: "test-token",
  DISCORD_CHANNEL_ID: "123456",
  DISCORD_MESSAGE: "hello world",
};

// ---------------------------------------------------------------------------
// parseSchedule
// ---------------------------------------------------------------------------

describe("parseSchedule", () => {
  test("parses a basic 5-field expression", () => {
    const s = parseSchedule("0 22 * * *");
    assert.ok(s.minutes.has(0));
    assert.ok(s.hours.has(22));
    assert.equal(s.dayOfMonthRestricted, false);
    assert.equal(s.dayOfWeekRestricted, false);
  });

  test("parses steps, ranges and lists", () => {
    const s = parseSchedule("*/15 9-10 * * 1,3,5");
    assert.deepEqual([...s.minutes].sort((a, b) => a - b), [0, 15, 30, 45]);
    assert.deepEqual([...s.hours].sort((a, b) => a - b), [9, 10]);
    assert.deepEqual([...s.daysOfWeek].sort((a, b) => a - b), [1, 3, 5]);
  });

  test("accepts an optional leading seconds field (6 fields)", () => {
    const s = parseSchedule("0 0 22 * * *");
    assert.ok(s.minutes.has(0));
    assert.ok(s.hours.has(22));
  });

  test("resolves nicknames", () => {
    assert.ok(parseSchedule("@daily").hours.has(0));
    assert.ok(parseSchedule("@hourly").minutes.has(0));
    assert.ok(parseSchedule("@yearly").months.has(1));
  });

  test("resolves month and weekday names", () => {
    assert.ok(parseSchedule("0 0 1 jan *").months.has(1));
    assert.ok(parseSchedule("0 9 * * mon-fri").daysOfWeek.has(1));
    assert.ok(parseSchedule("0 9 * * SUN").daysOfWeek.has(0));
  });

  test("treats ? as a wildcard in day fields", () => {
    const s = parseSchedule("0 9 * * ?");
    assert.equal(s.dayOfMonthRestricted, false);
    assert.equal(s.dayOfWeekRestricted, false);
  });

  test("rejects a wrong number of fields", () => {
    assert.throws(() => parseSchedule("0 22 * *"), /must have 5 fields/);
    assert.throws(() => parseSchedule("0 0 0 22 * * *"), /must have 5 fields/);
  });

  test("rejects out-of-range values", () => {
    assert.throws(() => parseSchedule("60 22 * * *"), /out of range/);
    assert.throws(() => parseSchedule("0 24 * * *"), /out of range/);
  });

  test("rejects unsupported modifiers with a clear error", () => {
    assert.throws(() => parseSchedule("0 0 1L * *"), /Unsupported cron field/);
  });
});

// ---------------------------------------------------------------------------
// minutesSinceLastRun / previousOccurrence
// ---------------------------------------------------------------------------

describe("minutesSinceLastRun", () => {
  test("daily schedule: minutes since the most recent 22:00 UTC fire", () => {
    assert.equal(minutesSinceLastRun(at("2026-09-04T22:00:30Z"), "0 22 * * *"), 0.5);
    assert.equal(minutesSinceLastRun(at("2026-09-04T22:30:00Z"), "0 22 * * *"), 30);
    assert.equal(minutesSinceLastRun(at("2026-09-04T23:10:00Z"), "0 22 * * *"), 70);
    assert.equal(minutesSinceLastRun(at("2026-09-05T02:00:00Z"), "0 22 * * *"), 240);
  });

  test("step schedule: most recent 15-minute boundary", () => {
    assert.equal(minutesSinceLastRun(at("2026-09-04T10:07:00Z"), "*/15 * * * *"), 7);
  });

  test("weekday-restricted schedule uses the last matching weekday", () => {
    // 2026-09-04 is a Friday.
    assert.equal(minutesSinceLastRun(at("2026-09-04T09:05:00Z"), "0 9 * * 1-5"), 5);
    // Saturday run falls back to Friday's fire.
    assert.ok(minutesSinceLastRun(at("2026-09-05T09:05:00Z"), "0 9 * * 1-5") > 1400);
  });

  test("day-of-week 7 means Sunday", () => {
    // 2026-09-06 is a Sunday.
    assert.equal(minutesSinceLastRun(at("2026-09-06T09:00:00Z"), "0 9 * * 7"), 0);
  });

  test("6-field expression with seconds works", () => {
    assert.equal(minutesSinceLastRun(at("2026-09-04T22:15:00Z"), "0 0 22 * * *"), 15);
  });

  test("nickname expression works", () => {
    assert.equal(minutesSinceLastRun(at("2026-09-04T00:10:00Z"), "@daily"), 10);
  });

  test("a schedule that never fires fails loudly instead of hanging", () => {
    assert.throws(
      () => minutesSinceLastRun(at("2026-09-04T10:00:00Z"), "0 0 31 2 *"),
      /No scheduled run found/,
    );
  });

  test("previousOccurrence returns a minute-floored Date at or before now", () => {
    const prev = previousOccurrence(parseSchedule("0 22 * * *"), at("2026-09-04T22:30:45Z"));
    assert.equal(prev.toISOString(), "2026-09-04T22:00:00.000Z");
  });
});

// ---------------------------------------------------------------------------
// run() with mocked Discord API
// ---------------------------------------------------------------------------

describe("run()", () => {
  test("MANUAL_SEND=true posts immediately, ignoring window and SEND_DAY", async () => {
    await withFetchStubbed(200, { id: "msg-1" }, async (calls) => {
      const result = await run(
        { ...baseEnv, MANUAL_SEND: "true" },
        at("2026-09-04T12:00:00Z"), // noon, far from any schedule
      );
      assert.equal(result.sent, "msg-1");
      assert.equal(calls.length, 1);
      assert.equal(calls[0].url, "https://discord.com/api/v9/channels/123456/messages");
      assert.equal(calls[0].init.method, "POST");
      assert.equal(calls[0].init.headers.Authorization, "test-token");
      assert.equal(JSON.parse(calls[0].init.body).content, "hello world");
    });
  });

  test("non-manual run inside the CRON_SCHEDULE window posts", async () => {
    await withFetchStubbed(200, { id: "msg-2" }, async (calls) => {
      const result = await run(
        { ...baseEnv, MANUAL_SEND: "false", CRON_SCHEDULE: "0 22 * * *", SEND_DAY: "odd" },
        at("2026-09-04T22:00:30Z"), // GMT+5 day = 5 (odd)
      );
      assert.equal(result.sent, "msg-2");
      assert.equal(calls.length, 1);
    });
  });

  test("outside the window it throws and never calls the API", async () => {
    await withFetchStubbed(200, {}, async (calls) => {
      await assert.rejects(
        () =>
          run(
            { ...baseEnv, MANUAL_SEND: "false", CRON_SCHEDULE: "0 22 * * *", SEND_DAY: "odd" },
            at("2026-09-04T23:10:00Z"), // 70 min after 22:00
          ),
        /outside the 30-minute send window/,
      );
      assert.equal(calls.length, 0);
    });
  });

  test("SEND_WINDOW_MINUTES widens the window dynamically", async () => {
    await withFetchStubbed(200, { id: "msg-3" }, async (calls) => {
      const result = await run(
        {
          ...baseEnv,
          MANUAL_SEND: "false",
          CRON_SCHEDULE: "0 22 * * *",
          SEND_DAY: "odd",
          SEND_WINDOW_MINUTES: "120",
        },
        at("2026-09-04T23:10:00Z"), // 70 min — fails with default 30, passes with 120
      );
      assert.equal(result.sent, "msg-3");
      assert.equal(calls.length, 1);
    });
  });

  test("SEND_DAY parity mismatch skips without calling the API", async () => {
    await withFetchStubbed(200, {}, async (calls) => {
      const result = await run(
        { ...baseEnv, MANUAL_SEND: "false", CRON_SCHEDULE: "0 22 * * *", SEND_DAY: "even" },
        at("2026-09-04T22:00:30Z"), // GMT+5 day = 5 (odd)
      );
      assert.match(result.skipped, /SEND_DAY=even/);
      assert.equal(calls.length, 0);
    });
  });

  test("SEND_DAY=off skips", async () => {
    await withFetchStubbed(200, {}, async (calls) => {
      const result = await run(
        { ...baseEnv, MANUAL_SEND: "false", CRON_SCHEDULE: "0 22 * * *", SEND_DAY: "off" },
        at("2026-09-04T22:00:30Z"),
      );
      assert.deepEqual(result, { skipped: "SEND_DAY is off" });
      assert.equal(calls.length, 0);
    });
  });

  test("6-field CRON_SCHEDULE works end to end", async () => {
    await withFetchStubbed(200, { id: "msg-4" }, async (calls) => {
      const result = await run(
        { ...baseEnv, MANUAL_SEND: "false", CRON_SCHEDULE: "0 0 22 * * *", SEND_DAY: "odd" },
        at("2026-09-04T22:05:00Z"),
      );
      assert.equal(result.sent, "msg-4");
      assert.equal(calls.length, 1);
    });
  });

  test("@daily nickname works end to end", async () => {
    await withFetchStubbed(200, { id: "msg-5" }, async (calls) => {
      const result = await run(
        { ...baseEnv, MANUAL_SEND: "false", CRON_SCHEDULE: "@daily", SEND_DAY: "even" },
        at("2026-09-04T00:10:00Z"), // 10 min after midnight, GMT+5 day = 4 (even)
      );
      assert.equal(result.sent, "msg-5");
      assert.equal(calls.length, 1);
    });
  });

  test("Discord 401 fails with a token hint", async () => {
    await withFetchStubbed(401, { message: "401: Unauthorized" }, async (calls) => {
      await assert.rejects(
        () =>
          run(
            { ...baseEnv, MANUAL_SEND: "false", CRON_SCHEDULE: "0 22 * * *", SEND_DAY: "odd" },
            at("2026-09-04T22:05:00Z"),
          ),
        /check DISCORD_TOKEN/,
      );
      assert.equal(calls.length, 1);
    });
  });

  test("Discord 5xx fails with a retry hint", async () => {
    await withFetchStubbed(500, "boom", async (calls) => {
      await assert.rejects(
        () =>
          run(
            { ...baseEnv, MANUAL_SEND: "false", CRON_SCHEDULE: "0 22 * * *", SEND_DAY: "odd" },
            at("2026-09-04T22:05:00Z"),
          ),
        /Discord API error, retry later/,
      );
      assert.equal(calls.length, 1);
    });
  });

  test("missing DISCORD_TOKEN throws", async () => {
    const env = { ...baseEnv, DISCORD_TOKEN: "" };
    await assert.rejects(() => run(env), /DISCORD_TOKEN is not set/);
  });

  test("missing CRON_SCHEDULE (non-manual) throws", async () => {
    await assert.rejects(
      () => run({ ...baseEnv, MANUAL_SEND: "false" }),
      /CRON_SCHEDULE is not set/,
    );
  });

  test("invalid CRON_SCHEDULE throws", async () => {
    await assert.rejects(
      () => run({ ...baseEnv, MANUAL_SEND: "false", CRON_SCHEDULE: "0 22 * *" }),
      /must have 5 fields/,
    );
  });

  test("invalid SEND_DAY throws", async () => {
    await assert.rejects(
      () => run({ ...baseEnv, SEND_DAY: "sometimes" }),
      /SEND_DAY must be "odd", "even" or "off"/,
    );
  });

  test("invalid SEND_WINDOW_MINUTES throws", async () => {
    await assert.rejects(
      () => run({ ...baseEnv, CRON_SCHEDULE: "0 22 * * *", SEND_WINDOW_MINUTES: "abc" }),
      /SEND_WINDOW_MINUTES must be a non-negative number/,
    );
  });
});
