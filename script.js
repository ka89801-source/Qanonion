const posBtns = document.querySelectorAll('.pos-btn');
const selectedPosEl = document.getElementById('selected-pos');
const publishBtn = document.getElementById('publish-btn');
const titleInput = document.getElementById('title');
const bodyInput = document.getElementById('body');
const postsContainer = document.getElementById('posts-container');

let currentPos = 'الرئيسية';
let posts = [];

posBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    posBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentPos = btn.dataset.pos;
    selectedPosEl.textContent = currentPos;
  });
});

publishBtn.addEventListener('click', () => {
  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();
  if (!title) { alert('يرجى كتابة العنوان'); return; }
  posts.unshift({ title, body, pos: currentPos });
  titleInput.value = '';
  bodyInput.value = '';
  renderPosts();
});

function renderPosts() {
  if (posts.length === 0) {
    postsContainer.innerHTML = '<p class="empty-msg">لا توجد منشورات بعد.</p>';
    return;
  }
  postsContainer.innerHTML = posts.map(p => `
    <div class="post-card">
      <span class="post-position">${p.pos}</span>
      <div class="post-title">${p.title}</div>
      <div class="post-body">${p.body || ''}</div>
    </div>
  `).join('');
}