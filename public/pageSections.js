import { initializePageSelector } from './modules/pageSelector.js';
import { loadAvailablePanels, loadAvailableSections } from './modules/loadResources.js';
import { initializeDragAndDrop } from './modules/dragAndDrop.js'; // Import drag-and-drop module

document.addEventListener('DOMContentLoaded', () => {
    initializePageSelector(); // Initialize the dropdown for selecting pages
    loadAvailablePanels(); // Load available panels
    loadAvailableSections(); // Load available sections
    initializeDragAndDrop(); // Initialize drag-and-drop functionality
});
