import { PageSectionsManager } from "../../../managers/uiConfiguration/pageSectionsManager.js";
import { PagesManager } from "../../../managers/uiConfiguration/pagesManager.js";
import { PanelsManager } from "../../../managers/uiConfiguration/panelsManager.js";
import { SectionsManager } from "../../../managers/uiConfiguration/sectionsManager.js";

class PageSectionsViewManager {
    static #instance = null;
    #pageSectionsManager = PageSectionsManager;
    #pagesManager = PagesManager;
    #panelsManager = PanelsManager;
    #sectionsManager = SectionsManager;

    #pageSectionsFileName = "pageSections.config.json";
    #pageInvariantNameHierarchy = ["PageInvariantNames"];

    static getInstance() {
        if (!PageSectionsViewManager.#instance) {
            PageSectionsViewManager.#instance = new PageSectionsViewManager();
        }
        return PageSectionsViewManager.#instance;
    }

    getAvailablePages() {
        let outcome = {};
        const allPages = this.#pagesManager.getAllPagesAvailablesForTheCurrentContext();
        if (allPages) {
            outcome = Object.keys(allPages).map(pageName => ({
                name: pageName,
            }));
        }

        return outcome;
    }

    getAvailablePanels() {
        let outcome = {};
        const allPanels = this.#panelsManager.getAllPanelsAvailablesForTheCurrentContext();
        if (allPanels) {
            outcome = Object.keys(allPanels).map(panelName => ({
                name: panelName,
            }));
        }

        return outcome;
    }

    getAvailableSections() {
        let outcome = {};
        const allSections = this.#sectionsManager.getAllSectionsAvailablesForTheCurrentContext();
        if (allSections) {
            outcome = Object.keys(allSections).map(sectionName => ({
                name: sectionName,
            }));
        }

        return outcome;
    }

    getPageSections() {
        let outcome = {};
        const pageSections = this.#pageSectionsManager.getAllPageSectionsInTheCurrentContextForEditingPurpose();
        if (pageSections) {
            outcome = pageSections;
        }
        return outcome;
    }

    addPanelInPage(panelName, pageName) {
        let outcome = true;
        outcome = this.#pageSectionsManager.addPanelToPageInTheCurrentContext(panelName, pageName);

        return outcome;
    }

    deletePanelFromPage(panelName, pageName) {
        let outcome = true;
        outcome = this.#pageSectionsManager.deleteExistingPanelFromThePageInTheCurrentContext(panelName, pageName);

        return outcome;
    }

    addSectionToPanelOfPage(sectionName, attributes, panelName, pageName) {
        let outcome = true;
        outcome = this.#pageSectionsManager.addSectionToPanelOfPageInTheCurrentContext(sectionName, attributes, panelName, pageName);

        return outcome;
    }

    deleteExistingSectionFromPanelOfPage(sectionName, position, panelName, pageName) {
        let outcome = true;
        outcome = this.#pageSectionsManager.deleteExistingSectionFromPanelOfPageInTheCurrentContext(sectionName, position, panelName, pageName);

        return outcome;
    }

    updateExistingSectionFromPanelOfPage(sectionName, attributes, position, panelName, pageName) {
        let outcome = true;
        outcome = this.#pageSectionsManager.updateExistingSectionFromPanelOfPageInTheCurrentContext(sectionName, attributes, position, panelName, pageName);

        return outcome;
    }

    updateSectionsOrderInAPanelOfAPage(pageName, panelName, order) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };

        outcome = this.#pageSectionsManager.updateSectionsOrderInAPanelOfAPageInTheCurrentContext(panelName, pageName, order);

        return outcome;
    }

    savePageInvariantNamesObjectToFile(pageInvariantNamesObj) {
        this.#pageSectionsManager.saveConfigurationObjectInFileInTheCurrentContext(
            pageInvariantNamesObj,
            this.#pageSectionsFileName,
            this.#pageInvariantNameHierarchy
        );
    }
}

const instance = PageSectionsViewManager.getInstance();
export { PageSectionsViewManager as PageSectionsManager, instance as default };
