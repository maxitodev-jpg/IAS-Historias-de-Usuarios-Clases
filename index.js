// =============================================================================
// SIU QUECHUA - CONTROLADOR INTERACTIVO TOTAL (index.js)
// =============================================================================

// --- 1. INSTANCIAS DE SEGURIDAD ---
let moduloMateria, moduloCarga, moduloPromedios, moduloCierre, moduloSeguridad, moduloModificaciones, moduloAuditoria;

try { moduloMateria = new MotorConfiguracionMateria(); } catch(e){}
try { moduloCarga = new GestorNotas(); } catch(e){}
try { moduloPromedios = new GeneradorBoletinService(); } catch(e){}
try { moduloCierre = new AuditorCierreActas(); } catch(e){}
try { moduloSeguridad = new FiltroSecurity(); } catch(e){} 
try { moduloModificaciones = new GestorModificaciones(); moduloAuditoria = new SistemaAuditoria(); } catch(e){}

// --- 2. REGISTRO CENTRAL DE DATOS (ESTRUCTURA DE RESPALDO VIVA) ---
let materiasRegistradas = [
    {
        nombre: "Alfabetización Digital",
        calificaciones: [{ estudianteId: 777, nota: 4, evaluacionNombre: "Parcial 1" }]
    }
];

// Elementos de pantalla
const cajaNegra = document.getElementById("caja-negra");
const alertaGlobal = document.getElementById("alerta-sistema");

// --- EVENTO MODULO 1: CREACIÓN DE MATERIAS ---
document.getElementById("btn-crear-materia").addEventListener("click", () => {
    const nombre = document.getElementById("materia-nombre").value;
    const min = document.getElementById("materia-min").value;
    const max = document.getElementById("materia-max").value;

    if(!nombre) return alertar("Ingresa un nombre de materia", "alert-danger");

    if (moduloMateria && typeof moduloMateria.crearConfiguracionMateria === "function") {
        let res = moduloMateria.crearConfiguracionMateria(nombre, ["Parcial 1", "Parcial 2"], min, max);
        materiasRegistradas.push(res);
    } else {
        materiasRegistradas.push({ nombre: nombre, calificaciones: [] });
    }
    loggear(`[MÓDULO 1] Clase Instanciada: Nueva materia "${nombre}" creada en el sistema academicamente. Escala: ${min}-${max}.`, "#0dfd0d");
    alertar(`Materia "${nombre}" creada correctamente.`, "alert-success");
});

// --- EVENTO MODULO 2: CARGA DE NOTAS BASE ---
document.getElementById("btn-cargar-nota").addEventListener("click", () => {
    const id = parseInt(document.getElementById("carga-alumno-id").value);
    const nota = parseFloat(document.getElementById("carga-nota-valor").value);

    if(!id || isNaN(nota)) return alertar("Campos vacíos o incorrectos", "alert-danger");

    // Buscamos la última materia creada
    let matActual = materiasRegistradas[materiasRegistradas.length - 1];
    matActual.calificaciones.push({ estudianteId: id, nota: nota, evaluacionNombre: "Parcial 1" });

    loggear(`[MÓDULO 2] Nota base registrada -> Alumno ID: ${id} sacó un [${nota}] en la materia: "${matActual.nombre}".`, "#ffffff");
    alertar("Nota guardada en el acta temporal.", "alert-success");
});

// --- EVENTO MODULO 3 y 4: MOTOR DE PROMEDIOS ---
document.getElementById("btn-calcular-promedio").addEventListener("click", () => {
    const id = parseInt(document.getElementById("promedio-alumno-id").value);
    if(!id) return alertar("Ingresa un ID válido", "alert-danger");

    let matActual = materiasRegistradas[materiasRegistradas.length - 1];
    let notaObj = matActual.calificaciones.find(c => c.estudianteId === id);

    if(!notaObj) return alertar("El alumno no posee notas cargadas en la materia actual.", "alert-warning");

    let cond = notaObj.nota >= 7 ? "Promocionado" : (notaObj.nota >= 4 ? "Regular" : "Libre");
    loggear(`[MÓDULO 3] Motor de Cálculo -> Alumno: ${id} | Promedio: ${notaObj.nota} | Condición Resultante: ${cond}`, "#ffc107");
});

document.getElementById("btn-desglose-materia").addEventListener("click", () => {
    let matActual = materiasRegistradas[materiasRegistradas.length - 1];
    loggear(`\n--- [MÓDULO 4] DESGLOSE COMPLETO: ${matActual.nombre} ---`, "#ffc107");
    matActual.calificaciones.forEach(c => {
        loggear(`> Alumno ID: ${c.estudianteId} | Evaluación: ${c.evaluacionNombre} | Nota: ${c.nota}`, "#ffffff");
    });
});

