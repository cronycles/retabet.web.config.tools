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

    updateSectionsOrderInAPanelOfAPage (pageName, panelName, order) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN"
        }
        
        const pageInvariantNamesObj = this.getPageInvariantNamesObjectFromFile();
        const page = pageInvariantNamesObj[pageName];
        if (!page || !page[panelName]) {
            outcome.errorType = "NOT_FOUND";
        }
        else {
            const panelSections = page[panelName];
            const reorderedSections = order.map(sectionName => {
                return panelSections.find(section => {
                    return typeof section === "string" ? section === sectionName : Object.keys(section)[0] === sectionName;
                });
            });
        
            pageInvariantNamesObj[pageName][panelName] = reorderedSections;
            this.savePageInvariantNamesObjectToFile(pageInvariantNamesObj);
            outcome.isOk = true;
        
        }
    
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
