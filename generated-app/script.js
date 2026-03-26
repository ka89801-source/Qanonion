const btn = document.getElementById('mainBtn');
const message = document.getElementById('message');

const messages = [
  'أهلاً وسهلاً بك!',
  'شكراً لضغطك على الزر!',
  'يسعدنا وجودك هنا!',
  'استمر في الاستكشاف!',
  'رائع، أنت رائع!'
];

let count = 0;

btn.addEventListener('click', function () {
  message.textContent = messages[count % messages.length];
  message.classList.add('show');
  count++;

  clearTimeout(message._timeout);
  message._timeout = setTimeout(function () {
    message.classList.remove('show');
  }, 2500);
});