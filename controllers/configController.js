import fs from "fs";
import path from "path";
import JSON5 from "json5"; // Import the json5 library
import { fileURLToPath } from "url"; // Importa fileURLToPath para convertir URLs a rutas de archivo
import ConfigurationFilesManager from "../managers/configurationFilesManager.js";
import ConfigurationContextManager from "../managers/configurationContextManager.js";

const filesManager = ConfigurationFilesManager;
const contextManager = ConfigurationContextManager;

// Convertir import.meta.url a una ruta de archivo válida
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File paths
const sectionsPath = path.join(__dirname, "../data/sections.config.json");
const panelsPath = path.join(__dirname, "../data/panels.config.json");
const pagesSectionsPath = path.join(__dirname, "../data/pageSections.config.json");
const pagesConfigPath = path.join(__dirname, "../data/pages.config.json");

// Utility to read JSON files
const readJSON = filePath => {
    try {
        return JSON5.parse(fs.readFileSync(filePath, "utf8")); // Use JSON5 for parsing
    } catch (error) {
        console.error(`Error reading JSON file at ${filePath}:`, error);
        throw error;
    }
};

// Utility to write JSON files
const writeJSON = (filePath, data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 4));

// Handlers for sections.config.json
const getSections = (req, res) => {
    const sections = readJSON(sectionsPath); // Use updated readJSON
    res.json(sections);
};

const addSection = (req, res) => {
    const sections = readJSON(sectionsPath); // Use updated readJSON
    const { sectionName, attributes } = req.body;

    if (sections[0].Configuration.Sections_CONF.Sections[sectionName]) {
        return res.status(400).json({ error: "Section already exists" });
    }

    sections[0].Configuration.Sections_CONF.Sections[sectionName] = attributes;
    writeJSON(sectionsPath, sections);
    res.status(201).json({ message: "Section added successfully" });
};

const updateSection = (req, res) => {
    const sections = readJSON(sectionsPath); // Use updated readJSON
    const { sectionName, attributes, oldSectionName } = req.body;

    if (!sections[0].Configuration.Sections_CONF.Sections[oldSectionName]) {
        return res.status(404).json({ error: "Section not found" });
    }

    if (sectionName !== oldSectionName && sections[0].Configuration.Sections_CONF.Sections[sectionName]) {
        return res.status(400).json({ error: "Section name already exists" });
    }

    // Rename the section if the name has changed
    if (sectionName !== oldSectionName) {
        sections[0].Configuration.Sections_CONF.Sections[sectionName] = sections[0].Configuration.Sections_CONF.Sections[oldSectionName];
        delete sections[0].Configuration.Sections_CONF.Sections[oldSectionName];
    }

    // Update the attributes
    sections[0].Configuration.Sections_CONF.Sections[sectionName] = attributes;
    writeJSON(sectionsPath, sections);
    res.json({ message: "Section updated successfully" });
};

// Handlers for pagePanels.json
const getPanels = (req, res) => {
    const panels = readJSON(panelsPath); // Use updated readJSON
    const panelsData = panels[0].Configuration.Panels_CONF.Panels; // Extract panels
    const defaultAttributes = panels[0].Configuration.Panels_CONF.DefaultPanelAttributes; // Extract default attributes

    res.json({
        DefaultPanelAttributes: defaultAttributes,
        Panels: Object.keys(panelsData).map(panelName => ({
            PanelName: panelName,
            ...panelsData[panelName],
        })),
    });
};

const addPanel = (req, res) => {
    const panels = readJSON(panelsPath); // Use updated readJSON
    const newPanel = req.body;

    if (panels[0].Configuration.Panels_CONF.Panels[newPanel.PanelName]) {
        return res.status(400).json({ error: "Duplicate panel name" });
    }

    panels[0].Configuration.Panels_CONF.Panels[newPanel.PanelName] = {
        Device: newPanel.Device || "",
        CssSpecificClasses: newPanel.CssSpecificClasses || "",
    };
    writeJSON(panelsPath, panels);
    res.status(201).json(newPanel);
};

const updatePanel = (req, res) => {
    const panels = readJSON(panelsPath); // Use updated readJSON
    const panelName = req.params.panelName;
    const updatedPanel = req.body;

    if (!panels[0].Configuration.Panels_CONF.Panels[panelName]) {
        return res.status(404).json({ error: "Panel not found" });
    }

    panels[0].Configuration.Panels_CONF.Panels[panelName] = updatedPanel;
    writeJSON(panelsPath, panels);
    res.json(updatedPanel);
};

