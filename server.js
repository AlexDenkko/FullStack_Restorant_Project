"use strict";
// Node.js backend. The browser still uses only HTML, CSS and vanilla JavaScript.
const express = require("express");
const session = require("express-session");
const mariadb = require("mariadb");
const multer = require("multer");
const crypto = require("node:crypto");
const path = require("node:path");
const fs = require("node:fs");

const app = express();
const PORT = Number(process.env.PORT || 8000);
const isProduction = process.env.NODE_ENV === "production";
if (
  isProduction &&
  (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32)
) {
  throw new Error("Production requires SESSION_SECRET (32+ characters).");
}
if (isProduction) app.set("trust proxy", 1); // Only deploy behind a trusted HTTPS reverse proxy.
app.disable("x-powered-by");
app.use((req, res, next) => {
  res.set("X-Content-Type-Options", "nosniff");
  res.set("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});
app.use(express.json({ limit: "64kb" }));
app.use(
  session({
    name: "opiskelijalounas.sid",
    secret:
      process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex"),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
      maxAge: 1000 * 60 * 60 * 8,
    },
  }),
);
// MemoryStore is suitable only for local development; use a persistent session store for deployment.
const pool = mariadb.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "lounas_app",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "opiskelijalounas",
  connectionLimit: 5,
});
const apiBase = (
  process.env.RESTAURANT_API_BASE ||
  "https://media2.edu.metropolia.fi/restaurant/api/v1"
).replace(/\/$/, "");
function error(message, status = 400) {
  const e = new Error(message);
  e.status = status;
  throw e;
}
function str(obj, key, max) {
  const value = obj?.[key];
  if (
    typeof value !== "string" ||
    !value.trim() ||
    [...value.trim()].length > max
  )
    error(`Virheellinen kenttä: ${key}`);
  return value.trim();
}
function email(obj) {
  const v = str(obj, "email", 190).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
    error("Virheellinen sähköpostiosoite.");
  return v;
}
function username(obj) {
  const v = str(obj, "username", 50);
  if ([...v].length < 2) error("Käyttäjänimen on oltava vähintään 2 merkkiä.");
  return v;
}
function password(obj) {
  const v = str(obj, "password", 1000);
  if (v.length < 10) error("Salasanassa pitää olla vähintään 10 merkkiä.");
  return v;
}
function restaurantId(obj) {
  const id = str(obj, "restaurantId", 80);
  if (!/^[a-zA-Z0-9_-]{1,80}$/.test(id))
    error("Virheellinen ravintolatunniste.");
  return id;
}
function requireLogin(req) {
  if (!req.session.userId) error("Kirjautuminen vaaditaan.", 401);
  return req.session.userId;
}
function csrf(req) {
  if (!req.session.csrf)
    req.session.csrf = crypto.randomBytes(32).toString("hex");
  return req.session.csrf;
}
function checkCsrf(req, res, next) {
  if (req.method === "GET") return next();
  const token = req.get("X-CSRF-Token") || "";
  if (
    !req.session.csrf ||
    token.length !== req.session.csrf.length ||
    !crypto.timingSafeEqual(Buffer.from(token), Buffer.from(req.session.csrf))
  )
    return res
      .status(403)
      .json({ error: "Istunnon vahvistus puuttuu. Päivitä sivu." });
  next();
}
function safe(fn) {
  return (req, res, next) =>
    Promise.resolve()
      .then(() => fn(req, res))
      .catch(next);
}
async function userById(id) {
  const rows = await pool.query(
    "SELECT id, username, email, avatar_mime FROM users WHERE id = ?",
    [id],
  );
  if (!rows[0]) return null;
  const u = rows[0];
  return {
    id: Number(u.id),
    username: u.username,
    email: u.email,
    hasAvatar: u.avatar_mime !== null,
  };
}
async function favoritesFor(id) {
  const rows = await pool.query(
    "SELECT restaurant_id FROM favorites WHERE user_id = ? ORDER BY created_at DESC",
    [id],
  );
  return rows.map((x) => x.restaurant_id);
}
function databaseError(e) {
  if (e.code === "ER_DUP_ENTRY") error("Sähköpostiosoite on jo käytössä.", 409);
  throw e;
}
function hashPassword(value) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(value, salt, 64);
  return `scrypt:${salt.toString("hex")}:${hash.toString("hex")}`;
}
function verifyPassword(value, stored) {
  const parts = String(stored || "").split(":");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  try {
    const expected = Buffer.from(parts[2], "hex");
    const actual = crypto.scryptSync(
      value,
      Buffer.from(parts[1], "hex"),
      expected.length,
    );
    return (
      expected.length === actual.length &&
      crypto.timingSafeEqual(expected, actual)
    );
  } catch {
    return false;
  }
}
function renewSession(req) {
  return new Promise((resolve, reject) =>
    req.session.regenerate((err) => (err ? reject(err) : resolve())),
  );
}
const api = express.Router();
api.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});
api.use(checkCsrf);
api.get(
  "/",
  safe(async (req, res) => {
    const action = String(req.query.action || "");
    if (action === "me") {
      const user = req.session.userId
        ? await userById(req.session.userId)
        : null;
      if (!user) delete req.session.userId;
      return res.json({
        user,
        favorites: user ? await favoritesFor(user.id) : [],
        csrf: csrf(req),
      });
    }
    if (action === "avatar") {
      const id = requireLogin(req);
      const rows = await pool.query(
        "SELECT avatar_mime, avatar_data FROM users WHERE id = ?",
        [id],
      );
      if (!rows[0]?.avatar_data) error("Profiilikuva puuttuu.", 404);
      res.type(rows[0].avatar_mime);
      return res.send(rows[0].avatar_data);
    }
    if (action === "restaurants" || action === "menu") {
      let suffix = "restaurants";
      if (action === "menu") {
        const id = String(req.query.id || "");
        const period = String(req.query.period || "day");
        const lang = String(req.query.lang || "fi");
        if (
          !/^[a-zA-Z0-9_-]{1,80}$/.test(id) ||
          !["day", "week"].includes(period) ||
          !["fi", "en"].includes(lang)
        )
          error("Virheelliset ruokalistaparametrit.");
        suffix = `restaurants/${period === "day" ? "daily" : "weekly"}/${encodeURIComponent(id)}/${lang}`;
      }
      if (!apiBase.startsWith("https://"))
        error("Ravintolarajapinnan on käytettävä HTTPS:ää.", 500);
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12000);
      try {
        const upstream = await fetch(`${apiBase}/${suffix}`, {
          headers: { Accept: "application/json" },
          signal: controller.signal,
          redirect: "error",
        });
        if (!upstream.ok) error("Ravintolarajapinta ei vastannut.", 502);
        const raw = await upstream.text();
        if (raw.length > 3 * 1024 * 1024)
          error("Rajapinnan vastaus on liian suuri.", 502);
        let data;
        try {
          data = JSON.parse(raw);
        } catch {
          error("Ravintolarajapinta palautti virheellistä tietoa.", 502);
        }
        return res.json(data);
      } catch (e) {
        if (!e.status)
          error("Ravintolarajapinta ei vastannut. Tarkista API-osoite.", 502);
        throw e;
      } finally {
        clearTimeout(timer);
      }
    }
    error("Tuntematon rajapintakutsu.", 404);
  }),
);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
});
function imageMime(b) {
  if (
    b.length >= 8 &&
    b.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex"))
  )
    return "image/png";
  if (
    b.length >= 4 &&
    b[0] === 0xff &&
    b[1] === 0xd8 &&
    b[b.length - 2] === 0xff &&
    b[b.length - 1] === 0xd9
  )
    return "image/jpeg";
  if (
    b.length >= 12 &&
    b.toString("ascii", 0, 4) === "RIFF" &&
    b.toString("ascii", 8, 12) === "WEBP"
  )
    return "image/webp";
  return null;
}
api.post(
  "/",
  (req, res, next) => {
    if (req.query.action !== "avatar") return next();
    upload.single("avatar")(req, res, next);
  },
  safe(async (req, res) => {
    const action = String(req.query.action || "");
    if (action === "register") {
      const name = username(req.body),
        mail = email(req.body),
        pw = password(req.body);
      let result;
      try {
        result = await pool.query(
          "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
          [name, mail, hashPassword(pw)],
        );
      } catch (e) {
        databaseError(e);
      }
      await renewSession(req);
      req.session.userId = Number(result.insertId);
      csrf(req);
      return res.status(201).json({
        user: await userById(req.session.userId),
        favorites: [],
        csrf: req.session.csrf,
      });
    }
    if (action === "login") {
      const now = Date.now();
      req.session.attempts = (req.session.attempts || []).filter(
        (t) => t > now - 15 * 60 * 1000,
      );
      if (req.session.attempts.length >= 8)
        error("Liian monta yritystä. Yritä myöhemmin uudelleen.", 429);
      const mail = email(req.body),
        pw = str(req.body, "password", 1000);
      const rows = await pool.query(
        "SELECT id, password_hash FROM users WHERE email = ?",
        [mail],
      );
      if (!rows[0] || !verifyPassword(pw, rows[0].password_hash)) {
        req.session.attempts.push(now);
        error("Sähköposti tai salasana on virheellinen.", 401);
      }
      const id = Number(rows[0].id);
      await renewSession(req);
      req.session.userId = id;
      csrf(req);
      return res.json({
        user: await userById(id),
        favorites: await favoritesFor(id),
        csrf: req.session.csrf,
      });
    }
    if (action === "logout") {
      await new Promise((resolve, reject) =>
        req.session.destroy((e) => (e ? reject(e) : resolve())),
      );
      res.clearCookie("opiskelijalounas.sid");
      return res.json({ ok: true });
    }
    if (action === "profile") {
      const id = requireLogin(req),
        name = username(req.body),
        mail = email(req.body);
      try {
        await pool.query(
          "UPDATE users SET username = ?, email = ? WHERE id = ?",
          [name, mail, id],
        );
      } catch (e) {
        databaseError(e);
      }
      return res.json({ user: await userById(id) });
    }
    if (action === "favorite") {
      const id = requireLogin(req),
        rid = restaurantId(req.body);
      await pool.query(
        "INSERT IGNORE INTO favorites (user_id, restaurant_id) VALUES (?, ?)",
        [id, rid],
      );
      return res.json({ ok: true });
    }
    if (action === "avatar") {
      const id = requireLogin(req),
        file = req.file;
      if (!file || !file.size || !imageMime(file.buffer))
        error("Sallittuja ovat JPG-, PNG- ja WebP-kuvat (enintään 2 Mt).");
      const mime = imageMime(file.buffer);
      await pool.query(
        "UPDATE users SET avatar_data = ?, avatar_mime = ? WHERE id = ?",
        [file.buffer, mime, id],
      );
      return res.json({ ok: true });
    }
    error("Tuntematon rajapintakutsu.", 404);
  }),
);
api.delete(
  "/",
  safe(async (req, res) => {
    if (req.query.action !== "favorite")
      error("Tuntematon rajapintakutsu.", 404);
    const id = requireLogin(req),
      rid = restaurantId(req.body);
    await pool.query(
      "DELETE FROM favorites WHERE user_id = ? AND restaurant_id = ?",
      [id, rid],
    );
    res.json({ ok: true });
  }),
);
app.use("/api", api);
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));
app.get("/index.html", (req, res) =>
  res.sendFile(path.join(__dirname, "index.html")),
);
app.get("/style.css", (req, res) =>
  res.sendFile(path.join(__dirname, "style.css")),
);
app.get("/script.js", (req, res) =>
  res.sendFile(path.join(__dirname, "script.js")),
);
app.use((req, res) => res.status(404).send("Not found"));
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError)
    return res
      .status(400)
      .json({ error: "Kuva on liian suuri tai virheellinen." });
  if (err.status) return res.status(err.status).json({ error: err.message });
  console.error("Server error:", err);
  res.status(500).json({ error: "Palvelimella tapahtui virhe." });
});
app.listen(PORT, () =>
  console.log(`Opiskelijalounas: http://localhost:${PORT}`),
);
