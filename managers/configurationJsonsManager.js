import fs from "fs";
import JSON5 from "json5";

class ConfigurationJsonsManager {
    static #instance = null;

    static getInstance() {
        if (!ConfigurationJsonsManager.#instance) {
            ConfigurationJsonsManager.#instance = new ConfigurationJsonsManager();
        }
        return ConfigurationJsonsManager.#instance;
    }

    readJson(filePath) {
        try {
            return JSON5.parse(fs.readFileSync(filePath, "utf8"));
        } catch (error) {
            console.error(`Error reading JSON file at ${filePath}:`, error);
            throw error;
        }
    }

    writeJson(filePath, data) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
    }
}

export default ConfigurationJsonsManager.getInstance();
