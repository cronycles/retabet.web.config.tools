import SectionsManager from "../../../managers/uiConfiguration/sectionsManager.js";

export default class SectionsViewManager {
    #sectionsManager;

    constructor() {
        if (SectionsViewManager.instance) {
            return SectionsViewManager.instance;
        }
        this.#sectionsManager = new SectionsManager();
        SectionsViewManager.instance = this;
    }

    getAllSections() {
        let outcome = null;
        const allSections = this.#sectionsManager.getAllSectionsInTheCurrentContextForEditingPurpose();
        outcome = allSections;
        return outcome;
    }

    getSectionDefaultAttributes() {
        let outcome = null;
        const pabelDefaultAttributes = this.#sectionsManager.getSectionsDefaultAttributesInTheCurrentContext();
        outcome = pabelDefaultAttributes;
        return outcome;
    }

    addSection(sectionName, attributes) {
        let outcome = this.#sectionsManager.addNewSectionInTheCurrentContext(sectionName, attributes);

        return outcome;
    }

    updateSection(sectionName, attributes) {
        let outcome = this.#sectionsManager.updateExistingSectionInTheCurrentContext(sectionName, attributes);

        return outcome;
    }

    deleteSection(sectionName) {
        let outcome = this.#sectionsManager.deleteExistingSectionInTheCurrentContext(sectionName);

        return outcome;
    }
}
