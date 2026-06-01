// =============================================================================
// ARCHIVO 2: historial-auditoria-logs.js (TU ISSUE 8)
// =============================================================================

/**
 * ISSUE 8: Sistema de Caja Negra y Reporte de Auditoría
 * Módulo Autónomo - Integrante 4 (Maxi)
 * 
 * Requisitos:
 * 1. Almacenar registros de manera estructurada en un array inmutable.
 * 2. Estampar ID único y fecha/hora exacta del servidor/sistema.
 * 3. Permitir filtrado de logs por materia para auditoría de directivos.
 */

// Simulación de nuestra base de datos interna y protegida de logs
const BD_LOGS_AUDITORIA = [];

function registrarEventoEnAuditoria(datosCambio) {
    // Si la Issue 7 falló o no mandó datos, no registramos nada
    if (!datosCambio) return null;

    // Creamos el registro con la estampa de seguridad del SIU Quechua
    const nuevoLog = {
        idLog: "LOG-" + Math.floor(Math.random() * 90000 + 10000), // ID único de 5 dígitos
        timestamp: new Date().toLocaleString(),                   // Fecha y hora exacta del cambio
        alumno: datosCambio.alumnoId,
        materia: datosCambio.materiaId,
        evaluacion: datosCambio.evaluacion,
        antes: datosCambio.notaVieja,
        ahora: datosCambio.notaNueva,
        justificacion: datosCambio.motivo
    };

    // Empujamos el registro al historial global
    BD_LOGS_AUDITORIA.push(nuevoLog);
    
    console.log(`📌 [SIU Quechua] Evento de seguridad registrado con ID: ${nuevoLog.idLog}`);
    return nuevoLog;
}

/**
 * Motor de búsqueda para directivos del SIU Quechua
 * Si se pasa un código de materia, filtra. Si no, devuelve todo el historial.
 */
function generarReporteAuditoria(filtroMateria = null) {
    if (BD_LOGS_AUDITORIA.length === 0) {
        return "El historial de auditoría se encuentra vacío.";
    }

    if (filtroMateria) {
        return BD_LOGS_AUDITORIA.filter(log => log.materia === filtroMateria);
    }
    
    return BD_LOGS_AUDITORIA;
}


// =============================================================================
// 🧪 BANCO DE PRUEBAS INTEGRADO (Para probar vos solo en Consola - F12)
// =============================================================================

console.log("%c🎓 --- PRUEBAS DE MÓDULO AUTÓNOMO: SIU QUECHUA ---", "color: #ffc107; font-weight: bold;");

// 1. Objeto de prueba simulando la estructura nativa que manejará el sistema
let notaEjemplo = { 
    alumnoId: 202618, 
    materiaId: "IPAS", // Introducción al Análisis Sistémico
    evaluacionNombre: "Parcial 1", 
    nota: 2 
};

console.log("1. Estado inicial de la nota del alumno:", notaEjemplo.nota);

// ❌ TEST A: Intento de cambio fallido por justificación basura
console.log("\n❌ Ejecutando Test A (Justificación corta)...");
let testA = procesarModificacionNota(notaEjemplo, 7, "cambio nota", "Abierta");
console.log("Resultado:", testA.mensaje);

// ❌ TEST B: Intento de cambio fallido por acta cerrada por bedelía
console.log("\n❌ Ejecutando Test B (Acta Cerrada)...");
let testB = procesarModificacionNota(notaEjemplo, 9, "El alumno recuperó el examen de forma excelente.", "Cerrada");
console.log("Resultado:", testB.mensaje);

//  TEST C: Modificación exitosa conectando Issue 7 con Issue 8
console.log("\n Ejecutando Test C (Modificación Correcta)...");
let testC = procesarModificacionNota(
    notaEjemplo, 
    8, 
    "Error de tipeo del docente al pasar las notas de la planilla en papel.", 
    "Abierta"
);

console.log("Resultado:", testC.mensaje);

if (testC.exitoso) {
    // Si tu Issue 7 le dio el OK, mandamos los datos directo a la bitácora de la Issue 8
    registrarEventoEnAuditoria(testC.datosCambio);
}

// 📊 MOSTRAR REPORTE FINAL EN CONSOLA
console.log("\n📊 --- REPORTE GENERAL DE AUDITORÍA DISPONIBLE ---");
console.table(generarReporteAuditoria());