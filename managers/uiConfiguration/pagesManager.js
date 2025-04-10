import { ConfigurationFilesService } from "../../services/configurationFilesService.js";

class PagesManager {
    static #instance = null;

    #filesService = ConfigurationFilesService;

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
        const allPages = this.#filesService.getConfigurationObjectFromFileExtrictlyCorrespondingToTheCurrentContext(
            this.#pagesFileName,
            this.#pagesHierarchy
        );
        outcome = allPages;
        return outcome;
    }

    getPagesDefaultAttributesInTheCurrentContext() {
        let outcome = null;
        const pabelDefaultAttributes = this.#filesService.getConfigurationObjectFromFileExtrictlyCorrespondingToTheCurrentContext(
            this.#pagesFileName,
            this.#defaultAttributesHierarchy
        );
        outcome = pabelDefaultAttributes;
        return outcome;
    }

    getAllPagesAvailablesForTheCurrentContext() {
        let outcome = null;
        const allPages = this.#filesService.getConfigurationObjectFromFileBelongingToTheCurrentContext(
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
        outcome = this.#filesService.saveConfigurationObjectInFileExtrictlyInTheCurrentContext(
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

        outcome = this.#filesService.updateConfigurationObjectInFileExtrictlyInTheCurrentContext(
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

        outcome = this.#filesService.deleteConfigurationObjectInFileExtrictlyInTheCurrentContext(
            pageName,
            this.#pagesFileName,
            this.#pagesHierarchy
        );

        return outcome;
    }
}

const instance = PagesManager.getInstance();
export { PagesManager as PagesManager, instance as default };
