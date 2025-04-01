import express from "express";
import * as configController from "../controllers/configController.js"; // Use named imports
import PageSectionsController from "../sections/pageSectionsConfiguration/controllers/pageSectionsController.js";
import SectionsController from "../sections/sectionsConfiguration/controllers/sectionsController.js";

const router = express.Router();
const pageSectionsController = new PageSectionsController();
const sectionsController = new SectionsController();

// Routes for sections.config.json
router.get("/sections", (req, res) => sectionsController.getSections(req, res));
router.get("/sections/defaults", (req, res) => sectionsController.getSectionDefaultAttributes(req, res));
router.post("/sections", (req, res) => sectionsController.addSection(req, res));
router.put("/sections", (req, res) => sectionsController.updateSection(req, res));

// Routes for pagePanels.json
router.get("/panels", configController.getPanels);
router.post("/panels", configController.addPanel);
router.put("/panels/:panelName", configController.updatePanel);
router.delete("/panels/:panelName", configController.deletePanel);

// Routes for pageSections.config.json
router.get("/pageSections", (req, res) => pageSectionsController.getPageSections(req, res));
router.get("/pageSections/pages", (req, res) => pageSectionsController.getAllPages(req, res));
router.put("/pageSections/:pageName", (req, res) => pageSectionsController.updatePageSectionsByPage(req, res));
router.put("/pageSections/:pageName/panels/:panelName/sections/order", (req, res) => pageSectionsController.updateSectionsOrderInAPanelOfAPage(req, res));

router.get("/config/:fileName", configController.getConfigFile);
router.get("/config/contextConfiguration.schema.json", configController.getConfigFile);
router.put("/config/:fileName", configController.updateConfigFile);

router.post("/setSelectedContext", configController.setSelectedContext);
router.get("/getSelectedContext", configController.getSelectedContext);

export default router;
