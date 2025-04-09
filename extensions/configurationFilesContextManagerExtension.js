import { ConfigurationCurrentContextHandler } from "../handlers/configurationCurrentContextHandler.js";
import { ConfigurationFilesManager } from "../managers/configurationFilesManager.js";

class ConfigurationFilesContextManagerExtension {
    static #instance = null;
    #currentContextHandler = ConfigurationCurrentContextHandler;
    #filesManager = ConfigurationFilesManager;

    static getInstance() {
        if (!ConfigurationFilesContextManagerExtension.#instance) {
            ConfigurationFilesContextManagerExtension.#instance = new ConfigurationFilesContextManagerExtension();
        }
        return ConfigurationFilesContextManagerExtension.#instance;
    }

    getConfigurationObjectFromFileExtrictlyCorrespondingToTheDefaultContext(fileName) {
        return this.#getConfigurationObjectFromFileExtrictlyCorrespondingToThePassedContext(fileName, {});
    }

    getConfigurationObjectFromFileExtrictlyCorrespondingToTheCurrentContext(fileName) {
        let outcome = {};
        const currentContextObj = this.getConfigurationCurrentContext();
        let foundObjectInContext = this.#getConfigurationObjectFromFileExtrictlyCorrespondingToThePassedContext(fileName, currentContextObj);

        outcome = this.#filesManager.getObjectPartBasedOnHierarchyArray(foundObjectInContext, hierarchyArray);

        return outcome;
    }

    isFileContextPartCorrespondingToTheDefaultContext(fileContextPartObj) {
        return this.isFileContextPartCorrespondingExtrictlyToThePassedContext(fileContextPartObj, {});
    }

    isFileContextPartCorrespondingExtrictlyToThePassedContext(fileContextPartObj, passedContext) {
        let outcome = false;
        const contextObject = this.#getKeysAndValueContextJsonByFileContextPart(fileContextPartObj);
        if (JSON.stringify(contextObject) === JSON.stringify(passedContext)) {
            outcome = true;
        }

        return outcome;
    }

    isFileContextPartBelongingToThePassedContext(fileContextPartObj, passedContext) {
        let outcome = true;
        const contextObject = this.#getKeysAndValueContextJsonByFileContextPart(fileContextPartObj);

        for (const [key, value] of Object.entries(contextObject)) {
            if (passedContext.hasOwnProperty(key)) {
                const passedContextValues = passedContext[key];
                if (Array.isArray(value) && Array.isArray(passedContextValues)) {
                    if (value.length != 0 && passedContextValues.length != 0) {
                        if (!value.some((item) => passedContextValues.includes(item))) {
                            return false;
                        }
                    }
                }
            }
        }

        return outcome;
    }

    getConfigurationCurrentContext() {
        let outcome = {};
        const currentContext = this.#currentContextHandler.getCurrentContext();
        if (currentContext != null) {
            outcome = currentContext;
        }
        return outcome;
    }

    #getKeysAndValueContextJsonByFileContextPart(fileContextPart) {
        return Object.fromEntries(Object.entries(fileContextPart).filter(([key]) => key !== "Configuration"));
    }

    #getConfigurationObjectFromFileExtrictlyCorrespondingToThePassedContext(fileName, passedContext) {
        let outcome = null;
        var jsonFile = this.#filesManager.getConfigurationFileByName(fileName);

        for (const fileContextPartObj of jsonFile) {
            if (this.isFileContextPartCorrespondingExtrictlyToThePassedContext(fileContextPartObj, passedContext)) {
                outcome = fileContextPartObj;
                break;
            }
        }

        return outcome;
    }
}

const instance = ConfigurationFilesContextManagerExtension.getInstance();
export { ConfigurationFilesContextManagerExtension, instance as default };
