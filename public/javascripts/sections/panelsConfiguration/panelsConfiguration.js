document.addEventListener("DOMContentLoaded", () => {
    const panelsList = document.getElementById("panelsList");
    const panelForm = document.getElementById("panelForm");
    const panelNameInput = document.getElementById("panelName");
    const attributesContainer = document.getElementById("attributesContainer");
    const formTitle = document.getElementById("formTitle");
    const cancelEditButton = document.getElementById("cancelEditButton");
    const addNewPanelButton = document.getElementById("addNewPanelButton");
    const panelFormContainer = document.getElementById("panelFormContainer");

    let editingPanel = null;

    // Fetch default attributes and existing panels
    fetch("/api/panels")
        .then(res => res.json())
        .then(data => {
            const panels = data;

            fetch("/api/panels/defaults")
                .then(res => res.json())
                .then(defaultAttributes => {
                    // Render existing panels
                    Object.keys(panels).forEach(panelName => {
                        const li = document.createElement("li");
                        li.textContent = panelName;

                        const editButton = document.createElement("button");
                        editButton.textContent = "Edit";
                        editButton.addEventListener("click", () => {
                            editingPanel = panelName;
                            formTitle.textContent = `Edit Panel: ${panelName}`;
                            panelNameInput.value = panelName;
                            panelNameInput.disabled = false; // Allow editing the panel name
                            attributesContainer.innerHTML = "";
                            Object.entries(panels[panelName]).forEach(([key, value]) => {
                                if (key === "PanelName") return; // Skip the PanelName field

                                const label = document.createElement("label");
                                label.textContent = key;

                                let input;
                                if (typeof value === "boolean") {
                                    // Render dropdown for boolean attributes
                                    input = document.createElement("select");
                                    input.name = key;

                                    const trueOption = document.createElement("option");
                                    trueOption.value = "true";
                                    trueOption.textContent = "true";
                                    trueOption.selected = value === true;

                                    const falseOption = document.createElement("option");
                                    falseOption.value = "false";
                                    falseOption.textContent = "false";
                                    falseOption.selected = value === false;

                                    input.appendChild(trueOption);
                                    input.appendChild(falseOption);
                                } else {
                                    // Render text input for other types
                                    input = document.createElement("input");
                                    input.type = "text";
                                    input.name = key;
                                    input.value = value;
                                }

                                input.dataset.type = typeof value; // Store the original type
                                attributesContainer.appendChild(label);
                                attributesContainer.appendChild(input);
                            });
                            cancelEditButton.style.display = "inline-block"; // Show the cancel button
                            panelFormContainer.style.display = "block";
                        });

                        li.appendChild(editButton);
                        panelsList.appendChild(li);
                    });

                    // Handle "Add New Panel" button
                    addNewPanelButton.addEventListener("click", () => {
                        editingPanel = null;
                        formTitle.textContent = "Add New Panel";
                        panelNameInput.value = "";
                        panelNameInput.disabled = false;
                        attributesContainer.innerHTML = "";

                        // Populate form with default attributes
                        Object.entries(defaultAttributes).forEach(([key, value]) => {
                            const label = document.createElement("label");
                            label.textContent = key;

                            let input;
                            if (typeof value === "boolean") {
                                // Render dropdown for boolean attributes
                                input = document.createElement("select");
                                input.name = key;

                                const trueOption = document.createElement("option");
                                trueOption.value = "true";
                                trueOption.textContent = "true";
                                trueOption.selected = value === true;

                                const falseOption = document.createElement("option");
                                falseOption.value = "false";
                                falseOption.textContent = "false";
                                falseOption.selected = value === false;

                                input.appendChild(trueOption);
                                input.appendChild(falseOption);
                            } else {
                                // Render text input for other types
                                input = document.createElement("input");
                                input.type = "text";
                                input.name = key;
                                input.value = value;
                            }

                            input.dataset.type = typeof value; // Store the original type
                            attributesContainer.appendChild(label);
                            attributesContainer.appendChild(input);
                        });

                        cancelEditButton.style.display = "none";
                        panelFormContainer.style.display = "block";
                    });
                });
        });

    // Handle form submission
    panelForm.addEventListener("submit", e => {
        e.preventDefault();
        const panelName = panelNameInput.value;
        const attributes = {};
        Array.from(attributesContainer.querySelectorAll("input, select")).forEach(input => {
            const originalType = input.dataset.type; // Retrieve the original type
            let value = input.value;

            // Convert the value back to its original type
            if (originalType === "boolean") {
                value = value === "true";
            } else if (originalType === "number") {
                value = parseFloat(value);
            }

            attributes[input.name] = value;
        });

        const method = editingPanel ? "PUT" : "POST";
        const url = editingPanel ? `/api/panels/${editingPanel}` : "/api/panels";
        fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ panelName, attributes, oldPanelName: editingPanel }),
        }).then(() => {
            window.location.reload();
        });
    });

    // Handle cancel edit
    cancelEditButton.addEventListener("click", () => {
        editingPanel = null;
        formTitle.textContent = "Add Panel";
        panelNameInput.value = "";
        panelNameInput.disabled = false; // Enable editing the panel name
        attributesContainer.innerHTML = "";
        cancelEditButton.style.display = "none"; // Hide the cancel button
        panelFormContainer.style.display = "none";
    });
});
