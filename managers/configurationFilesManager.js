class ConfigurationFilesManager {
    static #instance = null;

    #JSON_CONFIGURATION_KEY = "Configuration";

    static getInstance() {
        if (!ConfigurationFilesManager.#instance) {
            ConfigurationFilesManager.#instance = new ConfigurationFilesManager();
        }
        return ConfigurationFilesManager.#instance;
    }

    extractNestedObjectInHierarchy(jsonObject, hierarchyArray) {
        let outcome = {};
        if (hierarchyArray && hierarchyArray.length > 0) {
            const configurationObject = this.#getObjectFromFirstNestedKeyAfterConfigurationKey(jsonObject);
            if (configurationObject) {
                outcome = this.#createOrTraverseNestedKeys(configurationObject, hierarchyArray);
            }
        } else {
            outcome = this.#getObjectFromFirstNestedKeyAfterConfigurationKey(jsonObject);
        }
        return outcome;
    }

    addNewObjectIntoTheTargetObjectIfNotExists(newObjectToBeAdded, targetObject) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };
        if (newObjectToBeAdded && targetObject) {
            if (this.#doesObjectExistsIntoTheFirstLevelOfTheTargetObject(newObjectToBeAdded, targetObject)) {
                outcome.errorType = "ALREADY_EXISTS";
            } else {
                // Append the newObject to the targetObject without deleting existing content
                Object.assign(targetObject, newObjectToBeAdded);
                outcome.isOk = true;
            }
        }
        return outcome;
    }

    updateObjectIntoTheTargetObjectIfExists(objectToUpdate, targetObject) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };
        if (targetObject && objectToUpdate) {
            if (!this.#doesObjectExistsIntoTheFirstLevelOfTheTargetObject(objectToUpdate, targetObject)) {
                outcome.errorType = "NOT_FOUND";
            } else {
                this.#updateObjectIntoTheTargetObject(objectToUpdate, targetObject);

                outcome.isOk = true;
            }
        }
        return outcome;
    }

    deleteObjectFromTheTargetObjectIfExists(objectKeyToDelete, targetObject) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };
        if (targetObject && objectKeyToDelete) {
            if (!this.#doesObjectExistsIntoTheFirstLevelOfTheTargetObject(objectToUpdate, targetObject)) {
                outcome.errorType = "NOT_FOUND";
            } else {
                this.#deleteObjectFromTheTargetObject(objectToUpdate, targetObject);

                outcome.isOk = true;
            }
        }
        return outcome;
    }

    #updateObjectIntoTheTargetObject(objectToUpdate, targetObject) {
        const targetObjectEntries = Object.entries(targetObject);
        const objectKey = Object.keys(objectToUpdate)[0];
        objectValues = objectToUpdate[objectKey];
        for (const [key, value] of targetObjectEntries) {
            if (key === objectKey) {
                targetObject[objectKey] = { ...value, ...objectValues };
                break;
            }
        }
        return targetObject;
    }

    #deleteObjectFromTheTargetObject(objectToUpdate, targetObject) {
        
        delete targetObject[objectToUpdate];
        return targetObject;
    }

    #doesObjectExistsIntoTheFirstLevelOfTheTargetObject(objectToCheck, targetObject) {
        let outcome = false;
        if (objectToCheck && targetObject) {
            const firstKey = Object.keys(objectToCheck)[0];
            outcome = targetObject[firstKey] ? true : false;
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

const instance = ConfigurationFilesManager.getInstance();
export { ConfigurationFilesManager, instance as default };
