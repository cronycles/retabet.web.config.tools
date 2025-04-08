class ConfigurationCurrentContextManager {
    static #instance = null;
    #currentContext = {};

    static getInstance() {
        if (!ConfigurationCurrentContextManager.#instance) {
            ConfigurationCurrentContextManager.#instance = new ConfigurationCurrentContextManager();
        }
        return ConfigurationCurrentContextManager.#instance;
    }

    getCurrentContext() {
        return this.#currentContext;
    }

    setCurrentContext(newContext) {
        this.#currentContext = newContext;
    }
}

export default ConfigurationCurrentContextManager.getInstance();
