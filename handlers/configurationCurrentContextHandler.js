class ConfigurationCurrentContextHandler {
    static #instance = null;
    #currentContext = {};

    static getInstance() {
        if (!ConfigurationCurrentContextHandler.#instance) {
            ConfigurationCurrentContextHandler.#instance = new ConfigurationCurrentContextHandler();
        }
        return ConfigurationCurrentContextHandler.#instance;
    }

    getCurrentContext() {
        return this.#currentContext;
    }

    setCurrentContext(newContext) {
        this.#currentContext = newContext;
    }

    resetCurrentContext() {
        this.#currentContext = {};
    }
}

const instance = ConfigurationCurrentContextHandler.getInstance();
export { ConfigurationCurrentContextHandler, instance as default };