// --- EVENTO MODULO 5 y 6: SEGURIDAD Y CIERRE ---
document.getElementById("btn-bloquear-acta").addEventListener("click", () => {
    const selector = document.getElementById("select-estado-acta");
    loggear(`[MÓDULO 5] Auditor de Cierre de Actas fijó el estado general del ciclo a: [${selector.value.toUpperCase()}]`, "#ff4d4d");
    alertar(`Estado de actas guardado como ${selector.value}`, "alert-dark");
});

document.getElementById("btn-test-seguridad").addEventListener("click", () => {
    const selector = document.getElementById("select-estado-acta").value;
    loggear(`\n--- [MÓDULO 6] EJECUTANDO PROTOCOLO ANTI-MODIFICACIÓN ---`, "#ff4d4d");
    if(selector === "Cerrada") {
        loggear("[BLOQUEADO] Seguridad detectó acta cerrada. Se rechazó cualquier alteración de registros en caliente.", "#ff4d4d");
    } else {
        loggear("[PERMITIDO] Seguridad da el visto bueno. El acta sigue abierta a modificaciones del docente.", "#0dfd0d");
    }
});

// --- EVENTO MODULO 7 y 8: TUS MODIFICACIONES (MAXI) ---
document.getElementById("btn-aplicar-mod").addEventListener("click", () => {
    const id = parseInt(document.getElementById("mod-alumno-id").value);
    const nota = parseFloat(document.getElementById("mod-nota-nueva").value);
    const motivo = document.getElementById("mod-motivo").value;
    const estadoActa = document.getElementById("select-estado-acta").value;

    if(!id || isNaN(nota) || !motivo) return alertar("Completa el panel de edición.", "alert-danger");
    if(estadoActa === "Cerrada") return alertar("Operación Abortada: El acta fue cerrada por el auditor (Módulo 5).", "alert-danger");

    let matActual = materiasRegistradas[materiasRegistradas.length - 1];
    let notaObj = matActual.calificaciones.find(c => c.estudianteId === id);

    if(!notaObj) return alertar("El alumno no existe en los registros ordinarios.", "alert-danger");

    if (moduloModificaciones && typeof moduloModificaciones.procesarModificacionNota === "function") {
        let res = moduloModificaciones.procesarModificacionNota(notaObj, nota, motivo, estadoActa);
        if(!res.exitoso) {
            loggear(`[MÓDULO 7 - RECHAZADO] ${res.mensaje}`, "#ff4d4d");
            return alertar(res.mensaje, "alert-danger");
        }
    }

    // Impactamos el cambio
    let notaVieja = notaObj.nota;
    notaObj.nota = nota;
    
    loggear(`[MÓDULO 7 - ÉXITO] Nota modificada. Alumno: ${id}. Nota Vieja: ${notaVieja} -> Nota Nueva: ${nota}`, "#0dfd0d");
    loggear(`[MÓDULO 8] Registro Inmutable: Cambio guardado en la Bitácora de Auditoría Log ID: LOG-${Math.floor(Math.random()*10000)}`, "#00d4ff");
    alertar("Modificación aplicada y auditada en la caja negra.", "alert-success");
    document.getElementById("mod-motivo").value = "";
});

// Limpiador
document.getElementById("btn-limpiar-consola").addEventListener("click", () => { cajaNegra.innerHTML = ""; });

// Utils
function loggear(t, c) {
    const d = document.createElement("div"); d.style.color = c; d.style.marginBottom = "4px"; d.innerText = t;
    cajaNegra.appendChild(d); cajaNegra.scrollTop = cajaNegra.scrollHeight;
}
function alertar(m, c) {
    alertaGlobal.innerText = m; alertaGlobal.className = `alert ${c} mx-4 mb-4 text-center fw-semibold`; alertaGlobal.classList.remove("d-none");
}

// --- DATOS EDUCATIVOS INTERACTIVOS ---
const getEl = (id) => document.getElementById(id);
let examenesRegistrados = JSON.parse(localStorage.getItem('siu_examenes') || '[]');
let asistenciasRegistradas = JSON.parse(localStorage.getItem('siu_asistencias') || '[]');
let certificadosRegistrados = JSON.parse(localStorage.getItem('siu_certificados') || '[]');
let horariosRegistrados = JSON.parse(localStorage.getItem('siu_horarios') || '[]');

function guardarAcademia() {
    localStorage.setItem('siu_examenes', JSON.stringify(examenesRegistrados));
    localStorage.setItem('siu_asistencias', JSON.stringify(asistenciasRegistradas));
    localStorage.setItem('siu_certificados', JSON.stringify(certificadosRegistrados));
    localStorage.setItem('siu_horarios', JSON.stringify(horariosRegistrados));
}

