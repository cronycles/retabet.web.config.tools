import SectionsViewManager from "../viewManagers/sectionsViewManager.js";

export default class SectionsController {
    #sectionsViewManager;

    constructor() {
        this.#sectionsViewManager = new SectionsViewManager();
    }

    // Handlers for sections.config.json
    getSections(req, res) {
        const outcome = this.#sectionsViewManager.getAllSections();
        res.json(outcome || {});
    }

    getSectionDefaultAttributes(req, res) {
        const outcome = this.#sectionsViewManager.getSectionDefaultAttributes();
        res.json(outcome || {});
    }

    addSection(req, res) {
        let outcome = {
            status: 500,
            error: "Unknown error occured",
            message: "",
        };

        const { sectionName, attributes } = req.body;

        let updateOutput = this.#sectionsViewManager.addSection(sectionName, attributes);

        if (updateOutput.isOk) {
            outcome.status = 201;
            outcome.message = "Section added successfully";
        } else {
            if (updateOutput.errorType == "ALREADY_EXISTS") {
                outcome.status = 400;
                outcome.error = "Section already exists";
            }
        }

        return res.status(outcome.status).json({ error: outcome.error, message: outcome.message });
    }

    updateSection(req, res) {
        let outcome = {
            status: 500,
            error: "Unknown error occured",
            message: "",
        };
        const { sectionName, attributes } = req.body;

        let updateOutput = this.#sectionsViewManager.updateSection(sectionName, attributes);

        if (updateOutput.isOk) {
            outcome.status = 201;
            outcome.message = "Section updated successfully";
        } else {
            if (updateOutput.errorType == "NOT_FOUND") {
                outcome.status = 404;
                outcome.error = "Section not found";
            } else {
                if (updateOutput.errorType == "ALREADY_EXISTS") {
                    outcome.status = 400;
                    outcome.error = "Section already exists";
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

        const { sectionName } = req.body;
        let updateOutput = this.#sectionsViewManager.deleteSection(sectionName);

        if (updateOutput.isOk) {
            outcome.status = 204;
            outcome.message = "Section deleted successfully";
        } else {
            if (updateOutput.errorType == "NOT_FOUND") {
                outcome.status = 404;
                outcome.error = "Section not found";
            }
        }

        return res.status(outcome.status).json({ error: outcome.error, message: outcome.message });
    }
}
