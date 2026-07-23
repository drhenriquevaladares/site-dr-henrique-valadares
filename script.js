"use strict";

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("[data-menu]");
const navigationLinks = [...document.querySelectorAll('.primary-navigation a[href^="#"]')];
const siteWrapper = document.querySelector(".site-wrapper");
const whatsappFloat = document.querySelector(".whatsapp-float");
const lightbox = document.querySelector("[data-lightbox]");
const resultTriggers = [...document.querySelectorAll("[data-lightbox-trigger]")];
const lightboxTitle = document.querySelector("[data-lightbox-title]");
const lightboxBefore = document.querySelector("[data-lightbox-before]");
const lightboxAfter = document.querySelector("[data-lightbox-after]");
const lightboxClose = document.querySelector(".lightbox__close");
const lightboxPrevious = document.querySelector("[data-lightbox-previous]");
const lightboxNext = document.querySelector("[data-lightbox-next]");
let activeResultIndex = 0;
let lastFocusedElement = null;

const updateHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 16);
};

const updateCurrentNavigation = (id) => {
  navigationLinks.forEach((link) => {
    const isCurrent = link.getAttribute("href") === `#${id}`;
    if (isCurrent) {
      link.setAttribute("aria-current", "page");
      return;
    }

    link.removeAttribute("aria-current");
  });
};

const closeMenu = ({ restoreFocus = false } = {}) => {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
  navigation.classList.remove("is-open");
  header.classList.remove("is-menu-open");
  document.body.classList.remove("is-menu-open");

  if (restoreFocus) menuToggle.focus();
};

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
  navigation.classList.toggle("is-open", !isOpen);
  header.classList.toggle("is-menu-open", !isOpen);
  document.body.classList.toggle("is-menu-open", !isOpen);
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox.hidden) {
    closeLightbox();
    return;
  }

  if (event.key === "Escape") closeMenu({ restoreFocus: true });

  if (lightbox.hidden) return;

  if (event.key === "ArrowLeft") showResult(activeResultIndex - 1);
  if (event.key === "ArrowRight") showResult(activeResultIndex + 1);

  if (event.key === "Tab") trapLightboxFocus(event);
});

document.addEventListener("pointerdown", (event) => {
  const isMenuOpen = menuToggle.getAttribute("aria-expanded") === "true";

  if (isMenuOpen && !header.contains(event.target)) closeMenu();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) closeMenu();
});

window.addEventListener("scroll", updateHeaderState, { passive: true });
updateHeaderState();

if ("IntersectionObserver" in window) {
  const sections = navigationLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const navigationObserver = new IntersectionObserver(
    (entries) => {
      const currentSection = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

      if (currentSection) updateCurrentNavigation(currentSection.target.id);
    },
    { rootMargin: "-35% 0px -55%", threshold: [0.01, 0.25, 0.5] }
  );

  sections.forEach((section) => navigationObserver.observe(section));
}

const showResult = (index) => {
  activeResultIndex = (index + resultTriggers.length) % resultTriggers.length;

  const trigger = resultTriggers[activeResultIndex];
  const { beforeSrc, afterSrc, caseTitle } = trigger.dataset;

  lightboxTitle.textContent = caseTitle;
  lightboxBefore.src = beforeSrc;
  lightboxBefore.alt = `Antes: ${caseTitle}`;
  lightboxAfter.src = afterSrc;
  lightboxAfter.alt = `Depois: ${caseTitle}`;
};

const openLightbox = (index) => {
  lastFocusedElement = document.activeElement;
  showResult(index);
  lightbox.hidden = false;
  header.inert = true;
  siteWrapper.inert = true;
  whatsappFloat.inert = true;
  document.body.classList.add("is-lightbox-open");
  lightboxClose.focus();
};

const closeLightbox = () => {
  lightbox.hidden = true;
  header.inert = false;
  siteWrapper.inert = false;
  whatsappFloat.inert = false;
  document.body.classList.remove("is-lightbox-open");

  if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
};

const trapLightboxFocus = (event) => {
  const focusableElements = [...lightbox.querySelectorAll('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')];
  const firstElement = focusableElements[0];
  const lastElement = focusableElements.at(-1);

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  }

  if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
};

resultTriggers.forEach((trigger, index) => {
  trigger.addEventListener("click", () => openLightbox(index));
});

lightbox.querySelectorAll("[data-lightbox-close]").forEach((element) => {
  element.addEventListener("click", closeLightbox);
});

lightboxPrevious.addEventListener("click", () => showResult(activeResultIndex - 1));
lightboxNext.addEventListener("click", () => showResult(activeResultIndex + 1));

const treatmentFilters = document.querySelector("[data-treatment-filters]");
const treatmentFilterButtons = [...document.querySelectorAll("[data-treatment-filter]")];
const treatmentGroups = [...document.querySelectorAll("[data-treatment-group]")];

const showTreatmentGroup = (category) => {
  treatmentFilterButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.treatmentFilter === category));
  });

  treatmentGroups.forEach((group) => {
    group.hidden = group.dataset.treatmentGroup !== category;
  });
};

treatmentFilterButtons.forEach((button) => {
  button.addEventListener("click", () => showTreatmentGroup(button.dataset.treatmentFilter));
});

treatmentFilters.addEventListener("keydown", (event) => {
  const currentIndex = treatmentFilterButtons.indexOf(document.activeElement);
  const navigationKeys = ["ArrowLeft", "ArrowRight", "Home", "End"];

  if (!navigationKeys.includes(event.key) || currentIndex === -1) return;

  event.preventDefault();

  let nextIndex = currentIndex;
  if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + treatmentFilterButtons.length) % treatmentFilterButtons.length;
  if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % treatmentFilterButtons.length;
  if (event.key === "Home") nextIndex = 0;
  if (event.key === "End") nextIndex = treatmentFilterButtons.length - 1;

  treatmentFilterButtons[nextIndex].focus();
  treatmentFilterButtons[nextIndex].click();
});

const trackAnalyticsEvent = (eventName, parameters = {}) => {
  if (typeof window.gtag !== "function") return;

  try {
    window.gtag("event", eventName, parameters);
  } catch {
    // O site continua funcionando mesmo se a ferramenta de analytics falhar.
  }
};

document.querySelectorAll("a[href]").forEach((link) => {
  const { href } = link;

  if (href.startsWith("https://wa.me/")) {
    link.addEventListener("click", () => {
      const treatmentName = link.closest(".treatment-card")?.querySelector("h4")?.textContent.trim();

      if (treatmentName) {
        trackAnalyticsEvent("treatment_whatsapp_click", { treatment_name: treatmentName });
        return;
      }

      trackAnalyticsEvent("whatsapp_click", { link_text: link.textContent.trim() });
    });

    return;
  }

  if (href.startsWith("https://www.instagram.com/")) {
    link.addEventListener("click", () => trackAnalyticsEvent("instagram_click"));
  }

  if (href.startsWith("https://www.google.com/maps/")) {
    link.addEventListener("click", () => trackAnalyticsEvent("maps_click"));
  }
});
