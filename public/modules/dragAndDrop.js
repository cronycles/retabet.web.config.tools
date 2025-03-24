import { addDeleteButton } from './utils.js';
import { renderSectionEditor } from './sectionEditor.js';

export function initializeDragAndDrop() {
    document.addEventListener('dragstart', e => {
        if (e.target.dataset.panelName) {
            e.dataTransfer.setData('panelName', e.target.dataset.panelName);
        } else if (e.target.dataset.sectionName) {
            e.dataTransfer.setData('sectionName', e.target.dataset.sectionName);
        }
    });

    document.addEventListener('dragover', e => {
        const isAPlaceholder = e.target.classList.contains('placeholder-text');
        
        if (e.target.classList.contains('droppable') ||isAPlaceholder ) {
            e.preventDefault(); // Allow dropping
            e.target.classList.add('drag-over'); // Add visual feedback
        }
    });

    document.addEventListener('dragleave', e => {
        const isAPlaceholder = e.target.classList.contains('placeholder-text');
        
        if (e.target.classList.contains('droppable') ||isAPlaceholder) {
            e.target.classList.remove('drag-over'); // Remove visual feedback
        }
    });

    document.addEventListener('drop', e => {
        e.preventDefault();
        e.target.classList.remove('drag-over'); // Remove visual feedback

        const selectedPage = document.getElementById('pageSelector').value;

        // Allow dropping panels on the placeholder text
        const isDopPanelPlaceholder = e.target.id === 'dropPanelPlaceholder';
        if (e.target.id === 'panelsSectionContainer' || isDopPanelPlaceholder) {
            const panelName = e.dataTransfer.getData('panelName');
            if (panelName && selectedPage) {
                // Add the panel to the pageSections.config.json
                fetch(`/api/pages/${selectedPage}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'addPanel',
                        panelName
                    })
                }).then(response => {
                    if (response.ok) {
                        const panelDiv = document.createElement('div');
                        panelDiv.textContent = panelName;
                        panelDiv.dataset.panelName = panelName;

                        // Add delete button for the panel
                        addDeleteButton(panelDiv, 'panel', panelName, selectedPage);

                        const sectionsUl = document.createElement('ul');
                        sectionsUl.classList.add('droppable');
                        sectionsUl.dataset.panelName = panelName;

                        panelDiv.appendChild(sectionsUl);

                        var dopPanelPlaceholder = document.getElementById("dropPanelPlaceholder");
                        if (dopPanelPlaceholder) {
                            dopPanelPlaceholder.parentElement.insertBefore(panelDiv, dopPanelPlaceholder); // Insert before the placeholder
                        }
                    } else {
                        console.error('Failed to add panel to page');
                    }
                });
            }
        } else if (e.target.classList.contains('droppable') && e.target.dataset.panelName) {
            const sectionName = e.dataTransfer.getData('sectionName');
            const panelName = e.target.dataset.panelName;

            if (sectionName && panelName && selectedPage) {
                // Add the section to the panel in pageSections.config.json
                fetch('/api/sections')
                    .then(res => res.json())
                    .then(sections => {
                        const defaultAttributes = sections[0].Configuration.Sections_CONF.Sections[sectionName];
                        if (!defaultAttributes) {
                            console.error('Invalid section name');
                            return;
                        }

                        fetch(`/api/pages/${selectedPage}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                action: 'addSection',
                                panelName,
                                sectionName,
                                attributes: defaultAttributes
                            })
                        }).then(response => {
                            if (response.ok) {
                                const sectionLi = document.createElement('li');
                                sectionLi.textContent = sectionName;
                                sectionLi.dataset.sectionName = sectionName;
                                sectionLi.setAttribute('draggable', 'true');

                                // Add delete button for the section
                                addDeleteButton(sectionLi, 'section', sectionName, selectedPage, panelName);

                                // Add edit button for the section
                                const editButton = document.createElement('button');
                                editButton.textContent = 'Edit';
                                editButton.addEventListener('click', () => {
                                    const editorContainer = document.createElement('div');
                                    sectionLi.appendChild(editorContainer);

                                    renderSectionEditor(
                                        editorContainer,
                                        defaultAttributes,
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
                                            });
                                        },
                                        () => {
                                            editorContainer.remove();
                                        },
                                        sectionName // Pass sectionName for restoring defaults
                                    );
                                });

                                sectionLi.appendChild(editButton);
                                e.target.appendChild(sectionLi);
                            } else {
                                console.error('Failed to add section to panel');
                            }
                        });
                    });
            }
        }
    });
}
