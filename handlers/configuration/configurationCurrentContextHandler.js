export default class ConfigurationCurrentContextHandler {
    #currentContext;

    constructor() {
        if (ConfigurationCurrentContextHandler.instance) {
            return ConfigurationCurrentContextHandler.instance;
        }

        this.#currentContext = {};

        ConfigurationCurrentContextHandler.instance = this;
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
