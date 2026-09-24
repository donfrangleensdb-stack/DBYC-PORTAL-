/* DBYC Reports & Analytics View - 4-Team Championship & Verification Status */
const Reports = {
  async render(container) {
    container.innerHTML = `
      <div class="page-header">
        <div class="page-header-left">
          <div class="page-title">Reports & Points Analytics</div>
          <div class="page-subtitle">4-House championship progress, youth group attendance consistency, and membership metrics</div>
        </div>
        <div class="page-actions">
          <button class="btn btn-primary" onclick="Reports.downloadSummaryCSV()">📥 Export Comprehensive CSV</button>
        </div>
      </div>

      <div class="grid-2" style="margin-bottom:var(--s-6)">
        <div class="card">
          <div class="card-header"><span class="card-title">🏆 4-House Championship Standings</span></div>
          <div class="card-body" id="team-standings-container">
            <div class="loading-overlay"><div class="spinner-lg"></div></div>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><span class="card-title">Youth Groups Attendance Ratio</span></div>
          <div class="card-body" id="group-report-container">
            <div class="loading-overlay"><div class="spinner-lg"></div></div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><span class="card-title">Verified Attendance History</span></div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Member</th>
                <th>Group</th>
                <th>House</th>
                <th>Points</th>
                <th>Method</th>
                <th>Marked By</th>
              </tr>
            </thead>
            <tbody id="reports-att-tbody">
              <tr><td colspan="8" style="text-align:center;padding:var(--s-6)"><div class="spinner-lg" style="margin:0 auto"></div></td></tr>
            </tbody>
          </table>
        </div>
      </div>`;

    await this.loadReportsData();
  },

  _attendanceLogs: [],

  async loadReportsData() {
    const resDash = await API.getDashboard();
    const resAtt = await API.getAttendance({});

    if (resDash.success) {
      const d = resDash.data;
      // 1. Team Standings
      const teamBox = document.getElementById('team-standings-container');
      if (teamBox && d.teamScores) {
        const sorted = [...Utils.TEAMS].sort((a, b) => (d.teamScores[b]?.points || 0) - (d.teamScores[a]?.points || 0));
        const maxPts = Math.max(...sorted.map(t => d.teamScores[t]?.points || 1));

        teamBox.innerHTML = sorted.map((t, idx) => {
          const sc = d.teamScores[t] || { points: 0, members: 0 };
          const pct = Math.round((sc.points / maxPts) * 100);
          const color = Utils.HOUSE_COLORS[t] || Utils.TEAM_COLORS[t] || '#003F8A';
          return `
            <div style="margin-bottom:var(--s-4)">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
                <div>
                  <strong>#${idx+1} ${Utils.teamBadge(t)}</strong>
                  <span style="font-size:var(--text-xs);color:var(--text-muted);margin-left:6px">(${sc.members} members)</span>
                </div>
                <div style="font-weight:800;color:var(--primary)">${sc.points} pts</div>
              </div>
              <div class="progress"><div class="progress-bar" style="width:${pct}%;background:${color}"></div></div>
            </div>`;
        }).join('');
      }

      // 2. Groups Breakdown
      const grpDiv = document.getElementById('group-report-container');
      if (grpDiv && d.byGroup) {
        grpDiv.innerHTML = Utils.GROUPS.map(g => {
          const stats = d.byGroup[g] || { members: 0, todayAttendance: 0 };
          const pct = stats.members > 0 ? Math.round((stats.todayAttendance / stats.members) * 100) : 0;
          return `
            <div style="margin-bottom:var(--s-3)">
              <div style="display:flex;justify-content:space-between;font-size:var(--text-xs);margin-bottom:4px">
                <span>${Utils.groupBadge(g)} <strong>${stats.members} Enrolled</strong></span>
                <span style="font-weight:600">${pct}% active today</span>
              </div>
              <div class="progress"><div class="progress-bar ${pct>=70?'success':pct>=40?'warning':'danger'}" style="width:${pct}%"></div></div>
            </div>`;
        }).join('');
      }
    }

    if (resAtt.success) {
      this._attendanceLogs = resAtt.data || [];
      const tbody = document.getElementById('reports-att-tbody');
      if (tbody) {
        if (!this._attendanceLogs.length) {
          tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:var(--text-muted);padding:var(--s-4)">No attendance recorded yet.</td></tr>`;
        } else {
          tbody.innerHTML = this._attendanceLogs.map(a => `
            <tr>
              <td>${Utils.formatDate(a.Date)}</td>
              <td>${a.Time ? a.Time.slice(0,5) : '-'}</td>
              <td><strong>${Utils.escapeHtml(a.MemberName || '')}</strong></td>
              <td>${Utils.groupBadge(a.Group)}</td>
              <td>${Utils.teamBadge(a.Team)}</td>
              <td><span class="points-chip">+${a.PointsAwarded || 10} pts</span></td>
              <td><span class="badge badge-${a.Method==='QR'?'primary':'info'}">${a.Method || 'QR'}</span></td>
              <td><small>${Utils.escapeHtml(a.MarkedBy || '-')}</small></td>
            </tr>`).join('');
        }
      }
    }
  },

  downloadSummaryCSV() {
    const headers = ['Date', 'Time', 'MemberID', 'MemberName', 'Group', 'Team', 'PointsAwarded', 'Method', 'MarkedBy'];
    const rows = this._attendanceLogs.map(a => [
      a.Date,
      a.Time,
      a.MemberID,
      a.MemberName,
      a.Group,
      a.Team,
      a.PointsAwarded || 10,
      a.Method,
      a.MarkedBy
    ]);
    const csv = Utils.generateCSV(headers, rows);
    Utils.downloadCSV(`DBYC_Attendance_Points_Report_${new Date().toISOString().slice(0,10)}.csv`, csv);
  }
};
