/* Edit these objects to update the site without touching HTML. */

const LINKS = {
  email: "ali@example.com",
  github: "https://github.com/",
  discord: "",
  website: "http://ali-basaleh.local/",
};

const SKILLS = [
  { name: "HTML", level: 80 },
  { name: "CSS", level: 75 },
  { name: "JavaScript", level: 65 },
  { name: "Web Design", level: 70 },
  { name: "Cyber Security", level: 55 },
  { name: "UI Design", level: 60 },
  { name: "Responsive Design", level: 70 },
  { name: "Website Development", level: 70 },
  { name: "Basic Networking", level: 50 },
];

const PROJECTS = [
  {
    id: "findit",
    name: "FindIt",
    description:
      "A resource and discovery website with a custom interface and categorized links.",
    technologies: "HTML, CSS, JavaScript",
    status: "In progress — add a live URL when you have one",
    url: "",
    github: "",
  },
  {
    id: "wageflow",
    name: "WageFlow",
    description:
      "A wage and pay tracking dashboard built with HTML, CSS, and JavaScript.",
    technologies: "HTML, CSS, JavaScript",
    status: "Personal project",
    url: "",
    github: "",
  },
  {
    id: "cyber-heaven",
    name: "Cyber Heaven",
    description:
      "A technology and cyber-security community concept. Details can be filled in here later.",
    technologies: "Web / community concept",
    status: "Concept",
    url: "",
    github: "",
  },
];

const IE_PAGES = {
  home: {
    address: "http://ali-basaleh.local/",
    html: `
      <h3>Welcome to ali-basaleh.local</h3>
      <p>Still one website. These links change this screen only.</p>
      <ul>
        <li><a href="#ie-projects" data-ie="projects">Projects on this “site”</a></li>
        <li><a href="#ie-contact" data-ie="contact">Contact page</a></li>
        <li><a href="#about" data-page="about">Open About Me</a></li>
      </ul>
    `,
  },
  projects: {
    address: "http://ali-basaleh.local/projects",
    html: `
      <h3>Projects</h3>
      <ul>
        ${PROJECTS.map(
          (p) => `<li><a href="#projects" data-project="${p.id}">${p.name}</a></li>`
        ).join("")}
      </ul>
      <p><a href="#ie-home" data-ie="home">Back to home</a></p>
    `,
  },
  contact: {
    address: "http://ali-basaleh.local/contact",
    html: `
      <h3>Contact</h3>
      <p>Email: <a href="mailto:${LINKS.email}">${LINKS.email}</a></p>
      <p><a href="#contact" data-page="contact">Open the contact form</a></p>
      <p><a href="#ie-home" data-ie="home">Back to home</a></p>
    `,
  },
};

const PAGES = ["home", "about", "skills", "projects", "resume", "links", "contact"];

const soundEnabled = () => localStorage.getItem("xp-sound") === "1";

function beep() {
  if (!soundEnabled()) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "square";
    o.frequency.value = 880;
    g.gain.value = 0.03;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    setTimeout(() => {
      o.stop();
      ctx.close();
    }, 80);
  } catch (_) {
    /* ignore */
  }
}

function setStatus(text) {
  document.getElementById("statusText").textContent = text;
}

function showPage(id, { hash = true } = {}) {
  const pageId = PAGES.includes(id) ? id : "home";
  document.querySelectorAll(".page").forEach((el) => {
    el.classList.toggle("is-active", el.id === `page-${pageId}`);
  });
  const page = document.getElementById(`page-${pageId}`);
  document.getElementById("titleText").textContent = page.dataset.title;
  document.getElementById("pageAddress").value = page.dataset.path;
  document.querySelectorAll(".menubar [data-page]").forEach((btn) => {
    btn.classList.toggle("is-current", btn.getAttribute("data-page") === pageId);
  });
  document.getElementById("backHome").disabled = pageId === "home";
  setStatus(pageId === "home" ? "Ready" : `Opened ${page.dataset.title}`);
  if (hash) {
    const next = pageId === "home" ? "#home" : `#${pageId}`;
    if (location.hash !== next) history.pushState({ page: pageId }, "", next);
  }
  page.scrollTop = 0;
  beep();
}

function pageFromHash() {
  const raw = (location.hash || "#home").slice(1);
  return PAGES.includes(raw) ? raw : "home";
}

function renderSkills() {
  document.getElementById("skillsGrid").innerHTML = SKILLS.map(
    (s) => `
    <div class="skill-row">
      <span>${s.name}</span>
      <div class="meter" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${s.level}" aria-label="${s.name}">
        <span style="width:${s.level}%"></span>
      </div>
      <span>${s.level}%</span>
    </div>`
  ).join("");
}

function renderProjects() {
  document.getElementById("projectList").innerHTML = PROJECTS.map(
    (p) => `
    <button type="button" class="file-icon" data-project="${p.id}">
      <img src="assets/icons/folder.svg" alt="">
      <span>${p.name}</span>
    </button>`
  ).join("");
}

function renderContactLinks() {
  const items = [
    ["Email", `mailto:${LINKS.email}`, LINKS.email],
    ["GitHub", LINKS.github, LINKS.github],
    ["Discord", LINKS.discord, LINKS.discord],
    ["Website", LINKS.website, LINKS.website],
  ].filter(([, , label]) => label);
  document.getElementById("contactLinks").innerHTML = items
    .map(([name, href, label]) => `<li>${name}: <a href="${href}">${label}</a></li>`)
    .join("");
}

function projectById(id) {
  return PROJECTS.find((p) => p.id === id);
}

