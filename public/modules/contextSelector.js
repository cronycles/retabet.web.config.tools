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
function addPropertyField() {
    const container = document.getElementById('propertiesContainer');
    const propertyField = document.createElement('div');
    propertyField.innerHTML = `
        <select class="propertySelector">
            <option value="IncludedDevices">IncludedDevices</option>
            <option value="ExcludedDevices">ExcludedDevices</option>
            <option value="IncludedPlatforms">IncludedPlatforms</option>
            <option value="ExcludedPlatforms">ExcludedPlatforms</option>
            <option value="IncludedEnvironments">IncludedEnvironments</option>
            <option value="ExcludedEnvironments">ExcludedEnvironments</option>
            <option value="IncludedMachines">IncludedMachines</option>
            <option value="ExcludedMachines">ExcludedMachines</option>
            <option value="IncludedSites">IncludedSites</option>
            <option value="ExcludedSites">ExcludedSites</option>
            <option value="IncludedUGs">IncludedUGs</option>
            <option value="ExcludedUGs">ExcludedUGs</option>
        </select>
        <input type="text" class="itemsInput" placeholder="Enter items (comma-separated)" />
    `;
    container.appendChild(propertyField);
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

