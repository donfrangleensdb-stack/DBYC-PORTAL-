/* DBYC Attendance & Authority QR Scanner Terminal (Continuous Scan, Audio Chime & Points Engine) */
const Attendance = {
  _html5QrCode: null,
  _scanning: false,
  _scanMode: 'attendance', // 'attendance' or 'points'
  _membersCache: [],
  _isProcessing: false,

  async render(container) {
    const canMark = Auth.canTakeAttendance();
    container.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <div class="page-title">QR வருகைப்பதிவு & புள்ளிகள் (QR Attendance & Points)</div>
          <div class="page-subtitle">Camera QR check-in &bull; உடனடி வருகைப் பதிவு மற்றும் இல்லப் புள்ளிகள் (Don Bosco Youth Centre)</div>
        </div>
      </div>

      <div class="grid-2" style="margin-bottom:var(--s-6)">
        ${canMark ? `
        <div class="card">
          <div class="card-header">
            <span class="card-title">📷 Authority QR Scanner Terminal</span>
            <div style="display:flex;gap:var(--s-2)">
              <button class="btn btn-sm btn-primary" id="btn-mode-att" onclick="Attendance.setScanMode('attendance')">Check-In</button>
              ${Auth.canAwardPoints() ? `<button class="btn btn-sm btn-outline" id="btn-mode-pts" onclick="Attendance.setScanMode('points')">⭐ Point Adjustment (+ / -)</button>` : ''}
            </div>
          </div>
          <div class="card-body">
            
            <!-- Attendance Mode Controls -->
            <div id="scanner-controls-att" style="margin-bottom:var(--s-3)">
              <div class="form-group">
                <label class="form-label" style="font-size:var(--text-xs)">Select Event / Session</label>
                <select class="form-control" id="att-event-select">
                  <option value="Sunday Assembly">Sunday Assembly & Formation</option>
                  <option value="Weekly Holy Mass & Prayer">Weekly Holy Mass & Prayer</option>
                  <option value="Youth Sports & Games">Youth Sports & Games</option>
                  <option value="DBYC Cultural Festival">DBYC Cultural Festival</option>
                  <option value="Social Outreach & Service">Community Social Outreach</option>
                </select>
              </div>
            </div>

            <!-- Points Adjustment Mode Controls (+ / -) -->
            <div id="scanner-controls-pts" style="display:none;margin-bottom:var(--s-3);background:var(--surface-alt);padding:var(--s-3);border-radius:var(--r-md);border:1px solid var(--border)">
              <div style="font-size:var(--text-xs);font-weight:700;color:var(--primary);margin-bottom:6px">AUTHORITY POINT ADJUSTMENT (+ BONUS / - DEMERIT)</div>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" style="font-size:var(--text-xs)">Adjustment Value</label>
                  <select class="form-control" id="scan-point-val">
                    <optgroup label="➕ Bonus Points (Plus)">
                      <option value="10" selected>+10 Points (Standard Activity)</option>
                      <option value="25">+25 Points (Competition Win)</option>
                      <option value="50">+50 Points (Major Achievement)</option>
                    </optgroup>
                    <optgroup label="➖ Demerit / Penalty (Minus)">
                      <option value="-5">-5 Points (Minor Warning)</option>
                      <option value="-10">-10 Points (Late / Unpunctual)</option>
                      <option value="-25">-25 Points (Discipline Demerit)</option>
                    </optgroup>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label" style="font-size:var(--text-xs)">Reason / Category</label>
                  <select class="form-control" id="scan-point-reason">
                    <option value="Activity Winner">Activity / Competition Winner</option>
                    <option value="Exemplary Discipline">Exemplary Conduct & Character</option>
                    <option value="DBYC Voluntary Service">Voluntary Service</option>
                    <option value="Punctuality & Presence">Punctuality</option>
                    <option value="Disciplinary Demerit">Disciplinary Demerit</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Continuous Camera Scanner Container -->
            <div style="display:flex;flex-direction:column;gap:var(--s-3)">
              
              <div class="scanner-container" style="background:#0f172a;min-height:260px;position:relative;border-radius:var(--r-lg);overflow:hidden">
                <div id="qr-camera-element" style="width:100%;height:100%"></div>
                <div class="scanner-corners"></div>
                <div class="scanner-line"></div>
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--s-2)">
                <button class="btn btn-accent" id="scan-btn" onclick="Attendance.toggleScanner()">
                  ▶️ Start Camera Scanner
                </button>
                
                <!-- QR Image File Scan Fallback -->
                <label class="btn btn-outline" style="cursor:pointer;margin:0;text-align:center">
                  📁 Scan QR Image File
                  <input type="file" accept="image/*" style="display:none" onchange="Attendance.handleQrFileSelect(event)">
                </label>
              </div>

              <!-- Quick Select Member (Simulator / Backup Option) -->
              <div style="border-top:1px dashed var(--border);padding-top:var(--s-3);margin-top:var(--s-2)">
                <div style="font-size:var(--text-xs);font-weight:700;color:var(--text-muted);margin-bottom:4px">⚡ QUICK SELECT MEMBER (ONE-CLICK SCAN SIMULATOR)</div>
                <div style="display:flex;gap:var(--s-2)">
                  <select class="form-control" id="quick-member-select" style="flex:1">
                    <option value="">Loading qualified members...</option>
                  </select>
                  <button class="btn btn-primary" onclick="Attendance.submitQuickMemberScan()">Scan QR</button>
                </div>
              </div>
            </div>

            <!-- Live Feedback Card -->
            <div id="scan-feedback-container" style="margin-top:var(--s-4)"></div>
          </div>
        </div>

        <!-- Manual Backup Search & Entry -->
        <div class="card">
          <div class="card-header"><span class="card-title">✏️ Manual Member Search & Check-in</span></div>
          <div class="card-body">
            <div style="display:flex;flex-direction:column;gap:var(--s-4)">
              <div class="form-group">
                <label class="form-label">Search Member Name or ID</label>
                <input type="text" class="form-control" id="manual-search" placeholder="Type member name or ID..." oninput="Attendance.searchManualMembers()">
                <div id="manual-suggestions" style="max-height:180px;overflow-y:auto;border:1px solid var(--border);border-radius:var(--r-md);margin-top:var(--s-2);display:none"></div>
              </div>
              <div id="manual-selected-box" style="display:none" class="alert alert-info">
                <div id="manual-avatar-preview" style="margin-right:var(--s-3)"></div>
                <div>
                  <div id="manual-name" style="font-weight:700"></div>
                  <div id="manual-meta" style="font-size:var(--text-xs)"></div>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Event</label>
                <select class="form-control" id="manual-event">
                  <option value="Sunday Assembly">Sunday Assembly & Formation</option>
                  <option value="Weekly Holy Mass & Prayer">Weekly Holy Mass & Prayer</option>
                  <option value="Youth Sports & Games">Youth Sports & Games</option>
                </select>
              </div>
              <button class="btn btn-primary btn-full" id="manual-submit-btn" disabled onclick="Attendance.submitManual()">
                Record Verified Check-In (+10 pts)
              </button>
            </div>
          </div>
        </div>
        ` : `
        <div class="card"><div class="card-body"><div class="empty-state"><div class="empty-icon">🔒</div><div class="empty-title">Authority Only</div><div class="empty-desc">Only DBYC Directors, Leaders and Incharges can access the scanner terminal.</div></div></div></div>`}
      </div>

      <!-- Verified Attendance History Log -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Recent Verified Attendance Logs</span>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Member</th>
                <th>House Allocation</th>
                <th>Youth Group</th>
                <th>Points Earned</th>
                <th>Method</th>
                <th>Recorded By</th>
              </tr>
            </thead>
            <tbody id="att-history-tbody">
              <tr><td colspan="7" style="text-align:center;padding:var(--s-6)"><div class="spinner-lg" style="margin:0 auto"></div></td></tr>
            </tbody>
          </table>
        </div>
      </div>`;

    this._selectedMember = null;
    await this.loadQuickMembers();
    await this.loadHistory();
  },

  setScanMode(mode) {
    if (mode === 'points' && !Auth.canAwardPoints()) {
      UI.toast('warning', 'Access Restricted', 'Only Group Leaders and Fr. Directors can award points.');
      return;
    }
    this._scanMode = mode;
    const btnAtt = document.getElementById('btn-mode-att');
    const btnPts = document.getElementById('btn-mode-pts');
    const ctrlAtt = document.getElementById('scanner-controls-att');
    const ctrlPts = document.getElementById('scanner-controls-pts');

    if (mode === 'attendance') {
      btnAtt.className = 'btn btn-sm btn-primary';
      btnPts.className = 'btn btn-sm btn-outline';
      ctrlAtt.style.display = 'block';
      ctrlPts.style.display = 'none';
    } else {
      btnAtt.className = 'btn btn-sm btn-outline';
      btnPts.className = 'btn btn-sm btn-primary';
      ctrlAtt.style.display = 'none';
      ctrlPts.style.display = 'block';
    }
  },

  async loadQuickMembers() {
    const res = await API.getMembers({});
    if (!res.success) return;
    this._membersCache = res.data || [];
    const select = document.getElementById('quick-member-select');
    if (select) {
      if (!this._membersCache.length) {
        select.innerHTML = '<option value="">No members enrolled yet</option>';
      } else {
        select.innerHTML = this._membersCache.map(m => `
          <option value="${m.MemberID}">${m.FullName} (${m.MemberID}) — ${m.House || m.Team} [${m.VerificationStatus}]</option>
        `).join('');
      }
    }
  },

  submitQuickMemberScan() {
    const memberID = document.getElementById('quick-member-select')?.value;
    if (!memberID) { UI.toast('warning', 'Selection', 'Please select a member to scan.'); return; }
    this.handleScanSuccess(memberID);
  },

  handleQrFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!window.Html5Qrcode) {
      UI.toast('error', 'Error', 'QR engine not loaded. Please refresh the page.');
      return;
    }

    const html5QrCode = new Html5Qrcode('qr-camera-element');
    html5QrCode.scanFile(file, true)
      .then(decodedText => {
        this.handleScanSuccess(decodedText);
      })
      .catch(err => {
        console.warn(err);
        Utils.playBeep(false);
        UI.toast('error', 'QR File Read Error', 'Could not detect a clear QR code in this image.');
      });
  },

  async toggleScanner() {
    if (this._scanning) {
      await this.stopScanner();
    } else {
      await this.startScanner();
    }
  },

  async startScanner() {
    const btn = document.getElementById('scan-btn');
    if (!window.Html5Qrcode) {
      UI.toast('error', 'Scanner Error', 'QR library not loaded. Check internet connection.');
      return;
    }

    try {
      this._html5QrCode = new Html5Qrcode('qr-camera-element');
      const config = {
        fps: 15,
        qrbox: { width: 220, height: 220 },
        aspectRatio: 1.0
      };

      // Prefer environment (rear) camera on mobile phones
      await this._html5QrCode.start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          if (!this._isProcessing) {
            this.handleScanSuccess(decodedText);
          }
        },
        (errorMessage) => {
          // Continuous scanning silently ignores frame search misses
        }
      );

      this._scanning = true;
      if (btn) {
        btn.textContent = '⏹ Stop Camera Scanner';
        btn.classList.remove('btn-accent');
        btn.classList.add('btn-danger');
      }
      UI.toast('info', 'Scanner Active', 'Aim camera at student QR code pass.');
    } catch (e) {
      console.warn('Camera start error:', e);
      this._scanning = false;
      UI.toast('error', 'Camera Error', 'Camera permission denied or camera not found. Use QR Image File or Quick Select.');
    }
  },

  async stopScanner() {
    if (this._html5QrCode && this._scanning) {
      try {
        await this._html5QrCode.stop();
        this._html5QrCode.clear();
      } catch (e) {}
      this._html5QrCode = null;
    }
    this._scanning = false;
    const btn = document.getElementById('scan-btn');
    if (btn) {
      btn.textContent = '▶️ Start Camera Scanner';
      btn.classList.add('btn-accent');
      btn.classList.remove('btn-danger');
    }
  },

  async handleScanSuccess(decodedText) {
    this._isProcessing = true;

    // Parse payload: supports plain ID ("DBYC-0001"), JSON string, or URL format
    let memberID = decodedText.trim();
    try {
      if (decodedText.startsWith('{') && decodedText.endsWith('}')) {
        const parsed = JSON.parse(decodedText);
        memberID = parsed.id || parsed.MemberID || memberID;
      } else if (decodedText.includes('id=')) {
        const url = new URL(decodedText);
        memberID = url.searchParams.get('id') || memberID;
      }
    } catch (e) {}

    const feedbackBox = document.getElementById('scan-feedback-container');

    // 1. Point Adjustment Mode (+ / -)
    if (this._scanMode === 'points') {
      if (!Auth.canAwardPoints()) {
        Utils.playBeep(false);
        UI.toast('error', 'Unauthorized', 'Incharges can only record attendance, not award custom points.');
        this._isProcessing = false;
        return;
      }
      const pts = parseInt(document.getElementById('scan-point-val')?.value) || 10;
      const reason = document.getElementById('scan-point-reason')?.value || 'Authority Adjustment';

      const res = await API.awardPoints(memberID, pts, reason);
      if (res.success) {
        Utils.playBeep(true);
        const sign = pts >= 0 ? `+${pts}` : `${pts}`;
        UI.toast(pts >= 0 ? 'success' : 'warning', 'Point Adjustment', `${sign} pts updated for ${res.data.name}`);

        if (feedbackBox) {
          feedbackBox.innerHTML = `
            <div class="alert alert-${pts >= 0 ? 'success' : 'warning'}" style="display:flex;align-items:center;gap:var(--s-3);animation:slideUp 0.3s ease-out">
              <div style="font-size:2rem">${pts >= 0 ? '⭐' : '⚠️'}</div>
              <div>
                <div style="font-size:var(--text-base);font-weight:700">${Utils.escapeHtml(res.data.name)}</div>
                <div>${Utils.houseBadge(res.data.house)} &bull; <strong>${sign} Points Adjusted</strong></div>
                <div style="font-size:var(--text-xs);color:var(--text-secondary)">Reason: ${Utils.escapeHtml(reason)} &bull; Total: <strong>${res.data.totalPoints} pts</strong></div>
              </div>
            </div>`;
        }
        await this.loadHistory();
      } else {
        Utils.playBeep(false);
        UI.toast('error', 'Adjustment Failed', res.error);
        if (feedbackBox) {
          feedbackBox.innerHTML = `<div class="alert alert-danger"><span class="alert-icon">❌</span><div>${Utils.escapeHtml(res.error)}</div></div>`;
        }
      }
      setTimeout(() => { this._isProcessing = false; }, 2000);
      return;
    }

    // 2. Attendance Mode (Automatic +10 Points & Audio Beep)
    const eventName = document.getElementById('att-event-select')?.value || 'Sunday Assembly';
    const result = await API.markAttendance({ memberID, eventName, method: 'QR' });

    if (result.success) {
      Utils.playBeep(true); // Audible confirmation chime
      const d = result.data;
      UI.toast('success', 'Verified Check-In', `${d.name} marked present (+10 pts)`);

      if (feedbackBox) {
        feedbackBox.innerHTML = `
          <div class="card" style="border:2px solid var(--success);animation:slideUp 0.3s ease-out;box-shadow:var(--shadow-md)">
            <div class="card-body" style="display:flex;align-items:center;gap:var(--s-4);padding:var(--s-4)">
              ${d.photo ? `<img src="${d.photo}" style="width:68px;height:68px;border-radius:50%;border:3px solid var(--success);object-fit:cover">` : `<div class="member-avatar large">${Utils.initials(d.name)}</div>`}
              <div style="flex:1">
                <div style="display:flex;align-items:center;gap:var(--s-2)">
                  <span style="font-size:var(--text-lg);font-weight:700;color:var(--text-primary)">${Utils.escapeHtml(d.name)}</span>
                  <span class="badge badge-qualified">🛡️ Verified</span>
                </div>
                <div style="margin:4px 0">${Utils.houseBadge(d.house)} &bull; ${Utils.groupBadge(d.group)}</div>
                <div style="font-size:var(--text-xs);color:var(--text-muted)">
                  Time: <strong>${d.time}</strong> &bull; Earned: <strong style="color:var(--success)">+10 Attendance Pts</strong> (Total: ${d.points} pts)
                </div>
              </div>
            </div>
          </div>`;
      }
      await this.loadHistory();
    } else {
      Utils.playBeep(false); // Warning tone
      if (result.unqualified) {
        UI.toast('warning', 'Authority Gate', 'Student is not yet verified.');
        if (feedbackBox) {
          feedbackBox.innerHTML = `
            <div class="alert alert-warning" style="animation:slideUp 0.3s ease-out">
              <span class="alert-icon">⚠️</span>
              <div>
                <strong>UNQUALIFIED STUDENT REJECTED</strong><br>
                ${Utils.escapeHtml(result.error)}
              </div>
            </div>`;
        }
      } else if (result.alreadyMarked) {
        UI.toast('info', 'Already Recorded', result.error);
        if (feedbackBox) {
          feedbackBox.innerHTML = `<div class="alert alert-info"><span class="alert-icon">ℹ️</span><div>${Utils.escapeHtml(result.error)}</div></div>`;
        }
      } else {
        UI.toast('error', 'Scan Error', result.error);
        if (feedbackBox) {
          feedbackBox.innerHTML = `<div class="alert alert-danger"><span class="alert-icon">❌</span><div>${Utils.escapeHtml(result.error)}</div></div>`;
        }
      }
    }

    // 2-second cooldown before next scan in continuous mode
    setTimeout(() => {
      this._isProcessing = false;
    }, 2000);
  },

  async searchManualMembers() {
    const q = document.getElementById('manual-search')?.value.trim().toLowerCase() || '';
    const box = document.getElementById('manual-suggestions');
    if (!q) { box.style.display = 'none'; return; }

    if (!this._membersCache.length) {
      const res = await API.getMembers({});
      this._membersCache = res.data || [];
    }

    const matches = this._membersCache.filter(m =>
      (m.FullName || '').toLowerCase().includes(q) ||
      (m.MemberID || '').toLowerCase().includes(q)
    ).slice(0, 5);

    if (!matches.length) { box.style.display = 'none'; return; }
    box.style.display = 'block';
    box.innerHTML = matches.map(m => `
      <div onclick="Attendance.selectManualMember('${m.MemberID}')" style="padding:var(--s-3);cursor:pointer;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:var(--s-3)">
        ${Utils.avatarHtml(m)}
        <div>
          <div style="font-weight:600">${Utils.escapeHtml(m.FullName)}</div>
          <div style="font-size:var(--text-xs);color:var(--text-muted)">${m.MemberID} &bull; ${m.House || m.Team} &bull; ${m.Group}</div>
        </div>
      </div>`).join('');
  },

  selectManualMember(id) {
    const m = this._membersCache.find(x => x.MemberID === id);
    if (!m) return;
    this._selectedMember = m;
    document.getElementById('manual-suggestions').style.display = 'none';
    document.getElementById('manual-search').value = m.FullName;
    document.getElementById('manual-selected-box').style.display = 'flex';
    document.getElementById('manual-name').textContent = m.FullName;
    document.getElementById('manual-meta').textContent = `${m.MemberID} • ${m.House || m.Team} • ${m.Group} • ${m.VerificationStatus}`;
    document.getElementById('manual-avatar-preview').innerHTML = Utils.avatarHtml(m);
    document.getElementById('manual-submit-btn').disabled = false;
  },

  async submitManual() {
    if (!this._selectedMember) return;
    const eventName = document.getElementById('manual-event')?.value || 'Sunday Assembly';
    UI.showLoading('Recording manual check-in...');
    const res = await API.markAttendance({
      memberID: this._selectedMember.MemberID,
      eventName: eventName,
      method: 'Manual'
    });
    UI.hideLoading();

    if (res.success) {
      Utils.playBeep(true);
      UI.toast('success', 'Verified Check-in', `${this._selectedMember.FullName} marked present (+10 pts)`);
      document.getElementById('manual-search').value = '';
      document.getElementById('manual-selected-box').style.display = 'none';
      document.getElementById('manual-submit-btn').disabled = true;
      this._selectedMember = null;
      await this.loadHistory();
    } else {
      Utils.playBeep(false);
      UI.toast('error', 'Error', res.error);
    }
  },

  async loadHistory() {
    const res = await API.getAttendance({});
    const tbody = document.getElementById('att-history-tbody');
    if (!tbody) return;

    if (!res.success || !res.data || !res.data.length) {
      tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><div class="empty-icon">📋</div><div class="empty-title">No attendance recorded yet</div></div></td></tr>`;
      return;
    }

    tbody.innerHTML = res.data.slice(0, 15).map(a => `
      <tr>
        <td style="font-family:var(--font-mono);font-size:var(--text-xs)">${Utils.formatTime(a.Time)} &bull; ${Utils.formatDate(a.Date)}</td>
        <td><strong>${Utils.escapeHtml(a.MemberName)}</strong><br><span style="font-size:var(--text-xs);color:var(--text-muted)">${a.MemberID}</span></td>
        <td>${Utils.houseBadge(a.House || a.Team)}</td>
        <td>${Utils.groupBadge(a.Group)}</td>
        <td><span style="color:var(--success);font-weight:700">+10 pts</span></td>
        <td><span class="badge badge-info">${a.Method || 'QR'}</span></td>
        <td style="font-size:var(--text-xs);color:var(--text-muted)">${a.MarkedBy || 'Incharge'}</td>
      </tr>`).join('');
  }
};
