// -----------------------------------------------------------------------------
// Small DOM helpers
// -----------------------------------------------------------------------------
const select = (selector, context = document) => context.querySelector(selector);
const selectAll = (selector, context = document) => [
  ...context.querySelectorAll(selector),
];

// Keep copyright years current.
selectAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

// -----------------------------------------------------------------------------
// Mobile navigation
// -----------------------------------------------------------------------------
const menuButton = select(".menu-btn");
const navigation = select(".nav-links");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");

    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.textContent = isOpen ? "×" : "☰";
  });
}

// -----------------------------------------------------------------------------
// Reveal-on-scroll animation
// -----------------------------------------------------------------------------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.12 },
);

selectAll(".reveal").forEach((element) => revealObserver.observe(element));

// -----------------------------------------------------------------------------
// Projects page: filtering, search, and cards
// -----------------------------------------------------------------------------
const projects = window.PORTFOLIO_PROJECTS || [];
const projectGrid = select("#projectGrid");

let selectedFilter = "All";
let searchQuery = "";
let visibleProjects = [...projects];
let activeProjectIndex = 0;
let activeImageIndex = 0;

function createProjectCard(project) {
  const placeholderClass = project.placeholder ? " placeholder-card" : "";
  const placeholderBadge = project.placeholder
    ? '<span class="placeholder-badge">Editable template</span>'
    : "";

  return `
    <article
      class="project-card reveal visible${placeholderClass}"
      data-open-project="${project.slug}"
      tabindex="0"
      role="button"
      aria-label="View ${project.title}"
    >
      <div class="project-media">
        <img
          loading="lazy"
          decoding="async"
          src="${project.images[0]}"
          alt="${project.title} interior design"
        >
      </div>

      <div class="project-body">
        <div class="project-meta">
          <span>${project.category} · ${project.style}</span>
          ${placeholderBadge}
        </div>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="view-link">View project →</div>
      </div>
    </article>
  `;
}

function renderProjects() {
  if (!projectGrid) return;

  const normalizedQuery = searchQuery.toLowerCase();

  visibleProjects = projects.filter((project) => {
    const matchesFilter =
      selectedFilter === "All" || project.category === selectedFilter;

    const searchableText = [
      project.title,
      project.category,
      project.style,
      project.description,
    ]
      .join(" ")
      .toLowerCase();

    return matchesFilter && searchableText.includes(normalizedQuery);
  });

  projectGrid.innerHTML = visibleProjects.length
    ? visibleProjects.map(createProjectCard).join("")
    : '<div class="empty-state">No projects match this search.</div>';

  const resultsCount = select("#resultsCount");
  if (resultsCount) {
    resultsCount.textContent =
      `Showing ${visibleProjects.length} of ${projects.length} projects`;
  }

  bindProjectCards();
}

function bindProjectCards() {
  selectAll("[data-open-project]").forEach((card) => {
    const openCardProject = () => openProject(card.dataset.openProject);

    card.addEventListener("click", openCardProject);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openCardProject();
      }
    });
  });
}

function renderCategoryFilters() {
  const filterContainer = select("#projectFilters");
  if (!filterContainer) return;

  // Every unique category in projects.js automatically becomes a filter button.
  // This means you do not need to edit the Projects page when adding a new category.
  const categories = [
    "All",
    ...new Set(projects.map((project) => project.category)),
  ];

  filterContainer.innerHTML = categories
    .map(
      (category) => `
        <button
          class="filter-btn ${category === selectedFilter ? "active" : ""}"
          data-filter="${category}"
          type="button"
        >
          ${category}
        </button>
      `,
    )
    .join("");

  selectAll(".filter-btn", filterContainer).forEach((button) => {
    button.addEventListener("click", () => {
      selectedFilter = button.dataset.filter;
      renderCategoryFilters();
      renderProjects();
    });
  });
}

const projectSearch = select("#projectSearch");
if (projectSearch) {
  projectSearch.addEventListener("input", (event) => {
    searchQuery = event.target.value;
    renderProjects();
  });
}

