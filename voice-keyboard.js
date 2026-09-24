/* DBYC - Tamil & English Voice Typing and Virtual Keyboard Module */
const VoiceKeyboard = {
  _activeInput: null,
  _recognition: null,
  _isListening: false,
  _currentLang: 'ta-IN', // 'ta-IN' or 'en-IN'
  _keyboardVisible: false,
  _keyboardMode: 'tamil', // 'tamil' or 'english'

  init() {
    this.initSpeechRecognition();
    this.renderKeyboardContainer();
    this.attachInputListeners();
  },

  // 1. Web Speech API (Voice Typing in Tamil & English)
  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('SpeechRecognition API not supported on this browser.');
      return;
    }

    this._recognition = new SpeechRecognition();
    this._recognition.continuous = true;
    this._recognition.interimResults = true;
    this._recognition.lang = this._currentLang;

    this._recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript && this._activeInput) {
        const val = this._activeInput.value;
        const separator = (val && !val.endsWith(' ')) ? ' ' : '';
        this._activeInput.value = val + separator + finalTranscript.trim();
        this._activeInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    };

    this._recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        UI.toast('error', 'Mic Permission Denied', 'Please enable microphone access in your browser settings.');
        this.stopListening();
      }
    };

    this._recognition.onend = () => {
      if (this._isListening) {
        try {
          this._recognition.start();
        } catch (e) {
          this.stopListening();
        }
      } else {
        this.updateVoiceUI();
      }
    };
  },

  setLanguage(lang) {
    this._currentLang = lang;
    if (this._recognition) {
      this._recognition.lang = lang;
      if (this._isListening) {
        this._recognition.stop();
        setTimeout(() => {
          if (this._isListening) this._recognition.start();
        }, 200);
      }
    }
    const badge = document.getElementById('voice-lang-badge');
    if (badge) {
      badge.textContent = lang === 'ta-IN' ? 'தமிழ் (TA)' : 'English (EN)';
    }
    UI.toast('info', 'Voice Language', lang === 'ta-IN' ? 'குரல் உள்ளீடு: தமிழ் (Tamil Active)' : 'Voice Typing: English Active');
  },

  toggleListening(targetInputId = null) {
    if (targetInputId) {
      this._activeInput = document.getElementById(targetInputId);
    }
    if (!this._activeInput) {
      this._activeInput = document.activeElement;
      if (!this._activeInput || (this._activeInput.tagName !== 'INPUT' && this._activeInput.tagName !== 'TEXTAREA')) {
        this._activeInput = document.querySelector('.modal input:not([type=hidden]):not([type=file]), input.form-control');
      }
    }

    if (!this._recognition) {
      UI.toast('warning', 'Voice Not Supported', 'Speech recognition is not supported in this browser. Please use Chrome/Edge or the Tamil On-Screen Keyboard.');
      return;
    }

    if (this._isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
  },

  startListening() {
    try {
      this._isListening = true;
      this._recognition.lang = this._currentLang;
      this._recognition.start();
      this.updateVoiceUI();
      Utils.playBeep(true);
      UI.toast('info', 'Mic Listening 🎙️', this._currentLang === 'ta-IN' ? 'பேசுங்கள்... (Speak in Tamil)' : 'Listening... (Speak in English)');
    } catch (e) {
      console.warn(e);
      this.stopListening();
    }
  },

  stopListening() {
    this._isListening = false;
    if (this._recognition) {
      try { this._recognition.stop(); } catch (e) {}
    }
    this.updateVoiceUI();
  },

  updateVoiceUI() {
    const bar = document.getElementById('global-voice-bar');
    const micBtn = document.getElementById('global-mic-btn');
    if (micBtn) {
      if (this._isListening) {
        micBtn.classList.add('listening');
        micBtn.innerHTML = '🛑 Stop Voice';
      } else {
        micBtn.classList.remove('listening');
        micBtn.innerHTML = '🎙️ Voice Type';
      }
    }
    if (bar) {
      bar.style.display = this._isListening ? 'flex' : 'none';
    }
  },

  // 2. Track Active Input Focus for Keyboard & Voice
  attachInputListeners() {
    document.addEventListener('focusin', (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        if (e.target.type !== 'file' && e.target.type !== 'hidden' && e.target.type !== 'checkbox' && e.target.type !== 'radio') {
          this._activeInput = e.target;
        }
      }
    });
  },

  setActiveInput(el) {
    this._activeInput = el;
  },

  // 3. Tamil & English Virtual On-Screen Keyboard
  renderKeyboardContainer() {
    if (document.getElementById('virtual-keyboard-dock')) return;

    const dock = document.createElement('div');
    dock.id = 'virtual-keyboard-dock';
    dock.className = 'virtual-keyboard-dock hidden';
    dock.innerHTML = `
      <div class="vk-header">
        <div class="vk-title">
          <span id="vk-lang-title">⌨️ தமிழ் விசைப்பலகை (Tamil Keyboard)</span>
          <div class="vk-lang-toggles">
            <button type="button" class="btn btn-xs btn-outline active" id="btn-vk-tamil" onclick="VoiceKeyboard.switchKeyboardMode('tamil')">தமிழ்</button>
            <button type="button" class="btn btn-xs btn-outline" id="btn-vk-english" onclick="VoiceKeyboard.switchKeyboardMode('english')">English</button>
          </div>
        </div>
        <div class="vk-actions">
          <button type="button" class="btn btn-xs btn-ghost" onclick="VoiceKeyboard.toggleListening()" id="vk-mic-quick" title="Voice Typing">🎙️ Voice</button>
          <button type="button" class="vk-close-btn" onclick="VoiceKeyboard.toggleKeyboard(false)">✕</button>
        </div>
      </div>
      <div id="vk-keys-area" class="vk-keys-area"></div>
    `;
    document.body.appendChild(dock);

    // Floating Global Mic Bar for Speech Feedback
    const voiceBar = document.createElement('div');
    voiceBar.id = 'global-voice-bar';
    voiceBar.className = 'global-voice-bar';
    voiceBar.style.display = 'none';
    voiceBar.innerHTML = `
      <div class="voice-pulse-ring"></div>
      <span style="font-size:1.2rem">🎙️</span>
      <div style="flex:1">
        <div style="font-weight:700;font-size:12px" id="voice-listening-label">Listening... (பேசுங்கள்)</div>
        <div style="font-size:10px;color:rgba(255,255,255,0.8)">Tamil & English Dual Speech-to-Text</div>
      </div>
      <button class="btn btn-xs btn-outline" style="color:#fff;border-color:#fff" onclick="VoiceKeyboard.toggleLanguageSwitch()">
        <span id="voice-lang-badge">தமிழ் (TA)</span> 🔄
      </button>
      <button class="btn btn-xs btn-danger" onclick="VoiceKeyboard.stopListening()">Stop</button>
    `;
    document.body.appendChild(voiceBar);

    this.renderKeys();
  },

  toggleLanguageSwitch() {
    const next = this._currentLang === 'ta-IN' ? 'en-IN' : 'ta-IN';
    this.setLanguage(next);
  },

  switchKeyboardMode(mode) {
    this._keyboardMode = mode;
    const btnTa = document.getElementById('btn-vk-tamil');
    const btnEn = document.getElementById('btn-vk-english');
    const title = document.getElementById('vk-lang-title');
    if (mode === 'tamil') {
      btnTa?.classList.add('active');
      btnEn?.classList.remove('active');
      if (title) title.textContent = '⌨️ தமிழ் விசைப்பலகை (Tamil Keyboard)';
      this.setLanguage('ta-IN');
    } else {
      btnEn?.classList.add('active');
      btnTa?.classList.remove('active');
      if (title) title.textContent = '⌨️ English QWERTY Keyboard';
      this.setLanguage('en-IN');
    }
    this.renderKeys();
  },

  toggleKeyboard(forceState = null) {
    const dock = document.getElementById('virtual-keyboard-dock');
    if (!dock) return;
    this._keyboardVisible = (forceState !== null) ? forceState : !this._keyboardVisible;
    if (this._keyboardVisible) {
      dock.classList.remove('hidden');
      this.renderKeys();
    } else {
      dock.classList.add('hidden');
    }
  },

  renderKeys() {
    const area = document.getElementById('vk-keys-area');
    if (!area) return;

    if (this._keyboardMode === 'tamil') {
      const uyir = ['அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ', 'ஃ'];
      const matras = ['்', 'ா', 'ி', 'ீ', 'ு', 'ூ', 'ெ', 'ே', 'ை', 'ொ', 'ோ', 'ௌ'];
      const mei = [
        'க', 'ங', 'ச', 'ஞ', 'ட', 'ண',
        'த', 'ந', 'ப', 'ம', 'ய', 'ர',
        'ல', 'வ', 'ழ', 'ள', 'ற', 'ன',
        'ஜ', 'ஷ', 'ஸ', 'ஹ', 'க்ஷ', 'ஸ்ரீ'
      ];

      area.innerHTML = `
        <div class="vk-row-label">உயிர் எழுத்துக்கள் (Vowels)</div>
        <div class="vk-row">
          ${uyir.map(char => `<button type="button" class="vk-key" onclick="VoiceKeyboard.insertChar('${char}')">${char}</button>`).join('')}
        </div>

        <div class="vk-row-label">மெய் & உயிர்மெய் குறிகள் (Modifiers / Matras)</div>
        <div class="vk-row">
          ${matras.map(char => `<button type="button" class="vk-key vk-key-matra" onclick="VoiceKeyboard.insertChar('${char}')">${char}</button>`).join('')}
        </div>

        <div class="vk-row-label">மெய் எழுத்துக்கள் (Consonants)</div>
        <div class="vk-row-grid">
          ${mei.map(char => `<button type="button" class="vk-key vk-key-mei" onclick="VoiceKeyboard.insertChar('${char}')">${char}</button>`).join('')}
        </div>

        <div class="vk-bottom-bar">
          <button type="button" class="vk-key vk-key-wide" onclick="VoiceKeyboard.insertChar(' ')">Space (இடைவெளி)</button>
          <button type="button" class="vk-key vk-key-action" onclick="VoiceKeyboard.backspace()">⌫ அழி (Backspace)</button>
          <button type="button" class="vk-key vk-key-action" onclick="VoiceKeyboard.clearInput()">அனைத்தும் அழி (Clear)</button>
        </div>
      `;
    } else {
      // English Layout
      const r1 = ['1','2','3','4','5','6','7','8','9','0','-'];
      const r2 = ['Q','W','E','R','T','Y','U','I','O','P'];
      const r3 = ['A','S','D','F','G','H','J','K','L','@'];
      const r4 = ['Z','X','C','V','B','N','M','.',','];

      area.innerHTML = `
        <div class="vk-row">
          ${r1.map(char => `<button type="button" class="vk-key" onclick="VoiceKeyboard.insertChar('${char}')">${char}</button>`).join('')}
        </div>
        <div class="vk-row">
          ${r2.map(char => `<button type="button" class="vk-key" onclick="VoiceKeyboard.insertChar('${char}')">${char}</button>`).join('')}
        </div>
        <div class="vk-row">
          ${r3.map(char => `<button type="button" class="vk-key" onclick="VoiceKeyboard.insertChar('${char}')">${char}</button>`).join('')}
        </div>
        <div class="vk-row">
          ${r4.map(char => `<button type="button" class="vk-key" onclick="VoiceKeyboard.insertChar('${char}')">${char}</button>`).join('')}
        </div>
        <div class="vk-bottom-bar">
          <button type="button" class="vk-key vk-key-wide" onclick="VoiceKeyboard.insertChar(' ')">Space</button>
          <button type="button" class="vk-key vk-key-action" onclick="VoiceKeyboard.backspace()">⌫ Backspace</button>
          <button type="button" class="vk-key vk-key-action" onclick="VoiceKeyboard.clearInput()">Clear</button>
        </div>
      `;
    }
  },

  insertChar(char) {
    if (!this._activeInput) {
      this._activeInput = document.querySelector('.modal input:not([type=hidden]):not([type=file]), input.form-control');
    }
    if (!this._activeInput) return;

    const el = this._activeInput;
    const start = el.selectionStart || el.value.length;
    const end = el.selectionEnd || el.value.length;
    const val = el.value;

    el.value = val.substring(0, start) + char + val.substring(end);
    const newPos = start + char.length;
    el.focus();
    if (el.setSelectionRange) {
      el.setSelectionRange(newPos, newPos);
    }
    el.dispatchEvent(new Event('input', { bubbles: true }));
  },

  backspace() {
    if (!this._activeInput) return;
    const el = this._activeInput;
    const start = el.selectionStart || el.value.length;
    const end = el.selectionEnd || el.value.length;
    const val = el.value;

    if (start === end && start > 0) {
      el.value = val.substring(0, start - 1) + val.substring(end);
      const newPos = start - 1;
      el.focus();
      if (el.setSelectionRange) el.setSelectionRange(newPos, newPos);
    } else if (start !== end) {
      el.value = val.substring(0, start) + val.substring(end);
      el.focus();
      if (el.setSelectionRange) el.setSelectionRange(start, start);
    }
    el.dispatchEvent(new Event('input', { bubbles: true }));
  },

  clearInput() {
    if (!this._activeInput) return;
    this._activeInput.value = '';
    this._activeInput.focus();
    this._activeInput.dispatchEvent(new Event('input', { bubbles: true }));
  }
};

window.VoiceKeyboard = VoiceKeyboard;
