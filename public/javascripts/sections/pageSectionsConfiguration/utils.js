export function addDeleteButton(element, type, name, pageName, panelName = null) {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
        const position = Array.from(element.parentNode.children).indexOf(element); // Calcular posición actual
        const body = { action: type === 'panel' ? 'removePanel' : 'removeSection', panelName: name };
        if (type === 'section') {
            body.sectionName = name;
            body.panelName = panelName;
            body.position = position; // Usar posición actual
        }

        fetch(`/api/pageSections/${pageName}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        }).then(response => {
            if (response.ok) {
                element.remove();
            } else {
                console.error(`Failed to remove ${type} from page`);
            }
        });
    });
    element.appendChild(deleteButton);
}
