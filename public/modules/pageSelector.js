export function initializePageSelector() {
    const pageSelector = document.getElementById('pageSelector');
    const pagePanels = document.getElementById('pagePanels');

    fetch('/api/pages')
        .then(res => res.json())
        .then(pages => {
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
        fetch('/api/pages')
            .then(res => res.json())
            .then(pages => {
                const pageData = pages.find(page => page.name === selectedPage);
                if (pageData) {
                    pagePanels.innerHTML = '<h3>Page Panels</h3>';
                    Object.keys(pageData.panels).forEach(panelName => {
                        const panelDiv = document.createElement('div');
                        panelDiv.textContent = panelName;
                        panelDiv.classList.add('droppable');
                        panelDiv.dataset.panelName = panelName;

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
}
