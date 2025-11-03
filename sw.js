< !doctype html >
    <html lang="ja">
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width,initial-scale=1" />
            <title>MusicLens PRO MAX — v12.1</title>
            <style>
                :root{
                    --bg0:#0b0f14; --bg1:#0f141b; --txt:#f7fafc;
                --gold:#ffd36b; --amber:#ff9f1c; --teal:#7fd1ff; --mint:#89ffe3;
                --rose:#ff6b6b; --violet:#9b7bff;
}
                *{box - sizing:border-box}
                html,body{height:100%} body{margin:0;background:linear-gradient(180deg,var(--bg0),var(--bg1));color:var(--txt);font-family:-apple-system,BlinkMacSystemFont,"Hiragino Kaku Gothic ProN","Noto Sans JP","Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif;overflow-x:hidden}

                /* 背景パーティクル */
                #fx{position:fixed;inset:0;z-index:0;pointer-events:none}

                /* TOP */
                #title{position:relative;height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px;z-index:2000}
                .hero{width:min(920px,92vw);padding:40px 48px;border-radius:24px;background:rgba(255,255,255,.08);backdrop-filter:blur(18px) saturate(140%);box-shadow:0 10px 40px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.06)}
                .logo{font - size:clamp(40px,7vw,72px);line-height:1.1;margin:0 0 12px;background:linear-gradient(90deg,#f7e8b3,#ffd36b,#ff9f1c);-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:0 2px 12px rgba(255,211,107,.25)}
                .tagline{font - size:clamp(14px,1.9vw,20px);opacity:.92;line-height:1.8;margin:8px 0 18px}
                .cta{display:inline-flex;align-items:center;gap:10px;padding:14px 24px;border:none;border-radius:12px;background:linear-gradient(270deg,#ffd36b,#ff9f1c);color:#111;font-weight:800;cursor:pointer;box-shadow:0 10px 30px rgba(255,211,107,.25);transform:translateZ(0);transition:transform .25s, filter .25s}
                .cta:hover{transform:translateY(-2px);filter:brightness(1.05)}
                .credit{margin - top:16px;opacity:.85;font-size:14px}

                /* 扉アニメ */
                #doorContainer{position:fixed;inset:0;display:flex;z-index:999;pointer-events:none}
                .door{flex:1;background:radial-gradient(1200px 800px at 50% 50%,rgba(120,180,255,.18),transparent 60%),linear-gradient(90deg,rgba(255,255,255,.06),rgba(255,255,255,.02));backdrop-filter:blur(20px) saturate(150%);transform:translateX(0);transition:transform 3s cubic-bezier(.25,.8,.25,1)}
                body.doors-open .door.left{transform:translateX(-100%)} body.doors-open .door.right{transform:translateX(100%)}

                /* アプリ */
                #app{display:none;opacity:0;transform:translateY(40px);transition:opacity 1.2s ease, transform 1.2s ease}
                .container{max - width:1000px;margin:0 auto;padding:24px}
                .panel{margin - top:14px;padding:16px;border-radius:14px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.2)}
                .section-title{font - weight:800;color:var(--gold);margin-bottom:8px;font-size:14px}
                #inputBox{width:100%;padding:10px 14px;border-radius:10px;border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.1);color:#fff}
                #chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
                .chip{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.22);border-radius:999px;padding:6px 10px;color:#fff}
                #progressWrap{display:none;margin-top:12px}
                #progbar{height:10px;background:#ffffff1f;border-radius:999px;overflow:hidden}
                #progfill{height:10px;width:0;background:linear-gradient(270deg,#7fd1ff,#89ffe3)}
                #mapArea{display:flex;flex-wrap:wrap;gap:24px;justify-content:center}
                .bubble{position:relative;width:110px;height:110px;border-radius:50%;overflow:hidden;box-shadow:0 0 22px rgba(255,255,180,.4);transition:.35s}
                .bubble:hover{transform:scale(1.06)}
                .bubbleName{position:absolute;left:6px;right:6px;bottom:8px;text-align:center;color:#fff;font-weight:700;font-size:12px;text-shadow:0 2px 8px rgba(0,0,0,.6);pointer-events:none}
                #emotion{width:100%;height:260px;border-radius:14px;background:rgba(255,255,255,.05)}
                #loveSvg{width:220px;height:220px;margin:8px auto 0;display:block}
                .kpi{display:grid;grid-template-columns:1fr auto;gap:6px;margin:6px 0}
                .bar{height:8px;background:rgba(255,255,255,.12);border-radius:999px;overflow:hidden}
                .fill{height:100%;background:linear-gradient(90deg,#ffcc33,#ff8800);width:0%;transition:width 1.2s}

                /* Sora FAB（流れるグラデ＋リップル） */
                .sora-fab{position:fixed;top:16px;right:18px;z-index:3000;display:flex;align-items:center;gap:10px;padding:10px 18px;border:none;border-radius:999px;background:linear-gradient(270deg,var(--teal),var(--mint),var(--gold),var(--amber));background-size:800% 800%;color:#0b132b;font-weight:800;letter-spacing:.35px;animation:fAB 10s ease infinite;box-shadow:0 0 24px rgba(127,209,255,.35),inset 0 1px 0 rgba(255,255,255,.5);cursor:pointer;overflow:hidden}
                .sora-fab:hover{filter:brightness(1.12)} .sora-fab:active::after{content:"";position:absolute;inset:0;border-radius:999px;background:radial-gradient(circle,rgba(255,255,255,.5) 0,transparent 60%);animation:rIpple .8s ease-out}
                @keyframes fAB{0 % { background- position:0% 50%}50%{background - position:100% 50%}100%{background - position:0% 50%}}
                @keyframes rIpple{0 % { transform: scale(.85); opacity: .7 }100%{transform:scale(2.2);opacity:0}}
                .dot{width:12px;height:12px;border-radius:99px;background:radial-gradient(circle at 40% 40%,#fff,#7fd1ff 60%);box-shadow:0 0 10px rgba(127,209,255,.7);animation:dOt 3s ease-in-out infinite}
                @keyframes dOt{0 %, 100 % { transform: scale(1); opacity: 1 }50%{transform:scale(1.35);opacity:.7}}
                @media (max-width:768px){.sora - fab{left:50%;right:auto;transform:translateX(-50%)}}

                /* Sora モーダル（Liquid + 状態連動グロー） */
                #sora-overlay{position:fixed;inset:0;z-index:4000;display:none;align-items:center;justify-content:center;background:rgba(10,12,16,.55);backdrop-filter:blur(20px)}
                .sora-card{position:relative;width:min(680px,92vw);max-width:820px;border-radius:18px;padding:22px 24px 18px;background:rgba(18,22,30,.72);backdrop-filter:blur(20px) saturate(140%);box-shadow:0 8px 35px rgba(0,0,0,.35);overflow:hidden}
.sora-card>*{position:relative;z-index:1}
                .sora-card::before{content:"";position:absolute;inset:-2px;border-radius:inherit;padding:2px;background:conic-gradient(from 0deg,#7fd1ff,#89ffe3,#ffd36b,#ff9f1c,#7fd1ff);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:spin 12s linear infinite}
                @keyframes spin{to{transform:rotate(360deg)}}
                .sora-card[data-state="idle"]::before{background:conic-gradient(from 0deg,#7fd1ff,#89ffe3,#7fd1ff);animation-duration:16s}
                .sora-card[data-state="thinking"]::before{background:conic-gradient(from 0deg,#66aaff,#9b7bff,#66aaff);animation-duration:9s;filter:brightness(1.2)}
                .sora-card[data-state="reply"]::before{background:conic-gradient(from 0deg,#ffd36b,#ff9f1c,#ffd36b);animation-duration:12s}
                .sora-card[data-state="error"]::before{background:conic-gradient(from 0deg,#ff6b6b,#ff4b4b,#ff6b6b);animation-duration:6s;filter:brightness(1.3)}
                .scan-line{position:absolute;left:-10%;right:-10%;top:-12%;height:4px;opacity:.2;background:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent);filter:blur(4px);animation:scan 7s linear infinite}
                @keyframes scan{0 % { top: -12 %; opacity: 0 }20%{opacity:.35}50%{top:100%}80%{opacity:0}100%{top:100%}}
                .sora-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
                .sora-title{font - weight:800;letter-spacing:.4px;background:linear-gradient(90deg,#c6f0ff,#89ffe3,#ffd36b,#ff9f1c,#c6f0ff);-webkit-background-clip:text;background-clip:text;color:transparent;animation:glow 14s ease-in-out infinite}
                @keyframes glow{0 %, 100 % { filter: drop - shadow(0 0 0 rgba(255, 255, 255, 0)) }50%{filter:drop-shadow(0 0 10px rgba(255,255,255,.35))}}
                .sora-log{border - radius:12px;padding:14px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);min-height:120px;max-height:40vh;overflow:auto}
                .sora-input{display:flex;gap:10px;align-items:center;margin-top:8px}
                .sora-input input{flex:1;border-radius:12px;border:1px solid rgba(255,255,255,.2);padding:12px 14px;background:rgba(255,255,255,.06);color:var(--txt);outline:none}

                /* クリック優先順位（背面を無効化） */
                #fx,#doorContainer,.door{pointer - events:none !important}
                #startBtn,.sora-fab{pointer - events:auto !important;z-index:3000;position:relative}
            </style>
        </head>
        <body>

            <canvas id="fx"></canvas>

            <!-- Top -->
            <section id="title">
                <button id="soraFab" class="sora-fab"><span class="dot"></span><span>Chat with Sora AI</span></button>
                <div class="hero">
                    <h1 class="logo">MusicLens</h1>
                    <p class="tagline">好きなアーティスト/曲を入れるだけ。音の嗜好→今日のコンディションと仕事の強みまで見える。“音の性格診断”。</p>
                    <button id="startBtn" class="cta">SOUND JOURNEY ▶︎</button>
                    <p class="credit">Produced by Daijiro Majima</p>
                </div>
            </section>

            <!-- Door -->
            <div id="doorContainer"><div class="door left"></div><div class="door right"></div></div>

            <!-- App -->
            <main id="app" class="container">
                <section style="position:relative;padding-top:8px">
                    <button id="soraFabTop" class="sora-fab" style="top:0;right:0"><span class="dot"></span><span>Chat with Sora AI</span></button>
                    <h2 class="logo" style="text-align:center;margin-top:56px">MusicLens</h2>
                </section>

                <section>
                    <div class="panel">
                        <div class="section-title">Today's Feeling（アーティスト / 曲名）</div>
                        <input id="inputBox" placeholder="例: Daft Punk, SZA, Get Lucky（カンマ区切りOK）">
                            <div style="display:flex;gap:10px;margin-top:12px">
                                <button id="addBtn" class="cta" style="padding:12px 18px">Add</button>
                                <button id="analyzeBtn" class="cta" style="padding:12px 18px;background:linear-gradient(270deg,#ffd36b,#ff9f1c)">Analyze</button>
                            </div>
                            <div id="chips"></div>
                            <div id="progressWrap">
                                <div id="progbar"><div id="progfill"></div></div>
                                <div id="progtext">0%</div>
                            </div>
                    </div>

                    <div class="panel">
                        <div class="section-title">Listening Map（アーティストバブル）</div>
                        <div id="mapArea"></div>
                    </div>

                    <div class="panel">
                        <div class="section-title">Emotion Map（Valence × Arousal）</div>
                        <canvas id="emotion"></canvas>
                        <div id="emotionTip" style="text-align:center;margin-top:6px;opacity:.9"></div>
                    </div>

                    <div class="panel" style="text-align:center">
                        <div class="section-title">Music Love（音楽愛）</div>
                        <svg id="loveSvg" viewBox="0 0 200 200">
                            <defs>
                                <linearGradient id="loveGrad" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stop-color="#ff9f1c" /><stop offset="100%" stop-color="#ffd36b" /></linearGradient>
                                <clipPath id="loveClip"><path id="heartPath" d="M100 175c-3 0-6-1-8.2-2.9C75 158 30 123 30 85c0-25 20-45 43-45c12 0 24 6 31 15c7-9 19-15 31-15c23 0 43 20 43 45c0 38-45 73-61.8 87.1c-2.2 2-5.2 2.9-8.2 2.9z" /></clipPath>
                            </defs>
                            <use href="#heartPath" fill="none" stroke="#ffd36b" stroke-width="3" />
                            <rect id="loveFill" x="36" y="160" width="128" height="0" fill="url(#loveGrad)" clip-path="url(#loveClip)" />
                        </svg>
                        <div id="lovePercent" style="font-weight:800;margin-top:6px">—%</div>
                        <div id="loveComment" style="opacity:.9;margin-top:4px"></div>
                    </div>

                    <div class="panel">
                        <div class="section-title">Your Music Vector</div>
                        <div id="profileBars"></div>
                        <canvas id="vectorPie" width="320" height="320" style="display:block;margin:20px auto"></canvas>
                        <div id="vectorLegend" style="text-align:center;opacity:.9"></div>
                    </div>

                    <div class="panel">
                        <div class="section-title">Work Strengths</div>
                        <div id="abilities"></div>
                        <canvas id="workPie" width="320" height="320" style="display:block;margin:20px auto"></canvas>
                        <div id="workLegend" style="text-align:center;opacity:.9"></div>
                    </div>

                    <div class="panel">
                        <div class="section-title">Music Recommendations</div>
                        <div id="recs">Analyze後に表示されます。</div>
                    </div>
                </section>
            </main>

            <!-- Sora Modal -->
            <div id="sora-overlay" aria-hidden="true">
                <div class="sora-card" data-state="idle">
                    <span class="scan-line"></span>
                    <div class="sora-header">
                        <div class="sora-title">Sora AI</div>
                        <button id="soraClose" class="cta" style="padding:8px 12px">Close</button>
                    </div>
                    <div class="sora-log" id="soraLog"></div>
                    <div class="sora-input">
                        <input id="soraInput" placeholder="例：大阪の天気は？ / 次は何聴く？" />
                        <button id="soraSend" class="cta" style="padding:10px 16px">Send</button>
                    </div>
                </div>
            </div>

            <script>
/* ====== 小ユーティリティ ====== */
const raf=()=>new Promise(r=>requestAnimationFrame(r));
                function bind(sel,fn){const el=typeof sel==='string'?document.querySelector(sel):sel;if(!el)return;const h=e=>{e.preventDefault();e.stopPropagation();fn(e)};el.addEventListener('click',h);el.addEventListener('pointerup',h,{passive:false});el.addEventListener('touchend',h,{passive:false})}
                function uniqueTokens(arr){const s=new Set(),out=[];(arr||[]).forEach(v=>{v = (v || '').trim();if(!v)return;const k=v.toLowerCase();if(!s.has(k)){s.add(k);out.push(v)}});return out}

/* ===== 背景パーティクル ===== */
(()=>{const c=document.getElementById('fx'),ctx=c.getContext('2d',{alpha:true});let W=innerWidth,H=innerHeight;c.width=W;c.height=H;const pts=Array.from({length:130}).map(()=>({x:Math.random()*W,y:Math.random()*H,dx:(Math.random()-.5)*.25,dy:(Math.random()-.5)*.25,r:1+Math.random()*2,a:.25+Math.random()*.3}));(function step(){ctx.clearRect(0, 0, W, H);for(const p of pts){p.x += p.dx;p.y+=p.dy;if(p.x<0||p.x>W)p.dx*=-1;if(p.y<0||p.y>H)p.dy*=-1;const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*10);g.addColorStop(0,`rgba(135,200,255,${p.a})`);g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,p.r*10,0,Math.PI*2);ctx.fill()}requestAnimationFrame(step)})();addEventListener('resize',()=>{W = innerWidth;H=innerHeight;c.width=W;c.height=H})})();

/* ===== 画面遷移（扉） ===== */
bind('#startBtn',()=>{document.body.classList.add('doors-open');setTimeout(async()=>{const title=document.getElementById('title');const app=document.getElementById('app');if(title)title.style.display='none';if(app){app.style.display = 'block';await raf();app.style.opacity=1}},3000)});

                /* ===== Sora モーダル ===== */
                const overlay=document.getElementById('sora-overlay')
const card=()=>document.querySelector('.sora-card')
                function setSoraState(st){const c=card(); if(c) c.dataset.state=st}
                function openSora(){overlay.style.display = 'flex';setSoraState('idle');document.body.style.overflow='hidden';setTimeout(()=>document.getElementById('soraInput')?.focus(),50)}
                function closeSora(){overlay.style.display = 'none';document.body.style.overflow=''}
                bind('#soraFab',openSora); bind('#soraFabTop',openSora); bind('#soraClose',closeSora)
overlay.addEventListener('click',e=>{if(e.target===overlay)closeSora()},{passive:true})

                /* ===== Sora 応答（/chat と / 両方を試す） ===== */
                async function postJSON(url,body,timeout=15000){const ctrl=new AbortController();const t=setTimeout(()=>ctrl.abort(),timeout);try{const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:ctrl.signal});clearTimeout(t);return r}catch(e){clearTimeout(t);throw e}}
                async function callSoraAPI(message){
                    setSoraState('thinking');
                const base='https://tiny-fog-ae39.mjmdjr.workers.dev';
                try{
                    let res=await postJSON(base+'/chat',{message}).catch(()=>postJSON(base,{message}));
                if(!res.ok){setSoraState('error');return '今は混み合ってるみたい…ちょい待ってや。'}
    const data=await res.json().catch(()=>({ }));
    setSoraState('reply'); setTimeout(()=>setSoraState('idle'),3000);
                return data?.reply || data?.message || '了解やで。';
  }catch(e){
                    setSoraState('error'); return 'ネットが不安定みたいや。もう一回頼むわ。';
  }
}
                function appendLog(who,text){const box=document.getElementById('soraLog');const row=document.createElement('div');row.className='sora-msg';row.innerHTML=`<div class="bubble"><strong>${who}：</strong> ${text}</div>`;box.appendChild(row);box.scrollTop=box.scrollHeight}
bind('#soraSend',async()=>{const $in=document.getElementById('soraInput');const q=($in.value||'').trim();if(!q)return;appendLog('🙋‍♂️',q);$in.value='';const ans=await callSoraAPI(q);appendLog('Sora',ans)})
document.getElementById('soraInput').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing)document.getElementById('soraSend').click()})

                /* ===== 入力・チップ・サジェスト ===== */
                let TOKENS=[]
                const input=document.getElementById('inputBox'),chips=document.getElementById('chips')
                const sugBox=document.createElement('div');sugBox.style.cssText='margin-top:8px;display:none;background:#1117;border:1px solid #ffffff15;border-radius:12px;padding:8px;';input.insertAdjacentElement('afterend',sugBox)
                async function suggest(q){try{const r=await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(q)}&limit=7`);const j=await r.json();return (j.results||[]).map(it=>it.artistName||it.trackName).filter(Boolean)}catch{return []}}
input.addEventListener('input',async e=>{const v=e.target.value.trim();if(!v){sugBox.style.display = 'none';return}const list=await suggest(v);if(!list.length){sugBox.style.display = 'none';return}sugBox.innerHTML=list.map(x=>`<button style="margin:4px;padding:6px 10px;border-radius:999px;border:1px solid #ffffff22;background:#111a;color:#fff;">${x}</button>`).join('');sugBox.style.display='block'})
sugBox.addEventListener('click',e=>{if(e.target.tagName!=='BUTTON')return;TOKENS=uniqueTokens([...TOKENS,e.target.textContent.trim()]);renderChips();sugBox.style.display='none';input.value=''})
bind('#addBtn',()=>{const raw=(input.value||'').split(',').map(s=>s.trim()).filter(Boolean);TOKENS=uniqueTokens([...TOKENS,...raw]);renderChips();input.value=''})
                function renderChips(){chips.innerHTML = '';for(const t of uniqueTokens(TOKENS)){const b=document.createElement('button');b.textContent=`${t} ✕`;b.style.cssText='padding:6px 12px;margin:4px;border-radius:999px;border:1px solid #ffffff22;background:#1118;color:#fff;';b.onclick=()=>{TOKENS = uniqueTokens(TOKENS.filter(x => x.toLowerCase() !== t.toLowerCase()));renderChips()};chips.appendChild(b)}}

                /* ===== Listening Map（重複なし／アルバム優先／ポップアップ） ===== */
                async function bestImage(name){const e=encodeURIComponent(name);try{let r=await fetch(`https://itunes.apple.com/search?term=${e}&entity=album&attribute=artistTerm&limit=1`);let j=await r.json();let a=j.results?.[0];if(a?.artworkUrl100)return a.artworkUrl100.replace('100x100','300x300');r=await fetch(`https://itunes.apple.com/search?term=${e}&entity=musicTrack&attribute=artistTerm&limit=1`);j=await r.json();a=j.results?.[0];if(a?.artworkUrl100)return a.artworkUrl100.replace('100x100','300x300');r=await fetch(`https://itunes.apple.com/search?term=${e}&entity=musicArtist&limit=1`);j=await r.json();a=j.results?.[0];if(a?.artworkUrl100)return a.artworkUrl100.replace('100x100','300x300')}catch{ }return `https://picsum.photos/seed/${e}/300/300`}
                async function artistSummary(name){try{const j=await fetch(`https://ja.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`).then(r=>r.json());return j.extract||''}catch{return ''}}
                function popupArtist(name){(async () => { const img = await bestImage(name); const sum = await artistSummary(name); let apple = `https://music.apple.com/us/search?term=${encodeURIComponent(name)}&app=music`; try { const info = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(name)}&entity=musicArtist&limit=1`).then(r => r.json()); if (info.results?.[0]?.artistLinkUrl) apple = info.results[0].artistLinkUrl } catch { } const yt = `https://www.youtube.com/results?search_query=${encodeURIComponent(name + ' official')}`; const p = document.createElement('div'); p.style.cssText = 'position:fixed;inset:0;display:flex;justify-content:center;align-items:center;background:rgba(0,0,0,.55);backdrop-filter:blur(10px);z-index:5000'; p.innerHTML = `<div style="max-width:440px;width:92%;border-radius:18px;padding:16px;border:1px solid rgba(255,255,255,.25);background:linear-gradient(180deg,rgba(255,255,255,.18),rgba(255,255,255,.08));box-shadow:0 10px 30px rgba(0,0,0,.25)"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><strong style="font-size:16px">🎵 ${name}</strong><button id="popClose" class="cta" style="padding:6px 10px">×</button></div><img src="${img}" style="width:100%;max-height:240px;object-fit:cover;border-radius:12px;box-shadow:0 0 25px rgba(255,255,180,.5)"><p style="margin-top:8px;font-size:13px;opacity:.95;line-height:1.6">${sum || '（概要が見つかりませんでした）'}</p><div style="display:flex;gap:16px;align-items:center;justify-content:center;margin-top:10px"><a href="${apple}" target="_blank"> Apple</a><a href="${yt}" target="_blank">▶︎ YouTube</a></div></div>`; p.addEventListener('click', e => { if (e.target.id === 'popClose' || e.target === p) p.remove() }); document.body.appendChild(p) })()}
                async function renderMap(){const area=document.getElementById('mapArea');area.innerHTML='';for(const n of uniqueTokens(TOKENS)){const img=await bestImage(n);const color=`hsl(${[...n].reduce((a, c) => a + c.charCodeAt(0), 0) % 360} 90% 65%)`;const b=document.createElement('div');b.className='bubble';b.style.boxShadow=`0 0 22px ${color}`;b.innerHTML=`<img src="${img}" alt="${n}" style="width:100%;height:100%;object-fit:cover;border-radius:50%"><span class="bubbleName">${n}</span>`;b.onclick=()=>popupArtist(n);area.appendChild(b)}}

                    /* ===== Emotion（ジャンル色プロット） ===== */
                    async function drawEmotion(){const cv=document.getElementById('emotion'),ctx=cv.getContext('2d');cv.width=cv.clientWidth;cv.height=260;const W=cv.width,H=cv.height;ctx.clearRect(0,0,W,H);ctx.fillStyle="rgba(255,255,255,.06)";ctx.fillRect(0,0,W,H);ctx.strokeStyle="rgba(255,255,255,.25)";ctx.beginPath();ctx.moveTo(40,H-40);ctx.lineTo(W-20,H-40);ctx.stroke();ctx.beginPath();ctx.moveTo(40,H-40);ctx.lineTo(40,20);ctx.stroke();ctx.fillStyle='#fff';ctx.font='14px system-ui';ctx.fillText('穏やか',46,H-12);ctx.fillText('高揚',W-60,H-12);ctx.save();ctx.translate(16,28);ctx.rotate(-Math.PI/2);ctx.fillText('静',0,0);ctx.restore();ctx.fillText('動',18,28);const colors={Pop:'#ff66cc',Rock:'#ff6666',Jazz:'#66ccff',Electronic:'#aa88ff',HipHop:'#f39c12',World:'#2ecc71',Other:'#ffd966'};for(const name of uniqueTokens(TOKENS)){let g='Other';try{const j=await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(name)}&entity=musicArtist&limit=1`).then(r=>r.json());g=j.results?.[0]?.primaryGenreName||'Other'}catch{ }const col=colors[g]||colors.Other;const x=40+Math.random()*(W-80),y=20+Math.random()*(H-80);const grad=ctx.createRadialGradient(x,y,0,x,y,26);grad.addColorStop(0,col);grad.addColorStop(1,'transparent');ctx.fillStyle=grad;ctx.beginPath();ctx.arc(x,y,26,0,Math.PI*2);ctx.fill()}document.getElementById('emotionTip').textContent='ジャンルカラーでムードを可視化（右上=アゲ／左下=チル）'}

                    /* ===== Love（下端から%一致で満たす） ===== */
                    function calcLove(){const n=uniqueTokens(TOKENS).length;const u=new Set(uniqueTokens(TOKENS).map(t=>t.toLowerCase())).size;const s=Math.min(100,Math.round(n*7+u*5));const h=120*(s/100),y=160-h;document.getElementById('lovePercent').textContent=s+'%';const rect=document.getElementById('loveFill');rect.setAttribute('y',y);rect.setAttribute('height',Math.max(0,h));document.getElementById('loveComment').textContent=s<40?'静かに整うムード。ディテールを味わおう。':s<70?'心拍と音が寄り添い始めた。好奇心のアンテナを。':'音と気持ちが完全にシンクロ！'}

                    /* ===== Vector / Work（バー＋ドーナツ） ===== */
                    const VEC_COLORS=[{key:'energy',label:'エネルギー',color:'#ffcc33'},{key:'sophistication',label:'洗練',color:'#ff9933'},{key:'groove',label:'ノリ',color:'#ffaa66'},{key:'structure',label:'構成力',color:'#66ccff'},{key:'experiment',label:'実験性',color:'#aa88ff'},{key:'urban',label:'都会感',color:'#77ff88'},{key:'global',label:'グローバル感',color:'#ffd966'}]
                    const WORK_PAL=['#ffcc33','#ff8a33','#66ccff','#77ff88','#aa88ff']
                    function randomVec(){return{energy:Math.random(),sophistication:Math.random(),groove:Math.random(),structure:Math.random(),experiment:Math.random(),urban:Math.random(),global:Math.random()}}
                    function drawDonut(id,vals,colors,step=0.05,legend){const cv=document.getElementById(id);if(!cv)return;const ctx=cv.getContext('2d');const W=cv.width,H=cv.height,cx=W/2,cy=H/2,R=Math.min(W,H)*.42,r=Math.min(W,H)*.22,total=vals.reduce((a,b)=>a+b,0)||1;let prog=0;(function frame(){ctx.clearRect(0, 0, W, H);let st=-Math.PI/2;vals.forEach((v,i)=>{const full=(v/total)*Math.PI*2,arc=full*Math.min(1,prog);ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,R,st,st+arc);ctx.closePath();ctx.fillStyle=colors[i%colors.length];ctx.fill();st+=full});ctx.globalCompositeOperation='destination-out';ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();ctx.globalCompositeOperation='source-over';if(legend){const L=document.getElementById(id==='vectorPie'?'vectorLegend':'workLegend');if(L){L.innerHTML = id === 'vectorPie' ? '凡例：' + VEC_COLORS.map(o => `<span style="display:inline-block;width:10px;height:10px;background:${o.color};border-radius:2px;margin:0 6px 0 10px"></span>${o.label}`).join('') : '凡例：<span style="display:inline-block;width:10px;height:10px;background:#ffcc33;border-radius:2px;margin:0 6px 0 10px"></span>協働力<span style="display:inline-block;width:10px;height:10px;background:#ff8a33;border-radius:2px;margin:0 6px 0 10px"></span>計画力<span style="display:inline-block;width:10px;height:10px;background:#66ccff;border-radius:2px;margin:0 6px 0 10px"></span>創造力<span style="display:inline-block;width:10px;height:10px;background:#77ff88;border-radius:2px;margin:0 6px 0 10px"></span>共感力<span style="display:inline-block;width:10px;height:10px;background:#aa88ff;border-radius:2px;margin:0 6px 0 10px"></span>リーダーシップ'}}prog+=step;if(prog<1)requestAnimationFrame(frame)})()}
                    function drawVector(){const v=randomVec();const bars=document.getElementById('profileBars');bars.innerHTML='';VEC_COLORS.forEach(({key, label, color})=>{const pct=Math.round(v[key]*100);const w=document.createElement('div');w.innerHTML=`<div class="kpi"><div>${label}</div><div>${pct}%</div></div><div class="bar"><div class="fill" style="width:0%;background:${color}"></div></div>`;bars.appendChild(w);setTimeout(()=>w.querySelector('.fill').style.width=pct+'%',100)});drawDonut('vectorPie',VEC_COLORS.map(o=>v[o.key]),VEC_COLORS.map(o=>o.color),0.05,true)}
                    function drawAbilities(v){const el=document.getElementById('abilities');el.innerHTML='';const s={協働力:(v.groove+v.urban)/2,計画力:(v.structure+v.sophistication)/2,創造力:(v.experiment+v.energy)/2,共感力:(v.urban+v.global)/2,リーダーシップ:(v.energy+v.structure)/2};Object.entries(s).forEach(([k,val])=>{const pct=Math.round(val*100);const row=document.createElement('div');row.innerHTML=`<div class="kpi"><div>${k}</div><div>${pct}%</div></div><div class="bar"><div class="fill" style="width:0%"></div></div>`;el.appendChild(row);setTimeout(()=>row.querySelector('.fill').style.width=pct+'%',100)});drawDonut('workPie',Object.values(s),WORK_PAL,0.06,true)}

                    /* ===== Recs（30秒試聴つき） ===== */
                    async function getArtistInfo(nm){const e=encodeURIComponent(nm);try{const r=await fetch(`https://itunes.apple.com/search?term=${e}&entity=musicArtist&limit=1`);const j=await r.json();const a=j.results?.[0];if(!a)return null;return{id:a.artistId,name:a.artistName,genre:a.primaryGenreName||'Other',link:a.artistLinkUrl||`https://music.apple.com/us/search?term=${e}&app=music`,img:a.artworkUrl100?a.artworkUrl100.replace('100x100','300x300'):`https://picsum.photos/seed/${e}/300/300`}}catch{return null}}
                    async function getPreviewUrl(nm){const e=encodeURIComponent(nm);try{const r=await fetch(`https://itunes.apple.com/search?term=${e}&entity=musicTrack&attribute=artistTerm&limit=1`);const j=await r.json();return j.results?.[0]?.previewUrl||""}catch{return""}}
                    async function getSimilarArtists(tokens,max=6){const exclude=new Set(tokens.map(x=>x.toLowerCase())),genres=new Set(),pool=[];for(const n of tokens){const info=await getArtistInfo(n);if(info?.genre)genres.add(info.genre)}for(const g of genres){const e=encodeURIComponent(g);try{const j=await fetch(`https://itunes.apple.com/search?term=${e}&entity=musicArtist&limit=30`).then(r=>r.json());(j.results||[]).forEach(a=>{if(!a.artistName)return;const nm=a.artistName.trim();if(exclude.has(nm.toLowerCase()))return;pool.push({id:a.artistId,name:nm,link:a.artistLinkUrl||`https://music.apple.com/us/search?term=${encodeURIComponent(nm)}&app=music`,img:a.artworkUrl100?a.artworkUrl100.replace('100x100','300x300'):`https://picsum.photos/seed/${encodeURIComponent(nm)}/300/300`})})}catch{ }}const seen=new Set(),out=[];for(const a of pool){const k=(a.name+':'+a.id).toLowerCase();if(seen.has(k))continue;seen.add(k);out.push(a)}return out.slice(0,max)}
                    async function renderRecommendations(){const box=document.getElementById('recs');const list=uniqueTokens(TOKENS);if(!list.length){box.innerHTML = '<div style="opacity:.75">アーティストを入力して Analyze を押してください。</div>';return}const recs=await getSimilarArtists(list,6);if(!recs.length){box.innerHTML = '<div style="opacity:.75">おすすめが見つかりませんでした。</div>';return}const rows=await Promise.all(recs.map(async a=>{const preview=await getPreviewUrl(a.name);const yt=`https://www.youtube.com/results?search_query=${encodeURIComponent(a.name + ' official')}`;return `<div style="display:flex;align-items:center;gap:12px;margin:10px 0"><img src="${a.img}" alt="${a.name}" style="width:56px;height:56px;border-radius:10px;object-fit:cover"><div style="flex:1;min-width:0"><div style="font-weight:800">${a.name}</div><div style="display:flex;gap:12px;align-items:center;margin-top:6px"><a href="${a.link}" target="_blank"> Apple</a><a href="${yt}" target="_blank">▶︎ YouTube</a></div>${preview ? `<audio controls preload="none" style="margin-top:6px;width:100%;max-width:340px"><source src="${preview}"></audio>` : `<div style="margin-top:6px;opacity:.65">（プレビューなし）</div>`}</div></div>`}));box.innerHTML=rows.join('')}

                    /* ===== 進捗 → 描画順序（確定） ===== */
                    const pw=document.getElementById('progressWrap'),pf=document.getElementById('progfill'),pt=document.getElementById('progtext')
                    function startProgress(cb){pw.style.display = 'block';pf.style.width='0%';pt.textContent='0%';let p=0;const id=setInterval(()=>{p = Math.min(100, p + 6);pf.style.width=p+'%';pt.textContent=p+'%'},70);cb().finally(()=>{clearInterval(id);setTimeout(()=>pw.style.display='none',120)})}
bind('#analyzeBtn',()=>startProgress(analyze))
                    async function analyze(){if(!TOKENS.length){alert('アーティスト/曲を入れてください');return}TOKENS=uniqueTokens(TOKENS);await renderMap().catch(()=>{ });await raf();await drawEmotion().catch(()=>{ });await raf();await calcLove().catch(()=>{ });await raf();const v=randomVec();await drawVector().catch(()=>{ });await raf();await drawAbilities(v).catch(()=>{ });await raf();await renderRecommendations().catch(()=>{ })}

/* ===== Sora トップFAB（保険） ===== */
document.addEventListener('DOMContentLoaded',()=>{['#soraFab', '#soraFabTop'].forEach(s => bind(s, openSora))})
            </script>
        </body>
    </html>