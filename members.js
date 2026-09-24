/* DBYC Members View - Full Tamil & English Admission, Voice Typing, Keyboard & Official Application */
const Members = {
  _data: [],
  _filtered: [],
  _page: 1,
  _perPage: 12,
  _activeTab: 'all',
  _photoBase64: '',
  _cameraStream: null,

  async render(container) {
    const canManage = Auth.canManageMembers();
    container.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <div class="page-title">தொன்போஸ்கோ இளைஞர் மன்றம் - பேசின் பாலம், சென்னை</div>
          <div class="page-subtitle">Don Bosco Youth Centre (Basin Bridge, Chennai - 600 012) &bull; Member Registry & Admission</div>
        </div>
        <div class="page-actions">
          <button class="btn btn-outline" onclick="VoiceKeyboard.toggleKeyboard()">⌨️ தமிழ் / English விசைப்பலகை</button>
          <button class="btn btn-ghost" onclick="Members.exportCSV()">📥 Export CSV</button>
          ${canManage ? '<button class="btn btn-primary" onclick="Members.openAddModal()">➕ உறுப்பினர் சேர்க்கை (New Admission)</button>' : ''}
        </div>
      </div>

      <!-- Quick Voice Assistant Bar -->
      <div class="card" style="margin-bottom:var(--s-4);background:linear-gradient(135deg,#002D63 0%,#003F8A 100%);color:#fff">
        <div class="card-body" style="padding:var(--s-3) var(--s-4);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:var(--s-2)">
          <div style="display:flex;align-items:center;gap:var(--s-2)">
            <span style="font-size:1.3rem">🎙️</span>
            <div>
              <strong>தமிழ் மற்றும் ஆங்கில குரல் உள்ளீடு (Tamil & English Voice Typing)</strong>
              <div style="font-size:11px;color:rgba(255,255,255,0.8)">Click any text box and speak in Tamil or English to auto-type</div>
            </div>
          </div>
          <div style="display:flex;gap:var(--s-2);align-items:center">
            <button class="btn btn-sm btn-accent" id="global-mic-btn" onclick="VoiceKeyboard.toggleListening()">🎙️ Voice Type</button>
            <button class="btn btn-sm btn-outline" style="color:#fff;border-color:rgba(255,255,255,0.6)" onclick="VoiceKeyboard.toggleLanguageSwitch()">
              <span id="voice-lang-badge">தமிழ் (TA)</span> 🔄
            </button>
            <button class="btn btn-sm btn-ghost" style="color:#fff" onclick="VoiceKeyboard.toggleKeyboard()">⌨️ On-Screen Keys</button>
          </div>
        </div>
      </div>

      <!-- Tabs: All vs Pending Verification -->
      <div class="tabs" style="margin-bottom:var(--s-4)">
        <button class="tab-btn active" id="tab-all-members" onclick="Members.switchTab('all')">அனைத்து உறுப்பினர்கள் (All Members)</button>
        ${Auth.isAdmin() ? `
        <button class="tab-btn" id="tab-pending-members" onclick="Members.switchTab('pending')">
          ⏳ ஒப்புதல் நிலுவை (Pending Qualification) <span id="pending-badge-count" class="badge badge-warning" style="margin-left:4px">0</span>
        </button>` : ''}
      </div>

      <div class="card" style="margin-bottom:var(--s-5)">
        <div class="card-body" style="padding:var(--s-4) var(--s-5)">
          <div style="display:flex;gap:var(--s-3);flex-wrap:wrap;align-items:center">
            <div class="search-wrap" style="flex:1;min-width:200px">
              <span class="search-icon">🔍</span>
              <input type="text" class="form-control search-input" id="member-search" placeholder="பெயர், அடையாள எண், தொலைபேசி தேடவும்...">
            </div>
            <select class="form-control" id="member-house-filter" style="width:auto" onchange="Members._applyFilters()">
              <option value="All">4 இல்லங்கள் (All Houses)</option>
              ${Utils.HOUSES.map(h => `<option value="${h}">${h}</option>`).join('')}
            </select>
            <select class="form-control" id="member-group-filter" style="width:auto" onchange="Members._applyFilters()">
              <option value="All">6 குழுக்கள் (All Groups)</option>
              ${Utils.GROUPS.map(g => `<option value="${g}">${g}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>உறுப்பினர் (Member)</th>
                <th>குழு (Group)</th>
                <th>இல்லம் (House)</th>
                <th>புள்ளிகள் (Points)</th>
                <th>தகுதி நிலை (Status)</th>
                <th class="col-hide-mobile">சேர்க்கை தேதி</th>
                <th>செயல்கள் (Actions)</th>
              </tr>
            </thead>
            <tbody id="members-tbody">
              <tr><td colspan="7" style="text-align:center;padding:var(--s-8)"><div class="spinner-lg" style="margin:0 auto"></div></td></tr>
            </tbody>
          </table>
        </div>
        <div class="card-footer" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:var(--s-3)">
          <span id="members-count" style="font-size:var(--text-sm);color:var(--text-muted)"></span>
          <div id="members-pagination" class="pagination"></div>
        </div>
      </div>`;

    document.getElementById('member-search').addEventListener('input', Utils.debounce(() => this._applyFilters(), 300));
    await this.loadMembers();
  },

  async loadMembers() {
    const result = await API.getMembers({});
    if (!result.success) { UI.toast('error', 'Error', result.error); return; }
    this._data = result.data || [];

    const pendingCount = this._data.filter(m => m.VerificationStatus === 'Pending Verification').length;
    const badgeEl = document.getElementById('pending-badge-count');
    if (badgeEl) badgeEl.textContent = pendingCount;

    this._applyFilters();
  },

  switchTab(tab) {
    this._activeTab = tab;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(tab === 'all' ? 'tab-all-members' : 'tab-pending-members');
    if (activeBtn) activeBtn.classList.add('active');
    this._applyFilters();
  },

  _applyFilters() {
    const q = document.getElementById('member-search')?.value.toLowerCase() || '';
    const grp = document.getElementById('member-group-filter')?.value || 'All';
    const house = document.getElementById('member-house-filter')?.value || 'All';

    this._filtered = this._data.filter(m => {
      if (this._activeTab === 'pending' && m.VerificationStatus !== 'Pending Verification') return false;
      if (grp !== 'All' && m.Group !== grp) return false;
      const h = m.House || m.Team;
      if (house !== 'All' && h !== house) return false;
      if (q && !((m.FullName || '').toLowerCase().includes(q) || (m.MemberID || '').toLowerCase().includes(q) || (m.Phone || '').includes(q))) return false;
      return true;
    });
    this._page = 1;
    this._render();
  },

  _render() {
    const isAdmin = Auth.isAdmin();
    const canManage = Auth.canManageMembers();
    const start = (this._page - 1) * this._perPage;
    const page = this._filtered.slice(start, start + this._perPage);
    const tbody = document.getElementById('members-tbody');
    if (!tbody) return;

    if (!page.length) {
      tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><div class="empty-icon">👤</div><div class="empty-title">உறுப்பினர்கள் இல்லை (No members found)</div></div></td></tr>`;
    } else {
      tbody.innerHTML = page.map(m => `
        <tr>
          <td>
            <div style="display:flex;align-items:center;gap:var(--s-3)">
              ${Utils.avatarHtml(m)}
              <div>
                <div style="font-weight:var(--fw-semibold);color:var(--text-primary)">${Utils.escapeHtml(m.FullName)}</div>
                <div style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--text-muted)">${m.MemberID} &bull; ${m.Gender || 'Member'}</div>
              </div>
            </div>
          </td>
          <td>${Utils.groupBadge(m.Group)}</td>
          <td>${Utils.houseBadge(m.House || m.Team)}</td>
          <td>${Utils.pointsBadge(m.Points || 0)}</td>
          <td>${Utils.verificationBadge(m.VerificationStatus)}</td>
          <td class="col-hide-mobile" style="font-size:var(--text-xs);color:var(--text-muted)">${Utils.formatDate(m.JoinDate)}</td>
          <td>
            <div class="table-actions">
              ${m.VerificationStatus === 'Pending Verification' && isAdmin ? `
                <button class="btn btn-sm btn-primary" title="Authority Qualify" onclick="Members.verifyMember('${m.MemberID}', 'Qualified')">✔️ Qualify</button>
              ` : ''}
              <button class="btn btn-ghost btn-sm btn-icon" title="Digital ID Pass" onclick="QRGenerator.showMemberQR('${m.MemberID}')">🪪</button>
              <button class="btn btn-ghost btn-sm btn-icon" title="Print Official Application Form (விண்ணப்பம் & விதிமுறைகள்)" onclick="Members.printApplication('${m.MemberID}')">📄</button>
              <button class="btn btn-ghost btn-sm btn-icon" title="✍️ பெற்றோரின் டிஜிட்டல் கையொப்பம் (Digital Signature)" onclick="Members.openSignatureModal('${m.MemberID}')">✍️</button>
              ${isAdmin && m.VerificationStatus === 'Qualified' ? `
                <button class="btn btn-ghost btn-sm btn-icon" title="Adjust Points" onclick="Members.openPointsModal('${m.MemberID}')">⭐</button>
              ` : ''}
              ${canManage ? `
                <button class="btn btn-ghost btn-sm btn-icon" title="Edit Profile" onclick="Members.openEditModal('${m.MemberID}')">✏️</button>
              ` : ''}
            </div>
          </td>
        </tr>`).join('');
    }

    const total = this._filtered.length;
    const pages = Math.ceil(total / this._perPage);
    const countEl = document.getElementById('members-count');
    if (countEl) countEl.textContent = `Showing ${Math.min(start + 1, total)}–${Math.min(start + this._perPage, total)} of ${total} members`;
    const pag = document.getElementById('members-pagination');
    if (pag) {
      pag.innerHTML = (pages <= 1) ? '' : `
        <button class="page-btn" ${this._page <= 1 ? 'disabled' : ''} onclick="Members._goPage(${this._page - 1})">‹</button>
        ${Array.from({ length: Math.min(pages, 5) }, (_, i) => { const p = i + 1; return `<button class="page-btn ${p === this._page ? 'active' : ''}" onclick="Members._goPage(${p})">${p}</button>`; }).join('')}
        <button class="page-btn" ${this._page >= pages ? 'disabled' : ''} onclick="Members._goPage(${this._page + 1})">›</button>`;
    }
  },

  _goPage(p) { this._page = p; this._render(); },

  async verifyMember(memberID, status) {
    UI.showLoading('Verifying member with Authority credential...');
    const res = await API.verifyMember(memberID, status);
    UI.hideLoading();
    if (res.success) {
      UI.toast('success', 'Authority Qualification', res.message || 'Member verified and qualified!');
      await this.loadMembers();
    } else {
      UI.toast('error', 'Error', res.error);
    }
  },

  openPointsModal(memberID) {
    const m = this._data.find(x => x.MemberID === memberID);
    if (!m) return;
    UI.openModal('points-modal', `
      <div class="modal-header">
        <span class="modal-title">⭐ Adjust Authority Points</span>
        <button class="modal-close" onclick="UI.closeModal('points-modal')">✕</button>
      </div>
      <div class="modal-body">
        <div style="display:flex;align-items:center;gap:var(--s-3);margin-bottom:var(--s-4);background:var(--surface-alt);padding:var(--s-3);border-radius:var(--r-md)">
          ${Utils.avatarHtml(m)}
          <div>
            <div style="font-weight:700">${Utils.escapeHtml(m.FullName)}</div>
            <div>${Utils.houseBadge(m.House || m.Team)} &bull; ${Utils.groupBadge(m.Group)}</div>
            <div style="font-size:var(--text-xs);margin-top:2px">Current Points: <strong>${m.Points || 0} pts</strong></div>
          </div>
        </div>
        <div class="form-group" style="margin-bottom:var(--s-3)">
          <label class="form-label">Point Adjustment Preset</label>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--s-2)">
            <button class="btn btn-outline btn-sm" onclick="document.getElementById('pts-val').value=10">+10</button>
            <button class="btn btn-outline btn-sm" onclick="document.getElementById('pts-val').value=25">+25</button>
            <button class="btn btn-outline btn-sm" onclick="document.getElementById('pts-val').value=50">+50</button>
            <button class="btn btn-outline btn-sm" style="color:var(--danger)" onclick="document.getElementById('pts-val').value=-10">-10</button>
          </div>
          <input type="number" id="pts-val" class="form-control" style="margin-top:var(--s-2)" value="10">
        </div>
        <div class="form-group">
          <label class="form-label">Reason / Category</label>
          <select id="pts-reason" class="form-control">
            <option value="Activity Winner">Activity / Competition Winner (போட்டி வெற்றி)</option>
            <option value="Exemplary Discipline">Exemplary Conduct (ஒழுக்கம் & பண்பு)</option>
            <option value="DBYC Voluntary Service">Voluntary Service (தன்னார்வ சேவை)</option>
            <option value="Punctuality & Presence">Punctuality (சரியான நேர வருகை)</option>
            <option value="Disciplinary Demerit">Disciplinary Demerit (ஒழுங்கீனம்)</option>
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="UI.closeModal('points-modal')">Cancel</button>
        <button class="btn btn-primary" onclick="Members.submitPoints('${m.MemberID}')">Apply Adjustment</button>
      </div>`);
  },

  async submitPoints(memberID) {
    const pts = parseInt(document.getElementById('pts-val')?.value) || 10;
    const reason = document.getElementById('pts-reason')?.value || 'Authority Adjustment';
    UI.showLoading('Adjusting points...');
    const res = await API.awardPoints(memberID, pts, reason);
    UI.hideLoading();
    if (res.success) {
      const sign = pts >= 0 ? `+${pts}` : `${pts}`;
      UI.toast('success', 'Points Updated', `${sign} pts updated for ${res.data.name}!`);
      UI.closeModal('points-modal');
      await this.loadMembers();
    } else {
      UI.toast('error', 'Error', res.error);
    }
  },

  openAddModal() {
    this._editingId = null;
    this._photoBase64 = '';
    this.stopCameraStream();
    UI.openModal('member-modal', `
      <div class="modal-header">
        <div style="display:flex;align-items:center;gap:var(--s-2)">
          <span class="modal-title">உறுப்பினர் புதுப்பித்தல் / சேர்க்கை விண்ணப்பம் (DBYC Admission)</span>
        </div>
        <div style="display:flex;gap:var(--s-2);align-items:center">
          <button type="button" class="btn btn-xs btn-outline" onclick="VoiceKeyboard.toggleListening()" title="Voice Typing">🎙️ குரல் உள்ளீடு</button>
          <button type="button" class="btn btn-xs btn-ghost" onclick="VoiceKeyboard.toggleKeyboard()" title="Tamil Keyboard">⌨️ விசைப்பலகை</button>
          <button class="modal-close" onclick="Members.closeMemberModal()">✕</button>
        </div>
      </div>
      <div class="modal-body" style="max-height:80vh;overflow-y:auto">${this._memberForm()}</div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="Members.closeMemberModal()">Cancel</button>
        <button class="btn btn-primary" onclick="Members.saveMember()">விண்ணப்பத்தை சமர்ப்பிக்கவும் (Submit Admission)</button>
      </div>`);

    setTimeout(() => {
      this._parentSigPad = Members.initSignaturePad('mf-parent-sig-canvas', 'mf-parent-sig-clear');
      this._memberSigPad = Members.initSignaturePad('mf-member-sig-canvas', 'mf-member-sig-clear');
    }, 120);
  },

  openEditModal(id) {
    const m = this._data.find(x => x.MemberID === id);
    if (!m) return;
    this._editingId = id;
    this._photoBase64 = m.PhotoURL || m.PhotoBase64 || '';
    this.stopCameraStream();
    UI.openModal('member-modal', `
      <div class="modal-header">
        <span class="modal-title">Edit Member Profile: ${Utils.escapeHtml(m.FullName)}</span>
        <div style="display:flex;gap:var(--s-2);align-items:center">
          <button type="button" class="btn btn-xs btn-outline" onclick="VoiceKeyboard.toggleListening()" title="Voice Typing">🎙️ குரல்</button>
          <button type="button" class="btn btn-xs btn-ghost" onclick="VoiceKeyboard.toggleKeyboard()" title="Tamil Keyboard">⌨️ விசைப்பலகை</button>
          <button class="modal-close" onclick="Members.closeMemberModal()">✕</button>
        </div>
      </div>
      <div class="modal-body" style="max-height:80vh;overflow-y:auto">${this._memberForm(m)}</div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="Members.closeMemberModal()">Cancel</button>
        <button class="btn btn-primary" onclick="Members.saveMember()">Update Profile</button>
      </div>`);

    setTimeout(() => {
      this._parentSigPad = Members.initSignaturePad('mf-parent-sig-canvas', 'mf-parent-sig-clear', m.ParentSignature || null);
      this._memberSigPad = Members.initSignaturePad('mf-member-sig-canvas', 'mf-member-sig-clear', m.MemberSignature || null);
    }, 120);
  },

  closeMemberModal() {
    this.stopCameraStream();
    this._parentSigPad = null;
    this._memberSigPad = null;
    UI.closeModal('member-modal');
  },

  _memberForm(m = {}) {
    const defaultPhoto = m.FullName ? Utils.defaultAvatarSvg(m.FullName, m.Gender || 'Male') : Utils.getLogoSrc();
    const photoSrc = m.PhotoURL || m.PhotoBase64 || defaultPhoto;
    const currentHouse = m.House || m.Team || 'Bosco House (Red)';
    const currentGroup = m.Group || 'Sub Juniors Group';
    const currentSports = m.SportsActivities || [];

    return `
      <div style="display:flex;flex-direction:column;gap:var(--s-4);font-size:13px">
        
        <!-- Live Instant Camera & Photo Capture Module -->
        <div class="form-group" style="background:var(--surface-alt);padding:var(--s-4);border-radius:var(--r-lg);border:1px solid var(--border)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--s-2)">
            <label class="form-label" style="font-weight:700;color:var(--primary);margin:0">
              📷 புகைப்பட பெட்டி (Passport Photo)
            </label>
            <div style="font-size:11px;color:var(--text-muted)">
              தொன்போஸ்கோ இளைஞர் மன்றம் &bull; பேசின் பாலம், சென்னை - 600 012
            </div>
          </div>
          
          <div style="display:flex;gap:var(--s-4);align-items:flex-start;flex-wrap:wrap">
            <div style="position:relative;width:120px;height:120px;border-radius:var(--r-md);overflow:hidden;border:2px solid var(--primary);background:#fff;display:flex;align-items:center;justify-content:center;box-shadow:var(--shadow-sm)">
              <img id="mf-preview-img" src="${photoSrc}" style="width:100%;height:100%;object-fit:cover" alt="Headshot Preview">
            </div>

            <div style="flex:1;min-width:200px;display:flex;flex-direction:column;gap:var(--s-2)">
              <div style="display:flex;gap:var(--s-2);flex-wrap:wrap">
                <button type="button" class="btn btn-accent btn-sm" id="btn-camera-toggle" onclick="Members.toggleInstantCamera()">
                  📸 Instant Camera (நேரலை கேமரா)
                </button>
                <label class="btn btn-outline btn-sm" style="cursor:pointer;margin:0">
                  📁 Upload Photo (புகைப்படம்)
                  <input type="file" id="mf-file-input" accept="image/*" style="display:none" onchange="Members.handlePhotoSelect(event)">
                </label>
              </div>

              <!-- Camera Viewfinder -->
              <div id="camera-viewfinder-box" style="display:none;margin-top:var(--s-2);background:#000;border-radius:var(--r-md);overflow:hidden;position:relative">
                <video id="camera-video" autoplay playsinline style="width:100%;max-height:220px;object-fit:cover"></video>
                <div style="position:absolute;bottom:8px;left:0;right:0;display:flex;justify-content:center;gap:var(--s-2)">
                  <button type="button" class="btn btn-primary btn-sm" onclick="Members.snapInstantPhoto()">📸 Take Snapshot (புகைப்படம் எடு)</button>
                  <button type="button" class="btn btn-ghost btn-sm" style="color:#fff;background:rgba(0,0,0,0.5)" onclick="Members.stopCameraStream()">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 1. படிவம் எண் & வருடம் -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">படிவம் எண் (Form No)</label>
            <input class="form-control" id="mf-formno" value="${m.FormNo || m.MemberID || ''}" placeholder="தானாக உருவாக்கப்படும் (Auto)">
          </div>
          <div class="form-group">
            <label class="form-label">வருடம் (Year)</label>
            <input class="form-control" id="mf-year" value="${m.Year || new Date().getFullYear()}">
          </div>
        </div>

        <!-- 2. பெயர் & பிறந்த தேதி / வயது -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">1. பெயர் (Name) <span class="required">*</span></label>
            <input class="form-control" id="mf-name" value="${Utils.escapeHtml(m.FullName || '')}" placeholder="முழு பெயர் (Full Name)" required>
          </div>
          <div class="form-group">
            <label class="form-label">2. பிறந்த தேதி & வயது (DOB & Age)</label>
            <div style="display:grid;grid-template-columns:2fr 1fr;gap:var(--s-2)">
              <input type="date" class="form-control" id="mf-dob" value="${m.DateOfBirth || ''}" onchange="Members.calculateAge(this.value)">
              <input type="number" class="form-control" id="mf-age" value="${m.Age || ''}" placeholder="வயது">
            </div>
          </div>
        </div>

        <!-- 3. கல்வித் தகுதி & வேலை -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">3. கல்வித் தகுதி (Educational Qualification)</label>
            <input class="form-control" id="mf-education" value="${Utils.escapeHtml(m.Education || '')}" placeholder="உதா: 10th / 12th / ITI / B.Sc">
          </div>
          <div class="form-group">
            <label class="form-label">வேலை (Occupation / Work)</label>
            <input class="form-control" id="mf-occupation" value="${Utils.escapeHtml(m.Occupation || '')}" placeholder="பள்ளி மாணவர் / பணி விவரம்">
          </div>
        </div>

        <!-- 4. கல்வி பயிலும் இடம் அல்லது பணிபுரியும் முகவரி -->
        <div class="form-group">
          <label class="form-label">4. கல்வி பயிலும் இடம் அல்லது பணிபுரியும் முகவரி (Institution / Workplace Address)</label>
          <input class="form-control" id="mf-school-address" value="${Utils.escapeHtml(m.SchoolWorkAddress || '')}" placeholder="பள்ளி / கல்லூரி / வேலை செய்யும் முகவரி">
        </div>

        <!-- 5. மதம் & 6. திருமண நிலை -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">5. மதம் (Religion)</label>
            <input class="form-control" id="mf-religion" value="${Utils.escapeHtml(m.Religion || 'கிறிஸ்தவர் (Christian)')}" placeholder="மதம்">
          </div>
          <div class="form-group">
            <label class="form-label">6. திருமண நிலை (Marital Status)</label>
            <select class="form-control" id="mf-marital">
              <option value="திருமணமாகாதவர்" ${m.MaritalStatus !== 'திருமணமானவர்' ? 'selected' : ''}>திருமணமாகாதவர் (Unmarried)</option>
              <option value="திருமணமானவர்" ${m.MaritalStatus === 'திருமணமானவர்' ? 'selected' : ''}>திருமணமானவர் (Married)</option>
            </select>
          </div>
        </div>

        <!-- 7. வீட்டு முகவரி & தொடர்பு விவரங்கள் -->
        <div class="form-group">
          <label class="form-label">7. வீட்டு முகவரி (Home Address)</label>
          <textarea class="form-control" id="mf-address" rows="2" placeholder="முழு வீட்டு முகவரி">${Utils.escapeHtml(m.Address || '')}</textarea>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--s-2)">
          <div class="form-group">
            <label class="form-label">தொடர்பு எண் (Phone) <span class="required">*</span></label>
            <input class="form-control" id="mf-phone" value="${Utils.escapeHtml(m.Phone || '')}" placeholder="+91 ...">
          </div>
          <div class="form-group">
            <label class="form-label">Email Id</label>
            <input class="form-control" id="mf-email" value="${Utils.escapeHtml(m.Email || '')}" placeholder="email@gmail.com">
          </div>
          <div class="form-group">
            <label class="form-label">Insta Id</label>
            <input class="form-control" id="mf-insta" value="${Utils.escapeHtml(m.InstaID || '')}" placeholder="@instagram_id">
          </div>
        </div>

        <!-- 8. தந்தையின் பெயர் & 9. தாயின் பெயர் -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">8. தந்தையின் பெயர் (Father's Name)</label>
            <input class="form-control" id="mf-father" value="${Utils.escapeHtml(m.FatherName || '')}" placeholder="தந்தையின் பெயர்">
          </div>
          <div class="form-group">
            <label class="form-label">9. தாயின் பெயர் (Mother's Name)</label>
            <input class="form-control" id="mf-mother" value="${Utils.escapeHtml(m.MotherName || '')}" placeholder="தாயின் பெயர்">
          </div>
        </div>

        <!-- 10. மன்றத்தில் எத்தனை வருடங்கள் உறுப்பினர்களாக உள்ளீர்கள் -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">10. மன்றத்தில் எத்தனை வருடங்கள் உறுப்பினர்? (Years in DBYC)</label>
            <input class="form-control" id="mf-years-in-org" value="${m.YearsInOrg || 'புதிய உறுப்பினர் (New)'}" placeholder="எ.கா: 2 வருடங்கள் / புதிய உறுப்பினர்">
          </div>
          <div class="form-group">
            <label class="form-label">11. உடன் பிறந்தோர் (Siblings count)</label>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--s-2)">
              <input type="number" class="form-control" id="mf-brothers" value="${m.Brothers || 0}" placeholder="சகோதரர்கள்">
              <input type="number" class="form-control" id="mf-sisters" value="${m.Sisters || 0}" placeholder="சகோதரிகள்">
            </div>
          </div>
        </div>

        <!-- 12. உங்கள் சகோதரர்கள் மன்றத்தில் இருந்தால் குறிப்பிடுக -->
        <div class="form-group">
          <label class="form-label">12. உங்கள் சகோதரர்கள் மன்றத்தில் இருந்தால் குறிப்பிடுக (Siblings in DBYC)</label>
          <input class="form-control" id="mf-siblings-dbyc" value="${Utils.escapeHtml(m.SiblingsInDBYC || '')}" placeholder="சகோதரர் பெயர் மற்றும் குழு">
        </div>

        <!-- 13. மன்றத்தில் சேருவதன் நோக்கம் -->
        <div class="form-group">
          <label class="form-label">13. மன்றத்தில் சேருவதன் நோக்கம் (Purpose of joining DBYC)</label>
          <input class="form-control" id="mf-purpose" value="${Utils.escapeHtml(m.Purpose || 'இளைஞர் உருவாக்கம், நற்பண்பு மற்றும் விளையாட்டு மேம்பாடு')}" placeholder="நோக்கம்">
        </div>

        <!-- 14. மன்றத்தில் நீங்கள் சேர விரும்புவது (விளையாட்டு & பிரிவுகள்) -->
        <div class="form-group">
          <label class="form-label" style="font-weight:700;color:var(--primary)">14. மன்றத்தில் நீங்கள் சேர விரும்புவது (Sports / Activities)</label>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--s-2);background:#f8fafc;padding:var(--s-3);border-radius:var(--r-md);border:1px solid var(--border)">
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer">
              <input type="checkbox" id="act-football" ${(currentSports.includes('கால்பந்து') || currentSports.includes('Football')) ? 'checked' : ''}> கால்பந்து (Football)
            </label>
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer">
              <input type="checkbox" id="act-volleyball" ${(currentSports.includes('கைப்பந்து') || currentSports.includes('Volleyball')) ? 'checked' : ''}> கைப்பந்து (Volleyball)
            </label>
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer">
              <input type="checkbox" id="act-tabletennis" ${(currentSports.includes('மேசைப்பந்து') || currentSports.includes('Table Tennis')) ? 'checked' : ''}> மேசைப்பந்து (Table Tennis)
            </label>
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer">
              <input type="checkbox" id="act-carrom" ${(currentSports.includes('கேரம்') || currentSports.includes('Carrom')) ? 'checked' : ''}> கேரம் (Carrom)
            </label>
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer">
              <input type="checkbox" id="act-gym" ${(currentSports.includes('உடற்பயிற்சி கூடம்') || currentSports.includes('Gym')) ? 'checked' : ''}> உடற்பயிற்சி கூடம் (Gym)
            </label>
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer">
              <input type="checkbox" id="act-other" ${(currentSports.includes('இதர') || currentSports.includes('Other')) ? 'checked' : ''}> இதர (Other)
            </label>
          </div>
        </div>

        <!-- 15. உங்கள் எதிர்காலத் திட்டம் & 16. இரத்தப் பிரிவு -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">15. உங்கள் எதிர்காலத் திட்டம் (Future Plan / Ambition)</label>
            <input class="form-control" id="mf-ambition" value="${Utils.escapeHtml(m.Ambition || '')}" placeholder="எதிர்கால லட்சியம்">
          </div>
          <div class="form-group">
            <label class="form-label">16. இரத்தப் பிரிவு (Blood Group)</label>
            <select class="form-control" id="mf-blood">
              ${['O+','A+','B+','AB+','O-','A-','B-','AB-'].map(b => `<option ${m.BloodGroup===b?'selected':''}>${b}</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- 17. உறுப்பினர் சேர்க்கப்படும் குழு & இல்லம் ஒதுக்கீடு -->
        <div class="form-row" style="background:#f1f5f9;padding:var(--s-3);border-radius:var(--r-md);border:1px solid #cbd5e1">
          <div class="form-group">
            <label class="form-label" style="font-weight:700">17. உறுப்பினர் சேர்க்கப்படும் குழு (Youth Group) <span class="required">*</span></label>
            <select class="form-control" id="mf-group" onchange="Members.syncAgeGroup(this.value)">
              <option value="Sub Juniors Group" ${currentGroup.includes('Sub')?'selected':''}>சப்-ஜூனியர் (Sub-Juniors 6-14 வயது)</option>
              <option value="Juniors Group" ${currentGroup==='Juniors Group'?'selected':''}>ஜூனியர் (Juniors 15-18 வயது)</option>
              <option value="Inters Group" ${currentGroup==='Inters Group'?'selected':''}>இன்டர்ஸ் (Inters 19-25 வயது)</option>
              <option value="Seniors Group" ${currentGroup==='Seniors Group'?'selected':''}>சீனியர்ஸ் (Seniors 25-34 வயது)</option>
              <option value="Super Seniors Group" ${currentGroup==='Super Seniors Group'?'selected':''}>சூப்பர் சீனியர்ஸ் (Super Seniors 34-55 வயது)</option>
              <option value="Elders Group" ${currentGroup==='Elders Group'?'selected':''}>எல்டர்ஸ் (Elders 56+ வயது)</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" style="font-weight:700">இல்லம் ஒதுக்கீடு (House Allocation) <span class="required">*</span></label>
            <select class="form-control" id="mf-house">
              ${Utils.HOUSES.map(h => `<option value="${h}" ${currentHouse === h ? 'selected' : ''}>${h}</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- 18. தனிப்பட்ட மற்றும் குடும்ப குறிப்புகள் -->
        <div class="form-group">
          <label class="form-label">18. உறுப்பினர் பற்றிய தனிப்பட்ட மற்றும் குடும்ப குறிப்புகள் (Remarks)</label>
          <textarea class="form-control" id="mf-remarks" rows="2" placeholder="இயக்குநர் / பொறுப்பாளர் குறிப்புகள்">${Utils.escapeHtml(m.Remarks || '')}</textarea>
        </div>

        <!-- பெற்றோர் & மாணவர் டிஜிட்டல் கையொப்பப் பெட்டகம் (Digital Signature Pad) -->
        <div class="sig-pad-box">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--s-2)">
            <label class="form-label" style="font-weight:700;color:var(--primary);margin:0">
              ✍️ பெற்றோர் / பாதுகாவலர் டிஜிட்டல் கையொப்பம் (Parent / Guardian Digital Signature)
            </label>
            <button type="button" class="btn btn-xs btn-outline" id="mf-parent-sig-clear">🗑️ அழி (Clear Signature)</button>
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin-bottom:6px">
            Touchscreen அல்லது Mouse வழியே உங்கள் விரல்/எழுதுகோல் கொண்டு கையொப்பமிடவும் (Sign using finger/mouse)
          </div>
          <canvas id="mf-parent-sig-canvas" class="sig-pad-canvas"></canvas>
        </div>

        <div class="sig-pad-box">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--s-2)">
            <label class="form-label" style="font-weight:700;color:var(--primary);margin:0">
              ✍️ விண்ணப்பதாரர் / மாணவர் டிஜிட்டல் கையொப்பம் (Applicant / Member Digital Signature)
            </label>
            <button type="button" class="btn btn-xs btn-outline" id="mf-member-sig-clear">🗑️ அழி (Clear Signature)</button>
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin-bottom:6px">
            உறுப்பினர் தன் சொந்த கையொப்பத்தை பதிவு செய்யவும்
          </div>
          <canvas id="mf-member-sig-canvas" class="sig-pad-canvas"></canvas>
        </div>

      </div>`;
  },

  calculateAge(dobStr) {
    if (!dobStr) return;
    const dob = new Date(dobStr);
    const diff = Date.now() - dob.getTime();
    const age = Math.floor(diff / (365.25 * 24 * 3600 * 1000));
    const ageInput = document.getElementById('mf-age');
    if (ageInput && age > 0) {
      ageInput.value = age;
      const groupSelect = document.getElementById('mf-group');
      if (groupSelect) {
        if (age <= 14) groupSelect.value = 'Sub Juniors Group';
        else if (age <= 18) groupSelect.value = 'Juniors Group';
        else if (age <= 25) groupSelect.value = 'Inters Group';
        else if (age <= 34) groupSelect.value = 'Seniors Group';
        else if (age <= 55) groupSelect.value = 'Super Seniors Group';
        else groupSelect.value = 'Elders Group';
      }
    }
  },

  syncAgeGroup(groupVal) {
    // Helper to recommend age range
  },

  async toggleInstantCamera() {
    const box = document.getElementById('camera-viewfinder-box');
    const video = document.getElementById('camera-video');
    if (!box || !video) return;

    if (this._cameraStream) {
      this.stopCameraStream();
      return;
    }

    try {
      this._cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false
      });
      video.srcObject = this._cameraStream;
      box.style.display = 'block';
      const btn = document.getElementById('btn-camera-toggle');
      if (btn) btn.textContent = '⏹ Close Camera';
    } catch (err) {
      console.warn('Camera access error:', err);
      UI.toast('error', 'Camera Error', 'Could not access device camera. Please upload an image file.');
    }
  },

  snapInstantPhoto() {
    const video = document.getElementById('camera-video');
    if (!video || !this._cameraStream) return;

    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    const vW = video.videoWidth;
    const vH = video.videoHeight;
    const size = Math.min(vW, vH);
    const sX = (vW - size) / 2;
    const sY = (vH - size) / 2;

    ctx.drawImage(video, sX, sY, size, size, 0, 0, 400, 400);
    this._photoBase64 = canvas.toDataURL('image/jpeg', 0.88);

    const preview = document.getElementById('mf-preview-img');
    if (preview) preview.src = this._photoBase64;

    this.stopCameraStream();
    UI.toast('success', 'Photo Captured', 'Instant headshot snapped successfully!');
  },

  stopCameraStream() {
    if (this._cameraStream) {
      this._cameraStream.getTracks().forEach(t => t.stop());
      this._cameraStream = null;
    }
    const box = document.getElementById('camera-viewfinder-box');
    if (box) box.style.display = 'none';
    const btn = document.getElementById('btn-camera-toggle');
    if (btn) btn.textContent = '📸 Instant Camera (நேரலை கேமரா)';
  },

  async handlePhotoSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      this.stopCameraStream();
      this._photoBase64 = await Utils.compressImage(file, 400, 400, 0.88);
      const preview = document.getElementById('mf-preview-img');
      if (preview) preview.src = this._photoBase64;
    } catch (err) {
      console.error(err);
      UI.toast('error', 'Error', 'Failed to process selected image');
    }
  },

  async saveMember() {
    const house = document.getElementById('mf-house')?.value || 'Bosco House (Red)';
    const sports = [];
    if (document.getElementById('act-football')?.checked) sports.push('கால்பந்து (Football)');
    if (document.getElementById('act-volleyball')?.checked) sports.push('கைப்பந்து (Volleyball)');
    if (document.getElementById('act-tabletennis')?.checked) sports.push('மேசைப்பந்து (Table Tennis)');
    if (document.getElementById('act-carrom')?.checked) sports.push('கேரம் (Carrom)');
    if (document.getElementById('act-gym')?.checked) sports.push('உடற்பயிற்சி கூடம் (Gym)');
    if (document.getElementById('act-other')?.checked) sports.push('இதர (Other)');

    const data = {
      formNo: document.getElementById('mf-formno')?.value.trim(),
      year: document.getElementById('mf-year')?.value.trim(),
      fullName: document.getElementById('mf-name')?.value.trim(),
      dateOfBirth: document.getElementById('mf-dob')?.value,
      age: document.getElementById('mf-age')?.value,
      education: document.getElementById('mf-education')?.value.trim(),
      occupation: document.getElementById('mf-occupation')?.value.trim(),
      schoolWorkAddress: document.getElementById('mf-school-address')?.value.trim(),
      religion: document.getElementById('mf-religion')?.value.trim(),
      maritalStatus: document.getElementById('mf-marital')?.value,
      address: document.getElementById('mf-address')?.value.trim(),
      phone: document.getElementById('mf-phone')?.value.trim(),
      email: document.getElementById('mf-email')?.value.trim(),
      instaID: document.getElementById('mf-insta')?.value.trim(),
      fatherName: document.getElementById('mf-father')?.value.trim(),
      motherName: document.getElementById('mf-mother')?.value.trim(),
      yearsInOrg: document.getElementById('mf-years-in-org')?.value.trim(),
      brothers: document.getElementById('mf-brothers')?.value,
      sisters: document.getElementById('mf-sisters')?.value,
      siblingsInDBYC: document.getElementById('mf-siblings-dbyc')?.value.trim(),
      purpose: document.getElementById('mf-purpose')?.value.trim(),
      sportsActivities: sports,
      ambition: document.getElementById('mf-ambition')?.value.trim(),
      bloodGroup: document.getElementById('mf-blood')?.value,
      group: document.getElementById('mf-group')?.value,
      house: house,
      team: house,
      remarks: document.getElementById('mf-remarks')?.value.trim(),
      emergencyContact: (document.getElementById('mf-father')?.value || document.getElementById('mf-mother')?.value || 'Parent') + ' - ' + (document.getElementById('mf-phone')?.value || ''),
      photoBase64: this._photoBase64,
      photoURL: this._photoBase64
    };

    const parentSig = this._parentSigPad ? this._parentSigPad.getDataURL() : '';
    const memberSig = this._memberSigPad ? this._memberSigPad.getDataURL() : '';
    if (parentSig) {
      data.parentSignature = parentSig;
    } else if (this._editingId) {
      const existing = this._data.find(x => x.MemberID === this._editingId);
      if (existing && existing.ParentSignature) data.parentSignature = existing.ParentSignature;
    }
    if (memberSig) {
      data.memberSignature = memberSig;
    } else if (this._editingId) {
      const existing = this._data.find(x => x.MemberID === this._editingId);
      if (existing && existing.MemberSignature) data.memberSignature = existing.MemberSignature;
    }

    if (!data.fullName) {
      UI.toast('warning', 'Validation', 'பெயர் அவசியம் (Full name is required).');
      return;
    }

    this.stopCameraStream();
    UI.showLoading('Saving DBYC admission application...');

    let res;
    if (this._editingId) {
      res = await API.updateMember({ ...data, memberID: this._editingId });
    } else {
      res = await API.addMember(data);
    }
    UI.hideLoading();

    if (res.success) {
      UI.toast('success', 'Admission Enrolled', this._editingId ? 'Member details updated.' : 'உறுப்பினர் சேர்க்கை பதிவு செய்யப்பட்டது! Awaiting qualification.');
      this.closeMemberModal();
      await this.loadMembers();
    } else {
      UI.toast('error', 'Error', res.error);
    }
  },

  // 4. Official Printable 2-Page DBYC Admission Form & 15 Rules Document
  printApplication(memberID) {
    const m = this._data.find(x => x.MemberID === memberID);
    if (!m) return;

    const photoSrc = m.PhotoURL || m.PhotoBase64 || Utils.defaultAvatarSvg(m.FullName, m.Gender || 'Male');
    const founderSrc = Utils.getFounderImageSrc();
    const logoSrc = Utils.getLogoSrc();
    const house = m.House || m.Team || 'Bosco House (Red)';
    const sportsList = (m.SportsActivities && m.SportsActivities.length) ? m.SportsActivities.join(', ') : 'கால்பந்து (Football), உடற்பயிற்சி கூடம் (Gym)';

    UI.openModal('app-print-modal', `
      <div class="modal-header">
        <span class="modal-title">📄 தொன்போஸ்கோ இளைஞர் மன்றம் - விண்ணப்பம் & விதிமுறைகள் பட்டயம்</span>
        <div style="display:flex;gap:var(--s-2);align-items:center">
          <button class="btn btn-outline btn-sm" onclick="Members.openSignatureModal('${m.MemberID}')">✍️ Digital Sign (கையொப்பமிடு)</button>
          <button class="btn btn-primary btn-sm" onclick="window.print()">🖨️ Print Form (A4)</button>
          <button class="modal-close" onclick="UI.closeModal('app-print-modal')">✕</button>
        </div>
      </div>
      <div class="modal-body" style="padding:var(--s-4);background:#f1f5f9;overflow-y:auto;max-height:85vh">
        
        <!-- PAGE 1: உறுப்பினர் புதுப்பித்தல் / சேர்க்கை விண்ணப்பம் -->
        <div id="admission-form-printable" class="admission-form-sheet admission-page-1" style="margin-bottom:24px">
          
          <div style="display:flex;align-items:flex-start;justify-content:space-between;border-bottom:2px solid #003F8A;padding-bottom:12px;margin-bottom:12px">
            <div style="width:70px;text-align:center">
              <img src="${founderSrc}" style="width:64px;height:74px;object-fit:cover;border:1px solid #94a3b8;border-radius:2px" alt="Don Bosco">
              <div style="font-size:9px;margin-top:2px">படிவம் எண்: <strong>${m.FormNo || m.MemberID}</strong></div>
              <div style="font-size:9px">வருடம்: <strong>${m.Year || '2026'}</strong></div>
            </div>

            <div style="text-align:center;flex:1;padding:0 10px">
              <div style="font-size:18px;font-weight:800;color:#003F8A">தொன்போஸ்கோ இளைஞர் மன்றம்</div>
              <div style="font-size:12px;font-weight:600;color:#334155">பேசின் பாலம், சென்னை - 600 012</div>
              <div style="display:inline-block;border:1.5px solid #003F8A;padding:3px 18px;font-weight:700;font-size:12px;margin-top:6px;border-radius:4px;background:#f8fafc">
                உறுப்பினர் புதுப்பித்தல் / சேர்க்கை விண்ணப்பம்
              </div>
            </div>

            <div style="width:80px;height:95px;border:1.5px dashed #64748b;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#fff">
              <img src="${photoSrc}" style="width:100%;height:100%;object-fit:cover" alt="Student Photo">
            </div>
          </div>

          <!-- 18 Application Fields Table -->
          <div style="display:flex;flex-direction:column;gap:8px;font-size:11px;color:#1e293b">
            
            <div style="border-bottom:1px dotted #cbd5e1;padding-bottom:3px">
              <strong>1. பெயர் (Name):</strong> <span style="font-size:13px;font-weight:700;color:#003F8A">${Utils.escapeHtml(m.FullName)}</span>
            </div>

            <div style="display:grid;grid-template-columns:2fr 1fr;border-bottom:1px dotted #cbd5e1;padding-bottom:3px">
              <div><strong>2. பிறந்த தேதி (DOB):</strong> ${Utils.formatDate(m.DateOfBirth)}</div>
              <div><strong>வயது (Age):</strong> ${m.Age || '-'}</div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;border-bottom:1px dotted #cbd5e1;padding-bottom:3px">
              <div><strong>3. கல்வித் தகுதி (Education):</strong> ${Utils.escapeHtml(m.Education || 'குறிப்பிடப்படவில்லை')}</div>
              <div><strong>வேலை (Occupation):</strong> ${Utils.escapeHtml(m.Occupation || 'மாணவர்')}</div>
            </div>

            <div style="border-bottom:1px dotted #cbd5e1;padding-bottom:3px">
              <strong>4. கல்வி பயிலும் இடம் / பணிபுரியும் முகவரி:</strong> ${Utils.escapeHtml(m.SchoolWorkAddress || 'சென்னை')}
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;border-bottom:1px dotted #cbd5e1;padding-bottom:3px">
              <div><strong>5. மதம் (Religion):</strong> ${Utils.escapeHtml(m.Religion || 'கிறிஸ்தவர்')}</div>
              <div><strong>6. திருமண நிலை:</strong> ${m.MaritalStatus || 'திருமணமாகாதவர்'}</div>
            </div>

            <div style="border-bottom:1px dotted #cbd5e1;padding-bottom:3px">
              <strong>7. வீட்டு முகவரி (Home Address):</strong> ${Utils.escapeHtml(m.Address || 'பேசின் பாலம், சென்னை')}
            </div>

            <div style="display:grid;grid-template-columns:1.2fr 1.5fr 1fr;border-bottom:1px dotted #cbd5e1;padding-bottom:3px">
              <div><strong>தொடர்பு எண்:</strong> ${Utils.escapeHtml(m.Phone || '')}</div>
              <div><strong>Email:</strong> ${Utils.escapeHtml(m.Email || 'Not Provided')}</div>
              <div><strong>Insta Id:</strong> ${Utils.escapeHtml(m.InstaID || '-')}</div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;border-bottom:1px dotted #cbd5e1;padding-bottom:3px">
              <div><strong>8. தந்தையின் பெயர்:</strong> ${Utils.escapeHtml(m.FatherName || 'Father')}</div>
              <div><strong>9. தாயின் பெயர்:</strong> ${Utils.escapeHtml(m.MotherName || 'Mother')}</div>
            </div>

            <div style="border-bottom:1px dotted #cbd5e1;padding-bottom:3px">
              <strong>10. மன்றத்தில் எத்தனை வருடங்கள் உறுப்பினர்களாக உள்ளீர்கள்:</strong> ${Utils.escapeHtml(m.YearsInOrg || 'புதிய உறுப்பினர்')}
            </div>

            <div style="border-bottom:1px dotted #cbd5e1;padding-bottom:3px">
              <strong>11. உடன் பிறந்தோர்:</strong> சகோதரர்கள்: <strong>${m.Brothers || 0}</strong> &bull; சகோதரிகள்: <strong>${m.Sisters || 0}</strong>
            </div>

            <div style="border-bottom:1px dotted #cbd5e1;padding-bottom:3px">
              <strong>12. உங்கள் சகோதரர்கள் மன்றத்தில் இருந்தால் குறிப்பிடுக:</strong> ${Utils.escapeHtml(m.SiblingsInDBYC || 'இல்லை')}
            </div>

            <div style="border-bottom:1px dotted #cbd5e1;padding-bottom:3px">
              <strong>13. மன்றத்தில் சேருவதன் நோக்கம்:</strong> ${Utils.escapeHtml(m.Purpose || 'இளைஞர் நற்பண்பு உருவாக்கம் மற்றும் விளையாட்டு')}
            </div>

            <div style="border-bottom:1px dotted #cbd5e1;padding-bottom:3px">
              <strong>14. மன்றத்தில் நீங்கள் சேர விரும்புவது:</strong> <strong>${sportsList}</strong>
            </div>

            <div style="display:grid;grid-template-columns:2fr 1fr;border-bottom:1px dotted #cbd5e1;padding-bottom:3px">
              <div><strong>15. உங்கள் எதிர்காலத் திட்டம் (Future Plan):</strong> ${Utils.escapeHtml(m.Ambition || 'முன்னேற்றம்')}</div>
              <div><strong>16. இரத்தப் பிரிவு:</strong> <strong>${m.BloodGroup || 'O+'}</strong></div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;border-bottom:1px dotted #cbd5e1;padding-bottom:3px;background:#f8fafc;padding:4px">
              <div><strong>17. சேர்க்கப்படும் குழு:</strong> <strong>${m.Group}</strong></div>
              <div><strong>ஒதுக்கப்பட்ட இல்லம்:</strong> <strong>${house}</strong></div>
            </div>

            <div style="border-bottom:1px dotted #cbd5e1;padding-bottom:3px">
              <strong>18. தனிப்பட்ட மற்றும் குடும்ப குறிப்புகள்:</strong> ${Utils.escapeHtml(m.Remarks || 'ஒழுக்கமுள்ள உறுப்பினர்')}
            </div>

          </div>

          <div style="display:flex;justify-content:space-between;margin-top:25px;padding-top:10px">
            <div style="text-align:center;width:210px">
              <div style="height:45px;display:flex;align-items:flex-end;justify-content:center;margin-bottom:2px">
                ${m.ParentSignature ? `<img src="${m.ParentSignature}" style="max-height:42px;max-width:180px;object-fit:contain" alt="Parent Signature">` : `<div style="height:25px;border-bottom:1px solid #0f172a;width:180px"></div>`}
              </div>
              <div style="border-top:${m.ParentSignature ? '1px solid #003F8A' : 'none'};padding-top:3px">
                <div style="font-size:10px;font-weight:700">பெற்றோர் / பாதுகாவலர் கையொப்பம்</div>
                <div style="font-size:8px;color:#64748b">(for Sub-Juniors & Juniors only 10-18yrs)</div>
                ${m.ParentSignature ? `<div style="font-size:8px;color:#16a34a;font-weight:700">✓ Digital Signature Captured</div>` : ''}
              </div>
            </div>
            <div style="text-align:center;width:210px">
              <div style="height:45px;display:flex;align-items:flex-end;justify-content:center;margin-bottom:2px">
                ${m.MemberSignature ? `<img src="${m.MemberSignature}" style="max-height:42px;max-width:180px;object-fit:contain" alt="Member Signature">` : `<div style="height:25px;border-bottom:1px solid #0f172a;width:180px"></div>`}
              </div>
              <div style="border-top:${m.MemberSignature ? '1px solid #003F8A' : 'none'};padding-top:3px">
                <div style="font-size:10px;font-weight:700">உறுப்பினர் கையொப்பம்</div>
                <div style="font-size:8px;color:#64748b">(Applicant / Member Signature)</div>
                ${m.MemberSignature ? `<div style="font-size:8px;color:#16a34a;font-weight:700">✓ Digital Signature Captured</div>` : ''}
              </div>
            </div>
          </div>

        </div>


        <!-- PAGE 2: தொன்போஸ்கோ இளைஞர் மன்றத்தின் அதிகாரப்பூர்வ விதிமுறைகள் பட்டயம் (15 Rules of DBYC Plate) -->
        <div id="rules-plate-printable" class="rules-plate-sheet">
          
          <!-- Plate Header -->
          <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:2.5px solid #003F8A;padding-bottom:10px;margin-bottom:12px">
            <div style="width:65px;text-align:center">
              <img src="${founderSrc}" style="width:55px;height:65px;object-fit:cover;border:1px solid #b45309;border-radius:3px" alt="Don Bosco">
              <div style="font-size:8px;font-weight:700;color:#003F8A;margin-top:2px">St. John Bosco</div>
            </div>

            <div style="text-align:center;flex:1;padding:0 8px">
              <div style="font-size:17px;font-weight:800;color:#003F8A;letter-spacing:0.5px">தொன்போஸ்கோ இளைஞர் மன்றம்</div>
              <div style="font-size:11px;font-weight:600;color:#334155">பேசின் பாலம், சென்னை - 600 012 &bull; Basin Bridge, Chennai - 600 012</div>
              <div style="display:inline-block;background:#003F8A;color:#ffffff;padding:2px 16px;border-radius:12px;font-size:11px;font-weight:700;margin-top:4px;letter-spacing:0.3px">
                📜 மன்றத்தின் 15 அதிகாரப்பூர்வ விதிமுறைகள் பட்டயம் (Rules Plate)
              </div>
              <div style="font-size:9px;color:#b45309;font-weight:600;margin-top:2px;font-style:italic">"Da Mihi Animas Caetera Tolle" (அன்பும் நற்பண்பும் நிறைந்த இளைஞர் உருவாக்கம்)</div>
            </div>

            <div style="width:65px;text-align:center">
              <img src="${logoSrc}" style="width:55px;height:55px;object-fit:contain;border-radius:50%;border:1px solid #003F8A" alt="DBYC Logo">
              <div style="font-size:8px;font-weight:700;color:#003F8A;margin-top:2px">DBYC CHENNAI</div>
            </div>
          </div>

          <!-- Structured 5 Rule Plots -->
          <div style="font-size:10px;line-height:1.45;color:#0f172a;display:flex;flex-direction:column;gap:6px">
            
            <!-- Plot 1: சலேசிய அமைப்பு & வயது வரம்பு தகுதி -->
            <div class="rules-plot-box">
              <span class="rules-plot-badge">பிரிவு 1: சலேசிய நிர்வாகம் & 6 வயது வரம்பு குழுக்கள்</span>
              <div style="margin-bottom:3px"><strong>1.</strong> இளைஞர் மன்றம் சலேசிய சபையினரால் நடத்தப்படுகின்றது. தமிழக சலேசிய இளைஞர் மன்றங்களின் விதிமுறைக்கும், தொன்போஸ்கோ மையத்தின் விதிமுறைக்கும் உட்பட்டது.</div>
              <div style="margin-bottom:3px"><strong>2.</strong> மன்ற உறுப்பினர்களாக, 6 முதல் 14 வயது வரை சப்-ஜூனியர் குழுவிலும், 15 முதல் 18 வரை ஜூனியர், 19 முதல் 25 வரை இன்டர்ஸ், 25 முதல் 34 வரை சீனியர்ஸ், 34 முதல் 55 வரை சூப்பர் சீனியர்ஸ், 56 வயதிற்கு மேற்பட்டவர்கள் எல்டர்ஸ் குழுவிலும் இடம்பெறுவார்கள். சப்-ஜூனியர்ஸ் & ஜூனியர்ஸ் பள்ளியில் படிப்பவர்களாக இருக்கவேண்டும். குடும்ப சூழலால் வேலைக்கு சென்றால் பெற்றோர் இயக்குநரையும், பொறுப்பாளரையும் சந்திக்கவேண்டும்.</div>
              <div><strong>3.</strong> மன்ற உறுப்பினர்கள் ஓராண்டு (ஜூன் முதல் மே வரை) முழுவதும் மன்ற கூட்டங்கள் நிகழ்வுகளில் 75% வருகை பதிவு மற்றும் சந்தா முழுமையாக செலுத்தியவர்கள் மட்டுமே புதுப்பிக்க தகுதிபெற்றவர்களாவார்கள்.</div>
            </div>

            <!-- Plot 2: QR அடையாள அட்டை & பயிற்சி நேர நெறிமுறைகள் -->
            <div class="rules-plot-box">
              <span class="rules-plot-badge">பிரிவு 2: QR அடையாள அட்டை & பயிற்சி நேரம்</span>
              <div style="margin-bottom:3px"><strong>4. உறுப்பினர்கள் தங்கள் அதிகாரப்பூர்வ QR அடையாள அட்டையை தினமும் கொண்டுவருதல் கட்டாயம்.</strong></div>
              <div style="margin-bottom:3px"><strong>5.</strong> இளைஞர் மன்ற உறுப்பினர்களின் பயிற்சி நேரம் வார நாட்களில் மாலை 4:30 மணிமுதல் இரவு 7:30 மணிவரை. சிறப்பு போட்டிகள் நடைபெறும் முன் மன்ற இயக்குநரின் முன் அனுமதி பெறவேண்டும்.</div>
              <div><strong>6.</strong> கேரம் குழுவை மாலை (4:00 மணிமுதல் 6:00 மணிவரை) தவிர மற்றவர்கள் கண்டிப்பாக மாலை 6:30 மணிக்கு மன்றத்தை விட்டு செல்லவேண்டும்.</div>
            </div>

            <!-- Plot 3: ஒழுக்கக் கட்டுப்பாடு & அணி விசுவாசம் -->
            <div class="rules-plot-box">
              <span class="rules-plot-badge">பிரிவு 3: நன்னடத்தை & ஒழுங்கு விதிகள்</span>
              <div style="margin-bottom:3px"><strong>7.</strong> விதிமுறைகள் முறைப்படி கடைபிடிக்காமல் இருந்தாலோ, தீய வார்த்தைகள், தீய நடத்தைகள், வன்முறை செயல்கள் மற்றும் போதை பொருட்கள் பயன்படுத்தினால் எவ்வித முன் எச்சரிக்கையுமின்றி இயக்குநரால் மன்றத்தில் உடனடியாக வெளியேற்றப்படுவார்கள்.</div>
              <div><strong>8.</strong> மன்ற உறுப்பினர்கள் வெளியில் இருக்கும் வேறு கால்பந்து மற்றும் மேசைப்பந்தாட்டம் அணிகளில் விளையாடினால் மன்ற ஒழுங்கு நடைமுறைப்படி அவரை உடனடியாக மன்றத்திலிருந்து வெளியேற்றப்படுவர். ஒருவேளை அவருக்கு அந்நிறுவனத்தில் வேலை வாய்ப்பு கிடைக்கும் பட்சத்தில் மன்ற இயக்குநரின் அனுமதி பெற்று விளையாடலாம்.</div>
            </div>

            <!-- Plot 4: பொதுக் கூட்டங்கள் & நிதி விவகாரங்கள் -->
            <div class="rules-plot-box">
              <span class="rules-plot-badge">பிரிவு 4: மன்றக் கூட்டங்கள் & நிதி விவகாரங்கள்</span>
              <div style="margin-bottom:3px"><strong>9.</strong> ஞாயிறு காலை 10:00 மணியளவில் நடைபெறும் மன்ற பொதுக் கூட்டத்திற்கு வர இயலாதவர்கள் மன்றத்தில் நுழைய அனுமதி மறுக்கப்படும்.</div>
              <div style="margin-bottom:3px"><strong>10.</strong> குழு தலைவர்கள் அல்லது மன்ற செயற்குழு கூட்டம் ஞாயிற்றுக்கிழமைகளில் காலை 11:00 மணியிலிருந்து மதியம் 1:00 மணிவரை நடைபெறும்.</div>
              <div><strong>11.</strong> மன்றத்தின் நிகழ்வுகளுக்கு பண உதவி, பொது உதவி, வெளியிலிருந்து பெறுவதற்கு இயக்குநர் மற்றும் உதவி இயக்குநர் மற்றும் பொறுப்பாளர் ஆகியோருக்கு மட்டுமே அதிகாரம் உள்ளது. இவர்களின் அனுமதியின்றி வேறு யாரும் பண உதவி, பொருள் உதவி பெறக்கூடாது.</div>
            </div>

            <!-- Plot 5: வளாக சொத்து & இயக்குநரின் தனி அதிகாரம் -->
            <div class="rules-plot-box">
              <span class="rules-plot-badge">பிரிவு 5: வளாக சொத்துப் பாதுகாப்பு & திருத்த அதிகாரம்</span>
              <div style="margin-bottom:2px"><strong>12.</strong> மன்ற கட்டிடம், விளையாட்டு உபகரணங்கள், மற்ற இதர பொருட்கள் ஆகியவை அனைவருக்கும் பயன்படுபவை. ஆகவே இவைகளை பாதுகாக்க வேண்டியது ஒவ்வொரு உறுப்பினரின் கடமை. சேதப்படுத்தினால் இயக்குநரால் தகுந்த நடவடிக்கை எடுக்கப்படும்.</div>
              <div style="margin-bottom:2px"><strong>13.</strong> மன்றத்தின் நிகழ்ச்சிகள் கண்டிப்பாக தொன்போஸ்கோ தொழில்நுட்ப வளாகத்தில் பல்வேறு பிரிவுகளில் உள்ள நிகழ்ச்சிகளை பொருத்து அமையும்.</div>
              <div style="margin-bottom:2px"><strong>14.</strong> பொதுவான ஒழுங்கு முறைகளையும், ஒவ்வொரு குழுவுக்கும் கொடுக்கப்பட்டுள்ள விதிமுறைகளையும் கண்டிப்பாக பின்பற்ற வேண்டும்.</div>
              <div><strong>15.</strong> மன்றத்தின் விதிமுறைகளை மாற்றி அமைக்கவோ அல்லது சீர் செய்யவோ இயக்குநருக்கு முழு உரிமை உண்டு.</div>
            </div>

          </div>

          <!-- உறுதிமொழி பலகை (Undertaking / Pledge Plaque) -->
          <div style="margin-top:8px;background:#fefce8;padding:8px 12px;border:1.5px solid #ca8a04;border-radius:4px;font-size:9.5px;line-height:1.45;color:#713f12">
            <strong style="color:#854d0e;font-size:10.5px">உறுதிமொழி பலகை (Official Undertaking):</strong><br>
            தொன்போஸ்கோ இளைஞர் மன்றத்தில் சேர விரும்பும் நான் மேற்கூறப்பட்ட 15 விதிமுறைகள் அனைத்திற்கும் கீழ்ப்படிவேன் என்றும், மன்ற தலைவர்கள், இயக்குநரின் ஆலோசனைகளுக்கு இணங்க அன்பு, அமைதி, ஆற்றல், ஆனந்தம் ஆகியவற்றின் மேன்மையை புரிந்து வாழவும் உறுதியளிக்கிறேன். மேற்குறிப்பிட்டுள்ள விதிமுறைகளை மீறி செயல்பட்டால் மன்றத்தின் விதிமுறைக்கு உட்பட்டு உறுப்பினர் தகுதியை விலக்க சம்மதிக்கிறேன்.
          </div>

          <!-- 4-Column Official Signatures & Approvals Plaque -->
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:16px;text-align:center;border-top:1.5px dashed #cbd5e1;padding-top:10px">
            
            <!-- Parent / Guardian -->
            <div>
              <div style="height:42px;display:flex;align-items:flex-end;justify-content:center;margin-bottom:2px">
                ${m.ParentSignature ? `<img src="${m.ParentSignature}" style="max-height:40px;max-width:130px;object-fit:contain" alt="Parent Signature">` : `<div style="height:25px;border-bottom:1px solid #0f172a;width:120px"></div>`}
              </div>
              <div style="border-top:${m.ParentSignature ? '1px solid #003F8A' : 'none'};padding-top:2px">
                <div style="font-size:9.5px;font-weight:700">பெற்றோர் கையொப்பம்</div>
                <div style="font-size:8px;color:#334155">${Utils.escapeHtml(m.FatherName || m.MotherName || 'Parent / Guardian')}</div>
                ${m.ParentSignature ? `<div style="font-size:7.5px;color:#16a34a;font-weight:700">✓ Digital Signature Captured</div>` : ''}
              </div>
            </div>

            <!-- Member Signature -->
            <div>
              <div style="height:42px;display:flex;align-items:flex-end;justify-content:center;margin-bottom:2px">
                ${m.MemberSignature ? `<img src="${m.MemberSignature}" style="max-height:40px;max-width:130px;object-fit:contain" alt="Member Signature">` : `<div style="height:25px;border-bottom:1px solid #0f172a;width:120px"></div>`}
              </div>
              <div style="border-top:${m.MemberSignature ? '1px solid #003F8A' : 'none'};padding-top:2px">
                <div style="font-size:9.5px;font-weight:700">உறுப்பினர் கையொப்பம்</div>
                <div style="font-size:8px;color:#334155">${Utils.escapeHtml(m.FullName)}</div>
                ${m.MemberSignature ? `<div style="font-size:7.5px;color:#16a34a;font-weight:700">✓ Digital Signature Captured</div>` : ''}
              </div>
            </div>

            <!-- Assistant Director -->
            <div>
              <div style="height:42px;display:flex;align-items:flex-end;justify-content:center;margin-bottom:2px">
                <div style="height:25px;border-bottom:1px solid #0f172a;width:120px"></div>
              </div>
              <div style="padding-top:2px">
                <div style="font-size:9.5px;font-weight:700">உதவி இயக்குநர் (DBYC)</div>
                <div style="font-size:8px;color:#64748b">நேரடி பொறுப்பாளர்</div>
              </div>
            </div>

            <!-- Director, SDB -->
            <div>
              <div style="height:42px;display:flex;align-items:flex-end;justify-content:center;margin-bottom:2px">
                <div style="height:25px;border-bottom:1px solid #0f172a;width:120px"></div>
              </div>
              <div style="padding-top:2px">
                <div style="font-size:9.5px;font-weight:700">Rev. Fr. இயக்குநர், SDB</div>
                <div style="font-size:8px;color:#64748b">Don Bosco Youth Centre</div>
              </div>
            </div>

          </div>

        </div>

      </div>
      <div class="modal-footer">
        <button class="btn btn-outline" onclick="Members.openSignatureModal('${m.MemberID}')">✍️ Digital Sign (கையொப்பமிடு)</button>
        <button class="btn btn-primary" onclick="window.print()">🖨️ Print Application & Rules (A4)</button>
        <button class="btn btn-ghost" onclick="UI.closeModal('app-print-modal')">Close</button>
      </div>`);
  },

  // Interactive Digital Signature Pad Initializer
  initSignaturePad(canvasId, clearBtnId, existingDataUrl = null) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = rect.width || 460;
    const height = rect.height || 130;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#002855';

    let isDrawing = false;
    let hasDrawn = false;

    if (existingDataUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
        hasDrawn = true;
      };
      img.src = existingDataUrl;
    }

    const getPos = (e) => {
      const r = canvas.getBoundingClientRect();
      const clientX = (e.touches && e.touches.length > 0) ? e.touches[0].clientX : e.clientX;
      const clientY = (e.touches && e.touches.length > 0) ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - r.left,
        y: clientY - r.top
      };
    };

    const startDraw = (e) => {
      e.preventDefault();
      isDrawing = true;
      hasDrawn = true;
      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    };

    const draw = (e) => {
      if (!isDrawing) return;
      e.preventDefault();
      const pos = getPos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    };

    const stopDraw = () => {
      if (isDrawing) {
        isDrawing = false;
        ctx.closePath();
      }
    };

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stopDraw);

    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    window.addEventListener('touchend', stopDraw);
    window.addEventListener('touchcancel', stopDraw);

    const clearBtn = document.getElementById(clearBtnId);
    if (clearBtn) {
      clearBtn.onclick = (e) => {
        e.preventDefault();
        ctx.clearRect(0, 0, width, height);
        hasDrawn = false;
      };
    }

    return {
      isEmpty: () => !hasDrawn,
      getDataURL: () => {
        if (!hasDrawn) return '';
        const temp = document.createElement('canvas');
        temp.width = width;
        temp.height = height;
        const tctx = temp.getContext('2d');
        tctx.drawImage(canvas, 0, 0, width, height);
        return temp.toDataURL('image/png');
      },
      clear: () => {
        ctx.clearRect(0, 0, width, height);
        hasDrawn = false;
      }
    };
  },

  // Standalone Digital Signature Modal for Parent and Member
  openSignatureModal(memberID) {
    const m = this._data.find(x => x.MemberID === memberID);
    if (!m) return;

    UI.openModal('signature-modal', `
      <div class="modal-header">
        <span class="modal-title">✍️ பெற்றோரின் டிஜிட்டல் கையொப்பம் (Digital Signature)</span>
        <button class="modal-close" onclick="UI.closeModal('signature-modal')">✕</button>
      </div>
      <div class="modal-body" style="padding:var(--s-4);max-height:85vh;overflow-y:auto">
        <div style="background:var(--surface-alt);padding:var(--s-3);border-radius:var(--r-md);margin-bottom:var(--s-4);display:flex;align-items:center;justify-content:space-between">
          <div>
            <div style="font-weight:700;font-size:14px;color:var(--primary)">${Utils.escapeHtml(m.FullName)} (${m.MemberID})</div>
            <div style="font-size:12px;color:var(--text-muted)">குழு: ${m.Group} &bull; இல்லம்: ${m.House || m.Team}</div>
            <div style="font-size:11px;color:#1e293b;margin-top:2px">தந்தை/தாய்: <strong>${Utils.escapeHtml(m.FatherName || m.MotherName || 'பெற்றோர்')}</strong></div>
          </div>
          <div>${Utils.avatarHtml(m)}</div>
        </div>

        <!-- Parent / Guardian Signature Pad -->
        <div class="sig-pad-box">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <label class="form-label" style="font-weight:700;margin:0">
              ✍️ பெற்றோர் / பாதுகாவலர் கையொப்பம் (Parent / Guardian Signature)
            </label>
            <button type="button" class="btn btn-xs btn-outline" id="quick-parent-sig-clear">🗑️ அழி (Clear)</button>
          </div>
          <div style="font-size:11px;color:#64748b;margin-bottom:6px">
            உங்கள் விரல் (Touchscreen) அல்லது Mouse வழியே கையொப்பமிடவும்
          </div>
          <canvas id="quick-parent-sig-canvas" class="sig-pad-canvas"></canvas>
        </div>

        <!-- Member Signature Pad -->
        <div class="sig-pad-box">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <label class="form-label" style="font-weight:700;margin:0">
              ✍️ உறுப்பினர் / மாணவர் கையொப்பம் (Student / Member Signature)
            </label>
            <button type="button" class="btn btn-xs btn-outline" id="quick-member-sig-clear">🗑️ அழி (Clear)</button>
          </div>
          <div style="font-size:11px;color:#64748b;margin-bottom:6px">
            மாணவர் / விண்ணப்பதாரர் கையொப்பம்
          </div>
          <canvas id="quick-member-sig-canvas" class="sig-pad-canvas"></canvas>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" onclick="UI.closeModal('signature-modal')">Cancel</button>
        <button class="btn btn-primary" onclick="Members.saveDirectSignature('${m.MemberID}')">
          💾 கையொப்பத்தை பதிவு செய் (Save Signatures)
        </button>
      </div>
    `);

    setTimeout(() => {
      this._quickParentSigPad = Members.initSignaturePad('quick-parent-sig-canvas', 'quick-parent-sig-clear', m.ParentSignature || null);
      this._quickMemberSigPad = Members.initSignaturePad('quick-member-sig-canvas', 'quick-member-sig-clear', m.MemberSignature || null);
    }, 150);
  },

  async saveDirectSignature(memberID) {
    const parentSig = this._quickParentSigPad ? this._quickParentSigPad.getDataURL() : '';
    const memberSig = this._quickMemberSigPad ? this._quickMemberSigPad.getDataURL() : '';
    
    const updatePayload = { memberID };
    if (parentSig) updatePayload.parentSignature = parentSig;
    if (memberSig) updatePayload.memberSignature = memberSig;

    UI.showLoading('Saving digital signatures...');
    const res = await API.updateMember(updatePayload);
    UI.hideLoading();

    if (res.success) {
      UI.toast('success', 'டிஜிட்டல் கையொப்பம்', 'பெற்றோர் மற்றும் உறுப்பினர் கையொப்பம் பதியப்பட்டது! (Signatures saved successfully)');
      UI.closeModal('signature-modal');
      await this.loadMembers();
      if (document.getElementById('app-print-modal')) {
        this.printApplication(memberID);
      }
    } else {
      UI.toast('error', 'Error', res.error);
    }
  },

  exportCSV() {
    const headers = ['MemberID', 'FullName', 'Group', 'House', 'Points', 'VerificationStatus', 'Phone', 'Email', 'BloodGroup', 'JoinDate'];
    const rows = this._filtered.map(m => [
      m.MemberID, m.FullName, m.Group, m.House || m.Team, m.Points, m.VerificationStatus, m.Phone, m.Email, m.BloodGroup || '', m.JoinDate
    ]);
    const csv = Utils.generateCSV(headers, rows);
    Utils.downloadCSV(`DBYC_Members_${new Date().toISOString().slice(0, 10)}.csv`, csv);
  }
};
