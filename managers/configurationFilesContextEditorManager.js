import { ConfigurationFilesContextHelper } from "../helpers/configurationFilesContextHelper.js";
import { ConfigurationFilesCrudHelper } from "../helpers/configurationFilesCrudHelper.js";

/**
 * @class ConfigurationFilesContextEditorManager
 * @description Clase para gestionar la edición de contextos de archivos de configuración.
 */
class ConfigurationFilesContextEditorManager {
    static #instance = null;

    #filesCrudHelper = ConfigurationFilesCrudHelper;
    #filesContextHelper = ConfigurationFilesContextHelper;

    static getInstance() {
        if (!ConfigurationFilesContextEditorManager.#instance) {
            ConfigurationFilesContextEditorManager.#instance = new ConfigurationFilesContextEditorManager();
        }
        return ConfigurationFilesContextEditorManager.#instance;
    }

    loadFileContextsByFileName(fileName) {
        try {
            let outcome = {
                isOk: false,
                errorType: "UNKNOWN",
                data: null,
            };

            const configFileContent = this.#filesCrudHelper.getConfigurationFileByName(fileName);
            const data = this.#filesContextHelper.getKeysAndValuesContextJsonByFileContent(configFileContent);
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
                data: null,
            };

            const configFileContent = this.#filesCrudHelper.getConfigurationFileByName(fileName);
            const isDeleted = this.#filesContextHelper.deleteContextInFileContent(contextValue, configFileContent);
            if (isDeleted) {
                const isSaved = this.#filesCrudHelper.saveConfigurationFileByName(configFileContent, fileName);
                if (isSaved) {
                    outcome.isOk = true;
                    outcome.data = true;
                }
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
                data: null,
            };

            const configFileContent = this.#filesCrudHelper.getConfigurationFileByName(fileName);
            configFileContent = this.#filesContextHelper.addNewContextInFileContent(newContext, configFileContent);
            if (configFileContent) {
                const isSaved = this.#filesCrudHelper.saveConfigurationFileByName(configFileContent, fileName);
                if (isSaved) {
                    outcome.isOk = true;
                    outcome.data = true;
                }
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

const instance = ConfigurationFilesContextEditorManager.getInstance();
export { ConfigurationFilesContextEditorManager, instance as default };
