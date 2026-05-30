## 🧱 Create migration (dev)

```bash
npx prisma migrate dev --name <name>
```

**Flags:**

* `--create-only` → create SQL only, don’t run it
* `--schema` → custom schema path

---

## 🚀 Apply migrations (prod / self-host)

```bash
npx prisma migrate deploy
```

---

## 🔄 Reset DB (dev only)

```bash
npx prisma migrate reset
```

**Flags:**

* `--force` → skip prompt
* `--skip-seed` → don’t run seed

---

## 🧠 Fix migration state

```bash
npx prisma migrate resolve --applied <migration_name>
npx prisma migrate resolve --rolled-back <migration_name>
```

---

## 🔍 Check status

```bash
npx prisma migrate status
```

---

## 🧪 Schema push (NOT migrations)

```bash
npx prisma db push
```

---

## 🔑 Rule

* dev → `migrate dev`
* prod → `migrate deploy`
* avoid `db push` for SaaS

---
