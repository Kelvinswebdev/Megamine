
  /* =====================================
     CINEMATIC HERO SLIDER
  ===================================== */

  const hero = document.querySelector(".hero");

  if (hero) {
    const slides = [...hero.querySelectorAll(".hero-slide")];
    const dots = [...hero.querySelectorAll(".hero-dot")];
    const nextButton = hero.querySelector(".hero-next");
    const prevButton = hero.querySelector(".hero-prev");
    const autoplayButton = hero.querySelector(".hero-autoplay");
    const progressBar = hero.querySelector(".hero-progress span");

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const interval = 8000;

    let currentIndex = 0;
    let timer = null;
    let paused = reducedMotion.matches;
    let touchStartX = 0;

    function restartProgress() {
      if (!progressBar) return;

      progressBar.classList.remove("is-running");
      progressBar.style.animation = "none";

      // Force a browser reflow to restart the animation.
      void progressBar.offsetWidth;

      progressBar.style.animation = "";

      if (!paused && !reducedMotion.matches) {
        progressBar.classList.add("is-running");
      }
    }

    function updateAutoplayButton() {
      if (!autoplayButton) return;

      autoplayButton.setAttribute(
        "aria-pressed",
        String(paused)
      );

      autoplayButton.setAttribute(
        "aria-label",
        paused ? "Resume slideshow" : "Pause slideshow"
      );
    }

    function showSlide(index) {
      currentIndex = (index + slides.length) % slides.length;

      slides.forEach((slide, i) => {
        const active = i === currentIndex;

        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", String(!active));

        const video = slide.querySelector("video");

        if (!video) return;

        if (active) {
          // Attempt playback only for the active slide.
          const playPromise = video.play();

          if (playPromise) {
            playPromise.catch(() => {
              // Poster remains visible if playback is unavailable.
            });
          }
        } else {
          video.pause();
        }
      });

      dots.forEach((dot, i) => {
        const active = i === currentIndex;

        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-pressed", String(active));
      });

      restartProgress();
      startTimer();
    }

    function stopTimer() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    }

    function startTimer() {
      stopTimer();

      if (paused || slides.length < 2) return;

      timer = setTimeout(() => {
        showSlide(currentIndex + 1);
      }, interval);
    }

    function nextSlide() {
      showSlide(currentIndex + 1);
    }

    function previousSlide() {
      showSlide(currentIndex - 1);
    }

    function pauseSlideshow() {
      paused = true;
      stopTimer();
      restartProgress();
      updateAutoplayButton();
    }

    function resumeSlideshow() {
      paused = false;
      restartProgress();
      updateAutoplayButton();
      startTimer();
    }

    nextButton?.addEventListener("click", nextSlide);
    prevButton?.addEventListener("click", previousSlide);

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        showSlide(i);
      });
    });

    autoplayButton?.addEventListener("click", () => {
      if (paused) {
        resumeSlideshow();
      } else {
        pauseSlideshow();
      }
    });

    // Pause when the visitor leaves the browser tab.
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopTimer();

        slides.forEach((slide) => {
          slide.querySelector("video")?.pause();
        });
      } else {
        const activeVideo =
          slides[currentIndex]?.querySelector("video");

        if (activeVideo) {
          activeVideo.play().catch(() => {});
        }

        startTimer();
      }
    });

    // Support touch gestures on mobile.
    hero.addEventListener("touchstart", (event) => {
      touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });

    hero.addEventListener("touchend", (event) => {
      const difference =
        event.changedTouches[0].clientX - touchStartX;

      if (Math.abs(difference) < 60) return;

      if (difference < 0) {
        nextSlide();
      } else {
        previousSlide();
      }
    }, { passive: true });

    // Respect reduced-motion preferences.
    reducedMotion.addEventListener?.("change", (event) => {
      if (event.matches) {
        pauseSlideshow();
      }
    });

    // Initialize the first slide.
    slides.forEach((slide, i) => {
      const video = slide.querySelector("video");

      if (video && i !== 0) {
        video.pause();
      }
    });

    showSlide(0);
    updateAutoplayButton();
  }
