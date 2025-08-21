const container = document.getElementById('prompt-container');
const searchInput = document.getElementById('search');
const categorySelect = document.getElementById('category');
const languageSelect = document.getElementById('language');
const genInput = document.getElementById('gen-input');
const genBtn = document.getElementById('gen-btn');
const genOutput = document.getElementById('gen-output');

let currentLang = 'en';

function renderPrompts(list) {
  container.innerHTML = '';
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'prompt-card';
    card.innerHTML = `
      <h3>${p.title[currentLang]}</h3>
      <p class="prompt-text">${p.prompt[currentLang]}</p>
      <div class="meta">
        <span class="cat">${p.category}</span>
        <button class="copy">${currentLang === 'ar' ? 'انسخ' : 'Copy'}</button>
      </div>`;
    card.querySelector('.copy').addEventListener('click', () => {
      navigator.clipboard.writeText(p.prompt[currentLang]);
      const btn = card.querySelector('.copy');
      const original = currentLang === 'ar' ? 'انسخ' : 'Copy';
      btn.textContent = currentLang === 'ar' ? 'تم النسخ!' : 'Copied!';
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
    const matchesSearch = p.title[currentLang].toLowerCase().includes(term) ||
      p.prompt[currentLang].toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });
  renderPrompts(filtered);
}

searchInput.addEventListener('input', update);
categorySelect.addEventListener('change', update);
languageSelect.addEventListener('change', () => {
  currentLang = languageSelect.value;
  document.documentElement.lang = currentLang;
  update();
});

const categories = Array.from(new Set(prompts.map(p => p.category))).sort();
categories.forEach(c => {
  const opt = document.createElement('option');
  opt.value = c;
  opt.textContent = c;
  categorySelect.appendChild(opt);
});

renderPrompts(prompts);

genBtn.addEventListener('click', async () => {
  const desc = genInput.value.trim();
  if (!desc) return;
  genOutput.textContent = 'Loading...';
  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: desc, lang: currentLang })
    });
    const data = await res.json();
    genOutput.textContent = data.prompt || 'No prompt returned.';
  } catch (err) {
    genOutput.textContent = 'Error generating prompt.';
  }
});
