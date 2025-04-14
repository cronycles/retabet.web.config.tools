export function initializeContextSelector(fileName) {
    const configurationContextPlaceholder = document.getElementById("configurationContextModulePlaceholder");

    configurationContextPlaceholder.innerHTML = `
        <h3>Configuration Context</h3>
    `;
    const dropdown = document.createElement("select");
    dropdown.id = "contextDropdown";
    dropdown.onchange = async () => {
        const selectedValue = dropdown.value;
        await setSelectedContext(selectedValue);
    };
    configurationContextPlaceholder.appendChild(dropdown);

    const manualButton = document.createElement("button");
    manualButton.textContent = "Add manually a Context in this Configuration File";
    manualButton.onclick = () => openManualContextModal(fileName);
    configurationContextPlaceholder.appendChild(manualButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Context in this Configuration File";
    deleteButton.onclick = () => deleteSelectedContext(fileName, dropdown);
    configurationContextPlaceholder.appendChild(deleteButton);

    loadContextsFromFile(fileName, dropdown).then(async () => {
        try {
            const response = await fetch("/api/configContext/getSelectedContext");
            if (!response.ok) {
                throw new Error(`Failed to fetch selected context: ${response.statusText}`);
            }
            const { selectedContext } = await response.json();
            const stringSelectedContext = JSON.stringify(selectedContext);
            const isValidContext = Array.from(dropdown.options).some(option => option.value === stringSelectedContext);
            if (isValidContext) {
                dropdown.value = stringSelectedContext; // Set to fetched value if valid
            }
        } catch (error) {
            console.error("Error fetching selected context:", error);
        }
    });
}

async function setSelectedContext(contextValue = {}) {
    try {
        await fetch("/api/configContext/setSelectedContext", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ selectedContext: contextValue }),
        });
        location.reload(); // Reload the page to apply the new context
    } catch (error) {
        console.error("Failed to set selected context on server:", error);
    }
}

