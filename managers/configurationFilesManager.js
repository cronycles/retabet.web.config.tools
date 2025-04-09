import path from "path";
import { fileURLToPath } from "url";

import ConfigurationCurrentContextManager from "./configurationCurrentContextManager.js";
import ConfigurationJsonsManager from "./configurationJsonsManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ConfigurationFilesManager {
    static #instance = null;

    #JSONS_CONFIGURATION_PATH = "../data";
    #JSON_CONFIGURATION_KEY = "Configuration";
    #currentContextManager = ConfigurationCurrentContextManager;
    #jsonManager = ConfigurationJsonsManager;

    static getInstance() {
        if (!ConfigurationFilesManager.#instance) {
            ConfigurationFilesManager.#instance = new ConfigurationFilesManager();
        }
        return ConfigurationFilesManager.#instance;
    }

    getConfigurationFileByName(fileName) {
        let outcome = {};
        const filePath = this.#getConfigurationFilePathByName(fileName);
        var jsonFile = this.#jsonManager.readJson(filePath);

        if (jsonFile) {
            outcome = jsonFile;
        }

        return outcome;
    }

    saveConfigurationFileByName(jsoObject, fileName) {
        let outcome = false;
        const filePath = this.#getConfigurationFilePathByName(fileName);

        this.#jsonManager.writeJson(filePath, jsoObject);

        outcome = true;
        return outcome;
    }

    /**
     * ésta función te da el objeto de configuración entero con el contexto actual (contexto que esta en memoria).
     * si no le pasas el segundo parámetro, supondrá que el objeto a devolver está en el tercer puesto: "Configuracion"--> "Nombre_CONF" --> AQUI!
     * si le pasas el segundo parámetro el te devolverá el objeto que está debajo de esa jerarquía y, si no hay nada, te devolverá la jerarquía de objetos vacíos
     * @param {string} fileName
     * @returns {Object|null}
     */
    getConfigurationObjectFromFileInTheCurrentContext(fileName, hierarchyArray) {
        var jsonFile = this.getConfigurationFileByName(fileName);
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

    getObjectPartBasedOnHierarchyArray(objectFilePart, hierarchyArray) {
        let outcome = {};
        if (hierarchyArray && hierarchyArray.length > 0) {
            const configurationObject = this.#getObjectFromFirstNestedKeyAfterConfigurationKey(objectFilePart);
            if (configurationObject) {
                outcome = this.#createOrTraverseNestedKeys(configurationObject, hierarchyArray);
            }
        } else {
            outcome = this.#getObjectFromFirstNestedKeyAfterConfigurationKey(objectFilePart);
        }
        return outcome;
    }
    
    addNewObjectIntoThePositionBasedOnHierarchyArray(newObject, objectToTraverse, hierarchyArray) {
        let outcome = null;
        if (objectToTraverse != null) {
            outcome = { ...objectToTraverse };
            const configurationObject = this.#getObjectFromFirstNestedKeyAfterConfigurationKey(outcome);
            if (configurationObject) {
                const keys = hierarchyArray || [];
                const targetObject = this.#createOrTraverseNestedKeys(configurationObject, keys);

                // Append the newObject to the targetObject without deleting existing content
                Object.assign(targetObject, newObject);
            }
        }
        return outcome;
    }

    traverseOrCreateNestedKeysBasedOnHierarchyArray(objectFilePart, hierarchyArray) {
        let outcome = null;
        if (objectFilePart != null) {
            outcome = { ...objectFilePart };
            const configurationObject = this.#getObjectFromFirstNestedKeyAfterConfigurationKey(outcome);
            if (configurationObject) {
                const keys = hierarchyArray || [];
                const targetObject = this.#createOrTraverseNestedKeys(configurationObject, keys);

                Object.keys(targetObject).forEach(key => delete targetObject[key]);
                Object.assign(targetObject, objectFilePart);
            }
        }
        return outcome;
    }

    findJsonObjectByNameAndUpdateIt(allJsonObjects, newName, oldName, attributes) {
        const entries = Object.entries(allJsonObjects);
        const updatedSectionsObj = {};

        for (const [key, value] of entries) {
            if (key === oldName) {
                updatedSectionsObj[newName] = { ...value, ...attributes };
            } else {
                updatedSectionsObj[key] = value;
            }
        }
        return updatedSectionsObj;
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
        const currentContext = this.#currentContextManager.getCurrentContext();
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

    #getConfigurationFilePathByName(fileName) {
        const filePathPart = `${this.#JSONS_CONFIGURATION_PATH}/${fileName}`;
        return path.join(__dirname, filePathPart);
    }
}

export default ConfigurationFilesManager.getInstance();
