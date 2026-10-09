const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');

const closeMenu = () => {
  if (!menuButton || !navigation) return;
  menuButton.classList.remove('is-open');
  navigation.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
};

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.classList.toggle('is-open');
    navigation.classList.toggle('is-open', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

const filterButtons = document.querySelectorAll('.filter-button');
const portfolioItems = document.querySelectorAll('.portfolio-item');
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    portfolioItems.forEach((item) => {
      const categories = item.dataset.category.split(' ');
      item.classList.toggle('is-hidden', filter !== 'all' && !categories.includes(filter));
    });
  });
});

const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const projectType = formData.get('project-type');
    const message = formData.get('message');
    const subject = encodeURIComponent(`Portfolio inquiry: ${projectType}`);
    const body = encodeURIComponent(`Hello Haykal,\n\nMy name is ${name}.\nMy email is ${email}.\n\nProject type: ${projectType}\n\nProject details:\n${message}\n\nBest regards,\n${name}`);
    window.location.href = `mailto:haykalfikriramadhan.alt@gmail.com?subject=${subject}&body=${body}`;
  });
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const contourCanvases = [...document.querySelectorAll('[data-contours]')];

function sizeCanvas(canvas) {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width * ratio));
  const height = Math.max(1, Math.round(rect.height * ratio));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  return { ratio, width, height };
}

function drawContours(canvas, time = 0) {
  const context = canvas.getContext('2d');
  const { ratio, width, height } = sizeCanvas(canvas);
  context.clearRect(0, 0, width, height);
  context.lineWidth = ratio;
  context.strokeStyle = 'rgba(9, 10, 11, 0.085)';
  const phase = reducedMotion.matches ? 0 : time * 0.00008;
  const count = 13;
  for (let line = 0; line < count; line += 1) {
    const yBase = height * (0.08 + line * 0.071);
    context.beginPath();
    for (let x = -20 * ratio; x <= width + 20 * ratio; x += 12 * ratio) {
      const wave = Math.sin((x / width) * Math.PI * 3.2 + line * 0.48 + phase) * (26 + line * 1.4) * ratio;
      const secondary = Math.cos((x / width) * Math.PI * 1.3 - phase * 0.7) * 12 * ratio;
      const y = yBase + wave + secondary;
      if (x <= 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.stroke();
  }
}

let contourFrame = 0;
function renderContours(time) {
  contourCanvases.forEach((canvas) => drawContours(canvas, time));
  if (!reducedMotion.matches && contourCanvases.length) contourFrame = requestAnimationFrame(renderContours);
}

if (contourCanvases.length) {
  renderContours(0);
  window.addEventListener('resize', () => contourCanvases.forEach((canvas) => drawContours(canvas, performance.now())), { passive: true });
  reducedMotion.addEventListener('change', () => {
    cancelAnimationFrame(contourFrame);
    renderContours(0);
  });
}

const stackLayers = [...document.querySelectorAll('[data-stack-layer]')];
if (stackLayers.length > 1 && !reducedMotion.matches) {
  let stackFrame = 0;
  const updateStack = () => {
    stackFrame = 0;
    const viewportHeight = window.innerHeight || 1;
    const compact = window.matchMedia('(max-width: 760px)').matches;
    stackLayers.slice(0, -1).forEach((layer, index) => {
      const next = stackLayers[index + 1];
      const progress = Math.min(1, Math.max(0, 1 - next.getBoundingClientRect().top / viewportHeight));
      const inner = layer.querySelector('.stack-inner');
      const shade = layer.querySelector('.stack-shade');
      if (inner) inner.style.transform = compact ? '' : `scale(${1 - progress * 0.06})`;
      if (shade) shade.style.opacity = String(progress * 0.5);
    });
  };
  const requestStackUpdate = () => {
    if (!stackFrame) stackFrame = requestAnimationFrame(updateStack);
  };
  window.addEventListener('scroll', requestStackUpdate, { passive: true });
  window.addEventListener('resize', requestStackUpdate, { passive: true });
  requestStackUpdate();
}
