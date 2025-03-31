import express from "express";
import * as configController from "../controllers/configController.js"; // Use named imports
import PageSectionsController from "../sections/pageSectionsConfiguration/controllers/pageSectionsController.js";

const router = express.Router();
const pageSectionsController = new PageSectionsController();

// Routes for sections.config.json
router.get("/sections", configController.getSections);
router.post("/sections", configController.addSection);
router.put("/sections", configController.updateSection);

// Routes for pagePanels.json
router.get("/panels", configController.getPanels);
router.post("/panels", configController.addPanel);
router.put("/panels/:panelName", configController.updatePanel);
router.delete("/panels/:panelName", configController.deletePanel);

// Routes for pageSections.config.json
router.get("/pageSections", (req, res) => pageSectionsController.getPageSections(req, res));
router.get("/pageSections/pages", (req, res) => pageSectionsController.getAllPages(req, res));
router.put("/pageSections/:pageName", (req, res) => pageSectionsController.updatePageSectionsByPage(req, res));
router.put("/pageSections/:pageName/panels/:panelName/sections/order", configController.updateSectionsOrderInAPanelOfAPage);

router.get("/config/:fileName", configController.getConfigFile);
router.get("/config/contextConfiguration.schema.json", configController.getConfigFile);
router.put("/config/:fileName", configController.updateConfigFile);

router.post("/setSelectedContext", configController.setSelectedContext);
router.get("/getSelectedContext", configController.getSelectedContext);

export default router;
