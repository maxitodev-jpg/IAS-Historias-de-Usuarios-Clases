class Materia {
  constructor(nombreMateria, arrayEvaluaciones, notaMin, notaMax) {
    this._validarParametros(nombreMateria, arrayEvaluaciones, notaMin, notaMax);

    this.nombreMateria = nombreMateria;
    this.evaluaciones = arrayEvaluaciones;
    this.notaMin = notaMin;
    this.notaMax = notaMax;
    this.alumnos = [];
    this.fechaCreacion = new Date().toISOString();
  }

  // Validaciones de entrada
  _validarParametros(nombreMateria, arrayEvaluaciones, notaMin, notaMax) {
    if (!nombreMateria || typeof nombreMateria !== "string") {
      throw new Error("El nombre de la materia debe ser un string no vacío.");
    }
    if (!Array.isArray(arrayEvaluaciones) || arrayEvaluaciones.length === 0) {
      throw new Error("Las evaluaciones deben ser un array con al menos un elemento.");
    }
    if (typeof notaMin !== "number" || typeof notaMax !== "number") {
      throw new Error("Las notas mínima y máxima deben ser números.");
    }
    if (notaMin >= notaMax) {
      throw new Error("La nota mínima debe ser menor que la nota máxima.");
    }
  }

  // Función principal que pide el issue
  crearConfiguracionMateria() {
    return {
      nombreMateria: this.nombreMateria,
      fechaCreacion: this.fechaCreacion,
      configuracion: {
        notaMin: this.notaMin,
        notaMax: this.notaMax,
        totalEvaluaciones: this.evaluaciones.length,
        evaluaciones: this.evaluaciones.map((evaluacion, index) => ({
          id: index + 1,
          nombre: evaluacion,
          notaMin: this.notaMin,
          notaMax: this.notaMax,
        })),
      },
      alumnos: this.alumnos,
    };
  }

  // Agregar una evaluación después de crear la materia
  agregarEvaluacion(nombreEvaluacion) {
    if (!nombreEvaluacion || typeof nombreEvaluacion !== "string") {
      throw new Error("El nombre de la evaluación debe ser un string no vacío.");
    }
    if (this.evaluaciones.includes(nombreEvaluacion)) {
      throw new Error(`La evaluación "${nombreEvaluacion}" ya existe.`);
    }
    this.evaluaciones.push(nombreEvaluacion);
    console.log(`Evaluación "${nombreEvaluacion}" agregada correctamente.`);
  }

  // Eliminar una evaluación
  eliminarEvaluacion(nombreEvaluacion) {
    const index = this.evaluaciones.indexOf(nombreEvaluacion);
    if (index === -1) {
      throw new Error(`La evaluación "${nombreEvaluacion}" no existe.`);
    }
    this.evaluaciones.splice(index, 1);
    console.log(`Evaluación "${nombreEvaluacion}" eliminada correctamente.`);
  }

  // Actualizar el rango de notas
  actualizarRangoNotas(nuevaNotaMin, nuevaNotaMax) {
    if (typeof nuevaNotaMin !== "number" || typeof nuevaNotaMax !== "number") {
      throw new Error("Las notas deben ser números.");
    }
    if (nuevaNotaMin >= nuevaNotaMax) {
      throw new Error("La nota mínima debe ser menor que la nota máxima.");
    }
    this.notaMin = nuevaNotaMin;
    this.notaMax = nuevaNotaMax;
    console.log(`Rango de notas actualizado: ${nuevaNotaMin} - ${nuevaNotaMax}`);
  }

  // Mostrar un resumen de la configuración en consola
  mostrarResumen() {
    const config = this.crearConfiguracionMateria();
    console.log("========================================");
    console.log(`       MATERIA: ${config.nombreMateria.toUpperCase()}`);
    console.log("========================================");
    console.log(`Fecha de creación : ${config.fechaCreacion}`);
    console.log(`Rango de notas    : ${config.configuracion.notaMin} - ${config.configuracion.notaMax}`);
    console.log(`Total evaluaciones: ${config.configuracion.totalEvaluaciones}`);
    console.log("Evaluaciones:");
    config.configuracion.evaluaciones.forEach((ev) => {
      console.log(`  [${ev.id}] ${ev.nombre}`);
    });
    console.log(`Alumnos inscriptos: ${config.alumnos.length}`);
    console.log("========================================");
  }
}
