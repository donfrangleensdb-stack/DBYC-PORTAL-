/* DBYC Main Application Bootstrapper & UI Controller */
const UI = {
  toast(type, title, message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
    toast.innerHTML = `
      <div style="font-size:1.2rem">${icon}</div>
      <div class="toast-body">
        <div class="toast-title">${Utils.escapeHtml(title)}</div>
        <div class="toast-message">${Utils.escapeHtml(message)}</div>
      </div>
      <div style="cursor:pointer;color:var(--text-muted);font-size:12px" onclick="this.parentElement.remove()">✕</div>`;
    container.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 4500);
  },

  openModal(id, htmlContent) {
    const overlay = document.getElementById('modal-overlay');
    if (!overlay) return;
    overlay.innerHTML = `<div class="modal" id="${id}">${htmlContent}</div>`;
    overlay.classList.add('open');
  },

  closeModal(id) {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.classList.remove('open');
  },

  showLoading(msg = 'Loading...') {
    let el = document.getElementById('global-loader');
    if (!el) {
      el = document.createElement('div');
      el.id = 'global-loader';
      el.style.position = 'fixed';
      el.style.inset = '0';
      el.style.background = 'rgba(0,30,80,0.6)';
      el.style.zIndex = '10000';
      el.style.display = 'flex';
      el.style.flexDirection = 'column';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.color = '#fff';
      el.innerHTML = `<div class="spinner-lg" style="border-top-color:var(--accent);margin-bottom:12px"></div><div id="global-loader-text" style="font-weight:600"></div>`;
      document.body.appendChild(el);
    }
    document.getElementById('global-loader-text').textContent = msg;
    el.style.display = 'flex';
  },

  hideLoading() {
    const el = document.getElementById('global-loader');
    if (el) el.style.display = 'none';
  },

  updateNav(currentRoute) {
    document.querySelectorAll('.nav-item, .bottom-nav-item').forEach(el => {
      if (el.getAttribute('data-route') === currentRoute) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
    const titleMap = {
      dashboard: 'DBYC Central Dashboard',
      members: 'Member Directory & Verification',
      attendance: 'QR Camera Terminal',
      qr: 'Digital Member Passes',
      certificates: 'Official Certificates Generator',
      reports: 'Championship & Reports',
      rules: 'Rules of the Oratory • மன்ற விதிமுறைகள்'
    };
    const titleEl = document.getElementById('topbar-page-title');
    if (titleEl) titleEl.textContent = titleMap[currentRoute] || 'DBYC Portal';
  },

  updateUserInfo() {
    const u = Auth.getUser();
    if (!u) return;
    const nameEls = document.querySelectorAll('.user-display-name');
    nameEls.forEach(el => el.textContent = u.name || 'User');
    const roleEls = document.querySelectorAll('.user-display-role');
    roleEls.forEach(el => el.textContent = (u.role || 'Member').replace('_', ' '));
    const grpEls = document.querySelectorAll('.user-display-group');
    grpEls.forEach(el => el.textContent = u.group || 'All Groups');
    const avatarEls = document.querySelectorAll('.user-display-avatar');
    avatarEls.forEach(el => {
      el.innerHTML = u.picture ? `<img src="${u.picture}" alt="${u.name}">` : Utils.initials(u.name);
    });
  },

  openAuthorityProfileModal() {
    const u = Auth.getUser();
    if (!u) return;
    UI.openModal('auth-profile-modal', `
      <div class="modal-header">
        <span class="modal-title">⚙️ Authority Profile & Portal Settings</span>
        <button class="modal-close" onclick="UI.closeModal('auth-profile-modal')">✕</button>
      </div>
      <div class="modal-body">
        <div style="text-align:center;margin-bottom:var(--s-4)">
          <div style="position:relative;display:inline-block">
            <div id="auth-photo-container" style="width:88px;height:88px;border-radius:50%;border:3px solid var(--primary);overflow:hidden;margin:0 auto var(--s-2)">
              ${u.picture ? `<img src="${u.picture}" style="width:100%;height:100%;object-fit:cover">` : `<div class="member-avatar large">${Utils.initials(u.name)}</div>`}
            </div>
            <label style="position:absolute;bottom:0;right:0;background:var(--accent);color:#000;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:12px;box-shadow:var(--shadow-sm)" title="Upload Photo">
              📷
              <input type="file" accept="image/*" style="display:none" onchange="UI.handleAuthorityPhotoSelect(event)">
            </label>
          </div>
          <div style="font-weight:700;font-size:var(--text-base)">${Utils.escapeHtml(u.name)}</div>
          <div>${Utils.roleBadge(u.role)} &bull; ${Utils.groupBadge(u.group)}</div>
        </div>

        <div style="display:flex;flex-direction:column;gap:var(--s-3)">
          <div class="form-group">
            <label class="form-label">Authority Official Name</label>
            <input type="text" id="ap-name" class="form-control" value="${Utils.escapeHtml(u.name)}">
          </div>
          <div class="form-group">
            <label class="form-label">Update Authority Password</label>
            <input type="password" id="ap-pwd" class="form-control" placeholder="Leave blank to keep current password">
          </div>

          <!-- Spiritual Background Theme Chooser -->
          <div class="form-group" style="margin-top:var(--s-3);border-top:1px solid var(--border);padding-top:var(--s-3)">
            <label class="form-label" style="font-weight:700;color:var(--primary)">🎨 Don Bosco Spiritual Background Theme</label>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--s-2);margin-top:var(--s-2)">
              ${UI.THEME_LIST.map(th => {
                const isActive = (UI.getCurrentThemeKey() === th.key);
                return `
                  <div onclick="UI.applyTheme('${th.key}')" style="cursor:pointer;border:2px solid ${isActive ? 'var(--primary)' : 'var(--border)'};border-radius:var(--r-md);overflow:hidden;position:relative;background:#000;box-shadow:${isActive ? '0 0 0 2px var(--accent)' : 'none'}">
                    <img src="${th.file}" style="width:100%;height:64px;object-fit:cover;opacity:0.85" alt="${th.name}">
                    <div style="position:absolute;bottom:0;left:0;right:0;background:rgba(0,35,85,0.85);color:#fff;font-size:9px;font-weight:700;padding:2px 4px;text-align:center">
                      ${isActive ? '✓ ' : ''}${th.name}
                    </div>
                  </div>`;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="UI.closeModal('auth-profile-modal')">Cancel</button>
        <button class="btn btn-primary" onclick="UI.saveAuthorityProfile()">Save Profile</button>
      </div>`);
  },

  THEME_LIST: [
    { key: 'banner', name: 'Joyful Kingdom (Banner)', file: 'assets/don-bosco-banner.jpg' },
    { key: 'walk', name: 'Journey with Youth', file: 'assets/don-bosco-walk.jpg' },
    { key: 'oratory', name: 'Oratory Courtyard', file: 'assets/don-bosco-oratory.jpg' },
    { key: 'teaching', name: 'Good Night Teaching', file: 'assets/don-bosco-teaching.jpg' }
  ],

  getCurrentThemeKey() {
    return localStorage.getItem('dbyc_active_theme') || 'banner';
  },

  applyTheme(key) {
    const th = this.THEME_LIST.find(t => t.key === key) || this.THEME_LIST[0];
    localStorage.setItem('dbyc_active_theme', th.key);

    document.body.style.backgroundImage = `
      linear-gradient(180deg, rgba(244, 246, 251, 0.93) 0%, rgba(240, 244, 250, 0.95) 100%),
      url('${th.file}')
    `;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';

    const loginEl = document.getElementById('login-screen');
    if (loginEl) {
      loginEl.style.backgroundImage = `
        linear-gradient(145deg, rgba(0, 35, 85, 0.88) 0%, rgba(0, 63, 138, 0.82) 55%, rgba(15, 23, 42, 0.94) 100%),
        url('${th.file}')
      `;
    }

    UI.toast('success', 'Theme Applied', `Theme: ${th.name}`);
  },

  cycleTheme() {
    const current = this.getCurrentThemeKey();
    const idx = this.THEME_LIST.findIndex(t => t.key === current);
    const nextIdx = (idx + 1) % this.THEME_LIST.length;
    this.applyTheme(this.THEME_LIST[nextIdx].key);
  },

  _tempAuthorityPhoto: '',

  async handleAuthorityPhotoSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      this._tempAuthorityPhoto = await Utils.compressImage(file, 240, 240, 0.82);
      const box = document.getElementById('auth-photo-container');
      if (box) box.innerHTML = `<img src="${this._tempAuthorityPhoto}" style="width:100%;height:100%;object-fit:cover">`;
    } catch(err) {
      console.error(err);
    }
  },

  saveAuthorityProfile() {
    const name = document.getElementById('ap-name')?.value.trim();
    const pwd = document.getElementById('ap-pwd')?.value.trim();
    
    Auth.updateAuthorityProfile({
      name: name,
      password: pwd || undefined,
      picture: this._tempAuthorityPhoto || Auth.getUser()?.picture
    });

    UI.closeModal('auth-profile-modal');
  },

  toggleSidebar() {
    const sb = document.getElementById('sidebar');
    const ov = document.getElementById('sidebar-overlay');
    if (sb) sb.classList.toggle('open');
    if (ov) ov.classList.toggle('open');
  }
};