if (projectGrid) {
  renderCategoryFilters();
  renderProjects();
} else {
  bindProjectCards();
}

// -----------------------------------------------------------------------------
// Project detail dialog and image gallery
// -----------------------------------------------------------------------------
const projectDialog = select("#projectDialog");

let savedPageScrollY = 0;

function lockPageScroll() {
  // Preserve the exact page position while preventing the document behind the
  // modal from reacting to mouse-wheel, trackpad, or touch scrolling.
  savedPageScrollY = window.scrollY;

  document.documentElement.classList.add("dialog-open");
  document.body.classList.add("dialog-open");
  document.body.style.top = `-${savedPageScrollY}px`;
}

function unlockPageScroll() {
  document.documentElement.classList.remove("dialog-open");
  document.body.classList.remove("dialog-open");
  document.body.style.top = "";

  window.scrollTo({
    top: savedPageScrollY,
    left: 0,
    behavior: "instant",
  });
}

function openProject(slug) {
  // On pages without the dialog, send visitors to the projects page.
  if (!projectDialog) {
    window.location.href = `/projects/#${encodeURIComponent(slug)}`;
    return;
  }

  activeProjectIndex = projects.findIndex((project) => project.slug === slug);
  if (activeProjectIndex < 0) return;

  fillProjectDialog(projects[activeProjectIndex]);
  projectDialog.showModal();
  lockPageScroll();
  history.replaceState(null, "", `#${slug}`);
}

function setActiveDialogImage(index) {
  const project = projects[activeProjectIndex];
  if (!project || !project.images.length) return;

  // Wrap around so scrolling past the final image returns to the first.
  activeImageIndex =
    (index + project.images.length) % project.images.length;

  const mainImage = select("#dialogImage");
  mainImage.src = project.images[activeImageIndex];
  mainImage.alt =
    `${project.title} — project image ${activeImageIndex + 1} of ` +
    `${project.images.length}`;

  const thumbnailContainer = select("#dialogThumbs");
  const thumbnails = selectAll(".thumb", thumbnailContainer);

  thumbnails.forEach((thumbnail, thumbnailIndex) => {
    const isActive = thumbnailIndex === activeImageIndex;
    thumbnail.classList.toggle("active", isActive);
    thumbnail.setAttribute("aria-current", isActive ? "true" : "false");
  });

  const activeThumbnail = thumbnails[activeImageIndex];
  if (activeThumbnail && projectDialog?.open) {
    activeThumbnail.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }
}

function fillProjectDialog(project) {
  select("#dialogCategory").textContent = project.category;
  select("#dialogTitle").textContent = project.title;
  select("#dialogStyle").textContent = project.style;
  select("#dialogDescription").textContent = project.description;

  const thumbnailContainer = select("#dialogThumbs");
  thumbnailContainer.innerHTML = project.images
    .map(
      (source, index) => `
        <button
          class="thumb ${index === 0 ? "active" : ""}"
          data-image-index="${index}"
          type="button"
          aria-label="View image ${index + 1} of ${project.images.length}"
          aria-current="${index === 0 ? "true" : "false"}"
        >
          <img src="${source}" alt="">
        </button>
      `,
    )
    .join("");

  selectAll(".thumb", thumbnailContainer).forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
      setActiveDialogImage(Number(thumbnail.dataset.imageIndex));
    });
  });

  activeImageIndex = 0;
  setActiveDialogImage(0);
}

