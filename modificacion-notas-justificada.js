// =============================================================================
// ARCHIVO 1: modificacion-notas-justificada.js (TU ISSUE 7)
// =============================================================================

/**
 * ISSUE 7: Motor de Edición Extemporánea de Calificaciones
 * Módulo Autónomo - Integrante 4 (Maxi)
 * 
 * Requisitos:
 * 1. Controlar que el acta esté abierta.
 * 2. Validar rango de nota (1 a 10).
 * 3. Control de calidad de la justificación (mínimo 15 caracteres reales).
 */
function procesarModificacionNota(objetoCalificacion, nuevaNota, justificacion, actaEstado) {
    // 1. CONTROL DE SEGURIDAD: Si el acta está cerrada, se bloquea la acción
    if (actaEstado === "Cerrada") {
        return { 
            exitoso: false, 
            mensaje: "ERROR CRÍTICO (SIU Quechua): El acta está cerrada. Modificación denegada de forma permanente." 
        };
    }

    // 2. CONTROL DE RANGO: Valida que la nota ingresada sea coherente
    if (typeof nuevaNota !== "number" || nuevaNota < 1 || nuevaNota > 10 || isNaN(nuevaNota)) {
        return { 
            exitoso: false, 
            mensaje: "ERROR: La nueva nota debe ser un número válido entre 1 y 10." 
        };
    }

    // 3. CONTROL DE CALIDAD: Evita textos basura como "ok", "ya esta" o puros espacios
    if (!justificacion || justificacion.trim().length < 15) {
        return { 
            exitoso: false, 
            mensaje: "ERROR: Justificación insuficiente. Debe explicar el motivo del cambio (mínimo 15 caracteres reales)." 
        };
    }

    // Resguardamos la nota anterior antes de pisarla
    const notaAnterior = objetoCalificacion.nota;

    // 4. APLICACIÓN DE CAMBIO: Modificamos el objeto que viaja por parámetro
    objetoCalificacion.nota = nuevaNota;

    // Retornamos el éxito y empaquetamos el bloque de datos que necesita la Issue 8
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