import fs from "fs";
import path from "path";
import JSON5 from "json5"; // Import the json5 library
import { fileURLToPath } from "url"; // Importa fileURLToPath para convertir URLs a rutas de archivo
import ConfigurationContextManager from "../managers/configurationContextManager.js";

const contextManager = ConfigurationContextManager;

// Convertir import.meta.url a una ruta de archivo válida
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utility to read JSON files
const readJSON = filePath => {
    try {
        return JSON5.parse(fs.readFileSync(filePath, "utf8")); // Use JSON5 for parsing
    } catch (error) {
        console.error(`Error reading JSON file at ${filePath}:`, error);
        throw error;
    }
};

// Utility to write JSON files
const writeJSON = (filePath, data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 4));

const getConfigFile = (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, "../data", fileName);

    try {
        const fileContent = readJSON(filePath);
        res.json(fileContent);
    } catch (error) {
        console.error(`Error reading file ${fileName}:`, error);
        res.status(500).json({ error: "Failed to read file" });
    }
};

const updateConfigFile = (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, "../data", fileName);

    try {
        const updatedContent = req.body;
        writeJSON(filePath, updatedContent);
        res.status(200).json({ message: "File updated successfully" });
    } catch (error) {
        console.error(`Error updating file ${fileName}:`, error);
        res.status(500).json({ error: "Failed to update file" });
    }
};

const setSelectedContext = (req, res) => {
    const { selectedContext: context } = req.body;
    contextManager.setCurrentContext(context);
    res.status(200).json({ message: "Selected context set successfully" });
};

const getSelectedContext = (req, res) => {
    let outcome = {};
    outcome = contextManager.getCurrentContext();
    res.json({ selectedContext: outcome });
};

export { getConfigFile, updateConfigFile, setSelectedContext, getSelectedContext };
