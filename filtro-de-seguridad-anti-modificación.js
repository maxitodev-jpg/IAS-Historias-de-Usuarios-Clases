/**
 * Clase responsable de la autorización y protección de operaciones en el sistema.
 * (Solución al Issue #6: Filtro de Seguridad Anti-Modificación)
 */
class GestorSeguridad {
    /**
     * Autoriza o deniega una acción en el sistema según el estado del acta y el rol del usuario conectado.
     * * @param {string} estadoActaActual - "Abierta" o "Cerrada"
     * @param {string} rolUsuario - "Profesor", "Director", "Bedel"
     * @returns {boolean} true si la acción está permitida, false si está bloqueada.
     */
    static verificarPermisoAccion(estadoActaActual, rolUsuario) {
        // Regla: Si el acta está cerrada, solo el "Director" tiene acceso.
        if (estadoActaActual === "Cerrada") {
            return rolUsuario === "Director";
        }

        // Regla: Si el acta está abierta, "Profesor" y "Director" pueden actuar.
        if (estadoActaActual === "Abierta") {
            return rolUsuario === "Profesor" || rolUsuario === "Director";
        }

        // Bloqueo preventivo por defecto si los datos de entrada no son válidos
        return false;
    }
}

