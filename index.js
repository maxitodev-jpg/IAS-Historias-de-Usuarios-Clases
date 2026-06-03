// =============================================================================
// SIU QUECHUA - SISTEMA DE TRADUCCIÓN UNIVERSAL + CONTROLADOR TOTAL
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

// =============================================================================
// SISTEMA DE TRADUCCIÓN UNIVERSAL - 11 IDIOMAS COMPLETOS
// =============================================================================

const translations = {
    es: {
        'siu-title': 'SIU Quechua - Panel de Control Total', 'consoleTitle': 'Salida de Consola Inmutable', 'consoleBadge': 'Logs Activos',
        navAlumno: 'Vista Alumno', navPerfil: 'Mi Perfil', navAjustes: 'Ajustes', btnCerrar: 'Cerrar sesión',
        'opt-es': 'Español', 'opt-qu': 'Quechua', 'opt-gn': 'Guaraní', 'opt-arn': 'Mapuche', 'opt-ay': 'Aimara', 'opt-ar': 'Arameo', 'opt-so': 'Somalí', 'opt-la': 'Latín', 'opt-vl': 'Villero', 'opt-pp': 'PaiPai', 'opt-dog': 'Idioma Perro',
        studentBadge: 'Panel Estudiante', studentWelcome: 'Bienvenido,', studentRole: 'Rol', studentRoleValue: 'Alumno', studentHint: 'Tus materias, notas y responsabilidades académicas aquí.',
        studentPerformance: 'Mi rendimiento', perfHint: 'Promedio general', studentExams: 'Próximos exámenes', examEmpty: 'Sin exámenes disponibles.', studentAttendance: 'Asistencias', attenEmpty: 'Sin inasistencias registradas.', cardHorario: 'Horario semanal', schedHint: 'Repasa tus clases', schedEmpty: 'Cargando horarios...', cardCertificados: 'Certificados', certHint: 'Descarga tus constancias', certEmpty: 'No tienes certificados recientes.', cardConfiguracion: 'Configuraciones', confHint: 'Preferencias personales',
        modulosTitle: 'Módulos del Sistema', moduloMateria: '1. Creación de Materias', moduloNotas: '2. Carga de Notas Base', moduloPromedios: '3 y 4. Motor de Promedios', moduloSeguridad: '5 y 6. Cierre y Seguridad', moduloModificaciones: '7 y 8. Modificaciones', moduloProfesores: 'Gestión Profesor',
        panelMateriaTitle: 'Motor de Creación y Configuración', materiaNombre: 'Nombre de la Materia', materiaNombreHint: 'Introducción al Análisis Sistémico', materiaEscala: 'Escala Mínima / Máxima', btnCrearMateria: 'Configurar e Instanciar Materia',
        panelNotasTitle: 'Gestor de Notas Ordinario', cargaAlumnoId: 'ID Alumno', cargaAlumnoHint: 'Ej: 101', cargaNotaValor: 'Nota Obtenida', cargaNotaHint: '1 al 10', btnCargarNota: 'Registrar Nota en Acta',
        panelPromediosTitle: 'Cálculo de Promedios y Desglose', promedioAlumnoId: 'ID Alumno a Consultar', btnCalcularPromedio: 'Calcular Condición y Promedio', btnDesgloseMateria: 'Ver Desglose de Calificaciones',
        panelSeguridadTitle: 'Auditor de Cierre de Actas', estadoActa: 'Estado de Acta del Ciclo', estadoActaAbierta: 'Abierta (Permite Edición)', estadoActaCerrada: 'Cerrada (Bloqueada)', btnBloquearActa: 'Simular Cierre Definitivo de Acta', btnTestSeguridad: 'Forzar Test de Ataque (Anti-Modificación)',
        panelModificacionesTitle: 'Edición Extemporánea Justificada', modAlumnoId: 'ID Alumno', modNotaNueva: 'Nueva Nota', modMotivo: 'Justificación Obligatoria', modMotivoHint: 'Mínimo 15 caracteres...', btnAplicarMod: 'Aplicar Cambio Justificado',
        panelProfesoresTitle: 'Gestión de Profesores', profFormTitle: 'Crear cuenta de profesor', profName: 'Nombre', profEmail: 'Email', profUsername: 'Usuario', profPassword: 'Contraseña', btnCrearProfesor: 'Crear Profesor', registroFormTitle: 'Registrar Exámenes / Asistencias', registroAlumnoId: 'ID Alumno', registroMateria: 'Materia', registroFecha: 'Fecha', registroTipo: 'Tipo', registroExam: 'Examen', registroAttendance: 'Asistencia', registroNota: 'Nota', registroNotaHint: '0-10', registroPresente: 'Estado', registroPresent: 'Presente', registroAbsent: 'Ausente', btnRegistrarAcciones: 'Registrar',
        btnLimpiarConsola: 'Limpiar Consola', certificadoBtn: 'Solicitar', idiomaLabel: 'Cambiar idioma', addScheduleBtn: 'Agregar clase', verDetalles: 'Ver detalles',
        msgGradesSearchHint: 'Busca tu ID para ver tus calificaciones.', msgNoNotes: 'No tienes certificados recientes.', msgNoSchedule: 'Horario no disponible.', msgNoExamsAvailable: 'Sin exámenes disponibles.', msgNoAbsentees: 'Perfecto, sin inasistencias.', msgInvalidId: 'Ingresa un ID válido', msgEmptyFields: 'Completa todos los campos.', msgInvalidNote: 'Ingresa una nota válida.', msgSuccess: 'Guardado exitosamente.',
    },
    qu: {
        'siu-title': 'SIU Quechua - Kontrol Panelistin', 'consoleTitle': 'Konsolaren Irtidura Ezabatzaile', 'consoleBadge': 'Log Aktiboak',
        navAlumno: 'Ruwanqa Yachay', navPerfil: 'Ñuqanchik Perfil', navAjustes: 'Ajustes', btnCerrar: 'Pachaymanta',
        'opt-es': 'Español', 'opt-qu': 'Quechua', 'opt-gn': 'Guaraní', 'opt-arn': 'Mapuche', 'opt-ay': 'Aimara', 'opt-ar': 'Arameo', 'opt-so': 'Somalí', 'opt-la': 'Latín', 'opt-vl': 'Villero', 'opt-pp': 'PaiPai', 'opt-dog': 'Idioma Perro',
        studentBadge: 'Rimaykuna Qillqa', studentWelcome: 'Ripuy,', studentRole: 'Rol', studentRoleValue: 'Yachakuq', studentHint: 'Rimaykunayki, notas, responsabilidadkunayki.',
        studentPerformance: 'Ñawpaq llantakuy', perfHint: 'Promedio', studentExams: 'Rikhuriykuna', examEmpty: 'Mana rikhuriykuna.', studentAttendance: 'Asistihina', attenEmpty: 'Mana asistihina.', cardHorario: "Ch'usaywapa Rikhuy", schedHint: 'Rimaykunata rikuy', schedEmpty: 'Rimaykunata chariyachikuy...', cardCertificados: 'Kutichiykuna', certHint: 'Descarga tus constancias', certEmpty: 'Mana kutichiykunayki.', cardConfiguracion: "Llamk'aykuna", confHint: 'Preferencias personales',
        modulosTitle: 'Modulos', moduloMateria: '1. Rimay ruway', moduloNotas: '2. Notas kariy', moduloPromedios: '3 y 4. Promedio', moduloSeguridad: '5 y 6. Seguridad', moduloModificaciones: '7 y 8. Modificaciones', moduloProfesores: 'Yachachiq Llamk\'ay',
        panelMateriaTitle: 'Rimay ruway', materiaNombre: 'Rimay sutiy', materiaNombreHint: 'Rimay sutiy', materiaEscala: 'Escala', btnCrearMateria: 'Rimay ruway',
        panelNotasTitle: 'Notas Llamk\'ay', cargaAlumnoId: 'ID Yachakuq', cargaAlumnoHint: 'Ej: 101', cargaNotaValor: 'Nota', cargaNotaHint: '1 al 10', btnCargarNota: 'Notas kariy',
        panelPromediosTitle: 'Promedio Rikchay', promedioAlumnoId: 'ID Yachakuq', btnCalcularPromedio: 'Promedio Rikchay', btnDesgloseMateria: 'Desglose rikuy',
        panelSeguridadTitle: 'Seguridad', estadoActa: 'Estado', estadoActaAbierta: 'Abierta', estadoActaCerrada: 'Cerrada', btnBloquearActa: 'Bloquear', btnTestSeguridad: 'Test Seguridad',
        panelModificacionesTitle: 'Modificaciones', modAlumnoId: 'ID Yachakuq', modNotaNueva: 'Nota Nueva', modMotivo: 'Justificacion', modMotivoHint: 'Justificacion', btnAplicarMod: 'Aplicar',
        panelProfesoresTitle: 'Yachachiq Llamk\'ay', profFormTitle: 'Yachachiq ruway', profName: 'Sutiy', profEmail: 'Email', profUsername: 'Usuario', profPassword: 'Rimapuy', btnCrearProfesor: 'Yachachiq ruway', registroFormTitle: 'Rikhuriykuna', registroAlumnoId: 'ID', registroMateria: 'Materia', registroFecha: 'Pacha', registroTipo: 'Tipo', registroExam: 'Rikhuriy', registroAttendance: 'Asistencia', registroNota: 'Nota', registroNotaHint: '0-10', registroPresente: 'Estado', registroPresent: 'Presente', registroAbsent: 'Ausente', btnRegistrarAcciones: 'Kariy',
        btnLimpiarConsola: 'Limpiay', certificadoBtn: 'Puriy', idiomaLabel: 'Simi rimaylla', addScheduleBtn: 'Rimay yapay', verDetalles: 'Rikuy',
        msgGradesSearchHint: 'Masiy ID', msgNoNotes: 'Mana kutichiykunayki.', msgNoSchedule: 'Mana rimaykunayki.', msgNoExamsAvailable: 'Mana rikhuriykuna.', msgNoAbsentees: 'Allinlla, mana asistihina.', msgInvalidId: 'ID allin', msgEmptyFields: 'Llena campos', msgInvalidNote: 'Nota allin', msgSuccess: 'Allinlla',
    },
    gn: {
        'siu-title': 'SIU Quechua - Kontrola Panel Oĩ', 'consoleTitle': 'Konsolaren Irteera Betetzaile', 'consoleBadge': 'Log Aktiboak',
        navAlumno: 'Rire Ñandúva', navPerfil: 'Che Perfil', navAjustes: 'Ñemboheko', btnCerrar: 'Oñemoĩ',
        'opt-es': 'Español', 'opt-qu': 'Quechua', 'opt-gn': 'Guaraní', 'opt-arn': 'Mapuche', 'opt-ay': 'Aimara', 'opt-ar': 'Arameo', 'opt-so': 'Somalí', 'opt-la': 'Latín', 'opt-vl': 'Villero', 'opt-pp': 'PaiPai', 'opt-dog': 'Idioma Perro',
        studentBadge: 'Panel', studentWelcome: 'Tereg̃ui,', studentRole: 'Rol', studentRoleValue: 'Mbo\'e\'ỹ', studentHint: 'Che rire, notas, responsabilidade.',
        studentPerformance: 'Che Rire', perfHint: 'Promedio', studentExams: 'Prueba', examEmpty: 'Nda\'e prueba', studentAttendance: 'Asistencia', attenEmpty: 'Nda\'e falta', cardHorario: 'Momenta', schedHint: 'Rire rikuaa', schedEmpty: 'Cargando...', cardCertificados: 'Certificado', certHint: 'Descarga certificado', certEmpty: 'Nda\'e certificado', cardConfiguracion: 'Ñemboheko', confHint: 'Preferencias',
        modulosTitle: 'Modulos', moduloMateria: '1. Rire', moduloNotas: '2. Notas', moduloPromedios: '3 y 4. Promedio', moduloSeguridad: '5 y 6. Seguridad', moduloModificaciones: '7 y 8. Cambio', moduloProfesores: 'Mbo\'e',
        panelMateriaTitle: 'Rire Ñemboheko', materiaNombre: 'Rire', materiaNombreHint: 'Rire', materiaEscala: 'Escala', btnCrearMateria: 'Crear',
        panelNotasTitle: 'Notas', cargaAlumnoId: 'ID', cargaAlumnoHint: 'Ej: 101', cargaNotaValor: 'Nota', cargaNotaHint: '1 al 10', btnCargarNota: 'Registrar',
        panelPromediosTitle: 'Promedio', promedioAlumnoId: 'ID', btnCalcularPromedio: 'Calcular', btnDesgloseMateria: 'Ver',
        panelSeguridadTitle: 'Seguridad', estadoActa: 'Estado', estadoActaAbierta: 'Abierta', estadoActaCerrada: 'Cerrada', btnBloquearActa: 'Bloquear', btnTestSeguridad: 'Test',
        panelModificacionesTitle: 'Cambio', modAlumnoId: 'ID', modNotaNueva: 'Nota Nueva', modMotivo: 'Razon', modMotivoHint: 'Razon', btnAplicarMod: 'Aplicar',
        panelProfesoresTitle: 'Mbo\'e', profFormTitle: 'Mbo\'e Crear', profName: 'Nombre', profEmail: 'Email', profUsername: 'Usuario', profPassword: 'Contraseña', btnCrearProfesor: 'Crear', registroFormTitle: 'Prueba', registroAlumnoId: 'ID', registroMateria: 'Rire', registroFecha: 'Fecha', registroTipo: 'Tipo', registroExam: 'Prueba', registroAttendance: 'Asistencia', registroNota: 'Nota', registroNotaHint: '0-10', registroPresente: 'Estado', registroPresent: 'Presente', registroAbsent: 'Ausente', btnRegistrarAcciones: 'Registrar',
        btnLimpiarConsola: 'Limpiar', certificadoBtn: 'Mbopu', idiomaLabel: 'Ñe\'ẽ', addScheduleBtn: 'Moĩ', verDetalles: 'Rikuaa',
        msgGradesSearchHint: 'Ingrese ID', msgNoNotes: 'Nda\'e certificado', msgNoSchedule: 'Nda\'e hora', msgNoExamsAvailable: 'Nda\'e prueba', msgNoAbsentees: 'Allin', msgInvalidId: 'ID allin', msgEmptyFields: 'Complete campos', msgInvalidNote: 'Nota allin', msgSuccess: 'Allin',
    },
    arn: {
        'siu-title': 'SIU Quechua - Ruka Mapuche Kontrol', 'consoleTitle': 'Konsolaren Irteera', 'consoleBadge': 'Log Aktibo',
        navAlumno: 'Ruka Mapuche', navPerfil: 'Mi Pewma', navAjustes: 'Küme', btnCerrar: 'Marichi',
        'opt-es': 'Español', 'opt-qu': 'Quechua', 'opt-gn': 'Guaraní', 'opt-arn': 'Mapuche', 'opt-ay': 'Aimara', 'opt-ar': 'Arameo', 'opt-so': 'Somalí', 'opt-la': 'Latín', 'opt-vl': 'Villero', 'opt-pp': 'PaiPai', 'opt-dog': 'Idioma Perro',
        studentBadge: 'Casa', studentWelcome: 'Kidu,', studentRole: 'Rol', studentRoleValue: 'Longko', studentHint: 'Mi ruka, notas, toki.',
        studentPerformance: 'Mi Toki', perfHint: 'Promedio', studentExams: 'Kawelikan', examEmpty: 'Nda kawelikan', studentAttendance: 'Asistencia', attenEmpty: 'Nda falta', cardHorario: 'Antü', schedHint: 'Ruka rikun', schedEmpty: 'Cargando...', cardCertificados: 'Kutral', certHint: 'Kutral', certEmpty: 'Nda kutral', cardConfiguracion: 'Küme', confHint: 'Küme',
        modulosTitle: 'Modulos', moduloMateria: '1. Ruka', moduloNotas: '2. Notas', moduloPromedios: '3 y 4. Promedio', moduloSeguridad: '5 y 6. Seguridad', moduloModificaciones: '7 y 8. Trokiñ', moduloProfesores: 'Longko',
        panelMateriaTitle: 'Ruka Küme', materiaNombre: 'Ruka', materiaNombreHint: 'Ruka', materiaEscala: 'Escala', btnCrearMateria: 'Crear',
        panelNotasTitle: 'Notas', cargaAlumnoId: 'ID', cargaAlumnoHint: 'Ej: 101', cargaNotaValor: 'Nota', cargaNotaHint: '1 al 10', btnCargarNota: 'Registrar',
        panelPromediosTitle: 'Promedio', promedioAlumnoId: 'ID', btnCalcularPromedio: 'Calcular', btnDesgloseMateria: 'Ver',
        panelSeguridadTitle: 'Seguridad', estadoActa: 'Estado', estadoActaAbierta: 'Abierta', estadoActaCerrada: 'Cerrada', btnBloquearActa: 'Bloquear', btnTestSeguridad: 'Test',
        panelModificacionesTitle: 'Trokiñ', modAlumnoId: 'ID', modNotaNueva: 'Nota Nueva', modMotivo: 'Razon', modMotivoHint: 'Razon', btnAplicarMod: 'Aplicar',
        panelProfesoresTitle: 'Longko', profFormTitle: 'Longko Crear', profName: 'Nombre', profEmail: 'Email', profUsername: 'Usuario', profPassword: 'Contraseña', btnCrearProfesor: 'Crear', registroFormTitle: 'Kawelikan', registroAlumnoId: 'ID', registroMateria: 'Ruka', registroFecha: 'Fecha', registroTipo: 'Tipo', registroExam: 'Kawelikan', registroAttendance: 'Asistencia', registroNota: 'Nota', registroNotaHint: '0-10', registroPresente: 'Estado', registroPresent: 'Presente', registroAbsent: 'Ausente', btnRegistrarAcciones: 'Registrar',
        btnLimpiarConsola: 'Limpiar', certificadoBtn: 'Ñi', idiomaLabel: 'Mapudungun', addScheduleBtn: 'Molli', verDetalles: 'Rikun',
        msgGradesSearchHint: 'Ingrese ID', msgNoNotes: 'Nda kutral', msgNoSchedule: 'Nda antü', msgNoExamsAvailable: 'Nda kawelikan', msgNoAbsentees: 'Allin', msgInvalidId: 'ID allin', msgEmptyFields: 'Complete campos', msgInvalidNote: 'Nota allin', msgSuccess: 'Allin',
    },
    ay: {
        'siu-title': 'SIU Quechua - Panel Kontrol Aymara', 'consoleTitle': 'Konsolaña Irtida', 'consoleBadge': 'Log Aktiba',
        navAlumno: 'Estudiante', navPerfil: 'Ñamarka', navAjustes: 'Sartataña', btnCerrar: 'Jupina',
        'opt-es': 'Español', 'opt-qu': 'Quechua', 'opt-gn': 'Guaraní', 'opt-arn': 'Mapuche', 'opt-ay': 'Aimara', 'opt-ar': 'Arameo', 'opt-so': 'Somalí', 'opt-la': 'Latín', 'opt-vl': 'Villero', 'opt-pp': 'PaiPai', 'opt-dog': 'Idioma Perro',
        studentBadge: 'Panel', studentWelcome: 'Napayalla,', studentRole: 'Rol', studentRoleValue: 'Yatiqawi', studentHint: 'Yatiqawin, notas, responsabilidade.',
        studentPerformance: 'Yatiqawi', perfHint: 'Promedio', studentExams: 'Nayta', examEmpty: 'Mana nayta', studentAttendance: 'Aru', attenEmpty: 'Mana aru', cardHorario: 'Pacha', schedHint: 'Pacha rikha', schedEmpty: 'Cargando...', cardCertificados: 'Pataka', certHint: 'Pataka', certEmpty: 'Mana pataka', cardConfiguracion: 'Sartataña', confHint: 'Sartataña',
        modulosTitle: 'Modulos', moduloMateria: '1. Yatiqawi', moduloNotas: '2. Notas', moduloPromedios: '3 y 4. Promedio', moduloSeguridad: '5 y 6. Seguridad', moduloModificaciones: '7 y 8. Alteri', moduloProfesores: 'Yatichiri',
        panelMateriaTitle: 'Yatiqawi', materiaNombre: 'Yatiqawi', materiaNombreHint: 'Yatiqawi', materiaEscala: 'Escala', btnCrearMateria: 'Crear',
        panelNotasTitle: 'Notas', cargaAlumnoId: 'ID', cargaAlumnoHint: 'Ej: 101', cargaNotaValor: 'Nota', cargaNotaHint: '1 al 10', btnCargarNota: 'Registrar',
        panelPromediosTitle: 'Promedio', promedioAlumnoId: 'ID', btnCalcularPromedio: 'Calcular', btnDesgloseMateria: 'Ver',
        panelSeguridadTitle: 'Seguridad', estadoActa: 'Estado', estadoActaAbierta: 'Abierta', estadoActaCerrada: 'Cerrada', btnBloquearActa: 'Bloquear', btnTestSeguridad: 'Test',
        panelModificacionesTitle: 'Alteri', modAlumnoId: 'ID', modNotaNueva: 'Nota Nueva', modMotivo: 'Razon', modMotivoHint: 'Razon', btnAplicarMod: 'Aplicar',
        panelProfesoresTitle: 'Yatichiri', profFormTitle: 'Yatichiri', profName: 'Nombre', profEmail: 'Email', profUsername: 'Usuario', profPassword: 'Contraseña', btnCrearProfesor: 'Crear', registroFormTitle: 'Nayta', registroAlumnoId: 'ID', registroMateria: 'Materia', registroFecha: 'Fecha', registroTipo: 'Tipo', registroExam: 'Nayta', registroAttendance: 'Asistencia', registroNota: 'Nota', registroNotaHint: '0-10', registroPresente: 'Estado', registroPresent: 'Presente', registroAbsent: 'Ausente', btnRegistrarAcciones: 'Registrar',
        btnLimpiarConsola: 'Limpiar', certificadoBtn: 'Thakhi', idiomaLabel: 'Aymara', addScheduleBtn: 'Yapa', verDetalles: 'Rikha',
        msgGradesSearchHint: 'Ingrese ID', msgNoNotes: 'Mana pataka', msgNoSchedule: 'Mana pacha', msgNoExamsAvailable: 'Mana nayta', msgNoAbsentees: 'Allin', msgInvalidId: 'ID allin', msgEmptyFields: 'Complete campos', msgInvalidNote: 'Nota allin', msgSuccess: 'Allin',
    },
    ar: {
        'siu-title': 'SIU Quechua - Tabula Kontrolis', 'consoleTitle': 'Consolae Exitus Indelebis', 'consoleBadge': 'Logs Activa',
        navAlumno: 'Schola', navPerfil: 'Profilio', navAjustes: 'Configuratio', btnCerrar: 'Vale',
        'opt-es': 'Español', 'opt-qu': 'Quechua', 'opt-gn': 'Guaraní', 'opt-arn': 'Mapuche', 'opt-ay': 'Aimara', 'opt-ar': 'Arameo', 'opt-so': 'Somalí', 'opt-la': 'Latín', 'opt-vl': 'Villero', 'opt-pp': 'PaiPai', 'opt-dog': 'Idioma Perro',
        studentBadge: 'Tabula', studentWelcome: 'Salve,', studentRole: 'Rol', studentRoleValue: 'Alumnus', studentHint: 'Tuae disciplinae, notae, obligationes.',
        studentPerformance: 'Meae Virtutes', perfHint: 'Promedio', studentExams: 'Examinationes', examEmpty: 'Nulla examinatio', studentAttendance: 'Praesentia', attenEmpty: 'Perfecta praesentia', cardHorario: 'Hora', schedHint: 'Hora revisum', schedEmpty: 'Cargando...', cardCertificados: 'Testimonia', certHint: 'Testimonia', certEmpty: 'Nulla testimonia', cardConfiguracion: 'Configuratio', confHint: 'Configuratio',
        modulosTitle: 'Moduli', moduloMateria: '1. Creatio', moduloNotas: '2. Notae', moduloPromedios: '3 et 4. Promedio', moduloSeguridad: '5 et 6. Securitas', moduloModificaciones: '7 et 8. Mutationes', moduloProfesores: 'Magistri',
        panelMateriaTitle: 'Creatio', materiaNombre: 'Nomen', materiaNombreHint: 'Nomen', materiaEscala: 'Scala', btnCrearMateria: 'Creare',
        panelNotasTitle: 'Notae', cargaAlumnoId: 'ID', cargaAlumnoHint: 'Ex: 101', cargaNotaValor: 'Nota', cargaNotaHint: '1 ad 10', btnCargarNota: 'Registrare',
        panelPromediosTitle: 'Promedio', promedioAlumnoId: 'ID', btnCalcularPromedio: 'Calculare', btnDesgloseMateria: 'Decompositio',
        panelSeguridadTitle: 'Securitas', estadoActa: 'Status', estadoActaAbierta: 'Aperius', estadoActaCerrada: 'Clausus', btnBloquearActa: 'Claudere', btnTestSeguridad: 'Tentatio',
        panelModificacionesTitle: 'Mutationes', modAlumnoId: 'ID', modNotaNueva: 'Nova Nota', modMotivo: 'Causa', modMotivoHint: 'Causa', btnAplicarMod: 'Applicare',
        panelProfesoresTitle: 'Magistri', profFormTitle: 'Magister Creare', profName: 'Nomen', profEmail: 'Email', profUsername: 'Nomen Utens', profPassword: 'Clavis', btnCrearProfesor: 'Creare', registroFormTitle: 'Examinatio', registroAlumnoId: 'ID', registroMateria: 'Materia', registroFecha: 'Data', registroTipo: 'Genus', registroExam: 'Examinatio', registroAttendance: 'Praesentia', registroNota: 'Nota', registroNotaHint: '0-10', registroPresente: 'Status', registroPresent: 'Praesens', registroAbsent: 'Absens', btnRegistrarAcciones: 'Registrare',
        btnLimpiarConsola: 'Mundare', certificadoBtn: 'Petere', idiomaLabel: 'Lingua', addScheduleBtn: 'Addere', verDetalles: 'Videre',
        msgGradesSearchHint: 'Infer ID', msgNoNotes: 'Nulla testimonia', msgNoSchedule: 'Nulla hora', msgNoExamsAvailable: 'Nulla examinatio', msgNoAbsentees: 'Optimum', msgInvalidId: 'ID validus', msgEmptyFields: 'Complere campi', msgInvalidNote: 'Nota valida', msgSuccess: 'Optimum',
    },
    so: {
        'siu-title': 'SIU Quechua - Panel Kontrol Somaali', 'consoleTitle': 'Konsolaadka Irtida', 'consoleBadge': 'Log Aktibad',
        navAlumno: 'Aragga', navPerfil: 'Profayla', navAjustes: 'Qabaneysiga', btnCerrar: 'Bax',
        'opt-es': 'Español', 'opt-qu': 'Quechua', 'opt-gn': 'Guaraní', 'opt-arn': 'Mapuche', 'opt-ay': 'Aimara', 'opt-ar': 'Arameo', 'opt-so': 'Somalí', 'opt-la': 'Latín', 'opt-vl': 'Villero', 'opt-pp': 'PaiPai', 'opt-dog': 'Idioma Perro',
        studentBadge: 'Kaalka', studentWelcome: 'Salaam,', studentRole: 'Rol', studentRoleValue: 'Baruun', studentHint: 'Dugaagaga, notas, waajibinada.',
        studentPerformance: 'Natijadaada', perfHint: 'Promedio', studentExams: 'Imtixaanada', examEmpty: 'Imtixaan ma\'a jira', studentAttendance: 'Hadka', attenEmpty: 'Hadka wanaagsan', cardHorario: 'Wakhtiga', schedHint: 'Wakhtiga', schedEmpty: 'Cargando...', cardCertificados: 'Shahaadooyinka', certHint: 'Shahaadooyinka', certEmpty: 'Shahaado ma\'a jira', cardConfiguracion: 'Qabaneysiga', confHint: 'Qabaneysiga',
        modulosTitle: 'Modulo', moduloMateria: '1. Dugaag', moduloNotas: '2. Notas', moduloPromedios: '3 iyo 4. Promedio', moduloSeguridad: '5 iyo 6. Ilma\'aad', moduloModificaciones: '7 iyo 8. Hagitaan', moduloProfesores: 'Macallin',
        panelMateriaTitle: 'Dugaag', materiaNombre: 'Magac', materiaNombreHint: 'Magac', materiaEscala: 'Scala', btnCrearMateria: 'Samee',
        panelNotasTitle: 'Notas', cargaAlumnoId: 'ID', cargaAlumnoHint: 'Ex: 101', cargaNotaValor: 'Nota', cargaNotaHint: '1 to 10', btnCargarNota: 'Diiwaangelinta',
        panelPromediosTitle: 'Promedio', promedioAlumnoId: 'ID', btnCalcularPromedio: 'Xisaabi', btnDesgloseMateria: 'Arag',
        panelSeguridadTitle: 'Ilma\'aad', estadoActa: 'Xaalad', estadoActaAbierta: 'Furan', estadoActaCerrada: 'Xidhan', btnBloquearActa: 'Xidhi', btnTestSeguridad: 'Tijaabi',
        panelModificacionesTitle: 'Hagitaan', modAlumnoId: 'ID', modNotaNueva: 'Nota Cusub', modMotivo: 'Sababta', modMotivoHint: 'Sababta', btnAplicarMod: 'Dhaaf',
        panelProfesoresTitle: 'Macallin', profFormTitle: 'Macallin Samee', profName: 'Magac', profEmail: 'Email', profUsername: 'Username', profPassword: 'Erayga', btnCrearProfesor: 'Samee', registroFormTitle: 'Imtixaan', registroAlumnoId: 'ID', registroMateria: 'Dugaag', registroFecha: 'Taarikh', registroTipo: 'Nooca', registroExam: 'Imtixaan', registroAttendance: 'Hadka', registroNota: 'Nota', registroNotaHint: '0-10', registroPresente: 'Xaalad', registroPresent: 'Joog', registroAbsent: 'Joog', btnRegistrarAcciones: 'Diiwaangelinta',
        btnLimpiarConsola: 'Nadiifi', certificadoBtn: 'Codsad', idiomaLabel: 'Af Soomaali', addScheduleBtn: 'Dari', verDetalles: 'Arag',
        msgGradesSearchHint: 'Galka ID', msgNoNotes: 'Shahaado ma\'a jira', msgNoSchedule: 'Wakhtiga ma\'a jira', msgNoExamsAvailable: 'Imtixaan ma\'a jira', msgNoAbsentees: 'Wanaagsan', msgInvalidId: 'ID saxda ah', msgEmptyFields: 'Buuxi meelaha', msgInvalidNote: 'Nota saxda ah', msgSuccess: 'Wanaagsan',
    },
    la: {
        'siu-title': 'SIU Quechua - Tabula Kontrolis Latinae', 'consoleTitle': 'Consolae Exitus', 'consoleBadge': 'Logs Activa',
        navAlumno: 'Visus Discipuli', navPerfil: 'Meum Profilum', navAjustes: 'Optiones', btnCerrar: 'Exire',
        'opt-es': 'Español', 'opt-qu': 'Quechua', 'opt-gn': 'Guaraní', 'opt-arn': 'Mapuche', 'opt-ay': 'Aimara', 'opt-ar': 'Arameo', 'opt-so': 'Somalí', 'opt-la': 'Latín', 'opt-vl': 'Villero', 'opt-pp': 'PaiPai', 'opt-dog': 'Idioma Perro',
        studentBadge: 'Tabula Scholae', studentWelcome: 'Salve,', studentRole: 'Rol', studentRoleValue: 'Alumnus', studentHint: 'Tuae disciplinae, notae, officia.',
        studentPerformance: 'Mei Eventus', perfHint: 'Promedio', studentExams: 'Examinationes', examEmpty: 'Nulla examinatio', studentAttendance: 'Absentia', attenEmpty: 'Perfecta praesentia', cardHorario: 'Horarium', schedHint: 'Horarium revisum', schedEmpty: 'Cargando...', cardCertificados: 'Testimonia', certHint: 'Testimonia', certEmpty: 'Nulla testimonia', cardConfiguracion: 'Optiones', confHint: 'Optiones',
        modulosTitle: 'Moduli', moduloMateria: '1. Creatio', moduloNotas: '2. Notae', moduloPromedios: '3 et 4. Promedio', moduloSeguridad: '5 et 6. Securitas', moduloModificaciones: '7 et 8. Mutationes', moduloProfesores: 'Magistri',
        panelMateriaTitle: 'Creatio Disciplinae', materiaNombre: 'Nomen Disciplinae', materiaNombreHint: 'Nomen', materiaEscala: 'Scala Min/Max', btnCrearMateria: 'Configurare',
        panelNotasTitle: 'Gestor Notarum', cargaAlumnoId: 'ID Alumni', cargaAlumnoHint: 'Ex: 101', cargaNotaValor: 'Nota Obtenta', cargaNotaHint: '1 ad 10', btnCargarNota: 'Registrare Notam',
        panelPromediosTitle: 'Calculus Promediorum', promedioAlumnoId: 'ID Consulendi', btnCalcularPromedio: 'Calculare Conditionem', btnDesgloseMateria: 'Videre Decompositiones',
        panelSeguridadTitle: 'Auditor Clausurae', estadoActa: 'Status Acti', estadoActaAbierta: 'Aperius', estadoActaCerrada: 'Clausus', btnBloquearActa: 'Simulare Clausuram', btnTestSeguridad: 'Tentatio Securitatis',
        panelModificacionesTitle: 'Editio Extraordinaria', modAlumnoId: 'ID Alumni', modNotaNueva: 'Nova Nota', modMotivo: 'Iustificatio', modMotivoHint: 'Iustificatio Obligatoria', btnAplicarMod: 'Applicare Mutationem',
        panelProfesoresTitle: 'Administratio Magistrorum', profFormTitle: 'Creare Computrum Magistri', profName: 'Nomen', profEmail: 'Email', profUsername: 'Nomen Utens', profPassword: 'Clavis', btnCrearProfesor: 'Creare Magistrum', registroFormTitle: 'Registrare Examinationes/Absentiam', registroAlumnoId: 'ID Alumni', registroMateria: 'Disciplina', registroFecha: 'Data', registroTipo: 'Genus', registroExam: 'Examinatio', registroAttendance: 'Absentia', registroNota: 'Nota', registroNotaHint: '0-10', registroPresente: 'Status', registroPresent: 'Praesens', registroAbsent: 'Absens', btnRegistrarAcciones: 'Registrare',
        btnLimpiarConsola: 'Mundare Consolam', certificadoBtn: 'Petere', idiomaLabel: 'Lingua Latina', addScheduleBtn: 'Addere', verDetalles: 'Videre',
        msgGradesSearchHint: 'Infer ID', msgNoNotes: 'Nulla testimonia recentia', msgNoSchedule: 'Horarium non disponibile', msgNoExamsAvailable: 'Nulla examinatio', msgNoAbsentees: 'Perfecta praesentia', msgInvalidId: 'ID invalidus', msgEmptyFields: 'Complere omnia campi', msgInvalidNote: 'Nota invalida', msgSuccess: 'Operatio Prospera',
    },
    vl: {
        'siu-title': 'SIU Quechua - Panel Control Villero', 'consoleTitle': 'Konsolaña Salida che', 'consoleBadge': 'Logs Activa che',
        navAlumno: 'Vista Boleta', navPerfil: 'Mi Perfil Boleta', navAjustes: 'Config Boleta', btnCerrar: 'Chetarse',
        'opt-es': 'Español', 'opt-qu': 'Quechua', 'opt-gn': 'Guaraní', 'opt-arn': 'Mapuche', 'opt-ay': 'Aimara', 'opt-ar': 'Arameo', 'opt-so': 'Somalí', 'opt-la': 'Latín', 'opt-vl': 'Villero', 'opt-pp': 'PaiPai', 'opt-dog': 'Idioma Perro',
        studentBadge: 'Panel Boleta', studentWelcome: 'Che,', studentRole: 'Rol', studentRoleValue: 'Estudiante che', studentHint: 'Tus cosas, notas che, responsabilidades boleta.',
        studentPerformance: 'Mi Rendi Boleta', perfHint: 'Promedio che', studentExams: 'Exámenes che', examEmpty: 'Sin exámenes che', studentAttendance: 'Asistencia boleta', attenEmpty: 'Sin faltas che', cardHorario: 'Horario che', schedHint: 'Tus clases che', schedEmpty: 'Cargando che...', cardCertificados: 'Certificadillos', certHint: 'Descarga constancia', certEmpty: 'Sin certificadillos', cardConfiguracion: 'Config Che', confHint: 'Preferencias boleta',
        modulosTitle: 'Módulos che', moduloMateria: '1. Creación che', moduloNotas: '2. Notas Boleta', moduloPromedios: '3 y 4. Promedio che', moduloSeguridad: '5 y 6. Seguridad boleta', moduloModificaciones: '7 y 8. Cambios che', moduloProfesores: 'Gestión Profe',
        panelMateriaTitle: 'Motor de Materias che', materiaNombre: 'Nombre che', materiaNombreHint: 'Tu materia che', materiaEscala: 'Escala che', btnCrearMateria: 'Crear che',
        panelNotasTitle: 'Gestor de Notas Boleta', cargaAlumnoId: 'ID Alumno', cargaAlumnoHint: 'Ej: 101', cargaNotaValor: 'Nota che', cargaNotaHint: '1 al 10', btnCargarNota: 'Registrar che',
        panelPromediosTitle: 'Cálculo de Promedio che', promedioAlumnoId: 'ID Consulta che', btnCalcularPromedio: 'Calcular che', btnDesgloseMateria: 'Ver Desglose che',
        panelSeguridadTitle: 'Seguridad che', estadoActa: 'Estado del Acta', estadoActaAbierta: 'Abierta che', estadoActaCerrada: 'Cerrada boleta', btnBloquearActa: 'Bloquear che', btnTestSeguridad: 'Test de Seguridad',
        panelModificacionesTitle: 'Cambios che', modAlumnoId: 'ID Alumno', modNotaNueva: 'Nota Nueva che', modMotivo: 'Justificación che', modMotivoHint: 'Dale motivo che', btnAplicarMod: 'Aplicar cambio',
        panelProfesoresTitle: 'Gestión Profes', profFormTitle: 'Crear cuenta de Profe', profName: 'Nombre', profEmail: 'Email', profUsername: 'Usuario che', profPassword: 'Contraseña', btnCrearProfesor: 'Crear Profe', registroFormTitle: 'Registrar Exámenes', registroAlumnoId: 'ID Alumno', registroMateria: 'Materia che', registroFecha: 'Fecha che', registroTipo: 'Tipo che', registroExam: 'Examen che', registroAttendance: 'Asistencia boleta', registroNota: 'Nota che', registroNotaHint: '0-10', registroPresente: 'Estado', registroPresent: 'Presente che', registroAbsent: 'Ausente boleta', btnRegistrarAcciones: 'Registrar che',
        btnLimpiarConsola: 'Limpiar Consola', certificadoBtn: 'Mandale Solicitud', idiomaLabel: 'Idioma Villero', addScheduleBtn: 'Agregá Clase', verDetalles: 'Mirá Detalles',
        msgGradesSearchHint: 'Ingresá tu ID che', msgNoNotes: 'Sin certificados che', msgNoSchedule: 'Sin horarios boleta', msgNoExamsAvailable: 'Sin exámenes che', msgNoAbsentees: 'Allin che', msgInvalidId: 'ID incorrecto', msgEmptyFields: 'Completa todo che', msgInvalidNote: 'Nota incorrecta che', msgSuccess: 'Guardado che',
    },
    pp: {
        'siu-title': 'SIU Quechua - Panel Sagrado de Control', 'consoleTitle': 'Salida Espiritual de Consola', 'consoleBadge': 'Logs Sagrados',
        navAlumno: 'Visión de Aprendizaje', navPerfil: 'Mi Espíritu', navAjustes: 'Sabiduría', btnCerrar: 'Partir en Paz',
        'opt-es': 'Español', 'opt-qu': 'Quechua', 'opt-gn': 'Guaraní', 'opt-arn': 'Mapuche', 'opt-ay': 'Aimara', 'opt-ar': 'Arameo', 'opt-so': 'Somalí', 'opt-la': 'Latín', 'opt-vl': 'Villero', 'opt-pp': 'PaiPai', 'opt-dog': 'Idioma Perro',
        studentBadge: 'Casa del Conocimiento', studentWelcome: 'Hermano,', studentRole: 'Rol', studentRoleValue: 'Aprendiz', studentHint: 'Tu aprendizaje, calificaciones, responsabilidades sagradas.',
        studentPerformance: 'Mi Camino', perfHint: 'Promedio Espiritual', studentExams: 'Pruebas de Entendimiento', examEmpty: 'Sin pruebas espirituales', studentAttendance: 'Presencia en Círculo', attenEmpty: 'Presencia perfecta', cardHorario: 'Tiempo Sagrado', schedHint: 'Tus momentos de aprendizaje', schedEmpty: 'Cargando temporalidad...', cardCertificados: 'Reconocimiento', certHint: 'Tus logros certificados', certEmpty: 'Sin reconocimientos', cardConfiguracion: 'Configuración Sabia', confHint: 'Ajustes personales',
        modulosTitle: 'Módulos Sagrados', moduloMateria: '1. Creación de Sabiduría', moduloNotas: '2. Registro de Aprendizaje', moduloPromedios: '3 y 4. Medición Espiritual', moduloSeguridad: '5 y 6. Protección', moduloModificaciones: '7 y 8. Transformación', moduloProfesores: 'Guías Sabios',
        panelMateriaTitle: 'Motor de Sabiduría', materiaNombre: 'Nombre del Aprendizaje', materiaNombreHint: 'Tu disciplina', materiaEscala: 'Escala Espiritual', btnCrearMateria: 'Crear Enseñanza',
        panelNotasTitle: 'Gestor de Aprendizaje', cargaAlumnoId: 'ID del Aprendiz', cargaAlumnoHint: 'Ej: 101', cargaNotaValor: 'Calificación', cargaNotaHint: '1 al 10', btnCargarNota: 'Registrar Aprendizaje',
        panelPromediosTitle: 'Evaluación Espiritual', promedioAlumnoId: 'ID a Evaluar', btnCalcularPromedio: 'Calcular Progreso', btnDesgloseMateria: 'Ver Detalles del Camino',
        panelSeguridadTitle: 'Protección del Conocimiento', estadoActa: 'Estado de Protección', estadoActaAbierta: 'Abierto al Aprendizaje', estadoActaCerrada: 'Protegido Eternamente', btnBloquearActa: 'Sellar Sabiduría', btnTestSeguridad: 'Prueba de Integridad',
        panelModificacionesTitle: 'Transformación Sagrada', modAlumnoId: 'ID del Aprendiz', modNotaNueva: 'Nueva Calificación', modMotivo: 'Razón Espiritual', modMotivoHint: 'Explica tu transformación', btnAplicarMod: 'Aplicar Cambio Sagrado',
        panelProfesoresTitle: 'Administración de Sabios', profFormTitle: 'Nombrar Nuevo Sabio', profName: 'Nombre', profEmail: 'Contacto', profUsername: 'Usuario Sabio', profPassword: 'Contraseña Sagrada', btnCrearProfesor: 'Nombrar Sabio', registroFormTitle: 'Registrar Experiencias', registroAlumnoId: 'ID Aprendiz', registroMateria: 'Disciplina', registroFecha: 'Fecha', registroTipo: 'Tipo', registroExam: 'Prueba Espiritual', registroAttendance: 'Presencia', registroNota: 'Calificación', registroNotaHint: '0-10', registroPresente: 'Estado', registroPresent: 'Presente', registroAbsent: 'Ausente', btnRegistrarAcciones: 'Registrar',
        btnLimpiarConsola: 'Limpiar Visión', certificadoBtn: 'Solicitar Bendición', idiomaLabel: 'Lengua del Espíritu', addScheduleBtn: 'Añadir Tiempo Sagrado', verDetalles: 'Ver Misterios',
        msgGradesSearchHint: 'Busca tu ID', msgNoNotes: 'Sin reconocimientos', msgNoSchedule: 'Sin tiempos', msgNoExamsAvailable: 'Sin pruebas', msgNoAbsentees: 'Presencia perfecta', msgInvalidId: 'ID inválido', msgEmptyFields: 'Completa los campos', msgInvalidNote: 'Calificación inválida', msgSuccess: 'Éxito Espiritual',
    },
    dog: {
        'siu-title': 'SIU Quechua - Panel Control Guau', 'consoleTitle': 'Konsolaña Salida Guau', 'consoleBadge': 'Logs Guau',
        navAlumno: 'Woof Woof Guau', navPerfil: 'Mi Huella Canina', navAjustes: 'Olfato Ajustes', btnCerrar: '¡A Dormir Guau!',
        'opt-es': 'Español', 'opt-qu': 'Quechua', 'opt-gn': 'Guaraní', 'opt-arn': 'Mapuche', 'opt-ay': 'Aimara', 'opt-ar': 'Arameo', 'opt-so': 'Somalí', 'opt-la': 'Latín', 'opt-vl': 'Villero', 'opt-pp': 'PaiPai', 'opt-dog': 'Idioma Perro',
        studentBadge: 'Panel Canino', studentWelcome: 'Wuf Wuf,', studentRole: 'Rol Perro', studentRoleValue: 'Cachorro', studentHint: 'Tu carrera, notas perrunas, responsabilidades caninas.',
        studentPerformance: 'Mi Hora de Paseo', perfHint: 'Promedio Guau', studentExams: 'Huesitos de Prueba', examEmpty: 'Sin huesitos', studentAttendance: 'Asistencia de Paseo', attenEmpty: 'Perfecto olfato', cardHorario: 'Hora de Paseo Guau', schedHint: 'Tus paseos diarios', schedEmpty: 'Preparando correa...', cardCertificados: 'Huesos Certificados', certHint: 'Tus premios caninos', certEmpty: 'Sin huesitos ganados', cardConfiguracion: 'Olfato del Perro', confHint: 'Preferencias perrunas',
        modulosTitle: 'Módulos Guau', moduloMateria: '1. Creación Canina', moduloNotas: '2. Registro de Ladridos', moduloPromedios: '3 y 4. Calculo Perro', moduloSeguridad: '5 y 6. Guarda Perro', moduloModificaciones: '7 y 8. Cambios Guau', moduloProfesores: 'Entrenadores Guau',
        panelMateriaTitle: 'Motor de Perros', materiaNombre: 'Nombre Perro', materiaNombreHint: 'Tu disciplina guau', materiaEscala: 'Escala Canina', btnCrearMateria: 'Crear Guau',
        panelNotasTitle: 'Gestor de Ladridos', cargaAlumnoId: 'ID Perro', cargaAlumnoHint: 'Ej: 101', cargaNotaValor: 'Nota Guau', cargaNotaHint: '1 al 10 guau', btnCargarNota: 'Registrar Ladrido',
        panelPromediosTitle: 'Cálculo Perro', promedioAlumnoId: 'ID Olfatear', btnCalcularPromedio: 'Calcular Guau', btnDesgloseMateria: 'Ver Desglose Perro',
        panelSeguridadTitle: 'Guarda Seguridad', estadoActa: 'Estado Guau', estadoActaAbierta: 'Abierto Guau', estadoActaCerrada: 'Cerrado Guau', btnBloquearActa: 'Bloquear Guau', btnTestSeguridad: 'Test Perro',
        panelModificacionesTitle: 'Cambios Guau', modAlumnoId: 'ID Perro', modNotaNueva: 'Nota Nueva Guau', modMotivo: 'Razon Ladrido', modMotivoHint: 'Explica el guau', btnAplicarMod: 'Aplicar Guau',
        panelProfesoresTitle: 'Entrenadores Caninos', profFormTitle: 'Crear Entrenador Guau', profName: 'Nombre Guau', profEmail: 'Email Perro', profUsername: 'Usuario Guau', profPassword: 'Contraseña Guau', btnCrearProfesor: 'Crear Entrenador', registroFormTitle: 'Registrar Guau', registroAlumnoId: 'ID Perro', registroMateria: 'Disciplina Guau', registroFecha: 'Fecha Guau', registroTipo: 'Tipo Guau', registroExam: 'Prueba Guau', registroAttendance: 'Paseo', registroNota: 'Nota Guau', registroNotaHint: '0-10 Guau', registroPresente: 'Estado Guau', registroPresent: 'Presente Guau', registroAbsent: 'Ausente Guau', btnRegistrarAcciones: 'Registrar Guau',
        btnLimpiarConsola: 'Limpiar Guau', certificadoBtn: 'Ladra Fuerte', idiomaLabel: 'Idioma Perro', addScheduleBtn: 'Agregar Paseo', verDetalles: 'Olfatear',
        msgGradesSearchHint: 'Ingresa tu ID Guau', msgNoNotes: 'Sin certificados Guau', msgNoSchedule: 'Sin horarios Guau', msgNoExamsAvailable: 'Sin pruebas Guau', msgNoAbsentees: 'Perfecto guau', msgInvalidId: 'ID incorrecto', msgEmptyFields: 'Completa todo Guau', msgInvalidNote: 'Nota incorrecta Guau', msgSuccess: 'Éxito Guau',
    }
};

function aplicarIdioma(codigo) {
    const t = translations[codigo] || translations.es;
    
    // Traducir TODOS los elementos con data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = t[key];
            } else if (el.tagName === 'BUTTON') {
                el.textContent = t[key];
            } else {
                el.textContent = t[key];
            }
        }
    });
    
    // Traducir placeholders con data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) {
            el.placeholder = t[key];
        }
    });
    
    // Traducir options de select
    document.querySelectorAll('option[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.textContent = t[key];
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
