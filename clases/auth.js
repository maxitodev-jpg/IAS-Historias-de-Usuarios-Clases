// auth.js - login and register logic using a simple improvisada DB (localStorage + seeded data)
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const loginUser = document.getElementById('login-username');
  const loginPass = document.getElementById('login-password');
  const loginFeedback = document.getElementById('login-feedback');

  const regForm = document.getElementById('register-form');
  const regName = document.getElementById('reg-name');
  const regEmail = document.getElementById('reg-email');
  const regUser = document.getElementById('reg-username');
  const regPass = document.getElementById('reg-password');
  const regPhoto = document.getElementById('reg-photo');
  const regAvatarPreview = document.getElementById('reg-avatar-preview');
  const regFeedback = document.getElementById('reg-feedback');

  let seededUsers = [];
  fetch('data/users.json').then(r => r.json()).then(d => seededUsers = d).catch(()=> seededUsers = []);

  function loadUsers() {
    const local = JSON.parse(localStorage.getItem('siu_users') || '[]');
    return [...seededUsers, ...local];
  }

  function saveUserToLocal(user) {
    const local = JSON.parse(localStorage.getItem('siu_users') || '[]');
    local.push(user);
    localStorage.setItem('siu_users', JSON.stringify(local));
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    loginFeedback.innerText = '';
    const users = loadUsers();
    const u = users.find(x => x.username === loginUser.value);
    if (!u || u.password !== loginPass.value) {
      loginFeedback.innerHTML = '<div class="text-danger small">Usuario o contraseña incorrectos</div>';
      return;
    }
    // store session
    sessionStorage.setItem('siu_user', JSON.stringify(u));
    window.location.href = 'index.html';
  });

  regPhoto.addEventListener('change', (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => regAvatarPreview.src = reader.result;
    reader.readAsDataURL(f);
  });

  regForm.addEventListener('submit', (e) => {
    e.preventDefault();
    regFeedback.innerText = '';
    if (!regUser.value || !regPass.value || !regName.value) return regFeedback.innerText = 'Completa nombre, usuario y contraseña.';

    const users = loadUsers();
    if (users.find(x => x.username === regUser.value)) return regFeedback.innerText = 'El usuario ya existe.';

    const newId = Date.now() % 1000000; // simple id
    const userObj = {
      id: newId,
      username: regUser.value,
      password: regPass.value,
      role: 'student',
      name: regName.value,
      email: regEmail.value || '',
      photo: regAvatarPreview.src || ''
    };
    saveUserToLocal(userObj);
    // auto-login
    sessionStorage.setItem('siu_user', JSON.stringify(userObj));
    window.location.href = 'index.html';
  });

});