// Load contexts automatically from the file
async function loadContextsFromFile(fileName, dropdown) {
    try {
        const response = await fetch(`/api/configContext/loadContextsFromFile/${fileName}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.statusText}`);
        } else {
            const jsonResponse = await response.json();
            const contexts = jsonResponse.data;
            contexts.forEach(context => {
                const option = document.createElement("option");
                option.textContent = context.textContent;
                option.value = context.value; // Keep the full context as the value
                dropdown.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Error loading contexts from file:", error);
    }
}

let cachedProperties = []; // Cache for properties fetched from the API

// Open a modal for manual context creation
function openManualContextModal(fileName) {
    // Check if the modal already exists
    if (document.getElementById("manualContextModal")) {
        return; // Do nothing if the modal is already open
    }

    const modal = document.createElement("div");
    modal.id = "manualContextModal";
    modal.innerHTML = `
        <h3>Create Context</h3>
        <div id="propertiesContainer"></div>
        <button id="addPropertyButton">Add Property</button>
        <button id="saveContextButton">Save Context</button>
    `;

    const configurationContextPlaceholder = document.getElementById("configurationContextModulePlaceholder");
    configurationContextPlaceholder.appendChild(modal);

    // Fetch properties once and store them in the cache
    if (cachedProperties.length === 0) {
        fetch("/api/configContext/getContextConfigProperties")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch schema: ${response.statusText}`);
                }
                return response.json();
            })
            .then(jsonResponse => {
                const schema = jsonResponse.data;
                cachedProperties = Object.keys(schema.items.properties).filter(key => key !== "Configuration");
                cachedProperties.schema = schema; // Store schema for later use
            })
            .catch(error => console.error("Error loading properties from schema:", error));
    }

    document.getElementById("addPropertyButton").onclick = addPropertyField;
    document.getElementById("saveContextButton").onclick = () => saveManualContext(fileName);

    validateContextButtons(); // Initial validation
}

// Add a property field for manual context creation
function addPropertyField() {
    if (cachedProperties.length === 0) {
        alert("Properties are not yet loaded. Please try again.");
        return;
    }

    const container = document.getElementById("propertiesContainer");
    const selectedProperties = Array.from(document.querySelectorAll(".propertySelector")).map(selector => selector.value);
    const availableProperties = cachedProperties.filter(property => !selectedProperties.includes(property));

    if (availableProperties.length === 0) {
        alert("No more properties available to add.");
        return;
    }

    const propertyField = document.createElement("div");
    propertyField.className = "propertyField";

    const select = document.createElement("select");
    select.className = "propertySelector";

    availableProperties.forEach(property => {
        const option = document.createElement("option");
        option.value = property;
        option.textContent = property;
        select.appendChild(option);
    });

    const inputContainer = document.createElement("div");
    inputContainer.className = "inputContainer";

    select.onchange = () => {
        const selectedProperty = select.value;
        const items = getItemsForProperty(selectedProperty);
        inputContainer.innerHTML = ""; // Clear previous input

        if (items.length > 0) {
            // Create a multi-select for enum items
            const multiSelect = document.createElement("select");
            multiSelect.className = "itemsMultiSelect";
            multiSelect.multiple = true;

            items.forEach(item => {
                const option = document.createElement("option");
                option.value = item;
                option.textContent = item;
                multiSelect.appendChild(option);
            });

            multiSelect.onchange = validateContextButtons; // Validate buttons on change
            inputContainer.appendChild(multiSelect);
        } else {
            // Create a text input for non-enum items
            const input = document.createElement("input");
            input.type = "text";
            input.className = "itemsInput";
            input.placeholder = "Enter items (comma-separated)";
            input.oninput = validateContextButtons; // Validate buttons on input
            inputContainer.appendChild(input);
        }

        updateDisabledOptions(); // Update disabled options in all dropdowns
        validateContextButtons(); // Validate buttons after adding a new field
    };

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.className = "removePropertyButton";
    removeButton.onclick = () => {
        propertyField.remove();
        updateDisabledOptions(); // Update disabled options after removal
        validateContextButtons(); // Validate buttons after removal
    };

    propertyField.appendChild(select);
    propertyField.appendChild(inputContainer);
    propertyField.appendChild(removeButton);
    container.appendChild(propertyField);

    // Trigger the onchange event to populate the input for the first property
    select.dispatchEvent(new Event("change"));

    updateDisabledOptions(); // Update disabled options in all dropdowns
}

// Validate the "Add Property" and "Save Context" buttons
function validateContextButtons() {
    const addPropertyButton = document.getElementById("addPropertyButton");
    const saveContextButton = document.getElementById("saveContextButton");

    const allFieldsValid = Array.from(document.querySelectorAll(".propertyField")).every(field => {
        const multiSelect = field.querySelector(".itemsMultiSelect");
        const itemsInput = field.querySelector(".itemsInput");

        if (multiSelect) {
            return multiSelect.selectedOptions.length > 0; // At least one item selected
        } else if (itemsInput) {
            return itemsInput.value.trim() !== ""; // Input is not empty
        }
        return false;
    });

    addPropertyButton.disabled = !allFieldsValid;
    saveContextButton.disabled = !allFieldsValid;
}

// Update disabled options in all property selectors
function updateDisabledOptions() {
    const allSelectors = Array.from(document.querySelectorAll(".propertySelector"));
    const selectedProperties = allSelectors.map(selector => selector.value);

    allSelectors.forEach(selector => {
        Array.from(selector.options).forEach(option => {
            option.disabled = selectedProperties.includes(option.value) && selector.value !== option.value;
        });
    });
}

// Helper function to get items for a selected property
function getItemsForProperty(property) {
    const schema = cachedProperties.schema; // Use cached schema
    const propertySchema = schema.items.properties[property];
    if (propertySchema && propertySchema.items && propertySchema.items.$ref) {
        const ref = propertySchema.items.$ref;
        const refKey = ref.split("/").pop(); // Extract the key from the $ref
        return schema.$defs[refKey]?.enum || [];
    }
    return [];
}

// Save the manually created context
async function saveManualContext(fileName) {
    const properties = Array.from(document.querySelectorAll(".propertySelector")).map((selector, index) => {
        const inputContainer = document.querySelectorAll(".inputContainer")[index];
        const multiSelect = inputContainer.querySelector(".itemsMultiSelect");
        const itemsInput = inputContainer.querySelector(".itemsInput");

        let selectedItems = [];
        if (multiSelect) {
            selectedItems = Array.from(multiSelect.selectedOptions).map(option => option.value);
        } else if (itemsInput) {
            selectedItems = itemsInput.value.split(",").map(item => item.trim());
        }

        return { [selector.value]: selectedItems };
    });

    const newContext = Object.assign({}, ...properties);

    // Add the new context to the dropdown
    const dropdown = document.getElementById("contextDropdown");
    const option = document.createElement("option");
    const keysAndValues = Object.entries(newContext)
        .filter(([key]) => key !== "Configuration")
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join(", ");
    option.textContent = keysAndValues || "ERROR";
    option.value = keysAndValues; // Keep the full context as the value
    dropdown.appendChild(option);

    // Save the new context to the file
    try {
        const saveResponse = await fetch(`/api/configContext/saveNewContextInFile`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contextValue: newContext, fileName }),
        });

        if (!saveResponse.ok) {
            throw new Error(`Failed to add new context in file ${fileName}: ${saveResponse.error}`);
        } else {
            alert("Context added successfully.");
            location.reload(); // Reload the page to apply the new context
        }
    } catch (error) {
        console.error("Error saving context to file:", error);
    }
}

// Delete the selected context
async function deleteSelectedContext(fileName, dropdown) {
    try {
        const selectedOption = dropdown.options[dropdown.selectedIndex];
        const contextValue = selectedOption?.value;
        if (contextValue === "{}") {
            alert("Cannot delete the default context.");
        } else {
            const deleteResponse = await fetch(`/api/configContext/deleteSelectedContextInFile/${fileName}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: { contextValue, fileName },
            });

            if (!deleteResponse.ok) {
                throw new Error(`Failed to delete context in file ${fileName}: ${deleteResponse.error}`);
            } else {
                dropdown.removeChild(selectedOption);
                alert("Context deleted successfully.");
                location.reload(); // Reload the page to apply the new context
            }
        }
    } catch (error) {
        console.error("Error deleting context:", error);
    }
}
