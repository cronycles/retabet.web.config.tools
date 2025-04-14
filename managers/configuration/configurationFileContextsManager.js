import ConfigurationFilesOperationsManager from "../../managers/configuration/configurationFilesOperationsManager.js";
import ConfigurationContextManager from "./configurationContextManager.js";

/**
 * @class ConfigurationFileContextsManager
 * @description Clase para gestionar la edición de contextos de archivos de configuración.
 */
export default class ConfigurationFileContextsManager {
    #filesOperationsManager;
    #contextManager;

    constructor() {
        if (ConfigurationFileContextsManager.instance) {
            return ConfigurationFileContextsManager.instance;
        }

        this.#filesOperationsManager = new ConfigurationFilesOperationsManager();
        this.#contextManager = new ConfigurationContextManager();

        ConfigurationFileContextsManager.instance = this;
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

    saveNewContextInFileByFileName(contextValue, fileName) {
        try {
            let outcome = {
                isOk: false,
                errorType: "UNKNOWN",
            };

            const saveContextOutput = this.#filesOperationsManager.saveNewContextInFile(contextValue, fileName);

            if (saveContextOutput && saveContextOutput.isOk) {
                this.#contextManager.setCurrentContext(contextValue);
            }

            outcome = saveContextOutput;

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
