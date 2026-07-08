/**
 * Tozlu Skor — Frontend İçerik Koruma Sistemi
 *
 * AMAÇ: Sıradan kullanıcıların kopyala-yapıştır, sağ tık, sürükle-bırak
 * ve yazdırma davranışlarını caydırmak. Bu bir DRM değildir; DevTools,
 * tarayıcı uzantıları, curl/wget, ekran kaydı ve OS-seviye ekran
 * görüntüsü kısayolları frontend JS ile tamamen engellenemez.
 *
 * İSTİSNA: /admin yolunda (Decap CMS) bu script tamamen devre dışıdır.
 */
(function () {
  'use strict';

  // ─── /admin istisnası ───
  if (window.location.pathname.startsWith('/admin')) return;

  // ─── Toast bildirimi (throttled) ───
  var toastEl = null;
  var toastTimer = 0;
  var lastToast = 0;
  var COOLDOWN = 8000; // 8s spam engeli

  function showToast() {
    var now = Date.now();
    if (now - lastToast < COOLDOWN) return;
    lastToast = now;

    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'cp-toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      toastEl.textContent = 'Tozlu Skor içerikleri telif hakkı kapsamında korunmaktadır.';
      document.body.appendChild(toastEl);
    }

    clearTimeout(toastTimer);
    // force reflow for re-trigger
    toastEl.classList.remove('cp-toast--visible');
    void toastEl.offsetWidth;
    toastEl.classList.add('cp-toast--visible');

    toastTimer = setTimeout(function () {
      toastEl.classList.remove('cp-toast--visible');
    }, 2500);
  }

  // ─── 1. Copy / Cut / SelectStart / ContextMenu ───
  document.addEventListener('copy', function (e) { e.preventDefault(); showToast(); }, true);
  document.addEventListener('cut', function (e) { e.preventDefault(); }, true);
  document.addEventListener('selectstart', function (e) {
    // input/textarea/select/button/contenteditable içinde serbest bırak
    var tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON') return;
    if (e.target.isContentEditable) return;
    e.preventDefault();
  }, true);
  document.addEventListener('contextmenu', function (e) { e.preventDefault(); showToast(); }, true);

  // ─── 2. Görsel sürükleme engeli ───
  document.addEventListener('dragstart', function (e) {
    if (e.target.tagName === 'IMG') { e.preventDefault(); }
  }, true);

  // img draggable=false ata (mevcut + gelecek)
  function disableImgDrag() {
    var imgs = document.querySelectorAll('img');
    for (var i = 0; i < imgs.length; i++) {
      imgs[i].setAttribute('draggable', 'false');
    }
  }
  disableImgDrag();
  // MutationObserver ile sonradan eklenen görseller
  if (window.MutationObserver) {
    new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        if (muts[i].addedNodes.length) { disableImgDrag(); return; }
      }
    }).observe(document.body, { childList: true, subtree: true });
  }

  // ─── 3. Klavye kısayolları ───
  document.addEventListener('keydown', function (e) {
    var ctrl = e.ctrlKey || e.metaKey;
    var shift = e.shiftKey;
    var key = e.key ? e.key.toLowerCase() : '';
    var code = e.keyCode || e.which;

    // F12
    if (code === 123) { e.preventDefault(); return; }

    if (ctrl) {
      // Ctrl/Cmd + C, X, U, S, P
      if (key === 'c' || key === 'x' || key === 'u' || key === 's' || key === 'p') {
        // input/textarea içindeyse izin ver (C/X)
        var tag = (e.target.tagName || '').toUpperCase();
        if ((key === 'c' || key === 'x') && (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable)) return;
        e.preventDefault();
        if (key === 'c') showToast();
        return;
      }
      // Ctrl/Cmd + Shift + I, J (DevTools)
      if (shift && (key === 'i' || key === 'j')) {
        e.preventDefault();
        return;
      }
    }

    /**
     * NOT: OS-seviye ekran görüntüsü kısayolları (PrintScreen, Cmd+Shift+3/4/5)
     * tarayıcı JavaScript'i ile güvenilir şekilde engellenemez.
     * PrintScreen (keyCode 44) bazı tarayıcılarda keydown'a düşmez.
     * Aşağıdaki blok yalnızca caydırıcıdır.
     */
    if (code === 44) { e.preventDefault(); return; } // PrintScreen (caydırıcı)
  }, true);

})();
