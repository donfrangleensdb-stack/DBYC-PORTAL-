# 🏛️ DBYC PORTAL — Complete File Plan & Reference
**Don Bosco Youth Centre (DBYC) — Bosco Pulse Youth Movement System**
*Last Updated: 2026-09-26 | Chennai - 12 | Basin Bridge*

---

## 📁 Workspace Location
```
C:\Users\acer\.gemini\antigravity\scratch\dbyc-app\frontend\
```

## 🖥️ Desktop Copies
```
C:\Users\acer\Desktop\index.html
C:\Users\acer\Desktop\sw.js
C:\Users\acer\Desktop\ai-doctor.js
C:\Users\acer\Desktop\dashboard.js
C:\Users\acer\Desktop\New folder\  (same files)
```

## 🌐 Live GitHub Pages URL
```
https://donfrangleensdb-stack.github.io/DBYC-PORTAL-/
```
**GitHub Upload Link:**
```
https://github.com/donfrangleensdb-stack/DBYC-PORTAL-/upload/main
```

---

## 📄 FILE 1: index.html (2708 lines, ~82 KB)

### 🎨 CSS Variables (`:root`) — Lines 23–93
| Variable | Value |
|---|---|
| `--primary` | `#003F8A` (Royal Navy Blue) |
| `--accent` | `#FFB800` (Salesian Gold) |
| `--bg` | `#F4F6FB` |
| `--surface` | `#FFFFFF` |
| `--text-primary` | `#0E1B35` |

### 🖼️ Login Screen Background — Lines 1823–1849
- Royal Blue gradient overlay on Don Bosco walk photo
- Radial gold glow at bottom-left
- Radial sky-blue glow at top-right

### 🃏 Login Card — Lines 1852–1867
| Property | Value |
|---|---|
| Background | `rgba(255,255,255,0.97)` (near-white glass) |
| Border Radius | `24px` |
| Max Width | `440px` |
| Box Shadow | Deep navy shadow + white halo ring |
| Overflow | `hidden` (zero button overflow) |

### 🔝 Top Accent Bar — Lines 1870–1876
- Height: `6px`
- Color: Gold gradient (`#FFB800` → `#FFE082` → `#D97706`)
- Glowing box-shadow

### 🏷️ Login Header Text — Lines 1937–1961
| Element | Text | Style |
|---|---|---|
| `.login-title` | `DON BOSCO YOUTH CENTRE` | 21px, Bold 900, Navy `#002D63` |
| `.login-subhead` | `YOUTH MOVEMENT • BASIN BRIDGE` | 14px, Bold 800, Gold `#D97706` |
| `.login-tagline` | `Learn • Lead • Serve • Grow • Est. 1950` | 11.5px, Bold 700, Slate |

### 🔘 Login Buttons — HTML Lines 2430–2479

| # | Button | Class | Color |
|---|---|---|---|
| 1 | 🪪 Youth Member Portal (My Pass) | `btn-gold-vip` | Gold gradient `#FFFDF5→#FDE68A` |
| 2 | 👑 Fr. Director (முழு அணுகல்) | `btn-navy-royal` | Navy `#002D63→#00469B` |
| 3 | ⚡ Fr. Assistant Director | `btn-azure-solid` | Azure `#0284C7→#0369A1` |
| 4a | 🎖️ Group Leader (Members & Points) | `btn-emerald-solid` | Emerald `#047857→#10B981` |
| 4b | 🛡️ Group Incharge (Attendance) | `btn-indigo-solid` | Indigo `#4F46E5→#6366F1` |

### 💊 Utility Pills — HTML Lines 2482–2492
| Pill | Action | Color |
|---|---|---|
| 📲 Install App (நிறுவுக) | `PWA.install()` | Dark `#0F172A` |
| 🔑 Password Reset | `Auth.openForgotPasswordModal()` | Orange `#FFF7ED` |
| 🤖 AI Doctor | `AIDoctor.openModal()` | Emerald `#047857` |

### 🦶 Footer Quote — Lines 2495–2501
> *"Run, jump, make noise, but do not sin!"*
> — St. John Bosco • புனித தொன்போஸ்கோ

### 📱 App Shell (Authenticated) — Lines 2506–2640
**Sidebar Navigation:**
- 🌟 Bosco Pulse Home (Dashboard)
- 📅 Events & Camps
- 📚 Formation & Skills
- ❤️ Service & Volunteer
- 🏆 Ranks & Badges
- 🪪 Digital Youth Pass
- 👥 Members Registry
- 📷 QR Scanner Terminal
- 📜 Certificates
- 📈 Reports & Analytics
- ⚖️ Rules of the Oratory

