export function initializeContextSelector(fileName) {
    const configurationContextPlaceholder = document.getElementById("configurationContextModulePlaceholder");

    configurationContextPlaceholder.innerHTML = `
        <h3>Configuration Context</h3>
    `;
    const dropdown = document.createElement("select");
    dropdown.id = "contextDropdown";
    dropdown.onchange = async () => {
        const selectedValue = dropdown.value;
        try {
            await fetch("/api/configContext/setSelectedContext", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ selectedContext: selectedValue }),
            });
            location.reload(); // Reload the page to apply the new context
        } catch (error) {
            console.error("Failed to set selected context on server:", error);
        }
    };
    configurationContextPlaceholder.appendChild(dropdown);

    const manualButton = document.createElement("button");
    manualButton.textContent = "Add Context Manually";
    manualButton.onclick = () => openManualContextModal(fileName);
    configurationContextPlaceholder.appendChild(manualButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Context";
    deleteButton.onclick = () => deleteSelectedContext(fileName, dropdown);
    configurationContextPlaceholder.appendChild(deleteButton);

    loadContextsFromFile(fileName, dropdown).then(async () => {
        try {
            const response = await fetch("/api/configContext/getSelectedContext");
            if (!response.ok) {
                throw new Error(`Failed to fetch selected context: ${response.statusText}`);
            }
            const { selectedContext } = await response.json();
            const isValidContext = Array.from(dropdown.options).some(option => option.value === selectedContext);
            if (isValidContext) {
                dropdown.value = selectedContext; // Set to fetched value if valid
            }
        } catch (error) {
            console.error("Error fetching selected context:", error);
        }
    });
}

// Load contexts automatically from the file
async function loadContextsFromFile(fileName, dropdown) {
    try {
        const contexts =  await getConfigFileByName(fileName);

        contexts.forEach(context => {
            const keysAndValues = getKeysAndValueContextStringByEntireContext(context);
            const displayText = keysAndValues || "Default";

            const option = document.createElement("option");
            option.textContent = displayText;
            option.value = keysAndValues; // Keep the full context as the value
            dropdown.appendChild(option);
        });

        // Add a "Default" option if not already present
        if (!Array.from(dropdown.options).some(option => option.textContent === "Default")) {
            const defaultOption = document.createElement("option");
            defaultOption.textContent = "Default";
            defaultOption.value = "Default";
            dropdown.insertBefore(defaultOption, dropdown.firstChild);
        }
    } catch (error) {
        console.error("Error loading contexts from file:", error);
    }
}

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

    document.getElementById("addPropertyButton").onclick = addPropertyField;
    document.getElementById("saveContextButton").onclick = () => saveManualContext(fileName);
}

// Add a property field for manual context creation
async function addPropertyField() {
    try {
        const response = await fetch("/api/configContext/getContextConfigProperties");
        if (!response.ok) {
            throw new Error(`Failed to fetch schema: ${response.statusText}`);
        }
        const jsonResponse = await response.json();
        const schema = jsonResponse.data;
        const properties = Object.keys(schema.items.properties).filter(key => key !== "Configuration");

        const container = document.getElementById("propertiesContainer");
        const propertyField = document.createElement("div");
        const select = document.createElement("select");
        select.className = "propertySelector";

        properties.forEach(property => {
            const option = document.createElement("option");
            option.value = property;
            option.textContent = property;
            select.appendChild(option);
        });

        const inputContainer = document.createElement("div");
        inputContainer.className = "inputContainer";

        select.onchange = () => {
            const selectedProperty = select.value;
            const items = getItemsForProperty(schema, selectedProperty);
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

                inputContainer.appendChild(multiSelect);
            } else {
                // Create a text input for non-enum items
                const input = document.createElement("input");
                input.type = "text";
                input.className = "itemsInput";
                input.placeholder = "Enter items (comma-separated)";
                inputContainer.appendChild(input);
            }
        };

        propertyField.appendChild(select);
        propertyField.appendChild(inputContainer);
        container.appendChild(propertyField);

        // Trigger the onchange event to populate the input for the first property
        select.dispatchEvent(new Event("change"));
    } catch (error) {
        console.error("Error loading properties from schema:", error);
    }
}

// Helper function to get items for a selected property
function getItemsForProperty(schema, property) {
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

    const context = Object.assign({}, ...properties);
    context.Configuration = {}; // Add the "Configuration" property

    // Add the new context to the dropdown
    const dropdown = document.getElementById("contextDropdown");
    const option = document.createElement("option");
    const keysAndValues = Object.entries(context)
        .filter(([key]) => key !== "Configuration")
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join(", ");
    option.textContent = keysAndValues || "ERROR";
    option.value = keysAndValues; // Keep the full context as the value
    dropdown.appendChild(option);

    // Save the new context to the file
    try {
        const fileContent =  await getConfigFileByName(fileName);
        fileContent.push(context); // Add the new context to the file content

        await saveConfigFileByName(fileContent, fileName);
    } catch (error) {
        console.error("Error saving context to file:", error);
    }

    document.getElementById("manualContextModal").remove();
}

// Delete the selected context
async function deleteSelectedContext(fileName, dropdown) {
    const selectedOption = dropdown.options[dropdown.selectedIndex];
    if (!selectedOption || selectedOption.textContent === "Default") {
        alert("Cannot delete the default context.");
        return;
    }

    try {
        const fileContent =  await getConfigFileByName(fileName);

        // Find and remove the selected context
        const updatedContent = fileContent.filter(context => {
            const keysAndValues = getKeysAndValueContextStringByEntireContext(context);
            return keysAndValues !== selectedOption.value;
        });

        await saveConfigFileByName(updatedContent, fileName);
        
        // Remove the context from the dropdown
        dropdown.removeChild(selectedOption);
        alert("Context deleted successfully.");
    } catch (error) {
        console.error("Error deleting context:", error);
    }
}

async function getConfigFileByName(fileName) {
    let outcome = null;
    const response = await fetch(`/api/configContext/${fileName}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
    }
    else {
        const jsonResponse = await response.json();
        outcome = jsonResponse.data;
    }

    return outcome;
}

async function saveConfigFileByName(fileContent, fileName) {
    const saveResponse = await fetch(`/api/configContext/${fileName}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fileContent),
    });

    if (!saveResponse.ok) {
        throw new Error(`Failed to add new context in file: ${saveResponse.statusText}`);
    }
}

function getKeysAndValueContextStringByEntireContext(jsonContext) {
    return Object.entries(jsonContext)
        .filter(([key]) => key !== "Configuration")
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join(", ");
}
