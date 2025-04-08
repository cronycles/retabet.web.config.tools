import ConfigurationFilesManager from "./configurationFilesManager.js";

class ConfigurationFilesContextManager {
    static #instance = null;

    #filesManager = ConfigurationFilesManager;

    static getInstance() {
        if (!ConfigurationFilesContextManager.#instance) {
            ConfigurationFilesContextManager.#instance = new ConfigurationFilesContextManager();
        }
        return ConfigurationFilesContextManager.#instance;
    }

    loadFileContextsByFileName(fileName) {
        try {
            let outcome = {
                isOk: false,
                errorType: "UNKNOWN",
                data: null,
            };

            let data = [];
            const configFileContent = this.#getConfigFileByName(fileName);
            if (configFileContent) {
                configFileContent.forEach(context => {
                    const jsonKeysAndValues = this.#getKeysAndValueContextJsonByEntireContext(context);
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

            let data = [];
            const configFileContent = this.#getConfigFileByName(fileName);
            if (configFileContent) {
                // Find and remove the selected context
                const updatedConfigFileContent = configFileContent.filter(context => {
                    const keysAndValues = this.#getKeysAndValueContextJsonByEntireContext(context);
                    return JSON.stringify(keysAndValues) !== JSON.stringify(contextValue);
                });

                if(updatedConfigFileContent != {}) {
                    const isSaved = this.#saveConfigurationFileByName(updatedConfigFileContent, fileName);
                    if(isSaved) {
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

    #getConfigFileByName(fileName) {
        let outcome = null;

        if (fileName) {
            const fileContent = this.#filesManager.getConfigurationFileByName(fileName);
            if (fileContent) {
                outcome = fileContent;
            }
        }

        return outcome;
    }

    #saveConfigurationFileByName(jsoObject, fileName) {
        let outcome = false;

        if (fileName) {
            const saveResponse = this.#filesManager.saveConfigurationFileByName(jsoObject, fileName);
            if (saveResponse) {
                outcome = saveResponse;
            }
        }

        return outcome;
    }

    #getKeysAndValueContextJsonByEntireContext(jsonFile) {
        return Object.fromEntries(Object.entries(jsonFile).filter(([key]) => key !== "Configuration"));
    }
}

export default ConfigurationFilesContextManager.getInstance();
