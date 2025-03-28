import ConfigurationContextManager from "./configurationContextManager.js";
import ConfigurationJsonsManager from "./configurationJsonsManager.js";

class ConfigurationFilesManager {
    static #instance = null;

    #JSON_CONFIGURATION_KEY = "Configuration";
    #contextManager = ConfigurationContextManager;
    #jsonManager = ConfigurationJsonsManager;

    static getInstance() {
        if (!ConfigurationFilesManager.#instance) {
            ConfigurationFilesManager.#instance = new ConfigurationFilesManager();
        }
        return ConfigurationFilesManager.#instance;
    }

    /**
     * ésta función te da el objeto de configuración entero con el contexto actual (contexto que esta en memoria).
     * si no le pasas el segundo parámetro, supondrá que el objeto a devolver está en el tercer puesto: "Configuracion"--> "Nombre_CONF" --> AQUI!
     * si le pasas el segundo parámetro el te devolverá el objeto que está debajo de esa jerarquía y, si no hay nada, te devolverá la jerarquía de objetos vacíos
     * @param {*} filePath
     * @returns
     */
    getConfigurationObjectFromFileInTheCurrentContext(filePath, hierarchyArray) {
        var jsonFile = this.#jsonManager.readJson(filePath);
        let outcome = {};

        let foundObjectInContext = null;
        for (const fileContextPartObj of jsonFile) {
            if (this.#isFileContextPartCorrespondingToTheCurrentContext(fileContextPartObj)) {
                foundObjectInContext = fileContextPartObj;
                break;
            }
        }
        if (foundObjectInContext == null) {
            foundObjectInContext = jsonFile;
        }

        // Determine the outcome based on hierarchyArray
        if (!hierarchyArray || hierarchyArray.length == 0) {
            outcome = this.#getObjectFromFirstNestedKeyAfterConfigurationKey(foundObjectInContext);
        } else {
            const configurationObject = this.#getObjectFromFirstNestedKeyAfterConfigurationKey(foundObjectInContext);
            if (configurationObject) {
                outcome = this.#createOrTraverseNestedKeys(configurationObject, hierarchyArray);
            }
        }

        return outcome;
    }

    /**
     * Saves the given configuration object into the correct context of the JSON file.
     * Replaces the existing data at the specified hierarchy.
     * @param {*} configurationObjectToSave - The object to save.
     * @param {*} filePath - The path to the JSON file.
     * @param {*} hierarchyArray - The hierarchy to locate the object in the JSON structure.
     */
    saveConfigurationObjectInFileInTheCurrentContext(configurationObjectToSave, filePath, hierarchyArray) {
        const jsonFile = this.#jsonManager.readJson(filePath);
        let foundObjectInContext = null;

        // Find the context that matches the current configuration context
        for (const fileContextPartObj of jsonFile) {
            if (this.#isFileContextPartCorrespondingToTheCurrentContext(fileContextPartObj)) {
                foundObjectInContext = fileContextPartObj;
                break;
            }
        }

        // If no matching context is found, use the entire file as the context
        if (foundObjectInContext == null) {
            foundObjectInContext = jsonFile[0];
        }

        // Traverse or create the nested keys based on the hierarchyArray
        const configurationObject = this.#getObjectFromFirstNestedKeyAfterConfigurationKey(foundObjectInContext);
        if (configurationObject) {
            const keys = hierarchyArray || [];
            const targetObject = this.#createOrTraverseNestedKeys(configurationObject, keys);
            Object.assign(targetObject, configurationObjectToSave); // Replace the target object with the new data
        }

        // Write the updated JSON back to the file
        this.#jsonManager.writeJson(filePath, jsonFile);
    }

    #isFileContextPartCorrespondingToTheCurrentContext(fileContextPartObj) {
        let outcome = false;
        const currentContext = this.#getCurrentConfigurationContext();
        const contextString = this.#getKeysAndValueContextStringByEntireContext(fileContextPartObj);
        if (contextString === currentContext) {
            outcome = true;
        }

        return outcome;
    }

    #getKeysAndValueContextStringByEntireContext(jsonContext) {
        return Object.entries(jsonContext)
            .filter(([key]) => key !== this.#JSON_CONFIGURATION_KEY)
            .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
            .join(", ");
    }

    #getCurrentConfigurationContext() {
        let outcome = "";
        const currentContext = this.#contextManager.getCurrentContext();
        console.log("currentContext", currentContext);
        if (currentContext != null) {
            outcome = currentContext;
        }
        return outcome;
    }

    #getObjectFromFirstNestedKeyAfterConfigurationKey(jsonObject) {
        let outcome = {};

        const configurationObject = jsonObject[this.#JSON_CONFIGURATION_KEY];
        if (configurationObject) {
            const firstNestedKey = Object.keys(configurationObject)[0];
            if (firstNestedKey) {
                outcome = configurationObject[firstNestedKey];
            }
        }

        return outcome;
    }

    #createOrTraverseNestedKeys(obj, keys) {
        return keys.reduce((current, key) => {
            if (!current[key]) {
                current[key] = {};
            }
            return current[key];
        }, obj);
    }
}

export default ConfigurationFilesManager.getInstance();
