import { ConfigurationCurrentContextHandler } from "../../handlers/configuration/configurationCurrentContextHandler.js";
import { ConfigurationFilesCrudHandler } from "../../handlers/configuration/ConfigurationFilesCrudHandler.js";

/**
 * @class ConfigurationContextManager
 * @description Clase para gestionar el contexto de toda la configuración.
 */
class ConfigurationContextManager {
    static #instance = null;

    #contextConfigPropertiesFileName = "contextConfiguration.schema.json";

    #currentContextHandler = ConfigurationCurrentContextHandler;
    #filesCrudHandler = ConfigurationFilesCrudHandler;

    static getInstance() {
        if (!ConfigurationContextManager.#instance) {
            ConfigurationContextManager.#instance = new ConfigurationContextManager();
        }
        return ConfigurationContextManager.#instance;
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

const instance = ConfigurationContextManager.getInstance();
export { ConfigurationContextManager, instance as default };
