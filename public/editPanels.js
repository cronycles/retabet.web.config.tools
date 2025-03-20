document.addEventListener('DOMContentLoaded', () => {
    const panelsList = document.getElementById('panelsList');
    const panelForm = document.getElementById('panelForm');
    const panelNameInput = document.getElementById('panelName');
    const attributesContainer = document.getElementById('attributesContainer');
    const formTitle = document.getElementById('formTitle');
    const cancelEditButton = document.getElementById('cancelEditButton');
    const addNewPanelButton = document.getElementById('addNewPanelButton');
    const panelFormContainer = document.getElementById('panelFormContainer');

    let editingPanel = null;

    // Load existing panels
    fetch('/api/panels')
        .then(res => res.json())
        .then(data => {
            data.forEach(panel => {
                const li = document.createElement('li');
                li.textContent = panel.PanelName;

                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.addEventListener('click', () => {
                    editingPanel = panel.PanelName;
                    formTitle.textContent = `Edit Panel: ${panel.PanelName}`;
                    panelNameInput.value = panel.PanelName;
                    panelNameInput.disabled = true; // Prevent editing the panel name
                    attributesContainer.innerHTML = '';
                    Object.entries(panel).forEach(([key, value]) => {
                        if (key === 'PanelName') return; // Skip the PanelName field

                        const label = document.createElement('label');
                        label.textContent = key;

                        const input = document.createElement('input');
                        input.type = 'text';
                        input.name = key;
                        input.value = value;

                        attributesContainer.appendChild(label);
                        attributesContainer.appendChild(input);
                    });
                    cancelEditButton.style.display = 'inline-block'; // Show the cancel button
                    panelFormContainer.style.display = 'block';
                });

                li.appendChild(editButton);
                panelsList.appendChild(li);
            });

            // Handle "Add New Panel" button
            addNewPanelButton.addEventListener('click', () => {
                editingPanel = null;
                formTitle.textContent = 'Add New Panel';
                panelNameInput.value = '';
                panelNameInput.disabled = false;
                attributesContainer.innerHTML = '';
                cancelEditButton.style.display = 'none';
                panelFormContainer.style.display = 'block';
            });
        });

    // Handle form submission
    panelForm.addEventListener('submit', e => {
        e.preventDefault();
        const panelName = panelNameInput.value;
        const attributes = {};
        Array.from(attributesContainer.querySelectorAll('input')).forEach(input => {
            attributes[input.name] = input.value;
        });

        const method = editingPanel ? 'PUT' : 'POST';
        const url = editingPanel ? `/api/panels/${editingPanel}` : '/api/panels';
        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ PanelName: panelName, ...attributes })
        }).then(() => {
            window.location.reload();
        });
    });

    // Handle cancel edit
    cancelEditButton.addEventListener('click', () => {
        editingPanel = null;
        formTitle.textContent = 'Add Panel';
        panelNameInput.value = '';
        panelNameInput.disabled = false; // Enable editing the panel name
        attributesContainer.innerHTML = '';
        cancelEditButton.style.display = 'none'; // Hide the cancel button
        panelFormContainer.style.display = 'none';
    });
});
