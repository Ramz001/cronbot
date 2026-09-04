# cron-script

Standalone Node.js app that posts a scheduled message to a Discord channel.
It is **internal to the cronbot project** — it runs as its own Docker
container and has no other consumers.

- `cron.js` — long-running scheduler (node-cron) that fires on `CRON_SCHEDULE`.
- `send-message.js` — does the actual posting; also runnable as a one-shot CLI.
- `test/` — mock-based unit tests (`node:test`, no extra dependencies).

```mermaid
flowchart LR
    Docker[Docker container\nrestart: unless-stopped] --> cron[cron.js\nnode-cron scheduler\nCRON_SCHEDULE, UTC]
    cron --> send[send-message.js\nrun()]
    send -->|SEND_DAY gate| D1{Send?}
    D1 -->|skip| N[Log skip, stay alive]
    send -->|send window gate| D2{In window?}
    D2 -->|no| X[Throw -> crash -> exit 1]
    D2 -->|yes| API[POST\n/discord.com/api/v9/channels/:id/messages]
    API -->|non-2xx| X
    API -->|2xx| OK[Log message id]
```

## Environment variables

| Variable | Required | Default | Meaning |
| --- | --- | --- | --- |
| `DISCORD_TOKEN` | yes | — | `Authorization` header value (e.g. `Bot <token>`, or a user/bearer token). |
| `DISCORD_CHANNEL_ID` | yes | — | Target Discord channel id. |
| `DISCORD_MESSAGE` | yes | — | Message content to post. |
| `CRON_SCHEDULE` | for scheduled runs | — | Crontab expression in **UTC** the scheduler runs on. Also anchors the send window (see below). |
| `SEND_WINDOW_MINUTES` | no | `30` | How many minutes after a scheduled run a send is still accepted. |
| `SEND_DAY` | no | `odd` | `odd` / `even`: only send when the current **GMT+5** day-of-month has that parity. `off` disables sending. |
| `MANUAL_SEND` | no | `false` | `true` forces an immediate send, skipping the window and `SEND_DAY` gates (for one-shot/manual testing). |
| `RUN_ON_START` | no | — | Set to `true` (cron.js only) to run the job once at container startup. |

## The send window is not hardcoded

A run is accepted only within `SEND_WINDOW_MINUTES` of the **most recent run
of `CRON_SCHEDULE`** (computed in UTC by a small built-in cron parser in
`send-message.js`). Changing `CRON_SCHEDULE` moves the window automatically;
there are no hardcoded fire times.

This exists so that a delayed or duplicated invocation (e.g. a container that
restarts mid-day and re-runs) cannot post outside the intended time. A run
outside the window is a **hard failure** (throws → container crashes → Docker
restarts), not a silent skip.

`MANUAL_SEND=true` bypasses both the window and the `SEND_DAY` gate and posts
immediately — intended only for one-shot tests.

### Supported cron syntax

Mirrors what node-cron accepts for this use case:

- 5 standard fields: `minute hour day-of-month month day-of-week`
- optional leading **seconds** field (6 fields, seconds are ignored — the
  window only needs minute precision)
- nicknames: `@yearly`/`@annually`, `@monthly`, `@weekly`, `@daily`/`@midnight`, `@hourly`
- numbers, steps `*/n`, ranges `a-b` (incl. `a-b/n`), lists `a,b`
- month names (`JAN`–`DEC`) and weekday names (`SUN`–`SAT`)
- `?` as a wildcard in the day-of-month / day-of-week fields
- day-of-week `0` and `7` both mean Sunday
- day-of-month and day-of-week follow vixie-cron OR semantics when both are restricted

Not supported (will fail loudly): `L`, `W`, `#` modifiers.

## Running

### Scheduler container (production)

```bash
docker build -f docker/cron.Dockerfile -t ramz001/cronbot-cron:latest .
docker compose up -d cron-prod
```

The container runs `cron.js`, which stays alive between runs and executes on
`CRON_SCHEDULE` (UTC). Any failure (bad config, outside the window, Discord
non-2xx like 401) crashes the process with exit code 1; `restart:
unless-stopped` brings it back and the error is loud in `docker logs`.

### One-shot / manual (CLI)

```bash
# Manual send right now, regardless of time/day (skips all gates):
docker compose run --rm -e MANUAL_SEND=true cron-prod node send-message.js

# Locally, with gates enforced (uses .env values):
node send-message.js
```

### Quick container sanity check

```bash
docker run --rm -e RUN_ON_START=true -e MANUAL_SEND=true \
  -e DISCORD_TOKEN=invalid -e DISCORD_CHANNEL_ID=1071376204705312801 \
  -e DISCORD_MESSAGE=x -e CRON_SCHEDULE="0 0 * * *" \
  ramz001/cronbot-cron:latest
# → expected: 401 Discord failure, exit code 1
```

## Testing

Tests are mock-based — they stub `global.fetch` (no real Discord calls) and
inject the current time into `run(env, now)`, so they are deterministic and
offline.

```bash
cd apps/cron-script
npm test          # node --test, 32 tests: parser, window math, run() gates, API errors
```

## Example `.env`

```dotenv
DISCORD_TOKEN="<token>"
DISCORD_CHANNEL_ID=1071376204705312801
DISCORD_MESSAGE="Hello this is test"
SEND_DAY="odd"
CRON_SCHEDULE="00 22 * * *"
SEND_WINDOW_MINUTES=30
MANUAL_SEND=false
```

Notes:

- `CRON_SCHEDULE` is UTC. `00 22 * * *` = 22:00 UTC = 03:00 next day in GMT+5.
- `SEND_DAY` parity is evaluated on the **GMT+5** day-of-month.
- Keep `MANUAL_SEND=false` in production, otherwise every scheduled fire posts
  unconditionally.
