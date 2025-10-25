// script.js
(() => {
  const STORAGE_KEY = 'jjk_s6_owned_ids_v1';
  const TOTAL = 28;

  const grid = document.getElementById('cardGrid');
  const progressText = document.getElementById('progressText');
  const toggleAllBtn = document.getElementById('toggleAllBtn');
  const clearAllBtn = document.getElementById('clearAllBtn');

  /* ---------- Storage helpers ---------- */
  const loadOwned = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return new Set();
      const arr = JSON.parse(raw);
      return new Set(Array.isArray(arr) ? arr : []);
    } catch {
      return new Set();
    }
  };

  const saveOwned = (ownedSet) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...ownedSet]));
    } catch {
      // ignore quota errors for this simple app
    }
  };

  /* ---------- State ---------- */
  let owned = loadOwned();

  /* ---------- DOM utils ---------- */
  const cards = Array.from(grid.querySelectorAll('.card'));

  // Auto-attach <img> to each .card-face based on data-id -> images/NN.jpg
const pad2 = (n) => String(n).padStart(2, '0');

// OPTIONAL: If some files are .png or have special names, map here:
// const fileMap = { 28: '28.png' }; // default will be NN.jpg
cards.forEach((card) => {
  const id = Number(card.dataset.id);
  const face = card.querySelector('.card-face');
  if (!face) return;

  // Avoid duplicating if you later add images manually
  if (face.querySelector('img')) return;

  const img = document.createElement('img');
  img.className = 'card-img';
  img.alt = `JJK Wafer Card ${pad2(id)} — ${card.dataset.rarity?.toUpperCase() || 'Normal'}`;

  // default filename pattern
  img.src = `images/${pad2(id)}.jpg`;

  // If you want per-card overrides, uncomment & use fileMap above
  // if (fileMap[id]) img.src = `images/${fileMap[id]}`;

  face.prepend(img); // put image behind number/title
});


  const setOwnedUI = (cardEl, isOwned) => {
    cardEl.classList.toggle('owned', isOwned);
    cardEl.setAttribute('aria-pressed', isOwned ? 'true' : 'false');
  };

  const updateProgress = () => {
    const count = owned.size;
    progressText.textContent = `Owned: ${count} / ${TOTAL}`;
    document.title = `JJK S6 — ${count}/${TOTAL} owned`;
  };

  /* ---------- Event handlers ---------- */
  const handleCardClick = (ev) => {
    const card = ev.currentTarget;
    const id = Number(card.dataset.id);
    const nowOwned = !owned.has(id);

    if (nowOwned) owned.add(id);
    else owned.delete(id);

    setOwnedUI(card, nowOwned);
    saveOwned(owned);
    updateProgress();
  };

  const toggleAll = () => {
    // invert every card's state
    cards.forEach((card) => {
      const id = Number(card.dataset.id);
      const willOwn = !owned.has(id);
      if (willOwn) owned.add(id);
      else owned.delete(id);
      setOwnedUI(card, willOwn);
    });
    saveOwned(owned);
    updateProgress();
  };

  const clearAll = () => {
    owned = new Set();
    cards.forEach((c) => setOwnedUI(c, false));
    saveOwned(owned);
    updateProgress();
  };

  /* ---------- Init ---------- */
  const init = () => {
    // attach listeners
    cards.forEach((card) => {
      const id = Number(card.dataset.id);
      const isOwned = owned.has(id);
      setOwnedUI(card, isOwned);
      card.addEventListener('click', handleCardClick);
      // Space/Enter already work on <button>, but this keeps semantics explicit
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });

    toggleAllBtn.addEventListener('click', toggleAll);
    clearAllBtn.addEventListener('click', clearAll);

    updateProgress();
  };

  init();
})();
