import ConfigurationContextSelectorModuleViewManager from "../viewManagers/configurationContextSelectorModuleViewManager.js";

export default class ConfigurationContextSelectorModuleController {
    #contextSelectorModuleViewManager;

    constructor() {
        this.#contextSelectorModuleViewManager = new ConfigurationContextSelectorModuleViewManager();
    }

    loadContextsFromFile(req, res) {
        let outcome = {
            status: 500,
            error: "Unknown error occured",
            data: null,
        };
        const fileName = req.params.fileName;
        const localContextObject = this.#contextSelectorModuleViewManager.loadFileContextsByFileName(fileName);

        if (localContextObject && localContextObject.isOk) {
            outcome.status = 200;
            outcome.data = localContextObject.data;
        }
        return res.status(outcome.status).json({ error: outcome.error, data: outcome.data });
    }

    deleteSelectedContextInFile(req, res) {
        let outcome = {
            status: 500,
            error: "Unknown error occured",
            data: null,
        };

        const { contextValue, fileName } = req.body;
        const deleteResponse = this.#contextSelectorModuleViewManager.deleteContextInFileByFileNameAndResetCurrentContext(contextValue, fileName);
        if (deleteResponse && deleteResponse.isOk) {
            outcome.status = 200;
            outcome.data = deleteResponse.data;
        } else if (deleteResponse?.errorType == "BAD_REQUEST") {
            outcome.status = 400;
            outcome.error = "cannot delete context. if you are trying to delete the Default Context, remember that you cannot do that";
        }

        return res.status(outcome.status).json({ error: outcome.error, data: outcome.data });
    }

    saveNewContextInFile(req, res) {
        let outcome = {
            status: 500,
            error: "Unknown error occured",
            data: null,
        };

        const { contextValue, fileName } = req.body;
        const saveResponse = this.#contextSelectorModuleViewManager.saveContextInFileByFileNameAndSetNewCurrentContext(contextValue, fileName);
        if (saveResponse && saveResponse.isOk) {
            outcome.status = 200;
            outcome.data = saveResponse.data;
        } else if (saveResponse?.errorType == "BAD_REQUEST") {
            outcome.status = 400;
            outcome.error = "cannot create new context";
        }

        return res.status(outcome.status).json({ error: outcome.error, data: outcome.data });
    }

    getContextConfigProperties(req, res) {
        let outcome = {
            status: 500,
            error: "Unknown error occured",
            data: null,
        };
        const serviceResponse = this.#contextSelectorModuleViewManager.getContextConfigProperties();
        if (serviceResponse.isOk) {
            outcome.status = 200;
            outcome.data = serviceResponse.data;
        } else {
            if (serviceResponse.errorType == "INTERNAL_SERVICE_ERROR") {
                outcome.error = "Internal service error occured";
            }
        }

        return res.status(outcome.status).json({ error: outcome.error, data: outcome.data });
    }

    setSelectedContext(req, res) {
        const selectedStringContext = req.body.selectedContext;
        this.#contextSelectorModuleViewManager.setSelectedContext(selectedStringContext);
        res.status(200).json({ message: "Selected context set successfully" });
    }

    getSelectedContext(req, res) {
        let outcome = {};
        outcome = this.#contextSelectorModuleViewManager.getSelectedContext();
        res.json({ selectedContext: outcome });
    }
}
