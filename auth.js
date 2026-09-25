/* DBYC Auth - Password Protection for Authorities, Group Scoping & Profile Photo Management */
const Auth = {
  _user: null,
  _token: null,

  init() {
    const saved = sessionStorage.getItem('dbyc_user');
    const savedToken = sessionStorage.getItem('dbyc_token');
    if (saved && savedToken) {
      try {
        this._user = JSON.parse(saved);
        this._token = savedToken;
        return this._user;
      } catch(e) {}
    }
    return null;
  },

  getUser() { return this._user; },
  getToken() { return this._token; },
  isLoggedIn() { return !!this._user && !!this._token; },

  initGoogleSignIn() {
    return new Promise((resolve, reject) => {
      if (typeof google === 'undefined') { reject(new Error('Google GIS not loaded')); return; }
      google.accounts.id.initialize({
        client_id: DBYC_CONFIG.OAUTH_CLIENT_ID,
        callback: (resp) => this._handleCredential(resp).then(resolve).catch(reject),
        auto_select: false
      });
      resolve();
    });
  },

  renderSignInButton(elementId) {
    if (typeof google === 'undefined') return;
    google.accounts.id.renderButton(document.getElementById(elementId), {
      theme: 'outline', size: 'large', type: 'standard',
      shape: 'rectangular', width: 280, text: 'signin_with',
      logo_alignment: 'left'
    });
    google.accounts.id.prompt();
  },

  async _handleCredential(response) {
    const token = response.credential;
    UI.showLoading('Verifying Google credentials...');
    try {
      const verifyResult = await API.postRaw(token, 'getDashboard', {});
      if (!verifyResult.success) throw new Error('Your account is not registered in DBYC database.');
      const payload = this._parseJwt(token);
      this._token = token;
      this._user = {
        email: payload.email,
        name: payload.name,
        picture: payload.picture || '',
        role: verifyResult.userRole || 'member',
        group: verifyResult.userGroup || 'Seniors'
      };
      sessionStorage.setItem('dbyc_token', token);
      sessionStorage.setItem('dbyc_user', JSON.stringify(this._user));
      UI.hideLoading();
      return this._user;
    } catch(e) {
      UI.hideLoading();
      throw e;
    }
  },

  _parseJwt(token) {
    const base64 = token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/');
    return JSON.parse(atob(base64));
  },

  loginAsAuthority(role, group = 'Seniors') {
    const titles = {
      director: 'Rev. Fr. Director (Incharge)',
      asst_director: 'Fr. Assistant Director (Direct Incharge)',
      leader: `${group} Group Leader`,
      incharge: `${group} Group Incharge`,
      member: 'Member Candidate'
    };

    if (role === 'member') {
      this._setSession({
        email: 'member@dbyc.org',
        name: 'Dominic Savio (Member)',
        role: 'member',
        group: group,
        picture: ''
      });
      UI.toast('info', 'Signed In', 'Welcome, Youth Member!');
      Router.navigate('dashboard');
      return;
    }

    // Password Gate for Authorities
    UI.openModal('auth-pass-modal', `
      <div class="modal-header">
        <span class="modal-title">🔐 Authority Password Authentication</span>
        <button class="modal-close" onclick="UI.closeModal('auth-pass-modal')">✕</button>
      </div>
      <div class="modal-body">
        <div style="text-align:center;margin-bottom:var(--s-4)">
          <img src="./assets/dbyc-logo.jpg" style="width:64px;height:64px;border-radius:50%;border:2px solid var(--accent);margin-bottom:var(--s-2)">
          <div style="font-weight:700;color:var(--primary)">${titles[role]}</div>
          <div style="font-size:var(--text-xs);color:var(--text-muted)">Protected Authority Portal</div>
        </div>
        <div class="form-group">
          <label class="form-label">Authority Access Password</label>
          <input type="password" id="auth-pwd-input" class="form-control" placeholder="Enter password (default: dbyc2026)" required>
          <div style="font-size:11px;color:var(--text-muted);margin-top:4px">Default demo password: <code>dbyc2026</code></div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="UI.closeModal('auth-pass-modal')">Cancel</button>
        <button class="btn btn-primary" onclick="Auth.verifyAuthorityPassword('${role}', '${group}')">Verify & Sign In</button>
      </div>`);
  },

  verifyAuthorityPassword(role, group) {
    const pwd = document.getElementById('auth-pwd-input')?.value;
    const defaultPwd = 'dbyc2026'; // Default demo password
    const customPwd = localStorage.getItem(`dbyc_pwd_${role}`) || defaultPwd;

    if (pwd !== customPwd && pwd !== defaultPwd) {
      UI.toast('error', 'Access Denied', 'Invalid authority password.');
      return;
    }

    const savedPhoto = localStorage.getItem(`dbyc_photo_${role}`) || '';
    const titles = {
      director: 'Rev. Fr. Director, SDB',
      asst_director: 'Fr. Assistant Director, DBYC',
      leader: `${group} Group Leader`,
      incharge: `${group} Group Incharge`
    };

    const userObj = {
      email: `${role.toLowerCase()}@dbyc.org`,
      name: titles[role],
      role: role,
      group: (role === 'director' || role === 'asst_director') ? 'All' : group,
      picture: savedPhoto
    };

    this._setSession(userObj);
    UI.closeModal('auth-pass-modal');
    UI.toast('success', 'Authority Authenticated', `Signed in as ${userObj.name}`);
    Router.navigate('dashboard');
  },

  _setSession(userObj) {
    this._user = userObj;
    this._token = 'mock-authority-token-' + Date.now();
    sessionStorage.setItem('dbyc_user', JSON.stringify(userObj));
    sessionStorage.setItem('dbyc_token', this._token);
  },

  updateAuthorityProfile(data) {
    if (!this._user) return;
    if (data.name) this._user.name = data.name;
    if (data.picture !== undefined) this._user.picture = data.picture;
    if (data.password) {
      localStorage.setItem(`dbyc_pwd_${this._user.role}`, data.password);
    }
    if (data.picture) {
      localStorage.setItem(`dbyc_photo_${this._user.role}`, data.picture);
    }
    sessionStorage.setItem('dbyc_user', JSON.stringify(this._user));
    UI.updateUserInfo();
    UI.toast('success', 'Profile Updated', 'Authority portal details updated successfully!');
  },

  signOut() {
    sessionStorage.removeItem('dbyc_user');
    sessionStorage.removeItem('dbyc_token');
    this._user = null;
    this._token = null;
    if (typeof google !== 'undefined') google.accounts.id.disableAutoSelect();
    Router.navigate('login');
  },

  canManageMembers() {
    return ['director','asst_director','leader'].includes(this._user?.role);
  },
  isAdmin() {
    return ['director','asst_director'].includes(this._user?.role);
  },
  isDirector() {
    return this._user?.role === 'director';
  }
};

// Global helper alias
function loginAsRole(role, group = 'Seniors') {
  Auth.loginAsAuthority(role, group);
}
