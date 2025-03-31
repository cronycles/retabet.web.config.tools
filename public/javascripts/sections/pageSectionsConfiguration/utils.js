export function addDeleteButton(element, type, name, pageName, panelName = null, position = null) {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
        const body = { action: type === 'panel' ? 'removePanel' : 'removeSection', panelName: name };
        if (type === 'section') {
            body.sectionName = name;
            body.panelName = panelName;
            body.position = position; // Include position in the request
        }

        fetch(`/api/pages/${pageName}`, {
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
