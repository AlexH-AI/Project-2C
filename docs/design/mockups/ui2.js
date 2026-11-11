/* Heritas L-CRM — UI language 2 (T-416): behaviour shared by the G3 mockups of rounds a–g.
   A plain script (no module, no fetch), so a mockup also opens straight from the file.
   1 two systems from one specimen (.duo) · 2 copies of a window (data-clone) · 3 window behaviour
   (screens, sliding pill, dialog, toast, customer-name mask) · 4 segmented controls · 5 stage (system,
   size, fit) · 6 pointer light on cards · 7 scroll reveal · 8 the spring lab of components.html
   Everything is found by class or data attribute and handled by delegation: a copied window works
   like the one it was copied from. */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const OS_NAME = { mac: 'macOS', win: 'Windows 11' };
  const OS_ICON = {
    mac: '<svg class="ic" viewBox="0 0 24 24"><rect x="3" y="4.5" width="18" height="12" rx="2.5" /><path d="M9 20h6M12 16.5V20" /></svg>',
    win: '<svg class="ic" viewBox="0 0 24 24"><path d="M4 4h7.2v7.2H4zM12.8 4H20v7.2h-7.2zM4 12.8h7.2V20H4zM12.8 12.8H20V20h-7.2z" /></svg>',
  };

  /* ---------- 1. One specimen, two systems ---------- */
  // <div class="duo">…specimen…</div> becomes a macOS pane and a Windows 11 pane with the same content.
  // data-pane="desk center" adds classes to both panes; data-only="mac" keeps one system.
  for (const duo of $$('.duo')) {
    const kids = [...duo.childNodes];
    const only = duo.dataset.only;
    for (const os of only ? [only] : ['mac', 'win']) {
      const pane = document.createElement('div');
      pane.className = `os ${duo.dataset.pane || ''}`;
      pane.dataset.os = os;
      pane.innerHTML = `<span class="os-tag">${OS_ICON[os]}${OS_NAME[os]}</span>`;
      for (const k of kids) pane.append(k.cloneNode(true));
      duo.append(pane);
    }
    for (const k of kids) k.remove();
  }

  /* ---------- 2. Copies of a window ---------- */
  // <div data-clone="#win" data-screen="appointments" data-dialog data-masked> gets a copy of that window.
  for (const holder of $$('[data-clone]')) {
    const src = $(holder.dataset.clone);
    if (!src) continue;
    const copy = src.cloneNode(true);
    copy.removeAttribute('id');
    $$('[id]', copy).forEach((n) => n.removeAttribute('id'));
    copy.classList.remove('modal', 'masked');
    if (holder.dataset.variant) copy.classList.add(holder.dataset.variant);
    holder.append(copy);
    if (holder.dataset.screen) go(copy, holder.dataset.screen, true);
    if ('dialog' in holder.dataset) copy.classList.add('modal');
    if ('masked' in holder.dataset) mask(copy, true);
    if ('marked' in holder.dataset) copy.classList.add('mark-kh');
  }

  /* ---------- 3. Window behaviour ---------- */
  // The toolbar of each screen is written on its sidebar item:
  // data-go (the screen), data-sub (line under the title), data-tools (which pickers show), data-act (main button).
  function go(win, screen, quiet) {
    const item = $(`.nav-i[data-go="${screen}"]`, win);
    if (!item) return;
    $$('.nav-i', win).forEach((n) => n.classList.toggle('on', n === item));
    $$('.view', win).forEach((v) => v.classList.toggle('on', v.dataset.view === screen));
    const title = $('.tl-title', win);
    if (title) {
      $('h2', title).textContent = item.dataset.title || item.textContent.trim();
      $('span', title).textContent = item.dataset.sub || '';
      if (!quiet) { title.classList.remove('swap'); void title.offsetWidth; title.classList.add('swap'); }
    }
    const scope = $('[data-tool="scope"] span', win);
    if (scope) scope.textContent = item.dataset.scope || 'Toàn bộ';
    const tools = (item.dataset.tools || '').split(' ');
    $$('[data-tool]', win).forEach((t) => { t.hidden = !tools.includes(t.dataset.tool); });
    const act = $('[data-act-btn]', win);
    if (act) {
      act.hidden = !item.dataset.act;
      const label = $('span', act);
      if (label) label.textContent = item.dataset.act || '';
      act.dataset.open = item.dataset.actOpen || '';
    }
    const view = $('.view.on', win);
    if (view) view.scrollTop = 0;
    pill(win);
  }
  // One pill behind the chosen sidebar item; it slides when the item changes.
  function pill(win) {
    const nav = $('.nav', win);
    const on = nav && $('.nav-i.on', nav);
    if (!on) return;
    let p = $('.nav-pill', nav);
    if (!p) { p = document.createElement('i'); p.className = 'nav-pill'; nav.prepend(p); nav.classList.add('pilled'); }
    p.style.setProperty('--y', `${on.offsetTop}px`);
  }
  // Customer-name mask: .kh shows data-kh (the short form), .kh-text shows a row of dots.
  function mask(root, on) {
    root.classList.toggle('masked', on);
    for (const n of $$('.kh, .kh-text', root)) {
      if (n.dataset.full === undefined) n.dataset.full = n.textContent;
      n.textContent = on ? (n.classList.contains('kh') ? n.dataset.kh : '•••') : n.dataset.full;
    }
    for (const b of $$('[data-mask]', root)) {
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
      const label = $('span', b);
      if (label) label.hidden = !on;
      b.title = on ? 'Đang che tên khách hàng · bấm để hiện lại' : 'Che tên khách hàng';
    }
  }
  function toast(win, html) {
    const t = $(':scope > .toast', win);
    if (!t) return;
    $('span', t).innerHTML = html;
    t.classList.add('on');
    clearTimeout(t._t);
    t._t = setTimeout(() => t.classList.remove('on'), 4200);
  }

  $$('.win').forEach((w) => { const on = $('.nav-i.on', w); if (on) go(w, on.dataset.go, true); });
  $$('[data-masked-init]').forEach((n) => mask(n, true));

  document.addEventListener('click', (e) => {
    const win = e.target.closest('.win');
    const nav = e.target.closest('.nav-i[data-go]');
    if (win && nav) return go(win, nav.dataset.go);
    const jump = e.target.closest('[data-jump]');
    if (win && jump) return go(win, jump.dataset.jump);
    const m = e.target.closest('[data-mask]');
    if (m) {
      const root = m.closest('.win, .maskable');
      const on = !root.classList.contains('masked');
      mask(root, on);
      if (root.matches('.win')) toast(root, on ? 'Đang che tên khách hàng <small>· bấm lại nút con mắt để hiện</small>' : 'Đã hiện lại tên khách hàng');
      return;
    }
    const open = e.target.closest('[data-open="dialog"]');
    if (win && open) return win.classList.add('modal');
    const close = e.target.closest('[data-close], .scrim');
    if (win && close) {
      win.classList.remove('modal');
      if (close.dataset.close === 'save') toast(win, 'Đã tạo lịch hẹn <small class="num">· Thứ Hai 28/09/2026 14:00</small>');
      return;
    }
    const set = e.target.closest('.set-i');
    if (set) {
      const box = set.closest('.set');
      $$('.set-i', box).forEach((b) => b.classList.toggle('on', b === set));
      $$('[data-set-pane]', box).forEach((p) => { p.hidden = p.dataset.setPane !== set.dataset.setI; });
      return;
    }
    const row = e.target.closest('tr.team[data-team]');
    if (row) {
      const open = row.classList.toggle('open');
      $$(`tr.rm[data-team="${row.dataset.team}"]`, row.closest('table')).forEach((r) => { r.hidden = !open; });
      return;
    }
    const choice = e.target.closest('.choices .choice');
    if (choice) { $$('.choice', choice.parentElement).forEach((c) => c.classList.toggle('on', c === choice)); return; }
    const check = e.target.closest('.check');
    if (check) { check.classList.toggle('on'); return; }
    const sort = e.target.closest('.tbl th.sort');
    if (sort) {
      const desc = sort.classList.contains('desc');
      $$('th.sort', sort.parentElement).forEach((t) => t.classList.remove('asc', 'desc'));
      sort.classList.add(desc ? 'asc' : 'desc');
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') $$('.win.modal').forEach((w) => w.classList.remove('modal'));
  });

  /* ---------- 4. Segmented controls ---------- */
  function thumb(seg) {
    const on = $('button.on', seg);
    if (!on || !seg.offsetWidth) return;
    let t = $('.thumb', seg);
    if (!t) { t = document.createElement('i'); t.className = 'thumb'; seg.prepend(t); seg.classList.add('thumbed'); }
    t.style.setProperty('--x', `${on.offsetLeft}px`);
    t.style.setProperty('--w', `${on.offsetWidth}px`);
  }
  const thumbs = () => $$('.seg').forEach(thumb);
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.seg button');
    if (!b) return;
    const seg = b.parentElement;
    $$('button', seg).forEach((x) => x.classList.toggle('on', x === b));
    thumb(seg);
    if (seg.dataset.set) setStage(seg.dataset.set, b.dataset.v);
    // A switch for one framed window: data-os-for names the frame.
    const frame = seg.dataset.osFor && $(seg.dataset.osFor);
    if (frame) { frame.dataset.os = b.dataset.v; requestAnimationFrame(() => { $$('.win', frame).forEach(pill); thumbs(); }); }
  });

  /* ---------- 5. Stage: the window on its desktop ---------- */
  const stage = $('.stage');
  const SIZES = { fit: null, full: [1440, 900], min: [1100, 700] };
  let size = 'fit';
  function fit() {
    if (!stage) return;
    const slot = $('.slot', stage);
    const availW = stage.clientWidth - 56, availH = stage.clientHeight - 74 - 40;
    const [w, h] = SIZES[size] || [Math.max(1100, Math.min(1440, availW)), Math.max(700, Math.min(900, availH))];
    const f = Math.min(1, availW / w, availH / h);
    slot.style.setProperty('--ww', `${w}px`);
    slot.style.setProperty('--wh', `${h}px`);
    slot.style.setProperty('--fit', f.toFixed(4));
    const note = $('[data-size-note]', stage);
    if (note) note.textContent = `${w} × ${h}${f < 1 ? ` · thu ${Math.round(f * 100)}%` : ''}`;
    $$('.win', stage).forEach(pill);
  }
  function setStage(key, v) {
    if (key === 'os' && stage) { stage.dataset.os = v; requestAnimationFrame(() => { $$('.win', stage).forEach(pill); thumbs(); }); }
    if (key === 'size') { size = v; fit(); }
  }
  fit();
  addEventListener('resize', () => { fit(); thumbs(); $$('.win').forEach(pill); });
  thumbs();
  // Fonts change the width of a segment: place the thumbs again once they are in.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { thumbs(); $$('.win').forEach(pill); });

  /* ---------- 6. A soft light follows the pointer across a card ---------- */
  document.addEventListener('pointermove', (e) => {
    const c = e.target.closest && e.target.closest('.card');
    if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    c.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  }, { passive: true });

  /* ---------- 7. Scroll reveal (only when the script can also take it away) ---------- */
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((list) => {
      for (const x of list) if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); }
    }, { rootMargin: '0px 0px -8% 0px' });
    for (const s of $$('.sec > h2, .sec > .lead, .sec > .duo, .sec > .gal, .sec > .pgrid, .sec > .pcard')) { s.classList.add('reveal'); io.observe(s); }
    // Nothing stays hidden if the page is printed or the observer never fires (a hidden tab).
    setTimeout(() => $$('.reveal:not(.in)').forEach((n) => { const r = n.getBoundingClientRect(); if (r.top < innerHeight) n.classList.add('in'); }), 600);
  }

  /* ---------- 8. Spring lab ---------- */
  document.addEventListener('click', (e) => {
    const run = e.target.closest('[data-lab-run]');
    if (!run) return;
    const lab = run.closest('.lab');
    lab.classList.toggle('go');
  });
})();
