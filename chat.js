const modal = document.getElementById('chat-modal');
const openBtn = document.getElementById('btn-open-chat');
const closeBtn = document.getElementById('chat-close');
const logEl = document.getElementById('chat-log');
const inputEl = document.getElementById('sora-input');
const sendBtn = document.getElementById('chat-send');

if (openBtn && modal) {
    function open() { modal.setAttribute('aria-hidden', 'false'); setTimeout(() => inputEl?.focus(), 50); }
    function close() { modal.setAttribute('aria-hidden', 'true'); }
    openBtn.addEventListener('click', open);
    closeBtn?.addEventListener('click', close);
    sendBtn?.addEventListener('click', send);

    function append(text, who = 'me') { const div = document.createElement('div'); div.className = `msg ${who}`; div.textContent = text; logEl?.appendChild(div); logEl.scrollTop = logEl.scrollHeight; }
    function send() { const t = inputEl.value.trim(); if (!t) return; inputEl.value = ''; append(t, 'me'); append('（デモ応答）Sora ready.', 'ai'); }
}
