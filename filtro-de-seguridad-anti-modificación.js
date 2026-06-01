/**
 * Autoriza o deniega una acción en el sistema según el estado del acta y el rol del usuario.
 * @param {string} estadoActaActual - "Abierta" o "Cerrada"
 * @param {string} rolUsuario - "Profesor", "Director", "Bedel"
 * @returns {boolean} True si la acción está permitida, false si está bloqueada.
 */
function verificarPermisoAccion(estadoActaActual, rolUsuario) {
    // Regla 1: Si el acta está CERRADA, solo el "Director" puede realizar modificaciones
    if (estadoActaActual === "Cerrada") {
        return rolUsuario === "Director";
    }

    // Regla 2: Si el acta está ABIERTA, tanto el "Profesor" como el "Director" pueden actuar
    if (estadoActaActual === "Abierta") {
        return rolUsuario === "Profesor" || rolUsuario === "Director";
    }

    // Por seguridad, cualquier estado de acta desconocido o rol no mapeado se deniega automáticamente
    return false;
}
