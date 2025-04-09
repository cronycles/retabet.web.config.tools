class ConfigurationFilesContextHelper {
    static #instance = null;

    static getInstance() {
        if (!ConfigurationFilesContextHelper.#instance) {
            ConfigurationFilesContextHelper.#instance = new ConfigurationFilesContextHelper();
        }
        return ConfigurationFilesContextHelper.#instance;
    }

    getKeysAndValuesContextJsonByFileContent(configFileContent) {
        let outcome = null;
        if (configFileContent) {
            outcome = [];
            configFileContent.forEach((context) => {
                const jsonKeysAndValues = this.getKeysAndValueContextJsonByFileContextPart(context);
                outcome.push(jsonKeysAndValues);
            });
        }
        return outcome;
    }

    deleteContextInFileContent(contextValue, configFileContent) {
        let outcome = false;
        if (contextValue && configFileContent) {
            const updatedConfigFileContent = configFileContent.filter((context) => {
                const keysAndValues = this.getKeysAndValueContextJsonByFileContextPart(context);
                return JSON.stringify(keysAndValues) !== JSON.stringify(contextValue);
            });

            if (updatedConfigFileContent != {}) {
                outcome = true;
            }
        }
        return outcome;
    }

    addNewContextInFileContent(newContext, configFileContent) {
        let outcome = null;
        if (newContext && configFileContent) {
            outcome = { ...configFileContent };
            const contextWithConfiguration = { ...newContext };
            contextWithConfiguration.Configuration = {};
            outcome.push(contextWithConfiguration);
        }
        return outcome;
    }

    getKeysAndValueContextJsonByFileContextPart(fileContextPart) {
        return Object.fromEntries(Object.entries(fileContextPart).filter(([key]) => key !== "Configuration"));
    }
}

const instance = ConfigurationFilesContextHelper.getInstance();
export { ConfigurationFilesContextHelper, instance as default };