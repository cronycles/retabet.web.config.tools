import PanelsViewManager from "../viewManagers/panelsViewManager.js";

export default class PanelsController {
    #panelsViewManager;

    constructor() {
        this.#panelsViewManager = new PanelsViewManager();
    }

    getPanels(req, res) {
        const outcome = this.#panelsViewManager.getAllPanels();
        res.json(outcome || {});
    }

    getPanelDefaultAttributes(req, res) {
        const outcome = this.#panelsViewManager.getPanelDefaultAttributes();
        res.json(outcome || {});
    }

    addPanel(req, res) {
        let outcome = {
            status: 500,
            error: "Unknown error occured",
            message: "",
        };

        const { panelName, attributes } = req.body;

        let updateOutput = this.#panelsViewManager.addPanel(panelName, attributes);

        if (updateOutput.isOk) {
            outcome.status = 201;
            outcome.message = "Panel added successfully";
        } else {
            if (updateOutput.errorType == "ALREADY_EXISTS") {
                outcome.status = 400;
                outcome.error = "Panel already exists";
            }
        }

        return res.status(outcome.status).json({ error: outcome.error, message: outcome.message });
    }

    updatePanel(req, res) {
        let outcome = {
            status: 500,
            error: "Unknown error occured",
            message: "",
        };
        const { panelName, attributes, oldPanelName } = req.body;

        let updateOutput = this.#panelsViewManager.updatePanel(panelName, attributes, oldPanelName);

        if (updateOutput.isOk) {
            outcome.status = 201;
            outcome.message = "Panel updated successfully";
        } else {
            if (updateOutput.errorType == "NOT_FOUND") {
                outcome.status = 404;
                outcome.error = "Panel not found";
            } else {
                if (updateOutput.errorType == "ALREADY_EXISTS") {
                    outcome.status = 400;
                    outcome.error = "Panel already exists";
                }
            }
        }
        return res.status(outcome.status).json({ error: outcome.error, message: outcome.message });
    }

    deletePanel(req, res) {
        let outcome = {
            status: 500,
            error: "Unknown error occured",
            message: "",
        };

        const panelName = req.params.panelName;
        let updateOutput = this.#panelsViewManager.deletePanel(panelName);

        if (updateOutput.isOk) {
            outcome.status = 204;
            outcome.message = "Panel deleted successfully";
        } else {
            if (updateOutput.errorType == "NOT_FOUND") {
                outcome.status = 404;
                outcome.error = "Panel not found";
            }
        }

        return res.status(outcome.status).json({ error: outcome.error, message: outcome.message });
    }
}
