const posterTrack = document.getElementById("poster-track");
const posterError = document.getElementById("poster-error");
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

const renderShows = (shows) => {
  if (!posterTrack) return;
  if (posterError) {
    posterError.textContent = "";
    posterError.style.display = "none";
  }
  if (!Array.isArray(shows) || shows.length === 0) {
    posterTrack.innerHTML = `
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
  posterTrack.innerHTML = shows
    .map((show) => {
      const image = show.images?.[0]?.url || show.images?.[0] || "";
      const date = show.date || "";
      const time = show.time || "";
      const title = show.title || "Спектакль";
      const showId = show.show_id || "";
      const dateTime = [date, time].filter(Boolean).join(" · ");
      return `
        <article class="poster-card">
          <img src="${image || placeholderImage}" alt="${title}" />
          <span class="date">${dateTime}</span>
          <h3>${title}</h3>
          <div class="poster-actions">
            <a class="primary-button" href="/buy/${showId}">Купить билет</a>
            <button class="secondary-button" type="button">Подробнее</button>
          </div>
        </article>
      `;
    })
    .join("");
};

const fetchShows = async () => {
  try {
    const response = await fetch("/api/intickets/shows?closed=0");
    let payload;
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`HTTP ${response.status}: ${text}`);
    }
    payload = await response.json();
    const shows = payload.data || [];
    if (!Array.isArray(shows) || shows.length === 0) {
      throw new Error("No shows returned");
    }
    renderShows(shows);
  } catch (error) {
    console.error("Intickets shows load failed:", error);
    if (posterError) {
      posterError.textContent =
        "Ошибка загрузки афиши: " +
        (error?.message || "неизвестная ошибка") +
        ". Скопируйте этот текст и отправьте.";
      posterError.style.display = "block";
    }
    renderShows([]);
  }
};

fetchShows();

const prevButton = document.querySelector(".carousel-control.prev");
const nextButton = document.querySelector(".carousel-control.next");

const scrollByCard = (direction) => {
  if (!posterTrack) return;
  const cardWidth = posterTrack.querySelector(".poster-card")?.offsetWidth || 260;
  posterTrack.scrollBy({ left: direction * (cardWidth + 24), behavior: "smooth" });
};

if (prevButton) {
  prevButton.addEventListener("click", () => scrollByCard(-1));
}

if (nextButton) {
  nextButton.addEventListener("click", () => scrollByCard(1));
}
