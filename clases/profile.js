document.addEventListener('DOMContentLoaded', () => {
  const raw = sessionStorage.getItem('siu_user');
  if (!raw) return;
  let user = JSON.parse(raw);

  // Enable navbar controls
  const btnOpenAlumno = document.getElementById('btn-open-alumno');
  const btnOpenProfile = document.getElementById('btn-open-profile');
  if (btnOpenAlumno) btnOpenAlumno.removeAttribute('disabled');
  if (btnOpenProfile) btnOpenProfile.removeAttribute('disabled');

  // Profile modal elements
  const photoInput = document.getElementById('profile-photo');
  const photoPreview = document.getElementById('profile-photo-preview');
  const nameInput = document.getElementById('profile-name');
  const emailInput = document.getElementById('profile-email');
  const passInput = document.getElementById('profile-password');
  const saveBtn = document.getElementById('profile-save');

  function refreshUI() {
    const navUser = document.getElementById('nav-usuario');
    if (navUser) navUser.innerText = user.name || user.username;
    if (photoPreview && user.photo) photoPreview.src = user.photo;
    if (nameInput) nameInput.value = user.name || '';
    if (emailInput) emailInput.value = user.email || '';
  }

  refreshUI();

  photoInput.addEventListener('change', (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => { photoPreview.src = r.result; };
    r.readAsDataURL(f);
  });

  saveBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // update user object
    user.name = nameInput.value || user.name;
    user.email = emailInput.value || user.email;
    if (passInput.value) user.password = passInput.value;
    if (photoPreview.src) user.photo = photoPreview.src;

    // persist to localStorage users (replace by username)
    const local = JSON.parse(localStorage.getItem('siu_users') || '[]');
    const idx = local.findIndex(u => u.username === user.username);
    if (idx >= 0) { local[idx] = user; }
    else { local.push(user); }
    localStorage.setItem('siu_users', JSON.stringify(local));

    // update session
    sessionStorage.setItem('siu_user', JSON.stringify(user));
    // update UI
    const modalEl = document.getElementById('profileModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
    const navUser = document.getElementById('nav-usuario'); if (navUser) navUser.innerText = user.name || user.username;
  });
});
