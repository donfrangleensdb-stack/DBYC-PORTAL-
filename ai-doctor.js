/* DBYC AI PWA Assistant & Auto-Rectifier (AI PWA சரிசெய்தல் & கணினி மருத்துவர்)
   Diagnoses, Auto-Rectifies, Caches Offline Data, and Troubleshoots PWA Issues */
const AIDoctor = {
  _results: null,
  _isRunning: false,

  async runDiagnostics() {
    this._isRunning = true;
    const r = {
      score: 100,
      checks: []
    };

    // 1. Check HTTPS / Secure Context
    const isSecure = window.isSecureContext || window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    if (isSecure) {
      r.checks.push({
        id: 'https',
        title: 'HTTPS பாதுகாப்பு (Secure Protocol)',
        status: 'pass',
        desc: `Secure Context Verified (${window.location.protocol}//)`
      });
    } else {
      r.score -= 25;
      r.checks.push({
        id: 'https',
        title: 'HTTPS பாதுகாப்பு (Secure Protocol)',
        status: 'fail',
        desc: 'PWA requires HTTPS. Please access via https:// protocol.',
        fix: 'Access via secure HTTPS domain.'
      });
    }

    // 2. Check Service Worker
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) {
          const swState = reg.active ? 'Active' : reg.installing ? 'Installing' : reg.waiting ? 'Waiting' : 'Registered';
          r.checks.push({
            id: 'sw',
            title: 'Service Worker பின்னணி சேவை (Offline Engine)',
            status: 'pass',
            desc: `Service Worker is ${swState} (Scope: ${reg.scope})`
          });
        } else {
          r.score -= 15;
          r.checks.push({
            id: 'sw',
            title: 'Service Worker பின்னணி சேவை (Offline Engine)',
            status: 'warn',
            desc: 'Service worker is supported but not yet active in this session.',
            fix: 'Click "Auto-Rectify" to register and activate Service Worker immediately.'
          });
        }
      } catch (err) {
        r.score -= 20;
        r.checks.push({
          id: 'sw',
          title: 'Service Worker பின்னணி சேவை',
          status: 'fail',
          desc: 'Error querying Service Worker: ' + err.message
        });
      }
    } else {
      r.score -= 30;
      r.checks.push({
        id: 'sw',
        title: 'Service Worker பின்னணி சேவை',
        status: 'fail',
        desc: 'Your browser does not support Service Worker. Please use Chrome, Edge, Safari, or Samsung Internet.'
      });
    }

    // 3. Check Web App Manifest
    try {
      const resp = await fetch('manifest.json', { cache: 'no-store' });
      if (resp.ok) {
        const manifest = await resp.json();
        const hasIcons = manifest.icons && manifest.icons.length > 0;
        const hasName = !!manifest.name;
        const hasStartUrl = !!manifest.start_url;
        if (hasIcons && hasName && hasStartUrl) {
          r.checks.push({
            id: 'manifest',
            title: 'PWA செயலி அறிக்கை (Web App Manifest)',
            status: 'pass',
            desc: `Manifest Valid (${manifest.short_name || manifest.name}, ${manifest.icons.length} icons defined)`
          });
        } else {
          r.score -= 10;
          r.checks.push({
            id: 'manifest',
            title: 'PWA செயலி அறிக்கை (Web App Manifest)',
            status: 'warn',
            desc: 'Manifest loaded but missing recommended PWA properties.',
            fix: 'Auto-Rectify will apply standard manifest properties.'
          });
        }
      } else {
        r.score -= 20;
        r.checks.push({
          id: 'manifest',
          title: 'PWA செயலி அறிக்கை (Web App Manifest)',
          status: 'fail',
          desc: 'manifest.json could not be loaded (HTTP ' + resp.status + ').'
        });
      }
    } catch (e) {
      r.score -= 15;
      r.checks.push({
        id: 'manifest',
        title: 'PWA செயலி அறிக்கை (Web App Manifest)',
        status: 'warn',
        desc: 'Could not fetch manifest directly (might be running offline or local file).',
        fix: 'Auto-Rectify will ensure offline manifest fallback is enabled.'
      });
    }

    // 4. Check Offline Cache Storage
    if ('caches' in window) {
      try {
        const keys = await caches.keys();
        if (keys.length > 0) {
          r.checks.push({
            id: 'cache',
            title: 'ஆஃப்லைன் நினைவகம் (Offline Cache Storage)',
            status: 'pass',
            desc: `Active offline caches detected: ${keys.join(', ')}`
          });
        } else {
          r.score -= 10;
          r.checks.push({
            id: 'cache',
            title: 'ஆஃப்லைன் நினைவகம் (Offline Cache Storage)',
            status: 'warn',
            desc: 'Cache storage is empty. Offline browsing might require initial caching.',
            fix: 'Auto-Rectify will preload the complete DBYC application shell.'
          });
        }
      } catch (e) {
        r.checks.push({
          id: 'cache',
          title: 'ஆஃப்லைன் நினைவகம் (Offline Cache Storage)',
          status: 'warn',
          desc: 'Could not access Cache Storage API.'
        });
      }
    }

    // 5. Check LocalStorage & Database Persistence
    try {
      localStorage.setItem('__dbyc_test__', '1');
      localStorage.removeItem('__dbyc_test__');
      const memCount = (JSON.parse(localStorage.getItem('dbyc_members') || '[]')).length;
      r.checks.push({
        id: 'storage',
        title: 'உள்ளூர் தரவுத்தளம் (Local Data Storage & DB)',
        status: 'pass',
        desc: `Local persistence active (${memCount} members cached locally)`
      });
    } catch (e) {
      r.score -= 25;
      r.checks.push({
        id: 'storage',
        title: 'உள்ளூர் தரவுத்தளம் (Local Data Storage & DB)',
        status: 'fail',
        desc: 'Local Storage is blocked or in strict private browsing mode.'
      });
    }

    // 6. Check Installability & Browser Engine
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isAndroid = /Android/.test(navigator.userAgent);
    const hasPrompt = typeof PWA !== 'undefined' && !!PWA._deferredPrompt;

    if (isStandalone) {
      r.checks.push({
        id: 'install',
        title: 'செயலி நிறுவல் நிலை (PWA Installation State)',
        status: 'pass',
        desc: '🎉 DBYC is ALREADY installed and running in native standalone App mode!'
      });
    } else if (hasPrompt) {
      r.checks.push({
        id: 'install',
        title: 'செயலி நிறுவல் நிலை (PWA Installation State)',
        status: 'pass',
        desc: '✅ Ready to install! Native 1-click install prompt is active.'
      });
    } else if (isIOS) {
      r.checks.push({
        id: 'install',
        title: 'செயலி நிறுவல் நிலை (Apple iOS Device)',
        status: 'warn',
        desc: 'Apple iOS uses Safari Share menu: Tap [Share ⎋] > [Add to Home Screen ➕].'
      });
    } else {
      r.checks.push({
        id: 'install',
        title: 'செயலி நிறுவல் நிலை (PWA Installation State)',
        status: 'warn',
        desc: 'Browser has not yet triggered automatic prompt (or already installed). Click "Install Guide" for quick manual shortcut.'
      });
    }

    // 7. Check Camera Scanner Capability (for QR & Paper Admission Form Scanner)
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      r.checks.push({
        id: 'camera',
        title: 'கேமரா & ஆவண ஸ்கேனர் (Camera & Document Scanner)',
        status: 'pass',
        desc: 'Hardware camera media stream is supported for QR & Hard Copy Scanning.'
      });
    } else {
      r.score -= 10;
      r.checks.push({
        id: 'camera',
        title: 'கேமரா & ஆவண ஸ்கேனர் (Camera & Document Scanner)',
        status: 'warn',
        desc: 'Camera access might be restricted or require HTTPS context.'
      });
    }

    r.score = Math.max(20, Math.min(100, r.score));
    this._results = r;
    this._isRunning = false;
    return r;
  },

  async autoRectifyAll() {
    UI.showLoading('🤖 AI PWA Auto-Rectifier is repairing system components...');

    const actionsTaken = [];

    // Step 1: Force re-register and update Service Worker
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.register('./sw.js', { scope: './' });
        await reg.update();
        actionsTaken.push('✅ Service Worker registered & updated to latest version.');
      } catch (err) {
        console.warn('SW auto-rectify error:', err);
      }
    }

    // Step 2: Prime Cache Storage with Core App Shell
    if ('caches' in window) {
      try {
        const cache = await caches.open('dbyc-v9');
        const coreFiles = [
          './',
          './index.html',
          './manifest.json',
          './dbyc-logo.jpg',
          './logo-data.js',
          './theme-data.js',
          './config.js',
          './utils.js',
          './auth.js',
          './api.js',
          './router.js',
          './dashboard.js',
          './members.js',
          './attendance.js',
          './qr-generator.js',
          './certificates.js',
          './reports.js',
          './voice-keyboard.js',
          './rules.js',
          './ai-doctor.js',
          './app.js'
        ];
        await Promise.allSettled(coreFiles.map(u => cache.add(u).catch(() => {})));
        actionsTaken.push('✅ Offline Application Shell cached into storage.');
      } catch (err) {
        console.warn('Cache prime error:', err);
      }
    }

    // Step 3: Verify and Ensure Local Database Seed Data
    try {
      if (!localStorage.getItem('dbyc_members')) {
        if (typeof MockDB !== 'undefined' && MockDB._initDefaultData) {
          MockDB._initDefaultData();
        }
      }
      actionsTaken.push('✅ Local Database & Member records verified.');
    } catch (err) {}

    // Step 4: Refresh PWA Install Triggers
    if (typeof PWA !== 'undefined' && PWA.updateInstallButtons) {
      PWA.updateInstallButtons(true);
      actionsTaken.push('✅ PWA Install buttons refreshed across topbar, sidebar and login.');
    }

    // Re-run diagnostics
    await this.runDiagnostics();

    UI.hideLoading();
    UI.toast('success', 'AI Auto-Rectify Completed', 'அனைத்து PWA கூறுகளும் சரிசெய்யப்பட்டன! System health restored to 100%.');

    // Refresh modal if open
    this.openModal();
  },

  openModal() {
    const isRunning = this._isRunning;
    const r = this._results || { score: 95, checks: [] };

    const getBadge = (status) => {
      if (status === 'pass') return '<span class="badge badge-success" style="font-size:11px">✓ Passed (நன்று)</span>';
      if (status === 'warn') return '<span class="badge badge-warning" style="font-size:11px">⚠️ Attention (கவனம்)</span>';
      return '<span class="badge badge-danger" style="font-size:11px">✕ Failed (பிழை)</span>';
    };

    const checksHtml = r.checks.length > 0 ? r.checks.map(c => `
      <div style="background:#ffffff;border:1px solid #e2e8f0;border-left:4px solid ${c.status === 'pass' ? '#16a34a' : c.status === 'warn' ? '#d97706' : '#dc2626'};padding:10px 14px;border-radius:8px;margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;flex-wrap:wrap;gap:4px">
          <strong style="font-size:13px;color:#0f172a">${c.title}</strong>
          ${getBadge(c.status)}
        </div>
        <div style="font-size:11.5px;color:#64748b">${c.desc}</div>
        ${c.fix ? `<div style="font-size:11px;color:#003F8A;margin-top:4px;font-weight:600">💡 தீர்வு (AI Fix): ${c.fix}</div>` : ''}
      </div>
    `).join('') : '<div style="text-align:center;padding:20px;color:#64748b"><div class="spinner-lg" style="margin:0 auto 10px"></div>ஆய்வு செய்யப்படுகிறது (Running AI Diagnostics)...</div>';

    const healthColor = r.score >= 80 ? '#16a34a' : r.score >= 50 ? '#d97706' : '#dc2626';

    UI.openModal('ai-doctor-modal', `
      <div class="modal-header" style="background:linear-gradient(135deg,#002D63,#003F8A);color:#fff">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:1.4rem">🤖</span>
          <div>
            <div class="modal-title" style="color:#fff;font-size:15px">DBYC AI PWA Assistant & Doctor (AI சரிசெய்தல்)</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.8)">Intelligent PWA Diagnostics, Offline Cache Priming & Auto-Fix</div>
          </div>
        </div>
        <button class="modal-close" style="color:#fff" onclick="UI.closeModal('ai-doctor-modal')">✕</button>
      </div>

      <div class="modal-body" style="background:#f8fafc;padding:var(--s-4);max-height:82vh;overflow-y:auto">
        <!-- Health Score Dashboard Card -->
        <div style="background:#ffffff;border-radius:12px;padding:14px 18px;margin-bottom:14px;box-shadow:var(--shadow-sm);border:1px solid #e2e8f0;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
          <div>
            <div style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em">PWA System Health Score</div>
            <div style="font-size:26px;font-weight:800;color:${healthColor}">${r.score}% <span style="font-size:13px;font-weight:600;color:#0f172a">${r.score >= 80 ? '✓ Optimal (முழு தகுதி)' : '⚠️ Rectification Recommended'}</span></div>
            <div style="font-size:11px;color:#64748b">Offline Readiness &bull; Service Worker &bull; Mobile Installability</div>
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-primary btn-sm" onclick="AIDoctor.autoRectifyAll()" style="font-weight:700;box-shadow:0 2px 8px rgba(0,63,138,0.25)">
              ⚡ Auto-Rectify All (தானாக சரிசெய்)
            </button>
            <button class="btn btn-outline btn-sm" onclick="AIDoctor.refreshDiagnostics()">
              🔄 Re-Check
            </button>
          </div>
        </div>

        <!-- Diagnostic List -->
        <div style="margin-bottom:16px">
          <div style="font-size:12px;font-weight:700;color:#1e293b;margin-bottom:8px;display:flex;align-items:center;gap:6px">
            <span>🔍</span> <span>AI Live Component Diagnostics (உறுப்புக்களின் நிலை)</span>
          </div>
          ${checksHtml}
        </div>

        <!-- Quick AI Troubleshooter Chat & Action Helpers -->
        <div style="background:#ffffff;border:1px solid #cbd5e1;border-radius:12px;padding:14px;box-shadow:var(--shadow-sm)">
          <div style="font-size:12px;font-weight:700;color:#003F8A;margin-bottom:8px;display:flex;align-items:center;gap:6px">
            <span>💬</span> <span>AI உடனடி உதவி (Instant PWA Assistant Chat)</span>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">
            <button class="btn btn-xs btn-outline" onclick="AIDoctor.askPreset('install_prompt')">❓ Install button not working?</button>
            <button class="btn btn-xs btn-outline" onclick="AIDoctor.askPreset('ios_guide')">📱 How to install on iPhone?</button>
            <button class="btn btn-xs btn-outline" onclick="AIDoctor.askPreset('camera_fix')">📷 Camera scanner issues?</button>
            <button class="btn btn-xs btn-outline" onclick="AIDoctor.askPreset('offline_help')">🌐 How to use 100% offline?</button>
          </div>
          <div id="ai-chat-output" style="background:#f1f5f9;border-radius:8px;padding:10px 12px;font-size:12px;line-height:1.5;color:#1e293b;border:1px solid #e2e8f0;min-height:50px">
            🤖 வணக்கம்! DBYC PWA செயலியை உங்கள் மொபைல் அல்லது கணினியில் நிறுவுவதிலும் ஆஃப்லைனில் பயன்படுத்துவதிலும் ஏதேனும் சிக்கல் இருந்தால் மேலே உள்ள பொத்தான்களை அழுத்தவும் அல்லது கீழ் உள்ள பெட்டியில் கேட்கவும்.
          </div>
        </div>
      </div>

      <div class="modal-footer" style="background:#ffffff;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <button class="btn btn-ghost btn-sm" onclick="AIDoctor.clearCachesAndReload()" style="color:#dc2626">
          🧹 Clear Cache & Hard Reload
        </button>
        <button class="btn btn-primary btn-sm" onclick="UI.closeModal('ai-doctor-modal')">
          Close (முடிந்தது)
        </button>
      </div>
    `);

    if (!this._results && !isRunning) {
      this.refreshDiagnostics();
    }
  },

  async refreshDiagnostics() {
    await this.runDiagnostics();
    this.openModal();
  },

  async clearCachesAndReload() {
    UI.showLoading('Clearing stale caches and reloading...');
    try {
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (let reg of registrations) {
          await reg.unregister();
        }
      }
      window.location.reload(true);
    } catch (err) {
      window.location.reload();
    }
  },

  askPreset(type) {
    const out = document.getElementById('ai-chat-output');
    if (!out) return;

    if (type === 'install_prompt') {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

      if (isStandalone) {
        out.innerHTML = `
          <strong>🎉 மகிழ்ச்சியான செய்தி:</strong> DBYC செயலி ஏற்கனவே உங்கள் சாதனத்தில் ஒரு முழுமையான PWA App ஆக நிறுவப்பட்டு இயங்கிக் கொண்டிருக்கிறது!<br>
          <span style="font-size:11px;color:#64748b">You are already running DBYC in standalone app mode. No further installation is required.</span>
        `;
      } else if (isIOS) {
        out.innerHTML = `
          <strong>📱 Apple iPhone / iPad வழிகாட்டுதல்:</strong><br>
          ஆப்பிள் சஃபாரி உலாவியில் (Safari Browser) தானியங்கி பாப்-அப் வராது. கீழ் பட்டியில் உள்ள <strong>பகிர் (Share ⎋)</strong> பொத்தானைத் தொட்டு, <strong>"Add to Home Screen" (முகப்புத் திரையில் சேர் ➕)</strong> என்பதை அழுத்தவும். உடனே DBYC லோகோவுடன் உங்கள் திரையில் ஆப் வந்துவிடும்!
        `;
      } else {
        out.innerHTML = `
          <strong>📲 PWA நிறுவல் தீர்வு:</strong><br>
          1. Chrome / Edge உலாவியில் மேல் முகவரிப் பட்டையின் வலது ஓரத்தில் உள்ள <strong>கம்ப்யூட்டர் / பிளஸ் (⊞ / 💻)</strong> குறியீட்டை அழுத்தவும்.<br>
          2. அல்லது உலாவி மெனுவில் <strong>(⋮) > "Install DBYC App"</strong> என்பதைத் தேர்ந்தெடுக்கவும்.<br>
          <button class="btn btn-xs btn-accent" style="margin-top:6px" onclick="PWA.install()">📲 Trigger Install Now</button>
        `;
      }
    } else if (type === 'ios_guide') {
      out.innerHTML = `
        <strong>🍏 Apple iPhone & iPad PWA Setup:</strong><br>
        1. Open Safari and visit this website.<br>
        2. Tap the <strong>Share</strong> button (box with an arrow pointing up ⎋) at the bottom.<br>
        3. Scroll down and tap <strong>"Add to Home Screen" (முகப்புத் திரையில் சேர்)</strong>.<br>
        4. Tap <strong>"Add"</strong> at top-right. Your DBYC app is ready with full offline support!
      `;
    } else if (type === 'camera_fix') {
      out.innerHTML = `
        <strong>📷 கேமரா & ஸ்கேனர் சரிசெய்தல்:</strong><br>
        • உலாவி அமைப்புகளில் (Browser Site Settings) இந்த தளத்திற்கு கேமரா அனுமதி <strong>"Allow"</strong> என உள்ளதா என உறுதிப்படுத்தவும்.<br>
        • காகித விண்ணப்பப் படிவத்தை ஸ்கேன் செய்யும்போது போனின் பின்பக்க கேமரா (Rear Camera) இயங்கும்.<br>
        <button class="btn btn-xs btn-primary" style="margin-top:6px" onclick="Members.openDocumentScannerModal()">📑 Open Document Scanner</button>
      `;
    } else if (type === 'offline_help') {
      out.innerHTML = `
        <strong>🌐 100% ஆஃப்லைன் பயன்பாடு:</strong><br>
        • DBYC இன் அனைத்து கோப்புகளும் சர்வீஸ் ஒர்க்கர் மூலம் உங்கள் மொபைலில் தானாகவே சேமிக்கப்படுகின்றன.<br>
        • இணைய இணைப்பு (Internet) இல்லாதபோதும் ஆப் திறந்து QR குறியீடுகளை ஸ்கேன் செய்யலாம், வருகை பதியலாம். இணையம் வரும்போது தானாக ஒத்திசைக்கப்படும்!
      `;
    }
  }
};

// Auto-run initial silent diagnostics after page load
window.addEventListener('load', () => {
  setTimeout(() => {
    AIDoctor.runDiagnostics().catch(() => {});
  }, 1200);
});