function crearProfesor() {
    const nombre = getEl('prof-name')?.value?.trim();
    const email = getEl('prof-email')?.value?.trim();
    const username = getEl('prof-username')?.value?.trim();
    const password = getEl('prof-password')?.value;
    const feedback = getEl('prof-create-feedback');
    if(!nombre || !email || !username || !password) {
        if(feedback) feedback.innerText = 'Completa todos los campos para crear al profesor.';
        return;
    }
    const storedUsers = JSON.parse(localStorage.getItem('siu_users') || '[]');
    if(storedUsers.some(u => u.username === username)) {
        if(feedback) feedback.innerText = 'Ya existe un usuario con ese nombre.';
        return;
    }
    const nuevo = { id: Date.now() % 1000000, username, password, role: 'professor', name: nombre, email, photo: '' };
    storedUsers.push(nuevo);
    localStorage.setItem('siu_users', JSON.stringify(storedUsers));
    if(feedback) feedback.innerText = `Profesor ${nombre} creado con éxito.`;
}

function actualizarResumenCertificados() {
    const summary = getEl('student-certificates-summary');
    if(!summary) return;
    const user = JSON.parse(sessionStorage.getItem('siu_user') || '{}');
    const certificados = certificadosRegistrados.filter(c => c.email === (user.email || user.username));
    if(!certificados.length) {
        summary.innerText = 'No tienes certificados recientes.';
        return;
    }
    summary.innerHTML = certificados.map(c => `• ${c.titulo} (${c.fecha})`).join('<br>');
}

function solicitarCertificado() {
    const user = JSON.parse(sessionStorage.getItem('siu_user') || '{}');
    const titulo = `Constancia de Rendimiento - ${user.name || user.username}`;
    certificadosRegistrados.push({ email: user.email || user.username, titulo, fecha: new Date().toLocaleDateString('es-AR') });
    guardarAcademia();
    actualizarResumenCertificados();
    actualizarResumenEstudiante();
    alertar('Solicitud de certificado enviada. Revisa tu panel.', 'alert-success');
}

function agregarHorario() {
    const asignatura = prompt('Nombre de la clase');
    const dia = prompt('Día de la semana');
    const hora = prompt('Hora (ej. 10:00)');
    if(!asignatura || !dia || !hora) return;
    const user = JSON.parse(sessionStorage.getItem('siu_user') || '{}');
    horariosRegistrados.push({ asignatura, dia, hora, alumnoId: user.id });
    guardarAcademia();
    actualizarResumenEstudiante();
    alertar('Clase registrada en tu horario semanal.', 'alert-success');
}

function obtenerUsuarioSesion() {
    return JSON.parse(sessionStorage.getItem('siu_user') || 'null');
}

function actualizarResumenEstudiante() {
    const user = obtenerUsuarioSesion();
    if (!user || user.role !== 'student') return;

    const id = user.id;
    const examenes = examenesRegistrados.filter(e => e.alumnoId === id);
    const asistencias = asistenciasRegistradas.filter(a => a.alumnoId === id);
    const horarios = horariosRegistrados.filter(h => h.alumnoId === id);
    const notas = materiasRegistradas.flatMap(m => m.calificaciones
        .filter(c => c.estudianteId === id)
        .map(c => c.nota)
    );

    if (getEl('student-exams-summary')) {
        getEl('student-exams-summary').innerText = examenes.length ? `${examenes.length} examen(es) registrados.` : 'Sin exámenes registrados.';
    }
    if (getEl('student-attendance-summary')) {
        getEl('student-attendance-summary').innerText = asistencias.length ? `${asistencias.length} faltas registradas.` : 'Perfecto, sin inasistencias.';
    }
    if (getEl('student-schedule-summary')) {
        getEl('student-schedule-summary').innerText = horarios.length ? `${horarios.length} clase(s) programadas esta semana.` : 'Horario no disponible.';
    }
    if (getEl('student-grades-summary')) {
        if (notas.length) {
            const promedio = (notas.reduce((sum, n) => sum + n, 0) / notas.length).toFixed(2);
            getEl('student-grades-summary').innerText = `Tienes ${notas.length} calificación(es) registradas. Promedio: ${promedio}`;
            if (getEl('student-average')) getEl('student-average').innerText = promedio;
        } else {
            getEl('student-grades-summary').innerText = 'Busca tu ID para ver tus calificaciones.';
        }
    }
}

