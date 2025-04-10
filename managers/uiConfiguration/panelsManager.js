import { ConfigurationFilesManagerInTheCurrentContext } from "../../managers/configurationFilesManagerInTheCurrentContext.js";

class PanelsManager {
    static #instance = null;

    #filesManagerInTheCurrentContext = ConfigurationFilesManagerInTheCurrentContext;

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
        const allPanels = this.#filesManagerInTheCurrentContext.getConfigurationObjectFromFileExtrictlyCorrespondingToTheCurrentContext(
            this.#panelsFileName,
            this.#panelsHierarchy
        );
        outcome = allPanels;
        return outcome;
    }

    getPanelsDefaultAttributesInTheCurrentContext() {
        let outcome = null;
        const pabelDefaultAttributes = this.#filesManagerInTheCurrentContext.getConfigurationObjectFromFileExtrictlyCorrespondingToTheCurrentContext(
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
        outcome = this.#filesManagerInTheCurrentContext.saveConfigurationObjectInFileExtrictlyInTheCurrentContext(
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

        outcome = this.#filesManagerInTheCurrentContext.updateConfigurationObjectInFileExtrictlyInTheCurrentContext(
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

        outcome = this.#filesManagerInTheCurrentContext.deleteConfigurationObjectInFileExtrictlyInTheCurrentContext(
            panelName,
            this.#panelsFileName,
            this.#panelsHierarchy
        );

        return outcome;
    }
}

const instance = PanelsManager.getInstance();
export { PanelsManager as PanelsManager, instance as default };
