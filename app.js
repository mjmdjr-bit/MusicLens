const $ = (s, r = document) => r.querySelector(s);
const state = { artists: [], loveScore: 0 };

function normName(s) { return (s || "").toLowerCase().replace(/\s+/g, " ").trim().normalize("NFKC"); }
function dedupe(list) { const seen = new Set(), out = []; for (const a of list) { const k = normName(a); if (!k || seen.has(k)) continue; seen.add(k); out.push(a); } return out; }
const apple = n => `https://music.apple.com/jp/search?term=${encodeURIComponent(n)}&l=ja-jp&platform=web`;
const yt = n => `https://www.youtube.com/results?search_query=${encodeURIComponent(n + ' artist')}`;

const input = $('#artist-input');
if (input) {
    $('#btn-add').addEventListener('click', onAdd);
    $('#btn-clear').addEventListener('click', () => { state.artists = []; renderBubbles(); setSections(true); });
    input.addEventListener('keydown', e => { if (e.key === 'Enter') onAdd(); });
    renderBubbles(); renderLove(0);
}

function onAdd() {
    const raw = input.value.trim(); if (!raw) return;
    state.artists = dedupe([...state.artists, ...raw.split(',').map(s => s.trim()).filter(Boolean)]);
    input.value = ''; renderBubbles(); computeAll();
}

function renderBubbles() {
    const wrap = $('#bubble-wrap'); if (!wrap) return; wrap.innerHTML = '';
    state.artists.forEach((name, idx) => {
        const div = document.createElement('div'); div.className = 'bubble'; div.textContent = name;
        div.addEventListener('click', () => openSheet(name));
        wrap.appendChild(div);
    });
    $('#input-hint').textContent = state.artists.length ? 'バブルをタップでApple/YouTubeへ。✕で削除できます。' : 'まずアーティストを入力してね';
}

const sheet = $('#bubble-sheet'), sheetTitle = $('#sheet-title'), aApple = $('#open-apple'), aYT = $('#open-youtube');
$('#sheet-close')?.addEventListener('click', () => sheet.classList.add('hidden'));
sheet?.addEventListener('click', e => { if (e.target === sheet) sheet.classList.add('hidden'); });
function openSheet(name) { sheetTitle.textContent = name; aApple.href = apple(name); aYT.href = yt(name); sheet.classList.remove('hidden'); }

/* --- Analytics / Outputs (簡易・必ず表示) --- */
function loveMsg(n) {
    if (n >= 90) return 'めっちゃ相思相愛やん。今日、その音と一緒やったら無敵やで。';
    if (n >= 70) return 'だいぶええ感じ。もう一歩踏み込んで聴いてみ？世界広がるで。';
    if (n >= 50) return 'まだ仲良し手前やな。新曲かライブ映像で距離縮めよか。';
    if (n >= 30) return '気になるんは気になる。別曲で相性チェックしてみぃ。';
    return '今日はちゃうかも。気分転換に別ジャンル、どや？';
}
function renderLove(n) { const s = Math.max(0, Math.min(100, Math.round(n))); $('#love-score').textContent = s; $('#love-suggest').textContent = loveMsg(s); }

function calcVector(names) {
    let e = 0, w = 0, g = 0, n = 0; names.forEach(name => { const k = normName(name); for (let i = 0; i < k.length; i++) { const v = k.charCodeAt(i); e += (v % 7); w += (v % 5); g += (v % 3); n += (v % 11); } });
    const sum = Math.max(1, e + w + g + n); return { energy: +(e / sum * 100).toFixed(1), warmth: +(w / sum * 100).toFixed(1), edge: +(g / sum * 100).toFixed(1), nostalgia: +(n / sum * 100).toFixed(1) };
}
function renderVector(v) { $('#vector-view').innerHTML = `<div>Energy: <b>${v.energy}</b></div><div>Warmth: <b>${v.warmth}</b></div><div>Edge: <b>${v.edge}</b></div><div>Nostalgia: <b>${v.nostalgia}</b></div>`; }
function strengths(v) { const o = []; if (v.energy > 28) o.push('推進力／スピード感'); if (v.warmth > 22) o.push('共感力／ファシリテーション'); if (v.edge > 20) o.push('革新性／クリエイティブジャンプ'); if (v.nostalgia > 18) o.push('再編集力／ナレッジ活用'); return o.length ? o : ['着実性／安定実装']; }
function renderStrengths(list) { const ul = $('#strengths'); ul.innerHTML = ''; list.forEach(s => { const li = document.createElement('li'); li.textContent = '・' + s; ul.appendChild(li); }); }
function recos(v, lim = 12) { const db = [['高Energy×Edge', ['The Chemical Brothers', 'Justice', 'Prodigy', 'Nine Inch Nails']], ['高Warmth', ['FKJ', 'Tom Misch', 'Nujabes', 'SIRUP']], ['高Nostalgia', ['Daft Punk', 'Cornelius', 'YMO', 'UNDERWORLD']]]; const l = []; if (v.energy > v.warmth && v.energy > v.nostalgia) l.push(...db[0][1]); if (v.warmth >= 22) l.push(...db[1][1]); if (v.nostalgia >= 18) l.push(...db[2][1]); return Array.from(new Set(l)).slice(0, lim).map(n => ({ name: n, url: apple(n) })); }
function renderRecos(items) { const ul = $('#recos'); ul.innerHTML = ''; items.forEach(r => { const li = document.createElement('li'); const a = document.createElement('a'); a.href = r.url; a.target = '_blank'; a.rel = 'noopener'; a.textContent = r.name; li.appendChild(a); ul.appendChild(li); }); }

function setSections(on) { $('#section-vector').hidden = on; $('#section-strengths').hidden = on; $('#section-recos').hidden = on; }
async function computeAll() {
    const names = state.artists; renderLove(Math.min(100, 40 + names.length * 12)); if (!names.length) { setSections(true); return; }
    try { const v = calcVector(names); renderVector(v); renderStrengths(strengths(v)); renderRecos(recos(v, 16)); setSections(false); } catch (e) { console.error(e); setSections(false); }
}
