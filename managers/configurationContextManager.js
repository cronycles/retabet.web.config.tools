class ConfigurationContextManager {
    #currentContext;

    constructor() {
        if (ConfigurationContextManager.instance) {
            return ConfigurationContextManager.instance;
        }
        this.#currentContext = "";
        ConfigurationContextManager.instance = this;
    }

    getCurrentContext() {
        return this.#currentContext;
    }

    setCurrentContext(newContext) {
        this.#currentContext = newContext;
    }
}

const instance = new ConfigurationContextManager();
Object.freeze(instance);

export default instance;
