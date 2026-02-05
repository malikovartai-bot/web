const posterList = document.getElementById("poster-list");
const seasonYear = document.getElementById("season-year");
const seasonYearFooter = document.getElementById("season-year-footer");

if (seasonYear) {
  const currentYear = new Date().getFullYear();
  seasonYear.textContent = currentYear;
}

if (seasonYearFooter) {
  const currentYear = new Date().getFullYear();
  seasonYearFooter.textContent = currentYear;
}

const placeholderImage =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='640' height='420'><rect width='640' height='420' fill='%23141418'/><rect x='80' y='120' width='480' height='200' fill='%230b0b0c'/><circle cx='320' cy='210' r='90' fill='%23d7b26d' opacity='0.4'/></svg>";

const posterShows = [
  {
    title: "Мой бедный Марат",
    venue: "Камерная сцена на Арбате",
    date: "20 февраля",
    time: "18:00",
    image:
      "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=900&q=80",
    widgetUrl: "https://iframeab-pre2514.intickets.ru/",
  },
  {
    title: "Окна. Город. Любовь...",
    venue: "Сцена на Таганке",
    date: "7 февраля",
    time: "19:00",
    image:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=900&q=80",
    widgetUrl: "https://iframeab-pre2514.intickets.ru/",
  },
  {
    title: "Примадонны",
    venue: "Большая сцена, театр на Садовом",
    date: "25 февраля",
    time: "19:00",
    image:
      "https://images.unsplash.com/photo-1507924538820-ede94a04019d?auto=format&fit=crop&w=900&q=80",
    widgetUrl: "https://iframeab-pre2514.intickets.ru/",
  },
];

const renderShows = (shows) => {
  if (!posterList) return;
  if (!Array.isArray(shows) || shows.length === 0) {
    posterList.innerHTML = `
      <article class="poster-card">
        <img src="${placeholderImage}" alt="Скоро новые спектакли" />
        <span class="date">Скоро</span>
        <h3>Афиша обновляется</h3>
        <div class="poster-actions">
          <a class="primary-button" href="#info">Связаться</a>
        </div>
      </article>
      `;
    return;
  }
  posterList.innerHTML = shows
    .map((show) => {
      const image = show.image || show.images?.[0]?.url || show.images?.[0] || "";
      const date = show.date || "";
      const time = show.time || "";
      const title = show.title || "Спектакль";
      const venue = show.venue || "Сцена AMMA Театр";
      const widgetUrl = show.widgetUrl || "https://iframeab-pre2514.intickets.ru/";
      const dateTime = [date, time].filter(Boolean).join(" · ");
      return `
        <article class="poster-card">
          <img src="${image || placeholderImage}" alt="${title}" />
          <span class="date">${dateTime}</span>
          <h3>${title}</h3>
          <p class="venue">${venue}</p>
          <div class="poster-actions">
            <a class="primary-button" href="${widgetUrl}" target="_blank" rel="noreferrer">
              Купить билет от 1000р
            </a>
          </div>
        </article>
      `;
    })
    .join("");
};

renderShows(posterShows);
