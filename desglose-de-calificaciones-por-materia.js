// Clase que define las reglas para evaluar la condición académica
class EvaluadorCondicion {
    static PROMOCIONADO = "Promocionado";
    static REGULAR = "Regular";
    static LIBRE = "Libre";

    /**
     * Determina la condición final basándose en el promedio y las notas parciales
     * @param {number} promedio 
     * @param {Array<number>} notas 
     * @returns {string}
     */
    static evaluar(promedio, notas) {
        if (notas.length === 0 || promedio < 4) {
            return this.LIBRE;
        }
        
        if (promedio >= 7) {
            // Regla de negocio común: Para promocionar no se permiten aplazos (notas menores a 4)
            const tieneAplazos = notas.some(nota => nota < 4);
            return tieneAplazos ? this.REGULAR : this.PROMOCIONADO;
        }
        
        return this.REGULAR;
    }
}

// Clase Entidad que representa la estructura del Boletín final
class Boletin {
    constructor(alumnoId, periodo) {
        this.alumnoId = alumnoId;
        this.periodoActual = periodo;
        this.fechaGeneracion = new Date().toLocaleDateString();
        this.materias = [];
    }

    agregarMateriaDetalle(nombreMateria, notas, promedio, condicion) {
        this.materias.push({
            nombreMateria,
            notasParciales: notas,
            promedioAcumulado: promedio,
            condicion: condicion
        });
    }
}

// Clase de Servicio encargada de procesar los datos de la facultad
class GeneradorBoletinService {
    /**
     * Procesa el historial de la facultad y genera el boletín de un alumno
     * @param {Array} historialFacultad - Array de objetos/instancias de materias
     * @param {number|string} alumnoId - ID del estudiante a consultar
     * @param {string} periodo - Periodo académico (ej: "2026-C1")
     * @returns {Boletin} Instancia de la clase Boletin
     */
    static generar(historialFacultad, alumnoId, periodo) {
        // Instanciamos el objeto Boletín usando su clase constructora
        const nuevoBoletin = new Boletin(alumnoId, periodo);

        // Recorremos el historial
        historialFacultad.forEach(materia => {
            // Filtramos las calificaciones que coinciden con el alumno y el periodo solicitado
            const notasAlumno = materia.calificaciones
                .filter(c => c.estudianteId === alumnoId && c.periodo === periodo)
                .map(c => c.nota);

            // Si el alumno no registra actividad en esta materia, continuamos con la siguiente
            if (notasAlumno.length === 0) return;

            // Calculamos el promedio matemático
            const sumaTotal = notasAlumno.reduce((acc, nota) => acc + nota, 0);
            const promedio = Number((sumaTotal / notasAlumno.length).toFixed(2));

            // Delegamos la lógica de la condición a la clase especialista (EvaluadorCondicion)
            const condicionFinal = EvaluadorCondicion.evaluar(promedio, notasAlumno);

            // Insertamos el registro procesado dentro de nuestra instancia de Boletín
            nuevoBoletin.agregarMateriaDetalle(
                materia.nombre, 
                notasAlumno, 
                promedio, 
                condicionFinal
            );
        });

        return nuevoBoletin;
    }
}

// ==========================================
// MOCK DE DATOS Y PRUEBA DE EJECUCIÓN
// ==========================================

// Simulamos la estructura de datos que vendría del historial de la facultad
const historialFacultadDB = [
    {
        id: 101,
        nombre: "Programación Web",
        calificaciones: [
            { estudianteId: 777, periodo: "2026-C1", nota: 9 },
            { estudianteId: 777, periodo: "2026-C1", nota: 8 } // Promedio 8.5 -> Promocionado
        ]
    },
    {
        id: 102,
        nombre: "Bases de Datos",
        calificaciones: [
            { estudianteId: 777, periodo: "2026-C1", nota: 6 },
            { estudianteId: 777, periodo: "2026-C1", nota: 5 } // Promedio 5.5 -> Regular
        ]
    },
    {
        id: 103,
        nombre: "Matemática Discreta",
        calificaciones: [
            { estudianteId: 777, periodo: "2026-C1", nota: 2 },
            { estudianteId: 777, periodo: "2026-C1", nota: 3 } // Promedio 2.5 -> Libre
        ]
    }
];

// Ejecutamos la función miembro de la clase de servicio
const miBoletinOficial = GeneradorBoletinService.generar(historialFacultadDB, 777, "2026-C1");

// Mostramos el resultado por consola
console.log(miBoletinOficial);