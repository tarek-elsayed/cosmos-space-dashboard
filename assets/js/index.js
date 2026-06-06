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
let launchsList;
let planetsList;

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
  section_1.classList.remove("hidden");
  section_1.classList.add("bg-blue-500/10", "text-blue-400");

  launches.classList.add("hidden");
  (section_2.classList.remove("bg-blue-500/10", "text-blue-400"),
    section_2.classList.add("text-slate-300", "hover:bg-slate-800"));

  planets.classList.add("hidden");
  (section_3.classList.remove("bg-blue-500/10", "text-blue-400"),
    section_3.classList.add("text-slate-300", "hover:bg-slate-800"));
});

section_2.addEventListener("click", () => {
  todayInSpace.classList.add("hidden");
  (section_1.classList.remove("bg-blue-500/10", "text-blue-400"),
    section_1.classList.add("text-slate-300", "hover:bg-slate-800"));

  launches.classList.remove("hidden");
  section_2.classList.add("bg-blue-500/10", "text-blue-400");

  planets.classList.add("hidden");
  (section_3.classList.remove("bg-blue-500/10", "text-blue-400"),
    section_3.classList.add("text-slate-300", "hover:bg-slate-800"));
});

section_3.addEventListener("click", () => {
  todayInSpace.classList.add("hidden");
  (section_1.classList.remove("bg-blue-500/10", "text-blue-400"),
    section_1.classList.add("text-slate-300", "hover:bg-slate-800"));

  launches.classList.add("hidden");
  (section_2.classList.remove("bg-blue-500/10", "text-blue-400"),
    section_2.classList.add("text-slate-300", "hover:bg-slate-800"));

  planets.classList.remove("hidden");
  section_3.classList.add("bg-blue-500/10", "text-blue-400");
});

getPlanetary();

loadDateBtn.addEventListener("click", () => {
  getPlanetary(standerDate);
});

