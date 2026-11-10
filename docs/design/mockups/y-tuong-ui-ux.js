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
  const MSPLIT = [[300, 180, 100], [220, 140, 80], [120, 100, 80]]; // month forecast by stage N1, N2, N3, per team
  const MGRID = [ // the later weeks of the month per team: 16–21/11, 23–28/11, 30/11
    [[30, 20, 30, 10, 40, 10], [20, 10, 30, 20, 30, 10], [60]],
    [[20, 10, 20, 10, 30, 10], [20, 10, 20, 10, 20, 10], [40]],
    [[10, 10, 20, 10, 10, 0], [10, 10, 10, 10, 20, 10], [20]],
  ];
  const CUR = [0, 150, 290, 470, 640, 830, 960, 960, 1180, 1380]; // cumulative sales, 01/11 … 10/11
  const GHOST = [[1, 90], [2, 230], [3, 300], [4, 300], [5, 480], [6, 640], [7, 800], [8, 960], [9, 1100], [10, 1228], [14, 1600], [17, 1980], [21, 2350], [24, 2640], [28, 2960], [31, 3180]];

  const state = { view: 'overview', scope: 'all', fc: 'week', rp: 'brief', lg: 'result', cust: 7, rm: 0, set: 'data', open: {}, cancel: {}, undo: null };
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
  // "Đếm": a number runs to its new value
  function count(el, to, d = 0, unit = '') {
    const from = el.dataset.unit === unit ? parseFloat(el.dataset.cur || '0') : 0;
    el.dataset.cur = to;
    el.dataset.unit = unit;
    cancelAnimationFrame(el._raf);
    clearTimeout(el._end);
    if (reduce || from === to) { el.textContent = nf(to, d); return; }
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / 700);
      el.textContent = nf(from + (to - from) * (1 - (1 - p) ** 4), d);
      if (p < 1) el._raf = requestAnimationFrame(tick);
    };
    el._raf = requestAnimationFrame(tick);
    el._end = setTimeout(() => { cancelAnimationFrame(el._raf); el.textContent = nf(to, d); }, 800);
  }

  /* ---------- Chrome + navigation ---------- */
  const VIEWS = {
    overview: { nav: 'overview', title: 'Tổng quan', sub: () => `Tháng 11/2026 · 01/11 – 10/11 (MTD) · ${scopeName()}`, act: ['plus', 'Lịch hẹn'], scope: 1, period: 1, ideas: ['01', '02', '05', '09', '11', '12', '14', '15', '16'] },
    forecast: { nav: 'forecast', title: 'Forecast', sub: () => `Hôm nay thứ Ba 10/11/2026 · ${scopeName()}`, act: ['export', 'Xuất Excel'], scope: 1, ideas: ['17', '18', '19', '20', '29'] },
    reports: { nav: 'reports', title: 'Báo cáo', sub: () => 'Tháng 11/2026 · 01/11 – 10/11 (MTD) · Toàn bộ', act: ['export', 'Xuất Excel'], period: 1, ideas: ['21', '22', '23', '24', '11'] },
    customers: { nav: 'customers', title: 'Khách hàng', sub: () => 'Kanban theo nhóm · Toàn bộ', act: ['plus', 'Khách hàng'], ideas: ['25', '26', '07'] },
    profile: { nav: 'customers', title: 'Hồ sơ khách hàng', sub: () => CUS[state.cust].code, act: ['plus', 'Lịch hẹn'], ideas: ['07', '28'] },
    team: { nav: 'team', title: 'Team & nhân sự', sub: () => '3 team · 9 RM', act: ['plus', 'Nhân sự'], ideas: ['27', '07'] },
    rm: { nav: 'team', title: 'Trang RM', sub: () => 'Team ' + TEAMS[RMS[state.rm].team].name, ideas: ['27'] },
    appointments: { nav: 'appointments', title: 'Lịch hẹn', sub: () => 'Hôm nay · Toàn bộ', act: ['plus', 'Lịch hẹn'], ideas: ['11'] },
    settings: { nav: 'settings', title: 'Cài đặt', sub: () => 'Dữ liệu · AI · Thùng rác', ideas: ['29'] },
  };
  const NAV = [['overview', 'Tổng quan', 'overview', '1'], ['appointments', 'Lịch hẹn', 'cal', '2'], ['customers', 'Khách hàng', 'people', '3'], ['forecast', 'Forecast', 'forecast', '4'], ['reports', 'Báo cáo', 'report', '5'], ['team', 'Team & nhân sự', 'team', '6'], ['settings', 'Cài đặt', 'gear', ',']];
  const RENDER = {};

  function chrome() {
    const v = VIEWS[state.view];
    $('#v-title').textContent = v.title;
    $('#v-sub').textContent = v.sub();
    $('#scope').hidden = !v.scope;
    $('#period').hidden = !v.period;
    $('#scope-l').textContent = state.scope === 'all' ? 'Toàn bộ' : TEAMS[state.scope].name;
    const act = $('#act');
    act.hidden = !v.act;
    if (v.act) act.innerHTML = ic(v.act[0]) + v.act[1];
  }
  // "Mở": opt.from grows into opt.to through a view transition; other changes just cross over
  function go(name, opt = {}) {
    if (!VIEWS[name]) return;
    closeFloats();
    const swap = () => {
      state.view = name;
      $$('.view').forEach((v) => v.classList.toggle('on', v.dataset.view === name));
      $$('#nav .nav-i').forEach((b) => b.classList.toggle('on', b.dataset.go === VIEWS[name].nav));
      chrome();
      if (RENDER[name]) RENDER[name]();
      onscreen();
      $(`.view[data-view="${name}"]`).scrollTop = 0;
    };
    if (opt.instant || reduce || !document.startViewTransition) return swap();
    if (opt.from) opt.from.style.viewTransitionName = 'morph';
    const vt = document.startViewTransition(() => {
      if (opt.from) opt.from.style.viewTransitionName = '';
      swap();
      if (opt.to) $(opt.to).style.viewTransitionName = 'morph';
    });
    vt.finished.catch(() => {}).finally(() => { if (opt.to) $(opt.to).style.viewTransitionName = ''; });
  }
  function setScope(sc) {
    state.scope = sc;
    if (sc !== 'all') { state.open['fc' + sc] = true; state.open['lg' + sc] = true; }
    chrome();
    if (RENDER[state.view]) RENDER[state.view]();
  }
  function setSwitch(key, val) {
    root.dataset[key] = val;
    $$(`.seg[data-set="${key}"] button`).forEach((b) => b.classList.toggle('on', b.dataset.v === val));
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
  const NOW_IDLE = '<span class="now-face"><span class="live"></span><b class="num">14:00</b>Trần Minh Huệ<span class="muted">· còn 25 phút</span></span>';
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
  function drawChart(d) {
    const W = 640, H = 112;
    const k = d.sales / 1380, kp = d.p.sales / 1228, fw = sum(d.fw);
    const max = Math.max(3180 * kp, d.sales + d.fm) * 1.12;
    const x = (day) => ((day - 1) / 30) * W, y = (v) => H - 4 - (v / max) * (H - 16);
    const path = (pts) => pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    const cur = CUR.map((v, i) => [x(i + 1), y(v * k)]);
    const proj = [[10, d.sales], [14, d.sales + fw], [30, d.sales + d.fm]].map(([day, v]) => [x(day), y(v)]);
    const ghost = GHOST.map(([day, v]) => [x(day), y(v * kp)]);
    const last = cur[cur.length - 1], end = proj[2];
    $('#ov-chart').innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
      <defs><linearGradient id="ov-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color: var(--accent); stop-opacity: 0.3" /><stop offset="1" style="stop-color: var(--accent); stop-opacity: 0" /></linearGradient></defs>
      <path class="ghost" d="${path(ghost)}" /><path class="area" d="${path(cur)} L${last[0].toFixed(1)} ${H} L0 ${H} Z" />
      <path class="line" d="${path(cur)}" /><path class="proj" d="${path(proj)}" /></svg>
      <span class="today" style="left: ${(last[0] / W) * 100}%; top: ${(last[1] / H) * 100}%"></span>
      <span class="pin" style="left: ${(end[0] / W) * 100}%; top: ${(end[1] / H) * 100}%">Dự kiến cuối tháng ${moneyS(d.sales + d.fm)}</span>`;
  }
  RENDER.overview = () => {
    const d = scopeData(state.scope), all = state.scope === 'all';
    const m = money(d.sales);
    $('#ov-lbl').textContent = `Doanh số · ${all ? 'toàn bộ' : 'team ' + TEAMS[state.scope].name} · tháng 11`;
    $('#ov-unit').textContent = m.u;
    count($('#ov-sales'), m.v, m.d, m.u);
    const g = ((d.sales - d.p.sales) / d.p.sales) * 100;
    const dl = $('#ov-delta');
    dl.className = 'delta ' + (g >= 0 ? 'up' : 'bad');
    dl.textContent = `${arrow(g)} ${nf(Math.abs(g), 1)}% so với 01/10 – 10/10`;
    $('#ov-eq').innerHTML = `FYP phát hành <b class="num">${moneyS(d.fi)}</b> − FYP hủy <b class="num">${moneyS(d.fc)}</b>`;
    drawChart(d);

    const cr = rate(d.cancelled, d.issued), dcr = cr - rate(d.p.cancelled, d.p.issued);
    const close = rate(d.issued, d.rf), fw = sum(d.fw);
    const byTeam = [0, 1, 2].map((t) => ({ t, d: scopeData(t) })).sort((a, b) => b.d.sales - a.d.sales);
    const hl = [
      dcr > 0
        ? { c: 'danger', i: 'alert', b: `Tỷ lệ hủy ${pctS(cr)}, tăng ${nf(dcr, 1)} điểm`, s: `${d.cancelled} HĐ hủy trong kỳ, ${d.cancelled > 1 ? 'đều ' : ''}ở tuần 03 – 09/11`, go: 'reports' }
        : { c: 'ok', i: 'check', b: `Tỷ lệ hủy ${pctS(cr)}, giảm ${nf(-dcr, 1)} điểm`, s: 'Không có HĐ hủy trong kỳ', go: 'reports' },
      all
        ? { c: 'accent', i: 'star', b: `${TEAMS[byTeam[0].t].name} dẫn đầu: ${moneyS(byTeam[0].d.sales)}`, s: `${nf((byTeam[0].d.sales / d.sales) * 100)}% doanh số · tỉ lệ chốt ${pctS(rate(byTeam[0].d.issued, byTeam[0].d.rf))}`, go: 'reports' }
        : { c: 'accent', i: 'star', b: `Đứng thứ ${byTeam.findIndex((x) => x.t === state.scope) + 1} / 3 về doanh số`, s: `${nf((d.sales / 1380) * 100)}% doanh số toàn bộ · tỉ lệ chốt ${pctS(close)}`, go: 'reports' },
      { c: 'warn', i: 'clock', b: `${d.appt[2]} buổi chưa ghi kết quả`, s: all ? 'Sao Mai 5 · Hừng Đông 4 · Bình Minh 3' : 'Ghi kết quả để chỉ số của kỳ đủ', go: 'appointments' },
      { c: 'info', i: 'forecast', b: `Tuần này dự kiến ${moneyS(fw)}`, s: `N1 chiếm ${nf((d.fw[0] / fw) * 100)}% · từ nay tới cuối tháng ${moneyS(d.fm)}`, go: 'forecast' },
    ];
    $('#ov-hl').innerHTML = hl.map((h) => `<button class="hl-i" data-go="${h.go}" style="--c: var(--${h.c})"><span class="gl">${ic(h.i)}</span><span><b>${h.b}</b><span>${h.s}</span></span>${ic('chev', 'go')}</button>`).join('');

    const diff = (now, was, unit = '') => { const v = now - was; return { f: `${arrow(v)} ${nf(Math.abs(v))}${unit} so với kỳ trước`, c: v > 0 ? 'up' : v < 0 ? 'bad' : '' }; };
    const cs = money(d.cs), csG = ((d.cs - d.p.cs) / d.p.cs) * 100;
    const tiles = [
      { l: 'Tổng số HĐ', v: d.total, d: 0, f: `${d.issued} phát hành − ${d.cancelled} hủy` },
      { l: 'Tỷ lệ hủy', v: cr, d: 1, u: '%', f: `${arrow(dcr)} ${nf(Math.abs(dcr), 1)} điểm · ${d.cancelled} ÷ ${d.issued}`, c: dcr > 0 ? 'bad' : dcr < 0 ? 'up' : '' },
      { l: 'Tỉ lệ chốt', v: close, d: 1, u: '%', f: `${d.issued} HĐ ÷ ${d.rf} RF` },
      { l: 'Chuyển RF', v: d.rf, d: 0, ...diff(d.rf, d.p.rf) },
      { l: 'HĐ nộp', v: d.sub, d: 0, ...diff(d.sub, d.p.sub) },
      { l: 'Case size', v: cs.v, d: cs.d, u: cs.u, f: `${arrow(csG)} ${nf(Math.abs(csG), 1)}% so với kỳ trước`, c: csG > 0 ? 'up' : 'bad' },
    ];
    const box = $('#ov-tiles');
    if (!box.children.length) box.innerHTML = tiles.map(() => '<button class="card tile rise" data-go="reports" style="--i: 2"><span class="lbl"></span><span class="v"><span class="n">0</span><small></small></span><span class="f"></span></button>').join('');
    tiles.forEach((t, i) => {
      const el = box.children[i];
      $('.lbl', el).textContent = t.l;
      $('small', el).textContent = t.u || '';
      count($('.n', el), t.v, t.d, t.u || '');
      const f = $('.f', el);
      f.textContent = t.f;
      f.className = 'f ' + (t.c || '');
    });

    const [met, missed, unrec, exp] = d.appt, apptAll = sum(d.appt);
    $('#ov-appt-sub').textContent = `${nf(met)} / ${nf(apptAll)} đã gặp`;
    const seg = [['Đã gặp', met, 'ok'], ['Dời · hủy · không đến', missed, 'text-3'], ['Chưa ghi kết quả', unrec, 'warn'], ['Dự kiến', exp, 'info']];
    $('#ov-appt').innerHTML = seg.map(([, v, c]) => `<i style="--f: ${v}; --c: var(--${c})"></i>`).join('');
    $('#ov-appt-keys').innerHTML = seg.map(([l, v, c]) => `<span><i style="--c: var(--${c})"></i>${l} <b class="num">${nf(v)}</b></span>`).join('');
    const kh = ['n4', 'n3', 'n2', 'n1'].map((s, i) => [s, d.kh[i]]);
    const khMax = Math.max(...kh.map((x) => x[1]));
    $('#ov-pipe-sub').textContent = `${nf(sum(d.kh))} KH đang mở`;
    $('#ov-pipe').innerHTML = kh.map(([s, v], i) => `<span class="st ${s}">${STAGE[s]}</span><span class="hbar ${s}" style="--i: ${i}"><i style="--w: ${(v / khMax).toFixed(3)}"></i></span><span class="v num">${nf(v)}</span>`).join('');
    $('#ov-race').innerHTML = byTeam.map(({ t, d: x }, i) => `<button class="race" data-team="${t}" aria-pressed="${state.scope === t}"><b>${TEAMS[t].name}</b><span class="hbar" style="--i: ${i}"><i style="--w: ${(x.sales / byTeam[0].d.sales).toFixed(3)}"></i></span><span class="v num">${moneyS(x.sales)}</span><span class="sub">${x.total} HĐ · hủy ${pctS(rate(x.cancelled, x.issued))} · chốt ${pctS(rate(x.issued, x.rf))}</span></button>`).join('');
  };

  /* ---------- Forecast ---------- */
  function fcData() {
    const teams = scopeTeams();
    const ap = APPTS.filter((a) => teams.includes(RMS[a.c.rm].team));
    const counted = ap.filter((a) => !a.flag);
    const fw = ST3.map((s) => sum(counted.filter((a) => a.c.st === s), (a) => a.amt));
    const ms = teams.reduce((acc, t) => addV(acc, MSPLIT[t]), [0, 0, 0]);
    const sales = sum(RMS.filter((r) => teams.includes(r.team)), (r) => r.fi - r.fc);
    return { teams, ap, counted, fw, week: sum(fw), ms, month: sum(ms), sales, miss: ap.filter((a) => a.flag === 'miss') };
  }
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
      h += line('team' + (open ? ' open' : ''), `data-tw="fc${x.t}"`, `<span class="tw">${ic('chev')}</span>${TEAMS[x.t].name}`, x, x.fm);
      if (open) h += x.rms.map((y) => line('rm link', `data-rm="${y.r.i}"`, 'RM ' + y.r.name, y, y.r.fm)).join('');
    }
    if (teams.length > 1) h += line('total', '', 'Tổng', { fw: f.fw, n: f.ap.length, miss: 0 }, f.month);
    $('#fc-tbl').innerHTML = h + '</tbody>';
  }
  RENDER.forecast = () => {
    const f = fcData(), wk = state.fc === 'week';
    $$('#fc-seg button').forEach((b) => b.classList.toggle('on', b.dataset.fc === state.fc));
    const m = money(wk ? f.week : f.month), split = wk ? f.fw : f.ms;
    $('#fc-lbl').textContent = wk ? 'Dự kiến tuần này' : 'Dự kiến tháng 11, từ hôm nay';
    $('#fc-unit').textContent = m.u;
    count($('#fc-num'), m.v, m.d, m.u);
    const nKh = new Set(f.counted.map((a) => a.c.i)).size;
    $('#fc-sub').textContent = wk
      ? `${nKh} KH · ${f.ap.length} lịch hẹn` + (f.miss.length ? ` · ${f.miss.length} lịch thiếu case size chưa tính` : '')
      : '10/11 – 30/11 · thứ Hai → thứ Bảy, không tính Chủ Nhật 15, 22, 29';
    $('#fc-split').innerHTML = split.map((v, i) => `<i style="--f: ${v || 0.001}; --c: var(--${ST3[i]})"></i>`).join('');
    $('#fc-keys').innerHTML = split.map((v, i) => `<span><i style="--c: var(--${ST3[i]})"></i>${STAGE[ST3[i]]} <b class="num">${moneyS(v)}</b></span>`).join('');
    const miss = $('#fc-miss');
    miss.hidden = !f.miss.length;
    miss.innerHTML = `${ic('alert')}${f.miss.length} lịch thiếu case size · điền ngay`;

    const rest = f.month - f.week;
    $('.runway').innerHTML = `<h3>Đường băng tháng 11 <small>đã đạt + dự kiến</small><span class="sum">về đích <b class="num">${moneyS(f.sales + f.month)}</b></span></h3>
      <div class="stack"><i style="--f: ${f.sales}; --c: var(--accent)"></i>${f.fw.map((v, i) => `<i style="--f: ${v || 0.001}; --c: var(--${ST3[i]})"></i>`).join('')}<i class="hatch" style="--f: ${rest}"></i></div>
      <div class="keys"><span><i style="--c: var(--accent)"></i>Đã đạt <b class="num">${moneyS(f.sales)}</b></span>${f.fw.map((v, i) => `<span><i style="--c: var(--${ST3[i]})"></i>${i ? '' : 'Tuần này '}${STAGE[ST3[i]]} <b class="num">${moneyS(v)}</b></span>`).join('')}<span><i style="--c: var(--accent); opacity: 0.5"></i>Các tuần còn lại <b class="num">${moneyS(rest)}</b></span></div>
      <p class="note">Đã đạt là doanh số thuần (FYP phát hành − FYP hủy). Phần dự kiến cộng thẳng case size của từng lịch, không nhân tỷ lệ chốt.</p>`;

    const dayAmt = (day) => sum(f.counted.filter((a) => a.day === day), (a) => a.amt);
    if (wk) {
      $('#fc-strip-h').innerHTML = 'Tuần này theo ngày <small>cột vàng là hôm nay · mỗi thẻ là một lịch hẹn · KH có hai lịch chỉ tính lịch sau</small>';
      $('#fc-strip').innerHTML = '<div class="days">' + DAYS.map(([l, dt], day) => {
        const list = f.ap.filter((a) => a.day === day);
        const chips = list.map((a) => `<button class="ap ${a.c.st} ${a.flag || ''}" data-c="${a.c.i}"><b>${a.c.name}</b><span class="num">${a.flag === 'miss' ? 'thiếu case size' : a.flag === 'dup' ? 'đã tính ở lịch T6' : a.t + ' · ' + a.amt + ' tr'}</span></button>`).join('');
        return `<div class="day ${day === 0 ? 'past' : day === 1 ? 'today' : ''}"><header><span><b>${l}</b> ${dt}</span><span class="sum num">${day === 0 ? 'đã qua' : dayAmt(day) ? dayAmt(day) + ' tr' : '—'}</span></header>${chips}</div>`;
      }).join('') + '</div>';
    } else {
      const later = [0, 1, 2].map((w) => f.teams.reduce((acc, t) => addV(acc, MGRID[t][w]), MGRID[0][w].map(() => 0)));
      const rows = [['10 – 14/11', [null, 1, 2, 3, 4, 5].map((day) => (day ? dayAmt(day) : null)), 'đã qua'], ['16 – 21/11', later[0]], ['23 – 28/11', later[1]], ['30/11', [later[2][0], null, null, null, null, null], 'tháng 12']];
      const dayN = (day) => f.counted.filter((a) => a.day === day).length;
      const c = (v, off, today, n) => (v == null ? `<div class="c off">${off}</div>` : `<div class="c ${today ? 'today' : ''}" style="--heat: ${Math.min(0.34, (v / 200) * 0.34).toFixed(3)}"><b class="num">${v ? v + ' tr' : '—'}</b><small>${v ? (n || Math.max(1, Math.round(v / 38))) + ' lịch' : '&nbsp;'}</small></div>`);
      $('#fc-strip-h').innerHTML = 'Tháng 11 theo tuần <small>thứ Hai → thứ Bảy; không có cột Chủ Nhật</small>';
      $('#fc-strip').innerHTML = '<div class="grid-m"><span></span>' + DAYS.map(([l]) => `<span class="h">${l}</span>`).join('') + '<span class="h">Cả tuần</span>'
        + rows.map(([label, vals, off], r) => `<span class="wk num">${label}</span>` + vals.map((v, i) => c(v, off, r === 0 && i === 1, r === 0 ? dayN(i) : 0)).join('') + `<span class="tot num">${moneyS(sum(vals, (v) => v || 0))}</span>`).join('') + '</div>';
    }
    renderFcTable(f);
  };
  function openMiss() {
    const f = fcData(), pop = $('#miss-pop');
    pop.innerHTML = '<h3 class="sec-h">Lịch thiếu case size <small>điền xong là cộng ngay vào Forecast</small></h3>' + f.miss.map((a) => `<div class="r"><span class="t"><b>${a.c.name}</b> <span class="st ${a.c.st}">${STAGE[a.c.st]}</span><small>${DAYS[a.day][0]} ${DAYS[a.day][1]} · ${a.t} · RM ${RMS[a.c.rm].name}</small></span><span class="fill-in"><input class="num" type="text" inputmode="numeric" value="40" aria-label="Case size dự kiến của ${a.c.name}" /> tr</span><button class="btn" data-fill="${a.i}">Lưu</button></div>`).join('');
    openFloat('miss-pop');
    place(pop, $('#fc-miss'), 'right');
  }
  function fillCase(i, v) {
    const a = APPTS[i], r = RMS[a.c.rm], st = ST3.indexOf(a.c.st);
    a.flag = undefined;
    a.amt = v;
    a.c.cs = v;
    r.fm += v;
    MSPLIT[r.team][st] += v;
    closeFloats();
    RENDER.forecast();
    toast(`Đã thêm ${v} tr của ${a.c.name} vào Forecast`, () => {
      a.flag = 'miss';
      a.amt = 0;
      a.c.cs = null;
      r.fm -= v;
      MSPLIT[r.team][st] -= v;
      if (state.view === 'forecast') RENDER.forecast();
    });
  }

  /* ---------- Báo cáo ---------- */
  const LEDGER = {
    result: {
      cols: ['HĐ phát hành', 'HĐ hủy', 'Tổng số HĐ', 'FYP phát hành', 'FYP hủy', 'Doanh số', 'Tỷ lệ hủy', 'Tỉ lệ chốt'],
      row: (d, max) => {
        const cr = rate(d.cancelled, d.issued);
        return [`<td>${d.issued}</td>`, d.cancelled ? `<td>${d.cancelled}</td>` : '<td class="zero">0</td>', `<td>${d.issued - d.cancelled}</td>`, `<td>${moneyS(d.fi)}</td>`, cell(d.fc),
          max ? `<td class="bar" style="--w: ${((d.fi - d.fc) / max).toFixed(3)}"><span>${moneyS(d.fi - d.fc)}</span></td>` : `<td>${moneyS(d.fi - d.fc)}</td>`,
          `<td class="${cr >= 10 ? 'hot' : cr ? '' : 'zero'}">${pctS(cr)}</td>`, `<td>${pctS(rate(d.issued, d.rf))}</td>`].join('');
      },
    },
    appt: { cols: ['Đã gặp', 'Dời · hủy · không đến', 'Chưa ghi kết quả', 'Dự kiến', 'Tổng lịch'], row: (d) => [...d.appt, sum(d.appt)].map((v) => `<td>${nf(v)}</td>`).join('') },
    kh: { cols: ['N4', 'N3', 'N2', 'N1', 'KH đang mở'], row: (d) => [...d.kh, sum(d.kh)].map((v) => `<td>${nf(v)}</td>`).join('') },
  };
  function ledgerHtml(tab, flat) {
    const L = LEDGER[tab], teams = [0, 1, 2].map((t) => ({ t, d: agg(teamRms(t)) }));
    const max = Math.max(...teams.map((x) => x.d.fi - x.d.fc));
    let h = `<thead><tr><th>${flat ? 'Team' : 'Team / RM'}</th>${L.cols.map((c) => `<th>${c}</th>`).join('')}</tr></thead><tbody>`;
    for (const { t, d } of teams) {
      const open = !flat && !!state.open['lg' + t];
      h += `<tr class="${flat ? '' : 'team'}${open ? ' open' : ''}" ${flat ? '' : `data-tw="lg${t}"`}><td>${flat ? '' : `<span class="tw">${ic('chev')}</span>`}${TEAMS[t].name}</td>${L.row(d, max)}</tr>`;
      if (open) h += teamRms(t).map((r) => `<tr class="rm link" data-rm="${r.i}"><td>RM ${r.name}</td>${L.row(r, max)}</tr>`).join('');
    }
    return h + `<tr class="total"><td>Tổng</td>${L.row(agg(RMS), 0)}</tr></tbody>`;
  }
  RENDER.reports = () => {
    const brief = state.rp === 'brief';
    $('#paper').hidden = !brief;
    $('#ledger').hidden = brief;
    $('#rp-print').hidden = !brief;
    $('#rp-hint').textContent = brief
      ? 'Một trang đọc trong 10 giây. In ra, xuất PDF và sheet đầu của file Excel giống hệt trang này.'
      : 'Mỗi tab trả lời một câu hỏi, vừa một màn, không cuộn ngang. Bấm một team để mở các RM.';
    $$('#rp-seg button').forEach((b) => b.classList.toggle('on', b.dataset.rp === state.rp));
    $$('#lg-tabs button').forEach((b) => b.classList.toggle('on', b.dataset.lg === state.lg));
    $('#lg-tbl').innerHTML = ledgerHtml(state.lg, false);
    if (!$('#paper-tbl').innerHTML) {
      $('#paper-tbl').innerHTML = ledgerHtml('result', true);
      const teams = [0, 1, 2].map((t) => agg(teamRms(t)));
      $('#paper-bars').innerHTML = teams.map((d, t) => `<div class="tbar"><b>${TEAMS[t].name}</b><div class="stack"><i style="--f: ${d.fi - d.fc}; --c: var(--accent)"></i>${d.fc ? `<i class="cut" style="--f: ${d.fc}"></i>` : ''}<i style="--f: ${570 - d.fi + 0.001}; --c: transparent"></i></div><span class="v num">${moneyS(d.fi - d.fc)}</span></div>`).join('');
    }
  };

  /* ---------- Khách hàng, hồ sơ, hủy HĐ ---------- */
  function renderKan() {
    $('#kan').innerHTML = ['n4', 'n3', 'n2', 'n1'].map((s) => {
      const list = CUS.filter((c) => c.st === s).slice(0, 5);
      return `<div class="kcol"><header><span class="st ${s}">${STAGE[s]}</span><span class="num muted">${KH_ALL[s]}</span></header>`
        + list.map((c) => `<button class="kcard" data-c="${c.i}"><b><span class="nm">${c.name}</span>${c.pol ? `<span class="chip ok">${c.pol} HĐ</span>` : ''}</b><span>RM ${RMS[c.rm].name} · ${TEAMS[RMS[c.rm].team].name}</span>${c.next ? `<span class="nx num">Lịch ${c.next}${c.cs ? ' · ' + c.cs + ' tr' : ''}</span>` : ''}</button>`).join('')
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
    state.cust = i;
    go('profile', { from, to: '#pf-head' });
  }
  RENDER.profile = () => {
    const c = CUS[state.cust], r = RMS[c.rm];
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
  RENDER.team = () => {
    if ($('#teams').children.length) return;
    $('#teams').innerHTML = [0, 1, 2].map((t) => {
      const d = scopeData(t);
      return `<section class="card tcard rise" style="--i: ${t}"><header><b>${TEAMS[t].name}</b><span>TL ${TEAMS[t].tl}</span></header><p class="sum num">Doanh số ${moneyS(d.sales)} · ${d.total} HĐ · Forecast tuần ${moneyS(sum(d.fw))}</p>`
        + teamRms(t).map((r) => `<button class="rmrow" data-rm="${r.i}"><span class="av">${initials(r.name)}</span><span><b>${r.name}</b><small class="num">${sum(r.kh)} KH · Forecast tuần ${moneyS(sum(fwOf((c) => c.rm === r.i)))}</small></span><span class="v num">${moneyS(r.fi - r.fc)}</span></button>`).join('') + '</section>';
    }).join('');
  };
  function openRm(i, from) {
    state.rm = i;
    go('rm', { from, to: '#rm-head' });
  }
  RENDER.rm = () => {
    const r = RMS[state.rm], list = CUS.filter((c) => c.rm === r.i).sort((a, b) => a.st.localeCompare(b.st));
    $('#rm-head').innerHTML = `<span class="av lg">${initials(r.name)}</span><div><h3>${r.name} <span class="chip">RM</span></h3><p>Team ${TEAMS[r.team].name} · TL ${TEAMS[r.team].tl}</p></div>
      <div class="stats num"><div><span>Doanh số tháng 11</span><b>${moneyS(r.fi - r.fc)}</b></div><div><span>Tổng số HĐ</span><b>${r.issued - r.cancelled}</b></div><div><span>Tỷ lệ hủy</span><b>${pctS(rate(r.cancelled, r.issued))}</b></div><div><span>Tỉ lệ chốt</span><b>${pctS(rate(r.issued, r.rf))}</b></div><div><span>Forecast tuần</span><b>${moneyS(sum(fwOf((c) => c.rm === r.i)))}</b></div></div>`;
    $('#rm-count').innerHTML = `${sum(r.kh)} KH đang mở · bản concept hiện ${list.length} KH mẫu<span class="legend">${cadHtml('m')} đã gặp</span><span class="legend">${cadHtml('x')} dời, hủy, không đến</span><span class="legend">${cadHtml('s')} có lịch tuần này</span>`;
    $('#rm-tbl').innerHTML = '<thead><tr><th>Khách hàng</th><th class="l">Nhóm</th><th class="l">Nhịp gặp · 8 tuần</th><th>Gặp gần nhất</th><th>Lịch sắp tới</th><th>Case size dự kiến</th><th>HĐ</th></tr></thead><tbody>'
      + list.map((c) => `<tr class="rm link" data-c="${c.i}"><td style="padding-left: 10px; color: var(--text)"><b>${c.name}</b></td><td class="l"><span class="st ${c.st}">${STAGE[c.st]}</span></td><td class="l">${cadHtml(c.cad)}</td><td>${c.last || '—'}</td><td>${c.next || '—'}</td><td>${c.cs ? c.cs + ' tr' : '—'}</td><td>${c.pol || '—'}</td></tr>`).join('') + '</tbody>';
  };
  RENDER.appointments = () => { $('#ag-today').innerHTML = agendaHtml(); };
  const SETTINGS = {
    data: ['Dữ liệu', [
      [['File dữ liệu', '<span class="k-win">Project2C-data\\ cạnh file exe</span><span class="k-mac">~/Library/Application Support/dev.alexh.project2c/</span>'], ['Bản sao lưu gần nhất', '<span>Hôm nay 12:10</span>']],
      [['Sao lưu ngay', '<button class="btn ghost" data-job="backup">Sao lưu</button>'], ['Khôi phục từ file sao lưu', '<button class="btn ghost">Chọn file…</button>'], ['Mở thư mục dữ liệu', '<span class="k-win">trong Explorer</span><span class="k-mac">trong Finder</span>']],
    ]],
    ai: ['AI', [
      [['Nhà cung cấp', '<span>OpenCode</span>'], ['API key', '<span class="k-win">lưu trong Credential Manager của Windows</span><span class="k-mac">lưu trong Keychain của macOS</span>'], ['Phiên bản prompt', '<span class="num">analysis@6 · discovery@6</span>']],
    ]],
    trash: ['Thùng rác', [
      [['Bản ghi trong Thùng rác', '<span class="num">12</span>'], ['Dọn sạch Thùng rác', '<button class="btn ghost">Dọn…</button>']],
    ]],
  };
  RENDER.settings = () => {
    const [title, groups] = SETTINGS[state.set];
    $$('#set-nav .set-i').forEach((b) => b.classList.toggle('on', b.dataset.setI === state.set));
    $('#set-pane').innerHTML = `<h3>${title}</h3>` + groups.map((g, i) => `<div class="card group rise" style="--i: ${i}">${g.map(([l, r]) => `<div class="r"><b>${l}</b>${r.startsWith('<button') ? '<span></span>' + r : r}</div>`).join('')}</div>`).join('');
  };

  /* ---------- Floats: palette, sheet, popovers ---------- */
  const FLOATS = ['pal', 'sheet', 'now-pop', 'scope-menu', 'miss-pop', 'go-menu'];
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
    pop.style.top = (a.bottom - host.top) / s + 8 + 'px';
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
    ['02', 'Vỏ và chất liệu', 'Mỗi hệ điều hành một chất', 'Cùng bố cục, khác chi tiết. macOS: thanh bên kính bo đồng tâm với cửa sổ, ba nút đỏ-vàng-xanh nằm trong thanh bên, nút điều khiển dạng viên, menu trên cùng. Windows 11: nền Mica, ô tìm trên thanh tiêu đề, vạch chọn bên trái, góc bo 8 px, nút cửa sổ bên phải.', 'Phát hành cùng lúc hai nền tảng: người dùng Mac thấy app Mac, người dùng Windows thấy app Windows. Đổi công tắc Nền tảng ở đầu trang để so.', 'M', [['Mac'], ['Win']], 1, { scroll: '.top', spot: '.seg[data-set="os"]' }],
    ['03', 'Vỏ và chất liệu', 'Chữ hệ thống, số có nhịp', 'Chữ giao diện dùng font của máy (SF Pro, Segoe UI Variable): mở app không chờ tải font, tiếng Việt đủ dấu. Số lớn khít và rõ; đơn vị (tỷ, tr, %) nhỏ và nhạt; cột số thẳng hàng.', 'Font hệ thống là cách rẻ nhất để app "giống app gốc". Đổi công tắc Chữ để so với Be Vietnam Pro.', 'S', [['đổi ADR-0013', 'gate']], 1, { scroll: '.top', spot: '.seg[data-set="font"]' }],
    ['04', 'Vỏ và chất liệu', 'Giao diện Sáng "Giấy"', 'Bộ màu sáng: nền giấy ngà, chữ xanh navy của logo, vàng champagne đậm hơn để đủ tương phản; tự theo cài đặt Sáng / Tối của máy.', 'Người dùng Mac hay để chế độ sáng ban ngày. Phải kiểm lại tương phản mọi màn, nên em đề xuất để sau v1.0; riêng bản in dùng giấy sáng ngay.', 'M–L', [['đổi ADR-0013', 'gate']], 0, { scroll: '.top', spot: '.seg[data-set="theme"]' }],
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
    ['19', 'Forecast', 'Lưới tháng không có Chủ Nhật', 'Mỗi tuần một hàng, sáu cột thứ Hai → thứ Bảy; ô đậm nhạt theo số tiền; ngày đã qua và ngày ngoài tháng gạch chéo.', 'Đúng định nghĩa Forecast tháng của anh; nhìn là hiểu vì sao không có Chủ Nhật 15, 22, 29.', 'S–M', [['D']], 1, { view: 'forecast', pre: () => { state.fc = 'month'; } }],
    ['20', 'Forecast', 'Bảng Team → RM, điền case size tại chỗ', 'Bấm một team để mở các RM; cột Tuần này có thanh. Lịch thiếu case size gom vào một nút: bấm, điền số, Forecast chạy theo ngay.', 'Forecast chỉ đúng khi đủ case size. Điền được ngay tại nơi phát hiện thiếu thì dữ liệu mới đầy.', 'M', [['D']], 1, { view: 'forecast' }],
    ['21', 'Báo cáo và Excel', 'Bản tin một trang', 'Báo cáo mở ra là một trang có đầu thư: một câu tóm tắt, bốn số chính, doanh số theo team, ba nhận xét, bảng gọn. Nút "Xem bản in" cho thấy đúng trang sẽ in hoặc xuất PDF.', 'Anh cần "đẳng cấp, chuyên nghiệp": người đọc là cấp trên, đọc trong 10 giây. Trang này gửi đi được ngay.', 'M', [['E']], 1, { view: 'reports', pre: () => { state.rp = 'brief'; } }],
    ['22', 'Báo cáo và Excel', 'Sổ số kiểu báo cáo tài chính', 'Ba tab Kết quả · Lịch hẹn · Khách hàng thay cho 17 cột cuộn ngang. Team gập mở RM. Số canh phải, tiêu đề một dòng, dòng Tổng có kẻ trên.', 'Bảng hiện tại phải cuộn ngang và tiêu đề gãy ba, bốn dòng. Chia theo câu hỏi thì mỗi bảng vừa một màn.', 'M', [['E'], ['B']], 1, { view: 'reports', pre: () => { state.rp = 'ledger'; state.open.lg0 = true; } }],
    ['23', 'Báo cáo và Excel', 'File Excel là bản in của Bản tin', 'Sheet Tóm tắt giống hệt Bản tin. Sheet sổ có nhóm gập Team ▸ RM, thanh dữ liệu của Excel, dòng Tổng là công thức. Sheet Forecast và sheet Định nghĩa đi kèm.', 'File gửi đi phải đẹp như làm tay và vẫn đúng khi người nhận sửa số. Mẫu ở mục File Excel bên dưới.', 'M', [['E'], ['D']], 1, { scroll: '#excel' }],
    ['24', 'Báo cáo và Excel', 'Trình chiếu', 'Một nút ẩn thanh bên và phóng trang báo cáo cho màn chiếu; Esc để thoát.', 'Báo cáo hay được mở trong họp. Rẻ, làm sau khi có Bản tin.', 'S', [['E']], 0, { view: 'reports', pre: () => { state.rp = 'brief'; } }],
    ['25', 'Khách hàng, RM, hợp đồng', 'Tìm là sáng', 'Ô tìm trên màn Khách hàng: thẻ khớp sáng lên, thẻ khác mờ đi chứ không biến mất; gợi ý dạng "KH – RM – Team", ↑ ↓ Enter để mở.', 'Giữ nguyên vị trí các cột nên vẫn thấy KH đang ở nhóm nào. Đúng ví dụ anh đưa: gõ "nguyen van hu".', 'S–M', [['C']], 1, { view: 'customers', post: () => { const q = $('#cu-q'); q.value = 'nguyen van hu'; q.dispatchEvent(new Event('input')); } }],
    ['26', 'Khách hàng, RM, hợp đồng', 'Xem nhanh bằng phím cách', 'Chọn một thẻ, nhấn Space: bảng kính hiện nhóm, RM, case size, lịch kế tiếp, HĐ, nhịp gặp. Nhấn lần nữa để đóng.', 'Như Quick Look của Finder: xem mà không rời danh sách.', 'M', [['Mac']], 0, { view: 'customers', post: () => quickLook(CUS[7]) }],
    ['27', 'Khách hàng, RM, hợp đồng', 'Trang RM có "nhịp gặp"', 'Bấm một RM (hay tìm tên): đầu trang là chỉ số kỳ này và Forecast tuần; dưới là KH đang phụ trách, mỗi KH một dải 8 tuần cho thấy gặp đều hay bỏ lâu, kèm lần gặp gần nhất và lịch sắp tới.', 'Đúng yêu cầu phần C, thêm một cái nhìn bảng thường không có: KH nào đang bị bỏ quên.', 'M', [['C']], 1, { pre: () => openRm(0) }],
    ['28', 'Khách hàng, RM, hợp đồng', 'Hủy HĐ: thấy trước ảnh hưởng', 'Hộp hủy hỏi ngày hủy và cho thấy chỉ số của RM trước → sau (doanh số, tổng số HĐ, tỷ lệ hủy). Hủy xong, HĐ có dấu "Đã hủy" và có nút Hoàn tác.', 'Hủy là thao tác nặng, đổi số của cả kỳ. Thấy trước thì không hủy nhầm.', 'S–M', [['B']], 1, { pre: () => { openProfile(7); setTimeout(() => { if (!state.cancel['72610-0457']) openCancel('2610-0457'); }, reduce ? 0 : 600); } }],
    ['29', 'Cài đặt', 'Icon cho Cài đặt và Forecast', 'Ba mục Dữ liệu, AI, Thùng rác có ô màu bo góc như Cài đặt hệ thống của Mac, dùng màu sẵn có của app. Mục Forecast và ô tìm dùng cùng bộ nét với các icon thanh bên.', 'Yêu cầu F của anh. Không cần màu mới.', 'S', [['F']], 1, { view: 'settings' }],
    ['30', 'Để sau v1.0', 'Nhắc lịch bằng thông báo của máy', '15 phút trước lịch hẹn có thông báo hệ thống; icon trên thanh menu (Windows: khay hệ thống) cho xem lịch kế tiếp mà không mở app.', 'Cần thêm plugin thông báo của Tauri.', 'M', [['G4', 'gate']], 0, {}],
    ['31', 'Để sau v1.0', 'Widget, Spotlight, Shortcuts', 'Widget lịch hôm nay trên màn hình Mac, tìm KH từ Spotlight, lệnh cho Siri / Shortcuts.', 'Chỉ app gốc Apple làm được: cần một phần viết bằng Swift. Xét khi chốt hướng thương mại hóa.', 'L', [['Mac']], 0, {}],
    ['32', 'Để sau v1.0', 'Mục tiêu doanh số', 'Đặt mục tiêu tháng cho team / RM; đường băng có thêm vạch đích và phần trăm về đích.', 'Thêm dữ liệu mới nên phải qua G2.', 'M', [['G2', 'gate']], 0, {}],
  ].map(([no, g, t, what, why, e, tags, rec, at]) => ({ no, g, t, what, why, e, tags, rec, at }));
  const picked = new Set(IDEAS.filter((x) => x.rec).map((x) => x.no));

  function renderIdeas() {
    let h = '', g = '';
    for (const x of IDEAS) {
      if (x.g !== g) { h += (g ? '</div>' : '') + `<h3 class="grp-h">${x.g}</h3><div class="ideas">`; g = x.g; }
      const canSee = x.at.view || x.at.pre || x.at.scroll || x.at.spot;
      h += `<article class="idea ${picked.has(x.no) ? 'picked' : ''}" id="idea-${x.no}"><header><span class="no">${x.no}</span><h3>${x.t}</h3>${x.rec ? '<span class="tag rec">⭐ v1.0</span>' : ''}</header><p>${x.what}</p><p class="why">${x.why}</p>
        <footer><span class="tag">${x.e}</span>${x.tags.map(([t, k]) => `<span class="tag ${k || ''}">${t}</span>`).join('')}<label><input type="checkbox" data-pick="${x.no}" ${picked.has(x.no) ? 'checked' : ''} />Chọn</label>${canSee ? `<button class="see" data-see="${x.no}">Xem ↑</button>` : ''}</footer></article>`;
    }
    $('#idea-list').innerHTML = h + '</div>';
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
    if ((el = on('.step'))) return toast('Bản concept chỉ có số của tháng 11/2026');
    if ((el = on('#act'))) return VIEWS[state.view].act[0] === 'export' ? exportDemo() : toast(`Bản concept: ở đây mở hộp thêm ${VIEWS[state.view].act[1]}`);
    if ((el = on('#fc-seg button'))) { state.fc = el.dataset.fc; $$('#fc-seg button').forEach((b) => b.classList.toggle('on', b === el)); return RENDER.forecast(); }
    if ((el = on('#rp-seg button'))) { state.rp = el.dataset.rp; return go('reports'); }
    if ((el = on('#lg-tabs button'))) { state.lg = el.dataset.lg; return RENDER.reports(); }
    if ((el = on('#rp-print'))) { const p = $('#paper'), onP = p.dataset.theme !== 'light'; if (onP) p.dataset.theme = 'light'; else delete p.dataset.theme; $('span', el).textContent = onP ? 'Xem trên màn hình' : 'Xem bản in'; return; }
    if ((el = on('#rp-show'))) { const w = $('#win'); w.classList.toggle('present'); return toast(w.classList.contains('present') ? 'Đang trình chiếu · Esc để thoát' : 'Đã thoát trình chiếu'); }
    if ((el = on('tr[data-tw]'))) { state.open[el.dataset.tw] = !state.open[el.dataset.tw]; return state.view === 'forecast' ? renderFcTable(fcData()) : RENDER.reports(); }
    if ((el = on('tr[data-rm], .rmrow'))) return openRm(+el.dataset.rm, el.classList.contains('rmrow') ? el : null);
    if ((el = on('[data-open-c]'))) return openProfile(+el.dataset.openC);
    if ((el = on('.kcard, .ap, tr[data-c]'))) return openProfile(+el.dataset.c, el.classList.contains('kcard') ? el : null);
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
    el.closest('.idea').classList.toggle('picked', el.checked);
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
  const fit = () => { const st = $('#stage'); st.style.setProperty('--fit', Math.min(1, (st.clientWidth - 24) / 1312).toFixed(4)); };
  addEventListener('resize', fit);
  fit();
  $('#now').innerHTML = NOW_IDLE;
  buildMenus();
  renderIdeas();
  renderKan();
  go('overview', { instant: true });
})();
