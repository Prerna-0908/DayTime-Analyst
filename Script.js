// ===== Mobile nav toggle =====
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');
if (navToggle && primaryNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
}

// ===== Modal open/close (Skills, Certifications, Experience + preserved-but-unlinked modals) =====
const modals = {
  openSkills: document.getElementById('skillsModal'),
  openCerts:  document.getElementById('certModal'),
  openExp:    document.getElementById('expModal')
};

Object.keys(modals).forEach(triggerId => {
  const triggerEl = document.getElementById(triggerId);
  const modalEl = modals[triggerId];
  if (!triggerEl || !modalEl) return;
  triggerEl.addEventListener('click', () => {
    modalEl.style.display = 'flex';
    modalEl.setAttribute('aria-hidden', 'false');
  });
  triggerEl.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      modalEl.style.display = 'flex';
      modalEl.setAttribute('aria-hidden', 'false');
    }
  });
});

document.querySelectorAll('.modal .close').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const modal = e.target.closest('.modal');
    if (modal) {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }
  });
});

window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.style.display = 'none';
    e.target.setAttribute('aria-hidden', 'true');
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal').forEach(m => {
      if (m.style.display === 'flex') {
        m.style.display = 'none';
        m.setAttribute('aria-hidden', 'true');
      }
    });
  }
});

// ===== Animated achievement counters (runs once, on scroll into view) =====
const statNums = document.querySelectorAll('.stat-num[data-count]');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animateCount(el) {
  const target = parseInt(el.getAttribute('data-count'), 10);
  if (prefersReducedMotion || isNaN(target)) {
    el.textContent = target || el.textContent;
    return;
  }
  const duration = 900;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

if ('IntersectionObserver' in window && statNums.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => observer.observe(el));
} else {
  statNums.forEach(el => { el.textContent = el.getAttribute('data-count'); });
}
