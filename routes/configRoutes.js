const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');

// Routes for sections.config.json (read-only)
router.get('/sections', configController.getSections);
router.post('/sections', configController.addSection);
router.put('/sections', configController.updateSection);

// Routes for pagePanels.json
router.get('/panels', configController.getPanels);
router.post('/panels', configController.addPanel);
router.put('/panels/:panelName', configController.updatePanel);
router.delete('/panels/:panelName', configController.deletePanel);

// Routes for pageSections.config.json
router.get('/pages', configController.getPages);
router.post('/pages', configController.addPage);
router.put('/pages/:pageName', configController.updatePage);
router.delete('/pages/:pageName', configController.deletePage);

// Route to get pages from pages.config.json
router.get('/pages/config', configController.getPagesConfig);

// Route to get page sections from pageSections.config.json
router.get('/pages/sections', configController.getPageSections);

router.put('/pages/:pageName/panels/:panelName/sections/order', configController.updateSectionOrder);

module.exports = router;
