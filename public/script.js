import { initializePageSelector } from './modules/pageSelector.js';
import { initializeDragAndDrop } from './modules/dragAndDrop.js';
import { loadAvailablePanels, loadAvailableSections } from './modules/loadResources.js';

document.addEventListener('DOMContentLoaded', () => {
    initializePageSelector();
    loadAvailablePanels();
    loadAvailableSections();
    initializeDragAndDrop();
});
