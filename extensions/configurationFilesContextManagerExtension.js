import { ConfigurationContextManager } from "../managers/configurationContextManager.js";

class ConfigurationFilesContextManagerExtension {
    static #instance = null;
    #contextManager = ConfigurationContextManager;

    static getInstance() {
        if (!ConfigurationFilesContextManagerExtension.#instance) {
            ConfigurationFilesContextManagerExtension.#instance = new ConfigurationFilesContextManagerExtension();
        }
        return ConfigurationFilesContextManagerExtension.#instance;
    }

    extractObjectFromFileExtrictlyCorrespondingToTheCurrentContext(jsonFile) {
        let outcome = {};
        const currentContextObj = this.getConfigurationCurrentContext();
        outcome = this.#extractObjectFromFileExtrictlyCorrespondingToThePassedContext(jsonFile, currentContextObj);

        return outcome;
    }

    extractObjectFromFileBelongingToTheCurrentContext(jsonFile) {
        let outcome = {};
        const currentContextObj = this.getConfigurationCurrentContext();
        outcome = this.#extractObjectFromFileBelongingToThePassedContext(jsonFile, currentContextObj);

        return outcome;
    }

    getConfigurationCurrentContext() {
        let outcome = {};
        const currentContext = this.#contextManager.getCurrentContext();
        if (currentContext != null) {
            outcome = currentContext;
        }
        return outcome;
    }

    #extractObjectFromFileExtrictlyCorrespondingToThePassedContext(jsonFile, passedContext) {
        let outcome = null;
        if (jsonFile) {
            for (const fileContextPartObj of jsonFile) {
                if (this.#isFileContextPartCorrespondingExtrictlyToThePassedContext(fileContextPartObj, passedContext)) {
                    outcome = fileContextPartObj;
                    break;
                }
            }
        }

        return outcome;
    }

    #extractObjectFromFileBelongingToThePassedContext(jsonFile, passedContext) {
        let outcome = {};
        if (jsonFile) {
            for (const fileContextPartObj of jsonFile) {
                if (
                    this.#isFileContextPartCorrespondingToTheDefaultContext(fileContextPartObj) ||
                    this.#isFileContextPartBelongingToThePassedContext(fileContextPartObj, passedContext)
                ) {
                    outcome = { ...foundObjectInContext, ...fileContextPartObj };
                    break;
                }
            }
        }

        return outcome;
    }

    #isFileContextPartCorrespondingToTheDefaultContext(fileContextPartObj) {
        return this.#isFileContextPartCorrespondingExtrictlyToThePassedContext(fileContextPartObj, {});
    }

    #isFileContextPartCorrespondingExtrictlyToThePassedContext(fileContextPartObj, passedContext) {
        let outcome = false;
        const contextObject = this.#getKeysAndValueContextJsonByFileContextPart(fileContextPartObj);
        if (JSON.stringify(contextObject) === JSON.stringify(passedContext)) {
            outcome = true;
        }

        return outcome;
    }

    #isFileContextPartBelongingToThePassedContext(fileContextPartObj, passedContext) {
        let outcome = true;
        const contextObject = this.#getKeysAndValueContextJsonByFileContextPart(fileContextPartObj);

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

    #getKeysAndValueContextJsonByFileContextPart(fileContextPart) {
        return Object.fromEntries(Object.entries(fileContextPart).filter(([key]) => key !== "Configuration"));
    }
}

const instance = ConfigurationFilesContextManagerExtension.getInstance();
export { ConfigurationFilesContextManagerExtension, instance as default };
