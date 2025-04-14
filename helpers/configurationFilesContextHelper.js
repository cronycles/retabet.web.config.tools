import ConfigurationContextManager from "../managers/configuration/configurationContextManager.js";

export default class ConfigurationFilesContextHelper {
    #CONFIGURATION_KEY = "Configuration";

    #contextManager;

    constructor() {
        if (ConfigurationFilesContextHelper.instance) {
            return ConfigurationFilesContextHelper.instance;
        }
        this.#contextManager = new ConfigurationContextManager();
        ConfigurationFilesContextHelper.instance = this;
    }

    getAllContextsInConfigurationFile(configFile) {
        let outcome = null;
        if (configFile) {
            outcome = [];
            configFile.forEach((context) => {
                const jsonKeysAndValues = this.#getKeysAndValueContextJsonByFileContextPart(context);
                outcome.push(jsonKeysAndValues);
            });
        }
        return outcome;
    }

    deleteContextInConfigurationFile(contextValue, configFileContent) {
        let outcome = false;
        if (contextValue && configFileContent) {
            const updatedConfigFileContent = configFileContent.filter((context) => {
                const keysAndValues = this.#getKeysAndValueContextJsonByFileContextPart(context);
                return JSON.stringify(keysAndValues) !== JSON.stringify(contextValue);
            });

            if (updatedConfigFileContent != {}) {
                outcome = true;
            }
        }
        return outcome;
    }

    addNewContextInConfigurationFile(newContext, configFileContent) {
        let outcome = null;
        if (newContext && configFileContent) {
            outcome = { ...configFileContent };
            const contextWithConfiguration = { ...newContext };
            contextWithConfiguration.Configuration = {};
            outcome.push(contextWithConfiguration);
        }
        return outcome;
    }

    extractObjectFromFileExtrictlyCorrespondingToTheCurrentContext(jsonFile) {
        let outcome = {};
        const currentContextObj = this.#contextManager.getCurrentContext();
        outcome = this.#extractObjectFromFileExtrictlyCorrespondingToThePassedContext(jsonFile, currentContextObj);

        return outcome;
    }

    extractObjectFromFileBelongingToTheCurrentContext(jsonFile) {
        let outcome = {};
        const currentContextObj = this.#contextManager.getCurrentContext();
        outcome = this.#extractObjectFromFileBelongingToThePassedContext(jsonFile, currentContextObj);

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
                    outcome = this.#mergeDeep(outcome, fileContextPartObj);
                }
            }
        }

        return outcome;
    }

    #mergeDeep(target, ...sources) {
        if (!sources.length) return target;
        const source = sources.shift();
      
        if (this.#isObject(target) && this.#isObject(source)) {
          for (const key in source) {
            if (this.#isObject(source[key])) {
              if (!target[key]) Object.assign(target, { [key]: {} });
              this.#mergeDeep(target[key], source[key]);
            } else {
              Object.assign(target, { [key]: source[key] });
            }
          }
        }
      
        return this.#mergeDeep(target, ...sources);
      }

      #isObject(item) {
        return (item && typeof item === 'object' && !Array.isArray(item));
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
                        if (!value.some((item) => passedContextValues.includes(item))) {
                            return false;
                        }
                    }
                }
            }
        }

        return outcome;
    }

    #getKeysAndValueContextJsonByFileContextPart(fileContextPart) {
        return Object.fromEntries(Object.entries(fileContextPart).filter(([key]) => key !== this.#CONFIGURATION_KEY));
    }
}
