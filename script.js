var btn = document.getElementById('mainBtn');
var message = document.getElementById('message');
var count = 0;

var messages = [
  'أحسنت! استمر في الضغط 😊',
  'رائع! لقد ضغطت مرتين 🎉',
  'أنت تحب الأزرار كثيراً 😄',
  'لا تتوقف! الأمر ممتع 🚀',
  'خمس مرات! أنت بطل 🏆',
  'ماذا تتوقع أن يحدث؟ 🤔',
  'حسناً، إليك نجمة: ⭐',
  'أنت مثابر جداً! 💪'
];

btn.addEventListener('click', function () {
  count++;
  var index = (count - 1) % messages.length;
  message.textContent = messages[index];
  message.classList.remove('show');
  setTimeout(function () {
    message.classList.add('show');
  }, 10);

  btn.textContent = 'ضغطت ' + count + ' مرة';
});