import express from "express";
import PageSectionsController from "../sections/pageSectionsConfiguration/controllers/pageSectionsController.js";
import SectionsController from "../sections/sectionsConfiguration/controllers/sectionsController.js";
import PanelsController from "../sections/panelsConfiguration/controllers/panelsController.js";
import PagesController from "../sections/pagesConfiguration/controllers/pagesController.js";
import ConfigurationContextSelectorModuleController from "../sections/configurationContextSelectorModule/controllers/ConfigurationContextSelectorModuleController.js";

const router = express.Router();
const pageSectionsController = new PageSectionsController();
const sectionsController = new SectionsController();
const pagesController = new PagesController();
const panelsController = new PanelsController();
const configurationContextSelectorModuleController = new ConfigurationContextSelectorModuleController();

// Routes for pages.config.json
router.get("/pages", (req, res) => pagesController.getPages(req, res));
router.get("/pages/defaults", (req, res) => pagesController.getPageDefaultAttributes(req, res));
router.post("/pages", (req, res) => pagesController.addPage(req, res));
router.put("/pages", (req, res) => pagesController.updatePage(req, res));
router.delete("/pages", (req, res) => pagesController.deletePage(req, res));

// Routes for sections.config.json
router.get("/sections", (req, res) => sectionsController.getSections(req, res));
router.get("/sections/defaults", (req, res) => sectionsController.getSectionDefaultAttributes(req, res));
router.post("/sections", (req, res) => sectionsController.addSection(req, res));
router.put("/sections", (req, res) => sectionsController.updateSection(req, res));
router.delete("/sections", (req, res) => sectionsController.deletePanel(req, res));

// Routes for panels.config.json
router.get("/panels", (req, res) => panelsController.getPanels(req, res));
router.get("/panels/defaults", (req, res) => panelsController.getPanelDefaultAttributes(req, res));
router.post("/panels", (req, res) => panelsController.addPanel(req, res));
router.put("/panels", (req, res) => panelsController.updatePanel(req, res));
router.delete("/panels", (req, res) => panelsController.deletePanel(req, res));

// Routes for pageSections.config.json
router.get("/pageSections", (req, res) => pageSectionsController.getPageSections(req, res));
router.get("/pageSections/pages", (req, res) => pageSectionsController.getAllPages(req, res));
router.get("/pageSections/panels", (req, res) => pageSectionsController.getAllPanels(req, res));
router.get("/pageSections/sections", (req, res) => pageSectionsController.getAllSections(req, res));
router.put("/pageSections/", (req, res) => pageSectionsController.updatePageSectionsByPage(req, res));
router.put("/pageSections/sectionsSorting", (req, res) => pageSectionsController.updateSectionsOrderInAPanelOfAPage(req, res));

//Roots for the Context selector module
router.get("/configContext/getSelectedContext", (req, res) => configurationContextSelectorModuleController.getSelectedContext(req, res));
router.post("/configContext/setSelectedContext", (req, res) => configurationContextSelectorModuleController.setSelectedContext(req, res));
router.get("/configContext/loadContextsFromFile/:fileName", (req, res) => configurationContextSelectorModuleController.loadContextsFromFile(req, res));
router.get("/configContext/getContextConfigProperties", (req, res) => configurationContextSelectorModuleController.getContextConfigProperties(req, res));
router.put("/configContext/saveNewContextInFile", (req, res) => configurationContextSelectorModuleController.saveNewContextInFile(req, res));
router.put("/configContext/deleteSelectedContextInFile", (req, res) => configurationContextSelectorModuleController.deleteSelectedContextInFile(req, res));

export default router;
