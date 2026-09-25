/* Bosco Pulse: Leaderboard, Gamification & Recognition Engine */
const LeaderboardModule = {
  _userPoints: 320,

  _groups: [
    { rank: 1, name: 'St. Peter Team', house: 'Blue House', leader: 'Antony Raj', points: 1420, attendance: '96%', badge: '🥇' },
    { rank: 2, name: 'Bosco Warriors', house: 'Red House', leader: 'Michael Joseph', points: 1350, attendance: '94%', badge: '🥈' },
    { rank: 3, name: 'Dominic Youth', house: 'Yellow House', leader: 'David Paul', points: 1280, attendance: '91%', badge: '🥉' },
    { rank: 4, name: 'Faith Builders', house: 'Green House', leader: 'Samuel Prakash', points: 1190, attendance: '88%', badge: '⭐' }
  ],

  _topMembers: [
    { rank: 1, name: 'John Bosco S', group: 'Seniors', house: 'Blue', points: 480, level: '⭐⭐⭐⭐' },
    { rank: 2, name: 'Francis Xavier R', group: 'Inters', house: 'Red', points: 440, level: '⭐⭐⭐⭐' },
    { rank: 3, name: 'Maria Goretti T', group: 'Juniors', house: 'Yellow', points: 390, level: '⭐⭐⭐' },
    { rank: 4, name: 'Dominic Savio M', group: 'Sub-Juniors', house: 'Green', points: 360, level: '⭐⭐⭐' },
    { rank: 5, name: 'Ignatius Loyola P', group: 'Seniors', house: 'Blue', points: 345, level: '⭐⭐⭐' }
  ],

  _badges: [
    { icon: '🥉', title: 'Active Member', sub: 'Attended 5+ Meetings', unlocked: true },
    { icon: '🥈', title: 'Youth Leader', sub: 'Led 3+ Group Sessions', unlocked: true },
    { icon: '🥇', title: 'Volunteer Champion', sub: '50+ Service Hours', unlocked: true },
    { icon: '🏆', title: 'Mission Ambassador', sub: 'Top Outreach Leader', unlocked: false },
    { icon: '⭐', title: 'Attendance Hero', sub: '95%+ Attendance', unlocked: false }
  ],

  render(container) {
    this._loadPoints();
    const user = Auth.getUser();

    container.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <div class="page-title">🏆 Leaderboard & Recognition (வெற்றிப் பலகை & விருதுகள்)</div>
          <div class="page-subtitle">Celebrate Excellence, Teamwork, and Generous Service</div>
        </div>
      </div>

      <!-- User Gamified Scorecard -->
      <div class="card" style="margin-bottom:var(--s-6);background:linear-gradient(135deg,#002D63 0%,#003F8A 60%,#F59E0B 100%);color:#fff;border-radius:var(--r-xl);padding:22px;border:none">
        <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px">
          <div>
            <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.2);color:#FFE082;font-size:11px;font-weight:700;padding:3px 12px;border-radius:20px;margin-bottom:6px">
              🎖️ GAMIFIED YOUTH PROFILE
            </div>
            <h2 style="font-size:1.5rem;font-weight:900;color:#fff">${Utils.escapeHtml(user.name)}</h2>
            <div style="font-size:12.5px;color:rgba(255,255,255,0.9);margin-top:2px">
              Group: <strong>${user.group || 'Seniors'}</strong> &bull; House: <strong>${user.team || 'Blue House'}</strong> &bull; Level: <strong>⭐⭐⭐⭐</strong>
            </div>
          </div>

          <div style="display:flex;gap:12px;text-align:center">
            <div style="background:rgba(255,255,255,0.15);padding:10px 16px;border-radius:12px;border:1px solid rgba(255,255,255,0.25)">
              <div style="font-size:1.7rem;font-weight:900;color:#FFD054">${this._userPoints}</div>
              <div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,0.85)">Points</div>
            </div>
            <div style="background:rgba(255,255,255,0.15);padding:10px 16px;border-radius:12px;border:1px solid rgba(255,255,255,0.25)">
              <div style="font-size:1.7rem;font-weight:900;color:#fff">#6</div>
              <div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,0.85)">Oratory Rank</div>
            </div>
            <div style="background:rgba(255,255,255,0.15);padding:10px 16px;border-radius:12px;border:1px solid rgba(255,255,255,0.25)">
              <div style="font-size:1.7rem;font-weight:900;color:#86EFAC">92%</div>
              <div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,0.85)">Attendance</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Achievement Badges Showcase -->
      <div class="card" style="margin-bottom:var(--s-6);padding:18px;border-radius:var(--r-lg);border:1px solid var(--border)">
        <h3 style="font-size:15px;font-weight:800;color:var(--text-primary);margin-bottom:12px">
          🎖️ My Earned Badges & Honors (எனது பதக்கங்கள்)
        </h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px">
          ${this._badges.map(b => `
            <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;background:${b.unlocked ? '#F0FDF4' : '#F8FAFC'};border:1px solid ${b.unlocked ? '#86EFAC' : '#E2E8F0'};opacity:${b.unlocked ? 1 : 0.6}">
              <span style="font-size:1.8rem">${b.icon}</span>
              <div>
                <div style="font-size:12.5px;font-weight:800;color:${b.unlocked ? '#065F46' : '#64748B'}">${b.title}</div>
                <div style="font-size:10.5px;color:#64748B">${b.sub}</div>
                <div style="font-size:9.5px;font-weight:700;color:${b.unlocked ? '#059669' : '#94A3B8'};margin-top:2px">
                  ${b.unlocked ? '✅ Unlocked' : '🔒 In Progress'}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Groups Leaderboard & Top Youth Grid -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));gap:var(--s-5);margin-bottom:var(--s-6)">
        
        <!-- Groups Ranking -->
        <div class="card" style="border-radius:var(--r-lg);border:1px solid var(--border);padding:18px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <h3 style="font-size:15px;font-weight:800;color:var(--text-primary)">
              👥 Group Leaderboard (குழு நிலைகள்)
            </h3>
            <span style="font-size:11px;color:#64748B">Live Points</span>
          </div>

          <div style="display:flex;flex-direction:column;gap:8px">
            ${this._groups.map(g => `
              <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-radius:10px;background:#F8FAFC;border:1px solid #E2E8F0">
                <div style="display:flex;align-items:center;gap:10px">
                  <span style="font-size:1.4rem">${g.badge}</span>
                  <div>
                    <div style="font-size:13px;font-weight:800;color:var(--text-primary)">${g.name}</div>
                    <div style="font-size:11px;color:#64748B">Leader: ${g.leader} &bull; ${g.house}</div>
                  </div>
                </div>
                <div style="text-align:right">
                  <div style="font-size:14px;font-weight:900;color:#003F8A">${g.points} PTS</div>
                  <div style="font-size:10.5px;color:#059669;font-weight:700">${g.attendance} Att.</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Top Individual Youth Members -->
        <div class="card" style="border-radius:var(--r-lg);border:1px solid var(--border);padding:18px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <h3 style="font-size:15px;font-weight:800;color:var(--text-primary)">
              🌟 Top Youth Achievers (முன்னணி இளைஞர்கள்)
            </h3>
            <span style="font-size:11px;color:#64748B">All-Time</span>
          </div>

          <div style="display:flex;flex-direction:column;gap:8px">
            ${this._topMembers.map((m, idx) => `
              <div style="display:flex;align-items:center;justify-content:space-between;padding:9px 12px;border-radius:10px;background:#F8FAFC;border:1px solid #E2E8F0">
                <div style="display:flex;align-items:center;gap:10px">
                  <span style="width:24px;height:24px;border-radius:50%;background:#E2E8F0;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#334155">
                    ${idx + 1}
                  </span>
                  <div>
                    <div style="font-size:13px;font-weight:700;color:var(--text-primary)">${m.name}</div>
                    <div style="font-size:10.5px;color:#64748B">${m.group} &bull; ${m.level}</div>
                  </div>
                </div>
                <div style="font-size:13px;font-weight:800;color:#D97706">${m.points} PTS</div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>

      <!-- Point Earning Guide -->
      <div class="card" style="padding:18px;border-radius:var(--r-lg);background:#FFFBEB;border:1px solid #FCD34D">
        <h4 style="font-size:14px;font-weight:800;color:#78350F;margin-bottom:8px">
          🎯 How to Earn Points & Badges (புள்ளிகள் பெறுவது எப்படி?)
        </h4>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px;font-size:12px;color:#92400E">
          <div>&bull; Attend Weekly Meeting: <strong>+10 PTS</strong></div>
          <div>&bull; Lead Group Activity: <strong>+30 PTS</strong></div>
          <div>&bull; Volunteer Service (2h): <strong>+25 PTS</strong></div>
          <div>&bull; Complete Formation Track: <strong>+20 PTS</strong></div>
          <div>&bull; Annual Youth Camp: <strong>+40 PTS</strong></div>
          <div>&bull; Bible & Quiz Winner: <strong>+15 PTS</strong></div>
        </div>
      </div>
    `;
  },

  addPoints(amount, reason) {
    this._userPoints += amount;
    this._savePoints();
    if (this._userPoints >= 350) {
      this._badges.find(b => b.title === 'Mission Ambassador').unlocked = true;
    }
  },

  _savePoints() {
    localStorage.setItem('dbyc_user_points', this._userPoints.toString());
  },

  _loadPoints() {
    const raw = localStorage.getItem('dbyc_user_points');
    if (raw) this._userPoints = parseInt(raw) || 320;
  }
};
