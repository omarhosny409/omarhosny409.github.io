
const siteLoader = document.getElementById('siteLoader');

if (siteLoader) {
  const loaderTitle = siteLoader.querySelector('[data-loader-title]');
  const loaderStatus = siteLoader.querySelector('[data-loader-status]');
  const loaderProgress = siteLoader.querySelector('[data-loader-progress]');
  const loaderCount = siteLoader.querySelector('[data-loader-count]');
  const loaderStartedAt = performance.now();
  const loaderMessages = ['Preparing visuals', 'Building interface', 'Tuning motion', 'Almost ready'];
  const minLoaderTime = 2300;
  let loaderValue = 0;
  let loaderMessageIndex = 0;
  let loaderDone = false;

  const setLoaderProgress = (value) => {
    const safeValue = Math.max(0, Math.min(100, Math.round(value)));

    if (loaderProgress) {
      loaderProgress.style.width = `${safeValue}%`;
    }

    if (loaderCount) {
      loaderCount.textContent = `${String(safeValue).padStart(2, '0')}%`;
    }
  };

  const loaderTimer = window.setInterval(() => {
    loaderValue = Math.min(92, loaderValue + Math.random() * 9 + 4);
    setLoaderProgress(loaderValue);

    const nextIndex = Math.min(loaderMessages.length - 1, Math.floor(loaderValue / 25));
    if (nextIndex !== loaderMessageIndex) {
      loaderMessageIndex = nextIndex;
      if (loaderStatus) {
        loaderStatus.textContent = loaderMessages[loaderMessageIndex];
      }
    }
  }, 170);

  const finishLoader = () => {
    if (loaderDone) return;
    loaderDone = true;

    window.clearInterval(loaderTimer);
    setLoaderProgress(100);

    if (loaderStatus) {
      loaderStatus.textContent = 'Experience ready';
    }

    if (loaderTitle) {
      loaderTitle.textContent = 'Welcome';
    }

    siteLoader.classList.add('is-complete');

    window.setTimeout(() => {
      siteLoader.classList.add('is-leaving');
      document.body.classList.remove('is-loading');

      window.setTimeout(() => {
        siteLoader.remove();
      }, 800);
    }, 820);
  };

  const scheduleLoaderFinish = () => {
    const remainingTime = Math.max(0, minLoaderTime - (performance.now() - loaderStartedAt));
    window.setTimeout(finishLoader, remainingTime);
  };

  if (document.readyState === 'complete') {
    scheduleLoaderFinish();
  } else {
    window.addEventListener('load', scheduleLoaderFinish, { once: true });
  }

  window.setTimeout(finishLoader, 6500);
}

document.getElementById('year').textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.setProperty('--delay', `${Math.min(index * 0.06, 0.24)}s`);
  observer.observe(element);
});

const tiltCard = document.querySelector('[data-tilt-card]');

if (tiltCard && !prefersReducedMotion) {
  tiltCard.addEventListener('pointermove', (event) => {
    const rect = tiltCard.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    tiltCard.style.transform = `perspective(900px) rotateX(${y * -5}deg) rotateY(${x * 6}deg) translateY(-2px)`;
  });

  tiltCard.addEventListener('pointerleave', () => {
    tiltCard.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
  });
}

const goTopButton = document.querySelector('.go-top-btn');

if (goTopButton) {
  const toggleGoTopButton = () => {
    goTopButton.classList.toggle('show', window.scrollY > 420);
  };

  toggleGoTopButton();
  window.addEventListener('scroll', toggleGoTopButton, { passive: true });

  goTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  });
}


const supportsCustomCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const cursorDot = document.querySelector('.cursor-dot');
const cursorGlow = document.querySelector('.cursor-glow');

if (supportsCustomCursor && !prefersReducedMotion && cursorDot && cursorGlow) {
  document.body.classList.add('has-custom-cursor');

  let mouseX = -100;
  let mouseY = -100;
  let glowX = mouseX;
  let glowY = mouseY;

  const updateCursor = () => {
    glowX += (mouseX - glowX) * 0.16;
    glowY += (mouseY - glowY) * 0.16;

    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    cursorGlow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(updateCursor);
  };

  document.addEventListener('pointermove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    document.body.classList.add('cursor-active');
  }, { passive: true });

  document.addEventListener('pointerleave', () => {
    document.body.classList.remove('cursor-active');
  });

  document.addEventListener('pointerover', (event) => {
    if (event.target.closest('a, button, input, textarea, select, [role="button"]')) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('pointerout', (event) => {
    if (event.target.closest('a, button, input, textarea, select, [role="button"]')) {
      document.body.classList.remove('cursor-hover');
    }
  });

  updateCursor();
}
