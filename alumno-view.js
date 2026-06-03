document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('alumno-id-input');
  const btn = document.getElementById('alumno-buscar-btn');
  const tableBody = document.getElementById('alumno-result-body');
  const summary = document.getElementById('alumno-summary');
  const exportBtn = document.getElementById('alumno-export-btn');
  const printBtn = document.getElementById('alumno-print-btn');
  const inasistenciasList = document.getElementById('inasistencias-list');
  const examenesList = document.getElementById('examenes-list');
  const horariosList = document.getElementById('horarios-list');
  const studentNameEl = document.getElementById('student-name');
  const studentCourseEl = document.getElementById('student-course');
  const studentAvatar = document.getElementById('student-avatar');
  const studentAverageEl = document.getElementById('student-average');
  const studentGradesSummary = document.getElementById('student-grades-summary');
  const studentExamsSummary = document.getElementById('student-exams-summary');
  const studentAttendanceSummary = document.getElementById('student-attendance-summary');
  const studentScheduleSummary = document.getElementById('student-schedule-summary');
  const openOffcanvasBtn = document.getElementById('student-open-offcanvas');

  let studentMap = {};

  // datos simulados extra por alumno
  const inasistenciasMap = { 777: ['2026-02-10','2026-03-05'] };
  const examenesMap = { 777: [{ title: 'Parcial 1', grade: 4 }, { title: 'Parcial 2', grade: 6 }] };
  const horariosMap = { 777: [{ day: 'Lun', time: '09:00-11:00', subject: 'Alfabetización Digital' }] };
  const storedExamenes = JSON.parse(localStorage.getItem('siu_examenes') || '[]');
  const storedAsistencias = JSON.parse(localStorage.getItem('siu_asistencias') || '[]');
  const storedHorarios = JSON.parse(localStorage.getItem('siu_horarios') || '[]');

  // Intentar cargar datos simulados de alumnos
  fetch('data/alumnos.json').then(r => r.json()).then(list => {
    list.forEach(a => { studentMap[parseInt(a.id)] = a; });
  }).catch(() => { /* no blocking */ });

  btn.addEventListener('click', buscarAlumno);
  input.addEventListener('keypress', e => { if (e.key === 'Enter') buscarAlumno(); });
  exportBtn.addEventListener('click', exportCSV);
  printBtn.addEventListener('click', () => window.print());
  if (openOffcanvasBtn) {
    const offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasAlumno'));
    openOffcanvasBtn.addEventListener('click', () => offcanvas.show());
  }

  // Si existe usuario en sesión y es alumno, autocompletar y bloquear ID
  const sessRaw = sessionStorage.getItem('siu_user');
  const sessUser = (window.SIU_CURRENT_USER) ? window.SIU_CURRENT_USER : (sessRaw ? JSON.parse(sessRaw) : null);
  if (sessUser && sessUser.role === 'student') {
    input.value = sessUser.id;
    input.disabled = true;
    // cargar datos de alumno al abrir el offcanvas
    buscarAlumno();
  }

  function buscarAlumno() {
    const id = parseInt(input.value);
    if (!id || isNaN(id)) return mostrarMensaje('Ingresa un ID válido', 'warning');
    if (typeof materiasRegistradas === 'undefined') return mostrarMensaje('No hay datos de materias cargados', 'danger');

    const encontrados = [];
    materiasRegistradas.forEach(m => {
      if (!Array.isArray(m.calificaciones)) return;
      m.calificaciones.forEach(c => {
        if (c.estudianteId === id) encontrados.push({ materia: m.nombre, evaluacion: c.evaluacionNombre || '-', nota: c.nota });
      });
    });

    tableBody.innerHTML = '';
    if (encontrados.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="3">No se encontraron registros para este alumno.</td></tr>';
      summary.innerText = '';
      return;
    }

    let suma = 0;
    encontrados.forEach(r => {
      suma += r.nota;
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${r.materia}</td><td>${r.evaluacion}</td><td>${r.nota}</td>`;
      tableBody.appendChild(tr);
    });

    const promedio = (suma / encontrados.length).toFixed(2);
    const condicion = promedio >= 7 ? 'Promocionado' : (promedio >= 4 ? 'Regular' : 'Libre');

    // Información del alumno desde data simulada si existe
    const alumnoInfo = studentMap[id];
    let infoHtml = '';
    if (alumnoInfo) {
      const foto = alumnoInfo.photo || 'imgs/avatar-placeholder.png';
      infoHtml = `<div class="d-flex align-items-center gap-2 mb-2"><img src="${foto}" alt="foto" style="width:48px;height:48px;border-radius:6px;object-fit:cover"> <div><div class="fw-bold">${alumnoInfo.name}</div><div class="small text-muted">${alumnoInfo.course || ''} · ID ${id}</div></div></div>`;
    }

    summary.innerHTML = `${infoHtml}<div><strong>Promedio:</strong> ${promedio} &nbsp; <strong>Condición:</strong> ${condicion}</div>`;

    if (studentNameEl) studentNameEl.innerText = alumnoInfo?.name || `Alumno ${id}`;
    if (studentCourseEl) studentCourseEl.innerText = alumnoInfo?.course ? `${alumnoInfo.course} · ID ${id}` : `ID ${id}`;
    if (studentAvatar && alumnoInfo?.photo) studentAvatar.src = alumnoInfo.photo;
    if (studentAverageEl) studentAverageEl.innerText = promedio;
    if (studentGradesSummary) studentGradesSummary.innerHTML = encontrados.length ? `Tienes ${encontrados.length} calificaciones registradas.` : 'No hay calificaciones disponibles.';

    const storedInasistencias = storedAsistencias.filter(a => a.alumnoId === id && a.estado === 'Absent').map(a => `${a.fecha} · ${a.materia}`);
    const ina = (inasistenciasMap[id] || []).concat(storedInasistencias);
    inasistenciasList.innerHTML = ina.length ? ina.map(d => `<div class="mb-2"><i class="fa-solid fa-calendar-xmark text-danger me-2"></i>${d}</div>`).join('') : 'Sin inasistencias registradas.';
    if (studentAttendanceSummary) studentAttendanceSummary.innerText = ina.length ? `${ina.length} faltas` : 'Perfecto, sin inasistencias.';

    const exs = (examenesMap[id] || []).concat(storedExamenes.filter(e => e.alumnoId === id).map(e => ({ title: `${e.materia} (${e.fecha})`, grade: e.nota })));
    examenesList.innerHTML = exs.length ? exs.map(e => `<div class="mb-2"><strong>${e.title}</strong> · Nota: ${e.grade}</div>`).join('') : 'Sin exámenes registrados.';
    if (studentExamsSummary) studentExamsSummary.innerText = exs.length ? `${exs.length} exámenes en el ciclo` : 'No hay exámenes pendientes.';

    const hrs = (horariosMap[id] || []).concat(storedHorarios.filter(h => h.alumnoId === id).map(h => ({ day: h.dia, time: h.hora, subject: h.asignatura })));
    horariosList.innerHTML = hrs.length ? hrs.map(h => `<div class="mb-2"><i class="fa-solid fa-clock text-primary me-2"></i>${h.day} ${h.time} · ${h.subject}</div>`).join('') : 'Sin horarios registrados.';
    if (studentScheduleSummary) studentScheduleSummary.innerText = hrs.length ? `${hrs.length} clases por semana` : 'Horario no disponible.';
  }

  function mostrarMensaje(msg, tipo) {
    summary.innerHTML = `<div class="text-${tipo}">${msg}</div>`;
  }

  function exportCSV() {
    const rows = [];
    const headers = ['Materia','Evaluación','Nota'];
    rows.push(headers.join(','));
    const trs = tableBody.querySelectorAll('tr');
    if (trs.length === 0) return mostrarMensaje('Nada para exportar', 'warning');
    trs.forEach(tr => {
      const cols = Array.from(tr.querySelectorAll('td')).map(td => td.innerText.replace(/,/g, ''));
      if (cols.length === 3) rows.push(cols.join(','));
    });
    const csv = rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alumno_${input.value || 'export'}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

});

