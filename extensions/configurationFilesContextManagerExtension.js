import ConfigurationFilesManager from "../managers/configurationFilesManager.js";
import ConfigurationCurrentContextManager from "../managers/configurationCurrentContextManager.js";

class ConfigurationFilesContextManagerExtension {
    static #instance = null;

    #filesManager = ConfigurationFilesManager;
    #currentContextManager = ConfigurationCurrentContextManager;

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

    getConfigFileByName(fileName) {
        let outcome = null;

        if (fileName) {
            const fileContent = this.#filesManager.getConfigurationFileByName(fileName);
            if (fileContent) {
                outcome = fileContent;
            }
        }

        return outcome;
    }

    saveConfigurationFileByName(jsoObject, fileName) {
        let outcome = false;

        if (fileName) {
            const saveResponse = this.#filesManager.saveConfigurationFileByName(jsoObject, fileName);
            if (saveResponse) {
                outcome = saveResponse;
            }
        }

        return outcome;
    }

    getKeysAndValueContextJsonByFileContextPart(fileContextPart) {
        return Object.fromEntries(Object.entries(fileContextPart).filter(([key]) => key !== "Configuration"));
    }

    getConfigurationCurrentContext() {
        let outcome = {};
        const currentContext = this.#currentContextManager.getCurrentContext();
        if (currentContext != null) {
            outcome = currentContext;
        }
        return outcome;
    }

}

export default ConfigurationFilesContextManagerExtension.getInstance();
