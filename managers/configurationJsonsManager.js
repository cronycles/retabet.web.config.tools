import fs from "fs";
import JSON5 from "json5";

class ConfigurationJsonsManager {
    constructor() {}

    readJson(filePath) {
        try {
            return JSON5.parse(fs.readFileSync(filePath, "utf8"));
        } catch (error) {
            console.error(`Error reading JSON file at ${filePath}:`, error);
            throw error;
        }
    }

    writeJson = (filePath, data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
}
export default new ConfigurationJsonsManager();
