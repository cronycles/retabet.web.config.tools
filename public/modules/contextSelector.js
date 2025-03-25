export function initializeContextSelector(fileName) {
    const appDiv = document.getElementById("app");

    const dropdown = document.createElement('select');
    dropdown.id = 'contextDropdown';
    appDiv.appendChild(dropdown);

    const manualButton = document.createElement('button');
    manualButton.textContent = 'Add Context Manually';
    manualButton.onclick = () => openManualContextModal();
    appDiv.appendChild(manualButton);

    loadContextsFromFile(fileName, dropdown);
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

            const option = document.createElement('option');
            option.textContent = displayText;
            option.value = JSON.stringify(context); // Keep the full context as the value
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading contexts from file:', error);
    }
}

// Open a modal for manual context creation
function openManualContextModal() {
    const modal = document.createElement('div');
    modal.id = 'manualContextModal';
    modal.innerHTML = `
        <h3>Create Context</h3>
        <div id="propertiesContainer"></div>
        <button id="addPropertyButton">Add Property</button>
        <button id="saveContextButton">Save Context</button>
    `;
    const appDiv = document.getElementById("app");
    appDiv.appendChild(modal);

    document.getElementById('addPropertyButton').onclick = addPropertyField;
    document.getElementById('saveContextButton').onclick = saveManualContext;
}

// Add a property field for manual context creation
async function addPropertyField() {
    try {
        const response = await fetch('/api/config/contextConfiguration.schema.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch schema: ${response.statusText}`);
        }
        const schema = await response.json();
        const properties = Object.keys(schema.items.properties).filter(
            key => key !== "Configuration"
        );

        const container = document.getElementById('propertiesContainer');
        const propertyField = document.createElement('div');
        const select = document.createElement('select');
        select.className = 'propertySelector';

        properties.forEach(property => {
            const option = document.createElement('option');
            option.value = property;
            option.textContent = property;
            select.appendChild(option);
        });

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'itemsInput';
        input.placeholder = 'Enter items (comma-separated)';

        propertyField.appendChild(select);
        propertyField.appendChild(input);
        container.appendChild(propertyField);
    } catch (error) {
        console.error('Error loading properties from schema:', error);
    }
}

// Save the manually created context
function saveManualContext() {
    const properties = Array.from(document.querySelectorAll('.propertySelector')).map((selector, index) => {
        const items = document.querySelectorAll('.itemsInput')[index].value.split(',').map(item => item.trim());
        return { [selector.value]: items };
    });

    const context = Object.assign({}, ...properties);
    const dropdown = document.getElementById('contextDropdown');
    const option = document.createElement('option');
    const keysAndValues = Object.entries(context)
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join(", ");
    option.textContent = keysAndValues || "Default";
    option.value = JSON.stringify(context); // Keep the full context as the value
    dropdown.appendChild(option);

    document.getElementById('manualContextModal').remove();
}

