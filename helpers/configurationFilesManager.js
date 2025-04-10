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

    addNewObjectIntoTheTargetObjectIfNotExists(newObjectKey, newObjectAttributes, targetObject) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };
        if (newObjectKey && newObjectAttributes && targetObject) {
            if (this.#doesObjectExistsIntoTheFirstLevelOfTheTargetObject(newObjectKey, targetObject)) {
                outcome.errorType = "ALREADY_EXISTS";
            } else {
                Object.assign(targetObject, { [newObjectKey]: newObjectAttributes });
                outcome.isOk = true;
            }
        }
        return outcome;
    }

    updateObjectIntoTheTargetObjectIfExists(objectToUpdateKey, newObjectAttributes, targetObject, position = null) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };
        if (objectToUpdateKey && newObjectAttributes && targetObject) {
            if (!this.#doesObjectExistsIntoTheFirstLevelOfTheTargetObject(objectToUpdateKey, targetObject, position)) {
                outcome.errorType = "NOT_FOUND";
            } else {
                this.#updateObjectIntoTheTargetObject(objectToUpdateKey, newObjectAttributes, targetObject, position);

                outcome.isOk = true;
            }
        }
        return outcome;
    }

    deleteObjectFromTheTargetObjectIfExists(objectKeyToDelete, targetObject, position = null) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };
        if (targetObject && objectKeyToDelete) {
            if (!this.#doesObjectExistsIntoTheFirstLevelOfTheTargetObject(objectKeyToDelete, targetObject, position)) {
                outcome.errorType = "NOT_FOUND";
            } else {
                this.#deleteObjectFromTheTargetObject(objectKeyToDelete, targetObject, position);

                outcome.isOk = true;
            }
        }
        return outcome;
    }

    #updateObjectIntoTheTargetObject(objectToUpdateKey, newObjectAttributes, targetObject, position = null) {
        if (position) {
            if (targetObject[position]?.[objectToUpdateKey]) {
                targetObject[position][objectToUpdateKey] = newObjectAttributes;
            }
        } else {
            targetObject[objectToUpdateKey] = newObjectAttributes;
        }

        return targetObject;
    }

    #deleteObjectFromTheTargetObject(objectKeyToDelete, targetObject, position = null) {
        if (position) {
            targetObject.splice(position, 1);
        } else {
            delete targetObject[objectKeyToDelete];
        }
        return targetObject;
    }

    #doesObjectExistsIntoTheFirstLevelOfTheTargetObject(objectKeyToCheck, targetObject, position = null) {
        let outcome = false;
        if (objectKeyToCheck && targetObject) {
            if (position) {
                outcome = targetObject[position]?.[objectKeyToCheck] ? true : false;
            } else {
                outcome = targetObject[objectKeyToCheck] ? true : false;
            }
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
