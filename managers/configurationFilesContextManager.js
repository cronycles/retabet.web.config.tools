import ConfigurationFilesManager from "./configurationFilesManager.js";
import ConfigurationFilesContextManagerExtension from "../extensions/configurationFilesContextManagerExtension.js";

class ConfigurationFilesContextManager {
    static #instance = null;

    #filesManager = ConfigurationFilesManager;
    #extension = ConfigurationFilesContextManagerExtension;

    static getInstance() {
        if (!ConfigurationFilesContextManager.#instance) {
            ConfigurationFilesContextManager.#instance = new ConfigurationFilesContextManager();
        }
        return ConfigurationFilesContextManager.#instance;
    }

    loadFileContextsByFileName(fileName) {
        return this.#extension.loadFileContextsByFileName(fileName);
    }

    deleteContextInFileByFileName(contextValue, fileName) {
        return this.#extension.deleteContextInFileByFileName(contextValue, fileName);
    }

    saveNewContextInFileByFileName(newContext, fileName) {
        return this.#extension.deleteContextInFileByFileNamesaveNewContextInFileByFileName(newContext, fileName);
    }

    /**
     * @param {string} fileName - nombre del fichero de configuracion
     * @param {string[]} [hierarchyArray] - indica la gerarquia de que parte del objeto quiero: si no le pasas el segundo parámetro, supondrá que el objeto a devolver está en el tercer puesto: "Configuracion"--> "Nombre_CONF" --> AQUI!
     * si le pasas el segundo parámetro el te devolverá el objeto que está debajo de esa jerarquía y, si no hay nada, te devolverá la jerarquía de objetos vacíos
     * @returns {Object|null}
     */
    getConfigurationObjectFromFileExtrictlyCorrespondingToTheDefaultContext(fileName, hierarchyArray) {
        return this.#getConfigurationObjectFromFileExtrictlyCorrespondingToThePassedContext(fileName, {}, hierarchyArray);
    }

    /**
     * ésta función se utiliza principalmente para editar cosas de un solo fichero de configuración
     * ésta función te da el objeto de configuración que se corresponde extrictamente al contexto actual (contexto que esta en memoria).
     * corresponder extrictamente significa que solo te devuelve el objeto si está fisicamente puesta una linea dentro del contexto actual.
     * Por ejemplo en esta función, si seleccionas un contexto que no es default, no te devuelve los objeto que solo estan en el default context.
     * @param {string} fileName - nombre del fichero de configuracion
     * @param {string[]} [hierarchyArray] - indica la gerarquia de que parte del objeto quiero: si no le pasas el segundo parámetro, supondrá que el objeto a devolver está en el tercer puesto: "Configuracion"--> "Nombre_CONF" --> AQUI!
     * si le pasas el segundo parámetro el te devolverá el objeto que está debajo de esa jerarquía y, si no hay nada, te devolverá la jerarquía de objetos vacíos
     * @returns {Object|null}
     */
    getConfigurationObjectFromFileExtrictlyCorrespondingToTheCurrentContext(fileName, hierarchyArray) {
        const currentContextObj = this.#extension.getConfigurationCurrentContext();
        return this.#getConfigurationObjectFromFileExtrictlyCorrespondingToThePassedContext(fileName, currentContextObj, hierarchyArray);
    }

    /**
     * ésta función te da el objeto de configuración que pertenece al contexto actual (contexto que esta en memoria).
     * Pertenecer significa que aplicaría en el contexto actual, no solamente y estrictamente que está presente en esa configuracion del contexto.
     * Por ejemplo en esta función te devuelve los objetos que se encuentarn en la configuración por defecto.
     * @param {string} fileName - nombre del fichero de configuracion
     * @param {string[]} [hierarchyArray] - indica la gerarquia de que parte del objeto quiero: si no le pasas el segundo parámetro,
     * supondrá que el objeto a devolver está en el tercer puesto: "Configuracion"--> "Nombre_CONF" --> AQUI!
     * si le pasas el segundo parámetro el te devolverá el objeto que está debajo de esa jerarquía y,
     * si no hay nada, te devolverá la jerarquía de objetos vacíos
     * @returns {Object|null}
     */
    getConfigurationObjectFromFileBelongingToTheCurrentContext(fileName, hierarchyArray) {
        let outcome = {};
        const currentContextObj = this.#extension.getConfigurationCurrentContext();
        var jsonFile = this.#extension.getConfigFileByName(fileName);

        let foundObjectInContext = {};
        for (const fileContextPartObj of jsonFile) {
            if (
                this.#isFileContextPartCorrespondingToTheDefaultContext(fileContextPartObj) ||
                this.#isFileContextPartBelongingToThePassedContext(fileContextPartObj, currentContextObj)
            ) {
                foundObjectInContext = { ...foundObjectInContext, ...fileContextPartObj };
                break;
            }
        }

        outcome = this.#filesManager.getObjectPartBasedOnHierarchyArray(foundObjectInContext, hierarchyArray);

        return outcome;
    }

