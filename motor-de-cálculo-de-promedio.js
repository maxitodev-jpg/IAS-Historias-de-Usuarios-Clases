class AnalizadorEstadistico {
    /**
     * Issue 4: Analizador Estadístico de Rendimiento
     * @param {Array<number>} notas - Array con todas las notas numéricas del estudiante.
     * @param {number} notaMinimaAprobacion - Escala de aprobación (por defecto 4).
     * @returns {Object} Objeto con las estadísticas de rendimiento.
     */
    static analizar(notas, notaMinimaAprobacion = 4) {
        // Control de seguridad: Si el alumno no tiene notas registradas todavía
        if (!Array.isArray(notas) || notas.length === 0) {
            return {
                promedioGeneral: 0,
                notaMasAlta: 0,
                notaMasBaja: 0,
                porcentajeAprobadas: "0%"
            };
        }

        // 1. Cálculo del Promedio General
        const sumaTotal = notas.reduce((acumulador, nota) => acumulador + nota, 0);
        const promedio = Number((sumaTotal / notas.length).toFixed(2));

        // 2. Cálculo de la nota más alta y más baja usando Math
        const maxima = Math.max(...notas);
        const minima = Math.min(...notas);

        // 3. Cálculo del porcentaje de evaluaciones aprobadas
        const evaluacionesAprobadas = notas.filter(nota => nota >= notaMinimaAprobacion).length;
        const porcentaje = (evaluacionesAprobadas / notas.length) * 100;
        const porcentajeFormateado = `${Number(porcentaje.toFixed(1))}%`;

        // Retornamos el objeto con el desglose estadístico solicitado
        return {
            promedioGeneral: promedio,
            notaMasAlta: maxima,
            notaMasBaja: minima,
            porcentajeAprobadas: porcentajeFormateado
        };
    }
}

// ==========================================
// CASOS DE PRUEBA / DEMOSTRACIÓN
// ==========================================

// Caso 1: Un alumno con un desempeño mixto
const notasAlumnoA = [8, 9, 3, 7, 10, 4]; 
const estadisticasA = AnalizadorEstadistico.analizar(notasAlumnoA);

console.log("--- ESTADÍSTICAS ALUMNO A ---");
console.log(estadisticasA);
/* Resultado esperado:
{
  promedioGeneral: 6.83,
  notaMasAlta: 10,
  notaMasBaja: 3,
  porcentajeAprobadas: '83.3%'  (5 de 6 aprobadas)
}
*/

// Caso 2: Un alumno que lamentablemente reprobó todo
const notasAlumnoB = [2, 3, 2];
const estadisticasB = AnalizadorEstadistico.analizar(notasAlumnoB);

console.log("\n--- ESTADÍSTICAS ALUMNO B ---");
console.log(estadisticasB);
/*
Resultado esperado:
{
  promedioGeneral: 2.33,
  notaMasAlta: 3,
  notaMasBaja: 2,
  porcentajeAprobadas: '0%'
}
*/