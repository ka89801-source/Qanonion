var btn = document.getElementById('mainBtn');
var message = document.getElementById('message');
var count = 0;

var messages = [
  'أهلاً وسهلاً بك!',
  'شكراً لضغطك على الزر!',
  'استمر، أنت رائع!',
  'كل ضغطة تسعدنا!',
  'أنت مميز جداً!'
];

btn.addEventListener('click', function () {
  message.textContent = messages[count % messages.length];
  message.style.opacity = '0';
  setTimeout(function () {
    message.style.opacity = '1';
  }, 50);
  count++;
});