todayApodBtn.addEventListener("click", () => {
  setDateToday();
  getPlanetary(standerDate);
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
  displaySection1("");
  xhr.addEventListener("load", function () {
    var res = xhr.response;
    displaySection1(res);
  });
}
getLaunches();
async function getLaunches() {
  try {
    const response = await fetch(
      "https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?limit=10",
    );

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    launchsList = data.results;
    await getPlanets();
  } catch (error) {
    console.error("Error:", error.message);
  }

  displayFirstLauncheSection(launchsList[0]);
  displayAllUpcomingLaunches(launchsList);
}

async function getPlanets() {
  try {
    const response = await fetch(
      "https://solar-system-opendata-proxy.vercel.app/api/planets",
    );

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    planetsList = data;
  } catch (error) {
    console.error("Error fetching planets data:", e);
    const cartona = document.getElementById("planets-grid");
    cartona.innerHTML = `
                <div class="col-span-full text-center py-8">
                    <i class="fas fa-exclamation-triangle text-red-400 text-4xl mb-4"></i>
                    <p class="text-slate-400">Failed to load planets data. Please try again later.</p>
                </div>
            `;
  }
  dispalyPlanets(planetsList);
  dispalyPlanetComparisonTable();
}

function getPlanetDescription(e) {
  return (
    {
      earth:
        "Earth is the third planet from the Sun and the only astronomical object known to harbor life. About 29% of Earth's surface is land consisting of continents and islands. The remaining 71% is covered with water.",
      mars: 'Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System. Named after the Roman god of war, it is often referred to as the "Red Planet" due to its reddish appearance.',
      jupiter:
        "Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass one-thousandth that of the Sun, but two-and-a-half times that of all the other planets combined.",
      saturn:
        "Saturn is the sixth planet from the Sun and the second-largest in the Solar System. It is a gas giant with an average radius about nine times that of Earth, and is best known for its extensive ring system.",
      venus:
        "Venus is the second planet from the Sun. It is named after the Roman goddess of love and beauty. As the second-brightest natural object in the night sky after the Moon, Venus can cast shadows.",
      mercury:
        "Mercury is the smallest planet in the Solar System and the closest to the Sun. Its orbit around the Sun takes 87.97 Earth days, the shortest of all the planets in the Solar System.",
      uranus:
        "Uranus is the seventh planet from the Sun. It has the third-largest planetary radius and fourth-largest planetary mass in the Solar System. Uranus is unique in that it rotates on its side.",
      neptune:
        "Neptune is the eighth and farthest known planet from the Sun in the Solar System. It is the fourth-largest planet by diameter and the third-most-massive planet.",
    }[e.englishName.toLowerCase()] ||
    `${e.englishName} is a fascinating celestial body in our Solar System with unique characteristics.`
  );
}

function getPlanetFacts(planet) {
  const massFact = planet.mass
    ? `Mass: ${planet.mass.massValue} × 10^${planet.mass.massExponent} kg`
    : "";

  const gravityFact = planet.gravity
    ? `Surface gravity: ${planet.gravity} m/s²`
    : "";

  const densityFact = planet.density ? `Density: ${planet.density} g/cm³` : "";

  const discovererFact = planet.discoveredBy
    ? `Discovered by: ${planet.discoveredBy}`
    : "";

  const facts = [];

  if (massFact) {
    facts.push(massFact);
  }

  if (gravityFact) {
    facts.push(gravityFact);
  }

  if (densityFact) {
    facts.push(densityFact);
  }

  if (planet.axialTilt) {
    facts.push(`Axial tilt: ${planet.axialTilt}°`);
  }

  if (discovererFact) {
    facts.push(discovererFact);
  }

  if (facts.length < 3) {
    facts.push(`Mean radius: ${planet.meanRadius.toFixed(0)} km`);

    if (planet.moons) {
      facts.push(`Has ${planet.moons.length} moon(s)`);
    }
  }

  return facts.slice(0, 4);
}

function dispalyPlanetComparisonTable() {
  const comparisonTableBody = document.getElementById(
    "planet-comparison-tbody",
  );

  if (!comparisonTableBody) return;

  const planetColors = {
    mercury: "#6b7280",
    venus: "#fb923c",
    earth: "#3b82f6",
    mars: "#ef4444",
    jupiter: "#fdba74",
    saturn: "#fde047",
    uranus: "#22d3ee",
    neptune: "#2563eb",
  };

  const earthPlanet = planetsList.bodies.find(
    (planet) => planet.englishName.toLowerCase() === "earth",
  );

  const earthMass = earthPlanet?.mass;

  const earthMassInKg = earthMass
    ? earthMass.massValue * Math.pow(10, earthMass.massExponent)
    : 1;

  comparisonTableBody.innerHTML = planetsList.bodies
    .map((planet) => {
      const planetKey = planet.englishName.toLowerCase();

      const planetColor = planetColors[planetKey] || "slate-500";

      const distanceFromSunAU = (planet.semimajorAxis / 149597870.7).toFixed(2);

      const planetDiameter = (planet.meanRadius * 2).toFixed(0);

      const relativeMassToEarth = (
        (planet.mass
          ? planet.mass.massValue * Math.pow(10, planet.mass.massExponent)
          : 0) / earthMassInKg
      ).toFixed(3);

      let orbitalPeriod = planet.sideralOrbit.toFixed(0);

      if (planet.sideralOrbit > 365) {
        orbitalPeriod = `${(planet.sideralOrbit / 365.25).toFixed(1)} years`;
      } else {
        orbitalPeriod = `${orbitalPeriod} days`;
      }

      const moonsCount = planet.moons ? planet.moons.length : 0;

      let planetType = "Terrestrial";

      let planetTypeBackgroundColor = "#f9731680";

      let planetTypeTextColor = "#fb923c";

      if (["jupiter", "saturn"].includes(planetKey)) {
        planetType = "Gas Giant";

        planetTypeBackgroundColor = "#a855f780";

        planetTypeTextColor = "#c084fc";
      } else if (["uranus", "neptune"].includes(planetKey)) {
        planetType = "Ice Giant";

        planetTypeBackgroundColor = "#3b82f680";

        planetTypeTextColor = "#60a5fa";
      }

      return `
        <tr class="${
          planetKey === "earth"
            ? "hover:bg-slate-800/30 transition-colors bg-blue-500/5"
            : "hover:bg-slate-800/30 transition-colors"
        }">

          <td class="px-4 md:px-6 py-3 md:py-4 sticky left-0 bg-slate-800 z-10">
            <div class="flex items-center space-x-2 md:space-x-3">

              <div
                class="w-6 h-6 md:w-8 md:h-8 rounded-full flex-shrink-0"
                style="background-color: ${planetColor}">
              </div>

              <span class="font-semibold text-sm md:text-base whitespace-nowrap">
                ${planet.englishName}
              </span>

            </div>
          </td>

          <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">
            ${distanceFromSunAU}
          </td>

          <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">
            ${parseInt(planetDiameter).toLocaleString()}
          </td>

          <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">
            ${relativeMassToEarth}
          </td>

          <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">
            ${orbitalPeriod}
          </td>

          <td class="px-4 md:px-6 py-3 md:py-4 text-slate-300 text-sm md:text-base whitespace-nowrap">
            ${moonsCount}
          </td>

          <td class="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
            <span
              class="px-2 py-1 rounded text-xs"
              style="
                background-color: ${planetTypeBackgroundColor};
                color: ${planetTypeTextColor};
              "
            >
              ${planetType}
            </span>
          </td>

        </tr>
      `;
    })
    .join("");
}

// functions display

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
    apodDateDetail.textContent = "";
    apodImage.classList.remove("hidden");
    apodLoading.classList.add("hidden");
    apodImage.setAttribute("src", data.url);
    apodImage.setAttribute("alt", data.title);
    apodDateDetail.appendChild(icon);
    apodDateDetail.append(data.date);
    apodExplanation.textContent = data.explanation;
    apodTitle.textContent = data.title;
    data.copyright
      ? (apodCopyright.innerHTML = `&copy; ${data.copyright}`)
      : (apodCopyright.innerHTML = `&copy; NASA/JPL`);
    apodDateInfo.textContent = data.date;
    apodMediaType.textContent = data.media_type.toUpperCase();
  } else {
    apodLoading.classList.remove("hidden");
    apodImage.classList.add("hidden");
    apodTitle.textContent = "Loading...";
    apodDateDetail.appendChild(icon);
    apodDateDetail.append("Loading...");
    apodExplanation.textContent = "Loading description...";
    apodDateInfo.textContent = "Loading...";
    apodMediaType.textContent = "Loading...";
  }
}

