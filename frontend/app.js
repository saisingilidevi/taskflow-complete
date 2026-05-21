/* TaskFlow API — Interactive Demo */

function switchTab(id, btn) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  btn.classList.add('active');
}

function toggleEp(head) {
  head.nextElementSibling.classList.toggle('open');
}

let authMode = 'register', isLoggedIn = false, currentRole = 'user', tasks = [];

function toggleAuthMode() {
  authMode = authMode === 'register' ? 'login' : 'register';
  const isReg = authMode === 'register';
  document.getElementById('auth-mode-title').textContent = isReg ? '// register' : '// login';
  document.getElementById('name-group').style.display = isReg ? 'block' : 'none';
  document.getElementById('role-group').style.display = isReg ? 'block' : 'none';
  document.querySelector('#auth-form .btn-green').textContent  = isReg ? 'register →' : 'login →';
  document.querySelector('#auth-form .btn-purple').textContent = isReg ? 'switch to login ↔' : 'switch to register ↔';
  const r = document.getElementById('auth-response');
  r.textContent = '// response will appear here'; r.className = 'resp-box';
}

function makeJWT(email, role) {
  const h = btoa(JSON.stringify({alg:'HS256',typ:'JWT'}));
  const p = btoa(JSON.stringify({sub:email,role,iat:Math.floor(Date.now()/1000),exp:Math.floor(Date.now()/1000)+900}));
  return `${h}.${p}.SIM_SIGNATURE`;
}

function doAuth() {
  const email = document.getElementById('auth-email').value.trim();
  const pass  = document.getElementById('auth-pass').value;
  const name  = document.getElementById('reg-name').value.trim();
  const role  = document.getElementById('auth-role').value;
  const resp  = document.getElementById('auth-response');
  if (!email || !pass || (authMode === 'register' && !name)) {
    resp.textContent = '// 400 Validation failed\n{"success":false,"error":{"code":"VALIDATION_ERROR","message":"All fields required"}}';
    resp.className = 'resp-box resp-err'; return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    resp.textContent = '// 400 Invalid email\n{"success":false,"error":{"code":"INVALID_EMAIL"}}';
    resp.className = 'resp-box resp-err'; return;
  }
  if (pass.length < 8) {
    resp.textContent = '// 400 Weak password\n{"success":false,"error":{"code":"WEAK_PASSWORD","message":"Min 8 chars"}}';
    resp.className = 'resp-box resp-err'; return;
  }
  const token = makeJWT(email, role);
  currentRole = role; isLoggedIn = true;
  const fakeId = crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0;return(c==='x'?r:(r&0x3|0x8)).toString(16)});
  resp.textContent = authMode === 'register'
    ? `// POST /api/v1/auth/register → 201\n{\n  "success": true,\n  "data": {\n    "id": "${fakeId}",\n    "email": "${email}",\n    "role": "${role}"\n  }\n}`
    : `// POST /api/v1/auth/login → 200\n{\n  "accessToken": "${token.substring(0,42)}...",\n  "refreshToken": "eyJ...<7d>",\n  "expiresIn": 900\n}`;
  resp.className = 'resp-box resp-ok';
  document.getElementById('token-area').style.display = 'block';
  document.getElementById('token-display').textContent = 'Bearer ' + token.substring(0,64) + '...';
  const form = document.getElementById('auth-form');
  form.style.opacity = '0.45'; form.style.pointerEvents = 'none';
  tasks = [
    {id:1,title:'Set up Express server',status:'done',priority:'high'},
    {id:2,title:'Implement JWT auth',status:'in_progress',priority:'high'},
    {id:3,title:'Write Swagger API docs',status:'todo',priority:'medium'},
    {id:4,title:'Add Zod validation',status:'todo',priority:'medium'},
    {id:5,title:'Docker deployment',status:'todo',priority:'low'},
  ];
  renderDashboard();
}

function doLogout() {
  isLoggedIn = false; tasks = [];
  document.getElementById('token-area').style.display = 'none';
  const form = document.getElementById('auth-form');
  form.style.opacity = '1'; form.style.pointerEvents = 'auto';
  const resp = document.getElementById('auth-response');
  resp.textContent = '// POST /api/v1/auth/logout → 204 No Content\n// Refresh token revoked in DB';
  resp.className = 'resp-box resp-ok';
  document.getElementById('dashboard-content').style.display = 'none';
  document.getElementById('dashboard-locked').style.display  = 'block';
}

function renderDashboard() {
  document.getElementById('dashboard-locked').style.display  = 'none';
  document.getElementById('dashboard-content').style.display = 'block';
  const sc = {done:'var(--accent)',in_progress:'var(--amber)',todo:'var(--muted)'};
  const pc = {high:'p-high',medium:'p-med',low:'p-low'};
  document.getElementById('task-list').innerHTML = tasks.map(t =>
    `<div class="task-item">
      <div class="task-status" style="background:${sc[t.status]}"></div>
      <span class="task-title">${esc(t.title)}</span>
      <span class="task-priority ${pc[t.priority]}">${t.priority}</span>
      <button class="task-del" onclick="deleteTask(${t.id})">×</button>
    </div>`).join('');
  document.getElementById('role-badge-area').innerHTML = currentRole === 'admin'
    ? '<span class="ep-admin" style="font-size:11px">admin: can view all users\' tasks via GET /tasks/all</span>'
    : '<span style="font-family:var(--mono);font-size:10px;color:var(--muted)">role: user · own tasks only</span>';
}

function addTask() {
  const t = document.getElementById('new-task').value.trim();
  const p = document.getElementById('task-priority').value;
  if (!t) return;
  tasks.push({id:Date.now(),title:t,status:'todo',priority:p});
  document.getElementById('new-task').value = '';
  renderDashboard();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  renderDashboard();
}

function esc(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
