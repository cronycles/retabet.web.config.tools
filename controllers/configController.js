const fs = require('fs');
const path = require('path');
const JSON5 = require('json5'); // Import the json5 library

// File paths
const sectionsPath = path.join(__dirname, '../data/sections.config.json');
const panelsPath = path.join(__dirname, '../data/panels.config.json'); // Updated filename
const pagesPath = path.join(__dirname, '../data/pageSections.config.json');
const pagesConfigPath = path.join(__dirname, '../data/pages.config.json');

// Utility to read JSON files
const readJSON = (filePath) => {
    try {
        return JSON5.parse(fs.readFileSync(filePath, 'utf8')); // Use JSON5 for parsing
    } catch (error) {
        console.error(`Error reading JSON file at ${filePath}:`, error);
        throw error;
    }
};

// Utility to write JSON files
const writeJSON = (filePath, data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 4));

// Handlers for sections.config.json
exports.getSections = (req, res) => {
    const sections = readJSON(sectionsPath); // Use updated readJSON
    res.json(sections);
};

exports.addSection = (req, res) => {
    const sections = readJSON(sectionsPath); // Use updated readJSON
    const { sectionName, attributes } = req.body;

    if (sections[0].Configuration.Sections_CONF.Sections[sectionName]) {
        return res.status(400).json({ error: 'Section already exists' });
    }

    sections[0].Configuration.Sections_CONF.Sections[sectionName] = attributes;
    writeJSON(sectionsPath, sections);
    res.status(201).json({ message: 'Section added successfully' });
};

exports.updateSection = (req, res) => {
    const sections = readJSON(sectionsPath); // Use updated readJSON
    const { sectionName, attributes, oldSectionName } = req.body;

    if (!sections[0].Configuration.Sections_CONF.Sections[oldSectionName]) {
        return res.status(404).json({ error: 'Section not found' });
    }

    if (sectionName !== oldSectionName && sections[0].Configuration.Sections_CONF.Sections[sectionName]) {
        return res.status(400).json({ error: 'Section name already exists' });
    }

    // Rename the section if the name has changed
    if (sectionName !== oldSectionName) {
        sections[0].Configuration.Sections_CONF.Sections[sectionName] =
            sections[0].Configuration.Sections_CONF.Sections[oldSectionName];
        delete sections[0].Configuration.Sections_CONF.Sections[oldSectionName];
    }

    // Update the attributes
    sections[0].Configuration.Sections_CONF.Sections[sectionName] = attributes;
    writeJSON(sectionsPath, sections);
    res.json({ message: 'Section updated successfully' });
};

// Handlers for pagePanels.json
exports.getPanels = (req, res) => {
    const panels = readJSON(panelsPath); // Use updated readJSON
    const panelsData = panels[0].Configuration.Panels_CONF.Panels; // Updated structure
    res.json(Object.keys(panelsData).map(panelName => ({
        PanelName: panelName,
        ...panelsData[panelName]
    })));
};

exports.addPanel = (req, res) => {
    const panels = readJSON(panelsPath); // Use updated readJSON
    const newPanel = req.body;

    if (panels[0].Configuration.Panels_CONF.Panels[newPanel.PanelName]) {
        return res.status(400).json({ error: 'Duplicate panel name' });
    }

    panels[0].Configuration.Panels_CONF.Panels[newPanel.PanelName] = {
        Device: newPanel.Device || "",
        CssSpecificClasses: newPanel.CssSpecificClasses || ""
    };
    writeJSON(panelsPath, panels);
    res.status(201).json(newPanel);
};

exports.updatePanel = (req, res) => {
    const panels = readJSON(panelsPath); // Use updated readJSON
    const panelName = req.params.panelName;
    const updatedPanel = req.body;

    if (!panels[0].Configuration.Panels_CONF.Panels[panelName]) {
        return res.status(404).json({ error: 'Panel not found' });
    }

    panels[0].Configuration.Panels_CONF.Panels[panelName] = updatedPanel;
    writeJSON(panelsPath, panels);
    res.json(updatedPanel);
};

exports.deletePanel = (req, res) => {
    const panels = readJSON(panelsPath); // Use updated readJSON
    const panelName = req.params.panelName;

    if (!panels[0].Configuration.Panels_CONF.Panels[panelName]) {
        return res.status(404).json({ error: 'Panel not found' });
    }

    delete panels[0].Configuration.Panels_CONF.Panels[panelName];
    writeJSON(panelsPath, panels);
    res.status(204).send();
};

// Handlers for pageSections.config.json
exports.getPages = (req, res) => {
    try {
        const pagesConfig = readJSON(pagesConfigPath); // Use updated readJSON
        const pageSections = readJSON(pagesPath); // Use updated readJSON

        if (!pagesConfig[0]?.Configuration?.Pages_CONF?.Pages) {
            throw new Error('Invalid structure in pages.config.json');
        }

        const pages = Object.keys(pagesConfig[0].Configuration.Pages_CONF.Pages).map(pageName => {
            const panels = pageSections[0]?.Configuration?.PageSections_CONF?.PageInvariantNames[pageName] || {};
            return { name: pageName, panels };
        });

        res.json(pages);
    } catch (error) {
        console.error('Error in getPages:', error);
        res.status(500).json({ error: 'Failed to fetch pages' });
    }
};

