// Clase que define la estructura del reporte estadístico final
class EstadisticasRendimiento {
    constructor(promedioGeneral, notaMasAlta, notaMasBaja, porcentajeAprobadas) {
        this.promedioGeneral = promedioGeneral;
        this.notaMasAlta = notaMasAlta;
        this.notaMasBaja = notaMasBaja;
        this.porcentajeAprobadas = porcentajeAprobadas;
    }
}

// Clase de servicio encargada de los cálculos algorítmicos
class AnalizadorEstadistico {
    
    /**
     * Procesa un array de notas y devuelve una instancia con las estadísticas
     * @param {Array<number>} notas - Historial de notas numéricas
     * @param {number} notaCorte - Nota mínima para considerar aprobado (por defecto 4)
     * @returns {EstadisticasRendimiento}
     */
    static analizar(notas, notaCorte = 4) {
        // Control de excepciones: Si no hay notas cargadas, evitamos errores de división por cero
        if (!Array.isArray(notas) || notas.length === 0) {
            return new EstadisticasRendimiento(0, 0, 0, "0%");
        }

        // 1. Calcular Promedio General
        const sumaTotal = notas.reduce((acumulador, notaActual) => acumulador + notaActual, 0);
        const promedio = Number((sumaTotal / notas.length).toFixed(2));

        // 2. Calcular extremos (Nota más alta y más baja)
        const maxima = Math.max(...notas);
        const minima = Math.min(...notas);

        // 3. Calcular porcentaje de evaluaciones aprobadas
        const cantidadAprobadas = notas.filter(nota => nota >= notaCorte).length;
        const porcentajeCalculado = (cantidadAprobadas / notas.length) * 100;
        const porcentajeFormateado = `${Number(porcentajeCalculado.toFixed(1))}%`;

        // Retornamos un nuevo objeto instanciado a partir de su clase constructora
        return new EstadisticasRendimiento(
            promedio, 
            maxima, 
            minima, 
            porcentajeFormateado
        );
    }
}

// ==========================================
// EJEMPLO DE USO Y PRUEBA DE ESCRITORIO
// ==========================================

// Imaginemos las notas de parciales de un alumno en el cuatrimestre
const notasDeCursada = [8, 2, 7, 10, 5]; 

// Invocamos el método estático de la clase de servicio
const reporteEstadistico = AnalizadorEstadistico.analizar(notasDeCursada);

// Mostramos la instancia de la clase por consola
console.log("--- OBJETO ESTADÍSTICAS GENERADO ---");
console.log(reporteEstadistico);

// Comprobación de que es una instancia real de la clase EstadisticasRendimiento
console.log(`\n¿Es una instancia válida?: ${reporteEstadistico instanceof EstadisticasRendimiento}`);