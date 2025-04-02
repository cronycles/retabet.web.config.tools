import ConfigurationFilesManager from "../../../managers/configurationFilesManager.js";

class PanelsManager {
    static #instance = null;
    #filesManager = ConfigurationFilesManager;

    #panelsFileName = "panels.config.json";
    #panelsHierarchy = ["Panels"];
    #defaultAttributesHierarchy = ["DefaultPanelAttributes"];

    static getInstance() {
        if (!PanelsManager.#instance) {
            PanelsManager.#instance = new PanelsManager();
        }
        return PanelsManager.#instance;
    }

    getAllPanels() {
        let outcome = null;
        const allPanels = this.#filesManager.getConfigurationObjectFromFileInTheCurrentContext(this.#panelsFileName, this.#panelsHierarchy);
        outcome = allPanels;
        return outcome;
    }

    getPanelDefaultAttributes() {
        let outcome = null;
        const pabelDefaultAttributes = this.#filesManager.getConfigurationObjectFromFileInTheCurrentContext(
            this.#panelsFileName,
            this.#defaultAttributesHierarchy
        );
        outcome = pabelDefaultAttributes;
        return outcome;
    }

    addPanel(panelName, attributes) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };

        const allPanelsObj = this.#filesManager.getConfigurationObjectFromFileInTheCurrentContext(this.#panelsFileName, this.#panelsHierarchy);

        if (allPanelsObj[panelName]) {
            outcome.errorType = "ALREADY_EXISTS";
        } else {
            allPanelsObj[panelName] = attributes;
            this.#filesManager.saveConfigurationObjectInFileInTheCurrentContext(allPanelsObj, this.#panelsFileName, this.#panelsHierarchy);
            outcome.isOk = true;
        }

        return outcome;
    }

    updatePanel(panelName, attributes, oldPanelName) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };

        const allPanelsObj = this.#filesManager.getConfigurationObjectFromFileInTheCurrentContext(this.#panelsFileName, this.#panelsHierarchy);

        if (!allPanelsObj[oldPanelName]) {
            outcome.errorType = "NOT_FOUND";
        } else {
            if (panelName !== oldPanelName && allPanelsObj[panelName]) {
                outcome.errorType = "ALREADY_EXISTS";
            } else {
                const updatedPanelsObj = this.#filesManager.findJsonObjectByNameAndUpdateIt(allPanelsObj, panelName, oldPanelName, attributes);

                this.#filesManager.saveConfigurationObjectInFileInTheCurrentContext(updatedPanelsObj, this.#panelsFileName, this.#panelsHierarchy);
                outcome.isOk = true;
            }
        }

        return outcome;
    }

    deletePanel(panelName) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };

        const allPanelsObj = this.#filesManager.getConfigurationObjectFromFileInTheCurrentContext(this.#panelsFileName, this.#panelsHierarchy);

        if (!allPanelsObj[panelName]) {
            outcome.errorType = "NOT_FOUND";
        } else {
            delete allPanelsObj[panelName];
            this.#filesManager.saveConfigurationObjectInFileInTheCurrentContext(allPanelsObj, this.#panelsFileName, this.#panelsHierarchy);
            outcome.isOk = true;
        }

        return outcome;
    }
}
export default PanelsManager.getInstance();