function registrarAccion() {
    const alumnoId = parseInt(getEl('registro-alumno-id')?.value);
    const materia = getEl('registro-materia')?.value?.trim();
    const fecha = getEl('registro-fecha')?.value;
    const tipo = getEl('registro-tipo')?.value;
    if(!alumnoId || !materia || !fecha || !tipo) return alertar('Completa todos los campos de registro.', 'alert-danger');

    if(tipo === 'exam') {
        const nota = parseFloat(getEl('registro-nota')?.value);
        if(isNaN(nota)) return alertar('Ingresa una nota válida para examen.', 'alert-danger');
        examenesRegistrados.push({ alumnoId, materia, fecha, nota });
        guardarAcademia();
        alertar('Examen registrado correctamente.', 'alert-success');
    } else {
        const estado = getEl('registro-presente')?.value;
        asistenciasRegistradas.push({ alumnoId, materia, fecha, estado });
        guardarAcademia();
        alertar('Asistencia registrada correctamente.', 'alert-success');
    }
}

function cambiarTipoRegistro() {
    const tipo = getEl('registro-tipo')?.value;
    const notaGroup = getEl('registro-nota-group');
    const presGroup = getEl('registro-presente-group');
    if(tipo === 'exam') {
        notaGroup?.classList.remove('d-none');
        presGroup?.classList.add('d-none');
    } else {
        notaGroup?.classList.add('d-none');
        presGroup?.classList.remove('d-none');
    }
}

if(getEl('btn-crear-profesor')) getEl('btn-crear-profesor').addEventListener('click', crearProfesor);
if(getEl('btn-registrar-acciones')) getEl('btn-registrar-acciones').addEventListener('click', registrarAccion);
if(getEl('registro-tipo')) getEl('registro-tipo').addEventListener('change', cambiarTipoRegistro);
if(getEl('student-request-certificate')) getEl('student-request-certificate').addEventListener('click', solicitarCertificado);
if(getEl('student-add-schedule')) getEl('student-add-schedule').addEventListener('click', agregarHorario);

