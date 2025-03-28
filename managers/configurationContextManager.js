class ConfigurationContextManager {
    static #instance = null;
    #currentContext = "";

    static getInstance() {
        if (!ConfigurationContextManager.#instance) {
            ConfigurationContextManager.#instance = new ConfigurationContextManager();
        }
        return ConfigurationContextManager.#instance;
    }

    getCurrentContext() {
        return this.#currentContext;
    }

    setCurrentContext(newContext) {
        this.#currentContext = newContext;
    }
}

export default ConfigurationContextManager.getInstance();
