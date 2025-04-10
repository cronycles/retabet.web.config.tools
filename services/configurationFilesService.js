import { ConfigurationFilesManager } from "../helpers/configurationFilesManager.js";
import { ConfigurationFilesCrudHelper } from "../helpers/configurationFilesCrudHelper.js";
import { ConfigurationFilesContextHelper } from "../helpers/configurationFilesContextHelper.js";
import { ConfigurationFilesContextManagerExtension } from "../extensions/configurationFilesContextManagerExtension.js";

/**
 * @class ConfigurationFilesService
 * @description Clase Que todos los managers de configuración llaman para hacer sus funciones principales con los ficheros de configuración
 */
class ConfigurationFilesService {
    static #instance = null;

    #filesManager = ConfigurationFilesManager;
    #filesCrudHelper = ConfigurationFilesCrudHelper;
    #filesContextHelper = ConfigurationFilesContextHelper;
    #extension = ConfigurationFilesContextManagerExtension;

    static getInstance() {
        if (!ConfigurationFilesService.#instance) {
            ConfigurationFilesService.#instance = new ConfigurationFilesService();
        }
        return ConfigurationFilesService.#instance;
    }

    loadAllContextsByFileName(fileName) {
        const jsonFile = this.#filesCrudHelper.getConfigurationFileByName(fileName);
        return this.#filesContextHelper.getKeysAndValuesContextJsonByFileContent(jsonFile);
    }

