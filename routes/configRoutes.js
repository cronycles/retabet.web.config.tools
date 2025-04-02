import express from "express";
import * as configController from "../controllers/configController.js"; // Use named imports
import PageSectionsController from "../sections/pageSectionsConfiguration/controllers/pageSectionsController.js";
import SectionsController from "../sections/sectionsConfiguration/controllers/sectionsController.js";
import PanelsController from "../sections/panelsConfiguration/controllers/panelsController.js";

const router = express.Router();
const pageSectionsController = new PageSectionsController();
const sectionsController = new SectionsController();
const panelsController = new PanelsController();

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
router.put("/pageSections/:pageName/panels/:panelName/sections/order", (req, res) => pageSectionsController.updateSectionsOrderInAPanelOfAPage(req, res));

router.post("/configContext/setSelectedContext", configController.setSelectedContext);
router.get("/configContext/getSelectedContext", configController.getSelectedContext);
router.get("/configContext/:fileName", configController.getConfigFile);
router.get("/configContext/contextConfiguration.schema.json", configController.getConfigFile);
router.put("/configContext/:fileName", configController.updateConfigFile);

export default router;
