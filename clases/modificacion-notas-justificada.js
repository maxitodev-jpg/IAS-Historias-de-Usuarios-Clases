// =============================================================================
// ARCHIVO 1: modificacion-notas-justificada.js (TU ISSUE 7)
// =============================================================================

/**
 * ISSUE 7: Motor de Edición Extemporánea de Calificaciones
 * Módulo Autónomo en Clase - Integrante 4 (Maxi)
 */
class GestorModificaciones {
    // El constructor puede quedar vacío porque este módulo solo procesa acciones
    constructor() {}

    /**
     * Método principal para editar una nota existente
     */
    procesarModificacionNota(objetoCalificacion, nuevaNota, justificacion, actaEstado) {
        // 1. CONTROL DE SEGURIDAD: Acta cerrada bloquea la acción
        if (actaEstado === "Cerrada") {
            return { 
                exitoso: false, 
                mensaje: "ERROR CRÍTICO (SIU Quechua): El acta está cerrada. Modificación denegada de forma permanente." 
            };
        }

        // 2. CONTROL DE RANGO: Valida que la nota esté entre 1 y 10
        if (typeof nuevaNota !== "number" || nuevaNota < 1 || nuevaNota > 10 || isNaN(nuevaNota)) {
            return { 
                exitoso: false, 
                mensaje: "ERROR: La nueva nota debe ser un número válido entre 1 y 10." 
            };
        }

        // 3. CONTROL DE CALIDAD: Validación estricta del texto (mínimo 15 caracteres)
        if (!justificacion || justificacion.trim().length < 15) {
            return { 
                exitoso: false, 
                mensaje: "ERROR: Justificación insuficiente. Debe explicar el motivo del cambio (mínimo 15 caracteres reales)." 
            };
        }

        // Resguardamos la nota anterior
        const notaAnterior = objetoCalificacion.nota;

        // 4. APLICACIÓN DEL CAMBIO: Modificamos el objeto calición directamente
        objetoCalificacion.nota = nuevaNota;

        // Devolvemos el éxito y el paquete de datos para el módulo de logs
        return {
            exitoso: true,
            mensaje: `ÉXITO: Nota modificada correctamente de ${notaAnterior} a ${nuevaNota}.`,
            datosCambio: {
                alumnoId: objetoCalificacion.alumnoId,
                materiaId: objetoCalificacion.materiaId,
                evaluacion: objetoCalificacion.evaluacionNombre,
                notaVieja: notaAnterior,
                notaNueva: nuevaNota,
                motivo: justificacion.trim()
            }
        };
    }
}