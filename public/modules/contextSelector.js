export function initializeContextSelector(fileName) {
    const appDiv = document.getElementById("app");

    const dropdown = document.createElement("select");
    dropdown.id = "contextDropdown";
    dropdown.onchange = () => {
        const selectedValue = dropdown.value;
        if (selectedValue != "") {
            localStorage.setItem("selectedContext", selectedValue);
        }
        location.reload(); // Refresh the page
    };
    appDiv.appendChild(dropdown);

    const manualButton = document.createElement("button");
    manualButton.textContent = "Add Context Manually";
    manualButton.onclick = () => openManualContextModal(fileName);
    appDiv.appendChild(manualButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Context";
    deleteButton.onclick = () => deleteSelectedContext(fileName, dropdown);
    appDiv.appendChild(deleteButton);

    loadContextsFromFile(fileName, dropdown).then(() => {
        const storedContext = localStorage.getItem("selectedContext");
        dropdown.value = storedContext || ""; // Set to stored value or "Default"
    });
}

// Load contexts automatically from the file
async function loadContextsFromFile(fileName, dropdown) {
    try {
        const response = await fetch(`/api/config/${fileName}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch contexts: ${response.statusText}`);
        }
        const contexts = await response.json();

        contexts.forEach(context => {
            const keysAndValues = Object.entries(context)
                .filter(([key]) => key !== "Configuration")
                .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
                .join(", ");
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
    const appDiv = document.getElementById("app");
    appDiv.appendChild(modal);

    document.getElementById("addPropertyButton").onclick = addPropertyField;
    document.getElementById("saveContextButton").onclick = () => saveManualContext(fileName);
}

// Add a property field for manual context creation
async function addPropertyField() {
    try {
        const response = await fetch("/api/config/contextConfiguration.schema.json");
        if (!response.ok) {
            throw new Error(`Failed to fetch schema: ${response.statusText}`);
        }
        const schema = await response.json();
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
        const response = await fetch(`/api/config/${fileName}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.statusText}`);
        }
        const fileContent = await response.json();
        fileContent.push(context); // Add the new context to the file content

        const saveResponse = await fetch(`/api/config/${fileName}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fileContent),
        });

        if (!saveResponse.ok) {
            throw new Error(`Failed to save context: ${saveResponse.statusText}`);
        }
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
        const response = await fetch(`/api/config/${fileName}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.statusText}`);
        }
        const fileContent = await response.json();

        // Find and remove the selected context
        const updatedContent = fileContent.filter(context => JSON.stringify(context) !== selectedOption.value);

        const saveResponse = await fetch(`/api/config/${fileName}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedContent),
        });

        if (!saveResponse.ok) {
            throw new Error(`Failed to delete context: ${saveResponse.statusText}`);
        }

        // Remove the context from the dropdown
        dropdown.removeChild(selectedOption);
        alert("Context deleted successfully.");
    } catch (error) {
        console.error("Error deleting context:", error);
    }
}
