/* DBYC - Rules of the Oratory (தொன்போஸ்கோ இளைஞர் மன்றத்தின் விதிமுறைகள்) Module */
const Rules = {
  _currentFilter: 'all',
  _searchQuery: '',
  _isSpeaking: false,

  RULES_DATA: [
    {
      num: 1,
      category: 'admin',
      categoryName: 'சலேசிய நிர்வாகம் (Salesian Governance)',
      tamil: 'இளைஞர் மன்றம் சலேசிய சபையினரால் நடத்தப்படுகின்றது. தமிழக சலேசிய இளைஞர் மன்றங்களின் விதிமுறைக்கும், தொன்போஸ்கோ மையத்தின் விதிமுறைக்கும் உட்பட்டது.',
      english: 'The Youth Centre is managed by the Salesians of Don Bosco (SDB). It is governed by the statutes of Tamil Nadu Salesian Youth Services and the local DBYC centre regulations.',
      tag: 'சலேசிய சபை விதி',
      icon: '🏛️'
    },
    {
      num: 2,
      category: 'groups',
      categoryName: 'வயது வரம்பு & குழுக்கள் (Age Hierarchy)',
      tamil: 'மன்ற உறுப்பினர்களாக, 6 முதல் 14 வயது வரை சப்-ஜூனியர் குழுவிலும், 15 வயது முதல் 18 வயது வரை ஜூனியர் குழுவிலும், 19 வயது முதல் 25 வயது வரை இன்டர்ஸ் குழுவிலும், 25 வயது முதல் 34 வயது வரை சீனியர்ஸ் குழுவிலும், 34 வயது முதல் 55 வயது வரை சூப்பர் சீனியர்ஸ் குழுவிலும், 56 வயதிற்கு மேற்பட்டவர்கள் எல்டர்ஸ் குழுவிலும் இடம்பெறுவார்கள். சப்-ஜூனியர்ஸ் மற்றும் ஜூனியர்ஸ் பள்ளியில் படிப்பவர்களாக இருக்கவேண்டும். குடும்ப சூழலால் வேலைக்கு சென்றால் பெற்றோர் இயக்குநரையும், பொறுப்பாளரையும் சந்திக்கவேண்டும்.',
      english: 'Members are categorized into 6 tiers: Sub-Juniors (6-14 yrs), Juniors (15-18 yrs), Inters (19-25 yrs), Seniors (25-34 yrs), Super Seniors (34-55 yrs), and Elders (56+ yrs). Sub-Juniors and Juniors must be schooling students; if working due to family circumstances, parents must consult the Director and Incharge.',
      tag: '6 வயது வரம்பு பிரிவுகள்',
      icon: '👥'
    },
    {
      num: 3,
      category: 'attendance',
      categoryName: 'புதுப்பித்தல் தகுதி (Membership Renewal)',
      tamil: 'மன்ற உறுப்பினர்கள் ஓராண்டு (ஜூன் முதல் மே வரை) முழுவதும் மன்ற கூட்டங்கள் நிகழ்ச்சிகளில் 75% வருகை பதிவு மற்றும் சந்தா முழுமையாக செலுத்தியவர்கள் மட்டுமே புதுப்பிக்க தகுதிபெற்றவர்களாவார்கள்.',
      english: 'To renew membership for the next annual cycle (June to May), members must maintain a minimum of 75% attendance across all oratory meetings, assemblies, and programs, and have cleared their subscription dues.',
      tag: '75% வருகைப் பதிவு',
      icon: '📊'
    },
    {
      num: 4,
      category: 'idcard',
      categoryName: 'அடையாள அட்டை (QR ID Pass)',
      tamil: 'உறுப்பினர்கள் தங்கள் அடையாள அட்டையை தினமும் கொண்டுவருதல் அவசியம்.',
      english: 'Members must carry their official Don Bosco Youth Centre ID Pass with QR code every day for campus admission and attendance terminal scan.',
      tag: 'கட்டாயம் (Mandatory)',
      icon: '🪪'
    },
    {
      num: 5,
      category: 'timing',
      categoryName: 'பயிற்சி நேரம் (Oratory Timings)',
      tamil: 'இளைஞர் மன்ற உறுப்பினர்களின் பயிற்சி நேரம் வார நாட்களில் மாலை 4:30 மணிமுதல் இரவு 7:30 மணிவரை சிறப்பு போட்டிகள் நடைபெறும் முன் மன்ற இயக்குநரின் முன் அனுமதி பெறவேண்டும்.',
      english: 'General training hours on weekdays are from 4:30 PM to 7:30 PM. Prior written approval from the Fr. Director is strictly required before organizing or participating in special tournaments/matches.',
      tag: 'மாலை 4:30 - இரவு 7:30',
      icon: '⏰'
    },
    {
      num: 6,
      category: 'timing',
      categoryName: 'வெளியேறும் நேரம் (Dismissal Timings)',
      tamil: 'கேரம் குழுவை மாலை (4:00 மணிமுதல் 6:00 மணிவரை) தவிர மற்றவர்கள் கண்டிப்பாக மாலை 6:30 மணிக்கு மன்றத்தை விட்டு செல்லவேண்டும்.',
      english: 'Carrom group practices from 4:00 PM to 6:00 PM. All other sports and activity members must strictly vacate the premises by 6:30 PM unless permitted.',
      tag: 'மாலை 6:30 மணி',
      icon: '🚪'
    },
    {
      num: 7,
      category: 'conduct',
      categoryName: 'ஒழுக்கம் & நடத்தை (Zero Tolerance)',
      tamil: 'விதிமுறைகள் முறைப்படி கடைபிடிக்காமல் இருந்தாலோ, தீய வார்த்தைகள், தீய நடத்தைகள், வன்முறை செயல்கள் மற்றும் போதை பொருட்கள் பயன்படுத்தினால் எவ்வித முன் எச்சரிக்கையுமின்றி இயக்குநரால் மன்றத்தில் உடனடியாக வெளியேற்றப்படுவார்கள்.',
      english: 'Strict zero-tolerance policy: Failure to follow statutes, use of abusive/vulgar language, misconduct, violence, or consumption/possession of toxic substances will result in immediate expulsion by the Director without prior warning.',
      tag: 'உடனடி நீக்கம் (Expulsion)',
      icon: '⚠️'
    },
    {
      num: 8,
      category: 'loyalty',
      categoryName: 'அணி விசுவாசம் (Club Loyalty)',
      tamil: 'மன்ற உறுப்பினர்கள் வெளியில் இருக்கும் வேறு கால்பந்து மற்றும் மேசைப்பந்தாட்டம் அணிகளில் விளையாடினால் மன்ற ஒழுங்கு நடைமுறைப்படி அவரை உடனடியாக மன்றத்திலிருந்து வெளியேற்றப்படுவர். ஒருவேளை அவருக்கு அந்நிறுவனத்தில் வேலை வாய்ப்பு கிடைக்கும் பட்சத்தில் மன்ற இயக்குநரின் அனுமதி பெற்று விளையாடலாம்.',
      english: 'DBYC members are strictly prohibited from playing for outside football or table tennis clubs without permission, punishable by immediate termination. If employment/job opportunity is provided by the corporate firm, they may play after obtaining written permission from the Fr. Director.',
      tag: 'மன்ற விசுவாசம்',
      icon: '⚽'
    },
    {
      num: 9,
      category: 'meetings',
      categoryName: 'ஞாயிறு பொதுக்கூட்டம் (Sunday Assembly)',
      tamil: 'ஞாயிறு காலை 10:00 மணியளவில் நடைபெறும் மன்ற பொதுக் கூட்டத்திற்கு வர இயலாதவர்கள் மன்றத்தில் நுழைய அனுமதி மறுக்கப்படும்.',
      english: 'Sunday General Assembly takes place at 10:00 AM sharp. Members who fail to attend this weekly moral, spiritual, and organizational formation assembly will be denied entry to the centre.',
      tag: 'ஞாயிறு காலை 10:00 மணி',
      icon: '🔔'
    },
    {
      num: 10,
      category: 'meetings',
      categoryName: 'செயற்குழு கூட்டம் (Executive Council)',
      tamil: 'குழு தலைவர்கள் அல்லது மன்ற செயற்குழு கூட்டம் ஞாயிற்றுக்கிழமைகளில் காலை 11:00 மணியிலிருந்து மதியம் 1:00 மணிவரை நடைபெறும்.',
      english: 'Group Leaders and Executive Committee (Council) meetings are conducted every Sunday from 11:00 AM to 1:00 PM for youth animators, leaders, and incharges.',
      tag: 'ஞாயிறு காலை 11:00 - 1:00',
      icon: '🎖️'
    },
    {
      num: 11,
      category: 'admin',
      categoryName: 'நிதி விவகாரங்கள் (Financial Authority)',
      tamil: 'மன்றத்தில் நிகழ்வுகளுக்கு பண உதவி, பொது உதவி, வெளியிலிருந்து பெறுவதற்கு இயக்குநர் மற்றும் உதவி இயக்குநர் மற்றும் பொறுப்பாளர் ஆகியோருக்கு மட்டுமே அதிகாரம் உள்ளது. இவர்களின் அனுமதியின்றி வேறு யாரும் பண உதவி, பொருள் உதவி பெறக்கூடாது.',
      english: 'Only the Fr. Director, Fr. Assistant Director, and authorized Incharge possess the authority to seek or receive sponsorships, financial aid, or material donations. No individual or group may collect funds or donations without official written authorization.',
      tag: 'இயக்குநர் அதிகாரம்',
      icon: '💰'
    },
    {
      num: 12,
      category: 'property',
      categoryName: 'வளாகச் சொத்துப் பாதுகாப்பு (Campus Property)',
      tamil: 'மன்றத்தில் கட்டிடம், விளையாட்டு பொருட்கள், மற்ற இதர பொருட்கள் ஆகியவை மன்ற உறுப்பினர்கள் அனைவருக்கும் பயன்படுபவை. ஆகவே இவைகளை பாதுகாக்க வேண்டியது ஒவ்வொரு உறுப்பினரின் கடமை. சேதப்படுத்தினால் இயக்குநரால் தகுந்த நடவடிக்கை எடுக்கப்படும்.',
      english: 'Campus facilities, buildings, sports gear, equipment, and assets belong to all members. It is the sacred duty of every youth to protect them. Any deliberate damage or vandalism will face severe disciplinary and compensatory action.',
      tag: 'பொதுச் சொத்து',
      icon: '🏢'
    },
    {
      num: 13,
      category: 'property',
      categoryName: 'தொழில்நுட்ப வளாக ஒருங்கிணைப்பு (Campus Integration)',
      tamil: 'மன்றத்தின் நிகழ்ச்சிகள் கண்டிப்பாக தொன்போஸ்கோ தொழில்நுட்ப வளாகத்தில் பல்வேறு பிரிவுகளில் உள்ள நிகழ்ச்சிகளை பொருத்து அமையும்.',
      english: 'Youth Centre activities and sports schedules are harmonized with the wider academic, vocational, and technical training events across the Don Bosco Technical Campus.',
      tag: 'வளாக ஒருங்கிணைப்பு',
      icon: '🤝'
    },
    {
      num: 14,
      category: 'conduct',
      categoryName: 'பொது ஒழுங்கு (General Discipline)',
      tamil: 'பொதுவான ஒழுங்கு முறைகளையும், ஒவ்வொரு குழுவுக்கும் கொடுக்கப்பட்டுள்ள விதிமுறைகளையும் கண்டிப்பாக பின்பற்ற வேண்டும்.',
      english: 'Members must scrupulously adhere to general Salesian discipline as well as any group-specific regulations issued by group incharges and leaders.',
      tag: 'ஒழுங்கு நெறி',
      icon: '⚖️'
    },
    {
      num: 15,
      category: 'admin',
      categoryName: 'திருத்த அதிகாரம் (Director’s Prerogative)',
      tamil: 'மன்றத்தின் விதிமுறைகளை மாற்றி அமைக்கவோ அல்லது சீர் செய்யவோ இயக்குநருக்கு உரிமை உண்டு.',
      english: 'The Salesian Director retains the absolute right and discretion to amend, update, interpret, or introduce new rules for the greater good of the Don Bosco Youth Centre community.',
      tag: 'இயக்குநரின் தனி உரிமை',
      icon: '👑'
    }
  ],

  render(container) {
    container.innerHTML = `
      <div class="view-header">
        <div>
          <div style="display:flex;align-items:center;gap:var(--s-2)">
            <span style="font-size:1.8rem">📜</span>
            <div>
              <h1 class="view-title">Rules of the Oratory &bull; மன்ற விதிமுறைகள்</h1>
              <p class="view-subtitle">தொன்போஸ்கோ இளைஞர் மன்றம், பேசின் பாலம், சென்னை - 600 012 &bull; Official Statutes & Code of Conduct</p>
            </div>
          </div>
        </div>
        <div class="view-actions" style="display:flex;gap:var(--s-2);flex-wrap:wrap">
          <button class="btn btn-outline btn-sm" id="btn-rules-tts" onclick="Rules.toggleVoiceReading()">
            🔊 குரல் வாசிப்பு (Listen TTS)
          </button>
          <button class="btn btn-primary btn-sm" onclick="Rules.printOratoryRules()">
            🖨️ Print Rules Plate (A4)
          </button>
        </div>
      </div>

      <!-- Don Bosco Oratory Spiritual Banner -->
      <div class="card" style="background:linear-gradient(135deg,#002855 0%,#003F8A 100%);color:#fff;margin-bottom:var(--s-4);border:none;box-shadow:var(--shadow-md)">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:var(--s-4);flex-wrap:wrap">
          <div style="display:flex;align-items:center;gap:var(--s-4)">
            <img src="${Utils.getFounderImageSrc()}" style="width:75px;height:90px;object-fit:cover;border-radius:6px;border:2px solid #FFC107" alt="St. John Bosco">
            <div>
              <div style="color:#FFC107;font-size:12px;font-weight:700;letter-spacing:1px">SALESIAN ORATORY CRITERIA &bull; சலேசிய மன்ற நெறிமுறைகள்</div>
              <h2 style="font-size:18px;font-weight:800;margin:3px 0 6px 0">"Da Mihi Animas Caetera Tolle"</h2>
              <div style="font-size:12px;color:rgba(255,255,255,0.9);max-width:680px;line-height:1.5">
                தொன்போஸ்கோ இளைஞர் மன்றம் இளைஞர்களை வரவேற்கும் <strong>இல்லம்</strong>, நற்பண்பு புகட்டும் <strong>பங்கு</strong>, வாழ்க்கைக்கு தயாரிக்கும் <strong>பள்ளி</strong>, மற்றும் நண்பர்கள் கூடி விளையாடும் <strong>விளையாட்டு அரங்கம்</strong> ஆகும்.
              </div>
            </div>
          </div>
          <div style="text-align:right" class="col-hide-mobile">
            <div style="font-size:28px;font-weight:800;color:#FFC107">15</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.8)">அதிகாரப்பூர்வ விதிமுறைகள்</div>
          </div>
        </div>
      </div>

      <!-- Filter and Search Toolbar -->
      <div class="card" style="padding:var(--s-3);margin-bottom:var(--s-4)">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:var(--s-3);flex-wrap:wrap">
          
          <div style="display:flex;align-items:center;gap:var(--s-2);flex-wrap:wrap">
            <button class="btn btn-xs ${this._currentFilter==='all'?'btn-primary':'btn-outline'}" onclick="Rules.setFilter('all')">அனைத்தும் (All 15)</button>
            <button class="btn btn-xs ${this._currentFilter==='groups'?'btn-primary':'btn-outline'}" onclick="Rules.setFilter('groups')">👥 வயதுக் குழுக்கள் (6 Groups)</button>
            <button class="btn btn-xs ${this._currentFilter==='attendance'?'btn-primary':'btn-outline'}" onclick="Rules.setFilter('attendance')">📊 வருகைப் பதிவு (75%)</button>
            <button class="btn btn-xs ${this._currentFilter==='idcard'?'btn-primary':'btn-outline'}" onclick="Rules.setFilter('idcard')">🪪 QR அட்டை (Pass)</button>
            <button class="btn btn-xs ${this._currentFilter==='timing'?'btn-primary':'btn-outline'}" onclick="Rules.setFilter('timing')">⏰ பயிற்சி நேரம்</button>
            <button class="btn btn-xs ${this._currentFilter==='conduct'?'btn-primary':'btn-outline'}" onclick="Rules.setFilter('conduct')">⚠️ நன்னடத்தை & ஒழுக்கம்</button>
            <button class="btn btn-xs ${this._currentFilter==='meetings'?'btn-primary':'btn-outline'}" onclick="Rules.setFilter('meetings')">🔔 ஞாயிறு கூட்டம்</button>
          </div>

          <div style="position:relative;width:240px">
            <input type="text" id="rules-search-input" class="form-control form-control-sm" placeholder="🔍 விதிமுறையைத் தேடு..." value="${Utils.escapeHtml(this._searchQuery)}" oninput="Rules.handleSearch(this.value)">
          </div>

        </div>
      </div>

      <!-- Rules List Grid -->
      <div id="rules-list-container" style="display:flex;flex-direction:column;gap:var(--s-3)">
        ${this._renderRulesHtml()}
      </div>

      <!-- Official Undertaking / Declaration Plaque (உறுதிமொழி பலகை) -->
      <div class="card" style="margin-top:var(--s-5);background:#fefce8;border:2px solid #ca8a04;padding:var(--s-4);border-radius:var(--r-lg)">
        <div style="display:flex;align-items:center;gap:var(--s-2);margin-bottom:var(--s-2)">
          <span style="font-size:1.3rem">📜</span>
          <span style="font-weight:800;color:#854d0e;font-size:14px">உறுப்பினர் உறுதிமொழி பலகை (Official DBYC Undertaking)</span>
        </div>
        <div style="font-size:12px;line-height:1.6;color:#713f12">
          தொன்போஸ்கோ இளைஞர் மன்றத்தில் சேர விரும்பும் நான் மேற்கூறப்பட்ட <strong>15 விதிமுறைகள் அனைத்திற்கும் கீழ்ப்படிவேன்</strong> என்றும், மன்ற தலைவர்கள், இயக்குநரின் ஆலோசனைகளுக்கு இணங்க அன்பு, அமைதி, ஆற்றல், ஆனந்தம் ஆகியவற்றின் மேன்மையை புரிந்து வாழவும் உறுதியளிக்கிறேன். மேற்குறிப்பிட்டுள்ள விதிமுறைகளை மீறி செயல்பட்டால் மன்றத்தின் விதிமுறைக்கு உட்பட்டு உறுப்பினர் தகுதியை விலக்க சம்மதிக்கிறேன்.
        </div>
        <div style="display:flex;gap:var(--s-3);margin-top:var(--s-3);flex-wrap:wrap">
          <div style="flex:1;background:#fff;padding:8px 12px;border-radius:4px;border:1px solid #fde047;font-size:11px">
            ✍️ <strong>பெற்றோர் / பாதுகாவலர்:</strong> சப்-ஜூனியர் & ஜூனியர் பிரிவினரின் பெற்றோர்கள் மன்ற விதிகளுக்கு உடன்பட்டு பொறுப்பேற்கின்றனர்.
          </div>
          <div style="flex:1;background:#fff;padding:8px 12px;border-radius:4px;border:1px solid #fde047;font-size:11px">
            ✍️ <strong>உறுப்பினர்:</strong> மன்றத்தின் நற்பெயரையும் ஒழுக்கத்தையும் நிலைநாட்ட முழுமையாக கடமைப்பட்டுள்ளார்.
          </div>
        </div>
      </div>
    `;
  },

  _renderRulesHtml() {
    let list = this.RULES_DATA;

    if (this._currentFilter !== 'all') {
      list = list.filter(r => r.category === this._currentFilter);
    }

    if (this._searchQuery) {
      const q = this._searchQuery.toLowerCase();
      list = list.filter(r => 
        r.tamil.toLowerCase().includes(q) || 
        r.english.toLowerCase().includes(q) || 
        r.categoryName.toLowerCase().includes(q) ||
        String(r.num).includes(q)
      );
    }

    if (!list.length) {
      return `
        <div class="card" style="text-align:center;padding:var(--s-6);color:var(--text-muted)">
          <div style="font-size:2rem;margin-bottom:var(--s-2)">🔍</div>
          <div style="font-weight:700">பொருந்தும் விதிமுறைகள் கிடைக்கவில்லை (No matching rules)</div>
          <div style="font-size:12px;margin-top:4px">வேறு தேடல் வார்த்தையைப் பயன்படுத்தவும்.</div>
        </div>`;
    }

    return list.map(r => `
      <div class="card" style="padding:var(--s-4);border-left:4px solid var(--primary);transition:transform 0.15s ease">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:var(--s-3);margin-bottom:var(--s-2)">
          <div style="display:flex;align-items:center;gap:var(--s-2)">
            <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;background:var(--primary);color:#fff;border-radius:50%;font-size:12px;font-weight:800">
              ${r.num}
            </span>
            <span style="font-size:1.1rem">${r.icon}</span>
            <span style="font-size:11px;font-weight:700;color:var(--primary);text-transform:uppercase">${r.categoryName}</span>
          </div>
          <span class="badge" style="background:var(--surface-alt);color:var(--text-muted);font-size:10px;font-weight:600">${r.tag}</span>
        </div>
        
        <div style="font-size:13px;line-height:1.6;color:#0f172a;font-weight:600;margin-bottom:6px">
          ${r.tamil}
        </div>
        
        <div style="font-size:11.5px;line-height:1.5;color:var(--text-muted);border-top:1px dashed var(--border);padding-top:6px">
          <strong>English:</strong> ${r.english}
        </div>
      </div>
    `).join('');
  },

  setFilter(category) {
    this._currentFilter = category;
    const container = document.getElementById('rules-list-container');
    if (container) container.innerHTML = this._renderRulesHtml();
    // Update active button state
    document.querySelectorAll('.view-header ~ .card .btn-xs').forEach(btn => {
      btn.className = `btn btn-xs ${btn.getAttribute('onclick')?.includes(category) ? 'btn-primary' : 'btn-outline'}`;
    });
  },

  handleSearch(query) {
    this._searchQuery = query.trim();
    const container = document.getElementById('rules-list-container');
    if (container) container.innerHTML = this._renderRulesHtml();
  },

  // Read rules aloud using browser SpeechSynthesis (TTS)
  toggleVoiceReading() {
    if (!('speechSynthesis' in window)) {
      UI.toast('warning', 'TTS Not Supported', 'Text-to-speech is not supported on this browser.');
      return;
    }

    if (this._isSpeaking) {
      window.speechSynthesis.cancel();
      this._isSpeaking = false;
      const btn = document.getElementById('btn-rules-tts');
      if (btn) btn.innerHTML = '🔊 குரல் வாசிப்பு (Listen TTS)';
      UI.toast('info', 'TTS Stopped', 'Voice reading paused.');
      return;
    }

    const textToRead = this.RULES_DATA.map(r => `விதி ${r.num}: ${r.tamil}`).join('. ');
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'ta-IN';
    utterance.rate = 0.95;

    utterance.onstart = () => {
      this._isSpeaking = true;
      const btn = document.getElementById('btn-rules-tts');
      if (btn) {
        btn.classList.add('btn-danger');
        btn.innerHTML = '🛑 நிறுத்து (Stop Voice)';
      }
      UI.toast('info', 'TTS Active 🔊', 'Reading the 15 rules in Tamil...');
    };

    utterance.onend = () => {
      this._isSpeaking = false;
      const btn = document.getElementById('btn-rules-tts');
      if (btn) {
        btn.classList.remove('btn-danger');
        btn.innerHTML = '🔊 குரல் வாசிப்பு (Listen TTS)';
      }
    };

    utterance.onerror = () => {
      this._isSpeaking = false;
      const btn = document.getElementById('btn-rules-tts');
      if (btn) btn.innerHTML = '🔊 குரல் வாசிப்பு (Listen TTS)';
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  },

  // Print Dedicated Official Rules Plate
  printOratoryRules() {
    const founderSrc = Utils.getFounderImageSrc();
    const logoSrc = Utils.getLogoSrc();

    UI.openModal('rules-print-modal', `
      <div class="modal-header">
        <span class="modal-title">📜 தொன்போஸ்கோ இளைஞர் மன்றத்தின் அதிகாரப்பூர்வ விதிமுறைகள் பட்டயம்</span>
        <div style="display:flex;gap:var(--s-2)">
          <button class="btn btn-primary btn-sm" onclick="window.print()">🖨️ Print Rules (A4)</button>
          <button class="modal-close" onclick="UI.closeModal('rules-print-modal')">✕</button>
        </div>
      </div>
      <div class="modal-body" style="padding:var(--s-4);background:#f1f5f9;overflow-y:auto;max-height:85vh">
        
        <div class="rules-plate-sheet" style="margin:0 auto">
          
          <!-- Header Plaque -->
          <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:2.5px solid #003F8A;padding-bottom:10px;margin-bottom:12px">
            <div style="width:65px;text-align:center">
              <img src="${founderSrc}" style="width:55px;height:65px;object-fit:cover;border:1px solid #b45309;border-radius:3px" alt="Don Bosco">
              <div style="font-size:8px;font-weight:700;color:#003F8A;margin-top:2px">St. John Bosco</div>
            </div>

            <div style="text-align:center;flex:1;padding:0 8px">
              <div style="font-size:18px;font-weight:800;color:#003F8A;letter-spacing:0.5px">தொன்போஸ்கோ இளைஞர் மன்றம்</div>
              <div style="font-size:11px;font-weight:600;color:#334155">பேசின் பாலம், சென்னை - 600 012 &bull; Basin Bridge, Chennai - 600 012</div>
              <div style="display:inline-block;background:#003F8A;color:#ffffff;padding:2px 18px;border-radius:12px;font-size:11px;font-weight:700;margin-top:4px">
                📜 மன்றத்தின் 15 அதிகாரப்பூர்வ விதிமுறைகள் பட்டயம் (Rules of the Oratory)
              </div>
              <div style="font-size:9px;color:#b45309;font-weight:600;margin-top:2px;font-style:italic">"Da Mihi Animas Caetera Tolle" (அன்பும் நற்பண்பும் நிறைந்த இளைஞர் சமூகம்)</div>
            </div>

            <div style="width:65px;text-align:center">
              <img src="${logoSrc}" style="width:55px;height:55px;object-fit:contain;border-radius:50%;border:1px solid #003F8A" alt="DBYC Logo">
              <div style="font-size:8px;font-weight:700;color:#003F8A;margin-top:2px">DBYC CHENNAI</div>
            </div>
          </div>

          <!-- Structured 5 Rule Plots -->
          <div style="font-size:10px;line-height:1.45;color:#0f172a;display:flex;flex-direction:column;gap:6px">
            
            <div class="rules-plot-box">
              <span class="rules-plot-badge">பிரிவு 1: சலேசிய நிர்வாகம் & 6 வயது வரம்பு குழுக்கள்</span>
              <div style="margin-bottom:3px"><strong>1.</strong> இளைஞர் மன்றம் சலேசிய சபையினரால் நடத்தப்படுகின்றது. தமிழக சலேசிய இளைஞர் மன்றங்களின் விதிமுறைக்கும், தொன்போஸ்கோ மையத்தின் விதிமுறைக்கும் உட்பட்டது.</div>
              <div style="margin-bottom:3px"><strong>2.</strong> மன்ற உறுப்பினர்களாக, 6 முதல் 14 வயது வரை சப்-ஜூனியர் குழுவிலும், 15 முதல் 18 வரை ஜூனியர், 19 முதல் 25 வரை இன்டர்ஸ், 25 முதல் 34 வரை சீனியர்ஸ், 34 முதல் 55 வரை சூப்பர் சீனியர்ஸ், 56 வயதிற்கு மேற்பட்டவர்கள் எல்டர்ஸ் குழுவிலும் இடம்பெறுவார்கள். சப்-ஜூனியர்ஸ் & ஜூனியர்ஸ் பள்ளியில் படிப்பவர்களாக இருக்கவேண்டும். குடும்ப சூழலால் வேலைக்கு சென்றால் பெற்றோர் இயக்குநரையும், பொறுப்பாளரையும் சந்திக்கவேண்டும்.</div>
              <div><strong>3.</strong> மன்ற உறுப்பினர்கள் ஓராண்டு (ஜூன் முதல் மே வரை) முழுவதும் மன்ற கூட்டங்கள் நிகழ்வுகளில் 75% வருகை பதிவு மற்றும் சந்தா முழுமையாக செலுத்தியவர்கள் மட்டுமே புதுப்பிக்க தகுதிபெற்றவர்களாவார்கள்.</div>
            </div>

            <div class="rules-plot-box">
              <span class="rules-plot-badge">பிரிவு 2: QR அடையாள அட்டை & பயிற்சி நேரம்</span>
              <div style="margin-bottom:3px"><strong>4. உறுப்பினர்கள் தங்கள் அதிகாரப்பூர்வ QR அடையாள அட்டையை தினமும் கொண்டுவருதல் கட்டாயம்.</strong></div>
              <div style="margin-bottom:3px"><strong>5.</strong> இளைஞர் மன்ற உறுப்பினர்களின் பயிற்சி நேரம் வார நாட்களில் மாலை 4:30 மணிமுதல் இரவு 7:30 மணிவரை. சிறப்பு போட்டிகள் நடைபெறும் முன் மன்ற இயக்குநரின் முன் அனுமதி பெறவேண்டும்.</div>
              <div><strong>6.</strong> கேரம் குழுவை மாலை (4:00 மணிமுதல் 6:00 மணிவரை) தவிர மற்றவர்கள் கண்டிப்பாக மாலை 6:30 மணிக்கு மன்றத்தை விட்டு செல்லவேண்டும்.</div>
            </div>

            <div class="rules-plot-box">
              <span class="rules-plot-badge">பிரிவு 3: நன்னடத்தை & ஒழுங்கு விதிகள்</span>
              <div style="margin-bottom:3px"><strong>7.</strong> விதிமுறைகள் முறைப்படி கடைபிடிக்காமல் இருந்தாலோ, தீய வார்த்தைகள், தீய நடத்தைகள், வன்முறை செயல்கள் மற்றும் போதை பொருட்கள் பயன்படுத்தினால் எவ்வித முன் எச்சரிக்கையுமின்றி இயக்குநரால் மன்றத்தில் உடனடியாக வெளியேற்றப்படுவார்கள்.</div>
              <div><strong>8.</strong> மன்ற உறுப்பினர்கள் வெளியில் இருக்கும் வேறு கால்பந்து மற்றும் மேசைப்பந்தாட்டம் அணிகளில் விளையாடினால் மன்ற ஒழுங்கு நடைமுறைப்படி அவரை உடனடியாக மன்றத்திலிருந்து வெளியேற்றப்படுவர். ஒருவேளை அவருக்கு அந்நிறுவனத்தில் வேலை வாய்ப்பு கிடைக்கும் பட்சத்தில் மன்ற இயக்குநரின் அனுமதி பெற்று விளையாடலாம்.</div>
            </div>

            <div class="rules-plot-box">
              <span class="rules-plot-badge">பிரிவு 4: மன்றக் கூட்டங்கள் & நிதி விவகாரங்கள்</span>
              <div style="margin-bottom:3px"><strong>9.</strong> ஞாயிறு காலை 10:00 மணியளவில் நடைபெறும் மன்ற பொதுக் கூட்டத்திற்கு வர இயலாதவர்கள் மன்றத்தில் நுழைய அனுமதி மறுக்கப்படும்.</div>
              <div style="margin-bottom:3px"><strong>10.</strong> குழு தலைவர்கள் அல்லது மன்ற செயற்குழு கூட்டம் ஞாயிற்றுக்கிழமைகளில் காலை 11:00 மணியிலிருந்து மதியம் 1:00 மணிவரை நடைபெறும்.</div>
              <div><strong>11.</strong> மன்றத்தின் நிகழ்வுகளுக்கு பண உதவி, பொது உதவி, வெளியிலிருந்து பெறுவதற்கு இயக்குநர் மற்றும் உதவி இயக்குநர் மற்றும் பொறுப்பாளர் ஆகியோருக்கு மட்டுமே அதிகாரம் உள்ளது. இவர்களின் அனுமதியின்றி வேறு யாரும் பண உதவி, பொருள் உதவி பெறக்கூடாது.</div>
            </div>

            <div class="rules-plot-box">
              <span class="rules-plot-badge">பிரிவு 5: வளாக சொத்துப் பாதுகாப்பு & திருத்த அதிகாரம்</span>
              <div style="margin-bottom:2px"><strong>12.</strong> மன்ற கட்டிடம், விளையாட்டு உபகரணங்கள், மற்ற இதர பொருட்கள் ஆகியவை அனைவருக்கும் பயன்படுபவை. ஆகவே இவைகளை பாதுகாக்க வேண்டியது ஒவ்வொரு உறுப்பினரின் கடமை. சேதப்படுத்தினால் இயக்குநரால் தகுந்த நடவடிக்கை எடுக்கப்படும்.</div>
              <div style="margin-bottom:2px"><strong>13.</strong> மன்றத்தின் நிகழ்ச்சிகள் கண்டிப்பாக தொன்போஸ்கோ தொழில்நுட்ப வளாகத்தில் பல்வேறு பிரிவுகளில் உள்ள நிகழ்ச்சிகளை பொருத்து அமையும்.</div>
              <div style="margin-bottom:2px"><strong>14.</strong> பொதுவான ஒழுங்கு முறைகளையும், ஒவ்வொரு குழுவுக்கும் கொடுக்கப்பட்டுள்ள விதிமுறைகளையும் கண்டிப்பாக பின்பற்ற வேண்டும்.</div>
              <div><strong>15.</strong> மன்றத்தின் விதிமுறைகளை மாற்றி அமைக்கவோ அல்லது சீர் செய்யவோ இயக்குநருக்கு முழு உரிமை உண்டு.</div>
            </div>

          </div>

          <!-- Undertaking Plaque -->
          <div style="margin-top:8px;background:#fefce8;padding:8px 12px;border:1.5px solid #ca8a04;border-radius:4px;font-size:9.5px;line-height:1.45;color:#713f12">
            <strong style="color:#854d0e;font-size:10.5px">உறுதிமொழி பலகை (Official Undertaking):</strong><br>
            தொன்போஸ்கோ இளைஞர் மன்றத்தில் சேர விரும்பும் நான் மேற்கூறப்பட்ட 15 விதிமுறைகள் அனைத்திற்கும் கீழ்ப்படிவேன் என்றும், மன்ற தலைவர்கள், இயக்குநரின் ஆலோசனைகளுக்கு இணங்க அன்பு, அமைதி, ஆற்றல், ஆனந்தம் ஆகியவற்றின் மேன்மையை புரிந்து வாழவும் உறுதியளிக்கிறேன். மேற்குறிப்பிட்டுள்ள விதிமுறைகளை மீறி செயல்பட்டால் மன்றத்தின் விதிமுறைக்கு உட்பட்டு உறுப்பினர் தகுதியை விலக்க சம்மதிக்கிறேன்.
          </div>

          <!-- 4-Column Official Signatures Approval Plaque -->
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:20px;text-align:center;border-top:1.5px dashed #cbd5e1;padding-top:10px">
            <div>
              <div style="height:25px;border-bottom:1px solid #0f172a;width:120px;margin:0 auto"></div>
              <div style="font-size:9.5px;font-weight:700;margin-top:3px">பெற்றோர் கையொப்பம்</div>
              <div style="font-size:8px;color:#64748b">(Sub-Juniors & Juniors)</div>
            </div>
            <div>
              <div style="height:25px;border-bottom:1px solid #0f172a;width:120px;margin:0 auto"></div>
              <div style="font-size:9.5px;font-weight:700;margin-top:3px">உறுப்பினர் கையொப்பம்</div>
              <div style="font-size:8px;color:#64748b">(Applicant Member)</div>
            </div>
            <div>
              <div style="height:25px;border-bottom:1px solid #0f172a;width:120px;margin:0 auto"></div>
              <div style="font-size:9.5px;font-weight:700;margin-top:3px">உதவி இயக்குநர் (DBYC)</div>
              <div style="font-size:8px;color:#64748b">நேரடி பொறுப்பாளர்</div>
            </div>
            <div>
              <div style="height:25px;border-bottom:1px solid #0f172a;width:120px;margin:0 auto"></div>
              <div style="font-size:9.5px;font-weight:700;margin-top:3px">Rev. Fr. இயக்குநர், SDB</div>
              <div style="font-size:8px;color:#64748b">Don Bosco Youth Centre</div>
            </div>
          </div>

        </div>

      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="window.print()">🖨️ Print Official Rules (A4)</button>
        <button class="btn btn-ghost" onclick="UI.closeModal('rules-print-modal')">Close</button>
      </div>
    `);
  }
};
