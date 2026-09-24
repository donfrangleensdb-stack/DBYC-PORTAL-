/* DBYC Router - Hash-based SPA routing */
const Router = {
  _routes: {},
  _current: null,

  register(name, fn) { this._routes[name] = fn; },

  navigate(name, params = {}) {
    window.location.hash = '#' + name + (Object.keys(params).length ? '?' + new URLSearchParams(params) : '');
  },

  init() {
    window.addEventListener('hashchange', () => this._resolve());
    this._resolve();
  },

  _resolve() {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    const [name, query] = hash.split('?');
    const params = query ? Object.fromEntries(new URLSearchParams(query)) : {};

    if (!Auth.isLoggedIn() && name !== 'login') {
      this._showLogin();
      return;
    }
    if (Auth.isLoggedIn() && name === 'login') {
      this.navigate('dashboard');
      return;
    }

    this._current = name;
    if (name === 'login') { this._showLogin(); return; }
    this._showApp(name, params);
  },

  _showLogin() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('app-shell').classList.add('hidden');
  },

  _showApp(name, params) {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app-shell').classList.remove('hidden');
    UI.updateNav(name);
    UI.updateUserInfo();
    const fn = this._routes[name];
    if (fn) {
      const container = document.getElementById('view-container');
      container.innerHTML = '';
      fn(container, params);
    } else {
      document.getElementById('view-container').innerHTML = `
        <div class="empty-state"><div class="empty-icon">404</div>
        <div class="empty-title">Page not found</div>
        <div class="empty-desc">The page "${name}" does not exist.</div></div>`;
    }
  }
};
