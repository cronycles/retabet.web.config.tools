import path from "path";
import { fileURLToPath } from "url";

import { ConfigurationJsonsHelper } from "./configurationJsonsHelper.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ConfigurationFilesCrudHelper {
    static #instance = null;

    #JSONS_CONFIGURATION_PATH = "../data";
    #jsonsHelper = ConfigurationJsonsHelper;

    static getInstance() {
        if (!ConfigurationFilesCrudHelper.#instance) {
            ConfigurationFilesCrudHelper.#instance = new ConfigurationFilesCrudHelper();
        }
        return ConfigurationFilesCrudHelper.#instance;
    }

    getConfigurationFileByName(fileName) {
        let outcome = {};
        const filePath = this.#getConfigurationFilePathByName(fileName);
        var jsonFile = this.#jsonsHelper.readJson(filePath);

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

            this.#jsonsHelper.writeJson(filePath, jsoObject);

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

const instance = ConfigurationFilesCrudHelper.getInstance();
export { ConfigurationFilesCrudHelper, instance as default };
