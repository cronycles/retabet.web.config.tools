import { ConfigurationFilesManagerInTheCurrentContext } from "../../../managers/configurationFilesManagerInTheCurrentContext.js";

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

    getAllPanels() {
        let outcome = null;
        const allPanels = this.#filesManagerInTheCurrentContext.getConfigurationObjectFromFileExtrictlyCorrespondingToTheCurrentContext(
            this.#panelsFileName,
            this.#panelsHierarchy
        );
        outcome = allPanels;
        return outcome;
    }

    getPanelDefaultAttributes() {
        let outcome = null;
        const pabelDefaultAttributes = this.#filesManagerInTheCurrentContext.getConfigurationObjectFromFileExtrictlyCorrespondingToTheCurrentContext(
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

        let newObject = { [panelName]: attributes };
        outcome = this.#filesManagerInTheCurrentContext.saveConfigurationObjectInFileExtrictlyInTheCurrentContext(
            newObject,
            this.#panelsFileName,
            this.#panelsHierarchy
        );

        return outcome;
    }

    updatePanel(panelName, attributes, oldPanelName) {
        let outcome = {
            isOk: false,
            errorType: "UNKNOWN",
        };

        const allPanelsObj = this.#filesManagerInTheCurrentContext.getConfigurationObjectFromFileInTheCurrentContext(
            this.#panelsFileName,
            this.#panelsHierarchy
        );

        if (!allPanelsObj[oldPanelName]) {
            outcome.errorType = "NOT_FOUND";
        } else {
            if (panelName !== oldPanelName && allPanelsObj[panelName]) {
                outcome.errorType = "ALREADY_EXISTS";
            } else {
                const updatedPanelsObj = this.#filesManagerInTheCurrentContext.findJsonObjectByNameAndUpdateIt(
                    allPanelsObj,
                    panelName,
                    oldPanelName,
                    attributes
                );

                this.#filesManagerInTheCurrentContext.saveConfigurationObjectInFileInTheCurrentContext(
                    updatedPanelsObj,
                    this.#panelsFileName,
                    this.#panelsHierarchy
                );
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

        const allPanelsObj = this.#filesManagerInTheCurrentContext.getConfigurationObjectFromFileInTheCurrentContext(
            this.#panelsFileName,
            this.#panelsHierarchy
        );

        if (!allPanelsObj[panelName]) {
            outcome.errorType = "NOT_FOUND";
        } else {
            delete allPanelsObj[panelName];
            this.#filesManagerInTheCurrentContext.saveConfigurationObjectInFileInTheCurrentContext(
                allPanelsObj,
                this.#panelsFileName,
                this.#panelsHierarchy
            );
            outcome.isOk = true;
        }

        return outcome;
    }
}

const instance = PanelsManager.getInstance();
export { PanelsManager, instance as default };
