document.addEventListener('DOMContentLoaded', () => {
    const pageSelector = document.getElementById('pageSelector');
    const availablePanels = document.getElementById('availablePanels');
    const pagePanels = document.getElementById('pagePanels');
    const availableSections = document.getElementById('availableSections');

    // Load pages into the dropdown
    fetch('/api/pages')
        .then(res => res.json())
        .then(pages => {
            pages.forEach(page => {
                const option = document.createElement('option');
                option.value = page.name;
                option.textContent = page.name;
                pageSelector.appendChild(option);
            });

            // Automatically select the first page and trigger change event
            if (pages.length > 0) {
                pageSelector.value = pages[0].name;
                pageSelector.dispatchEvent(new Event('change'));
            }
        });

    // Load available panels
    fetch('/api/panels')
        .then(res => res.json())
        .then(panels => {
            panels.forEach(panel => {
                const div = document.createElement('div');
                div.textContent = panel.PanelName;
                div.draggable = false; // Panels are static
                availablePanels.appendChild(div);
            });
        });

    // Load available sections
    fetch('/api/sections')
        .then(res => res.json())
        .then(sections => {
            Object.keys(sections[0].Configuration.Sections_CONF.Sections).forEach(sectionName => {
                const div = document.createElement('div');
                div.textContent = sectionName;
                div.draggable = true;
                div.dataset.sectionName = sectionName;
                availableSections.appendChild(div);
            });
        });

    // Populate panels and sections for the selected page
    pageSelector.addEventListener('change', () => {
        const selectedPage = pageSelector.value;
        fetch('/api/pages')
            .then(res => res.json())
            .then(pages => {
                const pageData = pages.find(page => page.name === selectedPage);
                if (pageData) {
                    // Ensure "Page Panels" title remains visible
                    pagePanels.innerHTML = '<h3>Page Panels</h3>';

                    // Populate panels and sections
                    Object.keys(pageData.panels).forEach(panelName => {
                        const panelDiv = document.createElement('div');
                        panelDiv.textContent = panelName;
                        panelDiv.classList.add('droppable');
                        panelDiv.dataset.panelName = panelName;

                        // Populate sections for this panel
                        const sections = pageData.panels[panelName];
                        sections.forEach(section => {
                            const sectionName = typeof section === 'string' ? section : Object.keys(section)[0];
                            const sectionDiv = document.createElement('div');
                            sectionDiv.textContent = sectionName;
                            sectionDiv.draggable = true;
                            sectionDiv.dataset.sectionName = sectionName;
                            panelDiv.appendChild(sectionDiv);
                        });

                        pagePanels.appendChild(panelDiv);
                    });
                }
            });
    });

    // Drag-and-drop logic for sections
    document.addEventListener('dragstart', e => {
        if (e.target.dataset.sectionName) {
            e.dataTransfer.setData('text/plain', e.target.dataset.sectionName);
        }
    });

    document.addEventListener('dragover', e => {
        if (e.target.classList.contains('droppable')) {
            e.preventDefault();
        }
    });

    document.addEventListener('drop', e => {
        if (e.target.classList.contains('droppable')) {
            e.preventDefault();
            const sectionName = e.dataTransfer.getData('text/plain');
            const panelName = e.target.dataset.panelName;
            const selectedPage = pageSelector.value;

            // Update the backend
            fetch(`/api/pages/${selectedPage}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'addSection',
                    panelName,
                    sectionName
                })
            }).then(() => {
                // Update the UI
                const sectionDiv = document.querySelector(`[data-section-name="${sectionName}"]`);
                if (sectionDiv) {
                    e.target.appendChild(sectionDiv);
                }
            });
        }
    });
});
