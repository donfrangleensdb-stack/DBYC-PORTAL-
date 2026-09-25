/* Bosco Pulse: Formation & Learning Tracks Module */
const FormationModule = {
  _tracks: [
    {
      id: 'TRK-01',
      title: 'Spiritual Formation & Salesian Identity',
      tamilTitle: 'ஆன்மீக உருவாக்கம் & தொன்போஸ்கோ நெறி',
      icon: '🕊️',
      color: '#7C3AED',
      modules: [
        { id: 'M-01', title: 'The Preventive System: Reason, Religion & Loving-Kindness', points: 25, completed: true, readTime: '6 min read' },
        { id: 'M-02', title: 'Living the Salesian Joy: St. Dominic Savio Way', points: 20, completed: true, readTime: '5 min read' },
        { id: 'M-03', title: 'Daily Prayer, Examen & Inner Peace for Youth', points: 15, completed: false, readTime: '4 min read' }
      ]
    },
    {
      id: 'TRK-02',
      title: 'Youth Leadership & Team Dynamics',
      tamilTitle: 'இளைஞர் தலைமைத்துவம் & குழு மேலாண்மை',
      icon: '⚡',
      color: '#2563EB',
      modules: [
        { id: 'M-04', title: 'Confident Public Speaking & Youth Animation', points: 30, completed: true, readTime: '7 min read' },
        { id: 'M-05', title: 'Resolving Conflicts & Building Group Unity', points: 25, completed: false, readTime: '5 min read' },
        { id: 'M-06', title: 'How to Organize Parish Youth Events & Rallies', points: 30, completed: false, readTime: '8 min read' }
      ]
    },
    {
      id: 'TRK-03',
      title: 'Life Skills & Emotional Resilience',
      tamilTitle: 'வாழ்க்கைத் திறன்கள் & மனவலிமை',
      icon: '🌱',
      color: '#10B981',
      modules: [
        { id: 'M-07', title: 'Mastering Time, Overcoming Procrastination & Phone Addiction', points: 20, completed: false, readTime: '6 min read' },
        { id: 'M-08', title: 'Smart Financial Literacy & Savings for Young Adults', points: 25, completed: false, readTime: '7 min read' },
        { id: 'M-09', title: 'Healthy Boundaries, Mental Health & Peer Support', points: 20, completed: false, readTime: '5 min read' }
      ]
    },
    {
      id: 'TRK-04',
      title: 'Career Guidance & Digital Skills',
      tamilTitle: 'தொழில் வழிகாட்டல் & டிஜிட்டல் திறன்',
      icon: '💼',
      color: '#F59E0B',
      modules: [
        { id: 'M-10', title: 'Crafting a Winning Modern Resume & LinkedIn Presence', points: 25, completed: false, readTime: '6 min read' },
        { id: 'M-11', title: 'Essential AI & Digital Tools for Modern Work', points: 30, completed: false, readTime: '8 min read' },
        { id: 'M-12', title: 'Ace Your First Job Interview: Mock Questions & Ethics', points: 25, completed: false, readTime: '7 min read' }
      ]
    },
    {
      id: 'TRK-05',
      title: 'Social Awareness & Civic Action',
      tamilTitle: 'சமூக விழிப்புணர்வு & தொண்டு நெறி',
      icon: '🌍',
      color: '#EF4444',
      modules: [
        { id: 'M-13', title: 'Environmental Stewardship & Clean Earth Initiatives', points: 20, completed: false, readTime: '5 min read' },
        { id: 'M-14', title: 'Youth Rights, Constitutional Duties & Community Action', points: 25, completed: false, readTime: '6 min read' }
      ]
    }
  ],

  render(container) {
    this._loadProgress();
    const totalModules = this._tracks.reduce((acc, t) => acc + t.modules.length, 0);
    const completedCount = this._tracks.reduce((acc, t) => acc + t.modules.filter(m => m.completed).length, 0);
    const overallPct = Math.round((completedCount / totalModules) * 100);

    container.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <div class="page-title">📚 Formation & Learning Hub (பயிற்சி & உருவாக்கம்)</div>
          <div class="page-subtitle">Nurturing Mind, Soul, and Skills &bull; Salesian Preventive System</div>
        </div>
      </div>

      <!-- Formation Overview Banner -->
      <div class="card" style="margin-bottom:var(--s-6);background:linear-gradient(135deg,#1E293B 0%,#0F172A 100%);color:#fff;border-radius:var(--r-xl);padding:22px;border:none">
        <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px">
          <div>
            <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(251,191,36,0.2);color:#FBBF24;font-size:11px;font-weight:700;padding:3px 12px;border-radius:20px;margin-bottom:8px">
              🎓 CERTIFIED SALESIAN YOUTH FORMATION
            </div>
            <h2 style="font-size:1.4rem;font-weight:800;color:#fff">My Formation Progress: ${overallPct}% Complete</h2>
            <div style="font-size:12px;color:#94A3B8;margin-top:2px">
              ${completedCount} of ${totalModules} learning modules finished &bull; Keep going to unlock the 🏆 Scholar Badge!
            </div>
          </div>

          <div style="width:200px">
            <div style="background:rgba(255,255,255,0.15);height:10px;border-radius:10px;overflow:hidden">
              <div style="background:linear-gradient(90deg,#F59E0B,#10B981);height:100%;width:${overallPct}%"></div>
            </div>
            <div style="font-size:11px;color:#CBD5E1;text-align:right;margin-top:4px;font-weight:700">${completedCount}/${totalModules} Finished</div>
          </div>
        </div>
      </div>

      <!-- Learning Tracks Container -->
      <div style="display:flex;flex-direction:column;gap:var(--s-5)">
        ${this._tracks.map(trk => this._buildTrackCard(trk)).join('')}
      </div>
    `;
  },

  _buildTrackCard(trk) {
    const finished = trk.modules.filter(m => m.completed).length;
    const total = trk.modules.length;
    const pct = Math.round((finished / total) * 100);

    return `
      <div class="card" style="border-radius:var(--r-lg);border:1px solid var(--border);box-shadow:var(--shadow-xs);overflow:hidden">
        <div class="card-header" style="background:#F8FAFC;border-bottom:1px solid var(--border);padding:14px 18px">
          <div style="display:flex;align-items:center;gap:12px">
            <span style="font-size:1.6rem">${trk.icon}</span>
            <div>
              <div style="font-size:15px;font-weight:800;color:var(--text-primary)">${trk.title}</div>
              <div style="font-size:11.5px;font-weight:600;color:#64748B">${trk.tamilTitle}</div>
            </div>
          </div>
          <span style="background:${pct === 100 ? '#DCFCE7' : '#F1F5F9'};color:${pct === 100 ? '#047857' : '#475569'};font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px">
            ${finished}/${total} Done (${pct}%)
          </span>
        </div>

        <div style="padding:14px 18px;display:flex;flex-direction:column;gap:10px">
          ${trk.modules.map(mod => `
            <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 12px;background:${mod.completed ? '#F0FDF4' : '#FFFFFF'};border:1px solid ${mod.completed ? '#BBF7D0' : '#E2E8F0'};border-radius:10px;transition:all 0.2s ease">
              <div style="display:flex;align-items:center;gap:10px;min-width:0;flex:1">
                <span style="font-size:1.15rem">${mod.completed ? '✅' : '📖'}</span>
                <div style="min-width:0">
                  <div style="font-size:13px;font-weight:700;color:${mod.completed ? '#065F46' : 'var(--text-primary)'};line-height:1.3">
                    ${mod.title}
                  </div>
                  <div style="font-size:11px;color:#64748B;margin-top:2px">
                    ⏱️ ${mod.readTime} &bull; Awards <strong>+${mod.points} PTS</strong>
                  </div>
                </div>
              </div>

              <div>
                ${mod.completed ? `
                  <button class="btn btn-sm btn-ghost" style="color:#047857;font-weight:700;border:1px solid #86EFAC" onclick="FormationModule.openModuleModal('${mod.id}', '${trk.id}')">
                    Review
                  </button>
                ` : `
                  <button class="btn btn-sm btn-primary" onclick="FormationModule.openModuleModal('${mod.id}', '${trk.id}')">
                    Start (+${mod.points}P)
                  </button>
                `}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  openModuleModal(modId, trkId) {
    const trk = this._tracks.find(t => t.id === trkId);
    if (!trk) return;
    const mod = trk.modules.find(m => m.id === modId);
    if (!mod) return;

    UI.openModal(`
      <div style="padding:8px">
        <div style="display:inline-flex;align-items:center;gap:6px;background:${trk.color}15;color:${trk.color};padding:3px 12px;border-radius:20px;font-size:11px;font-weight:800;margin-bottom:8px">
          ${trk.icon} ${trk.title.toUpperCase()}
        </div>
        <h3 style="font-size:17px;font-weight:800;color:#002D63;line-height:1.3;margin-bottom:6px">${mod.title}</h3>
        <div style="font-size:11.5px;color:#64748B;margin-bottom:14px">⏱️ ${mod.readTime} &bull; Completion Award: +${mod.points} Leadership Points</div>

        <div style="background:#F8FAFC;padding:14px;border-radius:10px;font-size:13px;color:#334155;line-height:1.6;border:1px solid #E2E8F0;max-height:280px;overflow-y:auto;text-align:left">
          <p><strong>Core Principle:</strong></p>
          <p style="margin-top:4px">St. John Bosco always placed the active accompaniment of young people at the center of youth formation. A true Salesian leader doesn't command from above, but walks alongside peers with cheerful presence, understanding, and love.</p>
          <br>
          <p><strong>Action Checklist for Youth:</strong></p>
          <ul style="padding-left:20px;margin-top:4px">
            <li>Reflect on your daily speech and attitude with peers.</li>
            <li>Take initiative in one group task this weekend.</li>
            <li>Commit to 15 minutes of silent reflection or prayer daily.</li>
          </ul>
        </div>

        <div style="margin-top:16px;display:flex;gap:10px">
          ${!mod.completed ? `
            <button class="btn btn-primary btn-full" onclick="FormationModule.completeModule('${mod.id}')">
              Mark Complete & Claim +${mod.points} PTS ⭐
            </button>
          ` : `
            <button class="btn btn-outline btn-full" onclick="UI.closeModal()">
              Close (Already Completed ✅)
            </button>
          `}
        </div>
      </div>
    `);
  },

  completeModule(modId) {
    for (const trk of this._tracks) {
      const mod = trk.modules.find(m => m.id === modId);
      if (mod) {
        mod.completed = true;
        UI.toast('success', 'Module Completed!', `Congratulations! You finished "${mod.title}" and earned +${mod.points} Points!`);
        LeaderboardModule.addPoints(mod.points, `Completed ${mod.title}`);
        this._saveProgress();
        break;
      }
    }
    UI.closeModal();
    const container = document.getElementById('view-container');
    if (container) this.render(container);
  },

  _saveProgress() {
    const completedIds = [];
    this._tracks.forEach(t => t.modules.forEach(m => {
      if (m.completed) completedIds.push(m.id);
    }));
    localStorage.setItem('dbyc_formation_progress', JSON.stringify(completedIds));
  },

  _loadProgress() {
    const raw = localStorage.getItem('dbyc_formation_progress');
    if (!raw) return;
    try {
      const ids = JSON.parse(raw);
      this._tracks.forEach(t => t.modules.forEach(m => {
        if (ids.includes(m.id)) m.completed = true;
      }));
    } catch(e) {}
  }
};
