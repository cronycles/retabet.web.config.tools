import { initializePageSelector } from './modules/pageSelector.js';
import { loadAvailablePanels, loadAvailableSections } from './modules/loadResources.js';

document.addEventListener('DOMContentLoaded', () => {
    initializePageSelector(); // Initialize the dropdown for selecting pages
    loadAvailablePanels(); // Load available panels
    loadAvailableSections(); // Load available sections
});
