export function loadAvailablePanels() {
    const availablePanels = document.getElementById("availablePanels");
    if (!availablePanels) {
        console.error('Error: Element with id "availablePanels" not found in the DOM.');
        return;
    }

    fetch("/api/pageSections/panels")
        .then(res => res.json())
        .then(panels => {
            availablePanels.innerHTML = ""; // Clear existing panels
            if (panels) {
                for (const panel of panels) {
                    if (panel?.name) {
                        const div = document.createElement("div");
                        div.textContent = panel.name;
                        div.draggable = true;
                        div.dataset.panelName = panel.name;
                        availablePanels.appendChild(div);
                    }
                }
            }
        })
        .catch(error => {
            console.error("Error fetching available panels:", error);
        });
}

export function loadAvailableSections() {
    const availableSections = document.getElementById("availableSections");
    if (!availableSections) {
        console.error('Error: Element with id "availableSections" not found in the DOM.');
        return;
    }

    fetch("/api/pageSections/sections")
        .then(res => res.json())
        .then(sections => {
            availableSections.innerHTML = ""; // Clear existing sections
            if (sections) {
                for (const section of sections) {
                    if (section?.name) {
                        const div = document.createElement("div");
                        div.textContent = section.name;
                        div.draggable = true;
                        div.dataset.sectionName = section.name;
                        availableSections.appendChild(div);
                    }
                }
            }
        })
        .catch(error => {
            console.error("Error fetching available sections:", error);
        });
}
