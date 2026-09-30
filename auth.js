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
      this.openMemberLoginModal(group);
      return;
    }

    // Password Gate for Authorities
    const logoSrc = (typeof DBYC_LOGO_DATA !== 'undefined' && DBYC_LOGO_DATA) ? DBYC_LOGO_DATA : './assets/dbyc-logo.jpg';
    UI.openModal('auth-pass-modal', `
      <div class="modal-header">
        <span class="modal-title">🔐 Authority Authentication</span>
        <button class="modal-close" onclick="UI.closeModal('auth-pass-modal')">✕</button>
      </div>
      <div class="modal-body">
        <div style="text-align:center;margin-bottom:var(--s-4)">
          <img src="${logoSrc}" style="width:64px;height:64px;border-radius:50%;border:2px solid var(--accent);margin-bottom:var(--s-2);object-fit:cover">
          <div style="font-weight:700;color:var(--primary);font-size:var(--text-base)">${titles[role]}</div>
          <div style="font-size:var(--text-xs);color:var(--text-muted)">Protected Authority Portal &bull; Don Bosco Youth Centre</div>
        </div>
        <div class="form-group">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
            <label class="form-label" style="margin:0;font-weight:700">Authority Password (கடவுச்சொல்)</label>
            <button type="button" class="btn btn-ghost btn-xs" style="padding:0;color:var(--primary);text-decoration:underline;font-size:11px" onclick="Auth.openForgotPasswordModal('${role}')">Forgot Password?</button>
          </div>
          <div class="password-input-wrap">
            <input type="password" id="auth-pwd-input" class="form-control" placeholder="Enter password (default: dbyc2026)" required onkeydown="if(event.key==='Enter')Auth.verifyAuthorityPassword('${role}', '${group}')">
            <button type="button" class="password-toggle-btn" onclick="UI.togglePasswordVisibility('auth-pwd-input', this)" title="Show/Hide Password">👁️</button>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px">
            <span style="font-size:11px;color:var(--text-muted)">Default demo: <code>dbyc2026</code></span>
            <span style="font-size:11px;color:var(--primary);cursor:pointer;font-weight:600" onclick="Auth.openForgotPasswordModal('${role}')">🔑 Reset Password</span>
          </div>
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
      UI.toast('error', 'Access Denied', 'Invalid authority password. Click "Forgot Password?" to reset.');
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

  openForgotPasswordModal(presetRole = 'director') {
    UI.closeModal('auth-pass-modal');
    UI.openModal('auth-forgot-modal', `
      <div class="modal-header">
        <span class="modal-title">🔑 Authority Password Recovery (கடவுச்சொல் மீட்பு)</span>
        <button class="modal-close" onclick="UI.closeModal('auth-forgot-modal')">✕</button>
      </div>
      <div class="modal-body">
        <div style="text-align:center;margin-bottom:var(--s-4)">
          <div style="font-size:2.2rem;margin-bottom:4px">🛡️</div>
          <div style="font-weight:700;color:var(--primary);font-size:var(--text-base)">Salesian Security Password Reset</div>
          <div style="font-size:var(--text-xs);color:var(--text-muted);margin-top:2px">Reset your authority password with the DBYC Master Recovery PIN.</div>
        </div>

        <div style="display:flex;flex-direction:column;gap:var(--s-3)">
          <div class="form-group">
            <label class="form-label" style="font-weight:700">Authority Role to Reset</label>
            <select id="fp-role" class="form-control">
              <option value="director" ${presetRole==='director'?'selected':''}>Rev. Fr. Director (Incharge)</option>
              <option value="asst_director" ${presetRole==='asst_director'?'selected':''}>Fr. Assistant Director (Direct Incharge)</option>
              <option value="leader" ${presetRole==='leader'?'selected':''}>Group Leader</option>
              <option value="incharge" ${presetRole==='incharge'?'selected':''}>Group Incharge</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" style="font-weight:700">Security Verification PIN or Answer</label>
            <div class="password-input-wrap">
              <input type="password" id="fp-pin" class="form-control" placeholder="Enter Master PIN (1815) or 'Don Bosco'">
              <button type="button" class="password-toggle-btn" onclick="UI.togglePasswordVisibility('fp-pin', this)" title="Show/Hide">👁️</button>
            </div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:4px">
              Security Question: <em>"In which year was St. John Bosco born?"</em> (Default: <strong>1815</strong> or Director override)
            </div>
          </div>

          <div class="form-group" style="border-top:1px dashed var(--border);padding-top:var(--s-3)">
            <label class="form-label" style="font-weight:700;color:var(--primary)">Set New Password (புதிய கடவுச்சொல்)</label>
            <div class="password-input-wrap" style="margin-bottom:var(--s-2)">
              <input type="password" id="fp-new-pwd" class="form-control" placeholder="Enter new password (minimum 4 characters)">
              <button type="button" class="password-toggle-btn" onclick="UI.togglePasswordVisibility('fp-new-pwd', this)" title="Show/Hide">👁️</button>
            </div>
            <div class="password-input-wrap">
              <input type="password" id="fp-confirm-pwd" class="form-control" placeholder="Confirm new password">
              <button type="button" class="password-toggle-btn" onclick="UI.togglePasswordVisibility('fp-confirm-pwd', this)" title="Show/Hide">👁️</button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="UI.closeModal('auth-forgot-modal')">Cancel</button>
        <button class="btn btn-primary" onclick="Auth.processPasswordReset()">✓ Reset & Save Password</button>
      </div>`);
  },

  processPasswordReset() {
    const role = document.getElementById('fp-role')?.value || 'director';
    const pin = document.getElementById('fp-pin')?.value.trim().toLowerCase();
    const newPwd = document.getElementById('fp-new-pwd')?.value.trim();
    const confirmPwd = document.getElementById('fp-confirm-pwd')?.value.trim();

    const validPins = ['1815', 'don bosco', 'donbosco', 'dbyc', 'dbyc2026', 'admin'];
    if (!validPins.includes(pin)) {
      UI.toast('error', 'Security Failed', 'Invalid Recovery PIN or Security answer. Use birth year 1815 or consult Fr. Director.');
      return;
    }

    if (!newPwd || newPwd.length < 4) {
      UI.toast('warning', 'Password Validation', 'New password must be at least 4 characters long.');
      return;
    }

    if (newPwd !== confirmPwd) {
      UI.toast('warning', 'Password Mismatch', 'New password and confirmation password do not match.');
      return;
    }

    localStorage.setItem(`dbyc_pwd_${role}`, newPwd);
    UI.closeModal('auth-forgot-modal');
    UI.toast('success', 'Password Reset Successful!', `New password has been set for ${role}. You can now sign in.`);
    this.loginAsAuthority(role);
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

  openMemberLoginModal(defaultGroup = 'Seniors') {
    const logoSrc = (typeof DBYC_LOGO_DATA !== 'undefined' && DBYC_LOGO_DATA) ? DBYC_LOGO_DATA : './assets/dbyc-logo.jpg';
    UI.openModal('member-login-modal', `
      <div class="modal-header">
        <span class="modal-title">👤 Youth Member Portal Sign-In (உறுப்பினர் உள்நுழைவு)</span>
        <button class="modal-close" onclick="UI.closeModal('member-login-modal')">✕</button>
      </div>
      <div class="modal-body">
        <div style="text-align:center;margin-bottom:var(--s-4)">
          <img src="${logoSrc}" style="width:64px;height:64px;border-radius:50%;border:2px solid var(--accent);margin-bottom:var(--s-2);object-fit:cover">
          <div style="font-weight:700;color:var(--primary);font-size:var(--text-base)">Don Bosco Youth Centre Member Access</div>
          <div style="font-size:var(--text-xs);color:var(--text-muted)">View your personal digital pass, points standing & oratory rules</div>
        </div>

        <div style="display:flex;flex-direction:column;gap:var(--s-3)">
          <div class="form-group">
            <label class="form-label" style="font-weight:700">Enter Your Member ID or Mobile Number</label>
            <div style="display:flex;gap:var(--s-2)">
              <input type="text" id="member-login-input" class="form-control" placeholder="e.g. DBYC-2026-001 or Mobile" onkeydown="if(event.key==='Enter')Auth.processMemberLogin()">
              <button class="btn btn-primary" onclick="Auth.processMemberLogin()">Find & Sign In</button>
            </div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:4px">
              Enter your registered Member ID (or partial ID like <code>001</code>) to load your digital card.
            </div>
          </div>

          <div class="login-divider"><span>OR QUICK DEMO MEMBER</span></div>

          <button class="btn btn-outline btn-full" onclick="Auth.loginAsDemoMember('${defaultGroup}')">
            ⚡ Quick Demo Member: Dominic Savio (Seniors &bull; Red House)
          </button>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="UI.closeModal('member-login-modal')">Cancel</button>
      </div>`);
  },

  async processMemberLogin() {
    const query = document.getElementById('member-login-input')?.value.trim();
    if (!query) {
      UI.toast('warning', 'Input Required', 'Please enter your Member ID, Name, or Mobile Number.');
      return;
    }

    UI.showLoading('Locating registered member record...');
    try {
      const res = await API.getMembers({});
      UI.hideLoading();
      const members = res.data || [];
      const qLower = query.toLowerCase();

      // Match by MemberID, Mobile, or FullName
      const match = members.find(m => 
        (m.MemberID && m.MemberID.toLowerCase() === qLower) ||
        (m.MemberID && m.MemberID.toLowerCase().includes(qLower)) ||
        (m.Mobile && m.Mobile.toString().includes(query)) ||
        (m.FullName && m.FullName.toLowerCase().includes(qLower))
      );

      if (match) {
        this.loginWithMemberRecord(match);
      } else {
        UI.toast('error', 'Member Not Found', `No registered member found matching "${query}". Check your ID with your Group Leader.`);
      }
    } catch(err) {
      UI.hideLoading();
      UI.toast('error', 'Lookup Failed', 'Could not query member database.');
    }
  },

  loginWithMemberRecord(member) {
    const userObj = {
      memberId: member.MemberID,
      email: member.Email || `${(member.MemberID || 'member').toLowerCase()}@dbyc.org`,
      name: member.FullName || 'Youth Member',
      role: 'member',
      group: member.Group || 'Seniors',
      team: member.Team || member.House || 'Red House (St. John Bosco)',
      picture: member.Photo || '',
      points: member.TotalPoints || 0
    };

    this._setSession(userObj);
    UI.closeModal('member-login-modal');
    UI.toast('success', 'Welcome!', `Signed in as ${userObj.name} (${userObj.memberId || userObj.group})`);
    Router.navigate('dashboard');
  },

  loginAsDemoMember(group = 'Seniors') {
    this.loginWithMemberRecord({
      MemberID: 'DBYC-2026-001',
      FullName: 'Dominic Savio',
      Group: group,
      Team: 'Red House (St. John Bosco)',
      Photo: '',
      TotalPoints: 120,
      Email: 'savio@dbyc.org'
    });
  },

  canManageMembers() {
    return ['director','asst_director','leader'].includes(this._user?.role);
  },
  canSeeAllMembers() {
    return ['director','asst_director','leader'].includes(this._user?.role);
  },
  canAwardPoints() {
    return ['director','asst_director','leader'].includes(this._user?.role);
  },
  canTakeAttendance() {
    return ['director','asst_director','leader','incharge'].includes(this._user?.role);
  },
  canSeeCertificatesAndReports() {
    return ['director','asst_director'].includes(this._user?.role);
  },
  isAdmin() {
    return ['director','asst_director'].includes(this._user?.role);
  },
  isDirector() {
    return this._user?.role === 'director';
  },
  isLeader() {
    return this._user?.role === 'leader';
  },
  isIncharge() {
    return this._user?.role === 'incharge';
  },
  isMember() {
    return this._user?.role === 'member';
  }
};

// Global helper alias
function loginAsRole(role, group = 'Seniors') {
  Auth.loginAsAuthority(role, group);
}
