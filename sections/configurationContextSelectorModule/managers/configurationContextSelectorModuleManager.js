import path from "path";
import { fileURLToPath } from "url";

import ConfigurationContextManager from "../../../managers/configurationContextManager.js";
import ConfigurationFilesManager from "../../../managers/configurationFilesManager.js";
import ConfigurationJsonsManager from "../../../managers/configurationJsonsManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ConfigurationContextSelectorModuleManager {
    static #instance = null;
    #jsonManager = ConfigurationJsonsManager;
    #configFilesManager = ConfigurationFilesManager;
    #configContextManager = ConfigurationContextManager;

    #contextConfigPropertiesFilePath = path.join(__dirname, "../../../data", "contextConfiguration.schema.json");

    static getInstance() {
        if (!ConfigurationContextSelectorModuleManager.#instance) {
            ConfigurationContextSelectorModuleManager.#instance = new ConfigurationContextSelectorModuleManager();
        }
        return ConfigurationContextSelectorModuleManager.#instance;
    }

    setSelectedContext(context) {
        return this.#configContextManager.setCurrentContext(context);
    }

    getSelectedContext() {
        return this.#configContextManager.getCurrentContext();
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
            const fileContent = this.#configFilesManager.getConfigurationFileByName(fileName);
            if(fileContent) {
                outcome.isOk = true;
                outcome.data = fileContent;
            }
        }

        return outcome;
    }

    saveConfigFileByName(updatedContent ,fileName) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
            data: null,
        };

        if (updatedContent && fileName) {
            const fileContent = this.#configFilesManager.saveConfigurationFileByName(updatedContent, fileName);
            if(fileContent) {
                outcome.isOk = true;
                outcome.data = fileContent;
            }
        }

        return outcome;
    }
}
export default ConfigurationContextSelectorModuleManager.getInstance();
