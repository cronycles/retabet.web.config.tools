import { PanelsManager } from "../../../managers/uiConfiguration/panelsManager.js";

class PanelsViewManager {
    static #instance = null;

    #panelsManager = PanelsManager;

    static getInstance() {
        if (!PanelsViewManager.#instance) {
            PanelsViewManager.#instance = new PanelsViewManager();
        }
        return PanelsViewManager.#instance;
    }

    getAllPanels() {
        let outcome = null;
        const allPanels = this.#panelsManager.getAllPanelsInTheCurrentContextForEditingPurpose();
        outcome = allPanels;
        return outcome;
    }

    getPanelDefaultAttributes() {
        let outcome = null;
        const pabelDefaultAttributes = this.#panelsManager.getPanelsDefaultAttributesInTheCurrentContext();
        outcome = pabelDefaultAttributes;
        return outcome;
    }

    addPanel(panelName, attributes) {
        let outcome = this.#panelsManager.addNewPanelInTheCurrentContext(panelName, attributes);

        return outcome;
    }

    updatePanel(panelName, attributes, oldPanelName) {
        let outcome = this.#panelsManager.updateExistingPanelInTheCurrentContext(panelName, attributes, oldPanelName);

        return outcome;
    }

    deletePanel(panelName) {
        let outcome = this.#panelsManager.deleteExistingPanelInTheCurrentContext(panelName, attributes, oldPanelName);

        return outcome;
    }
}

const instance = PanelsViewManager.getInstance();
export { PanelsViewManager as PanelsManager, instance as default };
