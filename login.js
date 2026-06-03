document.addEventListener('DOMContentLoaded', () => {
  const loginModalEl = document.getElementById('loginModal');
  const loginModal = new bootstrap.Modal(loginModalEl, { backdrop: 'static', keyboard: false });
  const form = document.getElementById('login-form');
  const usernameInput = document.getElementById('login-username');
  const passwordInput = document.getElementById('login-password');
  const submitBtn = document.getElementById('login-submit');
  const openAlumnoBtn = document.getElementById('btn-open-alumno');
  const navUsuario = document.getElementById('nav-usuario');

  loginModal.show();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = usernameInput.value.trim();
    const pass = passwordInput.value.trim();
    if (!user || !pass) return; // simple validation

    // Simular autenticación exitosa
    sessionStorage.setItem('siu_user', user);
    navUsuario.innerText = user;
    openAlumnoBtn.removeAttribute('disabled');
    loginModal.hide();
  });

});