function displayFirstLauncheSection(res) {
  const featuredLaunchContainer = document.getElementById("featured-launch");
  const launchData = res;
  const launchDate = new Date(launchData.net);
  const currentDate = new Date();
  const timeDifference = launchDate - currentDate;
  const daysUntilLaunch = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  const formattedLaunchDate = launchDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedLaunchTime = launchDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
  const launchStatusColor =
    {
      Go: "green",
      Success: "green",
      TBD: "yellow",
      Hold: "red",
      TBC: "yellow",
    }[launchData.status?.abbrev] || "blue";

  const launchImageUrl =
    launchData.image?.image_url ||
    launchData.rocket?.configuration?.image_url ||
    "";
  const launchStatus = launchData.status;
  const launchProvider = launchData.launch_service_provider;
  const rocket = launchData.rocket;
  const rocketConfiguration = rocket?.configuration;
  const launchPad = launchData.pad;
  const location = launchPad?.location;
  const country = location?.country;
  const mission = launchData.mission;
  var cartona = "";

  cartona = `
   <div class="relative bg-slate-800/30 border border-slate-700 rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all">
            <div class="absolute inset-0 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
                <div class="flex flex-col justify-between">
                    <div>
                        <div class="flex items-center gap-3 mb-4">
                            <span class="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-2">
                                <i class="fas fa-star"></i>
                                Featured Launch
                            </span>
                            <span class="px-4 py-1.5 bg-${launchStatusColor}-500/20 text-${launchStatusColor}-400 rounded-full text-sm font-semibold">
                                ${launchStatus?.abbrev || "TBD"}
                            </span>
                        </div>
                        
                        <h3 class="text-3xl font-bold mb-3 leading-tight">${launchData.name}</h3>
                        
                        <div class="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 text-slate-400">
                            <div class="flex items-center gap-2">
                                <i class="fas fa-building"></i>
                                <span>${launchProvider?.name || "Unknown"}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <i class="fas fa-rocket"></i>
                                <span>${rocketConfiguration?.name || "N/A"}</span>
                            </div>
                        </div>
                        
                        ${
                          daysUntilLaunch > 0
                            ? `
                        <div class="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-xl mb-6">
                            <i class="fas fa-clock text-2xl text-blue-400"></i>
                            <div>
                                <p class="text-2xl font-bold text-blue-400">${daysUntilLaunch}</p>
                                <p class="text-xs text-slate-400">Days Until Launch</p>
                            </div>
                        </div>
                        `
                            : ""
                        }
                        
                        <div class="grid xl:grid-cols-2 gap-4 mb-6">
                            <div class="bg-slate-900/50 rounded-xl p-4">
                                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                                    <i class="fas fa-calendar"></i>
                                    Launch Date
                                </p>
                                <p class="font-semibold">${formattedLaunchDate}</p>
                            </div>
                            <div class="bg-slate-900/50 rounded-xl p-4">
                                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                                    <i class="fas fa-clock"></i>
                                    Launch Time
                                </p>
                                <p class="font-semibold">${formattedLaunchTime}</p>
                            </div>
                            <div class="bg-slate-900/50 rounded-xl p-4">
                                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                                    <i class="fas fa-map-marker-alt"></i>
                                    Location
                                </p>
                                <p class="font-semibold text-sm">${location?.name || "Unknown"}</p>
                            </div>
                            <div class="bg-slate-900/50 rounded-xl p-4">
                                <p class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                                    <i class="fas fa-globe"></i>
                                    Country
                                </p>
                                <p class="font-semibold">${country?.name || "Unknown"}</p>
                            </div>
                        </div>
                        
                        <p class="text-slate-300 leading-relaxed mb-6">
                            ${mission?.description || "Mission details will be available closer to launch date."}
                        </p>
                    </div>
                    
                    <div class="flex flex-col md:flex-row gap-3">
                        <button class="flex-1 self-start md:self-center px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2">
                            <i class="fas fa-info-circle"></i>
                            View Full Details
                        </button>
                       <div class="icons self-end md:self-center">
                            <button class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors">
                                <i class="far fa-heart"></i>
                            </button>
                            <button class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors">
                                <i class="fas fa-bell"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="relative">
                    ${
                      launchImageUrl
                        ? `
                    <div class="relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-slate-900/50">
                        <img src="${launchImageUrl}" alt="${launchData.name}" class="w-full h-full object-cover" onerror="this.onerror=null; this.src=assets/images/launch-placeholder.png';" />
                        <div class="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent"></div>
                    </div>
                    `
                        : `
                    <div class="flex items-center justify-center h-full min-h-[400px] bg-slate-900/50 rounded-2xl">
                        <div class="text-center">
                            <i class="fas fa-rocket text-6xl text-slate-700 mb-4"></i>
                            <p class="text-slate-500">No image available</p>
                        </div>
                    </div>
                    `
                    }
                </div>
            </div>
        </div>
  `;

  featuredLaunchContainer.innerHTML = cartona;
}

