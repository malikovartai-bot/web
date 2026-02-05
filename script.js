const storageKey = "ammaSiteData";

const defaultData = {
  hero: {
    title: "Современный театр с золотой искрой",
    subtitle:
      "AmmA Театр соединяет живую музыку, пластический театр и поэзию в каждом спектакле.",
  },
  about: {
    text:
      "Мы исследуем новые формы драматургии и визуального языка, создавая спектакли, которые хочется обсуждать после финального поклона.",
    highlights: [
      { title: "12", description: "премьер в репертуаре" },
      { title: "8", description: "лабораторий в год" },
      { title: "4", description: "городов на гастролях" },
    ],
  },
  footer:
    "Сцена — наше пространство диалога со зрителем. Приходите за эмоцией, оставайтесь за историей.",
  slides: [
    {
      title: "Иммерсивные показы",
      description: "Погружение в историю без границ между сценой и залом.",
      image:
        "linear-gradient(135deg, rgba(15, 15, 20, 0.65), rgba(215, 178, 109, 0.5)), url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"800\" height=\"600\"><rect width=\"800\" height=\"600\" fill=\"%230b0b0c\"/><circle cx=\"400\" cy=\"300\" r=\"180\" fill=\"%23d7b26d\" opacity=\"0.55\"/></svg>')",
    },
    {
      title: "Сезон 2024",
      description: "Новые постановки и камерные вечера." ,
      image:
        "linear-gradient(120deg, rgba(11, 11, 12, 0.7), rgba(215, 178, 109, 0.3)), url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"800\" height=\"600\"><rect width=\"800\" height=\"600\" fill=\"%23f9f8f4\"/><rect x=\"120\" y=\"120\" width=\"560\" height=\"360\" fill=\"%230b0b0c\"/><rect x=\"200\" y=\"180\" width=\"400\" height=\"240\" fill=\"%23d7b26d\" opacity=\"0.5\"/></svg>')",
    },
    {
      title: "Гастроли",
      description: "Турне по новым городам и фестивалям.",
      image:
        "linear-gradient(140deg, rgba(11, 11, 12, 0.6), rgba(215, 178, 109, 0.4)), url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"800\" height=\"600\"><rect width=\"800\" height=\"600\" fill=\"%23d7b26d\"/><path d=\"M0 420 Q200 320 400 420 T800 420 L800 600 L0 600 Z\" fill=\"%230b0b0c\"/></svg>')",
    },
  ],
  shows: [
    {
      title: "Гамлет. Версия AmmA",
      date: "14 апреля · 19:00",
      place: "Сцена «Лофт»",
      description: "Психологический триллер о выборе и ответственности.",
      tag: "Премьера",
      link: "https://intickets.ru/event/amma-hamlet",
    },
    {
      title: "Женитьба",
      date: "23 апреля · 20:00",
      place: "Камерный зал",
      description: "Комедия о том, как сложно сказать «да».",
      tag: "Комедия",
      link: "https://intickets.ru/event/amma-marriage",
    },
    {
      title: "Ночь перед Рождеством",
      date: "2 мая · 18:30",
      place: "Большая сцена",
      description: "Музыкальный спектакль с живым ансамблем.",
      tag: "Музыка и драма",
      link: "https://intickets.ru/event/amma-night",
    },
  ],
  team: [
    {
      name: "Алиса Миронова",
      role: "Художественный руководитель",
      photo:
        "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"400\" height=\"500\"><rect width=\"400\" height=\"500\" fill=\"%23f5f3ec\"/><circle cx=\"200\" cy=\"190\" r=\"90\" fill=\"%23d7b26d\"/><rect x=\"100\" y=\"280\" width=\"200\" height=\"160\" fill=\"%230b0b0c\" opacity=\"0.75\"/></svg>",
    },
    {
      name: "Илья Климов",
      role: "Режиссёр",
      photo:
        "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"400\" height=\"500\"><rect width=\"400\" height=\"500\" fill=\"%23f5f3ec\"/><rect x=\"90\" y=\"120\" width=\"220\" height=\"260\" fill=\"%230b0b0c\"/><circle cx=\"200\" cy=\"160\" r=\"70\" fill=\"%23d7b26d\" opacity=\"0.7\"/></svg>",
    },
    {
      name: "Мария Дёмина",
      role: "Продюсер",
      photo:
        "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"400\" height=\"500\"><rect width=\"400\" height=\"500\" fill=\"%23f5f3ec\"/><rect x=\"60\" y=\"140\" width=\"280\" height=\"200\" fill=\"%23d7b26d\" opacity=\"0.6\"/><rect x=\"120\" y=\"260\" width=\"160\" height=\"160\" fill=\"%230b0b0c\" opacity=\"0.8\"/></svg>",
    },
  ],
};

const storedData = localStorage.getItem(storageKey);
if (!storedData) {
  localStorage.setItem(storageKey, JSON.stringify(defaultData));
}

const data = storedData ? JSON.parse(storedData) : defaultData;

const heroTitle = document.getElementById("hero-title");
const heroSubtitle = document.getElementById("hero-subtitle");
const slidesContainer = document.getElementById("slides");
const posterGrid = document.getElementById("poster-grid");
const aboutText = document.getElementById("about-text");
const aboutHighlights = document.getElementById("about-highlights");
const teamGrid = document.getElementById("team-grid");
const footerText = document.getElementById("footer-text");

heroTitle.textContent = data.hero.title;
heroSubtitle.textContent = data.hero.subtitle;
aboutText.textContent = data.about.text;
footerText.textContent = data.footer;

slidesContainer.innerHTML = data.slides
  .map(
    (slide) => `
      <article class="slide" style="background-image: ${slide.image}">
        <h3>${slide.title}</h3>
        <p>${slide.description}</p>
      </article>
    `
  )
  .join("");

posterGrid.innerHTML = data.shows
  .map(
    (show) => `
      <article class="poster-card">
        <span class="date">${show.date}</span>
        <h3>${show.title}</h3>
        <p class="tag">${show.tag}</p>
        <p>${show.description}</p>
        <p><strong>${show.place}</strong></p>
        <div class="poster-actions">
          <a class="primary-button" href="${show.link}" target="_blank" rel="noreferrer">Купить билет</a>
          <button class="secondary-button gold" type="button">Подробнее</button>
        </div>
      </article>
    `
  )
  .join("");

aboutHighlights.innerHTML = data.about.highlights
  .map(
    (item) => `
      <div class="highlight-card">
        <span>${item.title}</span>
        <p>${item.description}</p>
      </div>
    `
  )
  .join("");

teamGrid.innerHTML = data.team
  .map(
    (person) => `
      <article class="team-card">
        <img src="${person.photo}" alt="${person.name}" />
        <h3>${person.name}</h3>
        <p>${person.role}</p>
      </article>
    `
  )
  .join("");

let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const prevButton = document.querySelector(".slider-control.prev");
const nextButton = document.querySelector(".slider-control.next");

const updateSlide = (direction = 0) => {
  if (!slides.length) return;
  currentSlide = (currentSlide + direction + slides.length) % slides.length;
  slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
};

prevButton.addEventListener("click", () => updateSlide(-1));
nextButton.addEventListener("click", () => updateSlide(1));

setInterval(() => updateSlide(1), 7000);
