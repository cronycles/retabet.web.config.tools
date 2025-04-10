import { ConfigurationFilesOperationsManager } from "../../managers/configuration/configurationFilesOperationsManager.js";
import { ConfigurationContextManager } from "./configurationContextManager.js";

/**
 * @class ConfigurationFileContextsManager
 * @description Clase para gestionar la edición de contextos de archivos de configuración.
 */
class ConfigurationFileContextsManager {
    static #instance = null;

    #filesOperationsManager = ConfigurationFilesOperationsManager;
    #contextManager = ConfigurationContextManager;

    static getInstance() {
        if (!ConfigurationFileContextsManager.#instance) {
            ConfigurationFileContextsManager.#instance = new ConfigurationFileContextsManager();
        }
        return ConfigurationFileContextsManager.#instance;
    }

    loadFileContextsByFileName(fileName) {
        try {
            let outcome = {
                isOk: false,
                errorType: "UNKNOWN",
                data: null,
            };

            const data = this.#filesOperationsManager.loadAllContextsByFileName(fileName);
            if (data) {
                outcome.isOk = true;
                outcome.data = data;
            }
            return outcome;
        } catch (error) {
            console.error("Error loading contexts from file:", error);
            let outcome = {
                isOk: false,
                errorType: "UNKNOWN",
                data: null,
            };
            return outcome;
        }
    }

    deleteContextInFileByFileName(contextValue, fileName) {
        try {
            let outcome = {
                isOk: false,
                errorType: "UNKNOWN",
            };
            const isDeleted = this.#filesOperationsManager.deleteEntireContextInFile(contextValue, fileName);

            if (isDeleted) {
                this.#contextManager.resetCurrentContext();
                outcome.isOk = true;
            }

            return outcome;
        } catch (error) {
            console.error("Error loading contexts from file:", error);
            let outcome = {
                isOk: false,
                errorType: "UNKNOWN",
                data: null,
            };
            return outcome;
        }
    }

    saveNewContextInFileByFileName(newContext, fileName) {
        try {
            let outcome = {
                isOk: false,
                errorType: "UNKNOWN",
            };

            const isSaved = this.#filesOperationsManager.saveNewContextInFile(contextValue, fileName);

            if (isSaved) {
                this.#contextManager.setCurrentContext(contextValue);
                outcome.isOk = true;
            }

            return outcome;
        } catch (error) {
            console.error("Error loading contexts from file:", error);
            let outcome = {
                isOk: false,
                errorType: "UNKNOWN",
                data: null,
            };
            return outcome;
        }
    }
}

const instance = ConfigurationFileContextsManager.getInstance();
export { ConfigurationFileContextsManager as ConfigurationFilesContextEditorManager, instance as default };
