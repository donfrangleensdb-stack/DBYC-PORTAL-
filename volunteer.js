/* Bosco Pulse: Volunteer & Social Action Service Tracker */
const VolunteerModule = {
  _totalMovementHours: 8520,
  _userHours: 56,

  _drives: [
    {
      id: 'VOL-01',
      title: 'Blood Donation Camp & Health Checkup',
      tamilTitle: 'இரத்ததான முகாம் & மருத்துவ பரிசோதனை',
      category: 'Health & Life',
      icon: '🩸',
      hoursPerSession: 4,
      points: 40,
      beneficiaries: '120 Patients Supported',
      desc: 'Annual blood donation camp organized with the Red Cross Society at Don Bosco Basin Bridge premises.'
    },
    {
      id: 'VOL-02',
      title: 'Green Earth Tree Plantation Mission',
      tamilTitle: 'பசுமை பூமி மரக்கன்று நடும் பணி',
      category: 'Environment',
      icon: '🌳',
      hoursPerSession: 3,
      points: 25,
      beneficiaries: '500+ Saplings Planted',
      desc: 'Planting native fruit and shade trees along Basin Bridge urban road shoulders and school compounds.'
    },
    {
      id: 'VOL-03',
      title: 'Slum Evening Tuition & Mentorship',
      tamilTitle: 'மாலை நேர இலவச கல்வி கற்பித்தல்',
      category: 'Education',
      icon: '📚',
      hoursPerSession: 2,
      points: 20,
      beneficiaries: '85 Children Educated',
      desc: 'Daily study support, mathematics tutoring, and moral storytelling for children from underprivileged families.'
    },
    {
      id: 'VOL-04',
      title: 'Civic Cleanliness & Eco-Sanitation Drive',
      tamilTitle: 'சமூக தூய்மை & சுகாதார விழிப்புணர்வு',
      category: 'Community',
      icon: '🧹',
      hoursPerSession: 3,
      points: 25,
      beneficiaries: 'Basin Bridge Community Belt',
      desc: 'Segregating plastic waste and conducting sanitation awareness campaigns in neighboring wards.'
    },
    {
      id: 'VOL-05',
      title: 'Oratory & Church Liturgical Service',
      tamilTitle: 'ஆலய & இளைஞர் மன்ற திருத்தொண்டு',
      category: 'Service',
      icon: '⛪',
      hoursPerSession: 2,
      points: 15,
      beneficiaries: 'Parish Community',
      desc: 'Assisting in Sunday mass coordination, youth choir, AV operations, and oratory ground maintenance.'
    }
  ],

  _serviceLog: [
    { date: '2026-09-20', drive: 'Slum Evening Tuition', hours: 2, points: 20, verifiedBy: 'Fr. Director' },
    { date: '2026-09-14', drive: 'Green Earth Tree Plantation', hours: 3, points: 25, verifiedBy: 'Group Leader' },
    { date: '2026-09-07', drive: 'Oratory & Church Liturgical Service', hours: 2, points: 15, verifiedBy: 'Fr. Asst. Director' }
  ],

  render(container) {
    this._loadHours();
    const user = Auth.getUser();

    container.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <div class="page-title">❤️ Volunteer & Service Tracker (தன்னார்வ சமூகப் பணி)</div>
          <div class="page-subtitle">Serving Society with Don Bosco's Loving-Kindness & Compassion</div>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary btn-sm" onclick="VolunteerModule.openLogHoursModal()">+ Log My Service Hours</button>
        </div>
      </div>

      <!-- Movement Impact Bar -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:var(--s-4);margin-bottom:var(--s-6)">
        <div class="card" style="padding:18px;border-radius:var(--r-xl);background:linear-gradient(135deg,#059669,#10B981);color:#fff;border:none">
          <div style="font-size:12px;font-weight:700;letter-spacing:0.5px;color:#D1FAE5;text-transform:uppercase">🌍 Movement Impact</div>
          <div style="font-size:2.1rem;font-weight:900;margin:4px 0">${this._totalMovementHours.toLocaleString()}+ Hrs</div>
          <div style="font-size:11.5px;color:rgba(255,255,255,0.85)">Total Volunteer Hours Contributed by DBYC Youth</div>
        </div>

        <div class="card" style="padding:18px;border-radius:var(--r-xl);background:linear-gradient(135deg,#002D63,#003F8A);color:#fff;border:none">
          <div style="font-size:12px;font-weight:700;letter-spacing:0.5px;color:#93C5FD;text-transform:uppercase">👤 My Service Record</div>
          <div style="font-size:2.1rem;font-weight:900;color:#FBBF24;margin:4px 0">${this._userHours} Hours</div>
          <div style="font-size:11.5px;color:rgba(255,255,255,0.85)">
            Tier: <strong>${this._getVolunteerBadge(this._userHours).title}</strong> (${this._getVolunteerBadge(this._userHours).badge})
          </div>
        </div>
      </div>

      <!-- Volunteer Drives Catalog -->
      <h3 style="font-size:16px;font-weight:800;color:var(--text-primary);margin-bottom:12px">
        Active Service Opportunities (செயலில் உள்ள சமூக திட்டங்கள்)
      </h3>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:var(--s-4);margin-bottom:var(--s-6)">
        ${this._drives.map(d => `
          <div class="card" style="padding:16px;border-radius:var(--r-lg);display:flex;flex-direction:column;justify-content:space-between;border:1px solid var(--border)">
            <div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                <span style="font-size:1.6rem">${d.icon}</span>
                <span style="background:#EFF6FF;color:#1D4ED8;font-size:11px;font-weight:700;padding:2px 10px;border-radius:12px">
                  ${d.category}
                </span>
              </div>
              <h4 style="font-size:15px;font-weight:800;color:var(--text-primary);margin-bottom:2px">${d.title}</h4>
              <div style="font-size:11.5px;font-weight:600;color:#64748B;margin-bottom:8px">${d.tamilTitle}</div>
              <p style="font-size:12px;color:var(--text-secondary);line-height:1.45;margin-bottom:10px">${d.desc}</p>
              
              <div style="background:#F8FAFC;padding:8px 10px;border-radius:8px;font-size:11.5px;color:#334155;border:1px solid #E2E8F0">
                🌱 <strong>Impact:</strong> ${d.beneficiaries} &bull; ⏱️ ${d.hoursPerSession}h (+${d.points} PTS)
              </div>
            </div>

            <div style="margin-top:14px">
              <button class="btn btn-sm btn-outline btn-full" style="color:#059669;border-color:#10B981" onclick="VolunteerModule.joinDrive('${d.title}')">
                🤝 Volunteer for this Drive
              </button>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Recent Service Log History -->
      <div class="card" style="border-radius:var(--r-lg);border:1px solid var(--border);padding:18px">
        <h3 style="font-size:15px;font-weight:800;color:var(--text-primary);margin-bottom:12px">
          📋 My Service Activity History (எனது சமூகப் பணி வரலாறு)
        </h3>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${this._serviceLog.map(log => `
            <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:#F8FAFC;border-radius:8px;border:1px solid #E2E8F0;font-size:12.5px">
              <div>
                <strong>${log.drive}</strong>
                <div style="font-size:11px;color:#64748B">🗓️ ${log.date} &bull; Verified by: ${log.verifiedBy}</div>
              </div>
              <div style="text-align:right">
                <span style="font-weight:800;color:#059669">+${log.hours} Hours</span>
                <div style="font-size:10.5px;color:#D97706;font-weight:700">+${log.points} PTS</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  openLogHoursModal() {
    UI.openModal(`
      <div style="padding:10px">
        <h3 style="font-size:17px;font-weight:800;color:#002D63;margin-bottom:6px">📝 Log Volunteer Service Hours</h3>
        <div style="font-size:12px;color:#64748B;margin-bottom:14px">Submit your service hours for verification by your Group Leader or Fr. Director.</div>

        <div style="display:flex;flex-direction:column;gap:12px;text-align:left">
          <div>
            <label style="font-size:12px;font-weight:700;color:#334155;display:block;margin-bottom:4px">Select Service Drive:</label>
            <select id="vol-drive-select" class="form-input" style="width:100%;padding:8px 12px;border-radius:8px;border:1px solid #CBD5E1">
              ${this._drives.map(d => `<option value="${d.title}">${d.title}</option>`).join('')}
            </select>
          </div>

          <div>
            <label style="font-size:12px;font-weight:700;color:#334155;display:block;margin-bottom:4px">Date of Service:</label>
            <input type="date" id="vol-date" class="form-input" style="width:100%;padding:8px 12px;border-radius:8px;border:1px solid #CBD5E1" value="${new Date().toISOString().split('T')[0]}">
          </div>

          <div>
            <label style="font-size:12px;font-weight:700;color:#334155;display:block;margin-bottom:4px">Hours Served:</label>
            <input type="number" id="vol-hours" min="1" max="12" value="3" class="form-input" style="width:100%;padding:8px 12px;border-radius:8px;border:1px solid #CBD5E1">
          </div>
        </div>

        <div style="margin-top:16px;display:flex;gap:10px">
          <button class="btn btn-primary btn-full" onclick="VolunteerModule.submitHours()">
            Submit Service Hours
          </button>
          <button class="btn btn-outline" onclick="UI.closeModal()">Cancel</button>
        </div>
      </div>
    `);
  },

  submitHours() {
    const drive = document.getElementById('vol-drive-select').value;
    const date = document.getElementById('vol-date').value;
    const hours = parseInt(document.getElementById('vol-hours').value) || 2;
    const points = hours * 10;

    this._userHours += hours;
    this._totalMovementHours += hours;
    this._serviceLog.unshift({
      date: date,
      drive: drive,
      hours: hours,
      points: points,
      verifiedBy: 'Pending Authority'
    });

    UI.closeModal();
    UI.toast('success', 'Hours Submitted Successfully!', `+${hours} Hours recorded. You earned +${points} Leadership Points.`);
    LeaderboardModule.addPoints(points, `Volunteered for ${drive}`);
    this._saveHours();

    const container = document.getElementById('view-container');
    if (container) this.render(container);
  },

  joinDrive(title) {
    UI.toast('success', 'Enrolled as Volunteer!', `You are enlisted for "${title}". Coordinator will brief the volunteer team.`);
  },

  _getVolunteerBadge(hours) {
    if (hours >= 100) return { title: 'Mission Ambassador', badge: '🏆' };
    if (hours >= 50) return { title: 'Volunteer Champion', badge: '🥇' };
    if (hours >= 25) return { title: 'Youth Leader', badge: '🥈' };
    return { title: 'Active Volunteer', badge: '🥉' };
  },

  _saveHours() {
    localStorage.setItem('dbyc_user_volunteer_hours', this._userHours.toString());
    localStorage.setItem('dbyc_volunteer_log', JSON.stringify(this._serviceLog));
  },

  _loadHours() {
    const rawH = localStorage.getItem('dbyc_user_volunteer_hours');
    if (rawH) this._userHours = parseInt(rawH) || 56;
    const rawL = localStorage.getItem('dbyc_volunteer_log');
    if (rawL) {
      try { this._serviceLog = JSON.parse(rawL); } catch(e) {}
    }
  }
};
