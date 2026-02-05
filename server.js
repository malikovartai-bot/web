const express = require("express");
const fs = require("fs");
const path = require("path");
const {
  getEvents,
  getEvent,
  getShows,
  getShow,
  getNode,
} = require("./lib/inticketsClient");

const app = express();
const PORT = process.env.PORT || 3000;
const LOG_DIR = path.join(__dirname, "logs");
const WEBHOOK_LOG = path.join(LOG_DIR, "intickets-webhooks.jsonl");
const PAID_LOG = path.join(LOG_DIR, "intickets-paid.jsonl");

const webhookCache = new Map();
const WEBHOOK_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const ensureLogsDir = async () => {
  await fs.promises.mkdir(LOG_DIR, { recursive: true });
};

const appendJsonLine = async (filePath, data) => {
  const line = `${JSON.stringify(data)}\n`;
  await fs.promises.appendFile(filePath, line, "utf8");
};

const cleanupWebhookCache = () => {
  const now = Date.now();
  for (const [uuid, timestamp] of webhookCache.entries()) {
    if (now - timestamp > WEBHOOK_TTL_MS) {
      webhookCache.delete(uuid);
    }
  }
};

app.use(express.json({ limit: "2mb" }));
app.use(express.static(__dirname));

app.get("/buy/:showId", (req, res) => {
  res.sendFile(path.join(__dirname, "buy.html"));
});

app.get("/api/intickets/events", async (req, res) => {
  try {
    const events = await getEvents();
    res.json({ data: events });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/intickets/events/:eventId", async (req, res) => {
  try {
    const event = await getEvent(req.params.eventId);
    res.json({ data: event });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/intickets/shows", async (req, res) => {
  try {
    const params = {
      from: req.query.from,
      to: req.query.to,
      closed: req.query.closed,
      event_id: req.query.event_id,
      venue_id: req.query.venue_id,
    };
    const shows = await getShows(params);
    res.json({ data: shows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/intickets/shows/:showId", async (req, res) => {
  try {
    const show = await getShow(req.params.showId);
    res.json({ data: show });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/intickets/node/:nid", async (req, res) => {
  try {
    const node = await getNode(req.params.nid, {
      closed: req.query.closed,
    });
    res.json({ data: node });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/intickets/webhook", async (req, res) => {
  res.status(200).json({ ok: true });
  cleanupWebhookCache();

  try {
    await ensureLogsDir();
    const payload = req.body || {};
    const uuid = payload.uuid;
    const event = payload.Event;
    const order = payload?.Context?.Order || {};
    const tickets = payload?.Context?.Tickets?.Current || [];
    const customer = payload?.Context?.Customer || {};
    const source = payload?.Context?.Source || {};

    if (!uuid) {
      await appendJsonLine(WEBHOOK_LOG, {
        received_at: new Date().toISOString(),
        error: "missing uuid",
        payload,
      });
      return;
    }

    if (webhookCache.has(uuid)) {
      return;
    }

    webhookCache.set(uuid, Date.now());

    const logEntry = {
      received_at: new Date().toISOString(),
      uuid,
      event,
      order_num: order.num || null,
      order_status: order.status || null,
      payment_dt: order.paymentDt || order.payment_date || null,
      sum: order.sum || null,
      show: order.show || order.show_id || null,
      event_id: order.event || order.event_id || null,
      widget_url: source.widgetUrl || source.widget_url || null,
      email: customer.email || null,
      phone: customer.phone || null,
    };

    await appendJsonLine(WEBHOOK_LOG, logEntry);

    if (event === "OrderPayed") {
      await appendJsonLine(PAID_LOG, logEntry);
    }
  } catch (error) {
    try {
      await ensureLogsDir();
      await appendJsonLine(WEBHOOK_LOG, {
        received_at: new Date().toISOString(),
        error: error.message,
      });
    } catch (innerError) {
      console.error("Failed to log webhook error", innerError);
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
