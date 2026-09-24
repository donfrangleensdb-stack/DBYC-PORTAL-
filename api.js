/* DBYC API - Fetch wrapper for Google Apps Script with Google Drive Photo Upload & Points Engine */

const MockDB = {
  getMembers() {
    let m = localStorage.getItem('dbyc_mock_members_v3');
    if (!m) {
      const initial = [
        {
          MemberID: 'DBYC-0001',
          FullName: 'Antony Francis',
          DateOfBirth: '2014-04-12',
          Gender: 'Male',
          Group: 'Sub Juniors Group',
          House: 'Bosco House (Red)',
          Team: 'Bosco House (Red)',
          Points: 150,
          Phone: '+91 9876543210',
          Email: 'antony@gmail.com',
          Address: 'Don Bosco Campus, Block A',
          EmergencyContact: 'Mr. Francis (Father) - 9876543200',
          JoinDate: '2024-01-10',
          Status: 'Active',
          VerificationStatus: 'Qualified',
          PhotoURL: ''
        },
        {
          MemberID: 'DBYC-0002',
          FullName: 'Maria Sneha',
          DateOfBirth: '2012-08-20',
          Gender: 'Female',
          Group: 'Juniors Group',
          House: 'Savio House (Blue)',
          Team: 'Savio House (Blue)',
          Points: 190,
          Phone: '+91 9876543211',
          Email: 'sneha@gmail.com',
          Address: 'St. Mary Street, No. 14',
          EmergencyContact: 'Mrs. Sneha (Mother) - 9876543201',
          JoinDate: '2024-06-15',
          Status: 'Active',
          VerificationStatus: 'Qualified',
          PhotoURL: ''
        },
        {
          MemberID: 'DBYC-0003',
          FullName: 'Dominic Savio Roy',
          DateOfBirth: '2009-03-09',
          Gender: 'Male',
          Group: 'Seniors Group',
          House: 'Rinaldi House (Green)',
          Team: 'Rinaldi House (Green)',
          Points: 340,
          Phone: '+91 9876543212',
          Email: 'dominic@gmail.com',
          Address: 'Youth Hostel Room 4',
          EmergencyContact: 'Fr. Thomas (Guardian) - 9876543202',
          JoinDate: '2023-08-01',
          Status: 'Active',
          VerificationStatus: 'Qualified',
          PhotoURL: ''
        },
        {
          MemberID: 'DBYC-0004',
          FullName: 'John Bosco Xavier',
          DateOfBirth: '2006-01-25',
          Gender: 'Male',
          Group: 'Inters Group',
          House: 'Rua House (Yellow)',
          Team: 'Rua House (Yellow)',
          Points: 280,
          Phone: '+91 9876543213',
          Email: 'johnroy@gmail.com',
          Address: 'DBYC Sector B, Flat 2',
          EmergencyContact: 'Mr. Roy - 9876543203',
          JoinDate: '2022-07-20',
          Status: 'Active',
          VerificationStatus: 'Qualified',
          PhotoURL: ''
        },
        {
          MemberID: 'DBYC-0005',
          FullName: 'Joseph Raj',
          DateOfBirth: '2003-11-14',
          Gender: 'Male',
          Group: 'Super Seniors Group',
          House: 'Bosco House (Red)',
          Team: 'Bosco House (Red)',
          Points: 210,
          Phone: '+91 9876543214',
          Email: 'joseph@gmail.com',
          Address: 'City Avenue, No. 7',
          EmergencyContact: 'Mr. Raj (Parent) - 9876543204',
          JoinDate: '2021-02-12',
          Status: 'Active',
          VerificationStatus: 'Qualified',
          PhotoURL: ''
        },
        {
          MemberID: 'DBYC-0006',
          FullName: 'Paul Xavier',
          DateOfBirth: '1998-05-30',
          Gender: 'Male',
          Group: 'Elders Group',
          House: 'Savio House (Blue)',
          Team: 'Savio House (Blue)',
          Points: 420,
          Phone: '+91 9876543215',
          Email: 'paul@gmail.com',
          Address: 'Cathedral Road, Apt 3',
          EmergencyContact: 'Self - 9876543215',
          JoinDate: '2019-01-10',
          Status: 'Active',
          VerificationStatus: 'Qualified',
          PhotoURL: ''
        },
        {
          MemberID: 'DBYC-0007',
          FullName: 'Michael Jude (Applicant)',
          DateOfBirth: '2010-05-14',
          Gender: 'Male',
          Group: 'Seniors Group',
          House: 'Rinaldi House (Green)',
          Team: 'Rinaldi House (Green)',
          Points: 0,
          Phone: '+91 9876543299',
          Email: 'michael@gmail.com',
          Address: 'Youth Village, Sector 9',
          EmergencyContact: 'Parent - 9876543299',
          JoinDate: '2026-09-20',
          Status: 'Active',
          VerificationStatus: 'Pending Verification',
          PhotoURL: ''
        }
      ];
      localStorage.setItem('dbyc_mock_members_v3', JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(m);
  },

  saveMembers(members) {
    localStorage.setItem('dbyc_mock_members_v3', JSON.stringify(members));
  },

  getAttendance() {
    let a = localStorage.getItem('dbyc_mock_attendance_v3');
    if (!a) {
      const today = new Date().toISOString().slice(0, 10);
      const initial = [
        {
          AttendanceID: 'ATT-0001',
          MemberID: 'DBYC-0003',
          MemberName: 'Dominic Savio Roy',
          Group: 'Seniors Group',
          House: 'Rinaldi House (Green)',
          PointsAwarded: 10,
          EventName: 'Sunday Assembly',
          Date: today,
          Time: '09:30:00',
          MarkedBy: 'director@dbyc.org',
          Method: 'QR'
        },
        {
          AttendanceID: 'ATT-0002',
          MemberID: 'DBYC-0002',
          MemberName: 'Maria Sneha',
          Group: 'Juniors Group',
          House: 'Savio House (Blue)',
          PointsAwarded: 10,
          EventName: 'Sunday Assembly',
          Date: today,
          Time: '09:35:00',
          MarkedBy: 'asst_director@dbyc.org',
          Method: 'QR'
        }
      ];
      localStorage.setItem('dbyc_mock_attendance_v3', JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(a);
  },

  saveAttendance(records) {
    localStorage.setItem('dbyc_mock_attendance_v3', JSON.stringify(records));
  },

  getPointsLedger() {
    let p = localStorage.getItem('dbyc_mock_points_ledger_v3');
    if (!p) {
      const initial = [];
      localStorage.setItem('dbyc_mock_points_ledger_v3', JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(p);
  },

  savePointsLedger(pts) {
    localStorage.setItem('dbyc_mock_points_ledger_v3', JSON.stringify(pts));
  }
};

const API = {
  isMockMode() {
    return !DBYC_CONFIG.GAS_URL || DBYC_CONFIG.GAS_URL.includes('YOUR_DEPLOYMENT_ID');
  },

  async post(payload) {
    if (this.isMockMode()) {
      return this.handleMock(payload.action, payload.data || {});
    }
    try {
      const resp = await fetch(DBYC_CONFIG.GAS_URL, {
        method: 'POST',
        body: JSON.stringify({ token: Auth.getToken(), ...payload }),
        headers: { 'Content-Type': 'text/plain' }
      });
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      return await resp.json();
    } catch (e) {
      console.warn('Backend fetch fallback to MockDB:', e.message);
      return this.handleMock(payload.action, payload.data || {});
    }
  },

  async postRaw(token, action, data) {
    if (this.isMockMode()) return this.handleMock(action, data || {});
    try {
      const resp = await fetch(DBYC_CONFIG.GAS_URL, {
        method: 'POST',
        body: JSON.stringify({ token, action, data }),
        headers: { 'Content-Type': 'text/plain' }
      });
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      return await resp.json();
    } catch (e) {
      return this.handleMock(action, data || {});
    }
  },

  async call(action, data = {}) {
    if (!Auth.isLoggedIn()) {
      Router.navigate('login');
      return { success: false, error: 'Not authenticated' };
    }
    const result = await this.post({ action, data });
    if (!result.success && result.error === 'Unauthorized. Please sign in.') {
      Auth.signOut();
    }
    return result;
  },

  handleMock(action, data) {
    const user = Auth.getUser() || { role: 'director', group: 'All', email: 'director@dbyc.org' };
    const today = new Date().toISOString().slice(0, 10);

    if (action === 'getMembers') {
      let list = MockDB.getMembers().filter(m => m.Status !== 'Deleted');
      if (user.role === 'leader' || user.role === 'incharge') {
        list = list.filter(m => m.Group === user.group);
      }
      if (data.group && data.group !== 'All') {
        list = list.filter(m => m.Group === data.group);
      }
      if (data.house && data.house !== 'All') {
        list = list.filter(m => (m.House || m.Team) === data.house);
      }
      if (data.team && data.team !== 'All') {
        list = list.filter(m => (m.House || m.Team) === data.team);
      }
      if (data.verificationStatus) {
        list = list.filter(m => m.VerificationStatus === data.verificationStatus);
      }
      return { success: true, data: list, total: list.length };
    }

    if (action === 'getMember') {
      const m = MockDB.getMembers().find(x => x.MemberID === data.memberID);
      return m ? { success: true, data: m } : { success: false, error: 'Member not found' };
    }

    if (action === 'addMember') {
      const members = MockDB.getMembers();
      const newId = 'DBYC-' + String(members.length + 1).padStart(4, '0');
      const house = data.house || data.team || 'Bosco House (Red)';
      const newMem = {
        MemberID: newId,
        FormNo: data.formNo || newId,
        Year: data.year || new Date().getFullYear().toString(),
        FullName: data.fullName,
        DateOfBirth: data.dateOfBirth || '',
        Age: data.age || '',
        Gender: data.gender || 'Male',
        Education: data.education || '',
        Occupation: data.occupation || '',
        SchoolWorkAddress: data.schoolWorkAddress || '',
        Religion: data.religion || 'Christian',
        MaritalStatus: data.maritalStatus || 'திருமணமாகாதவர் (Single)',
        Group: data.group,
        House: house,
        Team: house,
        Phone: data.phone || '',
        Email: data.email || '',
        InstaID: data.instaID || '',
        Address: data.address || '',
        FatherName: data.fatherName || '',
        MotherName: data.motherName || '',
        YearsInOrg: data.yearsInOrg || '',
        Brothers: data.brothers || '0',
        Sisters: data.sisters || '0',
        SiblingsInDBYC: data.siblingsInDBYC || '',
        Purpose: data.purpose || '',
        SportsActivities: data.sportsActivities || [],
        Ambition: data.ambition || '',
        BloodGroup: data.bloodGroup || 'O+',
        Remarks: data.remarks || '',
        EmergencyContact: data.emergencyContact || '',
        ParentSignature: data.parentSignature || data.ParentSignature || '',
        MemberSignature: data.memberSignature || data.MemberSignature || '',
        JoinDate: today,
        Status: 'Active',
        VerificationStatus: 'Pending Verification',
        Points: 0,
        PhotoBase64: data.photoBase64 || '',
        PhotoURL: data.photoURL || data.photoBase64 || ''
      };
      members.push(newMem);
      MockDB.saveMembers(members);
      return { success: true, data: { memberID: newId } };
    }

    if (action === 'updateMember') {
      const members = MockDB.getMembers();
      const idx = members.findIndex(m => m.MemberID === data.memberID);
      if (idx === -1) return { success: false, error: 'Member not found' };
      const mem = members[idx];

      const copyFields = [
        'fullName', 'FullName', 'formNo', 'FormNo', 'year', 'Year', 'dateOfBirth', 'DateOfBirth',
        'age', 'Age', 'gender', 'Gender', 'education', 'Education', 'occupation', 'Occupation',
        'schoolWorkAddress', 'SchoolWorkAddress', 'religion', 'Religion', 'maritalStatus', 'MaritalStatus',
        'group', 'Group', 'house', 'House', 'team', 'Team', 'phone', 'Phone',
        'email', 'Email', 'instaID', 'InstaID', 'address', 'Address', 'fatherName', 'FatherName',
        'motherName', 'MotherName', 'yearsInOrg', 'YearsInOrg', 'brothers', 'Brothers',
        'sisters', 'Sisters', 'siblingsInDBYC', 'SiblingsInDBYC', 'purpose', 'Purpose',
        'sportsActivities', 'SportsActivities', 'ambition', 'Ambition', 'bloodGroup', 'BloodGroup',
        'remarks', 'Remarks', 'emergencyContact', 'EmergencyContact',
        'parentSignature', 'ParentSignature', 'memberSignature', 'MemberSignature',
        'status', 'Status', 'verificationStatus', 'VerificationStatus'
      ];

      copyFields.forEach(f => {
        if (data[f] !== undefined) {
          const cap = f.charAt(0).toUpperCase() + f.slice(1);
          mem[cap] = data[f];
          if (cap === 'House') mem['Team'] = data[f];
          if (cap === 'Team') mem['House'] = data[f];
          if (cap === 'Parentsignature') mem['ParentSignature'] = data[f];
          if (cap === 'Membersignature') mem['MemberSignature'] = data[f];
        }
      });

      if (data.parentSignature !== undefined) mem.ParentSignature = data.parentSignature;
      if (data.ParentSignature !== undefined) mem.ParentSignature = data.ParentSignature;
      if (data.memberSignature !== undefined) mem.MemberSignature = data.memberSignature;
      if (data.MemberSignature !== undefined) mem.MemberSignature = data.MemberSignature;

      if (data.photoBase64 !== undefined) {
        mem.PhotoBase64 = data.photoBase64;
        mem.PhotoURL = data.photoBase64;
      }
      if (data.photoURL !== undefined) {
        mem.PhotoURL = data.photoURL;
      }

      MockDB.saveMembers(members);
      return { success: true, data: mem };
    }

    if (action === 'deleteMember') {
      if (!Auth.isAdmin()) return { success: false, error: 'Only Director or Assistant Director can delete members.' };
      const members = MockDB.getMembers();
      const idx = members.findIndex(m => m.MemberID === data.memberID);
      if (idx === -1) return { success: false, error: 'Member not found' };
      members[idx].Status = 'Deleted';
      MockDB.saveMembers(members);
      return { success: true };
    }

    if (action === 'verifyMember') {
      if (!Auth.isAdmin()) {
        return { success: false, error: 'Only Director or Assistant Director can verify members' };
      }
      const members = MockDB.getMembers();
      const mem = members.find(m => m.MemberID === data.memberID);
      if (!mem) return { success: false, error: 'Member not found' };
      mem.VerificationStatus = data.status || 'Qualified';
      mem.VerifiedBy = user.email;
      mem.VerifiedAt = new Date().toISOString();
      if (data.status === 'Qualified' && (mem.Points === 0 || !mem.Points)) {
        mem.Points = 25; // 25 Welcome Qualification Points
      }
      MockDB.saveMembers(members);
      return { success: true, message: `Member ${mem.FullName} is now ${mem.VerificationStatus}` };
    }

    if (action === 'awardPoints') {
      if (user.role === 'member') {
        return { success: false, error: 'Only authorities can adjust points' };
      }
      const members = MockDB.getMembers();
      const mem = members.find(m => m.MemberID === data.memberID);
      if (!mem) return { success: false, error: 'Member not found' };
      if (mem.VerificationStatus !== 'Qualified') {
        return { success: false, error: 'Cannot adjust points for an unverified member. Please qualify first.' };
      }

      const pts = parseInt(data.points) || 10;
      mem.Points = (mem.Points || 0) + pts;
      MockDB.saveMembers(members);

      const ledger = MockDB.getPointsLedger();
      ledger.unshift({
        PointID: 'PT-' + Date.now(),
        MemberID: mem.MemberID,
        MemberName: mem.FullName,
        Group: mem.Group,
        House: mem.House || mem.Team,
        Points: pts,
        Reason: data.reason || 'Authority Adjustment',
        AwardedBy: user.email,
        Date: today,
        Time: new Date().toTimeString().slice(0, 8)
      });
      MockDB.savePointsLedger(ledger);

      return {
        success: true,
        data: {
          memberID: mem.MemberID,
          name: mem.FullName,
          house: mem.House || mem.Team,
          pointsAdded: pts,
          totalPoints: mem.Points
        }
      };
    }

    if (action === 'uploadPhoto') {
      const base64 = data.base64;
      const memberID = data.memberID;
      if (memberID) {
        const members = MockDB.getMembers();
        const mem = members.find(m => m.MemberID === memberID);
        if (mem) {
          mem.PhotoBase64 = base64;
          mem.PhotoURL = base64;
          MockDB.saveMembers(members);
        }
      }
      return {
        success: true,
        data: {
          fileId: 'mock_drive_file_' + Date.now(),
          thumbnailUrl: base64,
          viewUrl: base64
        }
      };
    }

    if (action === 'markAttendance') {
      const members = MockDB.getMembers();
      const mem = members.find(m => m.MemberID === data.memberID && m.Status === 'Active');
      if (!mem) return { success: false, error: 'Member not found or inactive' };

      // QUALIFICATION CHECK
      if (mem.VerificationStatus !== 'Qualified') {
        return {
          success: false,
          error: `Member "${mem.FullName}" is NOT QUALIFIED (Status: ${mem.VerificationStatus || 'Pending Verification'}). Must be qualified by Director.`,
          unqualified: true,
          member: mem
        };
      }

      const attList = MockDB.getAttendance();
      const eventName = data.eventName || 'Sunday Assembly';
      const already = attList.find(a => a.MemberID === mem.MemberID && a.Date === today && a.EventName === eventName);
      if (already) {
        return { success: false, error: `Attendance already recorded for today's ${eventName}`, alreadyMarked: true, member: mem };
      }

      // Automatically award 10 Attendance Points to Member and House
      mem.Points = (mem.Points || 0) + 10;
      MockDB.saveMembers(members);

      const nowTime = new Date().toTimeString().slice(0, 8);
      const house = mem.House || mem.Team || 'Bosco House (Red)';
      const newRecord = {
        AttendanceID: 'ATT-' + String(attList.length + 1).padStart(4, '0'),
        MemberID: mem.MemberID,
        MemberName: mem.FullName,
        Group: mem.Group,
        House: house,
        PointsAwarded: 10,
        EventName: eventName,
        Date: today,
        Time: nowTime,
        MarkedBy: user.email,
        Method: data.method || 'QR'
      };
      attList.unshift(newRecord);
      MockDB.saveAttendance(attList);

      // Also log into points ledger
      const ledger = MockDB.getPointsLedger();
      ledger.unshift({
        PointID: 'PT-' + Date.now(),
        MemberID: mem.MemberID,
        MemberName: mem.FullName,
        Group: mem.Group,
        House: house,
        Points: 10,
        Reason: 'Attendance: ' + eventName,
        AwardedBy: user.email,
        Date: today,
        Time: nowTime
      });
      MockDB.savePointsLedger(ledger);

      return {
        success: true,
        data: {
          id: newRecord.AttendanceID,
          name: mem.FullName,
          group: mem.Group,
          house: house,
          points: mem.Points,
          pointsEarned: 10,
          time: nowTime.slice(0, 5),
          photo: mem.PhotoURL || mem.PhotoBase64
        }
      };
    }

    if (action === 'getAttendance') {
      let records = MockDB.getAttendance();
      if (user.role === 'leader' || user.role === 'incharge') {
        records = records.filter(a => a.Group === user.group);
      }
      return { success: true, data: records };
    }

    if (action === 'getDashboard') {
      const members = MockDB.getMembers().filter(m => m.Status === 'Active');
      const attList = MockDB.getAttendance();
      const GROUPS = Utils.GROUPS;
      const HOUSES = Utils.HOUSES;

      const byGroup = {};
      GROUPS.forEach(g => { byGroup[g] = { members: 0, todayAttendance: 0 }; });

      const houseScores = {};
      HOUSES.forEach(h => { houseScores[h] = { points: 0, members: 0, attendanceToday: 0 }; });

      let pendingVerifications = 0;

      members.forEach(m => {
        if (m.VerificationStatus === 'Pending Verification') {
          pendingVerifications++;
        }
        if (byGroup[m.Group]) byGroup[m.Group].members++;
        const h = m.House || m.Team || 'Bosco House (Red)';
        if (houseScores[h]) {
          houseScores[h].members++;
          houseScores[h].points += (Number(m.Points) || 0);
        }
      });

      attList.forEach(a => {
        if (a.Date === today) {
          if (byGroup[a.Group]) byGroup[a.Group].todayAttendance++;
          const h = a.House || a.Team || 'Bosco House (Red)';
          if (houseScores[h]) houseScores[h].attendanceToday++;
        }
      });

      return {
        success: true,
        data: {
          totalMembers: members.length,
          activeMembers: members.filter(m => m.VerificationStatus === 'Qualified').length,
          pendingVerifications: pendingVerifications,
          totalAttendance: attList.length,
          todayAttendance: attList.filter(a => a.Date === today).length,
          teamScores: houseScores,
          houseScores: houseScores,
          byGroup: byGroup,
          recentActivity: attList.slice(0, 8)
        }
      };
    }

    return { success: true, data: {} };
  },

  getMembers(params) { return this.call('getMembers', params); },
  getMember(memberID) { return this.call('getMember', { memberID }); },
  addMember(data) { return this.call('addMember', data); },
  updateMember(data) { return this.call('updateMember', data); },
  deleteMember(memberID) { return this.call('deleteMember', { memberID }); },
  verifyMember(memberID, status) { return this.call('verifyMember', { memberID, status }); },
  awardPoints(memberID, points, reason) { return this.call('awardPoints', { memberID, points, reason }); },
  uploadPhoto(base64, memberID) { return this.call('uploadPhoto', { base64, memberID }); },
  markAttendance(data) { return this.call('markAttendance', data); },
  getAttendance(params) { return this.call('getAttendance', params); },
  getDashboard() { return this.call('getDashboard', {}); }
};