function openModal(title, html) {
  document.getElementById("dialogTitle").textContent = title;
  document.getElementById("dialogBody").innerHTML = html;
  document.getElementById("modalRoot").hidden = false;
  document.getElementById("modalDim").hidden = false;
  beep();
}

function closeModal() {
  document.getElementById("modalRoot").hidden = true;
  document.getElementById("modalDim").hidden = true;
}

function showProject(id) {
  const p = projectById(id);
  if (!p) return;
  const view = p.url
    ? `<p><a class="xp-btn" href="${p.url}" target="_blank" rel="noopener">View Project</a></p>`
    : `<p class="muted">Add a View Project URL in script.js when you have one.</p>`;
  const gh = p.github
    ? `<p><a class="xp-btn" href="${p.github}" target="_blank" rel="noopener">GitHub</a></p>`
    : `<p class="muted">Add a GitHub URL in script.js if you want a button here.</p>`;
  openModal(`${p.name} Properties`, `
    <p><strong>Name:</strong> ${p.name}</p>
    <p><strong>Description:</strong> ${p.description}</p>
    <p><strong>Technologies:</strong> ${p.technologies}</p>
    <p><strong>Status:</strong> ${p.status}</p>
    ${view}${gh}
  `);
}

let ieHistory = ["home"];
let ieIndex = 0;

function showIe(key, push = true) {
  const page = IE_PAGES[key] || IE_PAGES.home;
  document.getElementById("ieAddress").value = page.address;
  document.getElementById("iePage").innerHTML = page.html;
  if (push) {
    ieHistory = ieHistory.slice(0, ieIndex + 1);
    ieHistory.push(key);
    ieIndex = ieHistory.length - 1;
  }
  document.getElementById("ieBack").disabled = ieIndex <= 0;
  document.getElementById("ieForward").disabled = ieIndex >= ieHistory.length - 1;
}

function tickClock() {
  document.getElementById("clock").textContent = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function init() {
  renderSkills();
  renderProjects();
  renderContactLinks();
  showIe("home", false);
  tickClock();
  setInterval(tickClock, 1000);
  showPage(pageFromHash(), { hash: false });

  const sound = document.getElementById("soundToggle");
  sound.checked = soundEnabled();
  sound.addEventListener("change", () => {
    localStorage.setItem("xp-sound", sound.checked ? "1" : "0");
    if (sound.checked) beep();
  });

  document.body.addEventListener("click", (e) => {
    const go = e.target.closest("[data-page]");
    if (!go || go.closest(".xp-dialog")) return;
    e.preventDefault();
    showPage(go.getAttribute("data-page"));
  });

  document.getElementById("projectList").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-project]");
    if (btn) showProject(btn.getAttribute("data-project"));
  });

  document.getElementById("iePage").addEventListener("click", (e) => {
    const ie = e.target.closest("[data-ie]");
    const proj = e.target.closest("[data-project]");
    const page = e.target.closest("[data-page]");
    if (ie) {
      e.preventDefault();
      showIe(ie.getAttribute("data-ie"));
    } else if (proj) {
      e.preventDefault();
      showProject(proj.getAttribute("data-project"));
    } else if (page) {
      e.preventDefault();
      showPage(page.getAttribute("data-page"));
    }
  });

  document.getElementById("ieBack").addEventListener("click", () => {
    if (ieIndex <= 0) return;
    ieIndex -= 1;
    showIe(ieHistory[ieIndex], false);
  });
  document.getElementById("ieForward").addEventListener("click", () => {
    if (ieIndex >= ieHistory.length - 1) return;
    ieIndex += 1;
    showIe(ieHistory[ieIndex], false);
  });
  document.getElementById("ieHome").addEventListener("click", () => showIe("home"));
  document.getElementById("ieGo").addEventListener("click", () => {
    openModal("Internet Explorer", `<p>Windows cannot find <strong>${document.getElementById("ieAddress").value}</strong> on this machine.</p>`);
  });

  document.getElementById("contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const name = data.get("name");
    const email = data.get("email");
    const message = data.get("message");
    const subject = encodeURIComponent(`Message from ${name} via Ali's website`);
    const body = encodeURIComponent(`From: ${name} <${email}>\n\n${message}`);
    window.location.href = `mailto:${LINKS.email}?subject=${subject}&body=${body}`;
    openModal("Send Message", `<p>Your email program should open next.</p><p>If nothing happens, write to <strong>${LINKS.email}</strong> yourself.</p>`);
  });

  document.getElementById("helpBtn").addEventListener("click", () => {
    openModal("Help and Support", `<p>Home is a menu of screens. Each icon opens a different page inside this same window — nothing new is loaded from the server.</p>`);
  });
  document.getElementById("eggBtn").addEventListener("click", () => {
    openModal("Ali Basaleh.exe", `<p>Windows cannot find what you're looking for.</p>`);
  });

  document.querySelectorAll("[data-dialog]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const kind = btn.getAttribute("data-dialog");
      if (kind === "close") {
        openModal("Turn Off Computer", `<p>Are you sure you want to leave Ali's website?</p>`);
      } else if (kind === "min") {
        openModal("Minimize", `<p>Use the browser’s own minimize if you need the real desktop back.</p>`);
      } else {
        document.getElementById("siteWindow").style.width = "100%";
        document.getElementById("siteWindow").style.height = "100%";
        document.getElementById("siteWindow").style.margin = "0";
      }
    });
  });

  document.getElementById("modalRoot").addEventListener("click", (e) => {
    if (e.target.matches("[data-close-modal]")) closeModal();
  });
  document.getElementById("modalDim").addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
  window.addEventListener("popstate", () => showPage(pageFromHash(), { hash: false }));
}

init();
