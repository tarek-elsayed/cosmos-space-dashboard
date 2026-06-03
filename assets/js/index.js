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
const dateInput = document.getElementById("apod-date-input");
const dateShow = document.getElementById("date-show");
const apodDate = document.getElementById("apod-date");
const loadDateBtn = document.getElementById("load-date-btn");
const todayApodBtn = document.getElementById("today-apod-btn");
let standerDate;
let publicDate = "";

function setDateToday() {
  const today = new Date();
  publicDate = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  dateShow.textContent = publicDate;
  apodDate.textContent = `Astronomy Picture of the Day - ${publicDate}`;
  dateInput.max = today.toISOString().split("T")[0];

  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

    standerDate = `${year}-${month}-${day}`;

}

setDateToday();

function updateDateText() {
  const today = new Date();
  dateInput.max = today.toISOString().split("T")[0];

  const selectedDate = new Date(dateInput.value);
  publicDate = selectedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  dateShow.textContent = publicDate;
  apodDate.textContent = `Astronomy Picture of the Day - ${publicDate}`;

  const day = String(selectedDate.getDate()).padStart(2, "0");
  const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
  const year = selectedDate.getFullYear();

  standerDate = `${year}-${month}-${day}`;
}

dateInput.addEventListener("change", updateDateText);

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

function getPlanetary(date) {
  var xhr = new XMLHttpRequest();
  if (date == undefined) {
    xhr.open("GET", base_URL);
  } else {
    xhr.open("GET", base_URL + `&date=${date}`);
  }
  xhr.send();
  xhr.responseType = "json";
  xhr.addEventListener("load", function () {
    var res = xhr.response;
    console.log(res);
    displaySection1(res);
  });
}
getPlanetary();

loadDateBtn.addEventListener("click", () => {
  getPlanetary(standerDate);
});

todayApodBtn.addEventListener("click", () => {
  setDateToday();
  getPlanetary(standerDate);
});

function displaySection1(data) {
  const apodImage = document.getElementById("apod-image");
  const apodLoading = document.getElementById("apod-loading");
  const apodTitle = document.getElementById("apod-title");
  const apodDateDetail = document.getElementById("apod-date-detail");
  const apodExplanation = document.getElementById("apod-explanation");
  const apodCopyright = document.getElementById("apod-copyright");
  const apodDateInfo = document.getElementById("apod-date-info");
  const apodMediaType = document.getElementById("apod-media-type");
  const icon = document.createElement("i");
  icon.className = "far fa-calendar mr-2";

  if (data.url) {
    apodImage.classList.remove("hidden");
    apodLoading.classList.add("hidden");
    apodImage.setAttribute("src", data.url);
    apodImage.setAttribute("alt", data.title);
    apodDateDetail.appendChild(icon);
    apodDateDetail.append(data.date);
    apodExplanation.textContent = data.explanation;
    apodTitle.textContent = data.title;
    data.copyright ? apodCopyright.innerHTML = `&copy; ${data.copyright}`: apodCopyright.innerHTML = `&copy; NASA/JPL`;
    apodDateInfo.textContent = data.date;
    apodMediaType.textContent = data.media_type;
  } else {
    apodLoading.classList.remove("hidden");
    apodImage.classList.add("hidden");
    apodTitle.textContent = "Loading...";
    apodDateDetail.appendChild(icon);
    apodDateDetail.append("Loading...");
    apodExplanation.textContent = "Loading description...";
    apodDateInfo.textContent = 'Loading...';
    apodMediaType.textContent = 'Loading...';
  }
}
