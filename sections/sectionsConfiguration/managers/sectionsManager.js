import ConfigurationFilesManager from "../../../managers/configurationFilesManager.js";

class SectionsManager {
    static #instance = null;
    #filesManager = ConfigurationFilesManager;

    #sectionsFileName = "sections.config.json";
    #sectionsHierarchy = ["Sections"];
    #defaultAttributesHierarchy = ["DefaultSectionAttributes"];

    static getInstance() {
        if (!SectionsManager.#instance) {
            SectionsManager.#instance = new SectionsManager();
        }
        return SectionsManager.#instance;
    }

    getAllSections() {
        let outcome = null;
        const allSections = this.#filesManager.getConfigurationObjectFromFileInTheCurrentContext(this.#sectionsFileName, this.#sectionsHierarchy);
        outcome = allSections;
        return outcome;
    }

    getSectionDefaultAttributes() {
        let outcome = null;
        const sectionDefaultAttributes = this.#filesManager.getConfigurationObjectFromFileInTheCurrentContext(this.#sectionsFileName, this.#defaultAttributesHierarchy);
        outcome = sectionDefaultAttributes;
        return outcome;
    }

    addSection(sectionName, attributes) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };

        const allSectionsObj = this.#filesManager.getConfigurationObjectFromFileInTheCurrentContext(this.#sectionsFileName, this.#sectionsHierarchy);

        if (allSectionsObj[sectionName]) {
            outcome.errorType = "ALREADY_EXISTS";
        } else {
            allSectionsObj[sectionName] = attributes;
            this.#filesManager.saveConfigurationObjectInFileInTheCurrentContext(allSectionsObj, this.#sectionsFileName, this.#sectionsHierarchy);
            outcome.isOk = true;
        }

        return outcome;
    }

    updateSection(sectionName, attributes, oldSectionName) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };

        const allSectionsObj = this.#filesManager.getConfigurationObjectFromFileInTheCurrentContext(this.#sectionsFileName, this.#sectionsHierarchy);

        if (!allSectionsObj[oldSectionName]) {
            outcome.errorType = "NOT_FOUND";
        } else {
            if (sectionName !== oldSectionName && allSectionsObj[sectionName]) {
                outcome.errorType = "ALREADY_EXISTS";
            } else {
                if (sectionName !== oldSectionName) {
                    allSectionsObj[sectionName] = allSectionsObj[oldSectionName];
                    delete allSectionsObj[oldSectionName];
                }

                // Update the attributes
                allSectionsObj[sectionName] = attributes;
                this.#filesManager.saveConfigurationObjectInFileInTheCurrentContext(allSectionsObj, this.#sectionsFileName, this.#sectionsHierarchy);
                outcome.isOk = true;
            }
        }

        return outcome;
    }
}
export default SectionsManager.getInstance();
