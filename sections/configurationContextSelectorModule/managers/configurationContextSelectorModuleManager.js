import { ConfigurationContextManager } from "../../../managers/configurationContextManager.js";
import { ConfigurationFilesContextEditorManager } from "../../../managers/configurationFilesContextEditorManager.js";

class ConfigurationContextSelectorModuleManager {
    static #instance = null;

    #filesContextEditorManager = ConfigurationFilesContextEditorManager;
    #contextManager = ConfigurationContextManager;

    static getInstance() {
        if (!ConfigurationContextSelectorModuleManager.#instance) {
            ConfigurationContextSelectorModuleManager.#instance = new ConfigurationContextSelectorModuleManager();
        }
        return ConfigurationContextSelectorModuleManager.#instance;
    }

    loadFileContextsByFileName(fileName) {
        try {
            let outcome = {
                isOk: false,
                errorType: "UNKNOWN",
                data: null,
            };

            let data = [];
            const fileContextsResponse = this.#filesContextEditorManager.loadFileContextsByFileName(fileName);
            if (fileContextsResponse?.isOk && fileContextsResponse.data) {
                const contexts = fileContextsResponse.data;
                contexts.forEach((context) => {
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
                data: null,
            };
            if (stringContextValue) {
                const contextValue = JSON.parse(stringContextValue);
                if (Object.keys(contextValue).length === 0) {
                    outcome.errorType = "BAD_REQUEST";
                }
                const deleteResponse = this.#filesContextEditorManager.deleteContextInFileByFileName(contextValue, fileName);
                if (deleteResponse?.isOk && deleteResponse.data) {
                    this.#contextManager.resetCurrentContext();
                    outcome.isOk = true;
                    outcome.data = deleteResponse.data;
                }
            }
            return outcome;
        } catch (error) {
            console.error("Error deleting contexts from file:", error);
            let outcome = {
                isOk: false,
                errorType: "UNKNOWN",
                data: null,
            };
            return outcome;
        }
    }

    saveContextInFileByFileNameAndSetNewCurrentContext(stringContextValue, fileName) {
        try {
            let outcome = {
                isOk: false,
                errorType: "UNKNOWN",
                data: null,
            };
            if (stringContextValue) {
                const contextValue = JSON.parse(stringContextValue);
                if (Object.keys(contextValue).length === 0) {
                    outcome.errorType = "BAD_REQUEST";
                }

                const deleteResponse = this.#filesContextEditorManager.saveNewContextInFileByFileName(contextValue, fileName);
                if (deleteResponse?.isOk && deleteResponse.data) {
                    this.#contextManager.setCurrentContext(contextValue);
                    outcome.isOk = true;
                    outcome.data = deleteResponse.data;
                }
            }
            return outcome;
        } catch (error) {
            console.error("Error deleting contexts from file:", error);
            let outcome = {
                isOk: false,
                errorType: "UNKNOWN",
                data: null,
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

const instance = ConfigurationContextSelectorModuleManager.getInstance();
export { ConfigurationContextSelectorModuleManager, instance as default };
