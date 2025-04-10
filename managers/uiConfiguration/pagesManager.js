import { ConfigurationFilesOperationsManager } from "../../managers/configuration/configurationFilesOperationsManager.js";

class PagesManager {
    static #instance = null;

    #filesOperationsManager = ConfigurationFilesOperationsManager;

    #pagesFileName = "pages.config.json";
    #pagesHierarchy = ["Pages"];
    #defaultAttributesHierarchy = ["DefaultPageAttributes"];

    static getInstance() {
        if (!PagesManager.#instance) {
            PagesManager.#instance = new PagesManager();
        }
        return PagesManager.#instance;
    }

    getAllPagesInTheCurrentContextForEditingPurpose() {
        let outcome = null;
        const allPages = this.#filesOperationsManager.getConfigurationObjectFromFileExtrictlyCorrespondingToTheCurrentContext(
            this.#pagesFileName,
            this.#pagesHierarchy
        );
        outcome = allPages;
        return outcome;
    }

    getPagesDefaultAttributesInTheCurrentContext() {
        let outcome = null;
        const pabelDefaultAttributes = this.#filesOperationsManager.getConfigurationObjectFromFileExtrictlyCorrespondingToTheCurrentContext(
            this.#pagesFileName,
            this.#defaultAttributesHierarchy
        );
        outcome = pabelDefaultAttributes;
        return outcome;
    }

    getAllPagesAvailablesForTheCurrentContext() {
        let outcome = null;
        const allPages = this.#filesOperationsManager.getConfigurationObjectFromFileBelongingToTheCurrentContext(
            this.#pagesFileName,
            this.#pagesHierarchy
        );
        outcome = allPages;
        return outcome;
    }

    addNewPageInTheCurrentContext(pageName, attributes) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };
        outcome = this.#filesOperationsManager.saveConfigurationObjectInFileExtrictlyInTheCurrentContext(
            pageName,
            attributes,
            this.#pagesHierarchy,
            this.#pagesFileName
        );

        return outcome;
    }

    updateExistingPageInTheCurrentContext(pageName, attributes) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };

        outcome = this.#filesOperationsManager.updateConfigurationObjectInFileExtrictlyInTheCurrentContext(
            pageName,
            attributes,
            this.#pagesFileName,
            this.#pagesHierarchy
        );

        return outcome;
    }

    deleteExistingPageInTheCurrentContext(pageName) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };

        outcome = this.#filesOperationsManager.deleteConfigurationObjectInFileExtrictlyInTheCurrentContext(
            pageName,
            this.#pagesFileName,
            this.#pagesHierarchy
        );

        return outcome;
    }
}

const instance = PagesManager.getInstance();
export { PagesManager as PagesManager, instance as default };
