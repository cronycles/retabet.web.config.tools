import PanelsManager from "../../../managers/uiConfiguration/panelsManager.js";

export default class PanelsViewManager {
    #panelsManager;

    constructor() {
        if (PanelsViewManager.instance) {
            return PanelsViewManager.instance;
        }
        this.#panelsManager = new PanelsManager();

        PanelsViewManager.instance = this;
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

    updatePanel(panelName, attributes) {
        let outcome = this.#panelsManager.updateExistingPanelInTheCurrentContext(panelName, attributes);

        return outcome;
    }

    deletePanel(panelName) {
        let outcome = this.#panelsManager.deleteExistingPanelInTheCurrentContext(panelName, attributes);

        return outcome;
    }
}
