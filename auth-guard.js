// Redirect to login if no session; expose current user to other scripts
document.addEventListener('DOMContentLoaded', () => {
  const raw = sessionStorage.getItem('siu_user');
  if (!raw) {
    // allow index.html to be opened directly for development if user confirms
    window.location.href = 'login.html';
    return;
  }
  try {
    const user = JSON.parse(raw);
    window.SIU_CURRENT_USER = user;
    // show user in navbar
    const navUser = document.getElementById('nav-usuario');
    if (navUser) navUser.innerText = user.name || user.username;

    // role-based UI adjustments
  const adminRow = document.querySelector('.container-fluid > .row:nth-of-type(2)');
  const studentDashboard = document.getElementById('student-dashboard');
  const btnOpenProfile = document.getElementById('btn-open-profile');
  const btnLogout = document.getElementById('btn-logout');
  if (btnOpenProfile) btnOpenProfile.removeAttribute('disabled');
  if (btnLogout) {
    btnLogout.removeAttribute('disabled');
    btnLogout.addEventListener('click', () => {
      sessionStorage.removeItem('siu_user');
      window.location.href = 'login.html';
    });
  }
  if (user.role === 'student') {
    if (adminRow) adminRow.style.display = 'none';
    if (studentDashboard) studentDashboard.classList.remove('d-none');
    const brand = document.querySelector('.navbar-brand');
    if (brand) brand.innerHTML = '<img src="imgs/Tawa_chakana.png" class="tawa"> SIU Quechua - Panel Estudiante';
    const btnOpenAlumno = document.getElementById('btn-open-alumno');
    if (btnOpenAlumno) btnOpenAlumno.removeAttribute('disabled');
    const profTabs = document.querySelectorAll('.prof-only');
    profTabs.forEach(el => el.classList.add('d-none'));
    if (studentDashboard) {
      const roleLabel = document.getElementById('student-role');
      if (roleLabel) roleLabel.innerText = 'Alumno';
    }
  } else {
    if (studentDashboard) studentDashboard.classList.add('d-none');
    const profTabs = document.querySelectorAll('.prof-only');
    profTabs.forEach(el => el.classList.remove('d-none'));
  }
  } catch (e) { window.location.href = 'login.html'; }
});
