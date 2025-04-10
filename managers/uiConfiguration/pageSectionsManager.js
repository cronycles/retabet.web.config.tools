import ConfigurationFilesOperationsManager from "../configurationFilesOperationsManager.js";

export default class PageSectionsManager {
    #pageSectionsFileName = "pageSections.config.json";
    #pageInvariantNameHierarchy = ["PageInvariantNames"];

    #filesOperationsManager;
    
    constructor() {
        if (PageSectionsManager.instance) {
            return PageSectionsManager.instance;
        }
        this.#filesOperationsManager = new ConfigurationFilesOperationsManager();

        PageSectionsManager.instance = this;
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
        outcome = this.#filesOperationsManager.saveConfigurationObjectInFileExtrictlyInTheCurrentContext(
            panelName,
            [],
            newHierarchy,
            this.#pageSectionsFileName
        );

        return outcome;
    }

    deleteExistingPanelFromThePageInTheCurrentContext(panelName, pageName) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };

        const newHierarchy = [...this.#pageInvariantNameHierarchy, ...pageName];
        outcome = this.#filesOperationsManager.deleteConfigurationObjectInFileExtrictlyInTheCurrentContext(
            panelName,
            this.#pageSectionsFileName,
            newHierarchy
        );

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
            newHierarchy
        );

        return outcome;
    }
}
