import { ConfigurationFilesService } from "../configurationFilesService.js";

class SectionsManager {
    static #instance = null;

    #filesService = ConfigurationFilesService;

    #sectionsFileName = "sections.config.json";
    #sectionsHierarchy = ["Sections"];
    #defaultAttributesHierarchy = ["DefaultSectionAttributes"];

    static getInstance() {
        if (!SectionsManager.#instance) {
            SectionsManager.#instance = new SectionsManager();
        }
        return SectionsManager.#instance;
    }

    getAllSectionsInTheCurrentContextForEditingPurpose() {
        let outcome = null;
        const allSections = this.#filesService.getConfigurationObjectFromFileExtrictlyCorrespondingToTheCurrentContext(
            this.#sectionsFileName,
            this.#sectionsHierarchy
        );
        outcome = allSections;
        return outcome;
    }

    getAllPanelsAvailablesForTheCurrentContext() {
        let outcome = null;
        const allSections = this.#filesService.getConfigurationObjectFromFileBelongingToTheCurrentContext(
            this.#sectionsFileName,
            this.#sectionsHierarchy
        );
        outcome = allSections;
        return outcome;
    }

    getSectionsDefaultAttributesInTheCurrentContext() {
        let outcome = null;
        const pabelDefaultAttributes = this.#filesService.getConfigurationObjectFromFileExtrictlyCorrespondingToTheCurrentContext(
            this.#sectionsFileName,
            this.#defaultAttributesHierarchy
        );
        outcome = pabelDefaultAttributes;
        return outcome;
    }

    addNewSectionInTheCurrentContext(sectionName, attributes) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };
        outcome = this.#filesService.saveConfigurationObjectInFileExtrictlyInTheCurrentContext(
            sectionName,
            attributes,
            this.#sectionsHierarchy,
            this.#sectionsFileName
        );

        return outcome;
    }

    updateExistingSectionInTheCurrentContext(sectionName, attributes) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };

        outcome = this.#filesService.updateConfigurationObjectInFileExtrictlyInTheCurrentContext(
            sectionName,
            attributes,
            this.#sectionsFileName,
            this.#sectionsHierarchy
        );

        return outcome;
    }

    deleteExistingSectionInTheCurrentContext(sectionName) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };

        outcome = this.#filesService.deleteConfigurationObjectInFileExtrictlyInTheCurrentContext(
            sectionName,
            this.#sectionsFileName,
            this.#sectionsHierarchy
        );

        return outcome;
    }
}

const instance = SectionsManager.getInstance();
export { SectionsManager as SectionsManager, instance as default };
