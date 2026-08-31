const canvas = document.querySelector("#rain");
const context = canvas.getContext("2d");
const matrixCharacters = "01アイウエオカキクケコサシスセソ{}[]<>/\\PYTHONFASTAPIREDIS";
const fontSize = 15;
let drops = [];

function resizeMatrixRain() {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * pixelRatio;
  canvas.height = window.innerHeight * pixelRatio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  drops = Array.from(
    { length: Math.ceil(window.innerWidth / fontSize) },
    () => Math.random() * -80,
  );
}

function drawMatrixRain() {
  context.fillStyle = "rgba(2, 8, 5, .075)";
  context.fillRect(0, 0, window.innerWidth, window.innerHeight);
  context.font = `${fontSize}px monospace`;

  drops.forEach((drop, index) => {
    const character = matrixCharacters[Math.floor(Math.random() * matrixCharacters.length)];
    context.fillStyle = Math.random() > 0.97 ? "#caffda" : "#19c95a";
    context.fillText(character, index * fontSize, drop * fontSize);

    if (drop * fontSize > window.innerHeight && Math.random() > 0.975) {
      drops[index] = 0;
    } else {
      drops[index]++;
    }
  });
}

resizeMatrixRain();
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  drawMatrixRain();
} else {
  window.setInterval(drawMatrixRain, 48);
}
window.addEventListener("resize", resizeMatrixRain, { passive: true });

const menuButton = document.querySelector(".menu");
const navigationLinks = document.querySelector(".links");

menuButton.addEventListener("click", () => {
  const isOpen = navigationLinks.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.textContent = isOpen ? "×" : "☰";
});

navigationLinks.addEventListener("click", (event) => {
  if (!event.target.closest("a")) return;
  navigationLinks.classList.remove("open");
  menuButton.textContent = "☰";
  menuButton.setAttribute("aria-expanded", "false");
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.1 },
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

async function hydrateGitHubData() {
  const [userResponse, repositoriesResponse] = await Promise.all([
    fetch("https://api.github.com/users/stupidprogrammer4"),
    fetch("https://api.github.com/users/stupidprogrammer4/repos?per_page=100&sort=updated"),
  ]);

  if (!userResponse.ok || !repositoriesResponse.ok) {
    throw new Error("GitHub API request failed");
  }

  const [user, repositories] = await Promise.all([
    userResponse.json(),
    repositoriesResponse.json(),
  ]);

  document.querySelectorAll("[data-repos]").forEach((element) => {
    element.textContent = user.public_repos;
  });
  document.querySelectorAll("[data-followers]").forEach((element) => {
    element.textContent = user.followers;
  });
  document.querySelectorAll("[data-following]").forEach((element) => {
    element.textContent = user.following;
  });

  const repositoriesByName = Object.fromEntries(
    repositories.map((repository) => [repository.name, repository]),
  );

  const marketplaceSdk = repositoriesByName["iranian-marketplaces-sdk"];
  if (marketplaceSdk) {
    document.querySelector("[data-stars]").textContent = marketplaceSdk.stargazers_count;
  }

  document.querySelectorAll("[data-repo]").forEach((card) => {
    const repository = repositoriesByName[card.dataset.repo];
    if (!repository) return;
    const metadata = card.querySelector(".repo-meta");
    metadata.lastElementChild.textContent = `★ ${repository.stargazers_count}`;
    if (repository.language) metadata.firstElementChild.textContent = repository.language;
  });
}

hydrateGitHubData().catch(() => {
  // Server-rendered values remain available when GitHub is unreachable.
});

document.querySelector("#year").textContent = new Date().getFullYear();
