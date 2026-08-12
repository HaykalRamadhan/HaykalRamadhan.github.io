const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.classList.toggle('is-open');
    navigation.classList.toggle('is-open', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuButton.classList.remove('is-open');
      navigation.classList.remove('is-open');
      document.body.classList.remove('menu-open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, revealObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

const filterButtons = document.querySelectorAll('.filter-button');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));

    portfolioItems.forEach((item) => {
      const categories = item.dataset.category.split(' ');
      const shouldShow = filter === 'all' || categories.includes(filter);
      item.classList.toggle('is-hidden', !shouldShow);
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
    const body = encodeURIComponent(
      `Hello Haykal,\n\nMy name is ${name}.\nMy email is ${email}.\n\nProject type: ${projectType}\n\nProject details:\n${message}\n\nBest regards,\n${name}`
    );

    window.location.href = `mailto:haykalfikriramadhan.alt@gmail.com?subject=${subject}&body=${body}`;
  });
}
