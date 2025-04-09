import ConfigurationFilesManager from "./configurationFilesManager.js";
import ConfigurationFilesContextManagerExtension from "../extensions/configurationFilesContextManagerExtension.js";

class ConfigurationFilesManagerInTheCurrentContext {
    static #instance = null;

    #filesManager = ConfigurationFilesManager;
    #extension = ConfigurationFilesContextManagerExtension;

    static getInstance() {
        if (!ConfigurationFilesManagerInTheCurrentContext.#instance) {
            ConfigurationFilesManagerInTheCurrentContext.#instance = new ConfigurationFilesManagerInTheCurrentContext();
        }
        return ConfigurationFilesManagerInTheCurrentContext.#instance;
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
        let foundObjectInContext = this.#extension.getConfigurationObjectFromFileExtrictlyCorrespondingToTheCurrentContext(fileName);
        outcome = this.#filesManager.getObjectPartBasedOnHierarchyArray(foundObjectInContext, hierarchyArray);

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
        const currentContextObj = this.#extension.getConfigurationCurrentContext();

        let foundObjectInContext = this.#getConfigurationObjectFromFileBelongingToThePassedContext(fileName, currentContextObj);

        outcome = this.#filesManager.getObjectPartBasedOnHierarchyArray(foundObjectInContext, hierarchyArray);

        return outcome;
    }

    /**
     * Guarda el objeto exactamente en el contexto actual.
     * Si ya existe uno, no lo sustituye.
     * @param {Object|null} newObject - El nuevo objeto a guardar.
     * @param {string} fileName - Nombre del fichero de configuración.
     * @param {string[]} [hierarchyArray] - Especifica la ruta jerárquica para recuperar el objeto deseado.
     * Si no se pasa, se asume que el objeto está en la tercera posición: "Configuracion" → "Nombre_CONF" → Aquí,
     * o si se pasa, devuelve el objeto en la jerarquía especificada o una jerarquía vacía si no se encuentra.
     */
    saveConfigurationObjectInFileExtrictlyInTheCurrentContext(newObject, fileName, hierarchyArray) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };
        const currentContextObj = this.#extension.getConfigurationCurrentContext();

        let foundObjectInContext = this.#getConfigurationObjectFromFileExtrictlyCorrespondingToThePassedContext(fileName, currentContextObj);

        const addResponse = this.#filesManager.addNewObjectIntoThePositionBasedOnHierarchyArray(newObject, foundObjectInContext, hierarchyArray);
        if (addResponse?.isOk) {
            outcome = this.#filesManager.saveConfigurationFileByName(jsonFile, fileName);
        } else {
            outcome.errorType = addResponse.errorType;
        }
        return outcome;
    }

    /**
     * Guarda el objeto exactamente en el contexto actual.
     * Si ya existe uno, no lo sustituye.
     * @param {Object|null} objectToUpdate - El nuevo objeto a guardar.
     * @param {string} oldKeyName - Es posible que el objeto tenga un nuevo nombre de clave.
     * Si este valor es diferente de la clave del objectUpdated, significa que el nombre ha cambiado.
     * @param {string} fileName - Nombre del fichero de configuración.
     * @param {string[]} [hierarchyArray] - Especifica la ruta jerárquica para recuperar el objeto deseado.
     * Si no se pasa, se asume que el objeto está en la tercera posición: "Configuracion" → "Nombre_CONF" → Aquí,
     * o si se pasa, devuelve el objeto en la jerarquía especificada o una jerarquía vacía si no se encuentra.
     */
    updateConfigurationObjectInFileExtrictlyInTheCurrentContext(objectToUpdate, oldKeyName, fileName, hierarchyArray) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };

        const currentContextObj = this.#extension.getConfigurationCurrentContext();

        let foundObjectInContext = this.#getConfigurationObjectFromFileExtrictlyCorrespondingToThePassedContext(fileName, currentContextObj);

        const updateResponse = this.#filesManager.updateObjectIntoThePositionBasedOnHierarchyArray(
            objectToUpdate,
            oldKeyName,
            foundObjectInContext,
            hierarchyArray
        );
        if (updateResponse?.isOk) {
            outcome = this.#filesManager.saveConfigurationFileByName(jsonFile, fileName);
        } else {
            outcome.errorType = updateResponse.errorType;
        }
        return outcome;
    }

    #getConfigurationObjectFromFileExtrictlyCorrespondingToThePassedContext(fileName, passedContext) {
        let outcome = null;
        var jsonFile = this.#filesManager.getConfigurationFileByName(fileName);

        for (const fileContextPartObj of jsonFile) {
            if (this.#extension.isFileContextPartCorrespondingExtrictlyToThePassedContext(fileContextPartObj, passedContext)) {
                outcome = fileContextPartObj;
                break;
            }
        }

        return outcome;
    }

    #getConfigurationObjectFromFileBelongingToThePassedContext(fileName, passedContext) {
        let outcome = {};
        if (fileName) {
            var jsonFile = this.#filesManager.getConfigurationFileByName(fileName);
            for (const fileContextPartObj of jsonFile) {
                if (
                    this.#extension.isFileContextPartCorrespondingToTheDefaultContext(fileContextPartObj) ||
                    this.#extension.isFileContextPartBelongingToThePassedContext(fileContextPartObj, passedContext)
                ) {
                    outcome = { ...foundObjectInContext, ...fileContextPartObj };
                    break;
                }
            }
        }

        return outcome;
    }
}

const instance = ConfigurationFilesManagerInTheCurrentContext.getInstance();
export { ConfigurationFilesManagerInTheCurrentContext, instance as default };
