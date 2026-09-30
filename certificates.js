/* DBYC Certificates View - Auto-Generating Attendance & Membership Certificates with Zero-Taint PDF Generator */
const Certificates = {
  _selectedMember: null,
  _membersList: [],

  async render(container) {
    container.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <div class="page-title">சான்றிதழ்கள் (Official Certificates)</div>
          <div class="page-subtitle">Attendance & Membership Certificates with St. John Bosco seal &bull; Don Bosco Youth Centre</div>
        </div>
      </div>
      <div class="grid-2" style="margin-bottom:var(--s-6)">
        <div class="card">
          <div class="card-header"><span class="card-title">📜 Issue Certificate</span></div>
          <div class="card-body">
            <div style="display:flex;flex-direction:column;gap:var(--s-4)">
              <div class="form-group">
                <label class="form-label">Select Certificate Type</label>
                <select class="form-control" id="cert-type" onchange="Certificates.updateFormFields()">
                  <option value="Attendance">Certificate of Regular Attendance & Formation</option>
                  <option value="Membership">Certificate of Honorable Membership & Service</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Search Qualified Member</label>
                <input type="text" class="form-control" id="cert-member-search" placeholder="Type member name or ID..." oninput="Certificates.searchMembers()">
                <div id="cert-member-suggestions" style="max-height:180px;overflow-y:auto;border:1px solid var(--border);border-radius:var(--r-md);margin-top:var(--s-2);display:none"></div>
              </div>
              <div id="cert-selected-member" style="display:none" class="alert alert-info">
                <span class="alert-icon">👤</span>
                <div>
                  <div id="cert-member-name" style="font-weight:600"></div>
                  <div id="cert-member-info" style="font-size:var(--text-xs)"></div>
                </div>
              </div>
              <div id="cert-attendance-field" class="form-group">
                <label class="form-label">Verified Attendance Percentage (%)</label>
                <input type="number" class="form-control" id="cert-pct" min="1" max="100" value="95" oninput="Certificates.previewCertificate()">
              </div>
              <div id="cert-membership-field" class="form-group" style="display:none">
                <label class="form-label">Duration in DBYC</label>
                <input type="text" class="form-control" id="cert-years" placeholder="e.g. 2 Years, 4 Months" oninput="Certificates.previewCertificate()">
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Fr. Director (Incharge)</label>
                  <input type="text" class="form-control" id="cert-director-name" value="Rev. Fr. Director, SDB" oninput="Certificates.previewCertificate()">
                </div>
                <div class="form-group">
                  <label class="form-label">Fr. Assistant Director (Direct Incharge)</label>
                  <input type="text" class="form-control" id="cert-asst-name" value="Fr. Assistant Director, DBYC" oninput="Certificates.previewCertificate()">
                </div>
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--s-2)">
                <button class="btn btn-outline" onclick="Certificates.previewCertificate()">👁️ Refresh Preview</button>
                <button class="btn btn-outline" onclick="Certificates.printCertificate()">🖨️ Direct Print</button>
              </div>
              <button class="btn btn-primary btn-full" onclick="Certificates.downloadPDF()">
                📥 Download Official PDF (A4 Landscape)
              </button>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><span class="card-title">A4 Landscape Certificate Preview</span></div>
          <div class="card-body" style="padding:var(--s-2);background:#EAEFF8;border-radius:var(--r-md);overflow:hidden">
            <div class="cert-preview-wrap">
              <div id="cert-render-target" class="certificate" style="background:#ffffff">
                <div class="cert-inner-border"></div>
                
                <!-- Certificate Header with DBYC Logo & St. John Bosco Founder Art -->
                <div class="cert-header" style="display:flex;align-items:center;justify-content:center;gap:18px;position:relative">
                  <img src="${Utils.getLogoSrc()}" class="cert-logo-img" alt="DBYC Official Logo" style="width:68px;height:68px;border-radius:50%">
                  <div style="text-align:center">
                    <div class="cert-org-title">DON BOSCO YOUTH CENTRE</div>
                    <div class="cert-org-subtitle">REASON &bull; RELIGION &bull; LOVING-KINDNESS</div>
                    <div class="cert-badge-pill" id="cert-pill-text">CERTIFICATE OF ATTENDANCE</div>
                  </div>
                  <img src="${Utils.getFounderImageSrc()}" class="cert-logo-img" alt="Founder St. John Bosco" style="width:68px;height:68px;border-radius:50%">
                </div>

                <div style="text-align:center;padding:0 30px">
                  <div class="cert-main-title" id="cert-title-text">Recognition of Commitment</div>
                  <div class="cert-to-text">THIS IS PROUDLY CONFERRED UPON</div>
                  <div class="cert-recipient" id="cert-preview-name">Antony Francis</div>
                  <div class="cert-description" id="cert-desc-text">
                    In recognition of an exemplary attendance record of <strong>95%</strong> and active participation within the <strong>Sub Juniors Group</strong> (<strong>Bosco House (Red)</strong>) at Don Bosco Youth Centre.
                  </div>
                </div>

                <!-- Footer with Official Seal & Authority Signatures -->
                <div class="cert-footer-row" style="margin-top:20px">
                  <div class="cert-sig">
                    <div class="cert-sig-line"></div>
                    <div class="cert-sig-title" id="cert-prev-director">Rev. Fr. Director, SDB</div>
                    <div class="cert-sig-sub">Director (Overall Incharge)</div>
                  </div>
                  
                  <div class="cert-seal-badge">
                    <div style="font-size:10px;font-weight:700">★ DBYC ★</div>
                    <div style="font-size:12px;font-weight:800;letter-spacing:1px">SEAL</div>
                    <div style="font-size:7px">OFFICIAL</div>
                  </div>

                  <div class="cert-sig">
                    <div class="cert-sig-line"></div>
                    <div class="cert-sig-title" id="cert-prev-asst">Fr. Assistant Director, DBYC</div>
                    <div class="cert-sig-sub">Assistant Director (Direct Incharge)</div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>`;

    this._selectedMember = null;
    this._membersList = [];
    this.updateFormFields();
  },

  updateFormFields() {
    const type = document.getElementById('cert-type')?.value || 'Attendance';
    const attField = document.getElementById('cert-attendance-field');
    const memField = document.getElementById('cert-membership-field');
    if (type === 'Attendance') {
      if (attField) attField.style.display = 'block';
      if (memField) memField.style.display = 'none';
      const pill = document.getElementById('cert-pill-text');
      if (pill) pill.textContent = 'CERTIFICATE OF REGULAR ATTENDANCE';
      const title = document.getElementById('cert-title-text');
      if (title) title.textContent = 'Recognition of Regular Attendance';
    } else {
      if (attField) attField.style.display = 'none';
      if (memField) memField.style.display = 'block';
      const pill = document.getElementById('cert-pill-text');
      if (pill) pill.textContent = 'CERTIFICATE OF MEMBERSHIP';
      const title = document.getElementById('cert-title-text');
      if (title) title.textContent = 'Honorary Membership Award';
    }
    this.previewCertificate();
  },

  async searchMembers() {
    const q = document.getElementById('cert-member-search').value.trim().toLowerCase();
    const box = document.getElementById('cert-member-suggestions');
    if (!q) { box.style.display = 'none'; return; }
    if (!this._membersList.length) {
      const res = await API.getMembers({});
      this._membersList = res.data || [];
    }
    const matches = this._membersList.filter(m => (m.FullName || '').toLowerCase().includes(q) || (m.MemberID || '').toLowerCase().includes(q)).slice(0, 5);
    if (!matches.length) { box.style.display = 'none'; return; }
    box.style.display = 'block';
    box.innerHTML = matches.map(m => `
      <div onclick="Certificates.selectMember('${m.MemberID}')" style="padding:var(--s-3);cursor:pointer;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:var(--s-3)">
        ${Utils.avatarHtml(m)}
        <div>
          <div style="font-weight:600">${Utils.escapeHtml(m.FullName)}</div>
          <div style="font-size:var(--text-xs);color:var(--text-muted)">${m.MemberID} &bull; ${m.House || m.Team} &bull; ${m.Group}</div>
        </div>
      </div>`).join('');
  },

  selectMember(id) {
    const m = this._membersList.find(x => x.MemberID === id);
    if (!m) return;
    this._selectedMember = m;
    document.getElementById('cert-member-suggestions').style.display = 'none';
    document.getElementById('cert-member-search').value = m.FullName;
    document.getElementById('cert-selected-member').style.display = 'flex';
    document.getElementById('cert-member-name').textContent = m.FullName;
    document.getElementById('cert-member-info').textContent = `${m.MemberID} • ${m.House || m.Team} • ${m.Group} • Admitted ${Utils.formatDate(m.JoinDate)}`;

    const duration = Utils.membershipDuration(m.JoinDate);
    const yearsInput = document.getElementById('cert-years');
    if (yearsInput) yearsInput.value = duration;

    this.previewCertificate();
  },

  previewCertificate() {
    const name = this._selectedMember ? this._selectedMember.FullName : (document.getElementById('cert-member-search')?.value || 'Antony Francis');
    const group = this._selectedMember ? this._selectedMember.Group : 'Sub Juniors Group';
    const house = this._selectedMember ? (this._selectedMember.House || this._selectedMember.Team) : 'Bosco House (Red)';
    const type = document.getElementById('cert-type')?.value || 'Attendance';
    const director = document.getElementById('cert-director-name')?.value || 'Rev. Fr. Director, SDB';
    const asst = document.getElementById('cert-asst-name')?.value || 'Fr. Assistant Director, DBYC';

    const nameEl = document.getElementById('cert-preview-name');
    if (nameEl) nameEl.textContent = name;
    const dirEl = document.getElementById('cert-prev-director');
    if (dirEl) dirEl.textContent = director;
    const asstEl = document.getElementById('cert-prev-asst');
    if (asstEl) asstEl.textContent = asst;

    const descEl = document.getElementById('cert-desc-text');
    if (descEl) {
      if (type === 'Attendance') {
        const pct = document.getElementById('cert-pct')?.value || '95';
        descEl.innerHTML = `
          In recognition of an exemplary attendance record of <strong>${pct}%</strong> and loyal participation within the <strong>${group}</strong> (<strong>${house}</strong>) at Don Bosco Youth Centre.`;
      } else {
        const years = document.getElementById('cert-years')?.value || (this._selectedMember ? Utils.membershipDuration(this._selectedMember.JoinDate) : '2 Years Active Member');
        descEl.innerHTML = `
          In recognition of honorable and dedicated membership (<strong>${years}</strong>) as an active youth member within the <strong>${group}</strong> (<strong>${house}</strong>) of Don Bosco Youth Centre.`;
      }
    }
  },

  async downloadPDF() {
    this.previewCertificate();
    UI.showLoading('Generating High-Resolution Certificate PDF...');
    try {
      const element = document.getElementById('cert-render-target');
      if (!element) throw new Error('Certificate element not found');

      const jsPDFClass = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;

      if (typeof html2canvas === 'function' && jsPDFClass) {
        // Zero-taint rendering
        const canvas = await html2canvas(element, {
          scale: 2.5,
          useCORS: true,
          allowTaint: false, // NEVER allow taint or toDataURL fails!
          logging: false,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');
        // Landscape A4 format: 297mm x 210mm
        const pdf = new jsPDFClass('l', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Fit image cleanly with small margin
        const margin = 10;
        const printWidth = pdfWidth - (margin * 2);
        const printHeight = (canvas.height * printWidth) / canvas.width;
        const yOffset = (pdfHeight - printHeight) / 2;

        pdf.addImage(imgData, 'PNG', margin, yOffset, printWidth, printHeight);
        const recipientName = (this._selectedMember ? this._selectedMember.FullName : 'Member').replace(/[^a-zA-Z0-9]/g, '_');
        pdf.save(`DBYC_${recipientName}_Certificate.pdf`);
        UI.toast('success', 'PDF Downloaded', 'Official certificate downloaded successfully!');
      } else {
        window.print();
        UI.toast('info', 'Print Window Opened', 'Use "Save as PDF" in your print options.');
      }
    } catch (e) {
      console.warn('html2canvas exception, falling back to print dialog:', e);
      window.print();
      UI.toast('info', 'Print Dialog Active', 'Select "Save as PDF" to download your certificate.');
    } finally {
      UI.hideLoading();
    }
  },

  printCertificate() {
    this.previewCertificate();
    window.print();
  }
};
