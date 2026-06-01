/**
 * Revisa la planilla de una materia antes de permitir el cierre oficial.
 * @param {Object} objetoMateria - Objeto que contiene las evaluaciones configuradas y la lista de alumnos.
 * @returns {Object} { puedeCerrar: boolean, reportePendientes: Array<string> }
 */
function auditarCierreActa(objetoMateria) {
    const reportePendientes = [];

    // 1. Obtener los IDs de las evaluaciones que son obligatorias
    const evaluacionesObligatorias = objetoMateria.evaluaciones
        .filter(evaluacion => evaluacion.obligatoria)
        .map(evaluacion => evaluacion.id);

    // 2. Iterar por cada alumno para verificar sus notas
    objetoMateria.alumnos.forEach(alumno => {
        let leFaltaNota = false;

        // Comprobar cada evaluación obligatoria en el registro del alumno
        evaluacionesObligatorias.forEach(evaluacionId => {
            const notaRegistrada = alumno.notas[evaluacionId];
            
            // Validar si la nota es undefined, null o un string vacío
            if (notaRegistrada === undefined || notaRegistrada === null || notaRegistrada === "") {
                leFaltaNota = true;
            }
        });

        // Si al alumno le falta al menos una nota obligatoria, va al reporte
        if (leFaltaNota) {
            reportePendientes.push(alumno.id);
        }
    });

    // 3. Si el reporte tiene alumnos, significa que NO se puede cerrar
    return {
        puedeCerrar: reportePendientes.length === 0,
        reportePendientes: reportePendientes
    };
}
