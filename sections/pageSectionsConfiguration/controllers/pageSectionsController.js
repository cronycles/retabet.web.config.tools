import ConfigurationFilesManager from "../../../managers/configurationFilesManager.js";

class PageSectionsController {
    #filesManager;

    #pageSectionsFileName;

    constructor() {
        this.#filesManager = ConfigurationFilesManager;
        this.#pageSectionsFileName = "pageSections.config.json";
    }

    getPageSections(req, res) {
        try {
            const pageInvariantNamesObj = this.#filesManager.getConfigurationObjectFromFileInTheCurrentContext(this.#pageSectionsFileName, [
                "PageInvariantNames",
            ]);

            res.json(pageInvariantNamesObj || {});
        } catch (error) {
            console.error("Error in getPageSections:", error);
            res.status(500).json({ error: "Failed to fetch page sections" });
        }
    }

    updatePage(req, res) {
        var statusini = 200;
        const pageInvariantNamesObj = this.#filesManager.getConfigurationObjectFromFileInTheCurrentContext(this.#pageSectionsFileName, ["PageInvariantNames"]);
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
            } else {
                statusini = 400;
            }
        } else if (action === "removeSection") {
            if (sectionName) {
                const panelSections = pageInvariantNamesObj[pageName][panelName];
                pageInvariantNamesObj[pageName][panelName] = panelSections.filter(section => !section[sectionName]);
            } else {
                statusini = 400;
            }
        } else if (action === "updateSection") {
            if (sectionName && attributes) {
                const panelSections = pageInvariantNamesObj[pageName][panelName];
                const sectionIndex = panelSections.findIndex(section => section[sectionName]);
                if (sectionIndex !== -1) {
                    panelSections[sectionIndex][sectionName] = attributes;
                }
            } else {
                statusini = 400;
            }
        }
        this.#filesManager.saveConfigurationObjectInFileInTheCurrentContext(pageInvariantNamesObj, this.#pageSectionsFileName, ["PageInvariantNames"]);
        res.status(statusini).json(pageInvariantNamesObj[pageName]);
    }

}
export default PageSectionsController;
