import ConfigurationContextManager from "./configurationContextManager.js";
import ConfigurationJsonsManager from "./configurationJsonsManager.js";

class ConfigurationFilesManager {
    #contextManager;
    #jsonManager;

    constructor() {
        this.#contextManager = ConfigurationContextManager;
        this.#jsonManager = ConfigurationJsonsManager;
    }

    /**
     * ésta función te da el objeto de configuración entero con el contexto actual (contexto que esta en memoria).
     * si no le pasas el segundo parámetro, supondrá que el objeto a devolver está en el tercer puesto: "Configuracion"--> "Nombre_CONF" --> AQUI!
     * si le pasas el segundo parámetro el te devolverá el objeto que está debajo de esa gerarquia y, si no hay nada, te devolverá la gerarquía de objetos vacíos 
     * @param {*} filePath 
     * @returns 
     */
    getConfigurationObjectFromFileInTheCurrentContext(filePath) {
        var jsonFile = this.#jsonManager.readJson(filePath);
        let outcome = jsonFile[0];

        for (const fileContextPartObj of jsonFile) {
            if (this.#isFileContextPartCorrespondingToTheCurrentContext(fileContextPartObj)) {
                outcome = fileContextPartObj;
                break;
            }
        }
        return outcome;
    }

    #isFileContextPartCorrespondingToTheCurrentContext(fileContextPartObj) {
        let outcome = false;
        const currentContext = this.#getCurrentConfigurationContext();
        const contextString = this.#getKeysAndValueContextStringByEntireContext(fileContextPartObj);
        if (contextString === currentContext) {
            outcome = true;
        }

        return outcome;
    }

    #getKeysAndValueContextStringByEntireContext(jsonContext) {
        return Object.entries(jsonContext)
            .filter(([key]) => key !== "Configuration")
            .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
            .join(", ");
    }

    #getCurrentConfigurationContext() {
        let outcome = "";
        const currentContext = this.#contextManager.getCurrentContext();
        if (currentContext != null) {
            outcome = currentContext;
        }
        return outcome;
    }
}
export default new ConfigurationFilesManager();
