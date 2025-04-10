import ConfigurationFilesOperationsManager from "../configurationFilesOperationsManager.js";

export default class SectionsManager {
    #sectionsFileName = "sections.config.json";
    #sectionsHierarchy = ["Sections"];
    #defaultAttributesHierarchy = ["DefaultSectionAttributes"];

    #filesOperationsManager;

    constructor() {
        if (SectionsManager.instance) {
            return SectionsManager.instance;
        }
        this.#filesOperationsManager = new ConfigurationFilesOperationsManager();

        SectionsManager.instance = this;
    }

    getAllSectionsInTheCurrentContextForEditingPurpose() {
        let outcome = null;
        const allSections = this.#filesOperationsManager.getConfigurationObjectFromFileExtrictlyCorrespondingToTheCurrentContext(
            this.#sectionsFileName,
            this.#sectionsHierarchy
        );
        outcome = allSections;
        return outcome;
    }

    getAllPanelsAvailablesForTheCurrentContext() {
        let outcome = null;
        const allSections = this.#filesOperationsManager.getConfigurationObjectFromFileBelongingToTheCurrentContext(
            this.#sectionsFileName,
            this.#sectionsHierarchy
        );
        outcome = allSections;
        return outcome;
    }

    getSectionsDefaultAttributesInTheCurrentContext() {
        let outcome = null;
        const pabelDefaultAttributes = this.#filesOperationsManager.getConfigurationObjectFromFileExtrictlyCorrespondingToTheCurrentContext(
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
        outcome = this.#filesOperationsManager.saveConfigurationObjectInFileExtrictlyInTheCurrentContext(
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

        outcome = this.#filesOperationsManager.updateConfigurationObjectInFileExtrictlyInTheCurrentContext(
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

        outcome = this.#filesOperationsManager.deleteConfigurationObjectInFileExtrictlyInTheCurrentContext(
            sectionName,
            this.#sectionsFileName,
            this.#sectionsHierarchy
        );

        return outcome;
    }
}
