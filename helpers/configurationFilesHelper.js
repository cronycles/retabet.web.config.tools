export default class ConfigurationFilesHelper {
    #JSON_CONFIGURATION_KEY = "Configuration";

    constructor() {
        if (ConfigurationFilesHelper.instance) {
            return ConfigurationFilesHelper.instance;
        }

        ConfigurationFilesHelper.instance = this;
    }

    extractNestedObjectInHierarchy(jsonObject, hierarchyArray) {
        let outcome = {};
        if (hierarchyArray && hierarchyArray.length > 0) {
            let configurationObject = this.#getObjectFromFirstNestedKeyAfterConfigurationKey(jsonObject);
            if (configurationObject) {
                configurationObject = this.#createNestedKeysOfTheObjectIfNotExists(configurationObject, hierarchyArray);
                outcome = this.#getObjectToTheLastKeyOfHierarchy(configurationObject, hierarchyArray);
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

    updateObjectsOrderIntoTheTargetObjectIfExists(order, targetObject) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };
        if (targetObject) {
            const reorderedSections = order.map(objectKey => {
                return targetObject.find(objectToSort => {
                    return typeof objectToSort === "string" ? objectToSort === objectKey : Object.keys(objectToSort)[0] === objectKey;
                });
            });

            targetObject = reorderedSections;

            outcome.isOk = true;
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
        return jsonObject[this.#JSON_CONFIGURATION_KEY];
       
    }

    #createNestedKeysOfTheObjectIfNotExists(obj, keys) {
        keys.reduce((current, key) => {
            if (!current[key]) {
                current[key] = {}; // Crear la clave si no existe
            }
            return current[key]; // Avanzar al siguiente nivel
        }, obj);

        return obj; // Devuelve el objeto modificado
    }

    #getObjectToTheLastKeyOfHierarchy(obj, keys) {
        let outcome = {};
        outcome = keys.reduce((current, key) => {
            if (!current[key]) {
                current[key] = {}; // Crear la clave si no existe
            }
            return current[key]; // Avanzar al siguiente nivel
        }, obj);

        return outcome;
    }
}
