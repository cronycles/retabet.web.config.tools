import express from "express";
import PageSectionsController from "../sections/pageSectionsConfiguration/controllers/pageSectionsController.js";
import SectionsController from "../sections/sectionsConfiguration/controllers/sectionsController.js";
import PanelsController from "../sections/panelsConfiguration/controllers/panelsController.js";
import ConfigurationContextSelectorModuleController from "../sections/configurationContextSelectorModule/controllers/ConfigurationContextSelectorModuleController.js";

const router = express.Router();
const pageSectionsController = new PageSectionsController();
const sectionsController = new SectionsController();
const panelsController = new PanelsController();
const configurationContextSelectorModuleController = new ConfigurationContextSelectorModuleController();

// Routes for sections.config.json
router.get("/sections", (req, res) => sectionsController.getSections(req, res));
router.get("/sections/defaults", (req, res) => sectionsController.getSectionDefaultAttributes(req, res));
router.post("/sections", (req, res) => sectionsController.addSection(req, res));
router.put("/sections", (req, res) => sectionsController.updateSection(req, res));

// Routes for pagePanels.json
router.get("/panels", (req, res) => panelsController.getPanels(req, res));
router.get("/panels/defaults", (req, res) => panelsController.getPanelDefaultAttributes(req, res));
router.post("/panels", (req, res) => panelsController.addPanel(req, res));
router.put("/panels/:panelName", (req, res) => panelsController.updatePanel(req, res));
router.delete("/panels/:panelName", (req, res) => panelsController.deletePanel(req, res));

// Routes for pageSections.config.json
router.get("/pageSections", (req, res) => pageSectionsController.getPageSections(req, res));
router.get("/pageSections/pages", (req, res) => pageSectionsController.getAllPages(req, res));
router.put("/pageSections/:pageName", (req, res) => pageSectionsController.updatePageSectionsByPage(req, res));
router.put("/pageSections/:pageName/panels/:panelName/sections/order", (req, res) =>
    pageSectionsController.updateSectionsOrderInAPanelOfAPage(req, res)
);

router.get("/configContext/getSelectedContext", (req, res) => configurationContextSelectorModuleController.getSelectedContext(req, res));
router.post("/configContext/setSelectedContext", (req, res) => configurationContextSelectorModuleController.setSelectedContext(req, res));
router.get("/configContext/loadContextsFromFile/:fileName", (req, res) =>
    configurationContextSelectorModuleController.loadContextsFromFile(req, res)
);
router.get("/configContext/getContextConfigProperties", (req, res) =>
    configurationContextSelectorModuleController.getContextConfigProperties(req, res)
);
router.put("/configContext/saveNewContextInFile/:fileName", (req, res) =>
    configurationContextSelectorModuleController.saveNewContextInFile(req, res)
);
router.put("/configContext/deleteSelectedContextInFile/:fileName", (req, res) =>
    configurationContextSelectorModuleController.deleteSelectedContextInFile(req, res)
);

export default router;
