import { ConfigurationFilesManager } from "../../../managers/configurationFilesManager.js";

class PagesManager {
    static #instance = null;
    #filesManager = ConfigurationFilesManager;

    #pagesFileName = "pages.config.json";
    #pagesHierarchy = ["Pages"];

    static getInstance() {
        if (!PagesManager.#instance) {
            PagesManager.#instance = new PagesManager();
        }
        return PagesManager.#instance;
    }

    // Handler to get pages from pages.config.json
    getAllPages() {
        try {
            let outcome = null;
            outcome = this.#getPagesObjectFromFile(); // Use updated readJSON

            return outcome;
        } catch (error) {
            console.error("Error in getAllPages:", error);
            return null;
        }
    }

    #getPagesObjectFromFile() {
        return this.#filesManager.getConfigurationObjectFromFileInTheCurrentContext(this.#pagesFileName, this.#pagesHierarchy);
    }
}

const instance = PagesManager.getInstance();
export { PagesManager, instance as default };
