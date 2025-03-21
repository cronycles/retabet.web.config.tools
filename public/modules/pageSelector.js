import { addDeleteButton } from './utils.js';
import { renderSectionEditor } from './sectionEditor.js'; // Reuse the section editor logic

export function initializePageSelector() {
    const pageSelector = document.getElementById('pageSelector');
    const pageDropdown = document.getElementById('pageDropdown'); // Reference to the dropdown container
    const pagePanels = document.getElementById('pagePanels');
    const placeholder = document.getElementById('pagePanelsPlaceholder');

    let pages = []; // Store pages for filtering
    let currentEditingSection = null; // Track the currently open editor

    // Fetch pages from the backend
    fetch('/api/pages/config')
        .then(res => res.json())
        .then(data => {
            pages = data; // Store pages for filtering
            renderDropdown(pages); // Render the dropdown with all pages
        });

    // Render the dropdown options
    function renderDropdown(pagesToRender) {
        pageDropdown.innerHTML = ''; // Clear existing options
        pagesToRender.forEach(page => {
            const option = document.createElement('div');
            option.classList.add('dropdown-item');
            option.textContent = page.ExclusiveContext
                ? `${page.name} (${Array.isArray(page.ExclusiveContext) ? page.ExclusiveContext.map(context => `Only ${context.charAt(0).toUpperCase() + context.slice(1)}`).join(', ') : `Only ${page.ExclusiveContext.charAt(0).toUpperCase() + page.ExclusiveContext.slice(1)}`})`
                : page.name;
            option.dataset.value = page.name;

            option.addEventListener('click', () => {
                pageSelector.value = page.name; // Set the input value
                pageSelector.dispatchEvent(new Event('change')); // Trigger the change event
                pageDropdown.style.display = 'none'; // Hide the dropdown
            });

            pageDropdown.appendChild(option);
        });
    }

    // Filter dropdown options based on input
    pageSelector.addEventListener('input', () => {
        const searchTerm = pageSelector.value.toLowerCase();
        const filteredPages = pages.filter(page => page.name.toLowerCase().includes(searchTerm));
        renderDropdown(filteredPages);
        pageDropdown.style.display = 'block'; // Show the dropdown
    });

    // Show all options when the input is focused
    pageSelector.addEventListener('focus', () => {
        renderDropdown(pages); // Render all pages
        pageDropdown.style.display = 'block'; // Show the dropdown
    });

    // Hide the dropdown when clicking outside
    document.addEventListener('click', (event) => {
        if (!pageSelector.contains(event.target) && !pageDropdown.contains(event.target)) {
            pageDropdown.style.display = 'none'; // Hide the dropdown
        }
    });

    pageSelector.addEventListener('change', () => {
        const selectedPage = pageSelector.value;

        // Fetch page sections from the backend
        fetch('/api/pages/sections')
            .then(res => res.json())
            .then(pageSections => {
                const pageData = pageSections[selectedPage];
                pagePanels.innerHTML = '<h3>Page Panels</h3>'; // Ensure the title remains visible

                if (pageData) {
                    if (placeholder) placeholder.style.display = 'none'; // Hide placeholder
                    Object.keys(pageData).forEach(panelName => {
                        const panelDiv = document.createElement('div');
                        panelDiv.textContent = panelName;
                        panelDiv.classList.add('droppable');
                        panelDiv.dataset.panelName = panelName;

                        // Add delete button for panel
                        addDeleteButton(panelDiv, 'panel', panelName, selectedPage);

                        const sections = pageData[panelName];
                        const sectionsUl = document.createElement('ul');
                        sections.forEach(section => {
                            const sectionName = typeof section === 'string' ? section : Object.keys(section)[0];
                            const sectionAttributes = typeof section === 'string' ? {} : section[sectionName];

                            const sectionLi = document.createElement('li');
                            sectionLi.textContent = sectionName;
                            sectionLi.draggable = true;
                            sectionLi.dataset.sectionName = sectionName;

                            // Add delete button for section
                            addDeleteButton(sectionLi, 'section', sectionName, selectedPage, panelName);

                            // Add edit button for section
                            const editButton = document.createElement('button');
                            editButton.textContent = 'Edit';
                            editButton.addEventListener('click', () => {
                                if (currentEditingSection) return; // Prevent opening multiple editors

                                currentEditingSection = sectionName; // Track the currently editing section
                                editButton.disabled = true; // Disable the edit button

                                const editorContainer = document.createElement('div');
                                sectionLi.appendChild(editorContainer);

                                renderSectionEditor(
                                    editorContainer,
                                    sectionAttributes,
                                    updatedAttributes => {
                                        fetch(`/api/pages/${selectedPage}`, {
                                            method: 'PUT',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                action: 'updateSection',
                                                panelName,
                                                sectionName,
                                                attributes: updatedAttributes
                                            })
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
                            sectionsUl.appendChild(sectionLi);
                        });

                        panelDiv.appendChild(sectionsUl);
                        pagePanels.appendChild(panelDiv);
                    });
                } else {
                    if (placeholder) placeholder.style.display = 'block'; // Show placeholder
                }
            });
    });
}
