import ConfigurationFilesManager from "../../../managers/configurationFilesManager.js";
import PagesManager from "../../pagesConfiguration/managers/pagesManager.js";

class PageSectionsManager {
    static #instance = null;
    #filesManager = ConfigurationFilesManager;
    #pagesManager = PagesManager;

    #pageSectionsFileName = "pageSections.config.json";
    #pageInvariantNameHierarchy = ["PageInvariantNames"];

    static getInstance() {
        if (!PageSectionsManager.#instance) {
            PageSectionsManager.#instance = new PageSectionsManager();
        }
        return PageSectionsManager.#instance;
    }

    getAllPages() {
        let outcome = null;
        const allPages = this.#pagesManager.getAllPages();
        outcome = Object.keys(allPages).map(pageName => ({
            name: pageName,
        }));

        return outcome;
    }

    getPageInvariantNamesObjectFromFile() {
        return this.#filesManager.getConfigurationObjectFromFileInTheCurrentContext(this.#pageSectionsFileName, this.#pageInvariantNameHierarchy);
    }

    savePageInvariantNamesObjectToFile(pageInvariantNamesObj) {
        this.#filesManager.saveConfigurationObjectInFileInTheCurrentContext(
            pageInvariantNamesObj,
            this.#pageSectionsFileName,
            this.#pageInvariantNameHierarchy
        );
    }
}
export default PageSectionsManager.getInstance();
