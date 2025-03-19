export function loadAvailablePanels() {
    const availablePanels = document.getElementById('availablePanels');
    fetch('/api/panels')
        .then(res => res.json())
        .then(panels => {
            panels.forEach(panel => {
                const div = document.createElement('div');
                div.textContent = panel.PanelName;
                div.draggable = false;
                availablePanels.appendChild(div);
            });
        });
}

export function loadAvailableSections() {
    const availableSections = document.getElementById('availableSections');
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
}
