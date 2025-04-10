import ConfigurationCurrentContextHandler from "../../handlers/configuration/configurationCurrentContextHandler.js";
import ConfigurationFilesCrudHandler from "../../handlers/configuration/configurationFilesCrudHandler.js";

/**
 * @class ConfigurationContextManager
 * @description Clase para gestionar el contexto de toda la configuración.
 */
export default class ConfigurationContextManager {
    #contextConfigPropertiesFileName = "contextConfiguration.schema.json";
    #currentContextHandler;
    #filesCrudHandler;

    constructor() {
        if (ConfigurationContextManager.instance) {
            return ConfigurationContextManager.instance;
        }
        this.#currentContextHandler = new ConfigurationCurrentContextHandler();
        this.#filesCrudHandler = new ConfigurationFilesCrudHandler();

        ConfigurationContextManager.instance = this;
    }

    getCurrentContext() {
        return this.#currentContextHandler.getCurrentContext();
    }

    setCurrentContext(newContext) {
        this.#currentContextHandler.setCurrentContext(newContext);
    }

    resetCurrentContext() {
        this.#currentContextHandler.resetCurrentContext();
    }

    getContextConfigurationAvailableProperties() {
        return this.#filesCrudHandler.getConfigurationFileByName(this.#contextConfigPropertiesFileName);
    }
}
