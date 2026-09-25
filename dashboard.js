/* Bosco Pulse: Central Ecosystem Dashboard & Movement Hub */
const Dashboard = {
  async render(container) {
    const user = Auth.getUser();
    const isMember = Auth.isMember();
    
    // Load gamification data
    const userPoints = parseInt(localStorage.getItem('dbyc_user_points') || '320');
    const userHours = parseInt(localStorage.getItem('dbyc_user_volunteer_hours') || '56');

    container.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <div class="page-title">🌟 Bosco Pulse &bull; Youth Connect (மன்றத் தளம்)</div>
          <div class="page-subtitle">Learn &bull; Lead &bull; Serve &bull; Grow &bull; St. John Bosco Youth Movement</div>
        </div>
        <div class="page-actions" style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-outline btn-sm" onclick="Dashboard.openThemeSelectorModal()" title="Switch Movement Visual Theme">
            🎨 Themes (வண்ணங்கள்)
          </button>
          <button class="btn btn-primary btn-sm" onclick="Router.navigate('qr')">
            🪪 My Digital Youth ID
          </button>
        </div>
      </div>

      <!-- Pending Verification Notification for Authority -->
      <div id="dash-pending-alert"></div>

      <!-- 1. Movement Hero Showcase Banner -->
      <div class="card" style="margin-bottom:var(--s-6);position:relative;overflow:hidden;border:none;border-radius:var(--r-xl);box-shadow:var(--shadow-lg);min-height:180px;background:linear-gradient(135deg, rgba(0, 45, 99, 0.95) 0%, rgba(0, 63, 138, 0.88) 50%, rgba(30, 58, 138, 0.92) 100%), url('assets/don-bosco-banner.jpg') center/cover no-repeat;display:flex;align-items:center;padding:24px">
        <div style="max-width:680px;color:#ffffff;z-index:2">
          <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,184,0,0.25);border:1px solid rgba(255,184,0,0.6);padding:3px 12px;border-radius:20px;font-size:11px;font-weight:700;color:#FFD054;letter-spacing:0.05em;margin-bottom:8px">
            ✨ YOUTH ECOSYSTEM PLATFORM &bull; BASIN BRIDGE
          </div>
          <div style="font-size:1.65rem;font-weight:900;letter-spacing:-0.01em;line-height:1.2;text-shadow:0 2px 4px rgba(0,0,0,0.5)">
            Building Leaders of Faith, Service & Tomorrow
          </div>
          <div style="font-size:12.5px;color:rgba(255,255,255,0.88);margin-top:6px;font-style:italic">
            &ldquo;Run, jump, shout, make all the noise you want, but do not sin!&rdquo; &mdash; St. John Bosco
          </div>
          
          <!-- Movement Quick Action Buttons -->
          <div style="display:flex;gap:8px;margin-top:16px;flex-wrap:wrap">
            <button class="btn btn-accent btn-sm" onclick="Router.navigate('events')">
              📅 Upcoming Events & Camps
            </button>
            <button class="btn btn-outline btn-sm" style="color:#ffffff;border-color:rgba(255,255,255,0.7);background:rgba(255,255,255,0.15)" onclick="Router.navigate('formation')">
              📚 Formation Hub
            </button>
            <button class="btn btn-outline btn-sm" style="color:#ffffff;border-color:rgba(255,255,255,0.7);background:rgba(255,255,255,0.15)" onclick="Router.navigate('volunteer')">
              ❤️ Volunteer Tracker
            </button>
            <button class="btn btn-outline btn-sm" style="color:#ffffff;border-color:rgba(255,184,0,0.85);background:rgba(255,184,0,0.2)" onclick="Router.navigate('leaderboard')">
              🏆 Leaderboard
            </button>
          </div>
        </div>
      </div>

      <!-- 2. Movement Impact Numbers Counter -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:var(--s-6)">
        <div class="card" style="padding:14px;border-radius:var(--r-lg);border:1px solid var(--border);background:#fff;text-align:center">
          <div style="font-size:1.4rem">👥</div>
          <div style="font-size:1.5rem;font-weight:900;color:#002D63;margin-top:2px">1,250+</div>
          <div style="font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase">Youth Members</div>
        </div>
        <div class="card" style="padding:14px;border-radius:var(--r-lg);border:1px solid var(--border);background:#fff;text-align:center">
          <div style="font-size:1.4rem">🚩</div>
          <div style="font-size:1.5rem;font-weight:900;color:#059669;margin-top:2px">35</div>
          <div style="font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase">Active Groups</div>
        </div>
        <div class="card" style="padding:14px;border-radius:var(--r-lg);border:1px solid var(--border);background:#fff;text-align:center">
          <div style="font-size:1.4rem">📅</div>
          <div style="font-size:1.5rem;font-weight:900;color:#2563EB;margin-top:2px">120+</div>
          <div style="font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase">Annual Gatherings</div>
        </div>
        <div class="card" style="padding:14px;border-radius:var(--r-lg);border:1px solid var(--border);background:#fff;text-align:center">
          <div style="font-size:1.4rem">❤️</div>
          <div style="font-size:1.5rem;font-weight:900;color:#D97706;margin-top:2px">8,520+</div>
          <div style="font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase">Service Hours</div>
        </div>
      </div>

      <!-- 3. Gamified Member Snapshot Card -->
      <div class="card" style="margin-bottom:var(--s-6);padding:18px;border-radius:var(--r-xl);background:#F8FAFC;border:1.5px solid #CBD5E1">
        <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px">
          <div>
            <div style="font-size:11px;font-weight:700;color:#64748B;text-transform:uppercase">Member Profile &bull; தனிப்பட்ட விவரம்</div>
            <h3 style="font-size:18px;font-weight:900;color:#002D63;margin-top:2px">
              Welcome, ${Utils.escapeHtml(user.name)}
            </h3>
            <div style="font-size:12px;color:#475569;margin-top:2px">
              Level: <strong style="color:#D97706">⭐⭐⭐⭐ (Active Youth Leader)</strong> &bull; Group: <strong>${user.group || 'Seniors'}</strong> &bull; ${user.team || 'Blue House'}
            </div>
          </div>

          <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap">
            <div style="text-align:center;background:#fff;padding:8px 14px;border-radius:10px;border:1px solid #E2E8F0">
              <div style="font-size:1.2rem;font-weight:900;color:#D97706">${userPoints}</div>
              <div style="font-size:10px;color:#64748B;text-transform:uppercase">Points</div>
            </div>
            <div style="text-align:center;background:#fff;padding:8px 14px;border-radius:10px;border:1px solid #E2E8F0">
              <div style="font-size:1.2rem;font-weight:900;color:#059669">${userHours} hrs</div>
              <div style="font-size:10px;color:#64748B;text-transform:uppercase">Volunteer</div>
            </div>
            <div style="text-align:center;background:#fff;padding:8px 14px;border-radius:10px;border:1px solid #E2E8F0">
              <div style="font-size:1.2rem;font-weight:900;color:#2563EB">92%</div>
              <div style="font-size:10px;color:#64748B;text-transform:uppercase">Attendance</div>
            </div>
            <button class="btn btn-sm btn-primary" onclick="Router.navigate('qr')">
              🪪 Pass
            </button>
          </div>
        </div>
      </div>

      <!-- 4. 4-House Official Championship Card (Classic Preserved) -->
      <div class="card" style="margin-bottom:var(--s-6);background:linear-gradient(135deg,#002D63 0%,#003F8A 100%);color:#fff;border:none">
        <div class="card-header" style="border-bottom:1px solid rgba(255,255,255,0.15)">
          <div style="display:flex;align-items:center;gap:var(--s-2)">
            <span style="font-size:1.4rem">🏆</span>
            <span style="font-size:var(--text-base);font-weight:700;color:#fff">4-House Official Points Championship</span>
          </div>
          <span style="font-size:var(--text-xs);color:rgba(255,255,255,0.7)">Live Accumulated House Scores</span>
        </div>
        <div class="card-body" id="team-scoreboard-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:var(--s-3)">
          <div class="loading-overlay" style="grid-column:1/-1;color:#fff"><div class="spinner-lg"></div></div>
        </div>
      </div>

      <!-- 5. 5-Pillar Ecosystem Navigation Grid -->
      <h3 style="font-size:16px;font-weight:800;color:var(--text-primary);margin-bottom:12px">
        🚀 Movement Ecosystem Modules (மன்றத்தின் 5 முக்கிய பிரிவுகள்)
      </h3>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;margin-bottom:var(--s-6)">
        <div class="card" style="padding:16px;border-radius:var(--r-lg);border:1px solid var(--border);cursor:pointer;transition:transform 0.15s ease" onclick="Router.navigate('events')">
          <div style="font-size:1.6rem;margin-bottom:6px">📅</div>
          <h4 style="font-size:14.5px;font-weight:800;color:#002D63">1. Events & Camps</h4>
          <div style="font-size:11.5px;color:#64748B;margin-top:2px">Retreats, Sports Day, Leadership Summits & QR Tickets</div>
        </div>

        <div class="card" style="padding:16px;border-radius:var(--r-lg);border:1px solid var(--border);cursor:pointer;transition:transform 0.15s ease" onclick="Router.navigate('formation')">
          <div style="font-size:1.6rem;margin-bottom:6px">📚</div>
          <h4 style="font-size:14.5px;font-weight:800;color:#7C3AED">2. Formation & Skills</h4>
          <div style="font-size:11.5px;color:#64748B;margin-top:2px">Spiritual, Leadership, Life Skills, and Careers</div>
        </div>

        <div class="card" style="padding:16px;border-radius:var(--r-lg);border:1px solid var(--border);cursor:pointer;transition:transform 0.15s ease" onclick="Router.navigate('volunteer')">
          <div style="font-size:1.6rem;margin-bottom:6px">❤️</div>
          <h4 style="font-size:14.5px;font-weight:800;color:#059669">3. Service & Volunteer</h4>
          <div style="font-size:11.5px;color:#64748B;margin-top:2px">Blood donation, tree planting, teaching & hour logging</div>
        </div>

        <div class="card" style="padding:16px;border-radius:var(--r-lg);border:1px solid var(--border);cursor:pointer;transition:transform 0.15s ease" onclick="Router.navigate('leaderboard')">
          <div style="font-size:1.6rem;margin-bottom:6px">🏆</div>
          <h4 style="font-size:14.5px;font-weight:800;color:#D97706">4. Recognition & Badges</h4>
          <div style="font-size:11.5px;color:#64748B;margin-top:2px">Group rankings, member points, and achievement badges</div>
        </div>
      </div>
    `;

    // Render Live House Scoreboard
    this._loadHouseScoreboard();
  },

  async _loadHouseScoreboard() {
    const grid = document.getElementById('team-scoreboard-grid');
    if (!grid) return;
    try {
      const stats = await API.getDashboardStats();
      const teams = [
        { name: 'Red Team', tamil: 'சிவப்பு இல்லம்', color: '#DC2626', icon: '🔴', pts: stats.teams?.Red || 1420 },
        { name: 'Blue Team', tamil: 'நீல இல்லம்', color: '#2563EB', icon: '🔵', pts: stats.teams?.Blue || 1380 },
        { name: 'Green Team', tamil: 'பச்சை இல்லம்', color: '#16A34A', icon: '🟢', pts: stats.teams?.Green || 1290 },
        { name: 'Yellow Team', tamil: 'மஞ்சள் இல்லம்', color: '#CA8A04', icon: '🟡', pts: stats.teams?.Yellow || 1240 }
      ];

      grid.innerHTML = teams.map(t => `
        <div style="background:rgba(255,255,255,0.1);padding:14px;border-radius:12px;border:1px solid rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:space-between">
          <div>
            <div style="font-size:14px;font-weight:800;color:#fff">${t.icon} ${t.name}</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.7)">${t.tamil}</div>
          </div>
          <div style="font-size:18px;font-weight:900;color:#FFD054">${t.pts} <span style="font-size:10px;color:rgba(255,255,255,0.7)">PTS</span></div>
        </div>
      `).join('');
    } catch(err) {
      grid.innerHTML = `<div style="grid-column:1/-1;font-size:12px;color:rgba(255,255,255,0.8)">House Points updated locally.</div>`;
    }
  },

  openThemeSelectorModal() {
    UI.openModal(`
      <div style="padding:10px;text-align:center">
        <h3 style="font-size:18px;font-weight:800;color:#002D63;margin-bottom:4px">🎨 Choose Movement Theme</h3>
        <div style="font-size:12px;color:#64748B;margin-bottom:16px">Customize Bosco Pulse visual atmosphere for your movement style.</div>

        <div style="display:flex;flex-direction:column;gap:10px;text-align:left">
          
          <!-- Theme 1: Modern Youth -->
          <div style="padding:12px;border:1.5px solid #2563EB;border-radius:12px;background:#EFF6FF;cursor:pointer" onclick="Dashboard.setEcosystemTheme('modern')">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <strong style="color:#1D4ED8">1. Modern Youth (நீலம் & ஊதா)</strong>
              <div style="display:flex;gap:4px">
                <span style="width:14px;height:14px;border-radius:50%;background:#2563EB"></span>
                <span style="width:14px;height:14px;border-radius:50%;background:#7C3AED"></span>
                <span style="width:14px;height:14px;border-radius:50%;background:#F97316"></span>
              </div>
            </div>
            <div style="font-size:11.5px;color:#4B5563;margin-top:4px">Gradients, glassmorphism, energetic for parish youth and students.</div>
          </div>

          <!-- Theme 2: Faith & Leadership -->
          <div style="padding:12px;border:1.5px solid #0F172A;border-radius:12px;background:#F8FAFC;cursor:pointer" onclick="Dashboard.setEcosystemTheme('faith')">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <strong style="color:#0F172A">2. Faith & Leadership (அடர்ந்த நீலம் & பொன்)</strong>
              <div style="display:flex;gap:4px">
                <span style="width:14px;height:14px;border-radius:50%;background:#0F172A"></span>
                <span style="width:14px;height:14px;border-radius:50%;background:#FBBF24"></span>
                <span style="width:14px;height:14px;border-radius:50%;background:#FFFFFF;border:1px solid #CBD5E1"></span>
              </div>
            </div>
            <div style="font-size:11.5px;color:#4B5563;margin-top:4px">Professional, spiritual, navy & gold Salesian leadership feel.</div>
          </div>

          <!-- Theme 3: Youth Festival Style (WYD) -->
          <div style="padding:12px;border:1.5px solid #F59E0B;border-radius:12px;background:#FFFBEB;cursor:pointer" onclick="Dashboard.setEcosystemTheme('festival')">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <strong style="color:#B45309">3. Youth Festival Style (World Youth Day)</strong>
              <div style="display:flex;gap:4px">
                <span style="width:14px;height:14px;border-radius:50%;background:#F59E0B"></span>
                <span style="width:14px;height:14px;border-radius:50%;background:#2563EB"></span>
                <span style="width:14px;height:14px;border-radius:50%;background:#EF4444"></span>
              </div>
            </div>
            <div style="font-size:11.5px;color:#78350F;margin-top:4px">Sunny orange, vibrant festival spirit, retreats, and camps.</div>
          </div>

        </div>

        <button class="btn btn-outline btn-full" style="margin-top:14px" onclick="UI.closeModal()">
          Close
        </button>
      </div>
    `);
  },

  setEcosystemTheme(themeKey) {
    localStorage.setItem('dbyc_ecosystem_theme', themeKey);
    const root = document.documentElement;
    if (themeKey === 'modern') {
      root.style.setProperty('--primary', '#2563EB');
      root.style.setProperty('--primary-dark', '#1D4ED8');
      root.style.setProperty('--accent', '#F97316');
      root.style.setProperty('--accent-dark', '#EA580C');
    } else if (themeKey === 'faith') {
      root.style.setProperty('--primary', '#0F172A');
      root.style.setProperty('--primary-dark', '#020617');
      root.style.setProperty('--accent', '#FBBF24');
      root.style.setProperty('--accent-dark', '#D97706');
    } else if (themeKey === 'festival') {
      root.style.setProperty('--primary', '#0056B3');
      root.style.setProperty('--primary-dark', '#003F8A');
      root.style.setProperty('--accent', '#FF9800');
      root.style.setProperty('--accent-dark', '#F57C00');
    }
    UI.closeModal();
    UI.toast('success', 'Theme Applied!', `Switched to ${themeKey.toUpperCase()} theme.`);
  }
};
