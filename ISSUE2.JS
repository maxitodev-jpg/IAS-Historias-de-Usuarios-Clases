/**

 * ISSUE #2 - HU1: Carga masiva de notas con validación

 *

 * @param {Object}   objetoMateria    - Config creada con crearConfiguracionMateria()

 * @param {Object[]} arrayNuevasNotas - [{alumnoId, evaluacion, nota}, ...]

 * @returns {{ notasCargadas: Object[], alertasErrores: Object[] }}

 */

function procesarCargaMasiva(objetoMateria, arrayNuevasNotas) {

  const { notaMin, notaMax } = objetoMateria.limites;



  const notasCargadas  = [];

  const alertasErrores = [];



  for (const item of arrayNuevasNotas) {

    const { alumnoId, evaluacion, nota } = item;



    // Validar que la evaluacion exista en la materia

    if (!objetoMateria.evaluaciones.includes(evaluacion)) {

      alertasErrores.push({

        alumnoId,

        evaluacion,

        nota,

        error: `La evaluación "${evaluacion}" no existe en la materia "${objetoMateria.nombreMateria}".`,

      });

      continue;

    }



    // Validar rango de nota

    if (nota < notaMin || nota > notaMax) {

      alertasErrores.push({

        alumnoId,

        evaluacion,

        nota,

        error: `Nota ${nota} fuera de rango. Debe estar entre ${notaMin} y ${notaMax}.`,

      });

      continue;

    }



    // Nota válida → cargar

    notasCargadas.push({ alumnoId, evaluacion, nota });

  }



  return { notasCargadas, alertasErrores };

}





// ─────────────────────────────────────────────

// PRUEBAS

// ─────────────────────────────────────────────



// 1. Crear materia (reutilizando Issue 1)

const materia = crearConfiguracionMateria(

  "Ingeniería de Software",

  ["Parcial 1", "Parcial 2", "Trabajo Práctico"],

  0,

  10

);



// 2. Lote de notas a cargar (mezcla válidas e inválidas)

const loteNotas = [

  { alumnoId: "A001", evaluacion: "Parcial 1",        nota: 8  },  // ✅ válida

  { alumnoId: "A002", evaluacion: "Parcial 1",        nota: 12 },  // ❌ fuera de rango

  { alumnoId: "A003", evaluacion: "Trabajo Práctico", nota: 5  },  // ✅ válida

  { alumnoId: "A004", evaluacion: "Parcial 2",        nota: -1 },  // ❌ fuera de rango

  { alumnoId: "A005", evaluacion: "Examen Final",     nota: 7  },  // ❌ evaluación inexistente

  { alumnoId: "A006", evaluacion: "Parcial 2",        nota: 0  },  // ✅ válida (límite mínimo)

  { alumnoId: "A007", evaluacion: "Parcial 1",        nota: 10 },  // ✅ válida (límite máximo)

];



// 3. Procesar

const resultado = procesarCargaMasiva(materia, loteNotas);



console.log("✅ Notas cargadas:", resultado.notasCargadas);

console.log("❌ Alertas/Errores:", resultado.alertasErrores);