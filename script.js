const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
const contactForm = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');

menuBtn.addEventListener('click', () => {
  nav.classList.toggle('open');
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 600) {
      nav.classList.remove('open');
    }
  });
});

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formMsg.classList.remove('hidden');
  contactForm.reset();
  setTimeout(() => {
    formMsg.classList.add('hidden');
  }, 3000);
});