// Initialize Application
window.addEventListener('DOMContentLoaded', () => {
  // Register routes
  Router.register('dashboard', (c) => Dashboard.render(c));
  Router.register('members', (c) => Members.render(c));
  Router.register('attendance', (c) => Attendance.render(c));
  Router.register('qr', (c) => QRGenerator.render(c));
  Router.register('certificates', (c) => Certificates.render(c));
  Router.register('reports', (c) => Reports.render(c));
  Router.register('rules', (c) => Rules.render(c));

  // Initialize auth state and theme
  Auth.init();
  UI.applyTheme(UI.getCurrentThemeKey());
  Router.init();

  // Initialize Tamil & English Voice Typing & Virtual Keyboard
  if (typeof VoiceKeyboard !== 'undefined') {
    VoiceKeyboard.init();
  }

  // Register service worker if supported
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.log('ServiceWorker registration optional:', err);
    });
  }
});

// PWA Install Prompt Handler (Android / Chrome / Edge)
let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  const topbar = document.getElementById('topbar');
  if (topbar && !document.getElementById('pwa-header-install-btn')) {
    const btn = document.createElement('button');
    btn.id = 'pwa-header-install-btn';
    btn.className = 'btn btn-sm btn-accent';
    btn.style.marginRight = '8px';
    btn.innerHTML = '📲 Install App';
    btn.onclick = async () => {
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        const { outcome } = await deferredInstallPrompt.userChoice;
        if (outcome === 'accepted') {
          btn.remove();
        }
        deferredInstallPrompt = null;
      }
    };
    const right = topbar.querySelector('.topbar-right');
    if (right) topbar.insertBefore(btn, right);
  }
});
