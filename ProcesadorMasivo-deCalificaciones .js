class GestorDeNotas {
  constructor(objetoMateria) {
    if (!objetoMateria || typeof objetoMateria !== "object") {
      throw new Error("Se debe proporcionar un objeto materia válido.");
    }
    this.materia = objetoMateria;
    this.notasCargadas = [];
    this.alertasErrores = [];
  }

  // Validar una nota individual según los límites de la materia
  _validarNota(alumnoId, evaluacion, nota) {
    const errores = [];

    if (!alumnoId || typeof alumnoId !== "string") {
      errores.push("El alumnoId debe ser un string no vacío.");
    }
    if (!evaluacion || typeof evaluacion !== "string") {
      errores.push("La evaluación debe ser un string no vacío.");
    }
    if (typeof nota !== "number" || isNaN(nota)) {
      errores.push("La nota debe ser un número válido.");
    }
    if (
      typeof nota === "number" &&
      (nota < this.materia.configuracion.notaMin ||
        nota > this.materia.configuracion.notaMax)
    ) {
      errores.push(
        `La nota ${nota} está fuera del rango permitido ` +
          `(${this.materia.configuracion.notaMin} - ${this.materia.configuracion.notaMax}).`
      );
    }
    if (
      !this.materia.configuracion.evaluaciones.some(
        (ev) => ev.nombre === evaluacion
      )
    ) {
      errores.push(
        `La evaluación "${evaluacion}" no existe en la materia.`
      );
    }

    return errores;
  }

  // Función principal que pide el issue
  procesarCargaMasiva(arrayNuevasNotas) {
    if (!Array.isArray(arrayNuevasNotas) || arrayNuevasNotas.length === 0) {
      throw new Error("El array de notas debe tener al menos un elemento.");
    }

    // Resetear resultados anteriores
    this.notasCargadas = [];
    this.alertasErrores = [];

    // Recorrer cada nota del lote
    for (const item of arrayNuevasNotas) {
      const { alumnoId, evaluacion, nota } = item;

      const errores = this._validarNota(alumnoId, evaluacion, nota);

      if (errores.length === 0) {
        // La nota pasó todas las validaciones
        this.notasCargadas.push({
          alumnoId,
          evaluacion,
          nota,
          estado: "OK",
          fechaCarga: new Date().toISOString(),
        });
      } else {
        // La nota fue rebotada
        this.alertasErrores.push({
          alumnoId,
          evaluacion,
          nota,
          estado: "ERROR",
          errores,
          fechaIntento: new Date().toISOString(),
        });
      }
    }

    return this._generarReporte();
  }

  // Generar el reporte final
  _generarReporte() {
    return {
      resumen: {
        totalProcesadas: this.notasCargadas.length + this.alertasErrores.length,
        totalExitosas: this.notasCargadas.length,
        totalErrores: this.alertasErrores.length,
      },
      notasCargadas: this.notasCargadas,
      alertasErrores: this.alertasErrores,
    };
  }

  // Mostrar el reporte en consola
  mostrarReporte() {
    const reporte = this._generarReporte();
    console.log("========================================");
    console.log("        REPORTE DE CARGA MASIVA");
    console.log("========================================");
    console.log(`Total procesadas : ${reporte.resumen.totalProcesadas}`);
    console.log(`Cargadas con éxito: ${reporte.resumen.totalExitosas}`);
    console.log(`Con errores      : ${reporte.resumen.totalErrores}`);

    console.log("\n✅ NOTAS CARGADAS:");
    if (reporte.notasCargadas.length === 0) {
      console.log("  No hay notas cargadas.");
    } else {
      reporte.notasCargadas.forEach((n) => {
        console.log(`  Alumno: ${n.alumnoId} | ${n.evaluacion} | Nota: ${n.nota} | ${n.fechaCarga}`);
      });
    }

    console.log("\n❌ ALERTAS Y ERRORES:");
    if (reporte.alertasErrores.length === 0) {
      console.log("  No hay errores.");
    } else {
      reporte.alertasErrores.forEach((e) => {
        console.log(`  Alumno: ${e.alumnoId} | ${e.evaluacion} | Nota: ${e.nota}`);
        e.errores.forEach((err) => console.log(`    → ${err}`));
      });
    }
    console.log("========================================");
  }
}