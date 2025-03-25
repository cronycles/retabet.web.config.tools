import { initializePageSelector } from "./modules/pageSelector.js";
import { initializeContextSelector } from "./modules/contextSelector.js";
import { loadAvailablePanels, loadAvailableSections } from "./modules/loadResources.js";
import { initializeDragAndDrop } from "./modules/dragAndDrop.js"; // Import drag-and-drop module

document.addEventListener("DOMContentLoaded", () => {
    initializeContextSelector("pageSections.config.json"); // Initialize the context
    initializePageSelector(); // Initialize the dropdown for selecting pages
    loadAvailablePanels(); // Load available panels
    loadAvailableSections(); // Load available sections
    initializeDragAndDrop(); // Initialize drag-and-drop functionality
});
