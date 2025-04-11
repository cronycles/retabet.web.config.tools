import PageSectionsViewManager from "../viewManagers/pageSectionsViewManager.js";

export default class PageSectionsController {
    #pageSectionsViewManager;

    constructor() {
        this.#pageSectionsViewManager = new PageSectionsViewManager();
    }

    getAllPages(req, res) {
        const outcome = this.#pageSectionsViewManager.getAvailablePages();
        res.json(outcome);
    }

    getAllPanels(req, res) {
        const outcome = this.#pageSectionsViewManager.getAvailablePanels();
        res.json(outcome);
    }

    getAllSections(req, res) {
        const outcome = this.#pageSectionsViewManager.getAvailableSections();
        res.json(outcome);
    }

    getPageSections(req, res) {
        const pageSectionsObj = this.#pageSectionsViewManager.getPageSections();
        res.json(pageSectionsObj);
    }

    updatePageSectionsByPage(req, res) {
        var statusini = 200;
        const { action, pageName, panelName, sectionName, attributes, position } = req.body;

        if (action === "addPanel") {
            if (!this.#pageSectionsViewManager.addPanelInPage(panelName, pageName)) {
                statusini = 403;
            }
        } else if (action === "removePanel") {
            if (!this.#pageSectionsViewManager.deletePanelFromPage(panelName, pageName)) {
                statusini = 403;
            }
        } else if (action === "addSection") {
            if (!this.#pageSectionsViewManager.addSectionToPanelOfPage(sectionName, attributes, panelName, pageName)) {
                statusini = 403;
            }
        } else if (action === "removeSection") {
            if (!this.#pageSectionsViewManager.deleteExistingSectionFromPanelOfPage(sectionName, position, panelName, pageName)) {
                statusini = 403;
            }
        } else if (action === "updateSection") {
            if (!this.#pageSectionsViewManager.updateExistingSectionFromPanelOfPage(sectionName, attributes, position, panelName, pageName)) {
                statusini = 403;
            }
        }
        res.status(statusini);
    }

    updateSectionsOrderInAPanelOfAPage(req, res) {
        let outcome = {
            status: 500,
            error: "Unknown error occured",
            message: "",
        };

        const { order, pageName, panelName } = req.body;

        let updateOutput = this.#pageSectionsViewManager.updateSectionsOrderInAPanelOfAPage(pageName, panelName, order);

        if (updateOutput.isOk) {
            outcome.status = 200;
            outcome.message = "Section order updated successfully";
        } else {
            if (updateOutput.errorType == "NOT_FOUND") {
                outcome.status = 404;
                outcome.error = "Page or panel not found";
            }
        }

        return res.status(outcome.status).json({ error: outcome.error, message: outcome.message });
    }
}
