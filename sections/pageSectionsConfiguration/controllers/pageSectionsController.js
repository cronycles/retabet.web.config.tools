import { PageSectionsManager } from "../managers/pageSectionsManager.js";

class PageSectionsController {
    #pageSectionsManager;

    constructor() {
        this.#pageSectionsManager = PageSectionsManager;
    }

    getAllPages(req, res) {
        const outcome = this.#pageSectionsManager.getAllPages();
        res.json(outcome || {});
    }

    getPageSections(req, res) {
        try {
            const pageInvariantNamesObj = this.#pageSectionsManager.getPageInvariantNamesObjectFromFile();

            res.json(pageInvariantNamesObj || {});
        } catch (error) {
            console.error("Error in getPageSections:", error);
            res.status(500).json({ error: "Failed to fetch page sections" });
        }
    }

    updatePageSectionsByPage(req, res) {
        var statusini = 200;
        const pageInvariantNamesObj = this.#pageSectionsManager.getPageInvariantNamesObjectFromFile();
        const pageName = req.params.pageName;
        const { action, panelName, sectionName, attributes } = req.body;

        if (action === "addPanel") {
            if (!pageInvariantNamesObj[pageName][panelName]) {
                pageInvariantNamesObj[pageName][panelName] = [];
            } else {
                statusini = 403;
            }
        } else if (action === "removePanel") {
            delete pageInvariantNamesObj[pageName][panelName];

            // Remove the page if it has no panels left
            if (Object.keys(pageInvariantNamesObj[pageName]).length === 0) {
                delete pageInvariantNamesObj[pageName];
            }
        } else if (action === "addSection") {
            if (sectionName && attributes) {
                const panelSections = pageInvariantNamesObj[pageName][panelName] || [];
                panelSections.push({ [sectionName]: attributes });
                pageInvariantNamesObj[pageName][panelName] = panelSections;

                const newIndex = panelSections.length - 1; // Get the index of the newly added section

                this.#pageSectionsManager.savePageInvariantNamesObjectToFile(pageInvariantNamesObj);
                return res.status(statusini).json({ index: newIndex }); // Return the index
            } else {
                statusini = 400;
            }
        } else if (action === "removeSection") {
            if (sectionName && typeof req.body.position === "number") {
                const panelSections = pageInvariantNamesObj[pageName][panelName];
                if (panelSections[req.body.position]?.[sectionName]) {
                    panelSections.splice(req.body.position, 1); // Remove the section at the specified position
                } else {
                    statusini = 400; // Invalid position or section name
                }
            } else {
                statusini = 400;
            }
        } else if (action === "updateSection") {
            if (sectionName && attributes && typeof req.body.position === "number") {
                const panelSections = pageInvariantNamesObj[pageName][panelName];
                const sectionIndex = req.body.position; // Use the passed index
                if (panelSections[sectionIndex]?.[sectionName]) {
                    panelSections[sectionIndex][sectionName] = attributes; // Update the section at the specified index
                } else {
                    statusini = 400; // Invalid position or section name
                }
            } else {
                statusini = 400;
            }
        }
        this.#pageSectionsManager.savePageInvariantNamesObjectToFile(pageInvariantNamesObj);

        res.status(statusini).json(pageInvariantNamesObj[pageName]);
    }

    updateSectionsOrderInAPanelOfAPage(req, res) {
        let outcome = {
            status: 500,
            error: "Unknown error occured",
            message: "",
        };

        const { pageName, panelName } = req.params;
        const { order } = req.body;

        let updateOutput = this.#pageSectionsManager.updateSectionsOrderInAPanelOfAPage(pageName, panelName, order);

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
export default PageSectionsController;
