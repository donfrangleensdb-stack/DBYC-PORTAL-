/* DBYC Dashboard View - 4-Team Scoreboard, Stats & Authority Alerts */
const Dashboard = {
  async render(container) {
    const user = Auth.getUser();
    const isMember = Auth.isMember();
    container.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <div class="page-title">${isMember ? 'DBYC Youth Member Portal (மன்ற தளம்)' : 'DBYC Central Dashboard'}</div>
          <div class="page-subtitle">Welcome, ${Utils.escapeHtml(user.name)} &bull; ${user.team || user.group || ''} &bull; ${new Date().toLocaleDateString('en-IN',{weekday:'long',day:'2-digit',month:'long',year:'numeric'})}</div>
        </div>
        <div class="page-actions">
          ${isMember ? `
            <button class="btn btn-primary btn-sm" onclick="Router.navigate('qr')">🪪 View My Digital Pass</button>
          ` : `
            ${Auth.canTakeAttendance() ? `<button class="btn btn-outline btn-sm" onclick="Router.navigate('attendance')">📷 QR Scanner Terminal</button>` : ''}
          `}
        </div>
      </div>

      <!-- Pending Verification Notification for Authority -->
      <div id="dash-pending-alert"></div>

      <!-- Don Bosco Oratory Spiritual Thematic Hero Banner -->
      <div class="card" style="margin-bottom:var(--s-6);position:relative;overflow:hidden;border:none;border-radius:var(--r-xl);box-shadow:var(--shadow-lg);min-height:160px;background:linear-gradient(90deg, rgba(0, 35, 85, 0.92) 0%, rgba(0, 63, 138, 0.78) 50%, rgba(15, 23, 42, 0.88) 100%), url('${(typeof DBYC_THEMES !== "undefined" && DBYC_THEMES.banner) ? DBYC_THEMES.banner : "assets/don-bosco-banner.jpg"}') center/cover no-repeat;display:flex;align-items:center;padding:var(--s-6)">
        <div style="max-width:620px;color:#ffffff;z-index:2">
          <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,184,0,0.25);border:1px solid rgba(255,184,0,0.6);padding:3px 12px;border-radius:20px;font-size:11px;font-weight:700;color:var(--accent);letter-spacing:0.05em;margin-bottom:8px">
            ✨ ST. JOHN BOSCO &bull; FATHER & TEACHER OF YOUTH
          </div>
          <div style="font-size:var(--text-xl);font-weight:800;letter-spacing:-0.02em;line-height:1.2;text-shadow:0 2px 4px rgba(0,0,0,0.5)">
            "Run, jump, shout, make all the noise you want, but do not sin!"
          </div>
          <div style="font-size:var(--text-xs);color:rgba(255,255,255,0.85);margin-top:6px;font-style:italic">
            Reason &bull; Religion &bull; Loving-Kindness &bull; St. John Bosco's Oratory Way at DBYC
          </div>
          
          <div style="display:flex;gap:var(--s-2);margin-top:var(--s-4);flex-wrap:wrap">
            ${isMember ? `
              <button class="btn btn-accent btn-sm" onclick="Router.navigate('qr')">🪪 My Digital Pass (அடையாள அட்டை)</button>
              <button class="btn btn-outline btn-sm" style="color:#ffffff;border-color:rgba(255,184,0,0.85);background:rgba(255,184,0,0.2)" onclick="Router.navigate('rules')">⚖️ Rules (விதிமுறைகள்)</button>
            ` : `
              ${Auth.canTakeAttendance() ? `<button class="btn btn-accent btn-sm" onclick="Router.navigate('attendance')">📷 Scan Attendance</button>` : ''}
              ${Auth.canSeeAllMembers() ? `<button class="btn btn-outline btn-sm" style="color:#ffffff;border-color:rgba(255,255,255,0.6)" onclick="Router.navigate('members')">👥 Members Registry</button>` : ''}
              <button class="btn btn-ghost btn-sm" style="color:#ffffff" onclick="Router.navigate('qr')">🪪 Digital Passes</button>
              <button class="btn btn-outline btn-sm" style="color:#ffffff;border-color:rgba(255,184,0,0.85);background:rgba(255,184,0,0.2)" onclick="Router.navigate('rules')">⚖️ Rules (விதிமுறைகள்)</button>
            `}
          </div>
        </div>
      </div>

      <div class="card" style="margin-bottom:var(--s-6);background:linear-gradient(135deg,#002D63 0%,#003F8A 100%);color:#fff;border:none">
        <div class="card-header" style="border-bottom:1px solid rgba(255,255,255,0.15)">
          <div style="display:flex;align-items:center;gap:var(--s-2)">
            <span style="font-size:1.4rem">🏆</span>
            <span style="font-size:var(--text-base);font-weight:700;color:#fff">4-House Official Points Championship</span>
          </div>
          <span style="font-size:var(--text-xs);color:rgba(255,255,255,0.7)">Live Accumulated House Scores Across All 6 Groups</span>
        </div>
        <div class="card-body" id="team-scoreboard-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:var(--s-3)">
          <div class="loading-overlay" style="grid-column:1/-1;color:#fff"><div class="spinner-lg"></div></div>
        </div>
      </div>

      <!-- Overall Metrics -->
      <div id="dash-stats" class="grid-4" style="margin-bottom:var(--s-6)">
        ${[1,2,3,4].map(()=>`<div class="stat-card"><div class="stat-body"><div class="skeleton skeleton-text short"></div><div class="skeleton skeleton-text medium" style="height:24px"></div></div></div>`).join('')}
      </div>

      <!-- Groups Breakdown & Recent Attendance -->
      <div class="${isMember ? 'grid-1' : 'grid-2'}" style="margin-bottom:var(--s-6)">
        ${!isMember ? `
        <div class="card">
          <div class="card-header"><span class="card-title">Youth Groups Attendance Ratio</span></div>
          <div class="card-body" id="dash-groups"><div class="loading-overlay"><div class="spinner-lg"></div></div></div>
        </div>` : ''}
        <div class="card">
          <div class="card-header"><span class="card-title">Recent Verified Attendance</span></div>
          <div class="card-body" style="padding:0" id="dash-activity"><div class="loading-overlay"><div class="spinner-lg"></div></div></div>
        </div>
      </div>`;

    const result = await API.getDashboard();
    if (!result.success) { UI.toast('error', 'Error', result.error); return; }
    const d = result.data;

    // 1. Pending Verification Alert
    const pendingAlert = document.getElementById('dash-pending-alert');
    if (pendingAlert && d.pendingVerifications > 0 && Auth.isAdmin()) {
      pendingAlert.innerHTML = `
        <div class="alert alert-warning" style="margin-bottom:var(--s-5);display:flex;align-items:center;justify-content:space-between">
          <div style="display:flex;align-items:center;gap:var(--s-3)">
            <span style="font-size:1.4rem">🛡️</span>
            <div>
              <strong>${d.pendingVerifications} New Member(s) Awaiting Qualification</strong>
              <div style="font-size:var(--text-xs)">Review and verify their credentials before they can obtain an active QR pass.</div>
            </div>
          </div>
          <button class="btn btn-sm btn-primary" onclick="Router.navigate('members')">Go to Verification Queue</button>
        </div>`;
    }

    // 2. Render 4 Teams Scoreboard
    const scoreboard = document.getElementById('team-scoreboard-grid');
    if (scoreboard && d.teamScores) {
      const teams = Utils.TEAMS;
      // Sort teams by points descending
      const sortedTeams = [...teams].sort((a, b) => (d.teamScores[b]?.points || 0) - (d.teamScores[a]?.points || 0));

      scoreboard.innerHTML = sortedTeams.map((t, idx) => {
        const sc = d.teamScores[t] || { points: 0, members: 0, attendanceToday: 0 };
        const rankIcon = idx === 0 ? '🥇 1st' : idx === 1 ? '🥈 2nd' : idx === 2 ? '🥉 3rd' : '4th';
        const color = Utils.HOUSE_COLORS[t] || Utils.TEAM_COLORS[t] || '#003F8A';
        return `
          <div style="background:rgba(255,255,255,0.08);padding:var(--s-4);border-radius:var(--r-lg);border-top:4px solid ${color};position:relative">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
              <span style="font-size:var(--text-xs);font-weight:700;color:${color};background:#fff;padding:2px 8px;border-radius:12px">${rankIcon}</span>
              <span style="font-size:11px;color:rgba(255,255,255,0.7)">${sc.members} Members</span>
            </div>
            <div style="font-size:var(--text-base);font-weight:700;margin-top:6px">${t}</div>
            <div style="font-size:var(--text-3xl);font-weight:800;color:var(--accent);line-height:1.2;margin:4px 0">${sc.points} <span style="font-size:var(--text-xs);color:#fff">pts</span></div>
            <div style="font-size:10px;color:rgba(255,255,255,0.65)">Today: ${sc.attendanceToday} Checked In</div>
          </div>`;
      }).join('');
    }

    // 3. Stats Cards
    const statsEl = document.getElementById('dash-stats');
    if (statsEl) {
      if (isMember) {
        statsEl.innerHTML = `
          <div class="stat-card">
            <div class="stat-icon" style="background:var(--primary-10);color:var(--primary)">🏠</div>
            <div class="stat-body">
              <div class="stat-label">Assigned House</div>
              <div class="stat-value" style="font-size:var(--text-sm);font-weight:700">${Utils.teamBadge(user.team || 'Red House')}</div>
              <div class="stat-change up">✦ 4-House League</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:var(--success-bg);color:var(--success)">👥</div>
            <div class="stat-body">
              <div class="stat-label">Youth Category</div>
              <div class="stat-value" style="font-size:var(--text-sm);font-weight:700">${Utils.groupBadge(user.group || 'Seniors')}</div>
              <div class="stat-change">Active Youth Band</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:var(--accent-10);color:var(--accent-dark)">🪪</div>
            <div class="stat-body">
              <div class="stat-label">Pass Identification</div>
              <div class="stat-value" style="font-size:var(--text-base);font-weight:700">${user.memberId || 'DBYC Pass'}</div>
              <div class="stat-change up">Verified Digital Pass</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:var(--info-bg);color:var(--info)">⭐</div>
            <div class="stat-body">
              <div class="stat-label">Personal Merit Points</div>
              <div class="stat-value">${user.points || 120} <span style="font-size:12px;color:var(--text-muted)">pts</span></div>
              <div class="stat-change up">Contributes to House</div>
            </div>
          </div>`;
      } else {
        statsEl.innerHTML = `
          <div class="stat-card">
            <div class="stat-icon" style="background:var(--primary-10);color:var(--primary)">👥</div>
            <div class="stat-body">
              <div class="stat-label">Verified Members</div>
              <div class="stat-value">${d.activeMembers}</div>
              <div class="stat-change up">✦ ${d.totalMembers} total enrolled</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:var(--success-bg);color:var(--success)">✅</div>
            <div class="stat-body">
              <div class="stat-label">Today's Attendance</div>
              <div class="stat-value">${d.todayAttendance}</div>
              <div class="stat-change">Verified Check-Ins</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:var(--accent-10);color:var(--accent-dark)">🏆</div>
            <div class="stat-body">
              <div class="stat-label">4 Teams Contested</div>
              <div class="stat-value">4</div>
              <div class="stat-change">Active Championship</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:var(--info-bg);color:var(--info)">🛡️</div>
            <div class="stat-body">
              <div class="stat-label">Pending Verifications</div>
              <div class="stat-value">${d.pendingVerifications}</div>
              <div class="stat-change ${d.pendingVerifications>0?'down':'up'}">Awaiting Director</div>
            </div>
          </div>`;
      }
    }

    // 4. Groups Attendance Ratio
    const grpDiv = document.getElementById('dash-groups');
    if (grpDiv && d.byGroup) {
      grpDiv.innerHTML = Utils.GROUPS.map(g => {
        const info = d.byGroup[g] || { members: 0, todayAttendance: 0 };
        const pct = info.members > 0 ? Math.round((info.todayAttendance / info.members) * 100) : 0;
        return `
          <div style="margin-bottom:var(--s-3)">
            <div style="display:flex;justify-content:space-between;font-size:var(--text-xs);margin-bottom:3px">
              <span>${Utils.groupBadge(g)} <strong>${info.todayAttendance} of ${info.members} present</strong></span>
              <span style="font-weight:600">${pct}%</span>
            </div>
            <div class="progress"><div class="progress-bar ${pct>=70?'success':pct>=40?'warning':'danger'}" style="width:${pct}%"></div></div>
          </div>`;
      }).join('');
    }

    // 5. Recent Activity
    const actDiv = document.getElementById('dash-activity');
    if (actDiv) {
      const recent = d.recentActivity || [];
      if (!recent.length) {
        actDiv.innerHTML = `<div class="empty-state" style="padding:var(--s-6)"><div class="empty-desc">No attendance recorded today</div></div>`;
      } else {
        actDiv.innerHTML = recent.map(a => `
          <div style="display:flex;align-items:center;gap:var(--s-3);padding:var(--s-3) var(--s-5);border-bottom:1px solid var(--border)">
            <div style="width:34px;height:34px;border-radius:50%;background:var(--primary-10);color:var(--primary);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:var(--text-xs)">${Utils.initials(a.MemberName)}</div>
            <div style="flex:1;min-width:0">
              <div style="font-size:var(--text-sm);font-weight:600">${Utils.escapeHtml(a.MemberName||'')}</div>
              <div style="font-size:var(--text-xs);color:var(--text-muted)">${Utils.teamBadge(a.Team)} &bull; ${Utils.groupBadge(a.Group)}</div>
            </div>
            <span class="points-chip">+${a.PointsAwarded || 10} pts</span>
          </div>`).join('');
      }
    }
  }
};
