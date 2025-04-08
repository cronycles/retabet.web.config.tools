import path from "path";
import { fileURLToPath } from "url";

import ConfigurationCurrentContextManager from "../../../managers/configurationCurrentContextManager.js";
import ConfigurationFilesManager from "../../../managers/configurationFilesManager.js";
import ConfigurationFilesContextManager from "../../../managers/configurationFilesContextManager.js";
import ConfigurationJsonsManager from "../../../managers/configurationJsonsManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ConfigurationContextSelectorModuleManager {
    static #instance = null;
    #jsonManager = ConfigurationJsonsManager;
    #filesManager = ConfigurationFilesManager;
    #filesContextManager = ConfigurationFilesContextManager;
    #currentContextManager = ConfigurationCurrentContextManager;

    #contextConfigPropertiesFilePath = path.join(__dirname, "../../../data", "contextConfiguration.schema.json");

    static getInstance() {
        if (!ConfigurationContextSelectorModuleManager.#instance) {
            ConfigurationContextSelectorModuleManager.#instance = new ConfigurationContextSelectorModuleManager();
        }
        return ConfigurationContextSelectorModuleManager.#instance;
    }

    loadFileContextsByFileName(fileName) {
        try {
            let outcome = {
                isOk: false,
                errorType: "UNKNOWN",
                data: null,
            };

            let data = [];
            const FileContextsResponse = this.#filesContextManager.loadFileContextsByFileName(fileName);
            if (FileContextsResponse?.isOk && FileContextsResponse.data) {
                const contexts = FileContextsResponse.data;
                contexts.forEach(context => {
                    let stringContext = JSON.stringify(context);
                    let contextOutput = {
                        textContent: stringContext === "{}" ? "Default" : stringContext,
                        value: stringContext,
                    };
                    data.push(contextOutput);
                });

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

    setSelectedContextFromString(stringContext) {
        const jsonContext = JSON.parse(stringContext);
        return this.#currentContextManager.setCurrentContext(jsonContext);
    }

    getSelectedContext() {
        return this.#currentContextManager.getCurrentContext();
    }

    getContextConfigProperties() {
        try {
            let outcome = {
                isOk: false,
                errorType: "UNKNOWN",
                data: null,
            };
            const jsonFile = this.#jsonManager.readJson(this.#contextConfigPropertiesFilePath);
            if (jsonFile) {
                outcome.isOk = true;
                outcome.data = jsonFile;
            }
            return outcome;
        } catch (error) {
            console.error(`Error getContextConfigProperties:`, error);
            return {
                isOk: false,
                errorType: "INTERNAL_SERVICE_ERROR",
                data: null,
            };
        }
    }

    saveConfigFileByName(updatedContent, fileName) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
            data: null,
        };

        if (updatedContent && fileName) {
            const fileContent = this.#filesManager.saveConfigurationFileByName(updatedContent, fileName);
            if (fileContent) {
                outcome.isOk = true;
                outcome.data = fileContent;
            }
        }

        return outcome;
    }
}
export default ConfigurationContextSelectorModuleManager.getInstance();
