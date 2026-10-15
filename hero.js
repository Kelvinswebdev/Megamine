
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const menuToggle = header.querySelector("#menu-toggle");
  const navContent = header.querySelector("#nav-content");
  const backdrop = header.querySelector(".mobile-nav-backdrop");
  const triggers = header.querySelectorAll(".mega-trigger");
  const mobileQuery = window.matchMedia("(max-width: 1100px)");

  if (!menuToggle || !navContent) return;

  const megaMenus = [...triggers].map((trigger) => {
    const menu = document.getElementById(
      trigger.getAttribute("aria-controls")
    );

    return {
      trigger,
      menu,
      item: trigger.closest(".has-mega")
    };
  }).filter((entry) => entry.menu && entry.item);

  function closeMegaMenus(except = null) {
    megaMenus.forEach(({ trigger, menu, item }) => {
      if (menu === except) return;

      trigger.setAttribute("aria-expanded", "false");
      item.classList.remove("mega-active");
      menu.classList.remove("mobile-open");
      menu.hidden = true;
    });
  }

  function openMobileMenu() {
    navContent.classList.add("is-open");
    backdrop?.classList.add("is-visible");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");
    document.body.classList.add("mobile-nav-open");
  }

  function closeMobileMenu() {
    navContent.classList.remove("is-open");
    backdrop?.classList.remove("is-visible");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    document.body.classList.remove("mobile-nav-open");
    closeMegaMenus();
  }

  menuToggle.addEventListener("click", () => {
    const isOpen =
      menuToggle.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  backdrop?.addEventListener("click", closeMobileMenu);

  megaMenus.forEach(({ trigger, menu, item }) => {
    trigger.addEventListener("click", () => {
      const isOpen =
        trigger.getAttribute("aria-expanded") === "true";

      closeMegaMenus(menu);

      if (isOpen) {
        trigger.setAttribute("aria-expanded", "false");
        item.classList.remove("mega-active");
        menu.classList.remove("mobile-open");
        menu.hidden = true;
        return;
      }

      menu.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
      item.classList.add("mega-active");

      if (mobileQuery.matches) {
        menu.classList.add("mobile-open");
      }
    });
  });

  /* Close drawer after selecting a navigation link */
  navContent.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  /* Close menus when clicking outside the header */
  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) {
      closeMegaMenus();

      if (mobileQuery.matches) {
        closeMobileMenu();
      }
    }
  });

  /* Escape key closes the drawer or dropdown */
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    const openMenu = megaMenus.find(
      ({ trigger }) =>
        trigger.getAttribute("aria-expanded") === "true"
    );

    if (openMenu) {
      closeMegaMenus();
      openMenu.trigger.focus();
      return;
    }

    if (menuToggle.getAttribute("aria-expanded") === "true") {
      closeMobileMenu();
      menuToggle.focus();
    }
  });

  /* Reset navigation when switching between mobile and desktop */
  function resetNavigation() {
    closeMobileMenu();
    closeMegaMenus();
  }

  if (mobileQuery.addEventListener) {
    mobileQuery.addEventListener("change", resetNavigation);
  } else {
    mobileQuery.addListener(resetNavigation);
  }

  resetNavigation();
});
