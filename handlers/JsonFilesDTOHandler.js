import fs from "fs";
import JSON5 from "json5";

class JsonFilesDTOHandler {
    static #instance = null;

    static getInstance() {
        if (!JsonFilesDTOHandler.#instance) {
            JsonFilesDTOHandler.#instance = new JsonFilesDTOHandler();
        }
        return JsonFilesDTOHandler.#instance;
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
        fs.writeFileSync(filePath, JSON5.stringify(data, null, 4));
    }
}

const instance = JsonFilesDTOHandler.getInstance();
export { JsonFilesDTOHandler, instance as default };
