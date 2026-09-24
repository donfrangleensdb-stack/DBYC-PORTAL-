/* DBYC Dashboard View - Official Don Bosco Central Hub & Member Portal
   Pixel-Perfect Responsive Architecture & Anti-Letter-Overflow Layout */
const Dashboard = {
  async render(container) {
    const user = Auth.getUser();
    const isMember = Auth.isMember();
    const userRoleName = Auth.getRoleTitle();
    const todayFormatted = new Date().toLocaleDateString('en-IN', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    container.innerHTML = `
      <!-- Official DBYC Executive Header -->
      <div class="dash-official-header">
        <div class="dash-header-meta">
          <div class="dash-inst-badge">
            <span class="pulse-dot"></span>
            <span>DON BOSCO YOUTH CENTRE &bull; BASIN BRIDGE</span>
          </div>
          <h1 class="dash-title">
            ${isMember ? 'Youth Member Portal & ID Pass' : 'Central Command Dashboard'}
          </h1>
          <div class="dash-subtitle">
            <span>Welcome, <strong>${Utils.escapeHtml(user.name)}</strong></span>
            <span class="dash-sep">&bull;</span>
            <span class="dash-role-badge">${userRoleName}</span>
            <span class="dash-sep">&bull;</span>
            <span class="dash-date-text">📅 ${todayFormatted}</span>
          </div>
        </div>
        <div class="dash-header-actions">
          ${isMember ? `
            <button class="btn btn-primary btn-sm dash-action-btn" onclick="Router.navigate('qr')">
              <span>🪪</span> <span>My Digital ID Pass</span>
            </button>
            <button class="btn btn-outline btn-sm dash-action-btn" onclick="Router.navigate('rules')">
              <span>⚖️</span> <span>Oratory Rules</span>
            </button>
          ` : `
            ${Auth.canTakeAttendance() ? `
              <button class="btn btn-primary btn-sm dash-action-btn" onclick="Router.navigate('attendance')">
                <span>📷</span> <span>QR Scanner Terminal</span>
              </button>
            ` : ''}
            ${Auth.canSeeAllMembers() ? `
              <button class="btn btn-outline btn-sm dash-action-btn" onclick="Router.navigate('members')">
                <span>👥</span> <span>Members Registry</span>
              </button>
            ` : ''}
          `}
        </div>
      </div>

      <!-- Pending Verification Notification for Authority -->
      <div id="dash-pending-alert"></div>

      <!-- Don Bosco Salesian Spiritual Hero Banner -->
      <div class="dash-hero-card">
        <div class="dash-hero-content">
          <div class="dash-hero-pill">
            <span>✨</span> <span>ST. JOHN BOSCO &bull; ORATORY SPIRIT</span>
          </div>
          <blockquote class="dash-hero-quote">
            &ldquo;Run, jump, make noise, but do not sin!&rdquo;
          </blockquote>
          <div class="dash-hero-creed">
            Reason &bull; Religion &bull; Loving-Kindness &bull; தொன்போஸ்கோ இளைஞர் மன்றம்
          </div>
          <div class="dash-hero-actions">
            ${isMember ? `
              <button class="dash-pill-btn accent" onclick="Router.navigate('qr')">
                <span>🪪</span> <span>My Pass (அடையாள அட்டை)</span>
              </button>
              <button class="dash-pill-btn light" onclick="Router.navigate('rules')">
                <span>⚖️</span> <span>Oratory Rules (விதிகள்)</span>
              </button>
            ` : `
              ${Auth.canTakeAttendance() ? `
                <button class="dash-pill-btn accent" onclick="Router.navigate('attendance')">
                  <span>📷</span> <span>Scan Attendance</span>
                </button>
              ` : ''}
              ${Auth.canSeeAllMembers() ? `
                <button class="dash-pill-btn light" onclick="Router.navigate('members')">
                  <span>👥</span> <span>Members Registry</span>
                </button>
              ` : ''}
              <button class="dash-pill-btn light" onclick="Router.navigate('qr')">
                <span>🪪</span> <span>Digital Passes</span>
              </button>
              <button class="dash-pill-btn light" onclick="Router.navigate('rules')">
                <span>⚖️</span> <span>Rules (விதிமுறைகள்)</span>
              </button>
            `}
          </div>
        </div>
      </div>

      <!-- 4-House Championship Championship Scoreboard -->
      <div class="dash-card scoreboard-card">
        <div class="dash-card-header scoreboard-header">
          <div class="dash-header-title-group">
            <span class="dash-header-icon">🏆</span>
            <div>
              <div class="dash-header-title">4-House Championship League</div>
              <div class="dash-header-sub">Live Accumulated Points Across All 6 Youth Groups</div>
            </div>
          </div>
          <span class="dash-live-chip">LIVE SCORES</span>
        </div>
        <div class="dash-card-body" id="team-scoreboard-grid">
          <div class="loading-overlay" style="grid-column:1/-1;color:#fff;padding:24px"><div class="spinner-lg"></div></div>
        </div>
      </div>

      <!-- Overall Metrics / Stats Cards -->
      <div id="dash-stats" class="dash-stats-grid">
        ${[1,2,3,4].map(() => `
          <div class="dash-stat-box skeleton-box">
            <div class="skeleton skeleton-text short"></div>
            <div class="skeleton skeleton-text medium" style="height:26px;margin:6px 0"></div>
            <div class="skeleton skeleton-text short"></div>
          </div>
        `).join('')}
      </div>

      <!-- Groups Breakdown & Recent Attendance -->
      <div class="dash-details-grid ${isMember ? 'single-col' : ''}">
        ${!isMember ? `
          <div class="dash-card">
            <div class="dash-card-header">
              <div class="dash-header-title-group">
                <span class="dash-header-icon">📊</span>
                <span class="dash-header-title">Youth Groups Attendance Ratio</span>
              </div>
            </div>
            <div class="dash-card-body" id="dash-groups" style="padding:14px 18px">
              <div class="loading-overlay"><div class="spinner-lg"></div></div>
            </div>
          </div>
        ` : ''}

        <div class="dash-card">
          <div class="dash-card-header">
            <div class="dash-header-title-group">
              <span class="dash-header-icon">🕒</span>
              <span class="dash-header-title">Recent Verified Attendance</span>
            </div>
          </div>
          <div class="dash-card-body" id="dash-activity" style="padding:0">
            <div class="loading-overlay"><div class="spinner-lg"></div></div>
          </div>
        </div>
      </div>
    `;

    const result = await API.getDashboard();
    if (!result.success) {
      UI.toast('error', 'Error', result.error);
      return;
    }
    const d = result.data;

    // 1. Pending Verification Alert
    const pendingAlert = document.getElementById('dash-pending-alert');
    if (pendingAlert && d.pendingVerifications > 0 && Auth.isAdmin()) {
      pendingAlert.innerHTML = `
        <div class="dash-alert-box">
          <div class="dash-alert-left">
            <span class="dash-alert-icon">🛡️</span>
            <div>
              <div class="dash-alert-title">${d.pendingVerifications} New Member(s) Awaiting Verification</div>
              <div class="dash-alert-desc">Review and approve credentials to grant active digital ID passes.</div>
            </div>
          </div>
          <button class="btn btn-sm btn-primary dash-alert-action" onclick="Router.navigate('members')">
            Review Queue ➔
          </button>
        </div>`;
    }

    // 2. Render 4 Teams Scoreboard
    const scoreboard = document.getElementById('team-scoreboard-grid');
    if (scoreboard && d.teamScores) {
      const teams = Utils.TEAMS;
      const sortedTeams = [...teams].sort((a, b) => (d.teamScores[b]?.points || 0) - (d.teamScores[a]?.points || 0));

      scoreboard.innerHTML = sortedTeams.map((t, idx) => {
        const sc = d.teamScores[t] || { points: 0, members: 0, attendanceToday: 0 };
        const rankIcon = idx === 0 ? '🥇 1st' : idx === 1 ? '🥈 2nd' : idx === 2 ? '🥉 3rd' : '4th';
        const color = Utils.HOUSE_COLORS[t] || Utils.TEAM_COLORS[t] || '#003F8A';

        return `
          <div class="dash-house-tile" style="border-top-color:${color}">
            <div class="dash-house-top">
              <span class="dash-house-rank" style="color:${color};background:#FFFFFF">${rankIcon}</span>
              <span class="dash-house-count">${sc.members} Members</span>
            </div>
            <div class="dash-house-name">${t}</div>
            <div class="dash-house-points">
              ${sc.points.toLocaleString()} <span class="dash-pts-label">pts</span>
            </div>
            <div class="dash-house-today">
              <span class="dash-dot-live"></span>
              <span>Today: <strong>${sc.attendanceToday}</strong> Checked In</span>
            </div>
          </div>`;
      }).join('');
    }

    // 3. Stats Cards
    const statsEl = document.getElementById('dash-stats');
    if (statsEl) {
      if (isMember) {
        statsEl.innerHTML = `
          <div class="dash-stat-box">
            <div class="dash-stat-top">
              <span class="dash-stat-icon" style="background:var(--primary-10);color:var(--primary)">🏠</span>
              <span class="dash-stat-tag">League</span>
            </div>
            <div class="dash-stat-label">Assigned House</div>
            <div class="dash-stat-value" style="font-size:1.15rem">${Utils.teamBadge(user.team || 'Red House')}</div>
            <div class="dash-stat-change up">✦ 4-House League</div>
          </div>
          <div class="dash-stat-box">
            <div class="dash-stat-top">
              <span class="dash-stat-icon" style="background:var(--success-bg);color:var(--success)">👥</span>
              <span class="dash-stat-tag">Band</span>
            </div>
            <div class="dash-stat-label">Youth Category</div>
            <div class="dash-stat-value" style="font-size:1.15rem">${Utils.groupBadge(user.group || 'Seniors')}</div>
            <div class="dash-stat-change">Active Youth Band</div>
          </div>
          <div class="dash-stat-box">
            <div class="dash-stat-top">
              <span class="dash-stat-icon" style="background:var(--accent-10);color:var(--accent-dark)">🪪</span>
              <span class="dash-stat-tag">Status</span>
            </div>
            <div class="dash-stat-label">Pass Identification</div>
            <div class="dash-stat-value" style="font-size:1.1rem">${user.memberId || 'DBYC Pass'}</div>
            <div class="dash-stat-change up">Verified Digital Pass</div>
          </div>
          <div class="dash-stat-box">
            <div class="dash-stat-top">
              <span class="dash-stat-icon" style="background:var(--info-bg);color:var(--info)">⭐</span>
              <span class="dash-stat-tag">Points</span>
            </div>
            <div class="dash-stat-label">Personal Merit Points</div>
            <div class="dash-stat-value">${user.points || 120} <span class="dash-stat-unit">pts</span></div>
            <div class="dash-stat-change up">Contributes to House</div>
          </div>`;
      } else {
        statsEl.innerHTML = `
          <div class="dash-stat-box">
            <div class="dash-stat-top">
              <span class="dash-stat-icon" style="background:var(--primary-10);color:var(--primary)">👥</span>
              <span class="dash-stat-tag">Enrolled</span>
            </div>
            <div class="dash-stat-label">Verified Members</div>
            <div class="dash-stat-value">${d.activeMembers}</div>
            <div class="dash-stat-change up">✦ ${d.totalMembers} total enrolled</div>
          </div>
          <div class="dash-stat-box">
            <div class="dash-stat-top">
              <span class="dash-stat-icon" style="background:var(--success-bg);color:var(--success)">✅</span>
              <span class="dash-stat-tag">Today</span>
            </div>
            <div class="dash-stat-label">Today's Attendance</div>
            <div class="dash-stat-value">${d.todayAttendance}</div>
            <div class="dash-stat-change">Verified Check-Ins</div>
          </div>
          <div class="dash-stat-box">
            <div class="dash-stat-top">
              <span class="dash-stat-icon" style="background:var(--accent-10);color:var(--accent-dark)">🏆</span>
              <span class="dash-stat-tag">Houses</span>
            </div>
            <div class="dash-stat-label">4 Teams Contested</div>
            <div class="dash-stat-value">4</div>
            <div class="dash-stat-change">Active Championship</div>
          </div>
          <div class="dash-stat-box">
            <div class="dash-stat-top">
              <span class="dash-stat-icon" style="background:var(--info-bg);color:var(--info)">🛡️</span>
              <span class="dash-stat-tag">Queue</span>
            </div>
            <div class="dash-stat-label">Pending Verification</div>
            <div class="dash-stat-value">${d.pendingVerifications}</div>
            <div class="dash-stat-change ${d.pendingVerifications > 0 ? 'down' : 'up'}">Awaiting Director</div>
          </div>`;
      }
    }

    // 4. Groups Attendance Ratio
    const grpDiv = document.getElementById('dash-groups');
    if (grpDiv && d.byGroup) {
      grpDiv.innerHTML = Utils.GROUPS.map(g => {
        const info = d.byGroup[g] || { members: 0, todayAttendance: 0 };
        const pct = info.members > 0 ? Math.round((info.todayAttendance / info.members) * 100) : 0;
        const colorClass = pct >= 70 ? 'success' : pct >= 40 ? 'warning' : 'danger';

        return `
          <div class="dash-group-row">
            <div class="dash-group-meta">
              <div class="dash-group-left">
                ${Utils.groupBadge(g)}
                <span class="dash-group-count"><strong>${info.todayAttendance}</strong> of ${info.members} present</span>
              </div>
              <span class="dash-group-pct ${colorClass}">${pct}%</span>
            </div>
            <div class="progress" style="height:7px;border-radius:4px">
              <div class="progress-bar ${colorClass}" style="width:${pct}%"></div>
            </div>
          </div>`;
      }).join('');
    }

    // 5. Recent Activity
    const actDiv = document.getElementById('dash-activity');
    if (actDiv) {
      const recent = d.recentActivity || [];
      if (!recent.length) {
        actDiv.innerHTML = `
          <div class="empty-state" style="padding:var(--s-6)">
            <div style="font-size:2rem;margin-bottom:6px">📋</div>
            <div class="empty-desc">No attendance recorded today yet</div>
          </div>`;
      } else {
        actDiv.innerHTML = recent.map(a => `
          <div class="dash-activity-item">
            <div class="dash-activity-avatar">${Utils.initials(a.MemberName)}</div>
            <div class="dash-activity-info">
              <div class="dash-activity-name">${Utils.escapeHtml(a.MemberName || '')}</div>
              <div class="dash-activity-badges">
                ${Utils.teamBadge(a.Team)}
                ${Utils.groupBadge(a.Group)}
              </div>
            </div>
            <div class="dash-activity-points">
              <span class="points-chip">+${a.PointsAwarded || 10} pts</span>
            </div>
          </div>`).join('');
      }
    }
  }
};
