import ConfigurationFilesManager from "../../../managers/configurationFilesManager.js";

class PageSectionsController {
    #filesManager;

    #pageSectionsFileName;
    #pageInvariantNameHierarchy;

    constructor() {
        this.#filesManager = ConfigurationFilesManager;
        this.#pageSectionsFileName = "pageSections.config.json";
        this.#pageInvariantNameHierarchy = ["PageInvariantNames"];
    }

    getPageSections(req, res) {
        try {
            const pageInvariantNamesObj = this.#getPageInvariantNamesObjectFromFile();

            res.json(pageInvariantNamesObj || {});
        } catch (error) {
            console.error("Error in getPageSections:", error);
            res.status(500).json({ error: "Failed to fetch page sections" });
        }
    }

    updatePage(req, res) {
        var statusini = 200;
        const pageInvariantNamesObj = this.#getPageInvariantNamesObjectFromFile();
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

                this.#savePageInvariantNamesObjectToFile(pageInvariantNamesObj);
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
        this.#savePageInvariantNamesObjectToFile(pageInvariantNamesObj);

        res.status(statusini).json(pageInvariantNamesObj[pageName]);
    }

    #getPageInvariantNamesObjectFromFile() {
        return this.#filesManager.getConfigurationObjectFromFileInTheCurrentContext(this.#pageSectionsFileName, this.#pageInvariantNameHierarchy);
    }

    #savePageInvariantNamesObjectToFile(pageInvariantNamesObj) {
        this.#filesManager.saveConfigurationObjectInFileInTheCurrentContext(
            pageInvariantNamesObj,
            this.#pageSectionsFileName,
            this.#pageInvariantNameHierarchy
        );
    }
}
export default PageSectionsController;
