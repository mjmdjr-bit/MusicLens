// =============== helpers & state ===============
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const norm = s => (s || "").toLowerCase().trim().replace(/\s+/g, " ").normalize("NFKC");
const dedupe = list => Array.from(new Map(list.map(n => [norm(n), n])).values());
const appleLink = n => `https://music.apple.com/jp/search?term=${encodeURIComponent(n)}&l=ja-jp&platform=web`;
const youtubeLink = n => `https://www.youtube.com/results?search_query=${encodeURIComponent(n + ' official')}`;

const state = {
    artists: [],
    metaCache: new Map(),   // name -> {art, desc, appleUrl, ytUrl, previewUrl}
};

// fetch iTunes meta (artist image & preview)
async function fetchMeta(name) {
    const key = norm(name);
    if (state.metaCache.has(key)) return state.metaCache.get(key);
    // artist search
    const aRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(name)}&entity=musicArtist&limit=1`);
    const aJson = await aRes.json().catch(() => ({ results: [] }));
    const artist = aJson.results?.[0];
    let art = artist?.artworkUrl100?.replace('100x100', '600x600') || '';
    let appleUrl = artist?.artistLinkUrl || appleLink(name);
    let desc = artist?.primaryGenreName ? `${name} は${artist.primaryGenreName}の要素を持つアーティスト。` : `${name} は独自のサウンドを持つアーティスト。`;

    // preview（曲）
    let previewUrl = '';
    try {
        const tRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(name)}&entity=song&limit=1`);
        const tJson = await tRes.json();
        previewUrl = tJson.results?.[0]?.previewUrl || '';
        if (!art && tJson.results?.[0]?.artworkUrl100) art = tJson.results[0].artworkUrl100.replace('100x100', '600x600');
    } catch { }

    const meta = { art, desc, appleUrl, ytUrl: youtubeLink(name), previewUrl };
    state.metaCache.set(key, meta);
    return meta;
}

// =============== input / buttons ===============
const input = $('#artist-input'), btnAdd = $('#btn-add'), btnClear = $('#btn-clear'), btnAnalyze = $('#btn-analyze');

if (input && btnAdd && btnClear && btnAnalyze) {
    btnAdd.addEventListener('click', addFromInput);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') addFromInput(); });
    btnClear.addEventListener('click', () => { state.artists = []; renderAll(true); });
    btnAnalyze.addEventListener('click', () => renderAll(false));
    renderAll(true);
}

function addFromInput() {
    const raw = input.value.trim(); if (!raw) return;
    state.artists = dedupe([...state.artists, ...raw.split(',').map(s => s.trim()).filter(Boolean)]);
    input.value = ''; renderAll(true);
}

// =============== render ===============
function renderAll(hide) {
    renderBubbles();
    renderMap();
    if (hide || state.artists.length === 0) { setVisible(false); return; }
    calcAndRender();
}

function setVisible(on) {
    ['#section-love', '#section-vector', '#section-strengths', '#section-recos', '#section-map']
        .forEach(sel => { const el = $(sel); if (el && sel !== '#section-map') el.hidden = !on; });
}

// bubbles (入力直下の小バブル)
async function renderBubbles() {
    const wrap = $('#bubble-wrap'); if (!wrap) return; wrap.innerHTML = '';
    const unique = dedupe(state.artists);
    for (const n of unique) {
        const meta = await fetchMeta(n).catch(() => ({}));
        const div = document.createElement('div'); div.className = 'bubble-photo'; div.title = 'タップで詳細';
        div.innerHTML = `<img src="${meta.art || ''}" alt=""><span>${n.toUpperCase()}</span>`;
        div.addEventListener('click', () => openSheet(n, meta));
        wrap.appendChild(div);
    }
    $('#input-hint').textContent = unique.length ? 'バブルをタップするとApple/YouTubeと詳細を表示。' : 'まずアーティストを入力してね';
}

// Listening Map（写真入りバブル）
async function renderMap() {
    const section = $('#section-map'), wrap = $('#map-wrap'); if (!wrap) return;
    if (state.artists.length === 0) { section.hidden = true; return; }
    wrap.innerHTML = '';
    const unique = dedupe(state.artists);
    for (const n of unique) {
        const meta = await fetchMeta(n).catch(() => ({}));
        const d = document.createElement('div'); d.className = 'bubble-photo';
        d.innerHTML = `<img src="${meta.art || ''}" alt=""><span>${n.toUpperCase()}</span>`;
        d.addEventListener('click', () => openSheet(n, meta));
        wrap.appendChild(d);
    }
    section.hidden = false;
}

// Action sheet（写真＋説明＋リンク＋プレビュー）
const sheet = $('#bubble-sheet'); const sheetArt = $('#sheet-art'); const sheetTitle = $('#sheet-title');
const sheetDesc = $('#sheet-desc'); const aApple = $('#open-apple'); const aYT = $('#open-youtube');
const sheetAudio = $('#sheet-audio');
$('#sheet-close')?.addEventListener('click', () => sheet.classList.add('hidden'));
sheet?.addEventListener('click', e => { if (e.target === sheet) sheet.classList.add('hidden'); });

function openSheet(name, meta) {
    sheetArt.src = meta.art || '';
    sheetArt.alt = name;
    sheetTitle.textContent = name;
    sheetDesc.textContent = meta.desc || `${name} の代表曲をチェックしよう。`;
    aApple.href = meta.appleUrl || appleLink(name);
    aYT.href = meta.ytUrl || youtubeLink(name);
    if (meta.previewUrl) { sheetAudio.src = meta.previewUrl; sheetAudio.style.display = 'block'; }
    else { sheetAudio.removeAttribute('src'); sheetAudio.style.display = 'none'; }
    sheet.classList.remove('hidden');
}

