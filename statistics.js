
/* =====================================
   MEGAMINE STATISTICS COUNTER
===================================== */

const statsSection = document.querySelector(".company-stats");
const statValues = document.querySelectorAll(".stat-value");

if (statsSection && statValues.length > 0) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function animateCounter(element) {
    const target = Number(element.dataset.target);

    if (!Number.isFinite(target)) return;

    if (prefersReducedMotion) {
      element.textContent = target;
      return;
    }

    const duration = 1600;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      // Ease-out animation for a premium feel.
      const easedProgress = 1 - Math.pow(1 - progress, 4);

      const currentValue = Math.floor(
        easedProgress * target
      );

      element.textContent = currentValue.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(updateCounter);
  }

  let statsAnimated = false;

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;

          statValues.forEach((element, index) => {
            setTimeout(() => {
              animateCounter(element);
            }, index * 150);
          });

          statsObserver.disconnect();
        }
      });
    },
    {
      threshold: 0.35
    }
  );

  statsObserver.observe(statsSection);
}
