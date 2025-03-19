import { addDeleteButton } from './utils.js';

export function initializeDragAndDrop() {
    document.addEventListener('dragstart', e => {
        if (e.target.dataset.panelName) {
            e.dataTransfer.setData('panelName', e.target.dataset.panelName);
        } else if (e.target.dataset.sectionName) {
            e.dataTransfer.setData('sectionName', e.target.dataset.sectionName);
        }
    });

    document.addEventListener('dragover', e => {
        if (e.target.classList.contains('droppable')) {
            e.preventDefault();
        }
    });

    document.addEventListener('drop', e => {
        if (e.target.id === 'pagePanels') {
            e.preventDefault();
            const panelName = e.dataTransfer.getData('panelName');
            const selectedPage = document.getElementById('pageSelector').value;

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
                    panelDiv.classList.add('droppable');
                    panelDiv.dataset.panelName = panelName;

                    // Add delete button
                    addDeleteButton(panelDiv, 'panel', panelName, selectedPage);

                    e.target.appendChild(panelDiv);
                } else {
                    console.error('Failed to add panel to page');
                }
            });
        } else if (e.target.classList.contains('droppable')) {
            e.preventDefault();
            const sectionName = e.dataTransfer.getData('sectionName');
            const panelName = e.target.dataset.panelName;
            const selectedPage = document.getElementById('pageSelector').value;

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
                            const sectionDiv = document.createElement('div');
                            sectionDiv.textContent = sectionName;
                            sectionDiv.dataset.sectionName = sectionName;

                            // Add delete button
                            addDeleteButton(sectionDiv, 'section', sectionName, selectedPage, panelName);

                            e.target.appendChild(sectionDiv);
                        } else {
                            console.error('Failed to add section to panel');
                        }
                    });
                });
        }
    });
}
