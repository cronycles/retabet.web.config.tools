import { addDeleteButton } from "./utils.js";
import { renderSectionEditor } from "./sectionEditor.js";

export function initializeDragAndDrop() {
    document.addEventListener("dragstart", e => {
        if (e.target.dataset.panelName) {
            e.dataTransfer.setData("panelName", e.target.dataset.panelName);
        } else if (e.target.dataset.sectionName) {
            e.dataTransfer.setData("sectionName", e.target.dataset.sectionName);
        }
    });

    document.addEventListener("dragover", e => {
        const isAPlaceholder = e.target.classList.contains("placeholder-text");

        if (e.target.classList.contains("droppable") || isAPlaceholder) {
            e.preventDefault(); // Allow dropping
            e.target.classList.add("drag-over"); // Add visual feedback
        }
    });

    document.addEventListener("dragleave", e => {
        const isAPlaceholder = e.target.classList.contains("placeholder-text");

        if (e.target.classList.contains("droppable") || isAPlaceholder) {
            e.target.classList.remove("drag-over"); // Remove visual feedback
        }
    });

    document.addEventListener("drop", e => {
        e.preventDefault();
        e.target.classList.remove("drag-over"); // Remove visual feedback

        const selectedPage = document.getElementById("pageSelector").value;

        // Allow dropping panels on the placeholder text
        const isDropPanelPlaceholder = e.target.id === "dropPanelPlaceholder";
        const isADroppablePanelArea = e.target.id === "droppablePanelsContainer" || isDropPanelPlaceholder;
        const isDropSectionPlaceholder = e.target.id === "dropSectionPlaceholder";
        const isADroppableSectionArea = e.target.id === "droppableSectionsContainer" || isDropSectionPlaceholder;
        if (isADroppablePanelArea) {
            const panelName = e.dataTransfer.getData("panelName");
            if (panelName && selectedPage) {
                // Add the panel to the pageSections.config.json
                fetch(`/api/pages/${selectedPage}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        action: "addPanel",
                        panelName,
                    }),
                }).then(response => {
                    if (response.ok) {
                        const panelDiv = document.createElement("div");
                        panelDiv.textContent = panelName;
                        panelDiv.dataset.panelName = panelName;

                        // Add delete button for the panel
                        addDeleteButton(panelDiv, "panel", panelName, selectedPage);

                        const sectionsUl = document.createElement("ul");
                        sectionsUl.id = "droppableSectionsContainer";
                        sectionsUl.classList.add("droppable");
                        sectionsUl.dataset.panelName = panelName;

                        const sectionPlaceHolderLi = document.createElement("li");
                        sectionPlaceHolderLi.id = "dropSectionPlaceholder";
                        sectionPlaceHolderLi.classList.add("placeholder-text");
                        sectionPlaceHolderLi.classList.add("text-muted");
                        sectionPlaceHolderLi.textContent = "Drop sections here";
                        sectionPlaceHolderLi.dataset.panelName = panelName;

                        sectionsUl.appendChild(sectionPlaceHolderLi);

                        panelDiv.appendChild(sectionsUl);

                        var dropPanelPlaceHolder = e.target.id === "dropPanelPlaceholder" ? e.target : e.target.querySelector("#dropPanelPlaceholder");

                        if (dropPanelPlaceHolder) {
                            dropPanelPlaceHolder.parentElement.insertBefore(panelDiv, dropPanelPlaceHolder); // Insert before the placeholder
                        }
                    } else {
                        console.error("Failed to add panel to page");
                    }
                });
            }
        } else if (isADroppableSectionArea && e.target.dataset.panelName) {
            const sectionName = e.dataTransfer.getData("sectionName");
            const panelName = e.target.dataset.panelName;

            if (sectionName && panelName && selectedPage) {
                // Add the section to the panel in pageSections.config.json
                fetch("/api/sections")
                    .then(res => res.json())
                    .then(sections => {
                        const defaultAttributes = sections[0].Configuration.Sections_CONF.Sections[sectionName];
                        if (!defaultAttributes) {
                            console.error("Invalid section name");
                            return;
                        }

                        fetch(`/api/pages/${selectedPage}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                action: "addSection",
                                panelName,
                                sectionName,
                                attributes: defaultAttributes,
                            }),
                        }).then(response => {
                            if (response.ok) {
                                const sectionLi = document.createElement("li");
                                sectionLi.textContent = sectionName;
                                sectionLi.dataset.sectionName = sectionName;
                                sectionLi.setAttribute("draggable", "true");

                                // Add delete button for the section
                                addDeleteButton(sectionLi, "section", sectionName, selectedPage, panelName);

                                // Add edit button for the section
                                const editButton = document.createElement("button");
                                editButton.textContent = "Edit";
                                editButton.addEventListener("click", () => {
                                    const editorContainer = document.createElement("div");
                                    sectionLi.appendChild(editorContainer);

                                    renderSectionEditor(
                                        editorContainer,
                                        defaultAttributes,
                                        updatedAttributes => {
                                            fetch(`/api/pages/${selectedPage}`, {
                                                method: "PUT",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({
                                                    action: "updateSection",
                                                    panelName,
                                                    sectionName,
                                                    attributes: updatedAttributes,
                                                }),
                                            }).then(() => {
                                                editorContainer.remove();
                                            });
                                        },
                                        () => {
                                            editorContainer.remove();
                                        },
                                        sectionName // Pass sectionName for restoring defaults
                                    );
                                });

                                sectionLi.appendChild(editButton);

                                var sectionPlaceholderFinding =
                                    e.target.id === "dropSectionPlaceholder" ? e.target : e.target.querySelector("#dropSectionPlaceholder");
                                if (sectionPlaceholderFinding) {
                                    sectionPlaceholderFinding.parentElement.insertBefore(sectionLi, sectionPlaceholderFinding); // Insert before the placeholder
                                }
                            } else {
                                console.error("Failed to add section to panel");
                            }
                        });
                    });
            }
        }
    });
}