if (projectDialog) {
  select(".dialog-close").addEventListener("click", () => {
    projectDialog.close();
  });

  projectDialog.addEventListener("click", (event) => {
    if (event.target === projectDialog) {
      projectDialog.close();
    }
  });

  projectDialog.addEventListener("close", () => {
    unlockPageScroll();
    history.replaceState(null, "", window.location.pathname);
  });

  // Scroll over the image gallery to browse the current project's images.
  // A cooldown prevents high-resolution mouse wheels and touchpads from
  // skipping several images from one small gesture.
  const dialogGallery = select(".dialog-gallery", projectDialog);
  let wheelAccumulator = 0;
  let wheelIsCoolingDown = false;
  let wheelCooldownTimer;

  if (dialogGallery) {
    dialogGallery.addEventListener(
      "wheel",
      (event) => {
        const project = projects[activeProjectIndex];
        if (!projectDialog.open || !project) return;

        // The gallery owns the wheel while the pointer is over the image area.
        // It must never pass through to the page behind the modal.
        event.preventDefault();
        event.stopPropagation();

        if (project.images.length < 2) return;

        // Support vertical mouse wheels, touchpads, and horizontal gestures.
        const dominantDelta =
          Math.abs(event.deltaY) >= Math.abs(event.deltaX)
            ? event.deltaY
            : event.deltaX;

        wheelAccumulator += dominantDelta;

        if (wheelIsCoolingDown || Math.abs(wheelAccumulator) < 35) return;

        const direction = wheelAccumulator > 0 ? 1 : -1;
        wheelAccumulator = 0;
        wheelIsCoolingDown = true;

        setActiveDialogImage(activeImageIndex + direction);

        window.clearTimeout(wheelCooldownTimer);
        wheelCooldownTimer = window.setTimeout(() => {
          wheelIsCoolingDown = false;
        }, 240);
      },
      { passive: false },
    );

    dialogGallery.addEventListener("mouseleave", () => {
      wheelAccumulator = 0;
    });
  }

  const dialogDescription = select("#dialogDescription", projectDialog);

  projectDialog.addEventListener(
    "wheel",
    (event) => {
      if (!projectDialog.open) return;

      // The gallery has its own image-navigation handler above.
      if (event.target.closest(".dialog-gallery")) return;

      // Permit native vertical scrolling only inside a description that is
      // genuinely taller than its available space.
      if (dialogDescription?.contains(event.target)) {
        const canScroll =
          dialogDescription.scrollHeight > dialogDescription.clientHeight + 1;

        if (!canScroll) {
          event.preventDefault();
        }

        event.stopPropagation();
        return;
      }

      // Titles, labels, buttons, and blank modal space do not scroll anything.
      event.preventDefault();
      event.stopPropagation();
    },
    { passive: false },
  );

  select("#prevProject").addEventListener("click", () => {
    activeProjectIndex =
      (activeProjectIndex - 1 + projects.length) % projects.length;
    fillProjectDialog(projects[activeProjectIndex]);
    history.replaceState(
      null,
      "",
      `#${projects[activeProjectIndex].slug}`,
    );
  });

  select("#nextProject").addEventListener("click", () => {
    activeProjectIndex = (activeProjectIndex + 1) % projects.length;
    fillProjectDialog(projects[activeProjectIndex]);
    history.replaceState(
      null,
      "",
      `#${projects[activeProjectIndex].slug}`,
    );
  });

  // Open the project specified in the URL hash, such as #villa-nyanyi.
  if (window.location.hash) {
    requestAnimationFrame(() => {
      openProject(window.location.hash.slice(1));
    });
  }
}


/* --------------------------------------------------------------------------
   Keep presentation text read-only
   -------------------------------------------------------------------------- */
(() => {
  const editableControlSelector =
    "input, textarea, select, option, [contenteditable='true']";

  // Remove accidental content-editing attributes from presentation elements.
  document.querySelectorAll("[contenteditable]").forEach((element) => {
    if (!element.matches("input, textarea, select, option")) {
      element.setAttribute("contenteditable", "false");
    }
  });

  // Prevent text selection outside controls that are intentionally editable.
  document.addEventListener("selectstart", (event) => {
    const target = event.target;

    if (
      target instanceof Element &&
      !target.closest(editableControlSelector)
    ) {
      event.preventDefault();
    }
  });

  // Prevent accidental drag-selection of images and interface text.
  document.addEventListener("dragstart", (event) => {
    const target = event.target;

    if (
      target instanceof Element &&
      !target.closest(editableControlSelector)
    ) {
      event.preventDefault();
    }
  });
})();
