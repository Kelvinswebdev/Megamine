
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector("#menu-toggle");
  const navContent = document.querySelector("#nav-content");
  const navbar = document.querySelector(".navbar");

  const megaItems = document.querySelectorAll(".has-mega");
  const megaTriggers = document.querySelectorAll(".mega-trigger");

  const mobileQuery = window.matchMedia("(max-width: 850px)");

  if (!menuToggle || !navContent || !navbar) {
    console.error("Navigation elements not found.");
    return;
  }

  // Close all mega menus
  function closeMegaMenus() {
    megaTriggers.forEach((trigger) => {
      const menuId = trigger.getAttribute("aria-controls");
      const menu = document.getElementById(menuId);

      trigger.setAttribute("aria-expanded", "false");

      if (menu) {
        menu.hidden = true;
      }
    });
  }

  // Open one mega menu
  function openMegaMenu(trigger) {
    const menuId = trigger.getAttribute("aria-controls");
    const menu = document.getElementById(menuId);

    if (!menu) return;

    closeMegaMenus();

    menu.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
  }

  // Toggle dropdown on click only
  megaTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const isOpen =
        trigger.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        closeMegaMenus();
      } else {
        openMegaMenu(trigger);
      }
    });
  });

  // Mobile hamburger
  function openMobileMenu() {
    navContent.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");
  }

  function closeMobileMenu() {
    navContent.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    closeMegaMenus();
  }

  menuToggle.addEventListener("click", (event) => {
    event.stopPropagation();

    const isOpen =
      menuToggle.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // Close when clicking outside the navbar
  document.addEventListener("click", (event) => {
    if (!navbar.contains(event.target)) {
      closeMegaMenus();

      if (navContent.classList.contains("is-open")) {
        closeMobileMenu();
      }
    }
  });

  // Close menus with Escape
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    const openTrigger = Array.from(megaTriggers).find(
      (trigger) =>
        trigger.getAttribute("aria-expanded") === "true"
    );

    closeMegaMenus();

    if (openTrigger) {
      openTrigger.focus();
    }

    if (navContent.classList.contains("is-open")) {
      closeMobileMenu();
      menuToggle.focus();
    }
  });

  // Close after clicking a navigation link
  navContent.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMegaMenus();

      if (mobileQuery.matches) {
        closeMobileMenu();
      }
    });
  });

  // Reset navigation when changing screen sizes
  function resetNavigation() {
    closeMegaMenus();
    closeMobileMenu();
  }

  if (mobileQuery.addEventListener) {
    mobileQuery.addEventListener("change", resetNavigation);
  } else {
    mobileQuery.addListener(resetNavigation);
  }
});
