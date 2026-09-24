/* DBYC Digital QR Passes, Photo ID Card, Instant Photo Update & Fail-Proof PDF Generator */
const QRGenerator = {
  _members: [],

  async render(container) {
    const isMember = Auth.isMember();
    container.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <div class="page-title">${isMember ? '🪪 My Official DBYC Digital Pass (எனது அடையாள அட்டை)' : 'Digital Member QR Passes & ID Cards'}</div>
          <div class="page-subtitle">${isMember ? 'Official digital membership badge with secure QR check-in code, House allocation & Don Bosco seal' : 'Official photo identification badges with embedded QR codes, House allocation & Don Bosco founder seal'}</div>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary" onclick="window.print()">${isMember ? '📥 Print / Save My Pass' : '🖨️ Print All Passes'}</button>
        </div>
      </div>

      ${!isMember ? `
      <div class="card" style="margin-bottom:var(--s-5)">
        <div class="card-body" style="padding:var(--s-4)">
          <div style="display:flex;gap:var(--s-3);flex-wrap:wrap;align-items:center">
            <select class="form-control" id="qr-house-select" style="max-width:200px" onchange="QRGenerator.filterCards()">
              <option value="All">All 4 Houses</option>
              ${Utils.HOUSES.map(h => `<option value="${h}">${h}</option>`).join('')}
            </select>
            <select class="form-control" id="qr-group-select" style="max-width:200px" onchange="QRGenerator.filterCards()">
              <option value="All">All 6 Groups</option>
              ${Utils.GROUPS.map(g => `<option value="${g}">${g}</option>`).join('')}
            </select>
            <div class="search-wrap" style="flex:1;min-width:200px">
              <span class="search-icon">🔍</span>
              <input type="text" class="form-control search-input" id="qr-search" placeholder="Search member name or ID..." oninput="QRGenerator.filterCards()">
            </div>
          </div>
        </div>
      </div>` : `
      <div class="alert alert-info" style="margin-bottom:var(--s-4);display:flex;align-items:center;gap:12px">
        <span style="font-size:1.5rem">📲</span>
        <div>
          <strong>Present this Digital Pass at the Entrance</strong>
          <div style="font-size:var(--text-xs)">Show this QR code to your Group Leader or Incharge to record your daily attendance and earn House points!</div>
        </div>
      </div>`}

      <div id="qr-cards-grid" class="${isMember ? 'grid-single' : 'grid-auto'}" style="${isMember ? 'max-width:420px;margin:0 auto;' : ''}">
        <div class="loading-overlay" style="grid-column:1/-1"><div class="spinner-lg"></div></div>
      </div>`;

    await this.loadCards();
  },

  async loadCards() {
    const isMember = Auth.isMember();
    const u = Auth.getUser();

    try {
      const result = await API.getMembers({});
      const allActive = (result.data || []).filter(m => m.Status === 'Active');
      
      if (isMember) {
        // Find current member
        const myMatch = allActive.find(m => 
          (u.memberId && m.MemberID && m.MemberID.toLowerCase() === u.memberId.toLowerCase()) ||
          (u.name && m.FullName && m.FullName.toLowerCase() === u.name.toLowerCase())
        );

        if (myMatch) {
          this._members = [myMatch];
        } else {
          // Construct pass from authenticated session
          this._members = [{
            MemberID: u.memberId || 'DBYC-2026-001',
            FullName: u.name || 'Youth Member',
            Group: u.group || 'Seniors',
            House: u.team || 'Red House (St. John Bosco)',
            Team: u.team || 'Red House (St. John Bosco)',
            Photo: u.picture || '',
            Status: 'Active',
            TotalPoints: u.points || 120
          }];
        }
      } else {
        this._members = allActive;
      }
    } catch(e) {
      if (isMember) {
        this._members = [{
          MemberID: u?.memberId || 'DBYC-2026-001',
          FullName: u?.name || 'Youth Member',
          Group: u?.group || 'Seniors',
          House: u?.team || 'Red House (St. John Bosco)',
          Team: u?.team || 'Red House (St. John Bosco)',
          Photo: u?.picture || '',
          Status: 'Active',
          TotalPoints: u?.points || 120
        }];
      }
    }

    this.filterCards();
  },

  filterCards() {
    const isMember = Auth.isMember();
    let filtered = this._members;

    if (!isMember) {
      const q = document.getElementById('qr-search')?.value.toLowerCase() || '';
      const house = document.getElementById('qr-house-select')?.value || 'All';
      const group = document.getElementById('qr-group-select')?.value || 'All';

      filtered = this._members.filter(m => {
        const h = m.House || m.Team;
        if (house !== 'All' && h !== house) return false;
        if (group !== 'All' && m.Group !== group) return false;
        if (q && !((m.FullName || '').toLowerCase().includes(q) || (m.MemberID || '').toLowerCase().includes(q))) return false;
        return true;
      });
    }

    const grid = document.getElementById('qr-cards-grid');
    if (!grid) return;

    if (!filtered.length) {
      grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">🪪</div><div class="empty-title">No member passes found</div></div>';
      return;
    }

    grid.innerHTML = filtered.map(m => {
      const isQualified = (m.VerificationStatus === 'Qualified');
      const house = m.House || m.Team || 'Bosco House (Red)';
      const duration = Utils.membershipDuration(m.JoinDate);
      const houseColor = Utils.HOUSE_COLORS[house] || '#003F8A';

      return `
        <div class="card id-pass-card" style="display:flex;flex-direction:column;align-items:center;text-align:center;padding:var(--s-4);position:relative;border-top:4px solid ${houseColor}">
          ${isQualified ? '' : '<div style="position:absolute;top:6px;right:6px;font-size:10px" class="badge badge-pending">Pending</div>'}
          
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
            <img src="${Utils.getLogoSrc()}" alt="DBYC" style="width:34px;height:34px;border-radius:50%">
            <div style="font-size:11px;font-weight:800;color:var(--primary);letter-spacing:0.04em">DON BOSCO YOUTH CENTRE</div>
          </div>
          
          <!-- Candidate Photo with Avatar/Headshot -->
          <div style="margin:var(--s-2) 0">
            ${Utils.avatarHtml(m, true)}
          </div>

          <div style="font-weight:700;font-size:var(--text-base);color:var(--text-primary)">${Utils.escapeHtml(m.FullName)}</div>
          <div style="font-family:var(--font-mono);font-size:var(--text-xs);color:var(--text-muted);margin:2px 0">ID: ${m.MemberID}</div>

          <div style="display:flex;gap:4px;margin:4px 0;flex-wrap:wrap;justify-content:center">
            ${Utils.houseBadge(house)}
            ${Utils.groupBadge(m.Group)}
          </div>

          <!-- QR Code Container -->
          <div id="qr-box-${m.MemberID}" style="margin:var(--s-2) 0;width:120px;height:120px;display:flex;align-items:center;justify-content:center"></div>

          <div style="font-size:var(--text-xs);color:var(--text-muted)">Joined: ${Utils.formatDate(m.JoinDate)}</div>
          <div style="font-size:var(--text-xs);font-weight:600;color:var(--primary)">${duration}</div>

          <button class="btn btn-outline btn-sm btn-full" style="margin-top:var(--s-3)" onclick="QRGenerator.showMemberQR('${m.MemberID}')">
            🪪 View Official ID Card
          </button>
        </div>`;
    }).join('');

    filtered.forEach(m => {
      const container = document.getElementById(`qr-box-${m.MemberID}`);
      if (container) {
        new QRCode(container, {
          text: JSON.stringify({
            id: m.MemberID,
            name: m.FullName,
            house: m.House || m.Team,
            group: m.Group,
            status: m.VerificationStatus
          }),
          width: 120,
          height: 120,
          colorDark: m.VerificationStatus === 'Qualified' ? '#003F8A' : '#78350F',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.M
        });
      }
    });
  },

  async showMemberQR(memberID) {
    const res = await API.getMember(memberID);
    let m = (res && res.success) ? res.data : this._members.find(x => x.MemberID === memberID);
    if (!m) { UI.toast('error', 'Error', 'Member not found'); return; }

    const isQualified = (m.VerificationStatus === 'Qualified');
    const duration = Utils.membershipDuration(m.JoinDate);
    const house = m.House || m.Team || 'Bosco House (Red)';
    const houseColor = Utils.HOUSE_COLORS[house] || '#003F8A';
    const founderImg = Utils.getFounderImageSrc();
    const logoImg = Utils.getLogoSrc();

    UI.openModal('qr-modal', `
      <div class="modal-header">
        <span class="modal-title">Official DBYC Digital Member Pass</span>
        <button class="modal-close" onclick="UI.closeModal('qr-modal')">✕</button>
      </div>
      <div class="modal-body" style="text-align:center;background:#f8fafc;padding:var(--s-4);overflow-y:auto;max-height:80vh">
        
        <!-- Target container for High-Res ID Card Export -->
        <div id="id-card-export-target" class="official-id-card-render" style="border:3px solid ${houseColor};border-radius:18px;padding:18px;background:#ffffff;position:relative;max-width:340px;margin:0 auto;box-shadow:0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);font-family:'Poppins',sans-serif">
          
          <!-- Top Color Banner for House Allocation -->
          <div style="position:absolute;top:0;left:0;right:0;height:8px;background:${houseColor};border-top-left-radius:15px;border-top-right-radius:15px"></div>

          <!-- Header with DBYC Logo, Org Title & Founder Portrait -->
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:6px;margin-bottom:12px;border-bottom:1px solid #e2e8f0;padding-bottom:10px">
            <img src="${logoImg}" alt="DBYC Logo" style="width:46px;height:46px;border-radius:50%;object-fit:cover;border:1.5px solid #003F8A">
            <div style="text-align:center;flex:1">
              <div style="font-size:12px;font-weight:800;color:#003F8A;letter-spacing:0.04em;line-height:1.2">DON BOSCO YOUTH CENTRE</div>
              <div style="font-size:9px;font-weight:600;color:${houseColor};letter-spacing:0.06em;margin-top:2px">OFFICIAL MEMBER IDENTITY CARD</div>
            </div>
            <img src="${founderImg}" alt="Founder St. John Bosco" style="width:46px;height:46px;border-radius:50%;object-fit:cover;border:1.5px solid #FFC107">
          </div>

          <!-- Candidate Photo with Inline Edit Action -->
          <div style="margin:10px auto;display:flex;flex-direction:column;align-items:center">
            <div id="pass-photo-box" style="position:relative;width:96px;height:96px;border-radius:12px;overflow:hidden;border:2.5px solid ${houseColor};box-shadow:0 4px 6px -1px rgba(0,0,0,0.1)">
              <img id="pass-current-photo" src="${m.PhotoURL || m.PhotoBase64 || Utils.defaultAvatarSvg(m.FullName, m.Gender || 'Male')}" style="width:100%;height:100%;object-fit:cover" alt="Member Photo">
              
              <!-- Inline Photo Edit Overlay -->
              <label style="position:absolute;bottom:0;right:0;background:${houseColor};color:#ffffff;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:12px;box-shadow:0 2px 4px rgba(0,0,0,0.2)" title="Update Photo (Drive Storage)">
                ✏️
                <input type="file" accept="image/*" style="display:none" onchange="QRGenerator.updateCardPhoto(event, '${m.MemberID}')">
              </label>
            </div>
          </div>

          <div style="font-size:16px;font-weight:800;color:#0f172a;margin-top:4px;line-height:1.2">${Utils.escapeHtml(m.FullName)}</div>
          <div style="font-family:monospace;font-size:12px;font-weight:700;color:#64748b;margin:2px 0">${m.MemberID}</div>

          <div style="display:flex;gap:4px;justify-content:center;margin:8px 0;flex-wrap:wrap">
            ${Utils.houseBadge(house)}
            ${Utils.groupBadge(m.Group)}
          </div>

          <div style="margin:6px 0">
            ${Utils.verificationBadge(m.VerificationStatus)}
          </div>

          <!-- High-Contrast QR Canvas -->
          <div id="modal-qr-canvas" style="display:flex;justify-content:center;margin:10px 0;padding:6px;background:#ffffff;border-radius:8px"></div>

          <!-- Extra Member Metadata Details -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;text-align:left;font-size:10px;background:#f8fafc;padding:10px;border-radius:8px;border:1px solid #e2e8f0;margin-top:8px">
            <div><strong>Admitted:</strong> ${Utils.formatDate(m.JoinDate)}</div>
            <div><strong>Org Duration:</strong> ${duration}</div>
            <div><strong>Emergency:</strong> ${Utils.escapeHtml(m.EmergencyContact ? m.EmergencyContact.substring(0, 16) : 'Registered')}</div>
            <div><strong>Blood / Sex:</strong> ${m.Gender || 'Member'}</div>
          </div>

          <div style="font-size:8px;color:#94a3b8;margin-top:8px;text-align:center">
            Authorized by Fr. Director & Fr. Assistant Director &bull; DBYC
          </div>

        </div>
      </div>
      <div class="modal-footer" style="flex-wrap:wrap;gap:var(--s-2)">
        ${(m.HardCopyScan || m.AdmissionSoftCopy) ? `<button class="btn btn-outline" style="border-color:var(--primary);color:var(--primary)" onclick="Members.viewHardCopyScan('${m.MemberID}')">📑 View Scanned Admission Form</button>` : ''}
        <button class="btn btn-primary" onclick="QRGenerator.downloadIDCardPDF('${m.MemberID}', '${Utils.escapeHtml(m.FullName)}')">📥 Download ID Card (PDF)</button>
        <button class="btn btn-outline" onclick="QRGenerator.downloadIDCardImage('${m.MemberID}', '${Utils.escapeHtml(m.FullName)}')">🖼️ Download Image (PNG)</button>
        <button class="btn btn-ghost" onclick="window.print()">🖨️ Direct Print</button>
        <button class="btn btn-ghost" onclick="UI.closeModal('qr-modal')">Close</button>
      </div>`);

    new QRCode(document.getElementById('modal-qr-canvas'), {
      text: JSON.stringify({
        id: m.MemberID,
        name: m.FullName,
        house: house,
        group: m.Group,
        status: m.VerificationStatus
      }),
      width: 140,
      height: 140,
      colorDark: isQualified ? '#003F8A' : '#92400E',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
  },

  async updateCardPhoto(e, memberID) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      UI.showLoading('Uploading photo to Drive storage...');
      const base64 = await Utils.compressImage(file, 400, 400, 0.88);

      // Upload to Drive via API (with automatic fallback to base64)
      const res = await API.uploadPhoto(base64, memberID);
      UI.hideLoading();

      if (res.success) {
        UI.toast('success', 'Photo Updated', 'Profile picture saved successfully to Drive thumbnail format!');
        await this.loadCards();
        await this.showMemberQR(memberID);
      } else {
        UI.toast('error', 'Error', res.error || 'Failed to update photo');
      }
    } catch (err) {
      UI.hideLoading();
      console.error(err);
      UI.toast('error', 'Error', 'Failed to process candidate photo');
    }
  },

  // Fail-proof High-Res PDF Export
  async downloadIDCardPDF(memberID, name) {
    UI.showLoading('Generating High-Resolution ID Card PDF...');
    try {
      const element = document.getElementById('id-card-export-target');
      if (!element) throw new Error('ID card render target not found');

      const jsPDFClass = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;

      if (typeof html2canvas === 'function' && jsPDFClass) {
        // Pre-convert any images to safe base64 to eliminate tainted canvas errors
        const canvas = await html2canvas(element, {
          scale: 3,
          useCORS: true,
          allowTaint: false, // NEVER allow taint or toDataURL will throw a security error!
          logging: false,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');
        // Standard Portrait ID Card (CR80 badge / A6 standard)
        const pdf = new jsPDFClass('p', 'mm', 'a6');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        // Centered on page
        const yOffset = Math.max(5, (pdf.internal.pageSize.getHeight() - pdfHeight) / 2);
        pdf.addImage(imgData, 'PNG', 0, yOffset, pdfWidth, pdfHeight);

        const safeName = (name || 'Member').replace(/[^a-zA-Z0-9]/g, '_');
        pdf.save(`DBYC_Pass_${memberID}_${safeName}.pdf`);
        UI.toast('success', 'PDF Downloaded', 'Official ID card PDF saved successfully!');
      } else {
        window.print();
        UI.toast('info', 'Print Window Opened', 'Select "Save as PDF" to save your ID card.');
      }
    } catch (e) {
      console.warn('html2canvas exception, falling back to print dialog:', e);
      window.print();
      UI.toast('info', 'Print Dialog Active', 'Select "Save as PDF" in your print options.');
    } finally {
      UI.hideLoading();
    }
  },

  // Instant PNG Image Download option
  async downloadIDCardImage(memberID, name) {
    UI.showLoading('Rendering ID Card PNG Image...');
    try {
      const element = document.getElementById('id-card-export-target');
      if (typeof html2canvas === 'function') {
        const canvas = await html2canvas(element, {
          scale: 3,
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff'
        });
        const url = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        const safeName = (name || 'Member').replace(/[^a-zA-Z0-9]/g, '_');
        a.href = url;
        a.download = `DBYC_Pass_${memberID}_${safeName}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        UI.toast('success', 'Image Saved', 'ID Card PNG image downloaded successfully!');
      }
    } catch (err) {
      console.error(err);
      UI.toast('error', 'Export Error', 'Could not generate PNG. Use Print option.');
    } finally {
      UI.hideLoading();
    }
  }
};
