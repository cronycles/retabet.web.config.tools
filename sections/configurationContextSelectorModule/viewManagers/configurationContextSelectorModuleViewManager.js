import ConfigurationFileContextsManager from "../../../managers/configuration/configurationFileContextsManager.js";
import ConfigurationContextManager from "../../../managers/configuration/configurationContextManager.js";

export default class ConfigurationContextSelectorModuleViewManager {
    #fileContextsManager;
    #contextManager;

    constructor() {
        if (ConfigurationContextSelectorModuleViewManager.instance) {
            return ConfigurationContextSelectorModuleViewManager.instance;
        }

        this.#fileContextsManager = new ConfigurationFileContextsManager();
        this.#contextManager = new ConfigurationContextManager();

        ConfigurationContextSelectorModuleViewManager.instance = this;
    }

    loadFileContextsByFileName(fileName) {
        try {
            let outcome = {
                isOk: false,
                errorType: "UNKNOWN",
                data: null,
            };

            let data = [];
            const fileContextsResponse = this.#fileContextsManager.loadFileContextsByFileName(fileName);
            if (fileContextsResponse?.isOk && fileContextsResponse.data) {
                const contexts = fileContextsResponse.data;
                contexts.forEach(context => {
                    let stringContext = JSON.stringify(context);
                    let contextOutput = {
                        textContent: stringContext === "{}" ? "Default" : stringContext,
                        value: stringContext,
                    };
                    data.push(contextOutput);
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

    deleteContextInFileByFileNameAndResetCurrentContext(stringContextValue, fileName) {
        try {
            let outcome = {
                isOk: false,
                errorType: "UNKNOWN",
            };
            if (stringContextValue) {
                const contextValue = JSON.parse(stringContextValue);
                if (Object.keys(contextValue).length === 0) {
                    outcome.errorType = "BAD_REQUEST";
                }
                const deleteResponse = this.#fileContextsManager.deleteContextInFileByFileName(contextValue, fileName);
                if (deleteResponse?.isOk) {
                    outcome.isOk = true;
                }
            }
            return outcome;
        } catch (error) {
            console.error("Error deleting contexts from file:", error);
            let outcome = {
                isOk: false,
                errorType: "UNKNOWN",
            };
            return outcome;
        }
    }

    saveContextInFileByFileNameAndSetNewCurrentContext(contextValue, fileName) {
        try {
            let outcome = {
                isOk: false,
                errorType: "UNKNOWN",
            };
            if (contextValue) {
                if (Object.keys(contextValue).length === 0) {
                    outcome.errorType = "BAD_REQUEST";
                }

                outcome = this.#fileContextsManager.saveNewContextInFileByFileName(contextValue, fileName);
            }
            return outcome;
        } catch (error) {
            console.error("Error deleting contexts from file:", error);
            let outcome = {
                isOk: false,
                errorType: "UNKNOWN",
            };
            return outcome;
        }
    }

    getContextConfigProperties() {
        try {
            let outcome = {
                isOk: false,
                errorType: "UNKNOWN",
                data: null,
            };
            const jsonFile = this.#contextManager.getContextConfigurationAvailableProperties();
            if (jsonFile) {
                outcome.isOk = true;
                outcome.data = jsonFile;
            }
            return outcome;
        } catch (error) {
            console.error(`Error getContextConfigProperties:`, error);
            return {
                isOk: false,
                errorType: "INTERNAL_SERVICE_ERROR",
                data: null,
            };
        }
    }

    setSelectedContext(stringContext) {
        const jsonContext = JSON.parse(stringContext);
        return this.#contextManager.setCurrentContext(jsonContext);
    }

    getSelectedContext() {
        return this.#contextManager.getCurrentContext();
    }
}
