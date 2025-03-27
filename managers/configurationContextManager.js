class ConfigurationContextManager {
    #currentContext;

    constructor() {
        if (ConfigurationContextManager.instance) {
            return ConfigurationContextManager.instance; // Reutiliza la instancia existente
        }
        this.#currentContext = ""; // Inicializa el contexto vacío
        ConfigurationContextManager.instance = this; // Guarda la instancia
        Object.freeze(this); // Congela la instancia para evitar modificaciones
    }

    getCurrentContext() {
        return this.#currentContext;
    }

    setCurrentContext(newContext) {
        this.#currentContext = newContext;
    }
}

// Exporta siempre la misma instancia
const instance = new ConfigurationContextManager();
export default instance;
