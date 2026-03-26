var btn = document.getElementById('mainBtn');
var message = document.getElementById('message');
var count = 0;

btn.addEventListener('click', function () {
  count++;
  if (count === 1) {
    message.textContent = 'أحسنت! لقد ضغطت على الزر.';
  } else {
    message.textContent = 'لقد ضغطت ' + count + ' مرات!';
  }
});