// =============== analytics / views ===============
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
        for (let i = 0; i < k.length; i++) { const v = k.charCodeAt(i); e += (v % 7); w += (v % 5); g += (v % 3); n += (v % 11); }
    });
    const sum = Math.max(1, e + w + g + n);
    return { energy: +(e / sum * 100).toFixed(1), warmth: +(w / sum * 100).toFixed(1), edge: +(g / sum * 100).toFixed(1), nostalgia: +(n / sum * 100).toFixed(1) };
}

function vectorTip(v) {
    const max = Math.max(v.energy, v.warmth, v.edge, v.nostalgia);
    if (max === v.energy) return 'オシャレで推進力のある音が好きやね！スピード感ある作業と相性◎';
    if (max === v.warmth) return 'ぬくもり重視。人との共感やファシリに強みが出るで。';
    if (max === v.edge) return '攻めのセンス。革新的な提案やクリエイティブジャンプが光るわ。';
    return '渋み・余韻好き。ナレッジ活用やリファインに才能ありやで。';
}

function strengthScores(v) {
    // 音→仕事4因子へ射影
    return {
        drive: Math.round(v.energy),
        empathy: Math.round(v.warmth * 1.1),
        innovation: Math.round((v.edge + v.energy * 0.5)),
        curation: Math.round((v.nostalgia + v.warmth * 0.3))
    };
}
function strengthTip(s) {
    const best = Object.entries(s).sort((a, b) => b[1] - a[1])[0][0];
    if (best === 'drive') return 'めっちゃ仕事できる人やん！推進と意思決定を任せていこ。';
    if (best === 'empathy') return 'チームの空気を整える名手。ファシリや顧客折衝で真価発揮やで。';
    if (best === 'innovation') return '新規アイデアの源泉。尖った打ち手で一歩先を作ろか。';
    return '編集と磨き上げが武器。既存資産の再設計で成果を伸ばそう。';
}

function bar(name, val) {
    const el = document.createElement('div'); el.className = 'bar';
    el.innerHTML = `<div class="bar-label">${name}</div><div class="bar-track"><div class="bar-fill" style="width:0%"></div></div>`;
    requestAnimationFrame(() => { el.querySelector('.bar-fill').style.width = Math.min(100, val) + '%'; });
    return el;
}

function setHeartFill(pct) {
    const fill = $('#love-fill');
    // 0〜100%を 0〜65%の高さに変換（器の高さ的に）
    const h = Math.max(0, Math.min(65, Math.round(pct * 0.65)));
    fill.style.height = h + '%';
}

function calcAndRender() {
    const names = dedupe(state.artists);
    const love = Math.min(100, 35 + names.length * 12);
    $('#love-score').textContent = love;
    $('#love-suggest').textContent = loveMsg(love);
    setHeartFill(love);

    const v = calcVector(names);
    const vb = $('#vector-bars'); vb.innerHTML = '';
    vb.appendChild(bar('Energy', v.energy));
    vb.appendChild(bar('Warmth', v.warmth));
    vb.appendChild(bar('Edge', v.edge));
    vb.appendChild(bar('Nostalgia', v.nostalgia));
    $('#vector-tip').textContent = vectorTip(v);

    const s = strengthScores(v);
    const sb = $('#strength-bars'); sb.innerHTML = '';
    sb.appendChild(bar('Drive', s.drive));
    sb.appendChild(bar('Empathy', s.empathy));
    sb.appendChild(bar('Innovation', s.innovation));
    sb.appendChild(bar('Curation', s.curation));
    $('#strength-tip').textContent = strengthTip(s);

    renderRecos(v, names);
    setVisible(true);
}

// =============== recommendations（画像＋再生＋リンク） ===============
const recPool = [
    ['高Energy×Edge', ['The Chemical Brothers', 'Justice', 'Nine Inch Nails', 'Prodigy', 'Carpenter Brut', 'Boy Harsher']],
    ['高Warmth', ['FKJ', 'Tom Misch', 'Nujabes', 'SIRUP', 'Lauv', 'Daniel Caesar']],
    ['高Nostalgia', ['Daft Punk', 'Cornelius', 'YMO', 'UNDERWORLD', 'The XX', 'Radiohead']],
];

async function renderRecos(v, inputNames) {
    const wrap = $('#recos'); wrap.innerHTML = '';
    let list = [];
    if (v.energy > v.warmth && v.energy > v.nostalgia) list.push(...recPool[0][1]);
    if (v.warmth >= 22) list.push(...recPool[1][1]);
    if (v.nostalgia >= 18) list.push(...recPool[2][1]);
    const ban = new Set(dedupe(inputNames).map(norm));
    list = dedupe(list).filter(n => !ban.has(norm(n))).slice(0, 12);

    for (const n of list) {
        const meta = await fetchMeta(n).catch(() => ({}));
        const card = document.createElement('div'); card.className = 'card';
        card.innerHTML = `
      <img src="${meta.art || ''}" alt="${n}">
      <div class="card-body">
        <div class="card-title">${n}</div>
        ${meta.previewUrl ? `<audio src="${meta.previewUrl}" controls></audio>` : ''}
        <div class="card-actions">
          <a class="btn primary" href="${meta.appleUrl || appleLink(n)}" target="_blank" rel="noopener">Apple Music</a>
          <a class="btn ghost" href="${meta.ytUrl || youtubeLink(n)}" target="_blank" rel="noopener">YouTube</a>
        </div>
      </div>`;
        wrap.appendChild(card);
    }
}
