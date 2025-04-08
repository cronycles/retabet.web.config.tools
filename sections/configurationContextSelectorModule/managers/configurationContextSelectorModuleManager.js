import path from "path";
import { fileURLToPath } from "url";

import ConfigurationCurrentContextManager from "../../../managers/configurationCurrentContextManager.js";
import ConfigurationFilesManager from "../../../managers/configurationFilesManager.js";
import ConfigurationJsonsManager from "../../../managers/configurationJsonsManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ConfigurationContextSelectorModuleManager {
    static #instance = null;
    #jsonManager = ConfigurationJsonsManager;
    #filesManager = ConfigurationFilesManager;
    #currentContextManager = ConfigurationCurrentContextManager;

    #contextConfigPropertiesFilePath = path.join(__dirname, "../../../data", "contextConfiguration.schema.json");

    static getInstance() {
        if (!ConfigurationContextSelectorModuleManager.#instance) {
            ConfigurationContextSelectorModuleManager.#instance = new ConfigurationContextSelectorModuleManager();
        }
        return ConfigurationContextSelectorModuleManager.#instance;
    }

    loadContextsFromFile(fileName) {
        try {
            let outcome = {
                isOk: false,
                errorType: "UNKNOWN",
                data: null,
            };

            let data = [];
            const getConfigFileResponse = this.getConfigFileByName(fileName);
            if (getConfigFileResponse?.isOk && getConfigFileResponse.data) {
                const contexts = getConfigFileResponse.data;
                contexts.forEach(context => {
                    const jsonKeysAndValues = this.#getKeysAndValueContextJsonByEntireContext(context);
                    let stringContext = JSON.stringify(jsonKeysAndValues);
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

    setSelectedContext(context) {
        return this.#currentContextManager.setCurrentContext(context);
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
            console.error(`Error reading file ${fileName}:`, error);
            return {
                isOk: false,
                errorType: "INTERNAL_SERVICE_ERROR",
                data: null,
            };
        }
    }

    getConfigFileByName(fileName) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
            data: null,
        };

        if (fileName) {
            const fileContent = this.#filesManager.getConfigurationFileByName(fileName);
            if (fileContent) {
                outcome.isOk = true;
                outcome.data = fileContent;
            }
        }

        return outcome;
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

    #getKeysAndValueContextStringByEntireContext(jsonFile) {
        return Object.entries(jsonFile)
            .filter(([key]) => key !== "Configuration")
            .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
            .join(", ");
    }

    #getKeysAndValueContextJsonByEntireContext(jsonFile) {
        return Object.fromEntries(
            Object.entries(jsonFile).filter(([key]) => key !== "Configuration")
        );
    }
}
export default ConfigurationContextSelectorModuleManager.getInstance();