exports.addPage = (req, res) => {
    const pages = readJSON(pagesPath); // Use updated readJSON
    const newPage = req.body;

    if (pages.some(page => page.Configuration.PageSections_CONF.PageInvariantNames[newPage.name])) {
        return res.status(400).json({ error: 'Duplicate page name' });
    }

    // Validate duplicate section names within the same panel
    Object.values(newPage.Configuration.PageSections_CONF.PageInvariantNames).forEach(panel => {
        const sectionNames = new Set();
        panel.forEach(section => {
            if (sectionNames.has(section.name)) {
                return res.status(400).json({ error: `Duplicate section name: ${section.name}` });
            }
            sectionNames.add(section.name);
        });
    });

    pages.push(newPage);
    writeJSON(pagesPath, pages);
    res.status(201).json(newPage);
};

exports.updatePage = (req, res) => {
    const pages = readJSON(pagesPath); // Use updated readJSON
    const sections = readJSON(sectionsPath); // Use updated readJSON
    const pageName = req.params.pageName;
    const { action, panelName, sectionName, attributes } = req.body;

    const pageIndex = pages.findIndex(page => page.Configuration.PageSections_CONF.PageInvariantNames[pageName]);
    if (pageIndex === -1) {
        return res.status(404).json({ error: 'Page not found' });
    }

    const page = pages[pageIndex];

    if (action === 'addPanel') {
        if (!page.Configuration.PageSections_CONF.PageInvariantNames[pageName][panelName]) {
            page.Configuration.PageSections_CONF.PageInvariantNames[pageName][panelName] = [];
        }
    } else if (action === 'removePanel') {
        delete page.Configuration.PageSections_CONF.PageInvariantNames[pageName][panelName];
    } else if (action === 'addSection') {
        const panelSections = page.Configuration.PageSections_CONF.PageInvariantNames[pageName][panelName] || [];
        panelSections.push({ [sectionName]: attributes });
        page.Configuration.PageSections_CONF.PageInvariantNames[pageName][panelName] = panelSections;
    } else if (action === 'removeSection') {
        const panelSections = page.Configuration.PageSections_CONF.PageInvariantNames[pageName][panelName];
        page.Configuration.PageSections_CONF.PageInvariantNames[pageName][panelName] = panelSections.filter(
            section => !section[sectionName]
        );
    } else if (action === 'updateSection') {
        const panelSections = page.Configuration.PageSections_CONF.PageInvariantNames[pageName][panelName];
        const sectionIndex = panelSections.findIndex(section => section[sectionName]);
        if (sectionIndex !== -1) {
            panelSections[sectionIndex][sectionName] = attributes;
        }
    }

    pages[pageIndex] = page;
    writeJSON(pagesPath, pages);
    res.json(page);
};

exports.deletePage = (req, res) => {
    const pages = readJSON(pagesPath); // Use updated readJSON
    const pageName = req.params.pageName;

    const filteredPages = pages.filter(page => !page.Configuration.PageSections_CONF.PageInvariantNames[pageName]);
    if (filteredPages.length === pages.length) {
        return res.status(404).json({ error: 'Page not found' });
    }

    writeJSON(pagesPath, filteredPages);
    res.status(204).send();
};

// Handler to get pages from pages.config.json
exports.getPagesConfig = (req, res) => {
    try {
        const pagesConfig = readJSON(pagesConfigPath); // Use updated readJSON

        const mergedPages = {};
        const keys = new Set();

        // Collect all unique page keys from all contexts
        pagesConfig.forEach((item) => {
            if (item.Configuration && item.Configuration.Pages_CONF && item.Configuration.Pages_CONF.Pages) {
                Object.keys(item.Configuration.Pages_CONF.Pages).forEach((key) => {
                    keys.add(key);
                });
            }
        });

        // Merge pages from all contexts
        keys.forEach((key) => {
            mergedPages[key] = {}; // Initialize the page object
            pagesConfig.forEach((item) => {
                if (item.Configuration && item.Configuration.Pages_CONF && item.Configuration.Pages_CONF.Pages[key]) {
                    // Merge attributes from the current context into the page
                    Object.assign(mergedPages[key], item.Configuration.Pages_CONF.Pages[key]);
                }
            });
        });

        // Convert mergedPages into an array of pages
        const pages = Object.keys(mergedPages).map((pageName) => ({
            name: pageName,
            ...mergedPages[pageName],
        }));

        res.json(pages);
    } catch (error) {
        console.error('Error in getPagesConfig:', error);
        res.status(500).json({ error: 'Failed to fetch pages' });
    }
};

// Handler to get page sections from pageSections.config.json
exports.getPageSections = (req, res) => {
    try {
        const pageSections = readJSON(pagesPath); // Use updated readJSON

        if (!pageSections[0]?.Configuration?.PageSections_CONF?.PageInvariantNames) {
            throw new Error('Invalid structure in pageSections.config.json');
        }

        res.json(pageSections[0].Configuration.PageSections_CONF.PageInvariantNames);
    } catch (error) {
        console.error('Error in getPageSections:', error);
        res.status(500).json({ error: 'Failed to fetch page sections' });
    }
};
