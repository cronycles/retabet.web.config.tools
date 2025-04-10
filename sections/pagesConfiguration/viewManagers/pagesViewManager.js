import PagesManager from "../../../managers/uiConfiguration/pagesManager.js";

export default class PagesViewManager {
    #pagesManager;

    constructor() {
        if (PagesViewManager.instance) {
            return PagesViewManager.instance;
        }
        this.#pagesManager = new PagesManager();

        PagesViewManager.instance = this;
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
