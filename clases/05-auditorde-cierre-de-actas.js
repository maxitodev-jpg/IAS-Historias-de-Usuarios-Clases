/**
 * Clase responsable del control y validación de actas antes de su cierre.
 * (Solución al Issue #5: Auditor de Pre-Cierre de Actas)
 */
class AuditorActas {
    /**
     * Revisa la planilla de una materia antes de permitir el cierre oficial,
     * asegurando que no haya casilleros vacíos en las evaluaciones obligatorias.
     * * @param {Object} objetoMateria - Objeto con la lista de alumnos y evaluaciones.
     * @returns {Object} Un objeto con el resultado { puedeCerrar: boolean, reportePendientes: array }
     */
    static auditarCierreActa(objetoMateria) {
        const reportePendientes = [];

        // 1. Obtener los IDs de las evaluaciones configuradas como obligatorias
        const evaluacionesObligatorias = objetoMateria.evaluaciones
            .filter(evaluacion => evaluacion.obligatoria)
            .map(evaluacion => evaluacion.id);

        // 2. Cruzar la lista de evaluaciones contra las notas de cada alumno
        objetoMateria.alumnos.forEach(alumno => {
            let leFaltaNota = false;

            evaluacionesObligatorias.forEach(evaluacionId => {
                const notaRegistrada = alumno.notas[evaluacionId];
                
                // Criterio: se considera vacío si es undefined, null o un string vacío
                if (notaRegistrada === undefined || notaRegistrada === null || notaRegistrada === "") {
                    leFaltaNota = true;
                }
            });

            // Si al alumno le falta alguna nota obligatoria, se añade su ID al reporte
            if (leFaltaNota) {
                reportePendientes.push(alumno.id);
            }
        });

        // 3. Retornar el veredicto final
        return {
            puedeCerrar: reportePendientes.length === 0,
            reportePendientes: reportePendientes
        };
    }
}