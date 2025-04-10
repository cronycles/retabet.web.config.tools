import { ConfigurationFilesService } from "../../managers/configurationFilesService.js";

class PanelsManager {
    static #instance = null;

    #filesService = ConfigurationFilesService;

    #panelsFileName = "panels.config.json";
    #panelsHierarchy = ["Panels"];
    #defaultAttributesHierarchy = ["DefaultPanelAttributes"];

    static getInstance() {
        if (!PanelsManager.#instance) {
            PanelsManager.#instance = new PanelsManager();
        }
        return PanelsManager.#instance;
    }

    getAllPanelsInTheCurrentContextForEditingPurpose() {
        let outcome = null;
        const allPanels = this.#filesService.getConfigurationObjectFromFileExtrictlyCorrespondingToTheCurrentContext(
            this.#panelsFileName,
            this.#panelsHierarchy
        );
        outcome = allPanels;
        return outcome;
    }

    getAllPanelsAvailablesForTheCurrentContext() {
        let outcome = null;
        const allPanels = this.#filesService.getConfigurationObjectFromFileBelongingToTheCurrentContext(
            this.#panelsFileName,
            this.#panelsHierarchy
        );
        outcome = allPanels;
        return outcome;
    }

    getPanelsDefaultAttributesInTheCurrentContext() {
        let outcome = null;
        const pabelDefaultAttributes = this.#filesService.getConfigurationObjectFromFileExtrictlyCorrespondingToTheCurrentContext(
            this.#panelsFileName,
            this.#defaultAttributesHierarchy
        );
        outcome = pabelDefaultAttributes;
        return outcome;
    }

    addNewPanelInTheCurrentContext(panelName, attributes) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };
        outcome = this.#filesService.saveConfigurationObjectInFileExtrictlyInTheCurrentContext(
            panelName,
            attributes,
            this.#panelsHierarchy,
            this.#panelsFileName
        );

        return outcome;
    }

    updateExistingPanelInTheCurrentContext(panelName, attributes) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };

        outcome = this.#filesService.updateConfigurationObjectInFileExtrictlyInTheCurrentContext(
            panelName,
            attributes,
            this.#panelsFileName,
            this.#panelsHierarchy
        );

        return outcome;
    }

    deleteExistingPanelInTheCurrentContext(panelName) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };

        outcome = this.#filesService.deleteConfigurationObjectInFileExtrictlyInTheCurrentContext(
            panelName,
            this.#panelsFileName,
            this.#panelsHierarchy
        );

        return outcome;
    }
}

const instance = PanelsManager.getInstance();
export { PanelsManager as PanelsManager, instance as default };
