/* DBYC Utils - Helper functions, 4 Houses, 6 Groups, Founder Art, Web Audio Chime & Avatars */
const Utils = {
  GROUPS: [
    'Sub Juniors Group',
    'Juniors Group',
    'Seniors Group',
    'Inters Group',
    'Super Seniors Group',
    'Elders Group'
  ],

  HOUSES: [
    'Bosco House (Red)',
    'Savio House (Blue)',
    'Rinaldi House (Green)',
    'Rua House (Yellow)'
  ],

  // Backward compatibility alias for 4 Teams
  TEAMS: [
    'Bosco House (Red)',
    'Savio House (Blue)',
    'Rinaldi House (Green)',
    'Rua House (Yellow)'
  ],

  HOUSE_COLORS: {
    'Bosco House (Red)': '#DC2626',
    'Savio House (Blue)': '#2563EB',
    'Rinaldi House (Green)': '#16A34A',
    'Rua House (Yellow)': '#CA8A04',
    // Fallback aliases
    'Red Team': '#DC2626',
    'Blue Team': '#2563EB',
    'Green Team': '#16A34A',
    'Yellow Team': '#CA8A04'
  },

  HOUSE_CLASS: {
    'Bosco House (Red)': 'team-red',
    'Savio House (Blue)': 'team-blue',
    'Rinaldi House (Green)': 'team-green',
    'Rua House (Yellow)': 'team-yellow',
    'Red Team': 'team-red',
    'Blue Team': 'team-blue',
    'Green Team': 'team-green',
    'Yellow Team': 'team-yellow'
  },

  GROUP_COLORS: {
    'Sub Juniors Group': '#F43F5E',
    'Juniors Group': '#8B5CF6',
    'Seniors Group': '#3B82F6',
    'Inters Group': '#10B981',
    'Super Seniors Group': '#F59E0B',
    'Elders Group': '#EF4444',
    // Fallback aliases
    'Sub Juniors': '#F43F5E',
    'Juniors': '#8B5CF6',
    'Seniors': '#3B82F6',
    'Inters': '#10B981',
    'Super Seniors': '#F59E0B',
    'Elders': '#EF4444'
  },

  GROUP_CLASS: {
    'Sub Juniors Group': 'sub-juniors',
    'Juniors Group': 'juniors',
    'Seniors Group': 'seniors',
    'Inters Group': 'inters',
    'Super Seniors Group': 'super-seniors',
    'Elders Group': 'elders',
    'Sub Juniors': 'sub-juniors',
    'Juniors': 'juniors',
    'Seniors': 'seniors',
    'Inters': 'inters',
    'Super Seniors': 'super-seniors',
    'Elders': 'elders'
  },

  getLogoSrc() {
    return (typeof DBYC_LOGO_DATA !== 'undefined' && DBYC_LOGO_DATA) ? DBYC_LOGO_DATA : './assets/dbyc-logo.jpg';
  },

  // High-Resolution Vector Artwork for Founder St. John Bosco
  getFounderImageSrc() {
    if (typeof DBYC_FOUNDER_DATA !== 'undefined' && DBYC_FOUNDER_DATA) {
      return DBYC_FOUNDER_DATA;
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
      <defs>
        <radialGradient id="halo" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stop-color="#FFE885" />
          <stop offset="70%" stop-color="#FFC107" />
          <stop offset="100%" stop-color="#B45309" />
        </radialGradient>
        <linearGradient id="cassock" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1E293B" />
          <stop offset="100%" stop-color="#0F172A" />
        </linearGradient>
      </defs>
      <!-- Background Circle -->
      <circle cx="100" cy="100" r="98" fill="#F8FAFC" stroke="#003F8A" stroke-width="4"/>
      <!-- Holy Halo -->
      <circle cx="100" cy="85" r="62" fill="url(#halo)" opacity="0.35"/>
      <!-- Cassock Shoulders -->
      <path d="M 35 195 Q 50 135 100 135 Q 150 135 165 195 Z" fill="url(#cassock)"/>
      <!-- Roman Collar -->
      <rect x="88" y="132" width="24" height="12" fill="#FFFFFF" rx="2"/>
      <path d="M 75 132 L 88 132 L 88 144 L 75 144 Z" fill="#0F172A"/>
      <path d="M 112 132 L 125 132 L 125 144 L 112 144 Z" fill="#0F172A"/>
      <!-- Neck -->
      <rect x="86" y="105" width="28" height="30" fill="#FDDCB5" rx="4"/>
      <!-- Face -->
      <ellipse cx="100" cy="85" rx="36" ry="42" fill="#FDDCB5"/>
      <!-- Ears -->
      <ellipse cx="63" cy="86" rx="6" ry="10" fill="#F8BA88"/>
      <ellipse cx="137" cy="86" rx="6" ry="10" fill="#F8BA88"/>
      <!-- Hair - Classic Don Bosco Wavy Locks -->
      <path d="M 64 75 Q 60 48 100 48 Q 140 48 136 75 Q 130 55 100 56 Q 70 55 64 75 Z" fill="#3E2723"/>
      <!-- Eyes & Gentle Smile -->
      <ellipse cx="86" cy="80" rx="3.5" ry="2" fill="#2E1B15"/>
      <ellipse cx="114" cy="80" rx="3.5" ry="2" fill="#2E1B15"/>
      <path d="M 80 74 Q 86 71 92 74" stroke="#3E2723" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M 108 74 Q 114 71 120 74" stroke="#3E2723" stroke-width="2" fill="none" stroke-linecap="round"/>
      <!-- Nose -->
      <path d="M 100 78 L 98 90 L 104 90" stroke="#D97706" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <!-- Kind Smile -->
      <path d="M 90 98 Q 100 106 110 98" stroke="#9A3412" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <!-- Cheerful Cheek blush -->
      <circle cx="78" cy="90" r="6" fill="#F43F5E" opacity="0.2"/>
      <circle cx="122" cy="90" r="6" fill="#F43F5E" opacity="0.2"/>
      <!-- Biretta / Traditional Cap Outline -->
      <path d="M 72 54 Q 100 38 128 54 Q 100 45 72 54 Z" fill="#1E293B"/>
      <!-- Gold Rim Text Label -->
      <path id="textPath" d="M 25 100 A 75 75 0 0 0 175 100" fill="none"/>
      <text font-family="Poppins, Arial, sans-serif" font-size="10" font-weight="700" fill="#003F8A">
        <textPath href="#textPath" startOffset="50%" text-anchor="middle">ST. JOHN BOSCO &bull; FOUNDER</textPath>
      </text>
    </svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  },

  // Instant Web Audio API Chime (0 Budget, zero external audio asset required)
  playBeep(success = true) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (success) {
        // Uplifting two-tone major chime (587Hz D5 -> 880Hz A5)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

        osc1.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 0.35);
      } else {
        // Warning low tone (220Hz -> 180Hz)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(180, ctx.currentTime + 0.25);

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch (e) {
      // Audio autoplay policy fallback
    }
  },

  formatDate(d) {
    if (!d) return '-';
    const dt = new Date(d);
    return isNaN(dt) ? d : dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  },

  formatTime(t) {
    if (!t) return '-';
    const parts = t.split(':');
    if (parts.length < 2) return t;
    const h = parseInt(parts[0]);
    const m = parts[1];
    return (h % 12 || 12) + ':' + m + ' ' + (h < 12 ? 'AM' : 'PM');
  },

  membershipDuration(joinDate) {
    if (!joinDate) return 'New Member';
    const start = new Date(joinDate);
    if (isNaN(start)) return 'Active Member';
    const ms = Math.max(0, Date.now() - start.getTime());
    const years = Math.floor(ms / (365.25 * 24 * 3600 * 1000));
    const months = Math.floor((ms % (365.25 * 24 * 3600 * 1000)) / (30.44 * 24 * 3600 * 1000));

    if (years > 0 && months > 0) return `${years} yr${years > 1 ? 's' : ''} ${months} mo${months > 1 ? 's' : ''}`;
    if (years > 0) return `${years} yr${years > 1 ? 's' : ''}`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''}`;
    return 'First Month in DBYC';
  },

  initials(name) {
    if (!name) return 'DB';
    return name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase();
  },

  houseBadge(houseOrTeam) {
    const h = houseOrTeam || 'Bosco House (Red)';
    const cls = Utils.HOUSE_CLASS[h] || 'team-red';
    let icon = '🔴';
    if (h.includes('Blue') || h.includes('Savio')) icon = '🔵';
    if (h.includes('Green') || h.includes('Rinaldi')) icon = '🟢';
    if (h.includes('Yellow') || h.includes('Rua')) icon = '🟡';
    return `<span class="badge badge-${cls}">${icon} ${h}</span>`;
  },

  // Backward compatibility alias
  teamBadge(team) {
    return Utils.houseBadge(team);
  },

  groupBadge(group) {
    const g = group || 'Seniors Group';
    const cls = Utils.GROUP_CLASS[g] || 'seniors';
    return `<span class="badge badge-${cls}">${g}</span>`;
  },

  verificationBadge(status) {
    const s = status || 'Pending Verification';
    if (s === 'Qualified' || s === 'Verified') {
      return `<span class="badge badge-qualified">🛡️ Qualified</span>`;
    }
    if (s === 'Rejected') {
      return `<span class="badge badge-rejected">❌ Rejected</span>`;
    }
    return `<span class="badge badge-pending">⏳ Pending Verification</span>`;
  },

  pointsBadge(pts) {
    const val = Number(pts) || 0;
    return `<span class="points-chip">⭐ ${val} pts</span>`;
  },

  roleBadge(role) {
    const labels = {
      director: 'Fr. Director (Incharge)',
      asst_director: 'Fr. Asst. Director (Direct Incharge)',
      leader: 'Group Leader',
      incharge: 'Group Incharge',
      member: 'Youth Member'
    };
    return `<span class="badge badge-primary">${labels[role] || role}</span>`;
  },

  statusBadge(status) {
    const map = { Active: 'success', Inactive: 'warning', Deleted: 'danger' };
    return `<span class="badge badge-${map[status] || 'info'}">${status}</span>`;
  },

  // Generates clean SVG avatar Data URL
  defaultAvatarSvg(name, gender = 'Male') {
    const bg = gender === 'Female' ? '#EC4899' : '#003F8A';
    const init = Utils.initials(name);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="50" fill="${bg}"/>
      <text x="50" y="58" font-family="Poppins, Arial, sans-serif" font-size="36" font-weight="700" fill="#ffffff" text-anchor="middle">${init}</text>
    </svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  },

  avatarHtml(member, large = false) {
    const cls = large ? 'member-avatar large' : 'member-avatar';
    const photo = (member && (member.PhotoURL || member.PhotoBase64))
      ? (member.PhotoURL || member.PhotoBase64)
      : Utils.defaultAvatarSvg(member ? member.FullName : 'DBYC', member ? member.Gender : 'Male');
    return `<div class="${cls}"><img src="${photo}" alt="${Utils.escapeHtml(member ? member.FullName : '')}"></div>`;
  },

  compressImage(file, maxWidth = 400, maxHeight = 400, quality = 0.85) {
    return new Promise((resolve, reject) => {
      if (!file) { resolve(''); return; }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let w = img.width;
          let h = img.height;
          if (w > h) {
            if (w > maxWidth) {
              h = Math.round((h * maxWidth) / w);
              w = maxWidth;
            }
          } else {
            if (h > maxHeight) {
              w = Math.round((w * maxHeight) / h);
              h = maxHeight;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  },

  escapeHtml(str) {
    if (!str) return '';
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  },

  debounce(fn, ms = 300) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  },

  generateCSV(headers, rows) {
    const lines = [headers.join(',')];
    rows.forEach(r => lines.push(r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')));
    return lines.join('\n');
  },

  downloadCSV(filename, csv) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