const translations = {
    es: {
        // NAVBAR
        navAlumno: 'Vista Alumno', navPerfil: 'Mi Perfil', navAjustes: 'Ajustes', btnCerrar: 'Cerrar sesión',
        // PANEL HERO
        studentBadge: 'Panel Estudiante', studentWelcome: 'Bienvenido,', studentRole: 'Rol', studentRoleValue: 'Alumno',
        studentHint: 'Tus materias, notas y responsabilidades académicas aquí.',
        // TARJETAS
        studentPerformance: 'Mi rendimiento', perfHint: 'Promedio general', perfEmpty: 'Calculando...',
        studentExams: 'Próximos exámenes', examEmpty: 'Sin exámenes disponibles.',
        studentAttendance: 'Asistencias', attenEmpty: 'Sin inasistencias registradas.',
        cardHorario: 'Horario semanal', schedHint: 'Repasa tus clases', schedEmpty: 'Cargando horarios...',
        cardCertificados: 'Certificados', certHint: 'Descarga tus constancias', certEmpty: 'No tienes certificados recientes.',
        cardConfiguracion: 'Configuraciones', confHint: 'Preferencias personales',
        // MÓDULOS MENU
        modulosTitle: 'Módulos del Sistema',
        moduloMateria: '1. Creación de Materias', moduloNotas: '2. Carga de Notas Base',
        moduloPromedios: '3 y 4. Motor de Promedios', moduloSeguridad: '5 y 6. Cierre y Seguridad',
        moduloModificaciones: '7 y 8. Modificaciones', moduloProfesores: 'Gestión Profesor',
        // PANEL 1 - MATERIAS
        panelMateriaTitle: 'Motor de Creación y Configuración', materiaNombre: 'Nombre de la Materia',
        materiaNombreHint: 'Introducción al Análisis Sistémico', materiaEscala: 'Escala Mínima / Máxima',
        btnCrearMateria: 'Configurar e Instanciar Materia',
        // PANEL 2 - NOTAS
        panelNotasTitle: 'Gestor de Notas Ordinario', cargaAlumnoId: 'ID Alumno', cargaAlumnoHint: 'Ej: 101',
        cargaNotaValor: 'Nota Obtenida', cargaNotaHint: '1 al 10', btnCargarNota: 'Registrar Nota en Acta',
        // PANEL 3 - PROMEDIOS
        panelPromediosTitle: 'Cálculo de Promedios y Desglose', promedioAlumnoId: 'ID Alumno a Consultar',
        btnCalcularPromedio: 'Calcular Condición y Promedio', btnDesgloseMateria: 'Ver Desglose de Calificaciones',
        // PANEL 4 - SEGURIDAD
        panelSeguridadTitle: 'Auditor de Cierre de Actas', estadoActa: 'Estado de Acta del Ciclo',
        estadoActaAbierta: 'Abierta (Permite Edición)', estadoActaCerrada: 'Cerrada (Bloqueada)',
        btnBloquearActa: 'Simular Cierre Definitivo', btnTestSeguridad: 'Test Anti-Modificación',
        // PANEL 5 - MODIFICACIONES
        panelModificacionesTitle: 'Edición Extemporánea Justificada', modAlumnoId: 'ID Alumno',
        modNotaNueva: 'Nueva Nota', modMotivo: 'Justificación Obligatoria', modMotivoHint: 'Mínimo 15 caracteres...',
        btnAplicarMod: 'Aplicar Cambio Justificado',
        // PANEL PROFESOR
        panelProfesoresTitle: 'Gestión de Profesores', profFormTitle: 'Crear cuenta de profesor',
        profName: 'Nombre', profEmail: 'Email', profUsername: 'Usuario', profPassword: 'Contraseña',
        btnCrearProfesor: 'Crear Profesor', registroFormTitle: 'Registrar Exámenes / Asistencias',
        registroAlumnoId: 'ID Alumno', registroMateria: 'Materia', registroFecha: 'Fecha', registroTipo: 'Tipo',
        registroExam: 'Examen', registroAttendance: 'Asistencia', registroNota: 'Nota', registroNotaHint: '0-10',
        registroPresente: 'Estado', registroPresent: 'Presente', registroAbsent: 'Ausente', btnRegistrarAcciones: 'Registrar',
        // CONSOLE
        btnLimpiarConsola: 'Limpiar Consola',
        // OFFCANVAS
        offcanvasAlumnoTitle: 'Vista del Alumno', alumnoIdInput: 'ID Alumno', alumnoIdHint: 'Ej: 777',
        btnAlumnoBuscar: 'Buscar', tabNotas: 'Notas', tabInasistencias: 'Inasistencias', tabExamenes: 'Exámenes',
        tabHorarios: 'Horarios', tablaMateria: 'Materia', tablaEvaluacion: 'Evaluación', tablaNota: 'Nota',
        notasEmpty: 'Ingrese un ID y presione Buscar.', btnAlumnoExportar: 'Exportar CSV', btnAlumnoImprimir: 'Imprimir',
        // PROFILE MODAL
        profileModalTitle: 'Mi Perfil', profileFoto: 'Foto (opcional)', profileNombre: 'Nombre',
        profileEmail: 'Email', profilePassword: 'Contraseña (nueva)', profileSave: 'Guardar',
        // SETTINGS MODAL
        settingsTitle: 'Ajustes del Sistema', settingsLanguageLabel: 'Idioma de la aplicación',
        settingsThemeLabel: 'Modo oscuro', settingsNotificationsLabel: 'Notificaciones activas',
        settingsSaveBtn: 'Guardar ajustes', settingsSaved: 'Ajustes guardados.',
        // BOTONES Y LINKS
        certificadoBtn: 'Solicitar', idiomaLabel: 'Cambiar idioma', addScheduleBtn: 'Agregar clase',
        verDetalles: 'Ver detalles', buscarBtn: 'Buscar', exportarBtn: 'Exportar CSV', imprimirBtn: 'Imprimir',
        cardCrearProfesor: 'Crear cuenta de profesor', cardRegistrar: 'Registrar Exámenes / Asistencias',
        // MENSAJES
        msgGradesSearchHint: 'Busca tu ID para ver tus calificaciones.', msgNoNotes: 'No tienes certificados recientes.',
        msgNoSchedule: 'Horario no disponible.', msgNoExamsAvailable: 'Sin exámenes disponibles.',
        msgNoAbsentees: 'Perfecto, sin inasistencias.', msgInvalidId: 'Ingresa un ID válido',
        msgEmptyFields: 'Completa todos los campos.', msgInvalidNote: 'Ingresa una nota válida.',
        msgSuccess: 'Guardado exitosamente.',
    },
    qu: {
        navAlumno: 'Ruwanqa Yachay', navPerfil: 'Ñuqanchik Perfil', navAjustes: 'Ajustes', btnCerrar: 'Pachaymanta',
        studentBadge: 'Rimaykuna Qillqa', studentWelcome: 'Ripuy,', studentPerformance: 'Ñawpaq llantakuy',
        studentExams: 'Rikhuriykuna', studentAttendance: 'Asistihina', cardHorario: "Ch'usaywapa Rikhuy",
        cardCertificados: 'Kutichiykuna', cardConfiguracion: "Llamk'aykuna", cardCrearProfesor: 'Yachachiq ruwasqa',
        cardRegistrar: 'Yachachiy qillqay / Asistiriy', certificadoBtn: 'Puriy', idiomaLabel: 'Simi rimaylla',
        settingsTitle: 'Ajustes del Sistema', settingsLanguageLabel: 'Idioma de la aplicación',
        settingsThemeLabel: 'Modo oscuro', settingsNotificationsLabel: 'Notificaciones activas',
        settingsSaveBtn: 'Guardar ajustes', addScheduleBtn: 'Rimay yana', verDetalles: 'Rikuy',
        buscarBtn: 'Masiy', exportarBtn: 'CSV ama', imprimirBtn: 'Qillqay',
    },
    gn: {
        navAlumno: 'Rire Ñandúva', navPerfil: 'Che Perfil', navAjustes: 'Ñemboheko', btnCerrar: 'Oñemoĩ',
        studentBadge: 'Panel Estudiante', studentWelcome: 'Tereg̃ui,', studentPerformance: 'Che Rire',
        studentExams: 'Prueba', studentAttendance: 'Asistencia', cardHorario: 'Momenta',
        cardCertificados: 'Certificado', cardConfiguracion: 'Ñemboheko', cardCrearProfesor: 'Mbo\'e',
        cardRegistrar: 'Rexaka Prueba', certificadoBtn: 'Mbopu', idiomaLabel: 'Ñe\'ẽ',
        settingsTitle: 'Ñemboheko', settingsLanguageLabel: 'Ñe\'ẽ',
        settingsThemeLabel: 'Poru Akã', settingsNotificationsLabel: 'Hekura',
        settingsSaveBtn: 'Ñongatu', addScheduleBtn: 'Moĩ', verDetalles: 'Rikuaa',
        buscarBtn: 'Heka', exportarBtn: 'CSV', imprimirBtn: 'Rexaka',
    },
    arn: {
        navAlumno: 'Ruka Mapuche', navPerfil: 'Mi Pewma', navAjustes: 'Küme', btnCerrar: 'Marichi',
        studentBadge: 'Casa Estudiante', studentWelcome: 'Kidu,', studentPerformance: 'Mi Toki',
        studentExams: 'Kawelikan', studentAttendance: 'Asistencia', cardHorario: 'Antü',
        cardCertificados: 'Kutral', cardConfiguracion: 'Küme', cardCrearProfesor: 'Longko',
        cardRegistrar: 'Kawelikan', certificadoBtn: 'Ñi', idiomaLabel: 'Mapudungun',
        settingsTitle: 'Küme', settingsLanguageLabel: 'Mapudungun',
        settingsThemeLabel: 'Pü Akú', settingsNotificationsLabel: 'Trom',
        settingsSaveBtn: 'Kawelu', addScheduleBtn: 'Molli', verDetalles: 'Rikun',
        buscarBtn: 'Domo', exportarBtn: 'CSV', imprimirBtn: 'Kawelu',
    },
    ay: {
        navAlumno: 'Estudiante Yatiqawi', navPerfil: 'Ñamarka', navAjustes: 'Sartataña', btnCerrar: 'Jupina',
        studentBadge: 'Panel Estudiante', studentWelcome: 'Napayalla,', studentPerformance: 'Yatiqawi',
        studentExams: 'Yatiqawi Nayta', studentAttendance: 'Aru', cardHorario: 'Pacha',
        cardCertificados: 'Pataka', cardConfiguracion: 'Sartataña', cardCrearProfesor: 'Yatichiri',
        cardRegistrar: 'Yatiqawi', certificadoBtn: 'Thakhi', idiomaLabel: 'Aymara',
        settingsTitle: 'Sartataña', settingsLanguageLabel: 'Aymara',
        settingsThemeLabel: 'Layu', settingsNotificationsLabel: 'Kawaru',
        settingsSaveBtn: 'Jap\'i', addScheduleBtn: 'Yapa', verDetalles: 'Rikha',
        buscarBtn: 'Tayka', exportarBtn: 'CSV', imprimirBtn: 'Jap\'i',
    },
    ar: {
        navAlumno: 'Schola Alumnus', navPerfil: 'Meum Profilio', navAjustes: 'Configuratio', btnCerrar: 'Vale',
        studentBadge: 'Tabula Scholaris', studentWelcome: 'Salve,', studentPerformance: 'Meae Virtutes',
        studentExams: 'Examinationes', studentAttendance: 'Praesentia', cardHorario: 'Hora',
        cardCertificados: 'Testimonia', cardConfiguracion: 'Configuratio', cardCrearProfesor: 'Magister',
        cardRegistrar: 'Registrare', certificadoBtn: 'Petere', idiomaLabel: 'Lingua Aramaica',
        settingsTitle: 'Configuratio', settingsLanguageLabel: 'Lingua',
        settingsThemeLabel: 'Obscuritas', settingsNotificationsLabel: 'Notificationes',
        settingsSaveBtn: 'Servare', addScheduleBtn: 'Addere', verDetalles: 'Videre',
        buscarBtn: 'Quaerere', exportarBtn: 'CSV', imprimirBtn: 'Imprimere',
    },
    so: {
        navAlumno: 'Aragga Baruun', navPerfil: 'Profayla Kii', navAjustes: 'Qabaneysiga', btnCerrar: 'Bax',
        studentBadge: 'Kaalka Baruun', studentWelcome: 'Salaam,', studentPerformance: 'Natijadaada',
        studentExams: 'Imtixaanada', studentAttendance: 'Hadka', cardHorario: 'Wakhtiga',
        cardCertificados: 'Shahaadooyinka', cardConfiguracion: 'Qabaneysiga', cardCrearProfesor: 'Macallin',
        cardRegistrar: 'Diiwaangelinta', certificadoBtn: 'Codsad', idiomaLabel: 'Af Soomaali',
        settingsTitle: 'Qabaneysiga', settingsLanguageLabel: 'Af',
        settingsThemeLabel: 'Madow', settingsNotificationsLabel: 'Ogeysiisyo',
        settingsSaveBtn: 'Kaydi', addScheduleBtn: 'Dari', verDetalles: 'Arag',
        buscarBtn: 'Raadi', exportarBtn: 'CSV', imprimirBtn: 'Buufi',
    },
    la: {
        navAlumno: 'Visus Discipuli', navPerfil: 'Meum Profilum', navAjustes: 'Optiones', btnCerrar: 'Exire',
        studentBadge: 'Tabula Discipuli', studentWelcome: 'Salve,', studentPerformance: 'Mei Eventus',
        studentExams: 'Examinationes', studentAttendance: 'Absentia', cardHorario: 'Horarium',
        cardCertificados: 'Testimonia', cardConfiguracion: 'Optiones', cardCrearProfesor: 'Magister',
        cardRegistrar: 'Examen Registrare', certificadoBtn: 'Petere', idiomaLabel: 'Lingua Latina',
        settingsTitle: 'Systematis Config', settingsLanguageLabel: 'Lingua',
        settingsThemeLabel: 'Modus Tenebrae', settingsNotificationsLabel: 'Notificationes',
        settingsSaveBtn: 'Servare', addScheduleBtn: 'Addere', verDetalles: 'Videre',
        buscarBtn: 'Quaerere', exportarBtn: 'CSV', imprimirBtn: 'Imprimere',
    },
    vl: {
        navAlumno: 'Vista Botellero', navPerfil: 'Mi Perfil Villero', navAjustes: 'Configuraciones', btnCerrar: 'Chetarse',
        studentBadge: 'Panel Botellero', studentWelcome: 'Che,', studentPerformance: 'Mi Rendimiento',
        studentExams: 'Exámenes che', studentAttendance: 'Asistencia boleta', cardHorario: 'Horario del Chetaje',
        cardCertificados: 'Certificadillos', cardConfiguracion: 'Configuraciones boleta', cardCrearProfesor: 'Profe che',
        cardRegistrar: 'Registrar che', certificadoBtn: 'Mandale', idiomaLabel: 'Idioma Villero',
        settingsTitle: 'Ajustes che', settingsLanguageLabel: 'Idioma boleta',
        settingsThemeLabel: 'Modo oscuro che', settingsNotificationsLabel: 'Notificaciones boleta',
        settingsSaveBtn: 'Guardalo', addScheduleBtn: 'Agregá', verDetalles: 'Mirá',
        buscarBtn: 'Buscá', exportarBtn: 'CSV boleta', imprimirBtn: 'Imprimí',
    },
    pp: {
        navAlumno: 'Visión Alumno', navPerfil: 'Mi Espíritu', navAjustes: 'Sabiduría', btnCerrar: 'Partir',
        studentBadge: 'Casa del Aprendizaje', studentWelcome: 'Hermano,', studentPerformance: 'Mi Camino',
        studentExams: 'Pruebas de Espíritu', studentAttendance: 'Presencia', cardHorario: 'Tiempo Sagrado',
        cardCertificados: 'Reconocimiento', cardConfiguracion: 'Sabiduría', cardCrearProfesor: 'Sabio',
        cardRegistrar: 'Registrar Aprendizaje', certificadoBtn: 'Solicitar Bendición', idiomaLabel: 'Lengua PaiPai',
        settingsTitle: 'Configuración Sagrada', settingsLanguageLabel: 'Lengua Espiritual',
        settingsThemeLabel: 'Modo Nocturno', settingsNotificationsLabel: 'Avisos Espirituales',
        settingsSaveBtn: 'Guardar Sabiduría', addScheduleBtn: 'Añadir Tiempo', verDetalles: 'Ver Misterios',
        buscarBtn: 'Buscar Verdad', exportarBtn: 'CSV Espiritual', imprimirBtn: 'Imprimir Alma',
    },
    dog: {
        navAlumno: 'Guau Guau Woof', navPerfil: 'Mi Huella', navAjustes: 'Olfato Ajustes', btnCerrar: '¡A Dormir!',
        studentBadge: 'Panel Canino', studentWelcome: 'Wuf Wuf,', studentPerformance: 'Mi Hora de Paseo',
        studentExams: 'Huesitos de Prueba', studentAttendance: 'Asistencia de Paseo', cardHorario: 'Hora de Paseo',
        cardCertificados: 'Huesos Certificados', cardConfiguracion: 'Olfato del Perro', cardCrearProfesor: 'Entrenador Guau',
        cardRegistrar: 'Registrar Ladridos', certificadoBtn: 'Ladra Fuerte', idiomaLabel: 'Idioma Perro',
        settingsTitle: 'Ajustes Perrunos', settingsLanguageLabel: 'Idioma Canino',
        settingsThemeLabel: 'Modo Luna Negra', settingsNotificationsLabel: 'Sonidos de Alerta',
        settingsSaveBtn: 'Guardar Hueso', addScheduleBtn: 'Agregar Paseo', verDetalles: 'Olfatear',
        buscarBtn: 'Olfatear', exportarBtn: 'CSV Ladrido', imprimirBtn: 'Marcar Territorio',
    }
};
function aplicarIdioma(codigo) {
    const t = translations[codigo] || translations.es;
    const elementos = {
        'btn-open-alumno': `<i class="fa-solid fa-user-graduate me-1"></i> ${t.navAlumno}`,
        'btn-open-profile': `<i class="fa-solid fa-user me-1"></i> ${t.navPerfil}`,
        'btn-open-settings': `<i class="fa-solid fa-gear me-1"></i> ${t.navAjustes}`,
        'btn-logout': `<i class="fa-solid fa-right-from-bracket me-1"></i>${t.btnCerrar}`,
        'student-panel-badge': t.studentBadge,
        'student-welcome': t.studentWelcome,
        'student-performance-title': t.studentPerformance,
        'student-exams-title': t.studentExams,
        'student-attendance-title': t.studentAttendance,
        'student-horario-title': t.cardHorario,
        'student-certificados-title': t.cardCertificados,
        'student-config-title': t.cardConfiguracion,
        'language-switcher-label': t.idiomaLabel,
        'settingsModalLabel': t.settingsTitle,
        'settings-language-label': t.settingsLanguageLabel,
        'settings-theme-label': t.settingsThemeLabel,
        'settings-notifications-label': t.settingsNotificationsLabel,
        'settings-save': t.settingsSaveBtn,
        'student-add-schedule': t.addScheduleBtn,
        'student-open-offcanvas': t.verDetalles,
        'alumno-buscar-btn': t.buscarBtn,
        'alumno-export-btn': t.exportarBtn,
        'alumno-print-btn': t.imprimirBtn,
        'btn-crear-profesor': t.cardCrearProfesor,
        'btn-registrar-acciones': t.cardRegistrar,
        'student-request-certificate': t.certificadoBtn,
    };
    
    Object.keys(elementos).forEach(id => {
        const el = getEl(id);
        if (!el) return;
        if (id.includes('btn-')) {
            el.innerHTML = elementos[id];
        } else {
            el.innerText = elementos[id];
        }
    });
}


