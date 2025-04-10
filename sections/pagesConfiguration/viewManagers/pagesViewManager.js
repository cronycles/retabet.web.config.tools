import { PagesManager } from "../../../managers/uiConfiguration/pagesManager.js";

class PagesViewManager {
    static #instance = null;

    #pagesManager = PagesManager;

    static getInstance() {
        if (!PagesViewManager.#instance) {
            PagesViewManager.#instance = new PagesViewManager();
        }
        return PagesViewManager.#instance;
    }

    getAllPages() {
        let outcome = null;
        const allPages = this.#pagesManager.getAllPagesInTheCurrentContextForEditingPurpose();
        outcome = allPages;
        return outcome;
    }

    getPageDefaultAttributes() {
        let outcome = null;
        const pabelDefaultAttributes = this.#pagesManager.getPagesDefaultAttributesInTheCurrentContext();
        outcome = pabelDefaultAttributes;
        return outcome;
    }

    addPage(pageName, attributes) {
        let outcome = this.#pagesManager.addNewPageInTheCurrentContext(pageName, attributes);

        return outcome;
    }

    updatePage(pageName, attributes, oldPageName) {
        let outcome = this.#pagesManager.updateExistingPageInTheCurrentContext(pageName, attributes, oldPageName);

        return outcome;
    }

    deletePage(pageName) {
        let outcome = this.#pagesManager.deleteExistingPageInTheCurrentContext(pageName, attributes, oldPageName);

        return outcome;
    }
}

const instance = PagesViewManager.getInstance();
export { PagesViewManager as PagesManager, instance as default };
