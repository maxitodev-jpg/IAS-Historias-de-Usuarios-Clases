/**
 * ISSUE #1 - HU1: Módulo del Profesor - Registro de Calificaciones
 * Función que genera la estructura de datos base para una materia.
 *
 * @param {string} nombreMateria       - Nombre de la materia
 * @param {string[]} arrayEvaluaciones - Lista de evaluaciones (ej: ["Parcial 1", "Parcial 2"])
 * @param {number} notaMin             - Nota mínima permitida
 * @param {number} notaMax             - Nota máxima permitida
 * @returns {Object} Configuración completa de la materia
 */
function crearConfiguracionMateria(nombreMateria, arrayEvaluaciones, notaMin, notaMax) {
  // Validaciones básicas de entrada
  if (typeof nombreMateria !== "string" || nombreMateria.trim() === "") {
    throw new Error("El nombre de la materia debe ser un texto no vacío.");
  }
  if (!Array.isArray(arrayEvaluaciones) || arrayEvaluaciones.length === 0) {
    throw new Error("Debe proporcionar al menos una evaluación.");
  }
  if (typeof notaMin !== "number" || typeof notaMax !== "number") {
    throw new Error("Los límites de nota deben ser números.");
  }
  if (notaMin >= notaMax) {
    throw new Error("notaMin debe ser menor que notaMax.");
  }

  return {
    nombreMateria: nombreMateria.trim(),
    evaluaciones: arrayEvaluaciones,
    limites: {
      notaMin,
      notaMax,
    },
    alumnos: [],
  };
}

// ─────────────────────────────────────────────
// PRUEBAS
// ─────────────────────────────────────────────

// Caso exitoso
const materia = crearConfiguracionMateria(
  "Ingeniería de Software",
  ["Parcial 1", "Parcial 2", "Trabajo Práctico"],
  0,
  10
);
console.log("✅ Configuración creada:");
console.log(JSON.stringify(materia, null, 2));

// Caso de error: nota fuera de rango (se prueba al registrar nota, ver HU siguiente)
try {
  crearConfiguracionMateria("Matemáticas", ["Parcial 1"], 10, 5); // notaMin > notaMax
} catch (e) {
  console.error("❌ Error esperado:", e.message);
}