const deletePanel = (req, res) => {
    const panels = readJSON(panelsPath); // Use updated readJSON
    const panelName = req.params.panelName;

    if (!panels[0].Configuration.Panels_CONF.Panels[panelName]) {
        return res.status(404).json({ error: "Panel not found" });
    }

    delete panels[0].Configuration.Panels_CONF.Panels[panelName];
    writeJSON(panelsPath, panels);
    res.status(204).send();
};



// Handler to get pages from pages.config.json
const getPagesConfig = (req, res) => {
    try {
        const pagesConfig = readJSON(pagesConfigPath); // Use updated readJSON

        const mergedPages = {};
        const keys = new Set();

        // Collect all unique page keys from all contexts
        pagesConfig.forEach((item, index) => {
            if (item.Configuration && item.Configuration.Pages_CONF && item.Configuration.Pages_CONF.Pages) {
                Object.keys(item.Configuration.Pages_CONF.Pages).forEach(key => {
                    keys.add(key);

                    // Mark pages exclusive to this context
                    if (!mergedPages[key]) {
                        mergedPages[key] = {
                            ...item.Configuration.Pages_CONF.Pages[key],
                            ExclusiveContext: item.IncludedDevices || item.IncludedUGs || null,
                        };
                    } else {
                        mergedPages[key].ExclusiveContext = null; // Not exclusive if found in multiple contexts
                    }
                });
            }
        });

        // Merge pages from all contexts
        keys.forEach(key => {
            pagesConfig.forEach(item => {
                if (item.Configuration && item.Configuration.Pages_CONF && item.Configuration.Pages_CONF.Pages[key]) {
                    // Merge attributes from the current context into the page
                    Object.assign(mergedPages[key], item.Configuration.Pages_CONF.Pages[key]);
                }
            });
        });

        // Convert mergedPages into an array of pages
        const pages = Object.keys(mergedPages).map(pageName => ({
            name: pageName,
            ...mergedPages[pageName],
        }));

        res.json(pages);
    } catch (error) {
        console.error("Error in getPagesConfig:", error);
        res.status(500).json({ error: "Failed to fetch pages" });
    }
};

const updateSectionOrder = (req, res) => {
    const { pageName, panelName } = req.params;
    const { order } = req.body;

    const pagesConfig = readJSON(pagesSectionsPath); // Ensure this reads the correct file
    const page = pagesConfig[0]?.Configuration?.PageSections_CONF?.PageInvariantNames[pageName];
    if (!page || !page[panelName]) {
        return res.status(404).json({ error: "Page or panel not found" });
    }

    const panelSections = page[panelName];
    const reorderedSections = order.map(sectionName => {
        return panelSections.find(section => {
            return typeof section === "string" ? section === sectionName : Object.keys(section)[0] === sectionName;
        });
    });

    pagesConfig[0].Configuration.PageSections_CONF.PageInvariantNames[pageName][panelName] = reorderedSections;
    writeJSON(pagesSectionsPath, pagesConfig);

    res.json({ message: "Section order updated successfully" });
};

const getConfigFile = (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, "../data", fileName);

    try {
        const fileContent = readJSON(filePath);
        res.json(fileContent);
    } catch (error) {
        console.error(`Error reading file ${fileName}:`, error);
        res.status(500).json({ error: "Failed to read file" });
    }
};

const updateConfigFile = (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, "../data", fileName);

    try {
        const updatedContent = req.body;
        writeJSON(filePath, updatedContent);
        res.status(200).json({ message: "File updated successfully" });
    } catch (error) {
        console.error(`Error updating file ${fileName}:`, error);
        res.status(500).json({ error: "Failed to update file" });
    }
};

const setSelectedContext = (req, res) => {
    const { selectedContext: context } = req.body;
    contextManager.setCurrentContext(context);
    res.status(200).json({ message: "Selected context set successfully" });
};

const getSelectedContext = (req, res) => {
    let outcome = {};
    outcome = contextManager.getCurrentContext();
    res.json({ selectedContext: outcome });
};

export {
    getSections,
    addSection,
    updateSection,
    getPanels,
    addPanel,
    updatePanel,
    deletePanel,
    getPagesConfig,
    updateSectionOrder,
    getConfigFile,
    updateConfigFile,
    setSelectedContext,
    getSelectedContext,
};
