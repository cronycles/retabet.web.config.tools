import { ConfigurationFilesOperationsManager } from "../configurationFilesOperationsManager.js";

class PageSectionsManager {
    static #instance = null;

    #filesOperationsManager = ConfigurationFilesOperationsManager;

    #pageSectionsFileName = "pageSections.config.json";
    #pageInvariantNameHierarchy = ["PageInvariantNames"];

    static getInstance() {
        if (!PageSectionsManager.#instance) {
            PageSectionsManager.#instance = new PageSectionsManager();
        }
        return PageSectionsManager.#instance;
    }

    getAllPageSectionsInTheCurrentContextForEditingPurpose() {
        let outcome = null;
        const allPageSections = this.#filesOperationsManager.getConfigurationObjectFromFileExtrictlyCorrespondingToTheCurrentContext(
            this.#pageSectionsFileName,
            this.#pageInvariantNameHierarchy
        );
        outcome = allPageSections;
        return outcome;
    }

    addPanelToPageInTheCurrentContext(panelName, pageName) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };
        const newHierarchy = [...this.#pageInvariantNameHierarchy, ...pageName];
        outcome = this.#filesOperationsManager.saveConfigurationObjectInFileExtrictlyInTheCurrentContext(panelName, [], newHierarchy, this.#pageSectionsFileName);

        return outcome;
    }

    deleteExistingPanelFromThePageInTheCurrentContext(panelName, pageName) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };

        const newHierarchy = [...this.#pageInvariantNameHierarchy, ...pageName];
        outcome = this.#filesOperationsManager.deleteConfigurationObjectInFileExtrictlyInTheCurrentContext(panelName, this.#pageSectionsFileName, newHierarchy);

        return outcome;
    }

    addSectionToPanelOfPageInTheCurrentContext(sectionName, sectionAttributes, panelName, pageName) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };
        const newHierarchy = [...this.#pageInvariantNameHierarchy, ...pageName, ...panelName];
        outcome = this.#filesOperationsManager.saveConfigurationObjectInFileExtrictlyInTheCurrentContext(
            sectionName,
            sectionAttributes,
            newHierarchy,
            this.#pageSectionsFileName
        );

        return outcome;
    }

    deleteExistingSectionFromPanelOfPageInTheCurrentContext(sectionName, position, panelName, pageName) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };

        const newHierarchy = [...this.#pageInvariantNameHierarchy, ...pageName, ...panelName];
        outcome = this.#filesOperationsManager.deleteConfigurationObjectInFileExtrictlyInTheCurrentContext(
            sectionName,
            this.#pageSectionsFileName,
            newHierarchy,
            position
        );

        return outcome;
    }

    updateExistingSectionFromPanelOfPageInTheCurrentContext(sectionName, sectionAttributes, position, panelName, pageName) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };

        const newHierarchy = [...this.#pageInvariantNameHierarchy, ...pageName, ...panelName];
        outcome = this.#filesOperationsManager.updateConfigurationObjectInFileExtrictlyInTheCurrentContext(
            sectionName,
            sectionAttributes,
            this.#pageSectionsFileName,
            newHierarchy,
            position
        );

        return outcome;
    }

    updateSectionsOrderInAPanelOfAPageInTheCurrentContext(panelName, pageName, order) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };

        const newHierarchy = [...this.#pageInvariantNameHierarchy, ...pageName, ...panelName];
        outcome = this.#filesOperationsManager.updateConfigurationObjectsOrderInFileExtrictlyInTheCurrentContext(
            order,
            this.#pageSectionsFileName,
            newHierarchy,
        );

        return outcome;
    }
}

const instance = PageSectionsManager.getInstance();
export { PageSectionsManager as PageSectionsManager, instance as default };
