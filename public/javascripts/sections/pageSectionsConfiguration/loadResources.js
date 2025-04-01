export function loadAvailablePanels() {
    const availablePanels = document.getElementById('availablePanels');
    if (!availablePanels) {
        console.error('Error: Element with id "availablePanels" not found in the DOM.');
        return;
    }

    fetch('/api/panels')
        .then(res => res.json())
        .then(panels => {
            availablePanels.innerHTML = ''; // Clear existing panels
            panels.Panels.forEach(panel => {
                const div = document.createElement('div');
                div.textContent = panel.PanelName;
                div.draggable = true;
                div.dataset.panelName = panel.PanelName;
                availablePanels.appendChild(div);
            });
        })
        .catch(error => {
            console.error('Error fetching available panels:', error);
        });
}

export function loadAvailableSections() {
    const availableSections = document.getElementById('availableSections');
    if (!availableSections) {
        console.error('Error: Element with id "availableSections" not found in the DOM.');
        return;
    }

    fetch('/api/sections')
        .then(res => res.json())
        .then(sections => {
            availableSections.innerHTML = ''; // Clear existing sections
            Object.keys(sections).forEach(sectionName => {
                const div = document.createElement('div');
                div.textContent = sectionName;
                div.draggable = true;
                div.dataset.sectionName = sectionName;
                availableSections.appendChild(div);
            });
        })
        .catch(error => {
            console.error('Error fetching available sections:', error);
        });
}
