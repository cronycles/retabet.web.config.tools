import { initializePageSelector } from "./pageSelector.js";
import { initializeContextSelector } from "../../configurationContext/contextSelector.js";
import { loadAvailablePanels, loadAvailableSections } from "./loadResources.js";
import { initializeDragAndDrop } from "./dragAndDrop.js";

document.addEventListener("DOMContentLoaded", () => {
    initializeContextSelector("pageSections.config.json"); // Initialize the context
    initializePageSelector(); // Initialize the dropdown for selecting pages
    loadAvailablePanels(); // Load available panels
    loadAvailableSections(); // Load available sections
    initializeDragAndDrop(); // Initialize drag-and-drop functionality
});
