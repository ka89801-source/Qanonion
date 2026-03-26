var clickCount = 0;

var messages = [
  "أهلاً وسهلاً بك!",
  "شكراً على الضغط مرة أخرى 😊",
  "أنت رائع!",
  "استمر، أنا هنا! 🎉",
  "لقد ضغطت " + (clickCount) + " مرات!"
];

function handleClick() {
  clickCount++;

  var btn = document.getElementById("mainBtn");
  var messageEl = document.getElementById("message");

  btn.classList.add("clicked");

  var text;
  if (clickCount === 1) {
    text = "أهلاً وسهلاً بك!";
  } else if (clickCount === 2) {
    text = "شكراً على الضغط مرة أخرى 😊";
  } else if (clickCount === 3) {
    text = "أنت رائع!";
  } else if (clickCount === 4) {
    text = "استمر، أنا هنا! 🎉";
  } else {
    text = "لقد ضغطت " + clickCount + " مرات! 🚀";
  }

  messageEl.textContent = text;
  messageEl.classList.add("show");

  setTimeout(function () {
    btn.classList.remove("clicked");
  }, 1500);
}