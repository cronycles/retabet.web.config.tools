import SectionsManager from "../managers/sectionsManager.js";

class SectionsController {
    #sectionsManager;

    constructor() {
        this.#sectionsManager = SectionsManager;
    }

    // Handlers for sections.config.json
    getSections(req, res) {
        const outcome = this.#sectionsManager.getAllSections();
        res.json(outcome || {});
    }

    getSectionDefaultAttributes(req, res) {
        const outcome = this.#sectionsManager.getSectionDefaultAttributes();
        res.json(outcome || {});
    }

    addSection(req, res) {
        let outcome = {
            status: 500,
            error: "Unknown error occured",
            message: "",
        };

        const { sectionName, attributes } = req.body;

        let updateOutput = this.#sectionsManager.addSection(sectionName, attributes);

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
        const { sectionName, attributes, oldSectionName } = req.body;

        let updateOutput = this.#sectionsManager.updateSection(sectionName, attributes, oldSectionName);

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
}
export default SectionsController;
