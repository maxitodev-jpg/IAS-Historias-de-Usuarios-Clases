// =============================================================================
// ARCHIVO 2: historial-auditoria-logs.js (TU ISSUE 8)
// =============================================================================

/**
 * ISSUE 8: Sistema de Caja Negra y Reporte de Auditoría
 * Módulo Autónomo en Clase - Integrante 4 (Maxi)
 */

// Esta clase define cómo es la estructura de un "Registro individual" en la bitácora
class RegistroLog {
    constructor(datosCambio) {
        this.idLog = "LOG-" + Math.floor(Math.random() * 90000 + 10000); // ID único
        this.timestamp = new Date().toLocaleString();                   // Fecha y hora del sistema
        this.alumno = datosCambio.alumnoId;
        this.materia = datosCambio.materiaId;
        this.evaluacion = datosCambio.evaluacion;
        this.antes = datosCambio.notaVieja;
        this.ahora = datosCambio.notaNueva;
        this.justificacion = datosCambio.motivo;
    }
}

// Esta clase maneja la "Base de datos" y los reportes de auditoría
class SistemaAuditoria {
    constructor() {
        // Cada instancia del sistema tendrá su propio array oculto de logs
        this.bdLogs = [];
    }

    /**
     * Método para meter un nuevo log en el historial
     */
    registrarEvento(datosCambio) {
        if (!datosCambio) return null;

        // Creamos una nueva instancia de la clase RegistroLog
        const nuevoLog = new RegistroLog(datosCambio);
        
        // Lo guardamos en el array de la clase
        this.bdLogs.push(nuevoLog);
        
        console.log(`📌 [SIU Quechua] Evento de seguridad guardado en la clase Auditoría: ${nuevoLog.idLog}`);
        return nuevoLog;
    }

    /**
     * Método de filtrado para directivos
     */
    generarReporte(filtroMateria = null) {
        if (this.bdLogs.length === 0) {
            return "El historial de auditoría se encuentra vacío.";
        }

        if (filtroMateria) {
            return this.bdLogs.filter(log => log.materia === filtroMateria);
        }
        
        return this.bdLogs;
    }
}


// =============================================================================
// 🧪 BANCO DE PRUEBAS CON CLASES (Para probar en Consola - F12)
// =============================================================================

console.log("%c🎓 --- PRUEBAS DE POO (CLASES) INDEPENDIENTES: SIU QUECHUA ---", "color: #007bff; font-weight: bold;");

// 1. Instanciamos las clases de Maxi (Integrante 4) para usarlas
const modicadorMódulo = new GestorModificaciones();
const auditoriaMódulo = new SistemaAuditoria();

// 2. Objeto de datos nativo para simular la nota
let notaEjemploPOO = { 
    alumnoId: 202618, 
    materiaId: "IPAS", 
    evaluacionNombre: "Parcial 1", 
    nota: 2 
};

console.log("Estado inicial de la nota:", notaEjemploPOO.nota);

// ❌ TEST A: Justificación inválida (Llamando al método de la clase)
console.log("\n❌ Ejecutando Test A (Texto corto)...");
let resultadoA = modicadorMódulo.procesarModificacionNota(notaEjemploPOO, 7, "la rindió de nuevo", "Abierta");
console.log("Resultado:", resultadoA.mensaje);

// 🚀 TEST B: Modificación Exitosa y Registro de Log usando las Clases
console.log("\n Ejecutando Test B (Modificación Correcta)...");
let resultadoB = modicadorMódulo.procesarModificacionNota(
    notaEjemploPOO, 
    9, 
    "Error en la suma de puntos en la revisión del parcial físico.", 
    "Abierta"
);

console.log("Resultado:", resultadoB.mensaje);

if (resultadoB.exitoso) {
    // Le pasamos el paquete de datos al método de la clase de auditoría
    auditoriaMódulo.registrarEvento(resultadoB.datosCambio);
}

// 📊 REPORTE DE LA CLASE DE AUDITORÍA
console.log("\n📊 --- REPORTE LEÍDO DESDE LA CLASE 'SISTEMAAUDITORIA' ---");
console.table(auditoriaMódulo.generarReporte());