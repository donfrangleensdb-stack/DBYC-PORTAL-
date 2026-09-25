/* Bosco Pulse: Events & Camps Module */
const EventsModule = {
  _events: [
    {
      id: 'EVT-01',
      title: 'Annual Salesian Youth Retreat 2026',
      tamilTitle: 'இளைஞர் ஆன்மீக தியான முகாம்',
      category: 'Spiritual',
      categoryColor: '#7C3AED',
      date: '2026-10-10',
      time: '08:30 AM - 05:00 PM',
      venue: 'Don Bosco Shrine & Oratory Hall',
      points: 40,
      hours: 8,
      status: 'Upcoming',
      desc: 'Three days of transformative prayer, contemplation, fellowship, and personal spiritual formation with Salesian youth animators.',
      registered: false,
      capacity: 250,
      joinedCount: 184
    },
    {
      id: 'EVT-02',
      title: 'Inter-House Sports Olympiad',
      tamilTitle: 'இல்லங்களுக்கு இடையேயான விளையாட்டுப் போட்டிகள்',
      category: 'Sports',
      categoryColor: '#2563EB',
      date: '2026-10-24',
      time: '07:00 AM - 04:30 PM',
      venue: 'DBYC Basin Bridge Main Grounds',
      points: 30,
      hours: 6,
      status: 'Upcoming',
      desc: 'Football, Volleyball, 100m sprint, and Tug of War tournaments across all 4 Houses for the Don Bosco Championship Shield.',
      registered: true,
      capacity: 400,
      joinedCount: 312
    },
    {
      id: 'EVT-03',
      title: 'Don Bosco Youth Leadership Summit',
      tamilTitle: 'இளைஞர் தலைமைத்துவ பயிற்சி அரங்கம்',
      category: 'Leadership',
      categoryColor: '#F59E0B',
      date: '2026-11-05',
      time: '09:00 AM - 02:00 PM',
      venue: 'Youth Center Audio-Visual Hall',
      points: 35,
      hours: 5,
      status: 'Upcoming',
      desc: 'Intensive workshop on Public Speaking, Group Dynamics, Event Organizing, and Preventive System mentorship skills.',
      registered: false,
      capacity: 120,
      joinedCount: 88
    },
    {
      id: 'EVT-04',
      title: 'Green Earth Tree Plantation Mission',
      tamilTitle: 'பசுமை பூமி மரக்கன்று நடும் திட்டம்',
      category: 'Service',
      categoryColor: '#10B981',
      date: '2026-11-18',
      time: '06:30 AM - 11:30 AM',
      venue: 'Basin Bridge Community Belt',
      points: 25,
      hours: 5,
      status: 'Upcoming',
      desc: 'Planting 500 saplings across neighborhood parks and public schools with local municipal and eco-youth leaders.',
      registered: false,
      capacity: 150,
      joinedCount: 110
    }
  ],

  render(container) {
    this._loadRegisteredState();
    const nextEvent = this._events[0];
    
    container.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <div class="page-title">📅 Events, Camps & Retreats (நிகழ்வுகள் & முகாம்கள்)</div>
          <div class="page-subtitle">Learn &bull; Lead &bull; Serve &bull; Grow through Salesian Youth Gatherings</div>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary btn-sm" onclick="EventsModule.openRegisterModal()">+ Propose New Event</button>
        </div>
      </div>

      <!-- Live Event Countdown Hero -->
      <div class="card" style="margin-bottom:var(--s-6);background:linear-gradient(135deg,#002D63 0%,#003F8A 55%,#1D4ED8 100%);color:#fff;border:none;border-radius:var(--r-xl);padding:24px;position:relative;overflow:hidden">
        <div style="position:absolute;right:-20px;bottom:-20px;font-size:120px;opacity:0.08;pointer-events:none">⛺</div>
        <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px;position:relative;z-index:2">
          <div style="max-width:540px">
            <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,184,0,0.25);border:1px solid rgba(255,184,0,0.6);padding:3px 12px;border-radius:20px;font-size:11px;font-weight:700;color:#FFD054;margin-bottom:8px">
              🔥 NEXT FLAGSHIP EVENT COUNTDOWN
            </div>
            <h2 style="font-size:1.45rem;font-weight:800;line-height:1.25;color:#fff">${nextEvent.title}</h2>
            <div style="font-size:12px;color:rgba(255,255,255,0.85);margin-top:4px">
              📍 ${nextEvent.venue} &bull; 🗓️ ${new Date(nextEvent.date).toLocaleDateString('en-IN', {weekday:'short', day:'numeric', month:'short', year:'numeric'})}
            </div>
          </div>
          
          <div style="display:flex;gap:10px;text-align:center" id="event-timer-block">
            <div style="background:rgba(255,255,255,0.12);padding:10px 14px;border-radius:12px;border:1px solid rgba(255,255,255,0.2)">
              <div style="font-size:1.6rem;font-weight:900;color:#FFD054" id="timer-days">14</div>
              <div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,0.8)">Days</div>
            </div>
            <div style="background:rgba(255,255,255,0.12);padding:10px 14px;border-radius:12px;border:1px solid rgba(255,255,255,0.2)">
              <div style="font-size:1.6rem;font-weight:900;color:#fff" id="timer-hrs">18</div>
              <div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,0.8)">Hours</div>
            </div>
            <div style="background:rgba(255,255,255,0.12);padding:10px 14px;border-radius:12px;border:1px solid rgba(255,255,255,0.2)">
              <div style="font-size:1.6rem;font-weight:900;color:#fff" id="timer-min">42</div>
              <div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,0.8)">Mins</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Events Category Filter -->
      <div style="display:flex;gap:8px;margin-bottom:var(--s-4);overflow-x:auto;padding-bottom:4px">
        <button class="btn btn-sm btn-primary" onclick="EventsModule.filterCategory('all', this)">🌟 All Events</button>
        <button class="btn btn-sm btn-outline" onclick="EventsModule.filterCategory('Spiritual', this)">🕊️ Spiritual & Retreats</button>
        <button class="btn btn-sm btn-outline" onclick="EventsModule.filterCategory('Sports', this)">⚽ Sports & Games</button>
        <button class="btn btn-sm btn-outline" onclick="EventsModule.filterCategory('Leadership', this)">⚡ Leadership</button>
        <button class="btn btn-sm btn-outline" onclick="EventsModule.filterCategory('Service', this)">❤️ Social Service</button>
      </div>

      <!-- Events List Grid -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:var(--s-4)" id="events-card-grid">
        ${this._events.map(ev => this._buildEventCard(ev)).join('')}
      </div>
    `;

    this._startCountdown(nextEvent.date);
  },

  _buildEventCard(ev) {
    const isJoined = ev.registered;
    return `
      <div class="card event-item-card" data-cat="${ev.category}" style="display:flex;flex-direction:column;justify-content:space-between;border-radius:var(--r-lg);box-shadow:var(--shadow-sm);border:1px solid var(--border)">
        <div style="padding:16px">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
            <span style="background:${ev.categoryColor};color:#fff;font-size:10.5px;font-weight:700;padding:3px 10px;border-radius:12px;letter-spacing:0.5px">
              ${ev.category.toUpperCase()}
            </span>
            <div style="display:flex;align-items:center;gap:4px;color:#D97706;font-size:12px;font-weight:800;background:#FEF3C7;padding:2px 8px;border-radius:10px">
              <span>⭐</span> <span>+${ev.points} PTS</span>
            </div>
          </div>
          
          <h3 style="font-size:16px;font-weight:800;color:var(--text-primary);line-height:1.3;margin-bottom:3px">
            ${ev.title}
          </h3>
          <div style="font-size:12px;font-weight:600;color:#64748B;margin-bottom:8px">
            ${ev.tamilTitle}
          </div>
          <p style="font-size:12px;color:var(--text-secondary);line-height:1.45;margin-bottom:12px">
            ${ev.desc}
          </p>

          <div style="font-size:11.5px;color:#475569;background:#F8FAFC;padding:8px 10px;border-radius:8px;border:1px solid #E2E8F0;display:flex;flex-direction:column;gap:4px">
            <div>🗓️ <strong>Date:</strong> ${ev.date} (${ev.time})</div>
            <div>📍 <strong>Venue:</strong> ${ev.venue}</div>
            <div>⏱️ <strong>Credits:</strong> ${ev.hours} Volunteer Service Hours</div>
          </div>
        </div>

        <div style="padding:12px 16px;border-top:1px solid var(--border);background:var(--bg);display:flex;align-items:center;justify-content:space-between;gap:8px">
          <div style="font-size:11px;color:#64748B">
            <strong>${ev.joinedCount}</strong> / ${ev.capacity} Registered
          </div>
          
          <div style="display:flex;gap:6px">
            ${isJoined ? `
              <button class="btn btn-sm btn-outline" style="color:#059669;border-color:#10B981;background:#ECFDF5" onclick="EventsModule.viewTicket('${ev.id}')">
                ✅ QR Ticket
              </button>
            ` : `
              <button class="btn btn-sm btn-primary" onclick="EventsModule.toggleRegister('${ev.id}')">
                Register (பதிவு செய்க)
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  },

  toggleRegister(id) {
    const ev = this._events.find(e => e.id === id);
    if (!ev) return;
    ev.registered = !ev.registered;
    if (ev.registered) {
      ev.joinedCount++;
      UI.toast('success', 'Event Registration Confirmed!', `You have secured your spot for ${ev.title}. +${ev.points} Points will be awarded upon entry.`);
      LeaderboardModule.addPoints(ev.points, `Registered for ${ev.title}`);
    } else {
      ev.joinedCount--;
      UI.toast('info', 'Registration Cancelled', `You withdrew from ${ev.title}.`);
    }
    this._saveRegisteredState();
    const container = document.getElementById('view-container');
    if (container) this.render(container);
  },

  viewTicket(id) {
    const ev = this._events.find(e => e.id === id);
    if (!ev) return;
    const user = Auth.getUser();
    UI.openModal(`
      <div style="text-align:center;padding:10px">
        <div style="display:inline-block;padding:4px 14px;border-radius:20px;background:#ECFDF5;color:#047857;font-weight:700;font-size:11px;margin-bottom:8px">
          OFFICIAL EVENT ENTRY PASS
        </div>
        <h3 style="font-size:18px;font-weight:800;color:#002D63;margin-bottom:4px">${ev.title}</h3>
        <div style="font-size:12px;color:#64748B;margin-bottom:12px">${ev.venue} &bull; ${ev.date}</div>
        
        <div id="event-ticket-qr" style="display:flex;justify-content:center;margin:14px auto"></div>

        <div style="background:#F1F5F9;padding:10px 14px;border-radius:10px;font-size:12px;text-align:left;margin-top:10px">
          <div><strong>Attendee:</strong> ${Utils.escapeHtml(user.name)}</div>
          <div><strong>Pass ID:</strong> DBYC-${ev.id}-${user.id || 'YOUTH'}</div>
          <div><strong>Award:</strong> +${ev.points} Leadership Points &bull; ${ev.hours} Service Hours</div>
        </div>

        <button class="btn btn-primary btn-full" style="margin-top:14px" onclick="UI.closeModal()">
          Done
        </button>
      </div>
    `);

    setTimeout(() => {
      const qrEl = document.getElementById('event-ticket-qr');
      if (qrEl && typeof QRCode !== 'undefined') {
        new QRCode(qrEl, {
          text: `DBYC-EVENT:${ev.id}:${user.id || 'MEM'}:${Date.now()}`,
          width: 140,
          height: 140
        });
      }
    }, 100);
  },

  filterCategory(cat, btn) {
    document.querySelectorAll('#view-container .page-header + div + div button').forEach(b => {
      b.className = 'btn btn-sm btn-outline';
    });
    btn.className = 'btn btn-sm btn-primary';

    const cards = document.querySelectorAll('.event-item-card');
    cards.forEach(card => {
      if (cat === 'all' || card.getAttribute('data-cat') === cat) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  },

  _startCountdown(dateStr) {
    const target = new Date(dateStr).getTime();
    const update = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      const dEl = document.getElementById('timer-days');
      const hEl = document.getElementById('timer-hrs');
      const mEl = document.getElementById('timer-min');
      if (dEl) dEl.innerText = days;
      if (hEl) hEl.innerText = hours;
      if (mEl) mEl.innerText = mins;
    };
    update();
    setInterval(update, 60000);
  },

  _saveRegisteredState() {
    const state = this._events.map(e => ({ id: e.id, reg: e.registered, count: e.joinedCount }));
    localStorage.setItem('dbyc_events_state', JSON.stringify(state));
  },

  _loadRegisteredState() {
    const raw = localStorage.getItem('dbyc_events_state');
    if (!raw) return;
    try {
      const saved = JSON.parse(raw);
      saved.forEach(s => {
        const ev = this._events.find(e => e.id === s.id);
        if (ev) {
          ev.registered = s.reg;
          ev.joinedCount = s.count;
        }
      });
    } catch(e) {}
  }
};
