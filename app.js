// ---------- helpers ----------
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

const state = { artists: [] };

const norm = s => (s || "").toLowerCase().replace(/\s+/g, " ").trim().normalize("NFKC");
const dedupe = list => Array.from(new Map(list.map(n => [norm(n), n])).values());
const apple = n => `https://music.apple.com/jp/search?term=${encodeURIComponent(n)}&l=ja-jp&platform=web`;
const youtube = n => `https://www.youtube.com/results?search_query=${encodeURIComponent(n + ' artist')}`;

// ---------- input / analyze ----------
const input = $('#artist-input');
const btnAdd = $('#btn-add');
const btnClear = $('#btn-clear');
const btnAnalyze = $('#btn-analyze');

if (input && btnAdd && btnClear && btnAnalyze) {
    btnAdd.addEventListener('click', addFromInput);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') addFromInput(); });
    btnClear.addEventListener('click', () => { state.artists = []; renderAll(true); });
    btnAnalyze.addEventListener('click', () => renderAll(false));
    renderAll(true);
}

function addFromInput() {
    const raw = input.value.trim(); if (!raw) return;
    const list = raw.split(',').map(s => s.trim()).filter(Boolean);
    state.artists = dedupe([...state.artists, ...list]);
    input.value = '';
    renderAll(true);
}

// ---------- render ----------
function renderAll(hideSections) {
    renderBubbles();
    renderMap();
    if (hideSections || state.artists.length === 0) {
        setVisible(false);
        return;
    }
    calcAndRender();
}

function renderBubbles() {
    const wrap = $('#bubble-wrap'); if (!wrap) return;
    wrap.innerHTML = '';
    state.artists.forEach((name, idx) => {
        const b = document.createElement('div'); b.className = 'bubble'; b.textContent = name;
        b.title = 'タップでApple/YouTubeへ';
        b.addEventListener('click', () => openSheet(name));
        wrap.appendChild(b);
    });
    $('#input-hint').textContent = state.artists.length
        ? 'バブルをタップするとApple/YouTubeポップアップが開きます。'
        : 'まずアーティストを入力してね';
}

function renderMap() {
    const wrap = $('#map-wrap'); if (!wrap) return;
    const section = $('#section-map');
    wrap.innerHTML = '';
    if (state.artists.length === 0) { section.hidden = true; return; }
    state.artists.forEach(n => {
        const dot = document.createElement('div'); dot.className = 'bubble'; dot.textContent = n;
        dot.addEventListener('click', () => openSheet(n));
        wrap.appendChild(dot);
    });
    section.hidden = false;
}

function setVisible(on) {
    ['#section-love', '#section-vector', '#section-strengths', '#section-recos']
        .forEach(sel => { const el = $(sel); if (el) el.hidden = !on; });
}

function calcAndRender() {
    // LOVE（件数ベースの簡易スコア）
    const love = Math.min(100, 35 + state.artists.length * 12);
    $('#love-score').textContent = love;
    $('#love-suggest').textContent = loveMsg(love);

    // Vector（名前のコードから安定生成）
    const vec = calcVector(state.artists);
    $('#vector-view').innerHTML = `
    <div>Energy: <b>${vec.energy}</b></div>
    <div>Warmth: <b>${vec.warmth}</b></div>
    <div>Edge: <b>${vec.edge}</b></div>
    <div>Nostalgia: <b>${vec.nostalgia}</b></div>`;

    // Strengths
    const st = strengths(vec);
    const ul = $('#strengths'); ul.innerHTML = '';
    st.forEach(s => { const li = document.createElement('li'); li.textContent = '・' + s; ul.appendChild(li); });

    // Recommendations
    const rec = recommendations(vec, 16);
    const recUl = $('#recos'); recUl.innerHTML = '';
    rec.forEach(r => {
        const li = document.createElement('li');
        const a = document.createElement('a'); a.href = r.url; a.target = '_blank'; a.rel = 'noopener'; a.textContent = r.name;
        li.appendChild(a); recUl.appendChild(li);
    });

    setVisible(true);
}

// ---------- love / vector / strengths / recos ----------
function loveMsg(n) {
    if (n >= 90) return 'めっちゃ相思相愛やん。今日、その音と一緒やったら無敵やで。';
    if (n >= 70) return 'だいぶええ感じ。もう一歩踏み込んで聴いてみ？世界広がるで。';
    if (n >= 50) return 'まだ仲良し手前やな。新曲かライブ映像で距離縮めよか。';
    if (n >= 30) return '気になるんは気になる。別曲で相性チェックしてみぃ。';
    return '今日はちゃうかも。気分転換に別ジャンル、どや？';
}

function calcVector(names) {
    let e = 0, w = 0, g = 0, n = 0;
    names.forEach(name => {
        const k = norm(name);
        for (let i = 0; i < k.length; i++) {
            const v = k.charCodeAt(i);
            e += (v % 7); w += (v % 5); g += (v % 3); n += (v % 11);
        }
    });
    const sum = Math.max(1, e + w + g + n);
    return {
        energy: +(e / sum * 100).toFixed(1),
        warmth: +(w / sum * 100).toFixed(1),
        edge: +(g / sum * 100).toFixed(1),
        nostalgia: +(n / sum * 100).toFixed(1)
    };
}

function strengths(v) {
    const out = [];
    if (v.energy > 28) out.push('推進力／スピード感');
    if (v.warmth > 22) out.push('共感力／ファシリテーション');
    if (v.edge > 20) out.push('革新性／クリエイティブジャンプ');
    if (v.nostalgia > 18) out.push('再編集力／ナレッジ活用');
    return out.length ? out : ['着実性／安定実装'];
}

function recommendations(v, limit = 12) {
    const buckets = [
        ['高Energy×Edge', ['The Chemical Brothers', 'Justice', 'Prodigy', 'Nine Inch Nails']],
        ['高Warmth', ['FKJ', 'Tom Misch', 'Nujabes', 'SIRUP']],
        ['高Nostalgia', ['Daft Punk', 'Cornelius', 'YMO', 'UNDERWORLD']],
    ];
    const list = [];
    if (v.energy > v.warmth && v.energy > v.nostalgia) list.push(...buckets[0][1]);
    if (v.warmth >= 22) list.push(...buckets[1][1]);
    if (v.nostalgia >= 18) list.push(...buckets[2][1]);
    return Array.from(new Set(list)).slice(0, limit).map(n => ({ name: n, url: apple(n) }));
}

// ---------- sheet (Apple/YouTube) ----------
const sheet = $('#bubble-sheet');
const sheetTitle = $('#sheet-title');
const aApple = $('#open-apple');
const aYT = $('#open-youtube');
$('#sheet-close')?.addEventListener('click', () => sheet.classList.add('hidden'));
sheet?.addEventListener('click', e => { if (e.target === sheet) sheet.classList.add('hidden'); });

function openSheet(name) {
    sheetTitle.textContent = name;
    aApple.href = apple(name);
    aYT.href = youtube(name);
    sheet.classList.remove('hidden');
}
