import { addDeleteButton } from "./utils.js";
import { renderSectionEditor } from "./sectionEditor.js"; // Reuse the section editor logic

export function initializePageSelector() {
    const pageSelector = document.getElementById("pageSelector");
    const pageDropdown = document.getElementById("pageDropdown"); // Reference to the dropdown container
    const droppablePanelsContainer = document.getElementById("droppablePanelsContainer");

    let pages = []; // Store pages for filtering
    let currentEditingSection = null; // Track the currently open editor

    // Fetch pages from the backend
    fetch("/api/pages/config")
        .then(res => res.json())
        .then(data => {
            pages = data; // Store pages for filtering
            renderDropdown(pages); // Render the dropdown with all pages
        });

    // Render the dropdown options
    function renderDropdown(pagesToRender) {
        pageDropdown.innerHTML = ""; // Clear existing options
        pagesToRender.forEach(page => {
            const option = document.createElement("div");
            option.classList.add("dropdown-item");
            option.textContent = page.ExclusiveContext
                ? `${page.name} (${
                      Array.isArray(page.ExclusiveContext)
                          ? page.ExclusiveContext.map(context => `Only ${context.charAt(0).toUpperCase() + context.slice(1)}`).join(", ")
                          : `Only ${page.ExclusiveContext.charAt(0).toUpperCase() + page.ExclusiveContext.slice(1)}`
                  })`
                : page.name;
            option.dataset.value = page.name;

            option.addEventListener("click", () => {
                pageSelector.value = page.name; // Set the input value
                pageSelector.dispatchEvent(new Event("change")); // Trigger the change event
                pageDropdown.style.display = "none"; // Hide the dropdown
            });

            pageDropdown.appendChild(option);
        });
    }

    // Filter dropdown options based on input
    pageSelector.addEventListener("input", () => {
        const searchTerm = pageSelector.value.toLowerCase();
        const filteredPages = pages.filter(page => page.name.toLowerCase().includes(searchTerm));
        renderDropdown(filteredPages);
        pageDropdown.style.display = "block"; // Show the dropdown
    });

    // Show all options when the input is focused
    pageSelector.addEventListener("focus", () => {
        renderDropdown(pages); // Render all pages
        pageDropdown.style.display = "block"; // Show the dropdown
    });

    // Hide the dropdown when clicking outside
    document.addEventListener("click", event => {
        if (!pageSelector.contains(event.target) && !pageDropdown.contains(event.target)) {
            pageDropdown.style.display = "none"; // Hide the dropdown
        }
    });

    pageSelector.addEventListener("change", () => {
        const selectedPage = pageSelector.value;
        //droppablePanelsContainer.innerHTML = "";
        const panels = droppablePanelsContainer.querySelectorAll("div[data-panel-name]");

        // Eliminar cada uno de los divs encontrados
        panels.forEach(panel => panel.remove());

        // Fetch page sections from the backend
        fetch("/api/pages/sections")
            .then(res => res.json())
            .then(pageSections => {
                const pageData = pageSections[selectedPage];

                if (pageData) {
                    Object.keys(pageData).forEach(panelName => {
                        const panelDiv = document.createElement("div");
                        panelDiv.textContent = panelName;
                        panelDiv.dataset.panelName = panelName;

                        // Add delete button for panel
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

                        const sections = pageData[panelName];
                        sections.forEach(section => {
                            const sectionName = typeof section === "string" ? section : Object.keys(section)[0];
                            const sectionAttributes = typeof section === "string" ? {} : section[sectionName];

                            const sectionLi = document.createElement("li");
                            sectionLi.textContent = sectionName;
                            sectionLi.draggable = true;
                            sectionLi.dataset.sectionName = sectionName;

                            // Add delete button for section
                            addDeleteButton(sectionLi, "section", sectionName, selectedPage, panelName);

                            // Add edit button for section
                            const editButton = document.createElement("button");
                            editButton.textContent = "Edit";
                            editButton.addEventListener("click", () => {
                                if (currentEditingSection) return; // Prevent opening multiple editors

                                currentEditingSection = sectionName; // Track the currently editing section
                                editButton.disabled = true; // Disable the edit button

                                const editorContainer = document.createElement("div");
                                sectionLi.appendChild(editorContainer);

                                renderSectionEditor(
                                    editorContainer,
                                    sectionAttributes,
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
                                            Object.assign(sectionAttributes, updatedAttributes);
                                            currentEditingSection = null; // Reset the editing section
                                            editButton.disabled = false; // Re-enable the edit button
                                        });
                                    },
                                    () => {
                                        editorContainer.remove();
                                        currentEditingSection = null; // Reset the editing section
                                        editButton.disabled = false; // Re-enable the edit button
                                    },
                                    sectionName // Pass sectionName for restoring defaults
                                );
                            });

                            sectionLi.appendChild(editButton);
                            if (sectionPlaceHolderLi) {
                                sectionPlaceHolderLi.parentElement.insertBefore(sectionLi, sectionPlaceHolderLi);
                            }
                        });

                        panelDiv.appendChild(sectionsUl);

                        var dropPanelPlaceHolder = droppablePanelsContainer.querySelector("#dropPanelPlaceholder");
                        if (dropPanelPlaceHolder) {
                            dropPanelPlaceHolder.parentElement.insertBefore(panelDiv, dropPanelPlaceHolder); // Insert before the placeholder
                        }

                        // Enable section sorting
                        enableSectionSorting(panelDiv, panelName, selectedPage);
                    });
                }
            });
    });

    function enableSectionSorting(panelDiv, panelName, selectedPage) {
        const sectionsUl = panelDiv.querySelector("ul");
        if (!sectionsUl) return;

        sectionsUl.addEventListener("dragstart", e => {
            e.dataTransfer.setData("text/plain", e.target.dataset.sectionName);
            e.target.classList.add("dragging");
        });

        sectionsUl.addEventListener("dragover", e => {
            e.preventDefault();
            const dragging = sectionsUl.querySelector(".dragging");
            const afterElement = getDragAfterElement(sectionsUl, e.clientY);
            if (afterElement == null) {
                sectionsUl.appendChild(dragging);
            } else {
                sectionsUl.insertBefore(dragging, afterElement);
            }
        });

        sectionsUl.addEventListener("dragend", e => {
            e.target.classList.remove("dragging");
            const newOrder = Array.from(sectionsUl.children).map(li => li.dataset.sectionName);

            // Update the backend with the new order
            fetch(`/api/pages/${selectedPage}/panels/${panelName}/sections/order`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order: newOrder }),
            }).catch(err => console.error("Failed to update section order:", err));
        });

        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll("li:not(.dragging)")];
            return draggableElements.reduce(
                (closest, child) => {
                    const box = child.getBoundingClientRect();
                    const offset = y - box.top - box.height / 2;
                    if (offset < 0 && offset > closest.offset) {
                        return { offset, element: child };
                    } else {
                        return closest;
                    }
                },
                { offset: Number.NEGATIVE_INFINITY }
            ).element;
        }
    }

    // Call enableSectionSorting for each panel
    droppablePanelsContainer.addEventListener("DOMNodeInserted", e => {
        if (e.target.classList.contains("droppable")) {
            const panelName = e.target.dataset.panelName;
            enableSectionSorting(e.target, panelName, selectedPage);
        }
    });
}
