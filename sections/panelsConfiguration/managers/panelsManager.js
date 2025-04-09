import ConfigurationFilesContextManager from "../../../managers/configurationFilesContextManager.js";

class PanelsManager {
    static #instance = null;
    #filesContextManager = ConfigurationFilesContextManager;

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
        const allPanels = this.#filesContextManager.getConfigurationObjectFromFileExtrictlyCorrespondingToTheCurrentContext(
            this.#panelsFileName,
            this.#panelsHierarchy
        );
        outcome = allPanels;
        return outcome;
    }

    getPanelDefaultAttributes() {
        let outcome = null;
        const pabelDefaultAttributes = this.#filesContextManager.getConfigurationObjectFromFileExtrictlyCorrespondingToTheCurrentContext(
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

        const isPresent = this.#filesContextManager.isConfigurationKeyAlreadyPresentInTheCurrentContextOfTheFile(
            panelName,
            this.#panelsFileName,
            this.#panelsHierarchy
        );

        if (isPresent) {
            outcome.errorType = "ALREADY_EXISTS";
        } else {
            let newObject = { [panelName]: attributes };
            this.#filesContextManager.saveConfigurationObjectInFileExtrictlyInTheCurrentContext(newObject, this.#panelsFileName, this.#panelsHierarchy);
            outcome.isOk = true;
        }

        return outcome;
    }

    updatePanel(panelName, attributes, oldPanelName) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };

        const allPanelsObj = this.#filesContextManager.getConfigurationObjectFromFileInTheCurrentContext(this.#panelsFileName, this.#panelsHierarchy);

        if (!allPanelsObj[oldPanelName]) {
            outcome.errorType = "NOT_FOUND";
        } else {
            if (panelName !== oldPanelName && allPanelsObj[panelName]) {
                outcome.errorType = "ALREADY_EXISTS";
            } else {
                const updatedPanelsObj = this.#filesContextManager.findJsonObjectByNameAndUpdateIt(allPanelsObj, panelName, oldPanelName, attributes);

                this.#filesContextManager.saveConfigurationObjectInFileInTheCurrentContext(updatedPanelsObj, this.#panelsFileName, this.#panelsHierarchy);
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

        const allPanelsObj = this.#filesContextManager.getConfigurationObjectFromFileInTheCurrentContext(this.#panelsFileName, this.#panelsHierarchy);

        if (!allPanelsObj[panelName]) {
            outcome.errorType = "NOT_FOUND";
        } else {
            delete allPanelsObj[panelName];
            this.#filesContextManager.saveConfigurationObjectInFileInTheCurrentContext(allPanelsObj, this.#panelsFileName, this.#panelsHierarchy);
            outcome.isOk = true;
        }

        return outcome;
    }
}
export default PanelsManager.getInstance();
