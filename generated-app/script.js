const btn = document.getElementById('mainBtn');
const message = document.getElementById('message');

const messages = [
  'أهلاً وسهلاً بك! 🌟',
  'شكرًا على ضغطتك! 💫',
  'يومك رائع! ☀️',
  'استمر في الضغط! 🎉',
  'أنت رائع! 🚀'
];

let count = 0;

btn.addEventListener('click', function () {
  const index = count % messages.length;
  message.textContent = messages[index];
  message.classList.add('show');
  count++;

  btn.style.transform = 'scale(0.95)';
  setTimeout(() => {
    btn.style.transform = '';
  }, 150);
});