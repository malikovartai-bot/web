
const shows = [
  {
    title: "Человек без свойств",
    date: "12 мая · 19:30",
    image:
      "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"640\" height=\"420\"><rect width=\"640\" height=\"420\" fill=\"%23141418\"/><circle cx=\"320\" cy=\"200\" r=\"120\" fill=\"%23d7b26d\" opacity=\"0.4\"/><rect x=\"110\" y=\"260\" width=\"420\" height=\"120\" fill=\"%230b0b0c\" opacity=\"0.7\"/></svg>",
    link: "https://intickets.ru/event/amma-1",
  },
  {
    title: "Почти идеальный шторм",
    date: "18 мая · 20:00",
    image:
      "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"640\" height=\"420\"><rect width=\"640\" height=\"420\" fill=\"%230b0b0c\"/><rect x=\"80\" y=\"90\" width=\"480\" height=\"240\" fill=\"%23d7b26d\" opacity=\"0.35\"/><rect x=\"120\" y=\"130\" width=\"400\" height=\"160\" fill=\"%23141418\"/></svg>",
    link: "https://intickets.ru/event/amma-2",
  },
  {
    title: "Эхо тишины",
    date: "26 мая · 18:30",
    image:
      "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"640\" height=\"420\"><rect width=\"640\" height=\"420\" fill=\"%23141418\"/><path d=\"M0 320 Q160 240 320 320 T640 320 L640 420 L0 420 Z\" fill=\"%23d7b26d\" opacity=\"0.35\"/><circle cx=\"420\" cy=\"180\" r=\"70\" fill=\"%23f5f5f5\" opacity=\"0.15\"/></svg>",
    link: "https://intickets.ru/event/amma-3",
  },
  {
    title: "Открытая сцена",
    date: "2 июня · 19:00",
    image:
      "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"640\" height=\"420\"><rect width=\"640\" height=\"420\" fill=\"%230f0f12\"/><rect x=\"100\" y=\"80\" width=\"440\" height=\"260\" fill=\"%230b0b0c\"/><rect x=\"140\" y=\"120\" width=\"360\" height=\"180\" fill=\"%23d7b26d\" opacity=\"0.3\"/></svg>",
    link: "https://intickets.ru/event/amma-4",
  },
];

const posterTrack = document.getElementById("poster-track");

posterTrack.innerHTML = shows
  .map(
    (show) => `
      <article class="poster-card">
        <img src="${show.image}" alt="${show.title}" />
        <span class="date">${show.date}</span>
        <h3>${show.title}</h3>
        <div class="poster-actions">
          <a class="primary-button" href="${show.link}" target="_blank" rel="noreferrer">Купить билет</a>
          <button class="secondary-button" type="button">Подробнее</button>

        </div>
      </article>
    `
  )
  .join("");

codex/create-website-from-scratch-based-on-amma-production.ru-isq19n
const prevButton = document.querySelector(".carousel-control.prev");
const nextButton = document.querySelector(".carousel-control.next");

const scrollByCard = (direction) => {
  const cardWidth = posterTrack.querySelector(".poster-card")?.offsetWidth || 260;
  posterTrack.scrollBy({ left: direction * (cardWidth + 24), behavior: "smooth" });
};

prevButton.addEventListener("click", () => scrollByCard(-1));
nextButton.addEventListener("click", () => scrollByCard(1));
