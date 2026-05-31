<h1> Trabajo práctico N°4<h1>
<h2>Historias de Usuarios (Usando Clases)</h2>
-----------------------------------------------
<h3>
  Integrantes:
- Barrionuevo Santiago,
- Carvajal Martín,
- Pepi José Ignacio,
- Torres Maximiliano.
</h3>

1. <b> Módulo del Profesor: Registro de Calificaciones
Historia de Usuario 1 </b>

COMO profesor de la universidad

QUIERO registrar las calificaciones de mis estudiantes en los diferentes componentes de evaluación

PARA mantener el progreso académico de la materia actualizado.
Criterios de Aceptación

    Escenario: Registro exitoso de una nota dentro del rango permitido

        DADO que me encuentro en la sección de la materia asignada y seleccioné una evaluación específica.

        CUANDO ingreso una nota válida (por ejemplo, entre 0 y 10 o 1 y 5, según la escala) para un estudiante y hago clic en "Guardar".

        ENTONCES el sistema debe almacenar la calificación y mostrar un mensaje de éxito que diga "Calificación guardada correctamente".

    Escenario: Intento de registrar una nota fuera del rango válido

        DADO que estoy editando las notas de un examen.

        CUANDO intento ingresar un valor fuera del rango permitido (por ejemplo, una nota negativa o mayor al máximo).

        ENTONCES el sistema no debe guardar el cambio y debe mostrar un mensaje de error indicando los límites válidos de la calificación.

2. <b> Módulo del Estudiante: Consulta de Notas
Historia de Usuario 2 </b>

COMO estudiante universitario

QUIERO visualizar mis calificaciones parciales y finales de las materias que estoy cursando

PARA hacer un seguimiento de mi rendimiento académico durante el semestre.
Criterios de Aceptación

    Escenario: Consulta de notas del periodo actual

        DADO que he iniciado sesión con mi cuenta de estudiante y accedo a la sección "Mis Calificaciones".

        CUANDO selecciono el periodo académico actual.

        ENTONCES el sistema debe mostrar una lista de las materias inscritas, el desglose de notas parciales y el promedio acumulado hasta el momento.

3. <b> Módulo de Administración: Cierre de Actas
Historia de Usuario 3 </b>

COMO director de carrera o administrador del sistema

QUIERO realizar el cierre oficial del acta de calificaciones de una materia

PARA consolidar las notas definitivas en el historial académico oficial de los estudiantes y evitar modificaciones posteriores.
Criterios de Aceptación

    Escenario: Cierre de acta con todas las notas completas

        DADO que reviso el estado de una materia que ya tiene el 100% de sus evaluaciones calificadas por el profesor.

        CUANDO hago clic en el botón "Cerrar Acta" y confirmo la acción.

        ENTONCES el sistema debe cambiar el estado del acta a "Cerrada", bloquear la edición de notas para el profesor y enviar las calificaciones finales al boletín oficial del alumno.

4. <b> Módulo del Profesor: Modificación de Notas (Extemporánea)
Historia de Usuario 4 </b>

COMO profesor de la universidad

QUIERO solicitar la corrección de una calificación ya guardada

PARA subsanar un error humano en la digitación antes del cierre definitivo del periodo.
Criterios de Aceptación

    Escenario: Modificación antes del cierre de actas

        DADO que el acta de la materia aún se encuentra en estado "Abierta".

        CUANDO selecciono la nota del estudiante, modifico el valor por uno nuevo válido y justifico el cambio en el campo obligatorio de observaciones.

        ENTONCES el sistema debe actualizar la nota, recalcular el promedio del estudiante y registrar el cambio en el historial de auditoría del sistema.

        https://gemini.google.com/app/5e6c541abfe928ef?android-min-version=301356232&ios-min-version=322.0&is_sa=1&campaign_id=gemini_overview_page&utm_source=gemini&utm_medium=web&utm_campaign=microsite_gemini_about_page&pt=9008&mt=8&ct=gemini_overview_page&hl=es-ES&icid=microsite_gemini_about_page&_gl=1*pvedul*_gcl_au*MTcxODU1NjE2NC4xNzc5Mjg3NTk2*_ga*MTA4NTY0MTI2MC4xNzc5Mjg3NTk2*_ga_WC57KJ50ZZ*czE3ODAyNjM5ODUkbzQkZzAkdDE3ODAyNjM5ODUkajYwJGwwJGgw
