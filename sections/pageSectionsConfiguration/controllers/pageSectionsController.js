import fs from "fs";
import path from "path";
import JSON5 from "json5"; 
import { fileURLToPath } from "url"; 
import ConfigurationFilesManager from "../../../managers/configurationFilesManager.js";
import ConfigurationContextManager from "../../../managers/configurationContextManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PageSectionsController {
    #filesManager;
    #contextManager;

    #pageSectionsPath;

    constructor() {
        this.#filesManager = ConfigurationFilesManager;
        this.#contextManager = ConfigurationContextManager;
        this.#pageSectionsPath = path.join(__dirname, "../../../data/pageSections.config.json");
    }

    getPageSections = (req, res) => {
        try {
            var selectedPageSection = this.#getEntireContextJsonFromFile(this.#pageSectionsPath);

            res.json(selectedPageSection?.Configuration?.PageSections_CONF?.PageInvariantNames || {});
        } catch (error) {
            console.error("Error in getPageSections:", error);
            res.status(500).json({ error: "Failed to fetch page sections" });
        }
    };

    updatePage = (req, res) => {
        var statusini = 200;
        const pageInvariantNamesObj = this.#filesManager.getConfigurationObjectFromFileInTheCurrentContext(
            this.#pageSectionsPath,
            ["PageInvariantNames"]
        );
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
        this.#filesManager.saveConfigurationObjectInFileInTheCurrentContext(pageInvariantNamesObj, this.#pageSectionsPath, [
            "PageInvariantNames",
        ]);
        res.status(statusini).json(pageInvariantNamesObj[pageName]);
    };

    deletePage = (req, res) => {
        const pages = readJSON(this.#pageSectionsPath); // Use updated readJSON
        const pageName = req.params.pageName;

        const filteredPages = pages.filter(page => !page.Configuration.PageSections_CONF.PageInvariantNames[pageName]);
        if (filteredPages.length === pages.length) {
            return res.status(404).json({ error: "Page not found" });
        }

        writeJSON(this.#pageSectionsPath, filteredPages);
        res.status(204).send();
    };

    #getKeysAndValueContextStringByEntireContext(jsonContext) {
        return Object.entries(jsonContext)
            .filter(([key]) => key !== "Configuration")
            .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
            .join(", ");
    }

    #getEntireContextJsonFromFile(filePath) {
        var jsonFile = this.#readJSON(filePath);
        let outcome = jsonFile[0]; // Default to the first context
        const selectedContextString = this.#contextManager.getCurrentContext() || "";
        for (const context of jsonFile) {
            const contextString = this.#getKeysAndValueContextStringByEntireContext(context);
            if (contextString === selectedContextString) {
                outcome = context;
                break;
            }
        }

        return outcome;
    }

    #readJSON(filePath) {
        try {
            return JSON5.parse(fs.readFileSync(filePath, "utf8")); // Use JSON5 for parsing
        } catch (error) {
            console.error(`Error reading JSON file at ${filePath}:`, error);
            throw error;
        }
    };
    
}
export default PageSectionsController;