function displayAllUpcomingLaunches(res) {
  const launchesGrid = document.getElementById("launches-grid");
  launchesGrid.innerHTML = "";

  const upcomingLaunches = res.slice(1, 10);
  for (let i = 0; i < upcomingLaunches.length; i++) {
    const launchDate = new Date(upcomingLaunches[i].net);

    const formattedLaunchDate = launchDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const formattedLaunchTime =
      launchDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      }) + " UTC";

    const launchStatus = upcomingLaunches[i].status;

    const launchStatusColor =
      {
        Go: "green",
        Success: "green",
        TBD: "yellow",
        Hold: "red",
        TBC: "yellow",
      }[launchStatus?.abbrev] || "blue";

    const launchThumbnailUrl = upcomingLaunches[i].image?.thumbnail_url || "";

    const launchProvider = upcomingLaunches[i].launch_service_provider;

    const rocket = upcomingLaunches[i].rocket;

    const rocketConfiguration = rocket?.configuration;

    const launchPad = upcomingLaunches[i].pad;

    const location = launchPad?.location;

    launchesGrid.innerHTML += `
   <div class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer">
                ${
                  launchThumbnailUrl
                    ? `
                <div class="relative h-48 overflow-hidden bg-slate-900/50">
                    <img src="${launchThumbnailUrl}" alt="${upcomingLaunches[i].name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onerror="this.onerror=null; this.src='assets/images/launch-placeholder.png';" />
                    <div class="absolute top-3 right-3">
                        <span class="px-3 py-1 bg-${launchStatusColor}-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold">
                            ${launchStatus?.abbrev || "TBD"}
                        </span>
                    </div>
                </div>
                `
                    : `
                <div class="relative h-48 bg-slate-900/50 flex items-center justify-center">
                    <i class="fas fa-rocket text-5xl text-slate-700"></i>
                    <div class="absolute top-3 right-3">
                        <span class="px-3 py-1 bg-${launchStatusColor}-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold">
                            ${launchStatus?.abbrev || "TBD"}
                        </span>
                    </div>
                </div>
                `
                }
                
                <div class="p-5">
                    <div class="mb-3">
                        <h4 class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                            ${upcomingLaunches[i].name}
                        </h4>
                        <p class="text-sm text-slate-400 flex items-center gap-2">
                            <i class="fas fa-building text-xs"></i>
                            ${launchProvider?.name || "Unknown"}
                        </p>
                    </div>
                    
                    <div class="space-y-2 mb-4">
                        <div class="flex items-center gap-2 text-sm">
                            <i class="fas fa-calendar text-slate-500 w-4"></i>
                            <span class="text-slate-300">${formattedLaunchDate}</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm">
                            <i class="fas fa-clock text-slate-500 w-4"></i>
                            <span class="text-slate-300">${formattedLaunchTime}</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm">
                            <i class="fas fa-rocket text-slate-500 w-4"></i>
                            <span class="text-slate-300">${rocketConfiguration?.name || "N/A"}</span>
                        </div>
                        <div class="flex items-center gap-2 text-sm">
                            <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
                            <span class="text-slate-300 line-clamp-1">${location?.name || "Unknown"}</span>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-2 pt-4 border-t border-slate-700">
                        <button class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold">
                            Details
                        </button>
                        <button class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
  `;
  }
}
function dispalyPlanets(planet) {
  const planetsGrid = document.getElementById("planets-grid");

  if (!planetsGrid) return;

  const planetColors = {
    mercury: "#eab308",
    venus: "#f97316",
    earth: "#3b82f6",
    mars: "#ef4444",
    jupiter: "#fb923c",
    saturn: "#facc15",
    uranus: "#06b6d4",
    neptune: "#2563eb",
  };

  const planetImages = {
    mercury: "assets/images/mercury.png",
    venus: "assets/images/venus.png",
    earth: "assets/images/earth.png",
    mars: "assets/images/mars.png",
    jupiter: "assets/images/jupiter.png",
    saturn: "assets/images/saturn.png",
    uranus: "assets/images/uranus.png",
    neptune: "assets/images/neptune.png",
  };

  planetsGrid.innerHTML = planet.bodies
    .map((planet) => {
      const planetNameKey = planet.englishName.toLowerCase();

      const planetColor = planetColors[planetNameKey] || "#64748b";

      const planetImage = planetImages[planetNameKey] || "";

      const distanceFromSunInAU = (planet.semimajorAxis / 149597870.7).toFixed(
        2,
      );

      return `  <div class="planet-card bg-slate-800/50 border border-slate-700 rounded-2xl p-4 transition-all cursor-pointer group" data-planet-id="${planet.id}" style="--planet-color: ${planetColor}" onmouseover="this.style.borderColor='${planetColor}80'" onmouseout="this.style.borderColor='#334155'">
                <div class="relative mb-3 h-24 flex items-center justify-center">
                    <img class="w-20 h-20 object-contain group-hover:scale-110 transition-transform" 
                         src="${planetImage}" 
                         alt="${planet.englishName}" />
                </div>
                <h4 class="font-semibold text-center text-sm">${planet.englishName}</h4>
                <p class="text-xs text-slate-400 text-center">${distanceFromSunInAU} AU</p>
            </div>`;
    })
    .join("");

  document.querySelectorAll(".planet-card").forEach((planetCard) => {
    planetCard.addEventListener("click", function () {
      const planetId = this.dataset.planetId;

      const selectedPlanet = planetsList.bodies.find(
        (planet) => planet.id === planetId,
      );

      if (selectedPlanet) {
        displayPlanetDetails(selectedPlanet);
      }
    });
  });
}
function displayPlanetDetails(planet) {
  const planetKey = planet.englishName.toLowerCase();

  const planetImages = {
    mercury: "assets/images/mercury.png",
    venus: "assets/images/venus.png",
    earth: "assets/images/earth.png",
    mars: "assets/images/mars.png",
    jupiter: "assets/images/jupiter.png",
    saturn: "assets/images/saturn.png",
    uranus: "assets/images/uranus.png",
    neptune: "assets/images/neptune.png",
  };

  const planetImageElement = document.getElementById("planet-detail-image");

  if (planetImageElement) {
    planetImageElement.src = planetImages[planetKey] || "";
    planetImageElement.alt = planet.englishName;
  }

  const planetNameElement = document.getElementById("planet-detail-name");

  if (planetNameElement) {
    planetNameElement.textContent = planet.englishName;
  }

  const planetDescription = getPlanetDescription(planet);

  const planetDescriptionElement = document.getElementById(
    "planet-detail-description",
  );

  if (planetDescriptionElement) {
    planetDescriptionElement.textContent = planetDescription;
  }

  const distanceFromSun = (planet.semimajorAxis / 1e6).toFixed(1);

  const planetRadius = planet.meanRadius ? planet.meanRadius.toFixed(0) : "N/A";

  const planetMass = planet.mass
    ? `${planet.mass.massValue} × 10^${planet.mass.massExponent}`
    : "N/A";

  const planetDensity = planet.density ? planet.density.toFixed(2) : "N/A";

  const orbitalPeriod = planet.sideralOrbit
    ? planet.sideralOrbit.toFixed(2)
    : "N/A";

  const rotationPeriod = planet.sideralRotation
    ? planet.sideralRotation.toFixed(2)
    : "N/A";

  const moonsCount = planet.moons ? planet.moons.length : 0;

  const gravity = planet.gravity ? planet.gravity.toFixed(2) : "N/A";

  const distanceElement = document.getElementById("planet-distance");

  const radiusElement = document.getElementById("planet-radius");

  const massElement = document.getElementById("planet-mass");

  const densityElement = document.getElementById("planet-density");

  const orbitalPeriodElement = document.getElementById("planet-orbital-period");

  const rotationElement = document.getElementById("planet-rotation");

  const moonsElement = document.getElementById("planet-moons");

  const gravityElement = document.getElementById("planet-gravity");

  if (distanceElement) {
    distanceElement.textContent = `${distanceFromSun}M km`;
  }

  if (radiusElement) {
    radiusElement.textContent = `${planetRadius} km`;
  }

  if (massElement) {
    massElement.textContent = `${planetMass} kg`;
  }

  if (densityElement) {
    densityElement.textContent = `${planetDensity} g/cm³`;
  }

  if (orbitalPeriodElement) {
    orbitalPeriodElement.textContent =
      orbitalPeriod === "N/A" ? "N/A" : `${orbitalPeriod} days`;
  }

  if (rotationElement) {
    rotationElement.textContent =
      rotationPeriod === "N/A" ? "N/A" : `${rotationPeriod} hours`;
  }

  if (moonsElement) {
    moonsElement.textContent = moonsCount;
  }

  if (gravityElement) {
    gravityElement.textContent = gravity === "N/A" ? "N/A" : `${gravity} m/s²`;
  }

  const discovererElement = document.getElementById("planet-discoverer");

  const discoveryDateElement = document.getElementById("planet-discovery-date");

  const bodyTypeElement = document.getElementById("planet-body-type");

  const volumeElement = document.getElementById("planet-volume");

  if (discovererElement) {
    discovererElement.textContent =
      planet.discoveredBy || "Known since antiquity";
  }

  if (discoveryDateElement) {
    discoveryDateElement.textContent = planet.discoveryDate || "Ancient times";
  }

  if (bodyTypeElement) {
    bodyTypeElement.textContent = planet.bodyType || "Planet";
  }

  if (volumeElement) {
    const volume = planet.vol
      ? `${planet.vol.volValue} × 10^${planet.vol.volExponent} km³`
      : "N/A";

    volumeElement.textContent = volume;
  }

  const perihelionElement = document.getElementById("planet-perihelion");

  const aphelionElement = document.getElementById("planet-aphelion");

  const eccentricityElement = document.getElementById("planet-eccentricity");

  const inclinationElement = document.getElementById("planet-inclination");

  const axialTiltElement = document.getElementById("planet-axial-tilt");

  const temperatureElement = document.getElementById("planet-temp");

  const escapeVelocityElement = document.getElementById("planet-escape");

  if (perihelionElement) {
    const perihelionDistance = planet.perihelion
      ? `${(planet.perihelion / 1e6).toFixed(1)}M km`
      : "N/A";

    perihelionElement.textContent = perihelionDistance;
  }

  if (aphelionElement) {
    const aphelionDistance = planet.aphelion
      ? `${(planet.aphelion / 1e6).toFixed(1)}M km`
      : "N/A";

    aphelionElement.textContent = aphelionDistance;
  }

  if (eccentricityElement) {
    const eccentricity = planet.eccentricity
      ? planet.eccentricity.toFixed(5)
      : "N/A";

    eccentricityElement.textContent = eccentricity;
  }

  if (inclinationElement) {
    const inclination = planet.inclination
      ? `${planet.inclination.toFixed(2)}°`
      : "N/A";

    inclinationElement.textContent = inclination;
  }

  if (axialTiltElement) {
    const axialTilt = planet.axialTilt
      ? `${planet.axialTilt.toFixed(2)}°`
      : "N/A";

    axialTiltElement.textContent = axialTilt;
  }

  if (temperatureElement) {
    const averageTemperature = planet.avgTemp ? `${planet.avgTemp}°C` : "N/A";

    temperatureElement.textContent = averageTemperature;
  }

  if (escapeVelocityElement) {
    const escapeVelocity = planet.escape
      ? `${(planet.escape / 1000).toFixed(2)} km/s`
      : "N/A";

    escapeVelocityElement.textContent = escapeVelocity;
  }

  const planetFacts = getPlanetFacts(planet);

  const factsListElement = document.getElementById("planet-facts");

  if (factsListElement) {
    factsListElement.innerHTML = planetFacts
      .map(
        (fact) => `
          <li class="flex items-start">
            <i class="fas fa-check text-green-400 mt-1 mr-2"></i>
            <span class="text-slate-300">${fact}</span>
          </li>
        `,
      )
      .join("");
  }
}
