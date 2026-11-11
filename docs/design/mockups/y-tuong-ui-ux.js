/* Heritas L-CRM — UI/UX concept, second idea round (T-415): mock data and behaviour of the idea board.
   Everything here is made up and nothing reads the app. Sections: data · format · chrome + navigation
   · screens · floats (palette, sheet, popovers) · ideas + pick list · board extras · keyboard · start */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ic = (n, c = '') => `<svg class="ic ${c}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  const sum = (arr, f = (x) => x) => arr.reduce((a, x) => a + f(x), 0);
  const addV = (a, b) => a.map((v, i) => v + b[i]);

  /* ---------- Data (period: 01/11 – 10/11/2026, today Tuesday 10/11/2026; money in triệu) ---------- */
  // p = the same days of October, for the comparisons
  const TEAMS = [
    { name: 'Sao Mai', tl: 'Đào Minh Khôi', sub: 15, cs: 260, p: { issued: 11, cancelled: 0, sales: 440, rf: 15, sub: 14, cs: 300 } },
    { name: 'Bình Minh', tl: 'Lý Gia Trang', sub: 14, cs: 385, p: { issued: 10, cancelled: 1, sales: 452, rf: 14, sub: 13, cs: 400 } },
    { name: 'Hừng Đông', tl: 'Tạ Bảo Châu', sub: 12, cs: 375, p: { issued: 9, cancelled: 0, sales: 336, rf: 14, sub: 11, cs: 363 } },
  ];
  // name, team, issued, cancelled, FYP issued, FYP cancelled, RF, appointments [met, missed, unrecorded, expected],
  // customers [N4, N3, N2, N1], forecast of the month from today
  const RMS = [
    ['Hoàng Văn Tùng', 0, 6, 0, 280, 0, 7, [12, 4, 2, 38], [40, 29, 18, 20], 360],
    ['Đặng Văn Phúc', 0, 4, 1, 170, 50, 5, [11, 5, 2, 35], [38, 27, 16, 18], 220],
    ['Lê Ngọc Hương', 0, 3, 0, 120, 0, 5, [9, 3, 1, 33], [35, 25, 14, 16], 0],
    ['Phạm Thu Hà', 1, 5, 0, 230, 0, 6, [14, 3, 1, 36], [46, 25, 18, 22], 260],
    ['Bùi Ngọc Trâm', 1, 4, 0, 160, 0, 5, [12, 2, 1, 34], [44, 24, 16, 21], 180],
    ['Đỗ Văn Hiếu', 1, 2, 0, 90, 0, 4, [11, 3, 1, 32], [42, 22, 15, 19], 0],
    ['Lê Hoài Nam', 2, 5, 0, 220, 0, 6, [13, 4, 1, 35], [41, 24, 14, 20], 210],
    ['Trần Quốc Thắng', 2, 3, 1, 130, 50, 5, [10, 5, 2, 33], [39, 22, 12, 18], 90],
    ['Huỳnh Kim Hùng', 2, 2, 0, 80, 0, 4, [10, 3, 1, 33], [36, 21, 11, 16], 0],
  ].map(([name, team, issued, cancelled, fi, fc, rf, appt, kh, fm], i) => ({ i, name, team, issued, cancelled, fi, fc, rf, appt, kh, fm }));
  // name, stage, RM, last met, next appointment, expected case size, issued policies, meetings of the last 8 weeks
  // (m met · x rescheduled / cancelled / no show · s scheduled this week)
  const CUS = [
    ['Trần Minh Huệ', 'n1', 3, '03/11', 'T3 10/11 · 14:00', 60, 0, '.m.m.mms'],
    ['Đỗ Quang Vinh', 'n1', 0, '05/11', 'T4 11/11 · 09:00', 80, 2, 'm.mm.mms'],
    ['Lý Thu Thảo', 'n1', 1, '04/11', 'T6 13/11 · 10:30', 60, 1, '..m.m.ms'],
    ['Hoàng Khải An', 'n1', 4, '30/10', 'T7 14/11 · 09:30', 40, 0, 'm..m.m.s'],
    ['Phan Gia Chi', 'n1', 6, '06/11', 'T7 14/11 · 15:00', 50, 1, '.mm..mms'],
    ['Hồ Đức Sơn', 'n1', 7, '02/11', 'T5 12/11 · 14:00', 30, 0, '...mx.ms'],
    ['Lý Hoài Hùng', 'n1', 0, '28/10', '', null, 2, 'mm.m.m..'],
    ['Nguyễn Văn Hùng', 'n2', 0, '06/11', 'T4 11/11 · 11:00', 80, 1, '.m..mxms'],
    ['Phạm Ngọc Lan', 'n2', 4, '07/11', 'T4 11/11 · 10:30', 50, 2, 'm.m.m.ms'],
    ['Vũ Gia Hải', 'n2', 6, '29/10', 'T4 11/11 · 15:00', 30, 0, '..m..m.s'],
    ['Võ Thanh Bình', 'n2', 3, '05/11', 'T5 12/11 · 16:00', 20, 0, '.m.x.mms'],
    ['Trần Thu Bình', 'n2', 5, '27/10', 'T7 14/11 · 09:00', null, 0, '...m.m.s'],
    ['Lê Quốc Hùng', 'n3', 6, '28/10', 'T3 10/11 · 16:30', 40, 0, '....m.ms'],
    ['Ngô Minh Tâm', 'n3', 0, '31/10', 'T5 12/11 · 09:30', 40, 0, '..x..m.s'],
    ['Dương Quốc Uyên', 'n3', 3, '04/11', 'T6 13/11 · 14:00', 40, 0, '.....mms'],
    ['Bùi Ngọc Hà', 'n3', 2, '22/10', 'T5 12/11 · 10:00', null, 0, '..m..m.s'],
    ['Nguyễn Văn Hưng', 'n3', 3, '20/10', '', null, 0, '.m...m..'],
    ['Phan Thanh Quang', 'n3', 0, '18/09', '', null, 0, 'm.......'],
    ['Nguyễn Thị Hương', 'n4', 0, '', 'T5 12/11 · 15:00', null, 0, '.......s'],
    ['Lê Đức Phúc', 'n4', 2, '', '', null, 0, '........'],
    ['Hồ Kim Hùng', 'n4', 7, '', 'T2 16/11 · 09:00', null, 0, '........'],
    ['Đinh Bảo Ngọc', 'n4', 4, '', '', null, 0, '.......m'],
    ['Vũ Thanh Thắng', 'n4', 5, '21/10', '', null, 0, '..m.....'],
  ].map(([name, st, rm, last, next, cs, pol, cad], i) => ({ i, name, st, rm, last, next, cs, pol, cad, code: 'KH-' + String(1041 + i * 37) }));
  const STAGE = { n1: 'N1', n2: 'N2', n3: 'N3', n4: 'N4' };
  const ST3 = ['n1', 'n2', 'n3'];
  const KH_ALL = { n4: 361, n3: 219, n2: 134, n1: 170 };
  // The week of Forecast: day 1 = T3 10/11 … 5 = T7 14/11. 'dup' = the customer has a later appointment
  // (counted once), 'miss' = no case size yet (not counted)
  const DAYS = [['T2', '09/11'], ['T3', '10/11'], ['T4', '11/11'], ['T5', '12/11'], ['T6', '13/11'], ['T7', '14/11']];
  const APPTS = [
    [1, '14:00', 'Trần Minh Huệ'], [1, '16:30', 'Lê Quốc Hùng'],
    [2, '09:00', 'Đỗ Quang Vinh'], [2, '10:30', 'Phạm Ngọc Lan'], [2, '11:00', 'Nguyễn Văn Hùng', 'dup'], [2, '15:00', 'Vũ Gia Hải'],
    [3, '09:30', 'Ngô Minh Tâm'], [3, '10:00', 'Bùi Ngọc Hà', 'miss'], [3, '14:00', 'Hồ Đức Sơn'], [3, '16:00', 'Võ Thanh Bình'],
    [4, '09:00', 'Nguyễn Văn Hùng'], [4, '10:30', 'Lý Thu Thảo'], [4, '14:00', 'Dương Quốc Uyên'],
    [5, '09:00', 'Trần Thu Bình', 'miss'], [5, '09:30', 'Hoàng Khải An'], [5, '15:00', 'Phan Gia Chi'],
  ].map(([day, t, name, flag], i) => {
    const c = CUS.find((x) => x.name === name);
    return { i, day, t, c, flag, amt: flag ? 0 : c.cs };
  });
  // The rest of the month, one appointment a row: week (1 = 16–21/11, 2 = 23–28/11, 3 = 30/11), day (0 = T2),
  // RM, stage (index in ST3), case size. Each has a customer of its own, so the month is this week plus
  // these, with no customer counted twice; the forecast of a team, an RM or a day is a sum of rows.
  const FAM = ['Trịnh', 'Đặng', 'Lâm', 'Mai', 'Tô', 'Châu', 'Quách', 'Tạ', 'Kiều', 'La'];
  const MID = ['Văn', 'Thị', 'Minh', 'Ngọc', 'Quốc', 'Thanh', 'Hữu', 'Bảo'];
  const GIV = ['Khang', 'Nhi', 'Phát', 'Yến', 'Trí', 'Diệp', 'Lộc', 'My', 'Tín', 'Oanh', 'Khoa', 'Vân', 'Đạt', 'Thư', 'Long', 'Trang', 'Kiên', 'Hạnh', 'Nhân', 'Quyên'];
  const LATER = [
    [3, 0, 0, 0, 60], [1, 4, 0, 0, 40], [1, 0, 0, 0, 30], [2, 2, 0, 0, 30],
    [1, 2, 1, 1, 30], [2, 4, 1, 1, 30], [1, 1, 1, 1, 20], [2, 0, 1, 1, 20], [1, 3, 1, 2, 10], [1, 5, 1, 2, 10], [2, 1, 1, 2, 10], [2, 3, 1, 2, 20], [2, 5, 1, 2, 10],
    [3, 0, 3, 0, 40], [1, 4, 3, 0, 30], [1, 0, 3, 0, 20], [2, 0, 3, 0, 20], [1, 2, 3, 1, 20], [1, 1, 3, 0, 10],
    [1, 3, 4, 1, 10], [1, 5, 4, 2, 10], [2, 1, 4, 2, 10], [2, 2, 4, 1, 20], [2, 3, 4, 2, 10], [2, 4, 4, 1, 20], [2, 5, 4, 2, 10],
    [3, 0, 6, 0, 20], [1, 2, 6, 0, 20], [2, 4, 6, 1, 20], [1, 0, 6, 1, 10], [1, 1, 6, 1, 10], [1, 3, 6, 1, 10],
    [1, 4, 7, 1, 10], [2, 0, 7, 1, 10], [2, 1, 7, 2, 10], [2, 2, 7, 2, 10], [2, 3, 7, 2, 10], [2, 5, 7, 2, 10],
  ].map(([w, day, rm, s, amt], i) => {
    const date = `${[16, 23, 30][w - 1] + day}/11`, t = ['09:00', '10:30', '14:00', '15:30'][i % 4];
    const c = { i: CUS.length, name: `${FAM[i % 10]} ${MID[(i * 3) % 8]} ${GIV[i % 20]}`, st: ST3[s], rm, last: ['04/11', '29/10', '06/11', '22/10'][i % 4], next: `${DAYS[day][0]} ${date} · ${t}`, cs: amt, pol: 0, cad: ['.m..m.m.', '..m.m...', 'm..m..m.', '....m.m.'][i % 4], code: 'KH-' + (2100 + i * 13) };
    CUS.push(c);
    return { w, day, t, c, amt, date };
  });
  const laterOf = (pred) => ST3.map((s) => sum(LATER.filter((a) => a.c.st === s && pred(a.c)), (a) => a.amt));
  // Forecast of an RM for the month: never a stored number, always this week plus the later weeks
  RMS.forEach((r) => Object.defineProperty(r, 'fm', { get: () => sum(fwOf((c) => c.rm === r.i)) + sum(laterOf((c) => c.rm === r.i)) }));
  // Team identity (Owner 10/11): a colour and an icon, picked when the team is made
  const TEAM_COLORS = [['accent', 'Champagne'], ['info', 'Xanh dương'], ['n2', 'Tím'], ['submitted', 'Xanh ngọc'], ['ok', 'Xanh lá'], ['warn', 'Cam']];
  const TEAM_ICONS = ['star', 'sunrise', 'sun', 'mountain', 'leaf', 'flame', 'shield', 'anchor'];
  [['accent', 'star', 1100], ['warn', 'sunrise', 950], [null, null, 950]].forEach(([color, icon, target], t) => Object.assign(TEAMS[t], { color, icon, target }));
  // no colour or icon chosen: the default look (text colour, the plain team icon)
  const look = (color, icon) => [color ? `var(--${color})` : 'var(--text-2)', icon || 'team'];
  const teamMark = (t, cls = '') => { const [c, i] = look(TEAMS[t].color, TEAMS[t].icon); return `<span class="tmark ${cls}" style="--c: ${c}">${ic(i)}</span>`; };
  const CUR = [0, 150, 290, 470, 640, 830, 960, 960, 1180, 1380]; // cumulative sales, 01/11 … 10/11
  const GHOST = [[1, 90], [2, 230], [3, 300], [4, 300], [5, 480], [6, 640], [7, 800], [8, 960], [9, 1100], [10, 1228], [14, 1600], [17, 1980], [21, 2350], [24, 2640], [28, 2960], [31, 3180]];

  const state = { view: 'overview', scope: 'all', fc: 'week', rp: 'brief', lg: 'result', cust: 7, rm: 0, set: 'data', open: {}, cancel: {}, undo: null, period: 'm11', pkind: null, back: 'customers', ai: { provider: 'opencode', model: 'DeepSeek V4.1 Flash', effort: 'Cao' } };
  const scopeTeams = () => (state.scope === 'all' ? [0, 1, 2] : [state.scope]);
  const scopeName = () => (state.scope === 'all' ? 'Toàn bộ' : 'Team ' + TEAMS[state.scope].name);
  const teamRms = (t) => RMS.filter((r) => r.team === t);
  const fwOf = (pred) => ST3.map((s) => sum(APPTS.filter((a) => !a.flag && a.c.st === s && pred(a.c)), (a) => a.amt));
  function agg(rms) {
    return {
      issued: sum(rms, (r) => r.issued), cancelled: sum(rms, (r) => r.cancelled), fi: sum(rms, (r) => r.fi), fc: sum(rms, (r) => r.fc),
      rf: sum(rms, (r) => r.rf), fm: sum(rms, (r) => r.fm),
      appt: rms.reduce((a, r) => addV(a, r.appt), [0, 0, 0, 0]), kh: rms.reduce((a, r) => addV(a, r.kh), [0, 0, 0, 0]),
    };
  }
  function scopeData(sc) {
    const teams = sc === 'all' ? [0, 1, 2] : [sc];
    const d = agg(RMS.filter((r) => teams.includes(r.team)));
    d.sub = sum(teams, (t) => TEAMS[t].sub);
    d.cs = sum(teams, (t) => TEAMS[t].cs);
    d.p = {};
    for (const k of ['issued', 'cancelled', 'sales', 'rf', 'sub', 'cs']) d.p[k] = sum(teams, (t) => TEAMS[t].p[k]);
    d.fw = fwOf((c) => teams.includes(RMS[c.rm].team));
    d.sales = d.fi - d.fc;
    d.total = d.issued - d.cancelled;
    return d;
  }

  /* ---------- Format ---------- */
  const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]);
  const nf = (v, d = 0) => v.toLocaleString('vi-VN', { minimumFractionDigits: d, maximumFractionDigits: d }).replace('-', '−');
  const money = (tr) => (Math.abs(tr) >= 1000 ? { v: tr / 1000, d: 2, u: 'tỷ' } : { v: tr, d: 0, u: 'tr' });
  const moneyS = (tr) => { const m = money(tr); return nf(m.v, m.d) + ' ' + m.u; };
  const rate = (a, b) => (b ? (a / b) * 100 : null);
  const pctS = (v) => (v == null ? '—' : nf(v, 1) + '%');
  const arrow = (v) => (v > 0 ? '▲' : v < 0 ? '▼' : '=');
  const initials = (name) => { const w = name.split(' '); return w[0][0] + w[w.length - 1][0]; };
  // Search without diacritics: one folded character per character, so match positions carry back to the text
  const foldCh = (ch) => (ch === 'đ' || ch === 'Đ' ? 'd' : ch.normalize('NFD')[0].toLowerCase());
  const fold = (s) => [...s.normalize('NFC')].map(foldCh).join('').trim();
  function hit(text, q) {
    const f = [...text.normalize('NFC')].map(foldCh).join('');
    const at = q ? f.indexOf(q) : -1;
    if (at < 0) return null;
    const ch = [...text.normalize('NFC')];
    const part = (a, b) => esc(ch.slice(a, b).join(''));
    return { score: at === 0 ? 3 : f[at - 1] === ' ' ? 2 : 1, html: part(0, at) + '<mark>' + part(at, at + q.length) + '</mark>' + part(at + q.length) };
  }
  // "Đếm": the old digits leave and the new ones arrive (transform + opacity), instead of a number
  // flickering through values. They come from below when the value grew, from above when it fell.
  function roll(el, text, value = 0) {
    if (el.dataset.t === text) return;
    const dir = value >= parseFloat(el.dataset.n || '0') ? 1 : -1;
    const old = el.dataset.t === undefined || reduce ? '' : `<span class="old" style="--dir: ${dir}" aria-hidden="true">${$('.new', el).innerHTML}</span>`;
    el.dataset.t = text;
    el.dataset.n = value;
    el.setAttribute('aria-label', text);
    el.innerHTML = old + `<span class="new" style="--dir: ${dir}" aria-hidden="true">${[...text].map((ch, k) => `<span class="ch" style="--k: ${k}">${ch}</span>`).join('')}</span>`;
  }
  // The thumb of a segmented control slides to the chosen segment. FLIP: its box jumps to the new
  // place, then a transform plays it there from where it was, so nothing but a transform animates.
  const SPRING = getComputedStyle(root).getPropertyValue('--spring-snappy').trim();
  function thumb(seg, animate = true) {
    const on = $('button.on', seg);
    if (!on || !on.offsetWidth) return;
    let t = $('.thumb', seg);
    if (!t) {
      t = document.createElement('i');
      t.className = 'thumb';
      seg.prepend(t);
      animate = false;
    }
    const from = t.getBoundingClientRect();
    t.style.left = on.offsetLeft + 'px';
    t.style.width = on.offsetWidth + 'px';
    if (!animate || reduce || !from.width) return;
    const to = t.getBoundingClientRect(), s = to.width / t.offsetWidth || 1;
    const frames = [{ transform: `translateX(${(from.left - to.left) / s}px) scaleX(${from.width / to.width})` }, { transform: 'none' }];
    try { t.animate(frames, { duration: 400, easing: SPRING }); } catch { t.animate(frames, { duration: 300, easing: 'ease-out' }); }
  }
  const thumbs = (animate) => $$('.seg').forEach((s) => thumb(s, animate));
  // One pill glides between the items of the sidebar
  function navPill() {
    const on = $('#nav .nav-i.on'), pill = $('#nav-pill');
    if (!on || !pill) return;
    pill.style.height = on.offsetHeight + 'px';
    pill.style.transform = `translateY(${on.offsetTop}px)`;
  }
  // A soft light follows the pointer across the card under it
  document.addEventListener('pointermove', (e) => {
    const c = e.target.closest ? e.target.closest('.card') : null;
    if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (((e.clientX - r.left) / r.width) * 100).toFixed(1) + '%');
    c.style.setProperty('--my', (((e.clientY - r.top) / r.height) * 100).toFixed(1) + '%');
  }, { passive: true });
  // Monotone cubic through points sorted by x: a curve that never overshoots a cumulative series
  function smooth(p) {
    const n = p.length, d = [], m = [];
    for (let i = 0; i < n - 1; i++) d[i] = (p[i + 1][1] - p[i][1]) / (p[i + 1][0] - p[i][0]);
    m[0] = d[0];
    m[n - 1] = d[n - 2];
    for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
    for (let i = 0; i < n - 1; i++) {
      if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
      const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
      if (s > 9) { const t = 3 / Math.sqrt(s); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
    }
    let s = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
    for (let i = 0; i < n - 1; i++) {
      const h = (p[i + 1][0] - p[i][0]) / 3;
      s += ` C${(p[i][0] + h).toFixed(1)} ${(p[i][1] + m[i] * h).toFixed(1)} ${(p[i + 1][0] - h).toFixed(1)} ${(p[i + 1][1] - m[i + 1] * h).toFixed(1)} ${p[i + 1][0].toFixed(1)} ${p[i + 1][1].toFixed(1)}`;
    }
    return s;
  }

  /* ---------- Chrome + navigation ---------- */
  const VIEWS = {
    overview: { nav: 'overview', title: 'Tổng quan', sub: () => `Tháng 11/2026 · 01/11 – 10/11 (MTD) · ${scopeName()}`, act: ['plus', 'Lịch hẹn'], scope: 1, period: 1, ideas: ['01', '02', '05', '09', '11', '12', '14', '15', '16'] },
    forecast: { nav: 'forecast', title: 'Forecast', sub: () => `Hôm nay thứ Ba 10/11/2026 · ${scopeName()}`, act: ['export', 'Xuất Excel'], scope: 1, ideas: ['17', '32', '18', '19', '20', '29'] },
    reports: { nav: 'reports', title: 'Báo cáo', sub: () => { const p = periodOf(); return `${p.name} · ${p.range}${p.note ? ' (' + p.note + ')' : ''} · Toàn bộ`; }, act: ['export', 'Xuất Excel'], period: 1, ideas: ['21', '22', '23', '24', '11'] },
    customers: { nav: 'customers', title: 'Khách hàng', sub: () => 'Kanban theo nhóm · Toàn bộ', act: ['plus', 'Khách hàng'], ideas: ['25', '26', '07'] },
    profile: { nav: 'customers', title: 'Hồ sơ khách hàng', sub: () => CUS[state.cust].code, act: ['plus', 'Lịch hẹn'], ideas: ['07', '28'] },
    team: { nav: 'team', title: 'Team & nhân sự', sub: () => '3 team · 9 RM', act: ['plus', 'Team'], ideas: ['33', '27', '07'] },
    rm: { nav: 'team', title: 'Trang RM', sub: () => 'Team ' + TEAMS[RMS[state.rm].team].name, ideas: ['27'] },
    appointments: { nav: 'appointments', title: 'Lịch hẹn', sub: () => 'Hôm nay · Toàn bộ', act: ['plus', 'Lịch hẹn'], ideas: ['11'] },
    settings: { nav: 'settings', title: 'Cài đặt', sub: () => 'Dữ liệu · AI · Thùng rác', ideas: ['29', '34'] },
  };
  const NAV = [['overview', 'Tổng quan', 'overview', '1'], ['appointments', 'Lịch hẹn', 'cal', '2'], ['customers', 'Khách hàng', 'people', '3'], ['forecast', 'Forecast', 'forecast', '4'], ['reports', 'Báo cáo', 'report', '5'], ['team', 'Team & nhân sự', 'team', '6'], ['settings', 'Cài đặt', 'gear', ',']];
  const RENDER = {};

  function chrome() {
    const v = VIEWS[state.view], title = $('#v-title');
    if (title.textContent !== v.title) {
      const box = title.parentElement;
      box.classList.remove('swap');
      void box.offsetWidth; // restart the little rise of the title
      box.classList.add('swap');
    }
    title.textContent = v.title;
    $('#v-sub').textContent = v.sub();
    $('#scope').hidden = !v.scope;
    $('#period').hidden = !v.period;
    $('#period-l').textContent = state.view === 'reports' ? periodOf().name : 'Tháng 11/2026';
    $('#scope-l').textContent = state.scope === 'all' ? 'Toàn bộ' : TEAMS[state.scope].name;
    const act = $('#act');
    act.hidden = !v.act;
    if (v.act) act.innerHTML = ic(v.act[0]) + v.act[1];
  }
  // Screens change at once ("Nhanh": no snapshot, no wait); the parts of the new screen rise in.
  // Only "Mở" runs a view transition: opt.from grows into opt.to, and shrinks back on the way out.
  function go(name, opt = {}) {
    if (!VIEWS[name]) return;
    closeFloats();
    const swap = () => {
      state.view = name;
      $$('.view').forEach((v) => v.classList.toggle('on', v.dataset.view === name));
      $$('#nav .nav-i').forEach((b) => b.classList.toggle('on', b.dataset.go === VIEWS[name].nav));
      navPill();
      chrome();
      if (RENDER[name]) RENDER[name]();
      onscreen();
      $(`.view[data-view="${name}"]`).scrollTop = 0;
    };
    const from = opt.from;
    if (!from || reduce || !document.startViewTransition) return swap();
    let to = null;
    from.style.viewTransitionName = 'morph';
    const vt = document.startViewTransition(() => {
      from.style.viewTransitionName = '';
      swap();
      to = typeof opt.to === 'string' ? $(opt.to) : opt.to;
      if (to) to.style.viewTransitionName = 'morph';
    });
    vt.finished.catch(() => {}).finally(() => { if (to) to.style.viewTransitionName = ''; });
  }
  function goBack(name) {
    if (name === 'customers') return go('customers', { from: $('#pf-head'), to: `.kcard[data-c="${state.cust}"]` });
    if (name === 'team') return go('team', { from: $('#rm-head'), to: `.rmrow[data-rm="${state.rm}"]` });
    go(name);
  }
  function setScope(sc) {
    state.scope = sc;
    if (sc !== 'all') { state.open['fc' + sc] = true; state.open['lg' + sc] = true; }
    chrome();
    if (RENDER[state.view]) RENDER[state.view]();
  }
  const WALLS = ['Hoàng hôn', 'Studio', 'Champagne', 'Lưới', 'Heritas'];
  function setSwitch(key, val) {
    root.dataset[key] = val;
    $$(`.seg[data-set="${key}"]`).forEach((seg) => {
      $$('button', seg).forEach((b) => b.classList.toggle('on', b.dataset.v === val));
      thumb(seg);
    });
    if (key === 'wall') { // the name next to the swatches and the gallery card follow the choice
      $('#wall-name').textContent = WALLS[val - 1];
      $$('.wcard').forEach((c) => {
        c.classList.toggle('on', c.dataset.w === String(val));
        const tag = $('small', c);
        if (tag) tag.remove();
        if (c.dataset.w === String(val)) $('b', c).insertAdjacentHTML('beforeend', '<small>đang dùng</small>');
      });
    }
    if (key === 'theme' || key === 'wall') return;
    // another platform or typeface changes every measure: the window, the thumbs, the pill
    fit();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { thumbs(false); navPill(); });
  }
  let toastT;
  function toast(msg, undo) {
    const t = $('#toast');
    t.innerHTML = `<span>${msg}</span>` + (undo ? '<button id="toast-undo">Hoàn tác <kbd class="k-mac">⌘Z</kbd><kbd class="k-win">Ctrl Z</kbd></button>' : '');
    t.classList.add('on');
    state.undo = undo || null;
    clearTimeout(toastT);
    toastT = setTimeout(() => { t.classList.remove('on'); state.undo = null; }, undo ? 7000 : 2800);
  }
  function undo() {
    if (!state.undo) return;
    const f = state.undo;
    state.undo = null;
    $('#toast').classList.remove('on');
    f();
  }

  /* ---------- "Lúc này" ---------- */
  const NOW_IDLE = '<span class="now-face"><span class="live"></span><b class="num">14:00</b><span class="who">Trần Minh Huệ</span><span class="muted">· còn 25 phút</span></span>';
  let nowT;
  function nowJob(label, done) {
    const el = $('#now');
    el.innerHTML = `<span class="now-face">${ic('export')}${label}<span class="bar"><i></i></span></span>`;
    requestAnimationFrame(() => requestAnimationFrame(() => { const b = $('.bar i', el); if (b) b.style.transform = 'scaleX(1)'; }));
    clearTimeout(nowT);
    nowT = setTimeout(() => {
      el.innerHTML = `<span class="now-face">${ic('check', 'done')}<b>${done}</b></span>`;
      nowT = setTimeout(() => { el.innerHTML = NOW_IDLE; }, 3000);
    }, 1700);
  }
  const exportDemo = () => nowJob('Đang xuất Excel', 'Đã xuất Bao-cao_2026-11.xlsx');
  const AGENDA = [
    { t: '10:00', n: 'Đinh Bảo Ngọc', st: 'n4', s: 'Gặp lần đầu · RM Bùi Ngọc Trâm', cls: 'done', r: '<span class="chip warn">Ghi kết quả</span>' },
    { t: '14:00', n: 'Trần Minh Huệ', st: 'n1', s: 'Case size dự kiến 60 tr · RM Phạm Thu Hà', cls: 'next', r: '<span class="chip">còn 25 phút</span>' },
    { t: '16:30', n: 'Lê Quốc Hùng', st: 'n3', s: 'Case size dự kiến 40 tr · RM Lê Hoài Nam', cls: '', r: '' },
  ];
  const agendaHtml = () => AGENDA.map((a) => `<div class="ag ${a.cls}"><span class="tm num">${a.t}</span><span><b>${a.n}</b> <span class="st ${a.st}">${STAGE[a.st]}</span><small>${a.s}</small></span>${a.r}</div>`).join('');

  /* ---------- Tổng quan ---------- */
  let chart = null; // scales and series of the last draw, for the scrubber
  function drawChart(d, animate = true) {
    const box = $('#ov-chart'), W = box.clientWidth, H = box.clientHeight;
    if (!W) return;
    const k = d.sales / 1380, kp = d.p.sales / 1228, fw = sum(d.fw), pad = 22;
    const top = Math.max(3180 * kp, d.sales + d.fm) * 1.14, base = H - 24;
    const x = (day) => pad + ((day - 1) / 30) * (W - pad * 2), y = (v) => base - (v / top) * (base - 10);
    const cur = CUR.map((v, i) => [i + 1, v * k]);
    const proj = [[10, d.sales], [14, d.sales + fw], [30, d.sales + d.fm]];
    const ghost = GHOST.map(([day, v]) => [day, v * kp]);
    const px = (s) => s.map(([day, v]) => [x(day), y(v)]);
    const cp = px(cur), pp = px(proj), last = cp[cp.length - 1], end = pp[2];
    const f1 = (v) => v.toFixed(1);
    box.classList.toggle('still', !animate);
    box.innerHTML = `<div class="wipe"><svg viewBox="0 0 ${W} ${H}" aria-hidden="true">
      <defs>
        <linearGradient id="ov-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color: var(--accent); stop-opacity: 0.3" /><stop offset="1" style="stop-color: var(--accent); stop-opacity: 0" /></linearGradient>
        <linearGradient id="ov-line" gradientUnits="userSpaceOnUse" x1="${f1(cp[0][0])}" y1="0" x2="${f1(last[0])}" y2="0"><stop offset="0" style="stop-color: var(--accent); stop-opacity: 0.55" /><stop offset="1" style="stop-color: var(--brand-slogan)" /></linearGradient>
      </defs>
      <path class="grid" d="M${pad} ${f1(y(top / 1.14))} H${W - pad} M${pad} ${f1(y(top / 2.28))} H${W - pad} M${pad} ${base} H${W - pad}" />
      <path class="ghost" d="${smooth(px(ghost))}" />
      <path class="area" d="${smooth(cp)} L${f1(last[0])} ${base} L${f1(cp[0][0])} ${base} Z" />
      <path class="line" d="${smooth(cp)}" />
      <path class="proj" d="M${pp.map((p) => f1(p[0]) + ' ' + f1(p[1])).join(' L')}" />
      <circle class="end" cx="${f1(end[0])}" cy="${f1(end[1])}" r="4" />
      <circle class="dot" cx="${f1(last[0])}" cy="${f1(last[1])}" r="5" />
      ${[1, 5, 10, 15, 20, 25, 30].map((t) => `<text x="${f1(x(t))}" y="${H - 7}" text-anchor="middle">${String(t).padStart(2, '0')}</text>`).join('')}
    </svg></div>
    <span class="today" style="left: ${f1(last[0])}px; top: ${f1(last[1])}px"></span>
    <span class="pin" style="left: ${f1(end[0])}px; top: ${f1(end[1])}px">Dự kiến cuối tháng <b class="num">${moneyS(d.sales + d.fm)}</b></span>
    <i class="scrub"></i><div class="scrub-tip"></div>`;
    chart = { x, W, pad, cur, proj, ghost };
  }
  // The value of a series on a day, straight between its points
  const valueAt = (series, day) => {
    for (let i = 1; i < series.length; i++) {
      if (day <= series[i][0]) {
        const [d0, v0] = series[i - 1], [d1, v1] = series[i];
        return v0 + ((v1 - v0) * (day - d0)) / (d1 - d0 || 1);
      }
    }
    return series[series.length - 1][1];
  };
  // Move over the chart: the day under the pointer, this month (or its forecast) against last month
  document.addEventListener('pointermove', (e) => {
    const box = $('#ov-chart');
    if (!chart || !box.contains(e.target)) return box.classList.remove('scrubbing');
    const r = box.getBoundingClientRect(), s = r.width / box.offsetWidth || 1;
    const day = Math.max(1, Math.min(30, Math.round(1 + (((e.clientX - r.left) / s - chart.pad) / (chart.W - chart.pad * 2)) * 30)));
    const X = chart.x(day), tip = $('.scrub-tip', box);
    tip.innerHTML = `<span class="muted num">${String(day).padStart(2, '0')}/11${day > 10 ? ' · dự kiến' : ''}</span><b class="num">${moneyS(Math.round(valueAt(day <= 10 ? chart.cur : chart.proj, day)))}</b><span class="muted num">tháng 10: ${moneyS(Math.round(valueAt(chart.ghost, day)))}</span>`;
    $('.scrub', box).style.transform = `translateX(${X}px)`;
    tip.style.transform = `translateX(${Math.max(8, Math.min(X + 12, chart.W - tip.offsetWidth - 8))}px)`;
    box.classList.add('scrubbing');
  }, { passive: true });

  const spark = (vals) => {
    const mx = Math.max(...vals), mn = Math.min(...vals);
    const pts = vals.map((v, i) => [3 + (i * 52) / (vals.length - 1), 31 - ((v - mn) / (mx - mn || 1)) * 25]);
    const e = pts[pts.length - 1];
    return `<svg viewBox="0 0 58 36" aria-hidden="true"><path class="sp" d="${smooth(pts)}" /><circle class="sp-d" cx="${e[0]}" cy="${e[1].toFixed(1)}" r="2.8" /></svg>`;
  };
  const ringViz = (p) => `<svg viewBox="0 0 36 36" aria-hidden="true"><circle class="ring-t" cx="18" cy="18" r="15" /><circle class="ring" cx="18" cy="18" r="15" stroke-dasharray="${((Math.min(p, 100) / 100) * 94.25).toFixed(1)} 94.25" /></svg>`;
  const TREND = { rf: [0.78, 0.86, 0.8, 0.93, 0.9, 1], sub: [0.7, 0.83, 0.91, 0.86, 0.94, 1], cs: [1.1, 1.01, 1.07, 0.96, 1.04, 1] };
  RENDER.overview = () => {
    const d = scopeData(state.scope), all = state.scope === 'all';
    const m = money(d.sales);
    $('#ov-lbl').textContent = `Doanh số · ${all ? 'toàn bộ' : 'team ' + TEAMS[state.scope].name} · tháng 11`;
    $('#ov-unit').textContent = m.u;
    roll($('#ov-sales'), nf(m.v, m.d), d.sales);
    const g = ((d.sales - d.p.sales) / d.p.sales) * 100;
    const dl = $('#ov-delta');
    dl.className = 'delta ' + (g >= 0 ? 'up' : 'bad');
    dl.textContent = `${arrow(g)} ${nf(Math.abs(g), 1)}% so với 01/10 – 10/10`;
    $('#ov-eq').innerHTML = `FYP phát hành <b class="num">${moneyS(d.fi)}</b> − FYP hủy <b class="num">${moneyS(d.fc)}</b>`;
    drawChart(d);

    const cr = rate(d.cancelled, d.issued), crWas = rate(d.p.cancelled, d.p.issued), dcr = cr - crWas;
    const close = rate(d.issued, d.rf), fw = sum(d.fw);
    const byTeam = [0, 1, 2].map((t) => ({ t, d: scopeData(t) })).sort((a, b) => b.d.sales - a.d.sales);
    const hl = [
      dcr > 0
        ? { c: 'danger', i: 'alert', b: `Tỷ lệ hủy ${pctS(cr)}, tăng ${nf(dcr, 1)} điểm`, s: `${d.cancelled} HĐ hủy trong kỳ, ${d.cancelled > 1 ? 'đều ' : ''}ở tuần 02 – 08/11`, go: 'reports' }
        : { c: 'ok', i: 'check', b: `Tỷ lệ hủy ${pctS(cr)}, giảm ${nf(-dcr, 1)} điểm`, s: 'Không có HĐ hủy trong kỳ', go: 'reports' },
      all
        ? { c: 'accent', i: 'star', b: `${TEAMS[byTeam[0].t].name} dẫn đầu: ${moneyS(byTeam[0].d.sales)}`, s: `${nf((byTeam[0].d.sales / d.sales) * 100)}% doanh số · tỉ lệ chốt ${pctS(rate(byTeam[0].d.issued, byTeam[0].d.rf))}`, go: 'reports' }
        : { c: 'accent', i: 'star', b: `Đứng thứ ${byTeam.findIndex((x) => x.t === state.scope) + 1} / 3 về doanh số`, s: `${nf((d.sales / 1380) * 100)}% doanh số toàn bộ · tỉ lệ chốt ${pctS(close)}`, go: 'reports' },
      { c: 'warn', i: 'clock', b: `${d.appt[2]} buổi chưa ghi kết quả`, s: all ? 'Sao Mai 5 · Hừng Đông 4 · Bình Minh 3' : 'Ghi kết quả để chỉ số của kỳ đủ', go: 'appointments' },
      { c: 'info', i: 'forecast', b: `Tuần này dự kiến ${moneyS(fw)}`, s: `N1 chiếm ${nf((d.fw[0] / fw) * 100)}% · từ nay tới cuối tháng ${moneyS(d.fm)}`, go: 'forecast' },
    ];
    $('#ov-hl').innerHTML = hl.map((h) => `<button class="hl-i" data-go="${h.go}" style="--c: var(--${h.c})"><span class="gl">${ic(h.i)}</span><span><b>${h.b}</b><span>${h.s}</span></span>${ic('chev', 'go')}</button>`).join('');

    const diff = (now, was) => { const v = now - was; return { f: `${arrow(v)} ${nf(Math.abs(v))} so với kỳ trước`, c: v > 0 ? 'up' : v < 0 ? 'bad' : '' }; };
    const cs = money(d.cs), csG = ((d.cs - d.p.cs) / d.p.cs) * 100, cap = (v) => Math.min(100, v).toFixed(1);
    const tiles = [
      { l: 'Tổng số HĐ', n: d.total, t: nf(d.total), f: `${d.issued} phát hành − ${d.cancelled} hủy`, z: `<div class="meter"><b style="--w: ${cap((d.total / d.issued) * 100)}%"></b><b style="--w: ${cap((d.cancelled / d.issued) * 100)}%; --c: var(--danger)"></b></div>` },
      { l: 'Tỷ lệ hủy', n: cr, t: nf(cr, 1), u: '%', f: `${arrow(dcr)} ${nf(Math.abs(dcr), 1)} điểm · ${d.cancelled} ÷ ${d.issued}`, c: dcr > 0 ? 'bad' : dcr < 0 ? 'up' : '', z: `<div class="meter" style="--c: var(--danger)" title="Vạch là kỳ trước"><b style="--w: ${cap((cr / 15) * 100)}%"></b><u style="--at: ${cap((crWas / 15) * 100)}%"></u></div>` },
      { l: 'Tỉ lệ chốt', n: close, t: nf(close, 1), u: '%', f: `${d.issued} HĐ ÷ ${d.rf} RF`, z: ringViz(close) },
      { l: 'Chuyển RF', n: d.rf, t: nf(d.rf), ...diff(d.rf, d.p.rf), z: spark(TREND.rf) },
      { l: 'HĐ nộp', n: d.sub, t: nf(d.sub), ...diff(d.sub, d.p.sub), z: spark(TREND.sub) },
      { l: 'Case size', n: d.cs, t: nf(cs.v, cs.d), u: cs.u, f: `${arrow(csG)} ${nf(Math.abs(csG), 1)}% so với kỳ trước`, c: csG > 0 ? 'up' : 'bad', z: spark(TREND.cs) },
    ];
    const box = $('#ov-tiles');
    if (!box.children.length) box.innerHTML = tiles.map(() => '<button class="card tile rise" data-go="reports" style="--i: 2"><span class="lbl"></span><span class="v"><span class="n roll"></span><small></small></span><span class="viz"></span><span class="f"></span></button>').join('');
    tiles.forEach((t, i) => {
      const el = box.children[i];
      $('.lbl', el).textContent = t.l;
      $('small', el).textContent = t.u || '';
      roll($('.n', el), t.t, t.n);
      $('.viz', el).innerHTML = t.z;
      const f = $('.f', el);
      f.textContent = t.f;
      f.className = 'f ' + (t.c || '');
    });

    const [met, missed, unrec, exp] = d.appt, apptAll = sum(d.appt), C = 2 * Math.PI * 40;
    const seg = [['Đã gặp', met, 'ok'], ['Dời · hủy · không đến', missed, 'text-3'], ['Chưa ghi kết quả', unrec, 'warn'], ['Dự kiến', exp, 'info']];
    let off = 0;
    $('#ov-appt-sub').textContent = `${nf(apptAll)} lịch`;
    $('#ov-appt').innerHTML = '<svg viewBox="0 0 104 104" aria-hidden="true">' + seg.map(([, v, c]) => {
      const len = (v / apptAll) * C, arc = `<circle cx="52" cy="52" r="40" style="stroke: var(--${c})" stroke-dasharray="${Math.max(len - 2.5, 0.1).toFixed(1)} ${C.toFixed(1)}" stroke-dashoffset="${(-off).toFixed(1)}" />`;
      off += len;
      return arc;
    }).join('') + `</svg><span class="c"><b class="num">${nf(met)}</b>đã gặp</span>`;
    $('#ov-appt-keys').innerHTML = seg.map(([l, v, c]) => `<span><i style="--c: var(--${c})"></i>${l}<b class="num">${nf(v)}</b></span>`).join('');
    const kh = ['n4', 'n3', 'n2', 'n1'].map((s, i) => [s, d.kh[i]]);
    const khMax = Math.max(...kh.map((x) => x[1]));
    $('#ov-pipe-sub').textContent = `${nf(sum(d.kh))} KH đang mở`;
    $('#ov-pipe').innerHTML = kh.map(([s, v], i) => `<span class="st ${s}">${STAGE[s]}</span><span class="hbar ${s}" style="--i: ${i}"><i style="--w: ${(v / khMax).toFixed(3)}"></i></span><span class="v num">${nf(v)}</span>`).join('');
    $('#ov-race').innerHTML = byTeam.map(({ t, d: x }, i) => `<button class="race" data-team="${t}" aria-pressed="${state.scope === t}">${teamMark(t)}<b>${TEAMS[t].name}</b><span class="hbar" style="--i: ${i}"><i style="--w: ${(x.sales / byTeam[0].d.sales).toFixed(3)}"></i></span><span class="v num">${moneyS(x.sales)}</span><span class="sub">${x.total} HĐ · hủy ${pctS(rate(x.cancelled, x.issued))} · chốt ${pctS(rate(x.issued, x.rf))}</span></button>`).join('');
  };

  /* ---------- Forecast ---------- */
  const WEEKS = [['10 – 14/11', 9], ['16 – 21/11', 16], ['23 – 28/11', 23], ['30/11', 30]]; // label, date of its Monday
  function fcData() {
    const teams = scopeTeams(), mine = (a) => teams.includes(RMS[a.c.rm].team);
    const ap = APPTS.filter(mine), later = LATER.filter(mine), counted = ap.filter((a) => !a.flag);
    const fw = ST3.map((s) => sum(counted.filter((a) => a.c.st === s), (a) => a.amt));
    const ms = ST3.map((s, i) => fw[i] + sum(later.filter((a) => a.c.st === s), (a) => a.amt));
    const sales = sum(RMS.filter((r) => teams.includes(r.team)), (r) => r.fi - r.fc);
    return { teams, ap, later, counted, fw, week: sum(fw), ms, month: sum(ms), sales, miss: ap.filter((a) => a.flag === 'miss') };
  }
  // The appointments of one day of the grid: week 0 is this week (APPTS), 1–3 the later weeks (LATER)
  const dayList = (f, w, day) => (w === 0 ? f.ap.filter((a) => a.day === day) : f.later.filter((a) => a.w === w && a.day === day));
  const dayAmt = (list) => sum(list.filter((a) => !a.flag), (a) => a.amt);
  const zero = '<td class="zero">—</td>';
  const cell = (v) => (v ? `<td>${moneyS(v)}</td>` : zero);
  function renderFcTable(f) {
    const rowsOf = (t) => {
      const rms = teamRms(t).map((r) => {
        const mine = f.ap.filter((a) => a.c.rm === r.i);
        return { r, fw: ST3.map((s) => sum(mine.filter((a) => !a.flag && a.c.st === s), (a) => a.amt)), n: mine.length, miss: mine.filter((a) => a.flag === 'miss').length };
      });
      return { t, rms, fw: rms.reduce((a, x) => addV(a, x.fw), [0, 0, 0]), n: sum(rms, (x) => x.n), miss: sum(rms, (x) => x.miss), fm: sum(rms, (x) => x.r.fm) };
    };
    const teams = f.teams.map(rowsOf);
    const max = Math.max(...teams.map((x) => sum(x.fw)), 1);
    const line = (cls, attr, name, x, fm) => `<tr class="${cls}" ${attr}><td>${name}</td>${sum(x.fw) ? `<td class="bar" style="--w: ${(sum(x.fw) / max).toFixed(3)}"><span>${moneyS(sum(x.fw))}</span></td>` : zero}${x.fw.map(cell).join('')}${cell(fm)}<td>${x.n || '—'}</td><td>${x.miss ? `<span class="chip warn">${x.miss} thiếu case size</span>` : ''}</td></tr>`;
    let h = '<thead><tr><th>Team / RM</th><th>Tuần này</th><th>N1</th><th>N2</th><th>N3</th><th>Tháng 11</th><th>Lịch tuần</th><th></th></tr></thead><tbody>';
    for (const x of teams) {
      const open = !!state.open['fc' + x.t];
      h += line('team' + (open ? ' open' : ''), `data-tw="fc${x.t}"`, `<span class="tw">${ic('chev')}</span>${teamMark(x.t)} ${TEAMS[x.t].name}`, x, x.fm);
      if (open) h += x.rms.map((y) => line('rm link', `data-rm="${y.r.i}"`, 'RM ' + y.r.name, y, y.r.fm)).join('');
    }
    if (teams.length > 1) h += line('total', '', 'Tổng', { fw: f.fw, n: f.ap.length, miss: 0 }, f.month);
    $('#fc-tbl').innerHTML = h + '</tbody>';
  }
  RENDER.forecast = () => {
    const f = fcData(), wk = state.fc === 'week';
    $$('#fc-seg button').forEach((b) => b.classList.toggle('on', b.dataset.fc === state.fc));
    thumb($('#fc-seg'));
    const m = money(wk ? f.week : f.month), split = wk ? f.fw : f.ms;
    $('#fc-lbl').textContent = wk ? 'Dự kiến tuần này' : 'Dự kiến tháng 11, từ hôm nay';
    $('#fc-unit').textContent = m.u;
    roll($('#fc-num'), nf(m.v, m.d), wk ? f.week : f.month);
    const nKh = new Set(f.counted.map((a) => a.c.i)).size;
    $('#fc-sub').textContent = wk
      ? `${nKh} KH · ${f.ap.length} lịch hẹn` + (f.miss.length ? ` · ${f.miss.length} lịch thiếu case size chưa tính` : '')
      : `${nKh + f.later.length} KH · 10/11 – 30/11 · thứ Hai → thứ Bảy, không tính Chủ Nhật 15, 22, 29`;
    $('#fc-split').innerHTML = split.map((v, i) => `<i style="--f: ${v || 0.001}; --c: var(--${ST3[i]})"></i>`).join('');
    $('#fc-keys').innerHTML = split.map((v, i) => `<span><i style="--c: var(--${ST3[i]})"></i>${STAGE[ST3[i]]} <b class="num">${moneyS(v)}</b></span>`).join('');
    const miss = $('#fc-miss');
    miss.hidden = !f.miss.length;
    miss.innerHTML = `${ic('alert')}${f.miss.length} lịch thiếu case size · điền ngay`;

    const rest = f.month - f.week, land = f.sales + f.month;
    const goal = f.teams.every((t) => TEAMS[t].target) ? sum(f.teams, (t) => TEAMS[t].target) : 0, span = Math.max(land, goal);
    const goalTxt = goal ? ` · <b class="num pct ${land >= goal ? 'ok' : ''}">${nf((land / goal) * 100)}%</b> mục tiêu ${moneyS(goal)}` : ' · chưa đặt mục tiêu';
    const goalBar = goal ? `${goal > land ? `<i style="--f: ${goal - land}; --c: var(--fill-2)"></i>` : ''}<u class="goal" style="left: ${((goal / span) * 100).toFixed(2)}%"></u>` : '';
    const goalKey = goal ? `<span><i class="goal-k"></i>Mục tiêu <b class="num">${moneyS(goal)}</b> · còn thiếu <b class="num">${moneyS(Math.max(goal - land, 0))}</b></span>` : '';
    $('.runway').innerHTML = `<h3>Đường băng tháng 11 <small>đã đạt + dự kiến</small><span class="sum">về đích <b class="num">${moneyS(land)}</b>${goalTxt}</span></h3>
      <div class="stack"><i style="--f: ${f.sales}; --c: var(--accent)"></i>${f.fw.map((v, i) => `<i style="--f: ${v || 0.001}; --c: var(--${ST3[i]})"></i>`).join('')}<i class="hatch" style="--f: ${rest}"></i>${goalBar}</div>
      <div class="keys"><span><i style="--c: var(--accent)"></i>Đã đạt <b class="num">${moneyS(f.sales)}</b></span>${f.fw.map((v, i) => `<span><i style="--c: var(--${ST3[i]})"></i>${i ? '' : 'Tuần này '}${STAGE[ST3[i]]} <b class="num">${moneyS(v)}</b></span>`).join('')}<span><i style="--c: var(--accent); opacity: 0.5"></i>Các tuần còn lại <b class="num">${moneyS(rest)}</b></span>${goalKey}</div>
      <p class="note">Đã đạt là doanh số thuần (FYP phát hành − FYP hủy). Phần dự kiến cộng thẳng case size của từng lịch, không nhân tỷ lệ chốt.</p>`;

    if (wk) {
      $('#fc-strip-h').innerHTML = 'Tuần này theo ngày <small>cột vàng là hôm nay · bấm tên ngày để xem cả ngày, bấm một thẻ để mở hồ sơ KH</small>';
      $('#fc-strip').innerHTML = '<div class="days">' + DAYS.map(([l, dt], day) => {
        const list = dayList(f, 0, day), amt = dayAmt(list);
        const chips = list.map((a) => `<button class="ap ${a.c.st} ${a.flag || ''}" data-c="${a.c.i}" style="--i: ${a.i}"><b>${a.c.name}</b><span class="num">${a.flag === 'miss' ? 'thiếu case size' : a.flag === 'dup' ? 'đã tính ở lịch T6' : a.t + ' · ' + a.amt + ' tr'}</span></button>`).join('');
        return `<div class="day ${day === 0 ? 'past' : day === 1 ? 'today' : ''}"><button class="dh" data-cell="0-${day}"${list.length ? '' : ' disabled'}><span><b>${l}</b> ${dt}</span><span class="sum num">${day === 0 ? 'đã qua' : amt ? amt + ' tr' : '—'}</span></button>${chips}</div>`;
      }).join('') + '</div>';
    } else {
      // every cell is the list of that day's appointments; press one to see them
      const cellHtml = (w, day) => {
        if (w === 0 && day === 0) return '<div class="c off">đã qua</div>';
        if (w === 3 && day > 0) return '<div class="c off">tháng 12</div>';
        const list = dayList(f, w, day), amt = dayAmt(list);
        if (!list.length) return '<div class="c"><b class="num muted">—</b><small>&nbsp;</small></div>';
        return `<button class="c ${w === 0 && day === 1 ? 'today' : ''}" data-cell="${w}-${day}" style="--heat: ${Math.min(0.34, (amt / 200) * 0.34).toFixed(3)}; --i: ${w * 6 + day}"><b class="num">${amt ? amt + ' tr' : '—'}</b><small>${list.length} lịch</small></button>`;
      };
      const weekAmt = (w) => DAYS.reduce((a, _, day) => a + ((w === 0 && day === 0) || (w === 3 && day > 0) ? 0 : dayAmt(dayList(f, w, day))), 0);
      $('#fc-strip-h').innerHTML = 'Tháng 11 theo tuần <small>thứ Hai → thứ Bảy, không có cột Chủ Nhật · bấm một ô để xem các lịch của ngày đó</small>';
      $('#fc-strip').innerHTML = '<div class="grid-m"><span></span>' + DAYS.map(([l]) => `<span class="h">${l}</span>`).join('') + '<span class="h">Cả tuần</span>'
        + WEEKS.map(([label], w) => `<span class="wk num">${label}</span>` + DAYS.map((_, day) => cellHtml(w, day)).join('') + `<span class="tot num">${moneyS(weekAmt(w))}</span>`).join('') + '</div>';
    }
    renderFcTable(f);
  };
  // One day of Forecast: which appointments, which customer, whose, how much; a row opens the customer
  function openDay(w, day, anchor) {
    const f = fcData(), list = dayList(f, w, day).slice().sort((x, y) => x.t.localeCompare(y.t)), amt = dayAmt(list), pop = $('#day-pop');
    const date = w === 0 ? DAYS[day][1] : `${WEEKS[w][1] + day}/11`;
    pop.innerHTML = `<h3 class="sec-h">${DAYS[day][0]} ${date}<small>${amt ? moneyS(amt) + ' dự kiến · ' : ''}${list.length} lịch hẹn · ${scopeName()}</small></h3>`
      + list.map((a) => {
        const r = RMS[a.c.rm];
        const right = a.flag === 'miss' ? '<span class="chip warn">thiếu case size</span>' : a.flag === 'dup' ? '<span class="muted">đã tính ở T6</span>' : a.amt + ' tr';
        return `<button class="dayrow" data-c="${a.c.i}"><span class="tm num">${a.t}</span><span><b>${a.c.name}</b> <span class="st ${a.c.st}">${STAGE[a.c.st]}</span><small>RM ${r.name} · ${teamMark(r.team, 'sm')} ${TEAMS[r.team].name}</small></span><span class="v num">${right}</span>${ic('chev', 'go')}</button>`;
      }).join('') + '<p class="note">Bấm một dòng để mở hồ sơ khách hàng.</p>';
    openFloat('day-pop');
    place(pop, anchor);
  }
  function openMiss() {
    const f = fcData(), pop = $('#miss-pop');
    pop.innerHTML = '<h3 class="sec-h">Lịch thiếu case size <small>điền xong là cộng ngay vào Forecast</small></h3>' + f.miss.map((a) => `<div class="r"><span class="t"><b>${a.c.name}</b> <span class="st ${a.c.st}">${STAGE[a.c.st]}</span><small>${DAYS[a.day][0]} ${DAYS[a.day][1]} · ${a.t} · RM ${RMS[a.c.rm].name}</small></span><span class="fill-in"><input class="num" type="text" inputmode="numeric" value="40" aria-label="Case size dự kiến của ${a.c.name}" /> tr</span><button class="btn" data-fill="${a.i}">Lưu</button></div>`).join('');
    openFloat('miss-pop');
    place(pop, $('#fc-miss'), 'right');
  }
  function fillCase(i, v) {
    const a = APPTS[i];
    a.flag = undefined;
    a.amt = v;
    a.c.cs = v;
    closeFloats();
    RENDER.forecast();
    toast(`Đã thêm ${v} tr của ${a.c.name} vào Forecast`, () => {
      a.flag = 'miss';
      a.amt = 0;
      a.c.cs = null;
      if (state.view === 'forecast') RENDER.forecast();
    });
  }

  /* ---------- Báo cáo ---------- */
  // Periods. The month to date is the data above. Its two weeks add up to it RM by RM: this week is given,
  // last week is the rest (both cancellations fell in last week). Older periods are spread from the month
  // by a fixed pseudo-random factor: made up, but every team and total is a sum of RM rows, so tables add up.
  const rnd = (i, k) => { const x = Math.sin((i + 1) * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
  const baseRm = (r) => ({ i: r.i, name: r.name, team: r.team, issued: r.issued, cancelled: r.cancelled, fi: r.fi, fc: r.fc, rf: r.rf, appt: r.appt, kh: r.kh });
  const THIS_WEEK = [[2, 90, 2], [1, 40, 1], [1, 40, 1], [1, 50, 2], [1, 40, 1], [1, 45, 1], [1, 45, 1], [1, 70, 1], [0, 0, 1]]; // issued, FYP, RF on 09–10/11
  const spread = (f, k, age) => RMS.map((r, i) => {
    const issued = Math.round(r.issued * f * (0.8 + rnd(i, k) * 0.4)), avg = r.fi / r.issued;
    const cancelled = Math.min(issued, Math.round(issued * 0.1 * rnd(i, k + 9)));
    return { ...baseRm(r), issued, cancelled, fi: Math.round((issued * avg * (0.9 + rnd(i, k + 5) * 0.2)) / 10) * 10, fc: Math.round((cancelled * avg) / 10) * 10,
      rf: Math.round(((issued * r.rf) / r.issued) * (0.92 + rnd(i, k + 3) * 0.2)),
      appt: [Math.round(r.appt[0] * f * (0.85 + rnd(i, k + 1) * 0.3)), Math.round(r.appt[1] * f * (0.8 + rnd(i, k + 2) * 0.4)), Math.round(rnd(i, k + 4) * 1.4), 0],
      kh: r.kh.map((v) => Math.round(v * (1 - 0.012 * age))) };
  });
  const PERIODS = [
    { id: 'w46', kind: 'week', name: 'Tuần này', range: '09/11 – 15/11', note: 'tới hôm nay 10/11', cmp: ['02/11 – 03/11', { sales: 300, issued: 7, cancelled: 0 }],
      rms: RMS.map((r, i) => ({ ...baseRm(r), issued: THIS_WEEK[i][0], cancelled: 0, fi: THIS_WEEK[i][1], fc: 0, rf: THIS_WEEK[i][2], appt: [Math.round(r.appt[0] * 0.16), Math.round(r.appt[1] * 0.14), Math.round(r.appt[2] * 0.5), Math.round(r.appt[3] * 0.13)] })) },
    { id: 'w45', kind: 'week', name: 'Tuần trước', range: '02/11 – 08/11',
      rms: RMS.map((r, i) => ({ ...baseRm(r), issued: r.issued - THIS_WEEK[i][0], fi: r.fi - THIS_WEEK[i][1], rf: r.rf - THIS_WEEK[i][2], appt: [Math.round(r.appt[0] * 0.52), Math.round(r.appt[1] * 0.5), r.appt[2] - Math.round(r.appt[2] * 0.5), 0] })) },
    { id: 'w44', kind: 'week', name: 'Tuần 44', range: '26/10 – 01/11', rms: spread(0.6, 44, 1) },
    { id: 'w43', kind: 'week', name: 'Tuần 43', range: '19/10 – 25/10', rms: spread(0.56, 43, 2) },
    { id: 'm11', kind: 'month', name: 'Tháng 11/2026', range: '01/11 – 10/11', note: 'MTD', cmp: ['01/10 – 10/10', { sales: 1228, issued: 30, cancelled: 1 }], rms: RMS.map(baseRm) },
    { id: 'm10', kind: 'month', name: 'Tháng 10/2026', range: '01/10 – 31/10', rms: spread(2.2, 10, 3) },
    { id: 'm09', kind: 'month', name: 'Tháng 9/2026', range: '01/09 – 30/09', rms: spread(2.0, 9, 6) },
    { id: 'm08', kind: 'month', name: 'Tháng 8/2026', range: '01/08 – 31/08', rms: spread(1.9, 8, 9) },
    { id: 'y26', kind: 'year', name: 'Năm 2026', range: '01/01 – 10/11', note: 'YTD', rms: spread(21, 26, 0) },
    { id: 'y25', kind: 'year', name: 'Năm 2025', range: '01/01 – 31/12', rms: spread(23, 25, 30) },
  ];
  const KINDS = [['week', 'Tuần'], ['month', 'Tháng'], ['year', 'Năm']];
  const periodOf = (id = state.period) => PERIODS.find((p) => p.id === id);
  // What a period is compared with: the same days of the period before when it is still running,
  // else the whole period before it
  function cmpOf(p) {
    if (p.cmp) return { label: p.cmp[0], ...p.cmp[1] };
    const same = PERIODS.filter((x) => x.kind === p.kind), older = same[same.indexOf(p) + 1];
    const d = agg(older ? older.rms : p.rms), k = p.id === 'y26' ? 0.86 : older ? 1 : 0.93;
    return { label: p.id === 'y26' ? '01/01 – 10/11/2025' : older ? older.name : 'kỳ liền trước', sales: Math.round((d.fi - d.fc) * k), issued: Math.round(d.issued * k), cancelled: Math.round(d.cancelled * k) };
  }
  const LEDGER = {
    result: {
      cols: ['HĐ phát hành', 'HĐ hủy', 'Tổng số HĐ', 'FYP phát hành', 'FYP hủy', 'Doanh số', 'Tỷ lệ hủy', 'Tỉ lệ chốt'],
      row: (d, max) => {
        const cr = rate(d.cancelled, d.issued);
        return [`<td>${nf(d.issued)}</td>`, d.cancelled ? `<td>${nf(d.cancelled)}</td>` : '<td class="zero">0</td>', `<td>${nf(d.issued - d.cancelled)}</td>`, `<td>${moneyS(d.fi)}</td>`, cell(d.fc),
          max ? `<td class="bar" style="--w: ${((d.fi - d.fc) / max).toFixed(3)}"><span>${moneyS(d.fi - d.fc)}</span></td>` : `<td>${moneyS(d.fi - d.fc)}</td>`,
          `<td class="${cr >= 10 ? 'hot' : cr ? '' : 'zero'}">${pctS(cr)}</td>`, `<td>${pctS(rate(d.issued, d.rf))}</td>`].join('');
      },
    },
    appt: { cols: ['Đã gặp', 'Dời · hủy · không đến', 'Chưa ghi kết quả', 'Dự kiến', 'Tổng lịch'], row: (d) => [...d.appt, sum(d.appt)].map((v) => `<td>${nf(v)}</td>`).join('') },
    kh: { cols: ['N4', 'N3', 'N2', 'N1', 'KH đang mở'], row: (d) => [...d.kh, sum(d.kh)].map((v) => `<td>${nf(v)}</td>`).join('') },
  };
  // mode: 'fold' teams that open to their RMs (Sổ số) · 'flat' teams only · 'full' every RM under its team (page 2)
  function ledgerHtml(tab, mode, rms) {
    const L = LEDGER[tab], net = (d) => d.fi - d.fc;
    const teams = [0, 1, 2].map((t) => ({ t, d: agg(rms.filter((r) => r.team === t)) })).sort((a, b) => net(b.d) - net(a.d));
    const max = Math.max(...teams.map((x) => net(x.d)), 1);
    let h = `<thead><tr><th>${mode === 'flat' ? 'Team' : 'Team / RM'}</th>${L.cols.map((c) => `<th>${c}</th>`).join('')}</tr></thead><tbody>`;
    for (const { t, d } of teams) {
      const open = mode === 'full' || (mode === 'fold' && !!state.open['lg' + t]);
      h += `<tr class="${mode === 'flat' ? '' : 'team'}${open && mode === 'fold' ? ' open' : ''}" ${mode === 'fold' ? `data-tw="lg${t}"` : ''}><td>${mode === 'fold' ? `<span class="tw">${ic('chev')}</span>` : ''}${teamMark(t)} ${TEAMS[t].name}</td>${L.row(d, max)}</tr>`;
      if (open) h += rms.filter((r) => r.team === t).sort((a, b) => net(b) - net(a)).map((r) => `<tr class="rm ${mode === 'fold' ? 'link' : ''}" ${mode === 'fold' ? `data-rm="${r.i}"` : ''}><td>RM ${r.name}</td>${L.row(r, max)}</tr>`).join('');
    }
    return h + `<tr class="total"><td>Tổng</td>${L.row(agg(rms), 0)}</tr></tbody>`;
  }
  // "Bản tin": three pages written from the numbers of the period (no AI). What is on screen is what
  // prints, exports to PDF, and becomes the first sheets of the Excel file.
  function papersHtml(p) {
    const rms = p.rms, all = agg(rms), c = cmpOf(p), net = (d) => d.fi - d.fc, sales = net(all), total = all.issued - all.cancelled;
    const teams = [0, 1, 2].map((t) => ({ t, d: agg(rms.filter((r) => r.team === t)) })).sort((a, b) => net(b.d) - net(a.d));
    const g = c.sales ? ((sales - c.sales) / c.sales) * 100 : 0, cr = rate(all.cancelled, all.issued) || 0, dcr = cr - (rate(c.cancelled, c.issued) || 0);
    const lead = teams[0], weak = [...teams].sort((a, b) => rate(a.d.issued, a.d.rf) - rate(b.d.issued, b.d.rf))[0];
    const worst = [...teams].sort((a, b) => (rate(b.d.cancelled, b.d.issued) || 0) - (rate(a.d.cancelled, a.d.issued) || 0))[0];
    const top = [...rms].sort((a, b) => net(b) - net(a))[0], maxT = Math.max(...teams.map((x) => x.d.fi), 1);
    const when = `${p.range}${p.note ? ' (' + p.note + ')' : ''}`, more = (v) => (v >= 0 ? 'tăng' : 'giảm');
    const brand = '<div class="brand" role="img" aria-label="Heritas L-CRM"><img class="b-tree b-out" src="img/heritas-tree.png" alt="" /><div><img class="b-word b-out" src="img/heritas-wordmark.png" alt="" /><img class="b-lcrm" src="img/heritas-lcrm.png" alt="" /></div></div>';
    const run = `<div class="run"><span><b>Heritas L-CRM</b> · Báo cáo kết quả kinh doanh · ${p.name}</span><span class="num">${when} · Toàn bộ</span></div>`;
    const foot = (n) => `<div class="foot"><span>Heritas L-CRM · tài liệu nội bộ</span><span class="num">Lập lúc 13:35 ngày 10/11/2026</span><span class="num">Trang ${n} / 3</span></div>`;
    const notes = [
      all.cancelled
        ? `<li><b>HĐ hủy:</b> ${nf(all.cancelled)} HĐ, FYP hủy ${moneyS(all.fc)}. Cao nhất ở ${TEAMS[worst.t].name}: tỷ lệ hủy ${pctS(rate(worst.d.cancelled, worst.d.issued))}.</li>`
        : '<li><b>Không có HĐ hủy</b> trong kỳ.</li>',
      `<li><b>${TEAMS[weak.t].name} cần hỗ trợ:</b> tỉ lệ chốt ${pctS(rate(weak.d.issued, weak.d.rf))}, thấp nhất ba team.</li>`,
      `<li><b>RM dẫn đầu:</b> ${top.name} (${TEAMS[top.team].name}), doanh số ${moneyS(net(top))} từ ${top.issued - top.cancelled} HĐ.</li>`,
      p.note ? '<li><b>Tuần này dự kiến ' + moneyS(sum(fwOf(() => true))) + '</b> từ các lịch đã đặt của KH N3, N2, N1 (màn Forecast).</li>' : '',
    ].join('');
    // the cancelled policies of the period, at most six on the page
    const cut = rms.flatMap((r) => Array.from({ length: r.cancelled }, (_, n) => ({ r, fyp: Math.round(r.fc / r.cancelled / 10) * 10, no: `${String(10 + ((r.i * 7 + n * 3) % 19)).padStart(2, '0')}10-0${300 + r.i * 41 + n * 17}`, kh: `${FAM[(r.i + n * 3) % 10]} ${MID[(r.i * 5 + n) % 8]} ${GIV[(r.i * 3 + n * 7 + 11) % 20]}` })));
    const cutRows = cut.slice(0, 6).map((x) => `<tr><td class="num">HĐ ${x.no}</td><td class="l">${x.kh}</td><td class="l">RM ${x.r.name} · ${TEAMS[x.r.team].name}</td><td>${moneyS(x.fyp)}</td></tr>`).join('');
    return `<article class="paper rise" style="--i: 0">
        <div class="head">${brand}<div class="meta"><b>BÁO CÁO KẾT QUẢ KINH DOANH</b><strong>${p.name}</strong><span class="num">${when} · Toàn bộ · 3 team, 9 RM</span><br />Lập lúc 13:35 ngày 10/11/2026</div></div>
        <h3>Doanh số ${sales >= 0 ? 'đạt' : 'âm'} ${moneyS(Math.abs(sales))}, ${more(g)} ${nf(Math.abs(g), 1)}% so với ${c.label}.</h3>
        <p class="lead">${nf(total)} hợp đồng${all.cancelled ? ` sau khi trừ ${nf(all.cancelled)} hợp đồng hủy` : ', không có hợp đồng hủy'}. ${TEAMS[lead.t].name} dẫn đầu với ${moneyS(net(lead.d))}. Tỷ lệ hủy ${pctS(cr)}, ${more(dcr)} ${nf(Math.abs(dcr), 1)} điểm.</p>
        <div class="kpi4 num">
          <div><span class="lbl">Doanh số</span><span class="v">${nf(money(sales).v, money(sales).d)} <small>${money(sales).u}</small></span><span class="f">${moneyS(all.fi)} phát hành − ${moneyS(all.fc)} hủy</span></div>
          <div><span class="lbl">Tổng số HĐ</span><span class="v">${nf(total)}</span><span class="f">${nf(all.issued)} phát hành − ${nf(all.cancelled)} hủy · kỳ so sánh ${nf(c.issued - c.cancelled)}</span></div>
          <div><span class="lbl">Tỉ lệ chốt</span><span class="v">${nf(rate(all.issued, all.rf), 1)} <small>%</small></span><span class="f">${nf(all.issued)} HĐ phát hành ÷ ${nf(all.rf)} RF</span></div>
          <div><span class="lbl">Tỷ lệ hủy</span><span class="v">${nf(cr, 1)} <small>%</small></span><span class="f">${nf(all.cancelled)} ÷ ${nf(all.issued)} · ${arrow(dcr)} ${nf(Math.abs(dcr), 1)} điểm</span></div>
        </div>
        <div class="two">
          <div><h4>DOANH SỐ THEO TEAM</h4>${teams.map(({ t, d }) => `<div class="tbar"><b>${teamMark(t)} ${TEAMS[t].name}</b><div class="stack"><i style="--f: ${Math.max(net(d), 0.001)}; --c: var(--accent)"></i>${d.fc ? `<i class="cut" style="--f: ${d.fc}"></i>` : ''}<i style="--f: ${maxT - d.fi + 0.001}; --c: transparent"></i></div><span class="v num">${moneyS(net(d))}</span></div>`).join('')}<div class="keys"><span><i style="--c: var(--accent)"></i>Doanh số</span><span><i style="--c: var(--danger)"></i>FYP hủy (đã trừ)</span></div></div>
          <div><h4>NHẬN XÉT</h4><ul>${notes}</ul></div>
        </div>
        <table class="tbl" style="margin-top: 22px">${ledgerHtml('result', 'flat', rms)}</table>
        ${foot(1)}
      </article>
      <article class="paper rise" style="--i: 1">${run}
        <h5>Kết quả theo RM <small>xếp theo doanh số trong từng team</small></h5>
        <table class="tbl">${ledgerHtml('result', 'full', rms)}</table>
        <h5>HĐ hủy trong kỳ <small>${cut.length ? `${nf(cut.length)} HĐ · FYP hủy ${moneyS(all.fc)}${cut.length > 6 ? ' · trang này ghi 6 HĐ đầu, đủ danh sách ở file Excel' : ''}` : 'không có'}</small></h5>
        ${cut.length ? `<table class="tbl"><thead><tr><th>Số HĐ</th><th class="l">Khách hàng</th><th class="l">RM · Team</th><th>FYP hủy</th></tr></thead><tbody>${cutRows}</tbody></table>` : '<p class="lead">Không có hợp đồng nào hủy trong kỳ này.</p>'}
        ${foot(2)}
      </article>
      <article class="paper rise" style="--i: 2">${run}
        <h5>Lịch hẹn trong kỳ</h5>
        <table class="tbl">${ledgerHtml('appt', 'flat', rms)}</table>
        <h5>Khách hàng theo nhóm <small>cuối kỳ</small></h5>
        <table class="tbl">${ledgerHtml('kh', 'flat', rms)}</table>
        <h5>Định nghĩa chỉ số</h5>
        <dl class="defs"><dt>Tổng số HĐ</dt><dd>HĐ phát hành − HĐ hủy. Có thể âm trong một kỳ ngắn.</dd><dt>Doanh số</dt><dd>FYP phát hành − FYP hủy. HĐ hủy tính vào kỳ của ngày hủy.</dd><dt>Tỷ lệ hủy</dt><dd>HĐ hủy ÷ HĐ phát hành; "—" khi kỳ không có HĐ phát hành; có thể vượt 100%.</dd><dt>Tỉ lệ chốt</dt><dd>HĐ phát hành ÷ RF, chưa trừ HĐ hủy.</dd><dt>Kỳ so sánh</dt><dd>Kỳ đang chạy so với cùng số ngày của kỳ trước; kỳ đã xong so với cả kỳ liền trước.</dd></dl>
        ${foot(3)}
      </article>`;
  }
  RENDER.reports = () => {
    const p = periodOf(), brief = state.rp === 'brief';
    $('#papers').hidden = !brief;
    $('#ledger').hidden = brief;
    $('#rp-print').hidden = !brief;
    $('#rp-hint').textContent = brief
      ? 'Ba trang: tóm tắt, chi tiết theo RM, hoạt động. In, PDF và file Excel theo đúng bản này. Đổi kỳ ở viên kỳ phía trên.'
      : 'Mỗi tab trả lời một câu hỏi, vừa một màn, không cuộn ngang. Bấm một team để mở các RM.';
    $$('#rp-seg button').forEach((b) => b.classList.toggle('on', b.dataset.rp === state.rp));
    thumb($('#rp-seg'));
    $$('#lg-tabs button').forEach((b) => b.classList.toggle('on', b.dataset.lg === state.lg));
    $('#lg-tbl').innerHTML = ledgerHtml(state.lg, 'fold', p.rms);
    $('#papers').innerHTML = papersHtml(p);
  };
  // The period picker: kind on top, then this period and the ones before it
  function periodPop(animate) {
    const cur = periodOf(), kind = state.pkind || cur.kind;
    $('#period-pop').innerHTML = `<div class="seg" id="pk-seg">${KINDS.map(([k, l]) => `<button class="${k === kind ? 'on' : ''}" data-kind="${k}">${l}</button>`).join('')}</div>`
      + PERIODS.filter((p) => p.kind === kind).map((p) => `<button class="prow ${p.id === cur.id ? 'on' : ''}" data-period="${p.id}"><span><b>${p.name}</b><small class="num">${p.range}${p.note ? ' · ' + p.note : ''}</small></span>${p.id === cur.id ? ic('check') : ''}</button>`).join('')
      + '<hr /><div class="h">Tùy chọn từ ngày tới ngày: có trong app, không thử ở đây.</div>';
    thumb($('#pk-seg'), animate);
  }
  function openPeriod() {
    state.pkind = null;
    openFloat('period-pop');
    periodPop(false);
    place($('#period-pop'), $('#period'), 'right');
  }
  function setPeriod(id) {
    state.period = id;
    closeFloats();
    if (state.view !== 'reports') {
      go('reports');
      return toast(`Tổng quan của bản thử chỉ có tháng 11. Đã mở Báo cáo: ${periodOf().name}`);
    }
    chrome();
    RENDER.reports();
    $('.view.on').scrollTop = 0;
  }
  function stepPeriod(dir) { // ‹ the period before, › the one after, within the same kind
    if (state.view !== 'reports') return openPeriod();
    const cur = periodOf(), same = PERIODS.filter((p) => p.kind === cur.kind), next = same[same.indexOf(cur) - dir];
    return next ? setPeriod(next.id) : toast(dir > 0 ? 'Đây là kỳ mới nhất' : 'Bản thử không có kỳ cũ hơn');
  }

  /* ---------- Khách hàng, hồ sơ, hủy HĐ ---------- */
  function renderKan() {
    $('#kan').innerHTML = ['n4', 'n3', 'n2', 'n1'].map((s) => {
      const list = CUS.filter((c) => c.st === s).slice(0, 5);
      return `<div class="kcol"><header><span class="st ${s}">${STAGE[s]}</span><span class="num muted">${KH_ALL[s]}</span></header>`
        + list.map((c) => `<button class="kcard" data-c="${c.i}" style="--i: ${c.i % 8}"><b><span class="nm">${c.name}</span>${c.pol ? `<span class="chip ok">${c.pol} HĐ</span>` : ''}</b><span>RM ${RMS[c.rm].name} · ${TEAMS[RMS[c.rm].team].name}</span>${c.next ? `<span class="nx num">Lịch ${c.next}${c.cs ? ' · ' + c.cs + ' tr' : ''}</span>` : ''}</button>`).join('')
        + `<span class="more num">+ ${KH_ALL[s] - list.length} KH khác</span></div>`;
    }).join('');
  }
  RENDER.customers = () => { if (!$('#kan').children.length) renderKan(); };
  // "Tìm là sáng": matches light up, the rest dims; the list under the field reads "KH – RM – Team"
  function suggest(input, box, items, pick, mark) {
    const q = fold(input.value);
    const found = q ? items.map((it) => ({ it, h: hit(it.text, q) })).filter((x) => x.h).sort((a, b) => b.h.score - a.h.score) : [];
    mark(q ? new Set(found.map((x) => x.it.id)) : null, q);
    box.hidden = !q;
    box.innerHTML = found.slice(0, 8).map((x, i) => `<button class="opt ${i ? '' : 'sel'}" data-id="${x.it.id}"><span class="t">${x.it.pre || ''}${x.h.html} <small>${x.it.sub}</small></span></button>`).join('') || '<div class="opt"><span class="t muted">Không tìm thấy. Thử gõ ít chữ hơn.</span></div>';
    box._pick = pick;
  }
  function sugKeys(e, input, box) {
    const opts = $$('.opt[data-id]', box), at = opts.findIndex((o) => o.classList.contains('sel'));
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!opts.length) return;
      const next = (at + (e.key === 'ArrowDown' ? 1 : -1) + opts.length) % opts.length;
      opts.forEach((o, i) => o.classList.toggle('sel', i === next));
    } else if (e.key === 'Enter' && opts[at]) {
      box._pick(+opts[at].dataset.id);
    } else if (e.key === 'Escape') {
      input.value = '';
      input.dispatchEvent(new Event('input'));
      input.blur();
    }
  }
  const cusItems = () => CUS.map((c) => ({ id: c.i, text: c.name, sub: `– RM ${RMS[c.rm].name} – ${TEAMS[RMS[c.rm].team].name}` }));
  const rmItems = () => RMS.map((r) => ({ id: r.i, text: r.name, pre: 'RM ', sub: `– ${TEAMS[r.team].name}` }));
  function quickLook(c) {
    const r = RMS[c.rm];
    $('#ql').innerHTML = `<h4>${c.name} <span class="st ${c.st}">${STAGE[c.st]}</span></h4><span class="muted">RM ${r.name} · ${TEAMS[r.team].name}</span>
      <dl class="facts"><dt>Mã KH</dt><dd class="num">${c.code}</dd><dt>Case size dự kiến</dt><dd class="num">${c.cs ? c.cs + ' tr' : 'Chưa có'}</dd><dt>Lần gặp gần nhất</dt><dd class="num">${c.last || '—'}</dd><dt>Lịch kế tiếp</dt><dd class="num">${c.next || 'Chưa hẹn'}</dd><dt>Hợp đồng</dt><dd>${c.pol ? c.pol + ' HĐ đã phát hành' : 'Chưa có'}</dd><dt>Nhịp gặp · 8 tuần</dt><dd>${cadHtml(c.cad)}</dd></dl>
      <button class="btn ghost" data-open-c="${c.i}">Mở hồ sơ</button>`;
    $('#ql').classList.add('on');
  }
  const cadHtml = (cad) => '<span class="cad">' + [...cad].map((ch) => `<i class="${ch === '.' ? '' : ch}"></i>`).join('') + '</span>';
  const POLICIES = [{ no: '2610-0457', d: '21/10/2026', fyp: 150 }, { no: '1509-0312', d: '15/09/2026', fyp: 120 }];
  function openProfile(i, from) {
    if (state.view !== 'profile') state.back = state.view;
    state.cust = i;
    go('profile', { from, to: '#pf-head' });
  }
  RENDER.profile = () => {
    const c = CUS[state.cust], r = RMS[c.rm], back = $('.view[data-view="profile"] .back');
    back.dataset.go = state.back; // back to where the customer was opened from
    back.innerHTML = ic('back') + VIEWS[state.back].title;
    $('#pf-head').innerHTML = `<span class="av lg">${initials(c.name)}</span><div><h3>${c.name} <span class="st ${c.st}">${STAGE[c.st]}</span></h3><p>RM ${r.name} · ${TEAMS[r.team].name} · <span class="num">${c.code}</span></p></div>
      <div class="stats num"><div><span>Case size dự kiến</span><b>${c.cs ? c.cs + ' tr' : '—'}</b></div><div><span>Gặp gần nhất</span><b>${c.last || '—'}</b></div><div><span>Lịch kế tiếp</span><b>${c.next ? c.next.split(' · ')[0] : '—'}</b></div><div><span>Nhịp gặp · 8 tuần</span><b>${cadHtml(c.cad)}</b></div></div>`;
    const pols = POLICIES.slice(0, c.pol);
    const tl = [];
    if (c.next) tl.push([c.next.split(' ')[1], 'accent', `Lịch hẹn ${c.next.split(' · ')[1]}${c.cs ? ' · case size dự kiến ' + c.cs + ' tr' : ' · chưa có case size'}`]);
    if (c.last) tl.push([c.last, c.st, 'Đã gặp · thêm 3 dữ kiện KYC']);
    pols.forEach((p) => tl.push([p.d.slice(0, 5), 'issued', `HĐ ${p.no} phát hành · FYP ${p.fyp} tr`]));
    tl.push(['12/08', 'n4', 'Tạo hồ sơ khách hàng']);
    $('#pf-tl').innerHTML = tl.map(([d, col, t]) => `<span class="d num">${d}</span><i style="--c: var(--${col})"></i><span>${t}</span>`).join('');
    $('#pf-pol').innerHTML = pols.map((p) => {
      const off = state.cancel[c.i + p.no];
      return `<div class="pol ${off ? 'cancelled' : ''}"><span><b class="num">HĐ ${p.no}</b><small>Phát hành ${p.d} · RM ${r.name}</small></span><span class="fyp num">${p.fyp} tr</span>${off ? `<span class="chip bad ${off === 'new' ? 'stamp' : ''}">Đã hủy 10/11/2026</span>` : `<span class="row"><span class="chip ok">Đã phát hành</span><button class="linkbtn" data-cancel="${p.no}">Hủy HĐ…</button></span>`}</div>`;
    }).join('') || '<p class="muted">Chưa có hợp đồng đã phát hành. Thử với Nguyễn Văn Hùng hoặc Đỗ Quang Vinh.</p>';
    Object.keys(state.cancel).forEach((k) => { if (state.cancel[k] === 'new') state.cancel[k] = true; });
  };
  function openCancel(no) {
    const c = CUS[state.cust], r = RMS[c.rm], p = POLICIES.find((x) => x.no === no);
    const was = { s: r.fi - r.fc, n: r.issued - r.cancelled, c: rate(r.cancelled, r.issued) };
    $('#sheet').innerHTML = `<h3>Hủy hợp đồng ${no}</h3><p>${c.name} · FYP ${p.fyp} tr · phát hành ${p.d}</p>
      <div class="fld"><label for="cancel-date">Ngày hủy</label><input id="cancel-date" class="num" type="text" value="10/11/2026" /><span class="muted">không trước ngày phát hành</span></div>
      <div class="impact"><h4>Tháng 11/2026 của RM ${r.name} sẽ đổi</h4>
        <div class="r"><span>Doanh số</span><span class="was num">${moneyS(was.s)}</span><span class="muted">→</span><span class="to num">${moneyS(was.s - p.fyp)}</span></div>
        <div class="r"><span>Tổng số HĐ</span><span class="was num">${was.n}</span><span class="muted">→</span><span class="to num">${was.n - 1}</span></div>
        <div class="r"><span>Tỷ lệ hủy</span><span class="was num">${pctS(was.c)}</span><span class="muted">→</span><span class="to num">${pctS(rate(r.cancelled + 1, r.issued))}</span></div></div>
      <p class="muted">Số của tháng 10 không đổi: HĐ hủy tính vào kỳ của ngày hủy. FYP hủy bằng FYP phát hành của HĐ.</p>
      <div class="acts"><button class="btn ghost" data-close>Đóng</button><button class="btn danger" data-do-cancel="${no}">Hủy hợp đồng</button></div>`;
    openFloat('sheet', true);
  }
  function doCancel(no) {
    const key = state.cust + no;
    state.cancel[key] = 'new';
    closeFloats();
    RENDER.profile();
    toast(`Đã hủy HĐ ${no}`, () => { delete state.cancel[key]; if (state.view === 'profile') RENDER.profile(); });
  }

  /* ---------- Team, RM, Lịch hẹn, Cài đặt ---------- */
  // A team shows its own colour and icon; the TL stands level with the team's name; the three brief
  // numbers are the loudest thing on the card (Owner 10/11)
  const teamHead = (name, color, icon, tl, edit) => {
    const [c, i] = look(color, icon);
    const mark = edit === null ? `<span class="tmark lg">${ic(i)}</span>` : `<button class="tmark lg" data-edit-team="${edit}" title="Sửa team: tên, màu, icon, mục tiêu" aria-label="Sửa team ${esc(name)}">${ic(i)}</button>`;
    return `<header class="${color ? '' : 'plain'}" style="--c: ${c}">${mark}<b class="tname">${esc(name)}</b><span class="tl"><i>${ic('crown')}TL</i><b>${tl}</b></span></header>`;
  };
  RENDER.team = () => {
    $('#teams').innerHTML = [0, 1, 2].map((t) => {
      const d = scopeData(t), T = TEAMS[t];
      return `<section class="card tcard rise" style="--i: ${t}">${teamHead(T.name, T.color, T.icon, T.tl, t)}
        <div class="brief num"><div><b>${moneyS(d.sales)}</b><span>Doanh số</span></div><div><b>${d.total}</b><span>Số HĐ</span></div><div><b>${moneyS(sum(d.fw))}</b><span>Forecast tuần</span></div></div>${T.target ? `<p class="goal-line num">Mục tiêu tháng ${moneyS(T.target)} · đã đạt ${nf((d.sales / T.target) * 100)}% · dự kiến về đích ${nf(((d.sales + d.fm) / T.target) * 100)}%</p>` : '<p class="goal-line">Chưa đặt mục tiêu tháng</p>'}`
        + teamRms(t).map((r) => `<button class="rmrow" data-rm="${r.i}"><span class="av">${initials(r.name)}</span><span><b>${r.name}</b><small class="num">${sum(r.kh)} KH · Forecast tuần ${moneyS(sum(fwOf((c) => c.rm === r.i)))}</small></span><span class="v num">${moneyS(r.fi - r.fc)}</span></button>`).join('') + '</section>';
    }).join('');
  };
  // Making or editing a team: name, colour, icon, with the header drawn as it will look
  let draft = null;
  function drawTeamSheet() {
    const d = draft;
    $('#sheet').innerHTML = `<h3>${d.t === null ? 'Tạo team' : 'Sửa team'}</h3><p>Chỉ cần tên. Màu và icon là tùy chọn: không chọn thì team dùng kiểu mặc định.</p>
      <div class="tprev">${teamHead(d.name || 'Tên team', d.color, d.icon, d.tl, null)}</div>
      <div class="fld"><label for="team-name">Tên team</label><input id="team-name" type="text" value="${esc(d.name)}" maxlength="24" autocomplete="off" /></div>
      <div class="fld"><label>Màu</label><div class="swatches"><button class="none ${d.color ? '' : 'on'}" data-tc="" title="Mặc định" aria-label="Màu mặc định"></button>${TEAM_COLORS.map(([c, l]) => `<button class="${c === d.color ? 'on' : ''}" data-tc="${c}" style="--c: var(--${c})" title="${l}" aria-label="Màu ${l}"></button>`).join('')}</div><span class="muted">tùy chọn</span></div>
      <div class="fld"><label>Icon</label><div class="icons"><button class="${d.icon ? '' : 'on'}" data-ti="" title="Mặc định" aria-label="Icon mặc định">${ic('team')}</button>${TEAM_ICONS.map((i) => `<button class="${i === d.icon ? 'on' : ''}" data-ti="${i}" aria-label="Icon ${i}">${ic(i)}</button>`).join('')}</div></div>
      <div class="fld"><label for="team-target">Mục tiêu</label><input id="team-target" class="num" type="text" inputmode="numeric" value="${d.target || ''}" placeholder="chưa đặt" /><span class="muted">triệu đồng / tháng · mốc để Forecast so sánh</span></div>
      <div class="acts"><button class="btn ghost" data-close>Đóng</button><button class="btn" data-team-save>${d.t === null ? 'Tạo team' : 'Lưu'}</button></div>`;
  }
  // what is typed stays when the sheet is drawn again
  const readDraft = () => { draft.name = $('#team-name').value; draft.target = parseInt($('#team-target').value, 10) || null; };
  function teamSheet(t) {
    draft = t === null ? { t, name: 'Team mới', color: null, icon: null, target: null, tl: 'Chưa chọn' } : { t, name: TEAMS[t].name, color: TEAMS[t].color, icon: TEAMS[t].icon, target: TEAMS[t].target, tl: TEAMS[t].tl };
    drawTeamSheet();
    openFloat('sheet', true);
  }
  function saveTeam() {
    readDraft();
    const d = draft;
    closeFloats();
    if (d.t === null) return toast('Bản concept: team mới không được lưu. Phần này để anh thử tên, màu, icon và mục tiêu.');
    Object.assign(TEAMS[d.t], { name: d.name.trim() || TEAMS[d.t].name, color: d.color, icon: d.icon, target: d.target });
    renderKan();
    if (RENDER[state.view]) RENDER[state.view]();
    toast(`Đã lưu team ${TEAMS[d.t].name}`);
  }
  document.addEventListener('input', (e) => {
    if (e.target.id !== 'team-name' || !draft) return;
    draft.name = e.target.value;
    $('.tprev .tname').textContent = draft.name || 'Tên team';
  });
  function openRm(i, from) {
    state.rm = i;
    go('rm', { from, to: '#rm-head' });
  }
  RENDER.rm = () => {
    const r = RMS[state.rm], list = CUS.filter((c) => c.rm === r.i).sort((a, b) => a.st.localeCompare(b.st));
    $('#rm-head').innerHTML = `<span class="av lg">${initials(r.name)}</span><div><h3>${r.name} <span class="chip">RM</span></h3><p>${teamMark(r.team)} Team ${TEAMS[r.team].name} · TL ${TEAMS[r.team].tl}</p></div>
      <div class="stats num"><div><span>Doanh số tháng 11</span><b>${moneyS(r.fi - r.fc)}</b></div><div><span>Tổng số HĐ</span><b>${r.issued - r.cancelled}</b></div><div><span>Tỷ lệ hủy</span><b>${pctS(rate(r.cancelled, r.issued))}</b></div><div><span>Tỉ lệ chốt</span><b>${pctS(rate(r.issued, r.rf))}</b></div><div><span>Forecast tuần</span><b>${moneyS(sum(fwOf((c) => c.rm === r.i)))}</b></div></div>`;
    $('#rm-count').innerHTML = `${sum(r.kh)} KH đang mở · bản concept hiện ${list.length} KH mẫu<span class="legend">${cadHtml('m')} đã gặp</span><span class="legend">${cadHtml('x')} dời, hủy, không đến</span><span class="legend">${cadHtml('s')} có lịch tuần này</span>`;
    $('#rm-tbl').innerHTML = '<thead><tr><th>Khách hàng</th><th class="l">Nhóm</th><th class="l">Nhịp gặp · 8 tuần</th><th>Gặp gần nhất</th><th>Lịch sắp tới</th><th>Case size dự kiến</th><th>HĐ</th></tr></thead><tbody>'
      + list.map((c) => `<tr class="rm link" data-c="${c.i}"><td style="padding-left: 12px; color: var(--text)"><b>${c.name}</b></td><td class="l"><span class="st ${c.st}">${STAGE[c.st]}</span></td><td class="l">${cadHtml(c.cad)}</td><td>${c.last || '—'}</td><td>${c.next || '—'}</td><td>${c.cs ? c.cs + ' tr' : '—'}</td><td>${c.pol || '—'}</td></tr>`).join('') + '</tbody>';
  };
  RENDER.appointments = () => { $('#ag-today').innerHTML = agendaHtml(); };
  const SETTINGS = {
    data: ['Dữ liệu', [
      [['File dữ liệu', '<span class="k-win">Project2C-data\\ cạnh file exe</span><span class="k-mac">~/Library/Application Support/dev.alexh.project2c/</span>'], ['Bản sao lưu gần nhất', '<span>Hôm nay 12:10</span>']],
      [['Sao lưu ngay', '<button class="btn ghost" data-job="backup">Sao lưu</button>'], ['Khôi phục từ file sao lưu', '<button class="btn ghost">Chọn file…</button>'], ['Mở thư mục dữ liệu', '<span class="k-win">trong Explorer</span><span class="k-mac">trong Finder</span>']],
    ]],
    trash: ['Thùng rác', [
      [['Bản ghi trong Thùng rác', '<span class="num">12</span>'], ['Dọn sạch Thùng rác', '<button class="btn ghost">Dọn…</button>']],
    ]],
  };
  // Cài đặt → AI (Owner 10/11): more than one provider, a model per provider, the reasoning effort.
  // OpenCode, its models and the four effort levels are the ones of the approved AI mockup; WorkBuddy is new.
  const AI = {
    opencode: { name: 'OpenCode', note: 'Đang dùng · gói Credit', key: 1, models: ['GLM-5.3', 'Kimi K3', 'DeepSeek V4.1 Flash'] },
    workbuddy: { name: 'WorkBuddy', note: 'Mới · gói Pro', key: 0, models: ['DeepSeek V4.1 Flash'] },
    chatgpt: { name: 'ChatGPT web', note: 'Dán tay qua trình duyệt', key: -1, models: ['Theo tài khoản ChatGPT'] },
  };
  const EFFORTS = ['Mặc định', 'Thấp', 'Vừa', 'Cao'];
  function aiPane() {
    const a = state.ai, P = AI[a.provider];
    if (!P.models.includes(a.model)) a.model = P.models[P.models.length - 1];
    const store = '<span class="k-win">Credential Manager</span><span class="k-mac">Keychain</span>';
    const seg = (kind, list, on) => `<span class="seg">${list.map((x) => `<button class="${x === on ? 'on' : ''}" data-ai-${kind}="${x}">${x}</button>`).join('')}</span>`;
    return `<h3>AI</h3>
      <div class="card group rise"><div class="gh">Nhà cung cấp</div>${Object.entries(AI).map(([id, p]) => `<button class="r prov ${id === a.provider ? 'on' : ''}" data-ai-provider="${id}"><i class="radio"></i><span class="t"><b>${p.name}</b><small>${p.note}</small></span><span class="keyst">${p.key > 0 ? `${ic('check')}Key lưu trong ${store}` : p.key === 0 ? 'Chưa có key · Nhập key…' : 'Không cần key'}</span></button>`).join('')}</div>
      <div class="card group rise" style="--i: 1">
        <div class="r"><b>Model</b>${seg('model', P.models, a.model)}</div>
        <div class="r"><b>Mức suy luận</b>${seg('effort', EFFORTS, a.effort)}</div>
        <div class="r"><b>Phiên bản prompt</b><span class="num">analysis@6 · discovery@6</span></div>
        <div class="r"><b>Kiểm tra kết nối</b><button class="btn ghost" data-ai-test>Gửi thử</button></div>
      </div>
      <p class="note">Mức Cao trả lời kỹ hơn, chậm hơn và tốn credit hơn; model chưa được kiểm với mức suy luận thì app dùng Mặc định. Thêm một nhà cung cấp là thêm một dịch vụ: qua G4 (dịch vụ, chi phí), G5 (chạy lại bộ đánh giá trên model đó) và G6 (nơi lưu key). Cần kiểm trước: WorkBuddy có API cho app ngoài gọi hay không.</p>`;
  }
  RENDER.settings = () => {
    $$('#set-nav .set-i').forEach((b) => b.classList.toggle('on', b.dataset.setI === state.set));
    if (state.set === 'ai') {
      $('#set-pane').innerHTML = aiPane();
      return thumbs(false);
    }
    const [title, groups] = SETTINGS[state.set];
    $('#set-pane').innerHTML = `<h3>${title}</h3>` + groups.map((g, i) => `<div class="card group rise" style="--i: ${i}">${g.map(([l, r]) => `<div class="r"><b>${l}</b>${r}</div>`).join('')}</div>`).join('');
  };

  /* ---------- Floats: palette, sheet, popovers ---------- */
  const FLOATS = ['pal', 'sheet', 'now-pop', 'scope-menu', 'miss-pop', 'go-menu', 'day-pop', 'period-pop'];
  function closeFloats(except) {
    FLOATS.forEach((id) => { if (id !== except) $('#' + id).classList.remove('on'); });
    if (!except) $('#win').classList.remove('modal');
    $('#menu-go').setAttribute('aria-expanded', 'false');
    $('#ql').classList.remove('on');
  }
  function openFloat(id, modal) {
    closeFloats(id);
    $('#' + id).classList.add('on');
    $('#win').classList.toggle('modal', !!modal);
  }
  function place(pop, anchor, align = 'center') {
    // The window may be scaled to fit (--fit): bring screen distances back to its own pixels
    const host = pop.offsetParent.getBoundingClientRect(), a = anchor.getBoundingClientRect(), w = pop.offsetWidth;
    const s = host.width / pop.offsetParent.offsetWidth || 1;
    const x0 = (a.left - host.left) / s, x1 = (a.right - host.left) / s;
    let left = align === 'right' ? x1 - w : align === 'left' ? x0 : (x0 + x1) / 2 - w / 2;
    left = Math.max(12, Math.min(left, host.width / s - w - 12));
    pop.style.left = left + 'px';
    pop.style.marginLeft = '0';
    let top = (a.bottom - host.top) / s + 8; // below its anchor, or above it when there is no room below
    if (top + pop.offsetHeight > host.height / s - 12) top = Math.max(12, (a.top - host.top) / s - pop.offsetHeight - 8);
    pop.style.top = top + 'px';
  }
  const CMDS = [
    { t: 'Đặt lịch hẹn mới', run: () => toast('Bản concept: ở đây mở hộp Đặt lịch hẹn, có ô Case size dự kiến') },
    { t: 'Thêm khách hàng', run: () => toast('Bản concept: ở đây mở hộp Thêm khách hàng') },
    { t: 'Xuất Excel tháng này', run: exportDemo },
    { t: 'Sao lưu ngay', run: () => nowJob('Đang sao lưu', 'Đã sao lưu lúc 13:35') },
    { t: 'Đổi giao diện Sáng / Tối', run: () => setSwitch('theme', root.dataset.theme === 'dark' ? 'light' : 'dark') },
  ];
  // "Hỏi là có số": a few questions the palette answers itself, computed, no AI
  function answer(q) {
    const t = TEAMS.findIndex((x) => q.includes(fold(x.name)));
    const sc = t < 0 ? 'all' : t, who = t < 0 ? 'Toàn bộ' : 'Team ' + TEAMS[t].name, d = scopeData(sc);
    const toReports = () => go('reports'), cr = pctS(rate(d.cancelled, d.issued));
    if (/doanh so|fyp/.test(q)) return { q: `Doanh số · ${who} · tháng 11 (01/11 – 10/11)`, a: moneyS(d.sales), s: `${d.total} HĐ · tỷ lệ hủy ${cr} · tỉ lệ chốt ${pctS(rate(d.issued, d.rf))}`, run: toReports };
    if (/ty le huy|hd huy|\bhuy\b/.test(q)) return { q: `Tỷ lệ hủy · ${who} · tháng 11 (01/11 – 10/11)`, a: cr, s: `${d.cancelled} HĐ hủy ÷ ${d.issued} HĐ phát hành`, run: toReports };
    if (/forecast|du kien/.test(q)) return { q: `Forecast tuần này · ${who} · 10/11 – 14/11`, a: moneyS(sum(d.fw)), s: `N1 ${moneyS(d.fw[0])} · N2 ${moneyS(d.fw[1])} · N3 ${moneyS(d.fw[2])} · cả tháng ${moneyS(d.fm)}`, run: () => { setScope(sc); go('forecast'); } };
    return null;
  }
  let palRun = [];
  function renderPal() {
    const q = fold($('#pal-q').value);
    const groups = [];
    const top = (items, n) => items.map((x) => ({ ...x, h: hit(x.text, q) })).filter((x) => x.h).sort((a, b) => b.h.score - a.h.score).slice(0, n);
    const navItems = NAV.map(([v, t, i]) => ({ text: t, icon: i, run: () => go(v) }));
    const cmdItems = CMDS.map((c) => ({ text: c.t, icon: 'chev', run: c.run }));
    let ans = null;
    if (!q) {
      groups.push(['Đi tới', navItems.slice(0, 5).map((x) => ({ ...x, html: x.text }))], ['Lệnh', cmdItems.slice(0, 3).map((x) => ({ ...x, html: x.text }))]);
    } else {
      ans = answer(q);
      const cus = top(CUS.map((c) => ({ text: c.name, sub: `– RM ${RMS[c.rm].name} – ${TEAMS[RMS[c.rm].team].name}`, st: c.st, run: () => openProfile(c.i) })), 6);
      const rms = top(RMS.map((r) => ({ text: r.name, pre: 'RM ', sub: `– ${TEAMS[r.team].name}`, av: 1, run: () => openRm(r.i) })), 4);
      const add = (label, list) => { if (list.length) groups.push([label, list.map((x) => ({ ...x, html: (x.pre || '') + x.h.html }))]); };
      add('Khách hàng', cus);
      add('RM', rms);
      add('Đi tới', top(navItems, 4));
      add('Lệnh', top(cmdItems, 4));
    }
    palRun = [];
    let h = '';
    if (ans) {
      palRun.push(ans.run);
      h += `<button class="opt sel answer" data-run="0" style="display: block"><span class="q">${ans.q}</span><span class="a"><b class="num">${ans.a}</b><span class="num">${ans.s}</span></span></button>`;
    }
    for (const [label, list] of groups) {
      h += `<div class="grp">${label}</div>`;
      for (const x of list) {
        const lead = x.st ? `<span class="st ${x.st}">${STAGE[x.st]}</span>` : x.av ? `<span class="av" style="width: 24px; height: 24px; font-size: 10px">${initials(x.text)}</span>` : ic(x.icon || 'chev');
        h += `<button class="opt ${palRun.length ? '' : 'sel'}" data-run="${palRun.length}">${lead}<span class="t">${x.html} <small>${x.sub || ''}</small></span><span class="kind">${label}</span></button>`;
        palRun.push(x.run);
      }
    }
    $('#pal-list').innerHTML = h || '<div class="grp">Không có kết quả. Thử "nguyen", "tung", "bao cao", "xuat".</div>';
  }
  function openPal(q = '') {
    $('#pal-q').value = q;
    renderPal();
    openFloat('pal', true);
    $('#pal-q').focus({ preventScroll: true });
  }
  function runPal(i) {
    const f = palRun[i];
    closeFloats();
    if (f) f();
  }
  function buildMenus() {
    $('#scope-menu').innerHTML = '<div class="h">Góc nhìn</div><button data-scope="all">Toàn bộ</button><hr />' + TEAMS.map((t, i) => `<button data-scope="${i}">Team ${t.name}</button>`).join('') + '<hr /><div class="h">Một RM: mở từ Team &amp; nhân sự hoặc ô lệnh</div>';
    $('#go-menu').innerHTML = NAV.map(([v, t, i, key]) => `<button data-go="${v}">${ic(i)}${t}<kbd>⌘${key}</kbd></button>`).join('');
    $('#now-pop').innerHTML = '<h3 class="sec-h">Hôm nay <small>thứ Ba 10/11/2026</small></h3>' + agendaHtml() + '<h3 class="sec-h" style="margin-top: 12px">Cần làm</h3><div class="row" style="flex-wrap: wrap; gap: 6px"><button class="chip warn" data-go="appointments">12 buổi chưa ghi kết quả</button><button class="chip warn" data-go="forecast">2 lịch thiếu case size</button><span class="chip">1 HĐ chờ phát hành</span></div>';
  }

  /* ---------- Ideas + pick list ---------- */
  // no, group, title, what, why, effort, tags [text, kind], recommended, where to look {view, spot, pre}
  const IDEAS = [
    ['01', 'Vỏ và chất liệu', 'Ba lớp: Nền · Kính · Tiêu điểm', 'Nội dung là lớp nền, phẳng và rộng. Thanh bên và các nút điều khiển là kính nổi phía trên. Hộp thoại, ô lệnh là lớp tiêu điểm, làm mờ phần còn lại. Thẻ không còn viền: phân cấp bằng cỡ chữ và khoảng trống.', 'Đây là cách macOS 26 và Windows 11 dựng cửa sổ. Bỏ viền thì số liệu nổi lên, app bớt cảm giác "bảng điều khiển".', 'M', [['Mac'], ['Win']], 1, { view: 'overview', spot: '#win' }],
    ['02', 'Vỏ và chất liệu', 'Mỗi hệ điều hành một chất', 'Cùng bố cục, khác chi tiết. macOS: thanh bên kính bo đồng tâm với cửa sổ, ba nút đỏ-vàng-xanh nằm trong thanh bên, nút điều khiển dạng viên, menu trên cùng. Windows 11: nền Mica, ô tìm trên thanh tiêu đề, vạch chọn bên trái, góc bo 8 px, nút cửa sổ bên phải.', 'Phát hành cùng lúc hai nền tảng: người dùng Mac thấy app Mac, người dùng Windows thấy app Windows. Đổi công tắc ở thanh dưới cửa sổ để so.', 'M', [['Mac'], ['Win']], 1, { spot: '.seg[data-set="os"]' }],
    ['03', 'Vỏ và chất liệu', 'Chữ hệ thống, số có nhịp', 'Chữ giao diện dùng font của máy (SF Pro, Segoe UI Variable): mở app không chờ tải font, tiếng Việt đủ dấu. Số lớn khít và rõ; đơn vị (tỷ, tr, %) nhỏ và nhạt; cột số thẳng hàng.', 'Font hệ thống là cách rẻ nhất để app "giống app gốc". Đổi công tắc Chữ để so với Be Vietnam Pro.', 'S', [['đổi ADR-0013', 'gate']], 1, { spot: '.seg[data-set="font"]' }],
    ['05', 'Vỏ và chất liệu', 'Logo gọn trên thanh bên', 'Cụm ngang: cây bên trái, chữ Heritas và L-CRM bên phải; slogan xuống chân thanh bên.', 'Khối logo dọc hiện chiếm gần một phần tư thanh bên. Bản gọn trả chỗ cho điều hướng mà vẫn giữ đủ ba mảnh logo anh đã duyệt.', 'S', [['đổi G3 27/10', 'gate']], 1, { view: 'overview' }],
    ['06', 'Chuyển động', 'Bốn động tác, ba lò xo', 'Hiện, Mở, Trượt, Đếm. Thời lượng và đường cong là token dùng chung. Chỉ đổi vị trí, tỉ lệ, độ trong; tự tắt khi máy bật Giảm chuyển động.', '"Mượt" đến từ sự nhất quán: cùng một thứ luôn chuyển động cùng một kiểu. Phòng thử ở mục Chuyển động bên dưới.', 'M', [], 1, { scroll: '#motion', spot: '#lab' }],
    ['07', 'Chuyển động', 'Mở từ chỗ bấm', 'Bấm thẻ KH, thẻ nở thành hồ sơ. Bấm một RM, dòng đó nở thành trang RM.', 'Mắt không mất dấu: luôn biết mình vừa từ đâu tới. Dùng View Transitions có sẵn của WebView, không thêm thư viện. Thử: bấm một thẻ ở màn Khách hàng.', 'M', [], 1, { view: 'customers', spot: '#kan' }],
    ['08', 'Chuyển động', 'Bỏ nút "Lọc"', 'Đổi kỳ hay góc nhìn là áp dụng ngay; số chạy tới giá trị mới, không cần bấm Lọc.', 'Nhanh là phản hồi tức thì. Thử: ở Tổng quan bấm viên "Toàn bộ" rồi chọn một team, hoặc bấm một team ở khối Team.', 'S–M', [['đổi G3 03/10', 'gate']], 0, { view: 'overview', spot: '#scope' }],
    ['09', 'Tìm kiếm và điều hướng', 'Ô lệnh ⌘K / Ctrl+K', 'Một ô mở được ở mọi màn: tìm KH không cần dấu (dạng "Nguyễn Văn Hùng – RM Hoàng Văn Tùng – Sao Mai"), tìm RM, nhảy tới màn, chạy lệnh.', 'Gom yêu cầu tìm KH và tìm RM của phần C vào một chỗ, kiểu Spotlight. Trên Windows ô này nằm sẵn trên thanh tiêu đề.', 'M', [['C']], 1, { pre: () => openPal('nguyen van hu') }],
    ['10', 'Tìm kiếm và điều hướng', 'Ô lệnh trả lời bằng số', 'Gõ "doanh so sao mai" hay "ty le huy": ô lệnh hiện luôn con số, Enter thì mở báo cáo. Tính bằng hàm chỉ số của app, không gọi AI.', 'Hỏi nhanh trong cuộc họp mà không phải dò bảng. Làm sau ý 09.', 'M', [], 0, { pre: () => openPal('doanh so sao mai') }],
    ['11', 'Tìm kiếm và điều hướng', '"Lúc này"', 'Viên kính giữa thanh công cụ: lịch hẹn kế tiếp và thời gian còn lại; bấm ra việc hôm nay. Việc chạy nền (xuất Excel, sao lưu, phân tích AI) hiện tiến độ ngay ở đây, không chặn màn hình.', 'Lấy ý từ Live Activities của Apple: app luôn cho biết đang xảy ra gì. Thử: bấm "Xuất Excel" ở màn Báo cáo.', 'M', [], 1, { view: 'reports', spot: '#now', pre: exportDemo }],
    ['12', 'Tìm kiếm và điều hướng', 'Một cụm góc nhìn và kỳ', 'Góc nhìn (Toàn bộ / Team / RM) và kỳ nằm cùng một chỗ trên thanh công cụ ở mọi màn có số liệu, cùng một cách dùng.', 'Hôm nay mỗi màn đặt bộ lọc một kiểu. Một cụm thống nhất thì học một lần.', 'S–M', [], 1, { view: 'overview' }],
    ['13', 'Tìm kiếm và điều hướng', 'Menu và phím tắt của hệ điều hành', 'macOS có menu Tệp, Sửa, Xem, Đi tới, Cửa sổ, Trợ giúp với phím ⌘ (⌘1–⌘6 đổi màn, ⌘, mở Cài đặt, ⌘F tìm). Windows dùng Ctrl tương ứng. Rê chuột vào mục thanh bên để thấy phím.', 'Người dùng Mac tìm lệnh trên menu trước tiên; menu Sửa còn cần để sao chép, dán chạy đúng trong app. Trong trang thử này trình duyệt giữ các phím số; ⌘K, ⌘F và ⌘Z thì chạy.', 'S–M', [['Mac']], 0, { view: 'overview', pre: () => { setSwitch('os', 'mac'); } }],
    ['14', 'Tổng quan', 'Một số chủ đạo', 'Doanh số là con số lớn nhất màn, kèm phép tính FYP phát hành − FYP hủy. Dưới là đường lũy kế: tháng này, phần dự kiến tới cuối tháng (nét đứt) và tháng trước (nét mờ).', 'Mở app là trả lời được "tháng này tới đâu rồi, có hơn tháng trước không". Nối luôn Tổng quan với Forecast.', 'M', [['B'], ['D']], 1, { view: 'overview' }],
    ['15', 'Tổng quan', 'Ô chỉ số ghi rõ phép tính', 'Tổng số HĐ ghi "34 phát hành − 2 hủy"; Tỷ lệ hủy tăng thì đỏ; Tỉ lệ chốt ghi "34 HĐ ÷ 47 RF". Bấm một ô để mở Báo cáo.', 'Chỉ số mới của phần B dễ hiểu sai. Ghi phép tính ngay dưới số thì không ai phải hỏi lại.', 'S–M', [['B']], 1, { view: 'overview' }],
    ['16', 'Tổng quan', 'Điểm nhấn', 'Bốn câu nhận xét viết từ số theo luật cố định: hủy tăng, team dẫn đầu, buổi chưa ghi kết quả, dự kiến tuần này. Bấm một câu để tới đúng nơi.', 'Số nhiều thì người xem bỏ sót điều quan trọng; câu chữ kéo mắt tới đó. Không dùng AI nên luôn đúng số.', 'M', [['G2', 'gate']], 1, { view: 'overview' }],
    ['17', 'Forecast', 'Đường băng tháng', 'Một thanh: đã đạt, dự kiến tuần này tách N1 / N2 / N3, và các tuần còn lại. Cuối thanh là số "về đích".', 'Câu quản lý hỏi nhiều nhất là "tháng này về bao nhiêu". Một thanh trả lời được.', 'S–M', [['D']], 1, { view: 'forecast' }],
    ['18', 'Forecast', 'Dải tuần thứ Hai → thứ Bảy', 'Mỗi ngày một cột, mỗi lịch hẹn một thẻ có case size và màu nhóm; tổng tiền ở đầu cột. KH có hai lịch chỉ tính một lần, thẻ kia mờ đi.', 'Thấy tiền dự kiến nằm ở ngày nào, của ai, để biết hôm nào phải dồn sức.', 'M', [['D']], 1, { view: 'forecast', pre: () => { state.fc = 'week'; } }],
    ['19', 'Forecast', 'Lưới tháng không có Chủ Nhật', 'Mỗi tuần một hàng, sáu cột thứ Hai → thứ Bảy; ô đậm nhạt theo số tiền; ngày đã qua và ngày ngoài tháng gạch chéo. Bấm một ô để thấy các lịch của ngày đó: KH nào, của RM nào, bao nhiêu; bấm KH để mở hồ sơ.', 'Đúng định nghĩa Forecast tháng của anh; nhìn là hiểu vì sao không có Chủ Nhật 15, 22, 29.', 'S–M', [['D']], 1, { view: 'forecast', pre: () => { state.fc = 'month'; } }],
    ['20', 'Forecast', 'Bảng Team → RM, điền case size tại chỗ', 'Bấm một team để mở các RM; cột Tuần này có thanh. Lịch thiếu case size gom vào một nút: bấm, điền số, Forecast chạy theo ngay.', 'Forecast chỉ đúng khi đủ case size. Điền được ngay tại nơi phát hiện thiếu thì dữ liệu mới đầy.', 'M', [['D']], 1, { view: 'forecast' }],
    ['32', 'Forecast', 'Mục tiêu doanh số', 'Mỗi team có một ô nhập mục tiêu doanh số tháng, trong hộp tạo / sửa team. Đường băng của Forecast có thêm vạch mục tiêu, phần trăm về đích và số còn thiếu; thẻ team ghi đã đạt bao nhiêu phần trăm.', 'Anh làm rõ 11/11: mục tiêu là trường nhập thêm để Forecast có cột mốc so sánh. Là dữ liệu mới nên qua G2; còn phải chốt mục tiêu đặt cho team hay tới từng RM, theo tháng hay cả tuần.', 'M', [['D'], ['G2', 'gate'], ['Owner 11/11']], 1, { view: 'forecast' }],
    ['21', 'Báo cáo và Excel', 'Bản tin ba trang, chọn được kỳ', 'Báo cáo là một tập ba trang có đầu thư: tóm tắt (câu tóm tắt, bốn số chính, doanh số theo team, nhận xét viết từ số), chi tiết từng RM và các HĐ hủy, rồi lịch hẹn, khách hàng theo nhóm và định nghĩa. Chọn kỳ ở viên kỳ trên thanh công cụ: tuần, tháng, năm, kỳ này và các kỳ trước. Nút "Xem bản in" cho thấy đúng trang sẽ in hoặc xuất PDF.', 'Anh cần "đẳng cấp, chuyên nghiệp": người đọc là cấp trên, đọc trong 10 giây. Trang này gửi đi được ngay.', 'M', [['E']], 1, { view: 'reports', pre: () => { state.rp = 'brief'; } }],
    ['22', 'Báo cáo và Excel', 'Sổ số kiểu báo cáo tài chính', 'Ba tab Kết quả · Lịch hẹn · Khách hàng thay cho 17 cột cuộn ngang. Team gập mở RM. Số canh phải, tiêu đề một dòng, dòng Tổng có kẻ trên.', 'Bảng hiện tại phải cuộn ngang và tiêu đề gãy ba, bốn dòng. Chia theo câu hỏi thì mỗi bảng vừa một màn.', 'M', [['E'], ['B']], 1, { view: 'reports', pre: () => { state.rp = 'ledger'; state.open.lg0 = true; } }],
    ['23', 'Báo cáo và Excel', 'File Excel là bản in của Bản tin', 'Sheet Tóm tắt giống hệt Bản tin. Sheet sổ có nhóm gập Team ▸ RM, thanh dữ liệu của Excel, dòng Tổng là công thức. Sheet Forecast và sheet Định nghĩa đi kèm.', 'File gửi đi phải đẹp như làm tay và vẫn đúng khi người nhận sửa số. Mẫu ở mục File Excel bên dưới.', 'M', [['E'], ['D']], 1, { scroll: '#excel' }],
    ['24', 'Báo cáo và Excel', 'Trình chiếu', 'Một nút ẩn thanh bên và phóng trang báo cáo cho màn chiếu; Esc để thoát.', 'Báo cáo hay được mở trong họp. Rẻ, làm sau khi có Bản tin.', 'S', [['E']], 0, { view: 'reports', pre: () => { state.rp = 'brief'; } }],
    ['25', 'Khách hàng, RM, hợp đồng', 'Tìm là sáng', 'Ô tìm trên màn Khách hàng: thẻ khớp sáng lên, thẻ khác mờ đi chứ không biến mất; gợi ý dạng "KH – RM – Team", ↑ ↓ Enter để mở.', 'Giữ nguyên vị trí các cột nên vẫn thấy KH đang ở nhóm nào. Đúng ví dụ anh đưa: gõ "nguyen van hu".', 'S–M', [['C']], 1, { view: 'customers', post: () => { const q = $('#cu-q'); q.value = 'nguyen van hu'; q.dispatchEvent(new Event('input')); } }],
    ['26', 'Khách hàng, RM, hợp đồng', 'Xem nhanh bằng phím cách', 'Chọn một thẻ, nhấn Space: bảng kính hiện nhóm, RM, case size, lịch kế tiếp, HĐ, nhịp gặp. Nhấn lần nữa để đóng.', 'Như Quick Look của Finder: xem mà không rời danh sách.', 'M', [['Mac']], 0, { view: 'customers', post: () => quickLook(CUS[7]) }],
    ['27', 'Khách hàng, RM, hợp đồng', 'Trang RM có "nhịp gặp"', 'Bấm một RM (hay tìm tên): đầu trang là chỉ số kỳ này và Forecast tuần; dưới là KH đang phụ trách, mỗi KH một dải 8 tuần cho thấy gặp đều hay bỏ lâu, kèm lần gặp gần nhất và lịch sắp tới.', 'Đúng yêu cầu phần C, thêm một cái nhìn bảng thường không có: KH nào đang bị bỏ quên.', 'M', [['C']], 1, { pre: () => openRm(0) }],
    ['28', 'Khách hàng, RM, hợp đồng', 'Hủy HĐ: thấy trước ảnh hưởng', 'Hộp hủy hỏi ngày hủy và cho thấy chỉ số của RM trước → sau (doanh số, tổng số HĐ, tỷ lệ hủy). Hủy xong, HĐ có dấu "Đã hủy" và có nút Hoàn tác.', 'Hủy là thao tác nặng, đổi số của cả kỳ. Thấy trước thì không hủy nhầm.', 'S–M', [['B']], 1, { pre: () => { openProfile(7); setTimeout(() => { if (!state.cancel['72610-0457']) openCancel('2610-0457'); }, reduce ? 0 : 600); } }],
    ['33', 'Khách hàng, RM, hợp đồng', 'Team có màu và icon riêng', 'Khi tạo team, có thể chọn màu cho tên và một icon bên cạnh; cả hai là tùy chọn, không chọn thì team dùng kiểu mặc định. TL đứng ngang hàng tên team, chữ đậm và to tương đương. Ba số tóm tắt (doanh số, số HĐ, Forecast tuần) đậm, màu champagne. Màu và icon đi theo team ở Tổng quan, Forecast, Báo cáo. Thử: bấm icon của một team, hoặc nút "+ Team".', 'Yêu cầu của anh ngày 10/11. Nhận ra team bằng mắt, không phải đọc tên; người đứng đầu được nêu rõ. Màu và icon là dữ liệu mới của team nên qua G2.', 'M', [['C'], ['G2', 'gate'], ['Owner 10/11']], 1, { view: 'team' }],
    ['29', 'Cài đặt', 'Icon cho Cài đặt và Forecast', 'Ba mục Dữ liệu, AI, Thùng rác có ô màu bo góc như Cài đặt hệ thống của Mac, dùng màu sẵn có của app. Mục Forecast và ô tìm dùng cùng bộ nét với các icon thanh bên.', 'Yêu cầu F của anh. Không cần màu mới.', 'S', [['F']], 1, { view: 'settings' }],
    ['34', 'Cài đặt', 'Nhiều nhà cung cấp AI, chọn model và mức suy luận', 'Cài đặt → AI liệt kê các nhà cung cấp (OpenCode đang dùng, thêm WorkBuddy), mỗi nơi một key riêng. Chọn model theo nhà cung cấp và mức suy luận: Mặc định, Thấp, Vừa, Cao.', 'Yêu cầu của anh ngày 10/11. Mỗi nhà cung cấp mới là một dịch vụ mới: G4 (dịch vụ, chi phí), G5 (chạy lại bộ đánh giá trên model đó), G6 (nơi lưu key). Phải kiểm trước WorkBuddy có API cho app ngoài gọi không.', 'L', [['G4', 'gate'], ['G5', 'gate'], ['G6', 'gate'], ['Owner 10/11']], 1, { view: 'settings', pre: () => { state.set = 'ai'; } }],
    ['04', 'Để sau v1.0', 'Giao diện Sáng "Giấy"', 'Bộ màu sáng: nền giấy ngà, chữ xanh navy của logo, vàng champagne đậm hơn để đủ tương phản; tự theo cài đặt Sáng / Tối của máy.', 'Anh chốt 11/11: để sau v1.0, hiện tại chỉ cần Dark Mode. Bấm Xem để bật, bấm lần nữa để tắt bản xem trước.', 'M–L', [['đổi ADR-0013', 'gate']], 0, { pre: () => setSwitch('theme', root.dataset.theme === 'dark' ? 'light' : 'dark') }],
    ['30', 'Để sau v1.0', 'Nhắc lịch bằng thông báo của máy', '15 phút trước lịch hẹn có thông báo hệ thống; icon trên thanh menu (Windows: khay hệ thống) cho xem lịch kế tiếp mà không mở app.', 'Cần thêm plugin thông báo của Tauri.', 'M', [['G4', 'gate']], 0, {}],
    ['31', 'Để sau v1.0', 'Widget, Spotlight, Shortcuts', 'Widget lịch hôm nay trên màn hình Mac, tìm KH từ Spotlight, lệnh cho Siri / Shortcuts.', 'Chỉ app gốc Apple làm được: cần một phần viết bằng Swift. Xét khi chốt hướng thương mại hóa.', 'L', [['Mac']], 0, {}],
  ].map(([no, g, t, what, why, e, tags, rec, at]) => ({ no, g, t, what, why, e, tags, rec, at }));
  const picked = new Set(IDEAS.filter((x) => x.rec).map((x) => x.no));

  function renderIdeas() {
    let h = '', g = '';
    for (const x of IDEAS) {
      if (x.g !== g) { h += `<h3 class="grp-h">${x.g}</h3>`; g = x.g; }
      const canSee = x.at.view || x.at.pre || x.at.scroll || x.at.spot;
      h += `<article class="irow ${picked.has(x.no) ? 'picked' : ''}" id="idea-${x.no}"><span class="no">${x.no}</span>
        <div><h4>${x.t}${x.rec ? '<span class="tag rec">⭐ v1.0</span>' : ''}</h4><p>${x.what}</p><p class="why">${x.why}</p></div>
        <div class="im"><span class="tag">${x.e}</span>${x.tags.map(([t, k]) => `<span class="tag ${k || ''}">${t}</span>`).join('')}</div>
        ${canSee ? `<button class="see" data-see="${x.no}">Xem</button>` : '<span></span>'}
        <label class="pk" title="Chọn ý ${x.no}"><input type="checkbox" data-pick="${x.no}" ${picked.has(x.no) ? 'checked' : ''} aria-label="Chọn ý ${x.no}: ${esc(x.t)}" /><i></i></label></article>`;
    }
    $('#idea-list').innerHTML = h;
    updatePick();
  }
  function updatePick() {
    const list = IDEAS.filter((x) => picked.has(x.no)).map((x) => x.no);
    $('#pick-n').textContent = list.length;
    $('#pick-codes').textContent = list.join(' · ');
    return list;
  }
  function spot(no, sel) {
    const els = sel ? $$(sel) : $$(`[data-idea~="${no}"]`).filter((el) => el.offsetParent !== null);
    els.forEach((el) => {
      el.classList.add('spot');
      clearTimeout(el._spot);
      el._spot = setTimeout(() => el.classList.remove('spot'), 2200);
    });
  }
  function see(no) {
    const x = IDEAS.find((i) => i.no === no), at = x.at;
    $(at.scroll || '#stage').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: at.scroll ? 'start' : 'center' });
    if (at.pre) at.pre();
    if (at.view) go(at.view);
    setTimeout(() => { if (at.post) at.post(); spot(no, at.spot); }, reduce ? 0 : 500);
  }
  function onscreen() {
    const list = VIEWS[state.view].ideas.map((no) => IDEAS.find((x) => x.no === no));
    $('#onscreen').innerHTML = '<span>Ý tưởng ở màn này, rê chuột để thấy chỗ:</span>' + list.map((x, i) => `<button data-spot="${x.no}" style="animation-delay: ${i * 30}ms"><b>${x.no}</b>${x.t}</button>`).join('');
  }

  /* ---------- Events ---------- */
  document.addEventListener('click', (e) => {
    const t = e.target, on = (sel) => t.closest(sel);
    let el;
    if ((el = on('[data-wall-pick]'))) { setSwitch('wall', el.dataset.wallPick); return $('#stage').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }
    if ((el = on('[data-cell]'))) { const [w, day] = el.dataset.cell.split('-').map(Number); return openDay(w, day, el); }
    if ((el = on('#period-l'))) return $('#period-pop').classList.contains('on') ? closeFloats() : openPeriod();
    if ((el = on('[data-kind]'))) { state.pkind = el.dataset.kind; return periodPop(true); }
    if ((el = on('[data-period]'))) return setPeriod(el.dataset.period);
    if ((el = on('[data-edit-team]'))) return teamSheet(+el.dataset.editTeam);
    if ((el = on('[data-tc], [data-ti]'))) { readDraft(); if ('tc' in el.dataset) draft.color = el.dataset.tc || null; else draft.icon = el.dataset.ti || null; return drawTeamSheet(); }
    if ((el = on('[data-team-save]'))) return saveTeam();
    if ((el = on('[data-ai-provider]'))) { state.ai.provider = el.dataset.aiProvider; return RENDER.settings(); }
    if ((el = on('[data-ai-model], [data-ai-effort]'))) {
      if (el.dataset.aiModel) state.ai.model = el.dataset.aiModel; else state.ai.effort = el.dataset.aiEffort;
      $$('button', el.parentElement).forEach((b) => b.classList.toggle('on', b === el));
      return thumb(el.parentElement);
    }
    if ((el = on('[data-ai-test]'))) return nowJob('Đang gửi thử tới ' + AI[state.ai.provider].name, 'Kết nối tốt · ' + state.ai.model);
    if ((el = on('#full'))) return document.fullscreenElement ? document.exitFullscreen() : root.requestFullscreen().catch(() => toast('Khung xem này không cho mở toàn màn hình. Anh thử phím F11.'));
    if ((el = on('.back'))) return goBack(el.dataset.go);
    if ((el = on('.seg[data-set] button'))) return setSwitch(el.parentElement.dataset.set, el.dataset.v);
    if ((el = on('[data-open="pal"]'))) return openPal();
    if ((el = on('[data-close]'))) return closeFloats();
    if ((el = on('[data-do-cancel]'))) return doCancel(el.dataset.doCancel);
    if ((el = on('[data-cancel]'))) return openCancel(el.dataset.cancel);
    if ((el = on('[data-fill]'))) {
      const v = parseInt($('input', el.parentElement).value, 10);
      return v > 0 ? fillCase(+el.dataset.fill, v) : toast('Case size phải là số dương, tính bằng triệu đồng');
    }
    if ((el = on('#pal .opt[data-run]'))) return runPal(+el.dataset.run);
    if ((el = on('.sug .opt[data-id]'))) return el.parentElement._pick(+el.dataset.id);
    if ((el = on('[data-scope]'))) { closeFloats(); return setScope(el.dataset.scope === 'all' ? 'all' : +el.dataset.scope); }
    if ((el = on('.race'))) return setScope(state.scope === +el.dataset.team ? 'all' : +el.dataset.team);
    if ((el = on('[data-job]'))) return nowJob('Đang sao lưu', 'Đã sao lưu lúc 13:35');
    if ((el = on('#toast-undo'))) return undo();
    if ((el = on('#now'))) { if ($('#now-pop').classList.contains('on')) return closeFloats(); openFloat('now-pop'); return place($('#now-pop'), el); }
    if ((el = on('#scope'))) { if ($('#scope-menu').classList.contains('on')) return closeFloats(); openFloat('scope-menu'); $$('#scope-menu [data-scope]').forEach((b) => b.classList.toggle('on', b.dataset.scope === String(state.scope))); return place($('#scope-menu'), el, 'left'); }
    if ((el = on('#menu-go'))) { if ($('#go-menu').classList.contains('on')) return closeFloats(); openFloat('go-menu'); el.setAttribute('aria-expanded', 'true'); return place($('#go-menu'), el, 'left'); }
    if ((el = on('#fc-miss'))) return $('#miss-pop').classList.contains('on') ? closeFloats() : openMiss();
    if ((el = on('.step'))) return stepPeriod(+el.dataset.step);
    if ((el = on('#act'))) return state.view === 'team' ? teamSheet(null) : VIEWS[state.view].act[0] === 'export' ? exportDemo() : toast(`Bản concept: ở đây mở hộp thêm ${VIEWS[state.view].act[1]}`);
    if ((el = on('#fc-seg button'))) { state.fc = el.dataset.fc; $$('#fc-seg button').forEach((b) => b.classList.toggle('on', b === el)); return RENDER.forecast(); }
    if ((el = on('#rp-seg button'))) { state.rp = el.dataset.rp; return go('reports'); }
    if ((el = on('#lg-tabs button'))) { state.lg = el.dataset.lg; return RENDER.reports(); }
    if ((el = on('#rp-print'))) { const p = $('#papers'), onP = p.dataset.theme !== 'light'; if (onP) p.dataset.theme = 'light'; else delete p.dataset.theme; $('span', el).textContent = onP ? 'Xem trên màn hình' : 'Xem bản in'; return; }
    if ((el = on('#rp-show'))) { const w = $('#win'); w.classList.toggle('present'); return toast(w.classList.contains('present') ? 'Đang trình chiếu · Esc để thoát' : 'Đã thoát trình chiếu'); }
    if ((el = on('tr[data-tw]'))) { state.open[el.dataset.tw] = !state.open[el.dataset.tw]; return state.view === 'forecast' ? renderFcTable(fcData()) : RENDER.reports(); }
    if ((el = on('tr[data-rm], .rmrow'))) return openRm(+el.dataset.rm, el.classList.contains('rmrow') ? el : null);
    if ((el = on('[data-open-c]'))) return openProfile(+el.dataset.openC);
    if ((el = on('.kcard, .ap, .dayrow, tr[data-c]'))) return openProfile(+el.dataset.c, el.classList.contains('kcard') ? el : null);
    if ((el = on('[data-set-i]'))) { state.set = el.dataset.setI; return RENDER.settings(); }
    if ((el = on('[data-go]'))) return go(el.dataset.go);
    if ((el = on('[data-see]'))) return see(el.dataset.see);
    if ((el = on('[data-spot]'))) return spot(el.dataset.spot, IDEAS.find((x) => x.no === el.dataset.spot).at.spot);
    if ((el = on('#xl-tabs button'))) {
      $$('#xl-tabs button').forEach((b) => b.classList.toggle('on', b === el));
      $$('.xl-sheet').forEach((s) => { s.hidden = s.dataset.sheet !== el.dataset.sheet; if (!s.hidden) { $('#xl-cell').textContent = s.dataset.cell; $('#xl-fx').textContent = s.dataset.fx; } });
      return;
    }
    if ((el = on('#lab-run'))) { const lab = $('#lab'); lab.style.setProperty('--run', $('.track', lab).clientWidth - 6 + 'px'); return lab.classList.toggle('go'); }
    if ((el = on('#pick-copy'))) {
      const list = updatePick(), text = `Chọn ${list.length} ý (bảng vòng 2): ${list.join(', ')}`;
      return navigator.clipboard.writeText(text).then(() => { el.textContent = 'Đã chép, dán vào chat'; setTimeout(() => { el.textContent = 'Chép danh sách'; }, 2200); }, () => prompt('Chép dòng này rồi dán vào chat:', text));
    }
    if (!on('.float, .scrim, .ql, .find, .sug')) closeFloats();
    if (on('.scrim')) closeFloats();
  });
  document.addEventListener('mouseover', (e) => { const el = e.target.closest('[data-spot]'); if (el) spot(el.dataset.spot, IDEAS.find((x) => x.no === el.dataset.spot).at.spot); });
  document.addEventListener('change', (e) => {
    const el = e.target.closest('[data-pick]');
    if (!el) return;
    picked[el.checked ? 'add' : 'delete'](el.dataset.pick);
    el.closest('.irow').classList.toggle('picked', el.checked);
    updatePick();
  });
  $('#pal-q').addEventListener('input', renderPal);
  $('#pal-q').addEventListener('keydown', (e) => {
    const opts = $$('#pal-list .opt[data-run]'), at = opts.findIndex((o) => o.classList.contains('sel'));
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!opts.length) return;
      const next = (at + (e.key === 'ArrowDown' ? 1 : -1) + opts.length) % opts.length;
      opts.forEach((o, i) => o.classList.toggle('sel', i === next));
      opts[next].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && opts[at]) runPal(+opts[at].dataset.run);
  });
  const cuQ = $('#cu-q'), rmQ = $('#rm-q');
  const clear = (input) => { input.value = ''; input.dispatchEvent(new Event('input')); };
  cuQ.addEventListener('input', () => suggest(cuQ, $('#cu-sug'), cusItems(), (i) => { clear(cuQ); openProfile(i, $(`.kcard[data-c="${i}"]`)); }, (ids, q) => {
    $('#kan').classList.toggle('finding', !!ids);
    $$('.kcard').forEach((k) => {
      const c = CUS[+k.dataset.c], h = ids && ids.has(c.i) ? hit(c.name, q) : null;
      k.classList.toggle('hit', !!h);
      $('.nm', k).innerHTML = h ? h.html : c.name;
    });
  }));
  cuQ.addEventListener('keydown', (e) => sugKeys(e, cuQ, $('#cu-sug')));
  rmQ.addEventListener('input', () => suggest(rmQ, $('#rm-sug'), rmItems(), (i) => { clear(rmQ); openRm(i, $(`.rmrow[data-rm="${i}"]`)); }, (ids) => {
    $$('.rmrow').forEach((r) => r.classList.toggle('dim', !!ids && !ids.has(+r.dataset.rm)));
  }));
  rmQ.addEventListener('keydown', (e) => sugKeys(e, rmQ, $('#rm-sug')));
  // Quick Look follows the card under the pointer (or the focused one) while it is open
  let hovered = null;
  document.addEventListener('mouseover', (e) => {
    const k = e.target.closest('.kcard');
    if (!k || k === hovered) return;
    hovered = k;
    if ($('#ql').classList.contains('on')) quickLook(CUS[+k.dataset.c]);
  });
  document.addEventListener('focusin', (e) => { if ($('#ql').classList.contains('on') && e.target.classList.contains('kcard')) quickLook(CUS[+e.target.dataset.c]); });
  document.addEventListener('keyup', (e) => { if (e.key === ' ' && e.target.classList.contains('kcard')) e.preventDefault(); });
  document.addEventListener('keydown', (e) => {
    const mod = e.ctrlKey || e.metaKey, k = e.key.toLowerCase();
    if (mod && k === 'k') { e.preventDefault(); return $('#pal').classList.contains('on') ? closeFloats() : openPal(); }
    if (mod && k === 'z' && state.undo) { e.preventDefault(); return undo(); }
    if (mod && k === 'f' && (state.view === 'customers' || state.view === 'team')) { e.preventDefault(); return (state.view === 'customers' ? cuQ : rmQ).focus({ preventScroll: true }); }
    if (mod && /^[1-6,]$/.test(k) && !e.shiftKey && !e.altKey) { const n = NAV.find((x) => x[3] === k); if (n) { e.preventDefault(); return go(n[0]); } }
    if (k === 'escape') { $('#win').classList.remove('present'); return closeFloats(); }
    if (e.key === ' ' && state.view === 'customers' && e.target.tagName !== 'INPUT') {
      const card = document.activeElement.classList.contains('kcard') ? document.activeElement : hovered;
      if (!card) return;
      e.preventDefault();
      return $('#ql').classList.contains('on') ? $('#ql').classList.remove('on') : quickLook(CUS[+card.dataset.c]);
    }
  });

  /* ---------- Start ---------- */
  // The window follows the viewport, between the app's minimum size and its design size, and is
  // scaled only below the minimum. Everything measured in pixels is measured again afterwards.
  function fit() {
    const st = $('#stage'), win = root.dataset.os === 'win';
    const availW = st.clientWidth - 56, availH = st.clientHeight - (win ? 14 : 28) - 78 - 20;
    const ww = Math.max(1100, Math.min(1440, availW)), wh = Math.max(700, Math.min(900, availH));
    st.style.setProperty('--ww', ww + 'px');
    st.style.setProperty('--wh', wh + 'px');
    st.style.setProperty('--fit', Math.min(1, availW / ww, availH / wh).toFixed(4));
    thumbs(false);
    navPill();
    if (state.view === 'overview') drawChart(scopeData(state.scope), false);
  }
  let fitRaf;
  addEventListener('resize', () => { cancelAnimationFrame(fitRaf); fitRaf = requestAnimationFrame(fit); });
  document.addEventListener('fullscreenchange', fit);
  $('#nav').insertAdjacentHTML('afterbegin', '<i class="nav-pill" id="nav-pill"></i>');
  $('#now').innerHTML = NOW_IDLE;
  buildMenus();
  renderIdeas();
  renderKan();
  fit();
  go('overview');
  thumbs(false);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { thumbs(false); navPill(); });
  // The sections of the board rise as they scroll into view
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    }), { rootMargin: '0px 0px -8% 0px' });
    $$('.sec > .kicker, .sec > h2, .sec > .lead, .pr, .bcard, .xl-win, .asks li').forEach((el) => {
      el.style.setProperty('--i', el.matches('.pr, .asks li') ? [...el.parentElement.children].indexOf(el) % 3 : 0);
      el.classList.add('reveal');
      io.observe(el);
    });
  }
})();
