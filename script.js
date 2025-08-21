const container = document.getElementById('prompt-container');
const searchInput = document.getElementById('search');
const categorySelect = document.getElementById('category');

function renderPrompts(list) {
  container.innerHTML = '';
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'prompt-card';
    card.innerHTML = `
      <h3>${p.title}</h3>
      <p class="prompt-text">${p.prompt}</p>
      <div class="meta">
        <span class="cat">${p.category}</span>
        <button class="copy">Copy</button>
      </div>`;
    card.querySelector('.copy').addEventListener('click', () => {
      navigator.clipboard.writeText(p.prompt);
      const btn = card.querySelector('.copy');
      const original = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = original, 1500);
    });
    container.appendChild(card);
  });
}

function update() {
  const term = searchInput.value.toLowerCase();
  const cat = categorySelect.value;
  const filtered = prompts.filter(p => {
    const matchesCategory = cat === 'all' || p.category === cat;
    const matchesSearch = p.title.toLowerCase().includes(term) || p.prompt.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });
  renderPrompts(filtered);
}

searchInput.addEventListener('input', update);
categorySelect.addEventListener('change', update);

const categories = Array.from(new Set(prompts.map(p => p.category))).sort();
categories.forEach(c => {
  const opt = document.createElement('option');
  opt.value = c;
  opt.textContent = c;
  categorySelect.appendChild(opt);
});

renderPrompts(prompts);