    isConfigurationKeyAlreadyPresentInTheCurrentContextOfTheFile(configurationKey, fileName, hierarchyArray) {
        let outcome = false;

        const fileContextPartObj = this.getConfigurationObjectFromFileExtrictlyCorrespondingToTheCurrentContext(fileName, hierarchyArray);

        if (fileContextPartObj[configurationKey]) {
            outcome = true;
        }
        return outcome;
    }

    /**
     * Guarda el objeto exactamente en el current context.
     * Sustituye los datos existentes en la expecifica gerarquia
     * @param {string} objectKey - El key del nuevo objeto a guardar.
     * @param {Object|null} objectAttributes - El objeto a guardar.
     * @param {string} fileName - nombre del fichero de configuracion
     * @param {string[]} [hierarchyArray] - indica la gerarquia de que parte del objeto quiero: si no le pasas el segundo parámetro,
     * supondrá que el objeto a devolver está en el tercer puesto: "Configuracion"--> "Nombre_CONF" --> AQUI!
     * si le pasas el segundo parámetro el te devolverá el objeto que está debajo de esa jerarquía y,
     * si no hay nada, te devolverá la jerarquía de objetos vacíos
     */
    saveConfigurationObjectInFileExtrictlyInTheCurrentContext(objectKey, objectAttributes, fileName, hierarchyArray) {
        const currentContextObj = this.#extension.getConfigurationCurrentContext();
        var jsonFile = this.#extension.getConfigFileByName(fileName);

        let foundObjectInContext = null;

        // Find the context that matches the current configuration context
        for (const fileContextPartObj of jsonFile) {
            if (this.#isFileContextPartCorrespondingExtrictlyToThePassedContext(fileContextPartObj, currentContextObj)) {
                foundObjectInContext = fileContextPartObj;
                break;
            }
        }
        let newObject = { [objectKey]: objectAttributes };
        foundObjectInContext = this.#filesManager.addNewObjectIntoThePositionBasedOnHierarchyArray(newObject, foundObjectInContext, hierarchyArray);
        this.#filesManager.saveConfigurationFileByName(jsonFile, fileName);
    }

    #getConfigurationObjectFromFileExtrictlyCorrespondingToThePassedContext(fileName, passedContext, hierarchyArray) {
        let outcome = {};
        var jsonFile = this.#extension.getConfigFileByName(fileName);

        let foundObjectInContext = null;
        for (const fileContextPartObj of jsonFile) {
            if (this.#isFileContextPartCorrespondingExtrictlyToThePassedContext(fileContextPartObj, passedContext)) {
                foundObjectInContext = fileContextPartObj;
                break;
            }
        }
        if (foundObjectInContext == null) {
            foundObjectInContext = jsonFile;
        }

        outcome = this.#filesManager.getObjectPartBasedOnHierarchyArray(foundObjectInContext, hierarchyArray);

        return outcome;
    }

    #isFileContextPartCorrespondingToTheDefaultContext(fileContextPartObj) {
        return this.#isFileContextPartCorrespondingExtrictlyToThePassedContext(fileContextPartObj, {});
    }

    #isFileContextPartCorrespondingExtrictlyToThePassedContext(fileContextPartObj, passedContext) {
        let outcome = false;
        const contextObject = this.#extension.getKeysAndValueContextJsonByFileContextPart(fileContextPartObj);
        if (JSON.stringify(contextObject) === JSON.stringify(passedContext)) {
            outcome = true;
        }

        return outcome;
    }

    #isFileContextPartBelongingToThePassedContext(fileContextPartObj, passedContext) {
        let outcome = true;
        const contextObject = this.#extension.getKeysAndValueContextJsonByFileContextPart(fileContextPartObj);

        for (const [key, value] of Object.entries(contextObject)) {
            if (passedContext.hasOwnProperty(key)) {
                const passedContextValues = passedContext[key];
                if (Array.isArray(value) && Array.isArray(passedContextValues)) {
                    if (value.length != 0 && passedContextValues.length != 0) {
                        if (!value.some(item => passedContextValues.includes(item))) {
                            return false;
                        }
                    }
                }
            }
        }

        return outcome;
    }
}

export default ConfigurationFilesContextManager.getInstance();
