const fs = require('fs');
const path = require('path');

// File paths
const sectionsPath = path.join(__dirname, '../data/sections.config.json');
const panelsPath = path.join(__dirname, '../data/panels.config.json'); // Updated filename
const pagesPath = path.join(__dirname, '../data/pageSections.config.json');
const pagesConfigPath = path.join(__dirname, '../data/pages.config.json');

// Utility to read JSON files
const readJSON = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Utility to write JSON files
const writeJSON = (filePath, data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 4));

// Handlers for sections.config.json
exports.getSections = (req, res) => {
    const sections = readJSON(sectionsPath);
    res.json(sections);
};

exports.addSection = (req, res) => {
    const sections = readJSON(sectionsPath);
    const { sectionName, attributes } = req.body;

    if (sections[0].Configuration.Sections_CONF.Sections[sectionName]) {
        return res.status(400).json({ error: 'Section already exists' });
    }

    sections[0].Configuration.Sections_CONF.Sections[sectionName] = attributes;
    writeJSON(sectionsPath, sections);
    res.status(201).json({ message: 'Section added successfully' });
};

exports.updateSection = (req, res) => {
    const sections = readJSON(sectionsPath);
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
    const panels = readJSON(panelsPath);
    const panelsData = panels[0].Configuration.Panels_CONF.Panels; // Updated structure
    res.json(Object.keys(panelsData).map(panelName => ({
        PanelName: panelName,
        ...panelsData[panelName]
    })));
};

exports.addPanel = (req, res) => {
    const panels = readJSON(panelsPath);
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
    const panels = readJSON(panelsPath);
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
    const panels = readJSON(panelsPath);
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
    const pagesConfig = readJSON(pagesConfigPath);
    const pageSections = readJSON(pagesPath);
    const pages = Object.keys(pagesConfig[0].Configuration.Pages_CONF.Pages).map(pageName => {
        const panels = pageSections[0].Configuration.PageSections_CONF.PageInvariantNames[pageName] || {};
        return { name: pageName, panels };
    });
    res.json(pages);
};

exports.addPage = (req, res) => {
    const pages = readJSON(pagesPath);
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
    const pages = readJSON(pagesPath);
    const sections = readJSON(sectionsPath);
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
    }

    pages[pageIndex] = page;
    writeJSON(pagesPath, pages);
    res.json(page);
};

exports.deletePage = (req, res) => {
    const pages = readJSON(pagesPath);
    const pageName = req.params.pageName;

    const filteredPages = pages.filter(page => !page.Configuration.PageSections_CONF.PageInvariantNames[pageName]);
    if (filteredPages.length === pages.length) {
        return res.status(404).json({ error: 'Page not found' });
    }

    writeJSON(pagesPath, filteredPages);
    res.status(204).send();
};
