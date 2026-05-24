// 泡生成
(function () {
  const container = document.getElementById('petals');
  if (!container) return;
  const colors = [
    'rgba(150, 220, 245, 0.75)',
    'rgba(120, 200, 235, 0.68)',
    'rgba(200, 240, 255, 0.72)',
    'rgba(170, 230, 248, 0.70)',
    'rgba(100, 195, 228, 0.65)',
  ];
  const count = 38;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'petal';

    const size = Math.random() * 18 + 12;
    const left = Math.random() * 100;
    const delay = Math.random() * 14;
    const duration = Math.random() * 12 + 14;
    const color = colors[Math.floor(Math.random() * colors.length)];

    el.style.cssText = `
      left: ${left}%;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
    `;

    container.appendChild(el);
  }
})();

// サイドバー開閉
(function () {
  const toggle  = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const closeBtn = document.getElementById('sidebar-close');
  if (!toggle || !sidebar || !overlay) return;

  function open() {
    sidebar.classList.add('open');
    overlay.classList.add('open');
    toggle.classList.add('open');
    sidebar.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    toggle.classList.remove('open');
    sidebar.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', function () {
    sidebar.classList.contains('open') ? close() : open();
  });

  overlay.addEventListener('click', close);
  if (closeBtn) closeBtn.addEventListener('click', close);

  // ページ内ナビクリックで閉じる
  document.querySelectorAll('.sidebar-page-link').forEach(function (link) {
    link.addEventListener('click', close);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
})();

// スクロール時ナビに影を付与
(function () {
  const nav = document.getElementById('header-nav');
  const headerTop = document.getElementById('header-top');
  if (!nav || !headerTop) return;

  const observer = new IntersectionObserver(
    function (entries) {
      const isVisible = entries[0].isIntersecting;
      nav.classList.toggle('scrolled', !isVisible);
    },
    { threshold: 0 }
  );

  observer.observe(headerTop);
})();
