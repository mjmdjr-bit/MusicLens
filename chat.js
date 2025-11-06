const modal = document.getElementById('chat-modal');
const logEl = document.getElementById('chat-log');
const inputEl = document.getElementById('sora-input');
const openBtn = document.getElementById('btn-open-chat');
const closeBtn = document.getElementById('chat-close');
const sendBtn = document.getElementById('chat-send');

const WORKER_BASE = (window.ML_WORKER_BASE ?? '').replace(/\/+$/, '');

function openModal() { modal?.setAttribute('aria-hidden', 'false'); setTimeout(() => inputEl?.focus(), 30); }
function closeModal() { modal?.setAttribute('aria-hidden', 'true'); }

openBtn?.addEventListener('click', openModal);
closeBtn?.addEventListener('click', closeModal);
sendBtn?.addEventListener('click', sendMsg);
inputEl?.addEventListener('keydown', e => { if (e.key === 'Enter') sendMsg(); });

function appendMsg(text, who = 'me') {
    if (!logEl) return;
    const div = document.createElement('div'); div.className = `msg ${who}`; div.textContent = text;
    logEl.appendChild(div); logEl.scrollTop = logEl.scrollHeight;
}

async function sendMsg() {
    const text = inputEl?.value.trim(); if (!text) return;
    inputEl.value = ''; appendMsg(text, 'me');

    if (!WORKER_BASE) {
        setTimeout(() => appendMsg('（モック応答）Sora ready. 「' + text + '」受け取りました。', 'ai'), 120);
        return;
    }

    const ac = new AbortController(); const timer = setTimeout(() => ac.abort(), 58000);
    try {
        const res = await fetch(`${WORKER_BASE}/chat`, {
            method: 'POST', mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: [{ role: 'user', content: text }] }), signal: ac.signal
        });
        if (!res.ok) { const body = await res.text().catch(() => '(no body)'); appendMsg(`エラー ${res.status}: ${body.slice(0, 160)}`, 'ai'); return; }

        const reader = res.body.getReader(); const dec = new TextDecoder();
        let buf = '', ai = ''; appendMsg('…', 'ai'); const ph = logEl.lastElementChild;
        while (true) {
            const { done, value } = await reader.read(); if (done) break;
            buf += dec.decode(value, { stream: true });
            const parts = buf.split('\n\n'); buf = parts.pop() ?? '';
            for (const p of parts) {
                if (p.startsWith('data: ')) {
                    try { const j = JSON.parse(p.slice(6)); if (j.delta) { ai += j.delta; ph.textContent = ai; } } catch { }
                }
            }
        }
    } catch (e) { appendMsg('ネットワーク/タイムアウトで失敗しました。', 'ai'); }
    finally { clearTimeout(timer); }
}
