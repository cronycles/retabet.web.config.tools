import path from "path";
import { fileURLToPath } from "url";

import { JsonFilesDTOHandler } from "../JsonFilesDTOHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ConfigurationFilesCrudHandler {
    static #instance = null;

    #JSONS_CONFIGURATION_PATH = "../data";
    #jsonsHandler = JsonFilesDTOHandler;

    static getInstance() {
        if (!ConfigurationFilesCrudHandler.#instance) {
            ConfigurationFilesCrudHandler.#instance = new ConfigurationFilesCrudHandler();
        }
        return ConfigurationFilesCrudHandler.#instance;
    }

    getConfigurationFileByName(fileName) {
        let outcome = {};
        const filePath = this.#getConfigurationFilePathByName(fileName);
        var jsonFile = this.#jsonsHandler.readJson(filePath);

        if (jsonFile) {
            outcome = jsonFile;
        }

        return outcome;
    }

    saveConfigurationFileByName(jsoObject, fileName) {
        try {
            let outcome = {
                isOk: false,
                errorType: "UNKNOWN",
            };
            const filePath = this.#getConfigurationFilePathByName(fileName);

            this.#jsonsHandler.writeJson(filePath, jsoObject);

            outcome.isOk = true;
            return outcome;
        } catch (err) {
            let outcome = {
                isOk: false,
                errorType: "INTERNAL_SERVER",
            };
            console.error(err);
            return outcome;
        }
    }

    #getConfigurationFilePathByName(fileName) {
        const filePathPart = `${this.#JSONS_CONFIGURATION_PATH}/${fileName}`;
        return path.join(__dirname, filePathPart);
    }
}

const instance = ConfigurationFilesCrudHandler.getInstance();
export { ConfigurationFilesCrudHandler, instance as default };
