// =============================================================================
// MÓDULO DE RENDIMIENTO Y REPORTES - SIU QUECHUA
// =============================================================================

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