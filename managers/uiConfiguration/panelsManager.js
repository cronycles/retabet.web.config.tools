import ConfigurationFilesOperationsManager from "../configuration/configurationFilesOperationsManager.js";

export default class PanelsManager {
    #panelsFileName = "panels.config.json";
    #panelsHierarchy = ["Panels_CONF", "Panels"];
    #defaultAttributesHierarchy = ["Panels_CONF", "DefaultPanelAttributes"];

    #filesOperationsManager;

    constructor() {
        if (PanelsManager.instance) {
            return PanelsManager.instance;
        }
        this.#filesOperationsManager = new ConfigurationFilesOperationsManager();

        PanelsManager.instance = this;
    }

    getAllPanelsInTheCurrentContextForEditingPurpose() {
        let outcome = null;
        const allPanels = this.#filesOperationsManager.getConfigurationObjectFromFileExtrictlyCorrespondingToTheCurrentContext(this.#panelsFileName, this.#panelsHierarchy);
        outcome = allPanels;
        return outcome;
    }

    getAllPanelsAvailablesForTheCurrentContext() {
        let outcome = null;
        const allPanels = this.#filesOperationsManager.getConfigurationObjectFromFileBelongingToTheCurrentContext(this.#panelsFileName, this.#panelsHierarchy);
        outcome = allPanels;
        return outcome;
    }

    getPanelsDefaultAttributesInTheCurrentContext() {
        let outcome = null;
        const pabelDefaultAttributes = this.#filesOperationsManager.getConfigurationObjectFromFileExtrictlyCorrespondingToTheCurrentContext(
            this.#panelsFileName,
            this.#defaultAttributesHierarchy
        );
        outcome = pabelDefaultAttributes;
        return outcome;
    }

    getPanelsDefaultAttributesBelongingToTheCurrentContext() {
        let outcome = null;
        const pabelDefaultAttributes = this.#filesOperationsManager.getConfigurationObjectFromFileBelongingToTheCurrentContext(
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
        outcome = this.#filesOperationsManager.saveConfigurationObjectInFileExtrictlyInTheCurrentContext(panelName, attributes, this.#panelsHierarchy, this.#panelsFileName);

        return outcome;
    }

    updateExistingPanelInTheCurrentContext(panelName, attributes) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };

        outcome = this.#filesOperationsManager.updateConfigurationObjectInFileExtrictlyInTheCurrentContext(panelName, attributes, this.#panelsFileName, this.#panelsHierarchy);

        return outcome;
    }

    deleteExistingPanelInTheCurrentContext(panelName) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };

        outcome = this.#filesOperationsManager.deleteConfigurationObjectInFileExtrictlyInTheCurrentContext(panelName, this.#panelsFileName, this.#panelsHierarchy);

        return outcome;
    }
}