**Bottom Mobile Nav (5 tabs):**
🏠 Home | 📅 Events | 📚 Learn | ❤️ Serve | 🏆 Ranks

### 📦 Script Tags Loaded — Lines 2642–2663
```
logo-data.js, theme-data.js, config.js, utils.js, auth.js, api.js,
router.js, dashboard.js, events.js, formation.js, volunteer.js,
leaderboard.js, members.js, attendance.js, qr-generator.js,
certificates.js, reports.js, voice-keyboard.js, rules.js,
ai-doctor.js, app.js
```

### 📡 External Libraries (CDN)
- QRCode.js `1.0.0`
- Html5-QRCode `2.3.8`
- jsPDF `2.5.1`
- html2canvas `1.4.1`
- Google Identity Services (GSI)

---

## 📄 FILE 2: sw.js (80 lines, ~2 KB)

### Cache Version
```js
const CACHE_NAME = 'dbyc-v19';
```

### Fetch Strategy
| Request Type | Strategy |
|---|---|
| Google APIs / Backend | Network-First |
| HTML Navigation (Android) | **Network-First** (instant updates) |
| Static Assets (JS, CSS, images) | Cache-First + Background Revalidation |

### Lifecycle
- `install` → Pre-cache all assets with `Promise.allSettled` (graceful failures)
- `activate` → Delete old caches, claim clients immediately
- `skipWaiting()` → Instant activation

---

## 📄 FILE 3: ai-doctor.js (486 lines, ~23 KB)

### 7 Diagnostic Checks (`AIDoctor.runDiagnostics()`)
| # | Check | Score Impact |
|---|---|---|
| 1 | HTTPS / Secure Context | -25 if fail |
| 2 | Service Worker status | -15 warn / -20 fail |
| 3 | Web App Manifest validity | -10 warn / -20 fail |
| 4 | Offline Cache Storage | -10 warn |
| 5 | LocalStorage / DB persistence | -25 if fail |
| 6 | PWA Install state | 0 (advisory) |
| 7 | Camera / getUserMedia | -10 warn |

### Auto-Rectify Steps (`AIDoctor.autoRectifyAll()`)
1. Force re-register & update Service Worker
2. Prime Cache Storage with all core app files
3. Verify/seed LocalStorage member database
4. Refresh PWA install buttons across UI

### AI Chat Presets (`AIDoctor.askPreset()`)
- `install_prompt` → Install guide (platform-aware: Android/iOS/Desktop)
- `ios_guide` → Safari Share → Add to Home Screen steps
- `camera_fix` → Browser camera permission guide
- `offline_help` → 100% offline usage explanation

---

## 📄 OTHER FILES (in frontend folder)

| File | Size | Purpose |
|---|---|---|
| `dashboard.js` | 17 KB | Classic dashboard stats & scoreboard |
| `app.js` | 21 KB | Main app init, Auth, PWA, UI, Router |
| `events.js` | 13 KB | Events & camps management |
| `formation.js` | 11 KB | Formation & skills module |
| `volunteer.js` | 11 KB | Service & volunteer module |
| `leaderboard.js` | 10 KB | Team scoreboard & ranks |
| `manifest.json` | 1 KB | PWA manifest |
| `dbyc-logo.jpg` | 40 KB | DBYC crest logo |

---

## 🛠️ Key Android & PWA Fixes Applied

| Fix | How |
|---|---|
| Zero button overflow | `width:100% !important; box-sizing:border-box !important; overflow:hidden !important` |
| Android dark mode protection | `<meta name="color-scheme" content="light">` |
| Instant refresh on Android | Network-First for HTML navigation in `sw.js` |
| Cache bust | `dbyc-v19` (incremented from v16) |
| Safe area insets (iPhone X+) | `env(safe-area-inset-bottom)` in bottom nav |

---

## 🚀 How to Publish to GitHub Pages

1. Go to: https://github.com/donfrangleensdb-stack/DBYC-PORTAL-/upload/main
2. Drag & drop from Desktop:
   - `index.html`
   - `sw.js`
   - `ai-doctor.js`
3. Click **Commit changes**
4. Visit: https://donfrangleensdb-stack.github.io/DBYC-PORTAL-/
5. On Android: Hard refresh (pull down) or clear cache

---

*DBYC Bosco Pulse — Zero-Budget Cloud Architecture • Google Apps Script & Sheets*
