import ConfigurationCurrentContextManager from "../managers/configurationCurrentContextManager.js";
import ConfigurationFilesManager from "../managers/configurationFilesManager.js";

class ConfigurationFilesContextManagerExtension {
    static #instance = null;
    #currentContextManager = ConfigurationCurrentContextManager;
    #filesManager = ConfigurationFilesManager;

    static getInstance() {
        if (!ConfigurationFilesContextManagerExtension.#instance) {
            ConfigurationFilesContextManagerExtension.#instance = new ConfigurationFilesContextManagerExtension();
        }
        return ConfigurationFilesContextManagerExtension.#instance;
    }

    loadFileContextsByFileName(fileName) {
        try {
            let outcome = {
                isOk: false,
                errorType: "UNKNOWN",
                data: null,
            };

            let data = [];
            const configFileContent = this.getConfigFileByName(fileName);
            if (configFileContent) {
                configFileContent.forEach(context => {
                    const jsonKeysAndValues = this.getKeysAndValueContextJsonByFileContextPart(context);
                    data.push(jsonKeysAndValues);
                });

                outcome.isOk = true;
                outcome.data = data;
            }
            return outcome;
        } catch (error) {
            console.error("Error loading contexts from file:", error);
            let outcome = {
                isOk: false,
                errorType: "UNKNOWN",
                data: null,
            };
            return outcome;
        }
    }

    deleteContextInFileByFileName(contextValue, fileName) {
        try {
            let outcome = {
                isOk: false,
                errorType: "UNKNOWN",
                data: null,
            };

            const configFileContent = this.getConfigFileByName(fileName);
            if (configFileContent) {
                // Find and remove the selected context
                const updatedConfigFileContent = configFileContent.filter(context => {
                    const keysAndValues = this.getKeysAndValueContextJsonByFileContextPart(context);
                    return JSON.stringify(keysAndValues) !== JSON.stringify(contextValue);
                });

                if (updatedConfigFileContent != {}) {
                    const isSaved = this.saveConfigurationFileByName(updatedConfigFileContent, fileName);
                    if (isSaved) {
                        outcome.isOk = true;
                        outcome.data = true;
                    }
                }
            }
            return outcome;
        } catch (error) {
            console.error("Error loading contexts from file:", error);
            let outcome = {
                isOk: false,
                errorType: "UNKNOWN",
                data: null,
            };
            return outcome;
        }
    }

    saveNewContextInFileByFileName(newContext, fileName) {
        try {
            let outcome = {
                isOk: false,
                errorType: "UNKNOWN",
                data: null,
            };

            const configFileContent = this.getConfigFileByName(fileName);
            if (configFileContent) {
                const contextWithConfiguration = { ...newContext };

                contextWithConfiguration.Configuration = {}; // Add the "Configuration" property
                configFileContent.push(contextWithConfiguration); // Add the new context to the file content

                const isSaved = this.saveConfigurationFileByName(configFileContent, fileName);
                if (isSaved) {
                    outcome.isOk = true;
                    outcome.data = true;
                }
            }
            return outcome;
        } catch (error) {
            console.error("Error loading contexts from file:", error);
            let outcome = {
                isOk: false,
                errorType: "UNKNOWN",
                data: null,
            };
            return outcome;
        }
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
                        if (!value.some(item => passedContextValues.includes(item))) {
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
        const currentContext = this.#currentContextManager.getCurrentContext();
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

export default ConfigurationFilesContextManagerExtension.getInstance();
