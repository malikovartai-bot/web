const DEFAULT_BASE_URL = "https://api.intickets.ru/widget/v2_2";
const DEFAULT_TIMEOUT_MS = 8000;
const DEFAULT_RETRIES = 2;

const getEnv = (key, fallback) => {
  const value = process.env[key];
  return value === undefined || value === "" ? fallback : value;
};

const buildHeaders = () => {
  const apiKey = process.env.INTICKETS_API_KEY;
  if (!apiKey) {
    throw new Error("INTICKETS_API_KEY is not set");
  }

  return {
    "Content-Type": "application/json",
    "X-API-KEY": apiKey,
    Authorization: `Bearer ${apiKey}`,
  };
};

const postJson = async (endpoint, payload = {}, retries = DEFAULT_RETRIES) => {
  const baseUrl = getEnv("INTICKETS_API_BASE_URL", DEFAULT_BASE_URL);
  const url = `${baseUrl}${endpoint}`;
  const timeoutMs = Number(getEnv("INTICKETS_TIMEOUT_MS", DEFAULT_TIMEOUT_MS));
  const headers = buildHeaders();

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Intickets ${endpoint} failed: ${response.status} ${text}`);
      }

      return await response.json();
    } catch (error) {
      if (attempt >= retries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
    } finally {
      clearTimeout(timeoutId);
    }
  }

  throw new Error(`Intickets ${endpoint} failed after retries`);
};

const pick = (value, fallback = null) => (value === undefined ? fallback : value);

const normalizeShow = (show) => {
  const event = show.event || show.Event || {};
  const venue = show.venue || show.Venue || {};
  const city = show.city || venue.city || show.City || {};
  const address = show.address || venue.address || show.Address || null;

  return {
    show_id: show.show_id || show.id || show.ShowId || null,
    event_id: show.event_id || event.event_id || event.id || null,
    title: show.title || event.title || event.name || show.name || "Без названия",
    images: pick(show.images, event.images) || [],
    date: show.date || show.datetime || show.start || null,
    time: show.time || null,
    venue: venue.title || venue.name || null,
    city: city.name || city.title || null,
    address,
    age_limit: show.age_limit || event.age_limit || null,
    cost_min: show.min_price || show.cost_min || event.cost_min || null,
    cost_max: show.max_price || show.cost_max || event.cost_max || null,
    sale_status: show.sale_status || show.status || null,
    booking_status: show.booking_status || null,
    sold_out: Boolean(show.sold_out || show.soldOut),
    widgetUrl: show.widget_url || show.widgetUrl || null,
  };
};

const normalizeEvent = (event) => ({
  event_id: event.event_id || event.id || null,
  title: event.title || event.name || "Без названия",
  images: event.images || [],
  venue: event.venue || null,
  city: event.city || null,
  address: event.address || null,
  age_limit: event.age_limit || null,
  cost_min: event.cost_min || null,
  cost_max: event.cost_max || null,
  sale_status: event.sale_status || event.status || null,
  booking_status: event.booking_status || null,
});

const normalizeNode = (node) => ({
  nid: node.nid || node.id || null,
  title: node.title || node.name || "Без названия",
  images: node.images || [],
});

const getEvents = async () => {
  const data = await postJson("/events/", {});
  const items = data?.data || data?.events || data?.Events || data || [];
  return Array.isArray(items) ? items.map(normalizeEvent) : [];
};

const getEvent = async (eventId) => {
  const data = await postJson("/events/", { event_id: eventId });
  const event = data?.data?.[0] || data?.event || data?.Event || data?.data || data;
  return normalizeEvent(event || {});
};

const getShows = async (params = {}) => {
  const data = await postJson("/shows/", params);
  const items = data?.data || data?.shows || data?.Shows || data || [];
  return Array.isArray(items) ? items.map(normalizeShow) : [];
};

const getShow = async (showId) => {
  const data = await postJson("/shows/", { show_id: showId });
  const show = data?.data?.[0] || data?.show || data?.Show || data?.data || data;
  return normalizeShow(show || {});
};

const getNode = async (nid, params = {}) => {
  const data = await postJson("/node/", { nid, ...params });
  const node = data?.data?.[0] || data?.node || data?.Node || data?.data || data;
  return normalizeNode(node || {});
};

module.exports = {
  getEvents,
  getEvent,
  getShows,
  getShow,
  getNode,
};
