// WRITE YOUR JS CODE HERE

//variables
const base_URL =
  "https://api.nasa.gov/planetary/apod?api_key=bU7WaOFtMVnWeJGvbySkFHQt5WestD49c69xOgQa";
const section_1 = document.querySelector('[data-section="today-in-space"]');
const section_2 = document.querySelector('[data-section="launches"]');
const section_3 = document.querySelector('[data-section="planets"]');
const todayInSpace = document.getElementById("today-in-space");
const launches = document.getElementById("launches");
const planets = document.getElementById("planets");

section_1.addEventListener("click", () => {
  todayInSpace.classList.remove("hidden");
  launches.classList.add("hidden");
  planets.classList.add("hidden");
});

section_2.addEventListener("click", () => {
  todayInSpace.classList.add("hidden");
  launches.classList.remove("hidden");
  planets.classList.add("hidden");
});

section_3.addEventListener("click", () => {
  todayInSpace.classList.add("hidden");
  launches.classList.add("hidden");
  planets.classList.remove("hidden");
});
