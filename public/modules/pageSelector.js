import { addDeleteButton } from './utils.js';
import { renderSectionEditor } from './sectionEditor.js'; // Reuse the section editor logic

export function initializePageSelector() {
    const pageSelector = document.getElementById('pageSelector');
    const pagePanels = document.getElementById('pagePanels');

    // Fetch pages from pages.config.json
    fetch('/api/pages/config')
        .then(res => res.json())
        .then(pages => {
            pageSelector.innerHTML = ''; // Clear existing options
            pages.forEach(page => {
                const option = document.createElement('option');
                option.value = page.name;
                option.textContent = page.name;
                pageSelector.appendChild(option);
            });

            if (pages.length > 0) {
                pageSelector.value = pages[0].name;
                pageSelector.dispatchEvent(new Event('change'));
            }
        });

    pageSelector.addEventListener('change', () => {
        const selectedPage = pageSelector.value;

        // Fetch page sections from pageSections.config.json
        fetch('/api/pages/sections')
            .then(res => res.json())
            .then(pageSections => {
                const pageData = pageSections[selectedPage];
                if (pageData) {
                    pagePanels.innerHTML = '<h3>Page Panels</h3>';
                    Object.keys(pageData).forEach(panelName => {
                        const panelDiv = document.createElement('div');
                        panelDiv.textContent = panelName;
                        panelDiv.classList.add('droppable');
                        panelDiv.dataset.panelName = panelName;

                        // Add delete button for panel
                        addDeleteButton(panelDiv, 'panel', panelName, selectedPage);

                        const sections = pageData[panelName];
                        sections.forEach(section => {
                            const sectionName = typeof section === 'string' ? section : Object.keys(section)[0];
                            const sectionAttributes = typeof section === 'string' ? {} : section[sectionName];

                            const sectionDiv = document.createElement('div');
                            sectionDiv.textContent = sectionName;
                            sectionDiv.draggable = true;
                            sectionDiv.dataset.sectionName = sectionName;

                            // Add delete button for section
                            addDeleteButton(sectionDiv, 'section', sectionName, selectedPage, panelName);

                            // Add edit button for section
                            const editButton = document.createElement('button');
                            editButton.textContent = 'Edit';
                            editButton.addEventListener('click', () => {
                                const editorContainer = document.createElement('div');
                                sectionDiv.appendChild(editorContainer);

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
                                        });
                                    },
                                    () => {
                                        editorContainer.remove();
                                    },
                                    sectionName // Pass sectionName for restoring defaults
                                );
                            });

                            sectionDiv.appendChild(editButton);
                            panelDiv.appendChild(sectionDiv);
                        });

                        pagePanels.appendChild(panelDiv);
                    });
                }
            });
    });
}
