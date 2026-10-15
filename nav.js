
const menuToggle = document.getElementById("menu-toggle");
const navRight = document.getElementById("nav-right");
const mobileClose = document.getElementById("mobile-close");
const overlay = document.getElementById("overlay");
const dropdownButtons = document.querySelectorAll(".dropdown-toggle");

// Open mobile menu
menuToggle.addEventListener("click", () => {
  navRight.classList.add("active");
  overlay.classList.add("active");
  menuToggle.classList.add("active");
  menuToggle.setAttribute("aria-expanded", "true");
  document.body.classList.add("menu-open");
});

// Close mobile menu
function closeMenu() {
  navRight.classList.remove("active");
  overlay.classList.remove("active");
  menuToggle.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");

  // Close all dropdowns
  document.querySelectorAll(".nav-item.open").forEach(item => {
    item.classList.remove("open");

    const button = item.querySelector(".dropdown-toggle");
    const panel = item.querySelector(".mega-menu, .dropdown-menu");

    button.setAttribute("aria-expanded", "false");

    if (panel) {
      panel.style.maxHeight = "";
    }
  });
}

mobileClose.addEventListener("click", closeMenu);
overlay.addEventListener("click", closeMenu);

// Open and close dropdowns
dropdownButtons.forEach(button => {
  button.addEventListener("click", () => {
    const item = button.parentElement;
    const panel = item.querySelector(".mega-menu, .dropdown-menu");
    const isOpen = item.classList.contains("open");

    // Close other dropdowns
    document.querySelectorAll(".nav-item.open").forEach(openItem => {
      openItem.classList.remove("open");

      const openButton = openItem.querySelector(".dropdown-toggle");
      const openPanel = openItem.querySelector(".mega-menu, .dropdown-menu");

      openButton.setAttribute("aria-expanded", "false");

      if (openPanel) {
        openPanel.style.maxHeight = "";
      }
    });

    // Open selected dropdown
    if (!isOpen) {
      item.classList.add("open");
      button.setAttribute("aria-expanded", "true");

      // On mobile, expand the dropdown vertically
      if (window.innerWidth <= 800) {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    }
  });
});

// Close menu when clicking outside
document.addEventListener("click", event => {
  if (!event.target.closest(".header")) {
    closeMenu();
  }
});

// Close menu with Escape
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

// Reset menu when switching to desktop
window.addEventListener("resize", () => {
  if (window.innerWidth > 800) {
    closeMenu();
  }
});
