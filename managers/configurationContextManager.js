class ConfigurationContextManager {
    #currentContext;

    constructor() {
        this.#currentContext = "";
    }

    getCurrentContext() {
        return this.#currentContext;
    }

    setCurrentContext(newContext) {
        this.#currentContext = newContext;
    }
}
export default new ConfigurationContextManager();
