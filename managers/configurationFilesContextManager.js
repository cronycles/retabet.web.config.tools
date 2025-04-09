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
        let outcome = {};
        let foundObjectInContext = this.#extension.getConfigurationObjectFromFileExtrictlyCorrespondingToTheDefaultContext(fileName);
        outcome = this.#filesManager.getObjectPartBasedOnHierarchyArray(foundObjectInContext, hierarchyArray);

        return outcome;
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
     * @param {string[]} [hierarchyArray] - indica la gerarquia de que parte del objeto quiero: si no le pasas el segundo parámetro,
     * supondrá que el objeto a devolver está en el tercer puesto: "Configuracion"--> "Nombre_CONF" --> AQUI!
     * si le pasas el segundo parámetro el te devolverá el objeto que está debajo de esa jerarquía y,
     * si no hay nada, te devolverá la jerarquía de objetos vacíos
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
     * Guarda el objeto exactamente en el current context.
     * Sustituye los datos existentes en la expecifica gerarquia
     * @param {Object|null} newObject - El nuevo objeto a guardar.
     * @param {string} fileName - nombre del fichero de configuracion
     * @param {string[]} [hierarchyArray] - indica la gerarquia de que parte del objeto quiero: si no le pasas el segundo parámetro,
     * supondrá que el objeto a devolver está en el tercer puesto: "Configuracion"--> "Nombre_CONF" --> AQUI!
     * si le pasas el segundo parámetro el te devolverá el objeto que está debajo de esa jerarquía y,
     * si no hay nada, te devolverá la jerarquía de objetos vacíos
     */
    saveConfigurationObjectInFileExtrictlyInTheCurrentContext(newObject, fileName, hierarchyArray) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };
        const currentContextObj = this.#extension.getConfigurationCurrentContext();
        var jsonFile = this.#filesManager.getConfigurationFileByName(fileName);

        let foundObjectInContext = this.#getConfigurationObjectFromFileExtrictlyCorrespondingToThePassedContext(fileName, currentContextObj);

        outcome = this.#filesManager.addNewObjectIntoThePositionBasedOnHierarchyArray(newObject, foundObjectInContext, hierarchyArray);
        if (addResponse?.isOk) {
            outcome = this.#filesManager.saveConfigurationFileByName(jsonFile, fileName);
        } else {
            outcome.errorType = addResponse.errorType;
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

export default ConfigurationFilesContextManager.getInstance();
