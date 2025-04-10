import { PagesViewManager } from "../viewManagers/pagesViewManager.js";

class PagesController {
    #pagesViewManager;

    constructor() {
        this.#pagesViewManager = PagesViewManager;
    }

    getPages(req, res) {
        const outcome = this.#pagesViewManager.getAllPages();
        res.json(outcome || {});
    }

    getPageDefaultAttributes(req, res) {
        const outcome = this.#pagesViewManager.getPageDefaultAttributes();
        res.json(outcome || {});
    }

    addPage(req, res) {
        let outcome = {
            status: 500,
            error: "Unknown error occured",
            message: "",
        };

        const { pageName, attributes } = req.body;

        let updateOutput = this.#pagesViewManager.addPage(pageName, attributes);

        if (updateOutput.isOk) {
            outcome.status = 201;
            outcome.message = "Page added successfully";
        } else {
            if (updateOutput.errorType == "ALREADY_EXISTS") {
                outcome.status = 400;
                outcome.error = "Page already exists";
            }
        }

        return res.status(outcome.status).json({ error: outcome.error, message: outcome.message });
    }

    updatePage(req, res) {
        let outcome = {
            status: 500,
            error: "Unknown error occured",
            message: "",
        };
        const { pageName, attributes, oldPageName } = req.body;

        let updateOutput = this.#pagesViewManager.updatePage(pageName, attributes, oldPageName);

        if (updateOutput.isOk) {
            outcome.status = 201;
            outcome.message = "Page updated successfully";
        } else {
            if (updateOutput.errorType == "NOT_FOUND") {
                outcome.status = 404;
                outcome.error = "Page not found";
            } else {
                if (updateOutput.errorType == "ALREADY_EXISTS") {
                    outcome.status = 400;
                    outcome.error = "Page already exists";
                }
            }
        }
        return res.status(outcome.status).json({ error: outcome.error, message: outcome.message });
    }

    deletePage(req, res) {
        let outcome = {
            status: 500,
            error: "Unknown error occured",
            message: "",
        };

        const pageName = req.params.pageName;
        let updateOutput = this.#pagesViewManager.deletePage(pageName);

        if (updateOutput.isOk) {
            outcome.status = 204;
            outcome.message = "Page deleted successfully";
        } else {
            if (updateOutput.errorType == "NOT_FOUND") {
                outcome.status = 404;
                outcome.error = "Page not found";
            }
        }

        return res.status(outcome.status).json({ error: outcome.error, message: outcome.message });
    }
}
export default PagesController;
