export function initializeDragAndDrop() {
    document.addEventListener('dragstart', e => {
        if (e.target.dataset.sectionName) {
            e.dataTransfer.setData('text/plain', e.target.dataset.sectionName);
        }
        if (e.target.dataset.panelName) {
            e.dataTransfer.setData('panelName', e.target.dataset.panelName);
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
            const selectedPage = document.getElementById('pageSelector').value;

            fetch(`/api/pages/${selectedPage}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'addSection',
                    panelName,
                    sectionName
                })
            }).then(response => {
                if (response.ok) {
                    const sectionDiv = document.querySelector(`[data-section-name="${sectionName}"]`);
                    if (sectionDiv) {
                        e.target.appendChild(sectionDiv);
                    }
                } else {
                    console.error('Failed to add section to page');
                }
            });
        }

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
                    e.target.appendChild(panelDiv);
                } else {
                    console.error('Failed to add panel to page');
                }
            });
        }
    });
}
