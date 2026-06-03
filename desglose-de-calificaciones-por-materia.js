// Definición de las reglas de negocio para las condiciones de la materia
const CONDICIONES = {
    PROMOCIONADO: "Promocionado", // Promedioo >= 7 y ninguna nota aplazada
    REGULAR: "Regular",           // Promedio >= 4 y < 7
    LIBRE: "Libre"                // Promedio < 4 o sin notas
};

class GeneradorBoletin {
    /**
     * Issue 3: Generador de Boletín Completo por Periodo
     * @param {Array} historialFacultad - Array de materias con sus respectivas calificaciones.
     * @param {number|string} alumnoId - ID del alumno a consultar.
     * @param {string} periodo - El periodo académico actual (ej: "2026-C1").
     */
    static generar(historialFacultad, alumnoId, periodo) {
        
        // 1. Inicializamos la estructura limpia del objeto Boletín solicitado
        const boletin = {
            alumnoId: alumnoId,
            periodoActual: periodo,
            fechaGeneracion: new Date().toLocaleDateString(),
            materias: []
        };

        // 2. Recorremos el historial completo de la facultad
        historialFacultad.forEach(materia => {
            // Filtramos las notas que le pertenecen específicamente a este alumno en este período
            const notasAlumno = materia.calificaciones
                .filter(c => c.estudianteId === alumnoId && c.periodo === periodo)
                .map(c => c.nota);

            // Si el alumno no registra cursada o notas en esta materia durante el periodo, saltamos
            if (notasAlumno.length === 0) return;

            // 3. Motor de cálculo: Sumamos y sacamos el promedio exacto
            const sumaTotal = notasAlumno.reduce((acc, nota) => acc + nota, 0);
            const promedio = Number((sumaTotal / notasAlumno.length).toFixed(2));

            // 4. Motor de Reglas: Evaluamos la condición del alumno
            let condicion = CONDICIONES.LIBRE;
            
            if (promedio >= 7) {
                // Para promocionar, usualmente se exige que ningún parcial sea menor a 6 o 7. 
                // Aquí validamos que ninguna nota sea un aplazo (menor a 4) y que el promedio dé para promoción.
                const tieneAplazos = notasAlumno.some(nota => nota < 4);
                condicion = tieneAplazos ? CONDICIONES.REGULAR : CONDICIONES.PROMOCIONADO;
            } else if (promedio >= 4) {
                condicion = CONDICIONES.REGULAR;
            }

            // 5. Agregamos el desglose detallado de la materia al boletín
            boletin.materias.push({
                nombreMateria: materia.nombre,
                notasParciales: notasAlumno,
                promedioAcumulado: promedio,
                condicion: condicion
            });
        });

        return boletin;
    }
}

// ==========================================
// SIMULACIÓN DE DATOS (HISTORIAL DE LA FACULTAD)
// ==========================================

const baseDeDatosFacultad = [
    {
        id: 101,
        nombre: "Programación Web",
        calificaciones: [
            { estudianteId: 777, periodo: "2026-C1", nota: 8 },
            { estudianteId: 777, periodo: "2026-C1", nota: 9 }, // Promedio: 8.5 -> Promocionado
            { estudianteId: 888, periodo: "2026-C1", nota: 4 }
        ]
    },
    {
        id: 102,
        nombre: "Bases de Datos",
        calificaciones: [
            { estudianteId: 777, periodo: "2026-C1", nota: 5 },
            { estudianteId: 777, periodo: "2026-C1", nota: 6 }, // Promedio: 5.5 -> Regular
        ]
    },
    {
        id: 103,
        nombre: "Matemática Discreta",
        calificaciones: [
            { estudianteId: 777, periodo: "2026-C1", nota: 2 },
            { estudianteId: 777, periodo: "2026-C1", nota: 3 }, // Promedio: 2.5 -> Libre
        ]
    },
    {
        id: 104,
        nombre: "Arquitectura de Software",
        calificaciones: [
            { estudianteId: 777, periodo: "2025-C2", nota: 10 } // Nota de un PERIODO VIEJO (no debe entrar)
        ]
    }
];

// ==========================================
// EJECUCIÓN DEL GENERADOR
// ==========================================

const idAlumnoAConsultar = 777;
const periodoActual = "2026-C1";

const boletinOficial = GeneradorBoletin.generar(baseDeDatosFacultad, idAlumnoAConsultar, periodoActual);

// Imprimimos la estructura limpia del Boletín por consola
console.log(`--- BOLETÍN OFICIAL - PERIODO ${periodoActual} ---`);
console.log(JSON.stringify(boletinOficial, null, 2));