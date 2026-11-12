/* Heritas L-CRM — UI language 2 (T-416): behaviour shared by the G3 mockups of rounds a–g.
   A plain script (no module, no fetch), so a mockup also opens straight from the file.
   1 two systems from one specimen (.duo) · 2 copies of a window (data-clone) · 3 window behaviour
   (screens, sliding pill, dialog, toast, customer-name mask) · 4 segmented controls · 5 stage (system,
   size, fit) · 6 pointer light on cards · 7 scroll reveal · 8 the spring lab of components.html
   Round b (T-417): 9 pages off the sidebar, with a way back · 10 search shared by the palette and the
   fields · 11 command palette ⌘K / Ctrl K · 12 "Lưu ý" and jobs in the background · 13 a search field
   that lights what it finds · 14 pick one swatch or icon · 15 window.ui2 for the page's own script
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

  /* ---------- 9. Pages off the sidebar, with a way back (round b) ---------- */
  // A page with no sidebar item of its own (the RM page, the customer profile) is a .view that names the
  // item that stays chosen (data-nav) and carries its toolbar the way a sidebar item does (data-title,
  // data-sub, data-tools, data-act, data-act-open). Anything with data-view-go="<view>" opens it. Just
  // before it shows, the window hears "ui2:open" (detail: view, from = what was clicked) so the page can
  // fill it and set those attributes. The window remembers what was on screen: [data-back] in the page
  // returns there and its <span> names it. A sidebar click or a jump forgets the way back.
  const titleOf = (win) => { const h = $('.tl-title h2', win); return h ? h.textContent : ''; };
  function show(win, name, from, quiet, noPush) {
    const view = $(`.view[data-view="${name}"]`, win);
    if (!view) return;
    const cur = $('.view.on', win);
    if (cur && !noPush) (win._back = win._back || []).push({ name: cur.dataset.view, title: titleOf(win), from: cur._from });
    view._from = from;
    win.dispatchEvent(new CustomEvent('ui2:open', { detail: { view: name, from } }));
    $$('.nav-i', win).forEach((n) => n.classList.toggle('on', n.dataset.go === view.dataset.nav));
    $$('.view', win).forEach((v) => v.classList.toggle('on', v === view));
    const title = $('.tl-title', win);
    if (title) {
      $('h2', title).textContent = view.dataset.title || '';
      $('span', title).textContent = view.dataset.sub || '';
      if (!quiet) { title.classList.remove('swap'); void title.offsetWidth; title.classList.add('swap'); }
    }
    const tools = (view.dataset.tools || '').split(' ');
    $$('[data-tool]', win).forEach((t) => { t.hidden = !tools.includes(t.dataset.tool); });
    const act = $('[data-act-btn]', win);
    if (act) {
      act.hidden = !view.dataset.act;
      const label = $('span', act);
      if (label) label.textContent = view.dataset.act || '';
      act.dataset.open = view.dataset.actOpen || '';
    }
    // Nothing before it (opened straight, or the way back was forgotten): back goes to its sidebar item
    const prev = (win._back || []).at(-1), home = $(`.nav-i[data-go="${view.dataset.nav}"]`, win);
    const label = prev ? prev.title : home ? home.dataset.title || home.textContent.trim() : '';
    $$('[data-back] span', view).forEach((s) => { s.textContent = label; });
    // what the page just drew follows the customer-name mask of the window
    if (win.classList.contains('masked')) mask(win, true);
    view.scrollTop = 0;
    pill(win);
  }
  function back(win) {
    const prev = (win._back || []).pop();
    if (!prev) return go(win, (($('.view.on', win) || {}).dataset || {}).nav || 'overview');
    if ($(`.nav-i[data-go="${prev.name}"]`, win)) return go(win, prev.name);
    show(win, prev.name, prev.from, false, true);
  }

  /* ---------- 10. Search, the way the app compares text (searchText of packages/domain) ---------- */
  // Accents and case do not count: "nguyen van hu" finds "Nguyễn Văn Hùng". One folded character per
  // character, so a match carries back to the text it lights. An option of a list (the palette, the list
  // under a search field) is a .pal-o: data-find holds what it can be found by, data-hl marks the parts
  // that light up, the name first. Score: the name starts with the query 4, a word of the name starts
  // with it 3, the name holds it 2, another part (the customer code) holds it 1. The same score keeps the
  // order of the markup, which the page writes in the app's order of names (byName).
  const foldCh = (ch) => (ch === 'đ' || ch === 'Đ' ? 'd' : ch.normalize('NFD')[0].toLowerCase());
  const fold = (s) => [...String(s).normalize('NFC')].map(foldCh).join('');
  const foldQ = (s) => fold(s).replace(/\s+/g, ' ').trim();
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const plainOf = (el) => (el.dataset.full !== undefined ? el.dataset.full : el.textContent);
  function score(opt, q) {
    const hl = $$('[data-hl]', opt);
    const name = hl.length ? fold(plainOf(hl[0])) : '';
    if (name.startsWith(q)) return 4;
    if (name.includes(' ' + q)) return 3;
    if (name.includes(q)) return 2;
    return fold(opt.dataset.find || '').includes(q) ? 1 : 0;
  }
  // The query lit in each marked part. A customer's name is left alone while names are hidden: the
  // search still runs on the real name, the result shows the short form.
  function light(opt, q) {
    const masked = !!opt.closest('.masked');
    for (const el of $$('[data-hl]', opt)) {
      if (masked && el.classList.contains('kh')) continue;
      const text = plainOf(el), at = q ? fold(text).indexOf(q) : -1, ch = [...text.normalize('NFC')];
      el.innerHTML = at < 0 ? esc(text) : `${esc(ch.slice(0, at).join(''))}<mark>${esc(ch.slice(at, at + q.length).join(''))}</mark>${esc(ch.slice(at + q.length).join(''))}`;
    }
  }
  const groupsOf = (list) => { const g = $$('.pal-g', list); return g.length ? g : [list]; };
  // The options on show, in the order they are seen
  const visible = (list) => groupsOf(list).filter((g) => !g.hidden).flatMap((g) => $$('.pal-o', g).filter((o) => !o.hidden).sort((a, b) => (+a.style.order || 0) - (+b.style.order || 0)));
  // Filter a list: in each group (.pal-g) the options that match, best first, at most data-max. With no
  // query only the groups with data-idle show, that many options each. .pal-none shows when nothing
  // matches; its [data-q] repeats the query. Returns how many options show.
  function filter(list, raw) {
    const q = foldQ(raw);
    let shown = 0;
    for (const g of groupsOf(list)) {
      const opts = $$('.pal-o', g);
      const picked = !q
        ? (g.dataset.idle ? opts.slice(0, +g.dataset.idle || opts.length) : [])
        : opts.map((o, i) => ({ o, i, s: score(o, q) })).filter((x) => x.s).sort((a, b) => b.s - a.s || a.i - b.i).slice(0, +(g.dataset.max || 99)).map((x) => x.o);
      for (const o of opts) { o.hidden = !picked.includes(o); o.classList.remove('sel'); }
      picked.forEach((o, k) => { o.style.order = k; light(o, q); });
      if (g !== list) g.hidden = !picked.length;
      shown += picked.length;
    }
    const first = visible(list)[0];
    if (first) first.classList.add('sel');
    const none = $('.pal-none', list);
    if (none) {
      none.hidden = !!shown || !q;
      $$('[data-q]', none).forEach((s) => { s.textContent = raw.trim(); });
    }
    return shown;
  }
  function move(list, dir) {
    const v = visible(list);
    if (!v.length) return;
    const at = v.findIndex((o) => o.classList.contains('sel'));
    const next = v[(at + dir + v.length) % v.length];
    v.forEach((o) => o.classList.toggle('sel', o === next));
    next.scrollIntoView({ block: 'nearest' });
  }

  /* ---------- 11. Command palette: ⌘K on macOS, Ctrl K on Windows, on every screen (ý 09) ---------- */
  // .win > .pal is a layer of the focus level, like a dialog, with a state of its own (.win.pal-on):
  // opened by the shortcut, by the search box of the Windows 11 title bar, by the search button of the
  // macOS toolbar and by anything with data-open="pal" (outside a window: the window of the stage).
  // ↑ ↓ choose, Enter opens, Esc or a click on the dimmed window closes.
  function closeFloats(win) {
    win.classList.remove('pal-on', 'now-on');
    $$('.find.open', win).forEach((f) => f.classList.remove('open'));
  }
  function openPal(win, q = '', quiet) {
    const pal = win && $(':scope > .pal', win);
    if (!pal) return;
    closeFloats(win);
    win.classList.add('pal-on');
    const input = $('input', pal);
    input.value = q;
    filter($('.pal-list', pal), q);
    if (!quiet) input.focus({ preventScroll: true });
  }
  const stageWin = () => $('.stage .win') || $('.win');

  /* ---------- 12. "Lưu ý" ("Heads-up"): the next appointment and the jobs in the background (ý 11) ---------- */
  // .now-pill sits on the toolbar of every screen; a click opens .now-pop under it (.win.now-on). A job takes
  // the control over while it runs (its name, a bar, the percent), then says it is done and gives the
  // control back; a job that fails stays until it is clicked. Each job also gets a line in [data-jobs].
  function placePop(win) {
    const now = $('.now-pill', win), pop = $('.now-pop', win);
    if (!now || !pop) return;
    const host = pop.offsetParent || win, h = host.getBoundingClientRect(), n = now.getBoundingClientRect();
    const s = h.width / host.offsetWidth || 1;
    const half = pop.offsetWidth / 2, x = (n.left + n.width / 2 - h.left) / s;
    pop.style.left = `${Math.max(half + 12, Math.min(x, host.offsetWidth - half - 12))}px`;
  }
  // The idle face comes back as it was kept: show its customer name the way the window shows names now
  function nameMask(root, on) {
    for (const n of $$('.kh', root)) {
      if (n.dataset.full === undefined) n.dataset.full = n.textContent;
      n.textContent = on ? n.dataset.kh : n.dataset.full;
    }
  }
  function job(win, label, done, failed) {
    const now = win && $('.now-pill', win);
    if (!now) return;
    if (now._idle === undefined) now._idle = now.innerHTML;
    clearTimeout(now._t);
    now.classList.remove('done', 'fail');
    now.classList.add('busy');
    now.innerHTML = `<span class="now-face"><svg class="ic"><use href="#i-export" /></svg><span class="who">${esc(label)}</span><span class="now-bar"><i></i></span><span class="num left">0%</span></span>`;
    const list = $('[data-jobs]', win);
    const row = document.createElement('div');
    row.className = 'job-row';
    row.innerHTML = `<svg class="ic"><use href="#i-export" /></svg><span>${esc(label)}</span><span class="num left">0%</span>`;
    if (list) { list.hidden = false; list.prepend(row); }
    const steps = [0.22, 0.5, 0.78, 1];
    const tick = (k) => {
      if (k < steps.length) {
        const p = failed && k === 2 ? null : steps[k];
        if (p === null) return finish(false);
        const bar = $('.now-bar i', now), pct = `${Math.round(steps[k] * 100)}%`;
        if (bar) bar.style.setProperty('--p', steps[k]);
        $$('.left', now).forEach((x) => { x.textContent = pct; });
        $('.left', row).textContent = pct;
        now._t = setTimeout(() => tick(k + 1), reduce ? 60 : 420);
        return;
      }
      finish(true);
    };
    const finish = (ok) => {
      now.classList.remove('busy');
      now.classList.add(ok ? 'done' : 'fail');
      const icon = ok ? '#i-check' : '#i-alert';
      const text = ok ? done : `${label.replace(/^Đang /, '')} không xong · bấm để thử lại`;
      now.innerHTML = `<span class="now-face"><svg class="ic"><use href="${icon}" /></svg><b class="who">${esc(text)}</b></span>`;
      row.classList.add(ok ? 'ok' : 'bad');
      row.innerHTML = `<svg class="ic"><use href="${icon}" /></svg><span>${esc(ok ? done : text)}</span><span class="num left">${ok ? '13:36' : 'lỗi'}</span>`;
      if (ok) now._t = setTimeout(() => { now.classList.remove('done'); now.innerHTML = now._idle; nameMask(now, win.classList.contains('masked')); }, reduce ? 2400 : 3400);
      else now._retry = () => job(win, label, done);
    };
    now._t = setTimeout(() => tick(0), reduce ? 0 : 120);
  }

  /* ---------- 13. A search field that lights what it finds ("Tìm là sáng", ý 25) ---------- */
  // <div class="find" data-lights="<selector in the window>"> holds an .input.search with an <input>, and
  // a .menu.sug of .pal-o options written like the palette's (data-find, data-hl). Typing filters the
  // list under the field; in the element named by data-lights each [data-find] item lights up (.lit) or
  // dims: nothing hides and no column moves, a match goes to the top of its [data-find-group], whose
  // .find-n says how many match. ↑ ↓ Enter pick from the list, Esc clears the field.
  function findIn(field) {
    const input = $('input', field), q = foldQ(input.value), sug = $('.sug', field);
    if (sug) filter(sug, input.value);
    field.classList.toggle('open', !!q && field.contains(document.activeElement));
    const root = field.dataset.lights && (field.closest('.win') || document).querySelector(field.dataset.lights);
    if (!root) return;
    root.classList.toggle('finding', !!q);
    for (const it of $$('[data-find]', root)) {
      const on = !!q && fold(it.dataset.find).includes(q);
      it.classList.toggle('lit', on);
      it.style.order = on ? '-1' : '';
    }
    for (const g of $$('[data-find-group]', root)) {
      const n = $$('[data-find].lit', g).length, out = $('.find-n', g);
      if (out) { out.hidden = !q; out.textContent = `${n} khớp`; }
    }
  }

  /* ---------- Round b: clicks, keys, typing ---------- */
  document.addEventListener('click', (e) => {
    const win = e.target.closest('.win');
    if (win && e.target.closest('.nav-i[data-go], [data-jump]')) { win._back = []; closeFloats(win); }
    const viewGo = e.target.closest('[data-view-go]');
    if (win && viewGo) show(win, viewGo.dataset.viewGo, viewGo);
    if (win && e.target.closest('[data-back]')) back(win);
    const run = e.target.closest('[data-run]');
    if (win && run) win.dispatchEvent(new CustomEvent('ui2:run', { detail: { run: run.dataset.run, from: run } }));
    if (win && e.target.closest('.pal-o')) {
      win.classList.remove('pal-on');
      const f = e.target.closest('.find');
      if (f) f.classList.remove('open');
    }
    if (e.target.closest('[data-open="pal"], .tb-search, .tl-find')) return openPal(win || stageWin());
    if (!win) return;
    if (e.target.closest('.scrim')) win.classList.remove('pal-on');
    const now = e.target.closest('.now-pill');
    if (now) {
      if (now._retry && now.classList.contains('fail')) { const r = now._retry; now._retry = null; return r(); }
      const on = !win.classList.contains('now-on');
      closeFloats(win);
      if (on) { win.classList.add('now-on'); placePop(win); }
      return;
    }
    if (!e.target.closest('.now-pop')) win.classList.remove('now-on');
    if (e.target.closest('[data-open="job"]')) {
      const spec = ((($('.nav-i.on', win) || {}).dataset || {}).job || 'Đang xuất Excel|Đã xuất file Excel').split('|');
      job(win, spec[0], spec[1]);
    }
  });
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      const w = (document.activeElement && document.activeElement.closest('.win')) || stageWin();
      if (!w || !$(':scope > .pal', w)) return;
      e.preventDefault();
      if (w.classList.contains('pal-on')) w.classList.remove('pal-on');
      else openPal(w);
      return;
    }
    const input = e.target.closest && e.target.closest('.pal input, .find input');
    if (input) {
      const pal = input.closest('.pal');
      const list = pal ? $('.pal-list', pal) : $('.sug', input.closest('.find'));
      if (list && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { e.preventDefault(); return move(list, e.key === 'ArrowDown' ? 1 : -1); }
      if (list && e.key === 'Enter') { const sel = visible(list).find((o) => o.classList.contains('sel')); if (sel) { e.preventDefault(); sel.click(); } return; }
      if (!pal && e.key === 'Escape') { input.value = ''; findIn(input.closest('.find')); input.blur(); return; }
    }
    if (e.key === 'Escape') $$('.win').forEach((w) => w.classList.remove('pal-on', 'now-on'));
  });
  document.addEventListener('input', (e) => {
    if (!e.target.closest) return;
    const pal = e.target.closest('.pal');
    if (pal) return filter($('.pal-list', pal), e.target.value);
    const f = e.target.closest('.find');
    if (f) findIn(f);
  });
  document.addEventListener('focusin', (e) => { const f = e.target.closest && e.target.closest('.find'); if (f && foldQ($('input', f).value)) f.classList.add('open'); });
  document.addEventListener('focusout', (e) => { const f = e.target.closest && e.target.closest('.find'); if (f) f.classList.remove('open'); });
  // A click in the list under a field keeps the focus in the field, so the list stays until it is used
  document.addEventListener('mousedown', (e) => { if (e.target.closest && e.target.closest('.sug')) e.preventDefault(); });

  /* ---------- 14. Pick one: the colour and the icon of a team (ý 33) ---------- */
  // [data-pick] holds buttons, one of them .on; the page hears "ui2:pick" (detail: group, value).
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-pick] > button');
    if (!b) return;
    const group = b.parentElement;
    $$('button', group).forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-checked', String(x === b)); });
    group.dispatchEvent(new CustomEvent('ui2:pick', { bubbles: true, detail: { group: group.dataset.pick, value: b.dataset.v || '' } }));
  });

  /* ---------- 15. For the page's own script ---------- */
  window.ui2 = { go, show, back, mask, toast, job, openPal, filter, findIn, fold };
})();
