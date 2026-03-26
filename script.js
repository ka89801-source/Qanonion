const openModal = document.getElementById('openModal');
const closeModal = document.getElementById('closeModal');
const modal = document.getElementById('modal');
const submitPost = document.getElementById('submitPost');
const feed = document.getElementById('feed');
const postText = document.getElementById('postText');
const postTag = document.getElementById('postTag');

openModal.addEventListener('click', () => modal.classList.remove('hidden'));
closeModal.addEventListener('click', () => modal.classList.add('hidden'));

modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.add('hidden');
});

submitPost.addEventListener('click', () => {
  const text = postText.value.trim();
  const tag = postTag.value.trim();
  if (!text) return;

  const post = document.createElement('div');
  post.className = 'post';
  post.innerHTML = `
    <div class="post-header">
      <div class="avatar sm">م</div>
      <div>
        <strong>محامي أحمد</strong>
        <span class="badge">محامي</span>
      </div>
    </div>
    <p class="post-text">${text}</p>
    <div class="post-tags">${tag ? '<span>' + tag + '</span>' : ''}</div>
    <div class="post-actions">
      <button class="like-btn" onclick="toggleLike(this)">❤️ <span>0</span></button>
      <button>💬 تعليق</button>
      <button>🔗 مشاركة</button>
    </div>
  `;

  feed.prepend(post);
  postText.value = '';
  postTag.value = '';
  modal.classList.add('hidden');
});

function toggleLike(btn) {
  const count = btn.querySelector('span');
  const liked = btn.classList.toggle('liked');
  count.textContent = liked ? parseInt(count.textContent) + 1 : parseInt(count.textContent) - 1;
}