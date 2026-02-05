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
  slides: [],
  shows: [],
  team: [],
};

const loadData = () =>
  JSON.parse(localStorage.getItem(storageKey)) || defaultData;

const saveData = (data) => {
  localStorage.setItem(storageKey, JSON.stringify(data));
};

const heroForm = document.getElementById("hero-form");
const showForm = document.getElementById("show-form");
const teamForm = document.getElementById("team-form");
const showList = document.getElementById("show-list");
const teamList = document.getElementById("team-list");

const populateForms = () => {
  const data = loadData();
  heroForm.title.value = data.hero.title;
  heroForm.subtitle.value = data.hero.subtitle;
  heroForm.about.value = data.about.text;
  heroForm.footer.value = data.footer;
};

const renderList = () => {
  const data = loadData();
  showList.innerHTML = data.shows
    .map(
      (show, index) => `
        <div class="admin-list-item">
          <div>
            <strong>${show.title}</strong>
            <p>${show.date} · ${show.place}</p>
          </div>
          <button type="button" data-action="remove-show" data-index="${index}">Удалить</button>
        </div>
      `
    )
    .join("");

  teamList.innerHTML = data.team
    .map(
      (person, index) => `
        <div class="admin-list-item">
          <div>
            <strong>${person.name}</strong>
            <p>${person.role}</p>
          </div>
          <button type="button" data-action="remove-team" data-index="${index}">Удалить</button>
        </div>
      `
    )
    .join("");
};

heroForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = loadData();
  data.hero.title = heroForm.title.value;
  data.hero.subtitle = heroForm.subtitle.value;
  data.about.text = heroForm.about.value;
  data.footer = heroForm.footer.value;
  saveData(data);
  alert("Тексты обновлены!");
});

showForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = loadData();
  data.shows.unshift({
    title: showForm.title.value,
    date: showForm.date.value,
    place: showForm.place.value,
    description: showForm.description.value,
    tag: showForm.tag.value,
    link: showForm.link.value,
  });
  saveData(data);
  showForm.reset();
  renderList();
});

teamForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = loadData();
  data.team.unshift({
    name: teamForm.name.value,
    role: teamForm.role.value,
    photo: teamForm.photo.value,
  });
  saveData(data);
  teamForm.reset();
  renderList();
});

const handleRemove = (event) => {
  if (event.target.tagName !== "BUTTON") return;
  const action = event.target.dataset.action;
  const index = Number(event.target.dataset.index);
  const data = loadData();
  if (action === "remove-show") {
    data.shows.splice(index, 1);
  }
  if (action === "remove-team") {
    data.team.splice(index, 1);
  }
  saveData(data);
  renderList();
};

showList.addEventListener("click", handleRemove);
teamList.addEventListener("click", handleRemove);

populateForms();
renderList();