const languageSelector = getEl('language-switcher');
const settingsLanguageSelector = getEl('settings-language');
const settingsDarkMode = getEl('settings-darkmode');
const settingsNotifications = getEl('settings-notifications');
const settingsSaveBtn = getEl('settings-save');

function cargarPreferencias() {
    const saved = localStorage.getItem('siu_language') || 'es';
    if(languageSelector) languageSelector.value = saved;
    if(settingsLanguageSelector) settingsLanguageSelector.value = saved;
    aplicarIdioma(saved);
    const darkValue = localStorage.getItem('siu_darkmode') === 'true';
    if(settingsDarkMode) settingsDarkMode.checked = darkValue;
    document.body.classList.toggle('dark-mode', darkValue);
    const notifyValue = localStorage.getItem('siu_notifications') !== 'false';
    if(settingsNotifications) settingsNotifications.checked = notifyValue;
}

function setLanguage(value) {
    localStorage.setItem('siu_language', value);
    if(languageSelector) languageSelector.value = value;
    if(settingsLanguageSelector) settingsLanguageSelector.value = value;
    aplicarIdioma(value);
}

if(languageSelector) {
    languageSelector.addEventListener('change', (e) => {
        setLanguage(e.target.value);
    });
}
if(settingsLanguageSelector) {
    settingsLanguageSelector.addEventListener('change', (e) => {
        setLanguage(e.target.value);
    });
}
if(settingsSaveBtn) {
    settingsSaveBtn.addEventListener('click', () => {
        if(settingsDarkMode) localStorage.setItem('siu_darkmode', settingsDarkMode.checked ? 'true' : 'false');
        if(settingsNotifications) localStorage.setItem('siu_notifications', settingsNotifications.checked ? 'true' : 'false');
        cargarPreferencias();
        alertar('Ajustes guardados.', 'alert-success');
    });
}

cargarPreferencias();

actualizarResumenCertificados();
actualizarResumenEstudiante();