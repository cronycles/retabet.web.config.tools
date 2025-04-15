import { initializeContextSelector } from "../configurationContextSelectorModule/configurationContextSelectorModule.js";

document.addEventListener("DOMContentLoaded", () => {
    initializeContextSelector("sections.config.json"); // Initialize the context

    const sectionsList = document.getElementById("sectionsList");
    const sectionForm = document.getElementById("sectionForm");
    const sectionNameInput = document.getElementById("sectionName");
    const attributesContainer = document.getElementById("attributesContainer");
    const formTitle = document.getElementById("formTitle");
    const cancelEditButton = document.getElementById("cancelEditButton");
    const addNewSectionButton = document.getElementById("addNewSectionButton");
    const sectionFormContainer = document.getElementById("sectionFormContainer");

    let editingSection = null;

    // Load existing sections
    fetch("/api/sections")
        .then(res => res.json())
        .then(data => {
            const sections = data;

            // Fetch default attributes from the new endpoint
            fetch("/api/sections/defaults")
                .then(res => res.json())
                .then(defaultAttributes => {
                    Object.keys(sections).forEach(sectionName => {
                        const li = document.createElement("li");
                        li.textContent = sectionName;

                        const editButton = document.createElement("button");
                        editButton.textContent = "Edit";
                        editButton.addEventListener("click", () => {
                            editingSection = sectionName;
                            formTitle.textContent = `Edit Section: ${sectionName}`;
                            sectionNameInput.value = sectionName;
                            sectionNameInput.disabled = true; // Allow editing the section name
                            attributesContainer.innerHTML = "";
                            Object.entries(sections[sectionName]).forEach(([key, value]) => {
                                const label = document.createElement("label");
                                label.textContent = key;

                                let input;
                                if (key === "Args") {
                                    // Render a textarea for the Args attribute (serialized JSON)
                                    input = document.createElement("textarea");
                                    input.name = key;
                                    input.value = JSON.stringify(value, null, 2); // Serialize the object
                                    input.classList.add("args-input"); // Add a class for validation
                                } else if (typeof value === "boolean") {
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
                            sectionFormContainer.style.display = "block";
                        });

                        const deleteButton = document.createElement("button");
                        deleteButton.textContent = "Delete";
                        deleteButton.addEventListener("click", () => {
                            if (confirm(`Are you sure you want to delete the section "${sectionName}"?`)) {
                                fetch("/api/sections", {
                                    method: "DELETE",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ sectionName }),
                                })
                                    .then(res => {
                                        if (res.ok) {
                                            window.location.reload();
                                        } else {
                                            alert("Error deleting the panel. Please try again.");
                                        }
                                    })
                                    .catch(() => {
                                        alert("Error deleting the panel. Please try again.");
                                    });
                            }
                        });


                        li.appendChild(editButton);
                        li.appendChild(deleteButton);
                        sectionsList.appendChild(li);
                    });

                    // Handle "Add New Section" button
                    addNewSectionButton.addEventListener("click", () => {
                        editingSection = null;
                        formTitle.textContent = "Add New Section";
                        sectionNameInput.value = "";
                        sectionNameInput.disabled = false;
                        attributesContainer.innerHTML = "";
                        Object.entries(defaultAttributes).forEach(([key, value]) => {
                            const label = document.createElement("label");
                            label.textContent = key;

                            let input;
                            if (key === "Args") {
                                // Render a textarea for the Args attribute (serialized JSON)
                                input = document.createElement("textarea");
                                input.name = key;
                                input.value = JSON.stringify(value, null, 2); // Serialize the object
                                input.classList.add("args-input"); // Add a class for validation
                            } else if (typeof value === "boolean") {
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
                        sectionFormContainer.style.display = "block";
                    });
                });
        });

    // Handle form submission
    sectionForm.addEventListener("submit", e => {
        e.preventDefault();
        const sectionName = sectionNameInput.value;
        const attributes = {};
        let isValid = true;

        Array.from(attributesContainer.querySelectorAll("input, select, textarea")).forEach(input => {
            const originalType = input.dataset.type; // Retrieve the original type
            let value = input.value;

            // Validate and convert the Args field
            if (input.name === "Args") {
                try {
                    value = JSON.parse(value); // Parse the JSON string back to an object
                    input.classList.remove("error"); // Remove error styling if valid
                } catch (error) {
                    input.classList.add("error"); // Add error styling
                    alert("Invalid JSON format in Args field.");
                    isValid = false;
                    return;
                }
            } else if (originalType === "boolean") {
                value = value === "true";
            } else if (originalType === "number") {
                value = parseFloat(value);
            }

            attributes[input.name] = value;
        });

        if (!isValid) return; // Prevent form submission if validation fails

        const method = editingSection ? "PUT" : "POST";
        fetch("/api/sections", {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sectionName, attributes }),
        }).then(() => {
            window.location.reload();
        });
    });

    // Handle cancel edit
    cancelEditButton.addEventListener("click", () => {
        editingSection = null;
        formTitle.textContent = "Add Section";
        sectionNameInput.value = "";
        sectionNameInput.disabled = false; // Enable editing the section name
        attributesContainer.innerHTML = "";
        cancelEditButton.style.display = "none"; // Hide the cancel button
        sectionFormContainer.style.display = "none";
    });
});
