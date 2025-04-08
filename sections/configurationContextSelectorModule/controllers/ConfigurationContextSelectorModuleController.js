import ConfigurationContextSelectorModuleManager from "../managers/configurationContextSelectorModuleManager.js";

class ConfigurationContextSelectorModuleController {
    #contextSelectorModuleManager;

    constructor() {
        this.#contextSelectorModuleManager = ConfigurationContextSelectorModuleManager;
    }

    loadContextsFromFile(req, res) {
        let outcome = {
            status: 500,
            error: "Unknown error occured",
            data: null,
        };
        const fileName = req.params.fileName;
        const localContextObject = this.#contextSelectorModuleManager.loadFileContextsByFileName(fileName);

       if(localContextObject && localContextObject.isOk) {
           outcome.status = 200;
           outcome.data = localContextObject.data;
       }
        return res.status(outcome.status).json({ error: outcome.error, data: outcome.data });
    }

    getConfigFileByName(req, res) {
        let outcome = {
            status: 500,
            error: "Unknown error occured",
            data: null,
        };
        const fileName = req.params.fileName;
        const serviceResponse = this.#contextSelectorModuleManager.getConfigFileByName(fileName);
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

    saveConfigFileByName(req, res) {
        let outcome = {
            status: 500,
            error: "Unknown error occured",
            data: null,
        };

        const fileName = req.params.fileName;
        const updatedContent = req.body;

        const serviceResponse = this.#contextSelectorModuleManager.saveConfigFileByName(updatedContent, fileName);
        if (serviceResponse.isOk) {
            outcome.status = 200;
            outcome.data = serviceResponse.data;
        } else {
            if (serviceResponse.errorType == "INTERNAL_SERVICE_ERROR") {
                outcome.error = "Internal service error occured";
            }
        }
    }

    getContextConfigProperties(req, res) {
        let outcome = {
            status: 500,
            error: "Unknown error occured",
            data: null,
        };
        const serviceResponse = this.#contextSelectorModuleManager.getContextConfigProperties();
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
        const { selectedContext: context } = req.body;
        this.#contextSelectorModuleManager.setSelectedContext(context);
        res.status(200).json({ message: "Selected context set successfully" });
    }

    getSelectedContext(req, res) {
        let outcome = {};
        outcome = this.#contextSelectorModuleManager.getSelectedContext();
        res.json({ selectedContext: outcome });
    }

    updateSection(req, res) {
        let outcome = {
            status: 500,
            error: "Unknown error occured",
            message: "",
        };
        const { sectionName, attributes, oldSectionName } = req.body;

        let updateOutput = this.#contextSelectorModuleManager.updateSection(sectionName, attributes, oldSectionName);

        if (updateOutput.isOk) {
            outcome.status = 201;
            outcome.message = "Section updated successfully";
        } else {
            if (updateOutput.errorType == "NOT_FOUND") {
                outcome.status = 404;
                outcome.error = "Section not found";
            } else {
                if (updateOutput.errorType == "ALREADY_EXISTS") {
                    outcome.status = 400;
                    outcome.error = "Section already exists";
                }
            }
        }
        return res.status(outcome.status).json({ error: outcome.error, message: outcome.message });
    }
}
export default ConfigurationContextSelectorModuleController;
