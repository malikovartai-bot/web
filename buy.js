const iframeBaseUrl =
  window.INTICKETS_IFRAME_BASE_URL ||
  "https://iframeab-pre2514.intickets.ru/";

const getShowId = () => {
  const parts = window.location.pathname.split("/").filter(Boolean);
  const buyIndex = parts.indexOf("buy");
  if (buyIndex !== -1 && parts[buyIndex + 1]) {
    return parts[buyIndex + 1];
  }
  const params = new URLSearchParams(window.location.search);
  return params.get("showId");
};

const buildIframeUrl = (showId) => {
  const url = new URL(iframeBaseUrl);
  url.searchParams.set("show_id", showId);

  const params = new URLSearchParams(window.location.search);
  ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach(
    (key) => {
      const value = params.get(key);
      if (value) {
        url.searchParams.set(key, value);
      }
    }
  );

  return url.toString();
};

const init = async () => {
  const showId = getShowId();
  if (!showId) {
    document.getElementById("show-title").textContent =
      "Не удалось определить спектакль.";
    return;
  }

  try {
    const response = await fetch(`/api/intickets/shows/${showId}`);
    if (!response.ok) {
      throw new Error("Не удалось получить данные спектакля.");
    }
    const payload = await response.json();
    const show = payload.data || {};
    document.getElementById("show-title").textContent =
      show.title || "Спектакль";

    const metaParts = [show.date, show.time, show.venue, show.city]
      .filter(Boolean)
      .join(" · ");
    document.getElementById("show-meta").textContent = metaParts;
  } catch (error) {
    document.getElementById("show-title").textContent =
      "Покупка билета в AMMA Театр";
  }

  const iframeUrl = buildIframeUrl(showId);
  const iframe = document.getElementById("intickets-frame");
  iframe.src = iframeUrl;
  const externalLink = document.getElementById("open-external");
  externalLink.href = iframeUrl;
};

init();
