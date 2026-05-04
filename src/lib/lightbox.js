/**
 * 共享 lightbox 单例工具。
 * 接受图片数组，返回 { show, close, bindToImages } API。
 * MomentImages 和 ArticleLightbox 共用同一个 DOM 单例，避免重复。
 */
export function createLightbox(images) {
  if (!images.length) return { show() {}, close() {}, bindToImages() {} };

  // 全局单例：避免多个组件重复创建 DOM
  let lb = document.querySelector('.moment-lightbox');
  let bound = false;

  if (!lb) {
    lb = document.createElement('div');
    lb.className = 'moment-lightbox';
    lb.innerHTML =
      '<button class="lb-close" aria-label="Close">&times;</button>' +
      '<button class="lb-nav lb-prev" aria-label="Previous">&lsaquo;</button>' +
      '<button class="lb-nav lb-next" aria-label="Next">&rsaquo;</button>' +
      '<div class="lb-img-wrap"><img class="lb-img" src="" alt="" /></div>' +
      '<span class="lb-counter"></span>';
    document.body.appendChild(lb);

    // 全局事件只绑定一次
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click', () => nav(-1));
    lb.querySelector('.lb-next').addEventListener('click', () => nav(1));
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', onKey);

    bound = true;
  }

  const imgEl = lb.querySelector('.lb-img');
  const prevBtn = lb.querySelector('.lb-prev');
  const nextBtn = lb.querySelector('.lb-next');
  const counter = lb.querySelector('.lb-counter');
  let currentIdx = 0;
  let cursorDot = null;
  let cursorTrail = null;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    const wrap = lb.querySelector('.lb-img-wrap');
    if (wrap) wrap.style.transition = 'none';
  }

  function show(idx) {
    currentIdx = idx;
    const img = images[idx];
    if (!img) return;
    imgEl.src = img.src;
    imgEl.alt = img.alt;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    cursorDot = document.querySelector('.cursor-dot');
    cursorTrail = document.querySelector('.cursor-trail');
    if (cursorDot) cursorDot.style.display = 'none';
    if (cursorTrail) cursorTrail.style.display = 'none';
    updateNav();
  }

  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    if (cursorDot) cursorDot.style.display = '';
    if (cursorTrail) cursorTrail.style.display = '';
  }

  function nav(delta) {
    const next = currentIdx + delta;
    if (next >= 0 && next < images.length) show(next);
  }

  function updateNav() {
    prevBtn.classList.toggle('hidden', currentIdx === 0);
    nextBtn.classList.toggle('hidden', currentIdx === images.length - 1);
    counter.textContent = images.length > 1 ? (currentIdx + 1) + ' / ' + images.length : '';
  }

  function onKey(e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') nav(-1);
    if (e.key === 'ArrowRight') nav(1);
  }

  function bindToImages(selector) {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.addEventListener('click', () => show(i));
    });
  }

  return { show, close, bindToImages, get length() { return images.length; } };
}