    deleteEntireContextInFile(contextValue, fileName) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };
        const jsonFile = this.#filesCrudHelper.getConfigurationFileByName(fileName);

        const isDeleted = this.#filesContextHelper.deleteContextInFileContent(contextValue, jsonFile);
        if (isDeleted) {
            outcome = this.#filesCrudHelper.saveConfigurationFileByName(jsonFile, fileName);
        } else {
            outcome.errorType = addResponse.errorType;
        }
        return outcome;
    }

    saveNewContextInFile(contextValue, fileName) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };
        const jsonFile = this.#filesCrudHelper.getConfigurationFileByName(fileName);

        const isAdded = this.#filesContextHelper.addNewContextInFileContent(contextValue, jsonFile);
        if (isAdded) {
            outcome = this.#filesCrudHelper.saveConfigurationFileByName(jsonFile, fileName);
        } else {
            outcome.errorType = addResponse.errorType;
        }
        return outcome;
    }

    /**
     * ésta función se utiliza principalmente para editar cosas de un solo fichero de configuración
     * ésta función te devuelve el objeto de configuración que se corresponde extrictamente al contexto actual (contexto que esta en memoria).
     * corresponder extrictamente significa que solo te devuelve el objeto si está fisicamente definido dentro del contexto actual.
     * Por ejemplo en esta función, si seleccionas un contexto que no es default, no te devuelve los objetos que solo estan definidos en el default context.
     * @param {string} fileName - nombre del fichero de configuracion
     * @param {string[]} [hierarchyArray] - Especifica la ruta jerárquica para recuperar el objeto deseado.
     * Si no se pasa, se asume que el objeto está en la tercera posición: "Configuracion" → "Nombre_CONF" → Aquí,
     * o si se pasa, devuelve el objeto en la jerarquía especificada o una jerarquía vacía si no se encuentra.
     * @returns {Object|null}
     */
    getConfigurationObjectFromFileExtrictlyCorrespondingToTheCurrentContext(fileName, hierarchyArray) {
        let outcome = {};

        var jsonFile = this.#filesCrudHelper.getConfigurationFileByName(fileName);
        let foundObjectInContext = this.#extension.extractObjectFromFileExtrictlyCorrespondingToTheCurrentContext(jsonFile);
        outcome = this.#filesManager.extractNestedObjectInHierarchy(foundObjectInContext, hierarchyArray);

        return outcome;
    }

    /**
     * ésta función te da el objeto de configuración que pertenece al contexto actual (contexto que esta en memoria).
     * Pertenecer significa que aplicaría en el contexto actual, no solamente y estrictamente que está presente en esa configuracion del contexto.
     * Por ejemplo en esta función te devuelve los objetos que se encuentarn en la configuración por defecto.
     * @param {string} fileName - nombre del fichero de configuracion
     * @param {string[]} [hierarchyArray] - Especifica la ruta jerárquica para recuperar el objeto deseado.
     * Si no se pasa, se asume que el objeto está en la tercera posición: "Configuracion" → "Nombre_CONF" → Aquí,
     * o si se pasa, devuelve el objeto en la jerarquía especificada o una jerarquía vacía si no se encuentra.
     * @returns {Object|null}
     */
    getConfigurationObjectFromFileBelongingToTheCurrentContext(fileName, hierarchyArray) {
        let outcome = {};
        var jsonFile = this.#filesCrudHelper.getConfigurationFileByName(fileName);
        let foundObjectInContext = this.#extension.extractObjectFromFileBelongingToTheCurrentContext(jsonFile);
        outcome = this.#filesManager.extractNestedObjectInHierarchy(foundObjectInContext, hierarchyArray);

        return outcome;
    }

    /**
     * Guarda el objeto exactamente en el contexto actual.
     * Si ya existe uno, no lo sustituye.
     * @param {string} newObjectKey - El key del nuevo objeto a guardar.
     * @param {Object|null} newObjectAttributes - los atributos del nuevo objeto a guardar.
     * @param {string[]} [hierarchyArray] - Especifica la ruta jerárquica donde guardar el objeto.
     * Si no se pasa, o la jerarquía pasada no se encuentra, se asume que el objeto se guardará en la tercera posición:
     * "Configuracion" → "Nombre_CONF" → Aquí.
     * Si se pasa y se encuentra, el objeto se guardará en la jerarquía especificada.
     * @param {string} fileName - Nombre del fichero de configuración.
     */
    saveConfigurationObjectInFileExtrictlyInTheCurrentContext(newObjectKey, newObjectAttributes, hierarchyArray, fileName) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };

        var jsonFile = this.#filesCrudHelper.getConfigurationFileByName(fileName);
        let foundObjectInContext = this.#extension.extractObjectFromFileBelongingToTheCurrentContext(fileName);
        let targetObject = this.#filesManager.extractNestedObjectInHierarchy(foundObjectInContext, hierarchyArray);

        const addResponse = this.#filesManager.addNewObjectIntoTheTargetObjectIfNotExists(newObjectKey, newObjectAttributes, targetObject);
        if (addResponse?.isOk) {
            outcome = this.#filesCrudHelper.saveConfigurationFileByName(jsonFile, fileName);
        } else {
            outcome.errorType = addResponse.errorType;
        }
        return outcome;
    }

    /**
     * Actualiza el objeto exactamente en el contexto actual.
     * @param {string} objectToUpdateKey - El key del objeto a modificar.
     * @param {Object|null} newObjectAttributes - los atributos del objeto a modificar.
     * @param {string} fileName - Nombre del fichero de configuración.
     * @param {string[]} [hierarchyArray] - Especifica la ruta jerárquica para actualizar el objeto deseado.
     * Si no se pasa, o la jerarquía pasada no se encuentra, se asume que el objeto se actualizará en la tercera posición:
     * "Configuracion" → "Nombre_CONF" → Aquí.
     * Si se pasa y se encuentra, el objeto se actualizará en la jerarquía especificada.
     */
    updateConfigurationObjectInFileExtrictlyInTheCurrentContext(objectToUpdateKey, newObjectAttributes, fileName, hierarchyArray, position = null) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };

        var jsonFile = this.#filesCrudHelper.getConfigurationFileByName(fileName);
        let foundObjectInContext = this.#extension.extractObjectFromFileBelongingToTheCurrentContext(fileName);
        let targetObject = this.#filesManager.extractNestedObjectInHierarchy(foundObjectInContext, hierarchyArray);
        const updateResponse = this.#filesManager.updateObjectIntoTheTargetObjectIfExists(objectToUpdateKey, newObjectAttributes, targetObject, position = null);
        if (updateResponse?.isOk) {
            outcome = this.#filesManager.saveConfigurationFileByName(jsonFile, fileName);
        } else {
            outcome.errorType = updateResponse.errorType;
        }
        return outcome;
    }

    /**
     * Elimina el objeto exactamente en el contexto actual.
     * @param {string} objectKeyToDelete - La key del objeto a eliminar.
     * @param {string} fileName - Nombre del fichero de configuración.
     * @param {string[]} [hierarchyArray] - Especifica la ruta jerárquica para encontrar el objeto deseado.
     * @param {number|null} [position=null] - Especifica la posición del objeto a eliminar si hay múltiples objetos con la misma key.
     * Si no se pasa, se eliminará el primer objeto encontrado con la key especificada.
     */
    deleteConfigurationObjectInFileExtrictlyInTheCurrentContext(objectKeyToDelete, fileName, hierarchyArray, position = null) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };

        var jsonFile = this.#filesCrudHelper.getConfigurationFileByName(fileName);
        let foundObjectInContext = this.#extension.extractObjectFromFileBelongingToTheCurrentContext(fileName);
        let targetObject = this.#filesManager.extractNestedObjectInHierarchy(foundObjectInContext, hierarchyArray);
        const updateResponse = this.#filesManager.deleteObjectFromTheTargetObjectIfExists(objectKeyToDelete, targetObject, position = null);
        if (updateResponse?.isOk) {
            outcome = this.#filesManager.saveConfigurationFileByName(jsonFile, fileName);
        } else {
            outcome.errorType = updateResponse.errorType;
        }
        return outcome;
    }
}

const instance = ConfigurationFilesService.getInstance();
export { ConfigurationFilesService, instance as default };
