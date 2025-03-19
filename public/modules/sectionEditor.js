export function renderSectionEditor(container, attributes, onSave, onCancel) {
    container.innerHTML = ''; // Clear the container

    const form = document.createElement('form');
    form.id = 'sectionEditorForm';

    Object.entries(attributes).forEach(([key, value]) => {
        const label = document.createElement('label');
        label.textContent = key;

        let input;
        if (typeof value === 'boolean') {
            // Render dropdown for boolean attributes
            input = document.createElement('select');
            input.name = key;

            const trueOption = document.createElement('option');
            trueOption.value = 'true';
            trueOption.textContent = 'true';
            trueOption.selected = value === true;

            const falseOption = document.createElement('option');
            falseOption.value = 'false';
            falseOption.textContent = 'false';
            falseOption.selected = value === false;

            input.appendChild(trueOption);
            input.appendChild(falseOption);
        } else {
            // Render text input for other types
            input = document.createElement('input');
            input.type = 'text';
            input.name = key;
            input.value = value;
        }

        input.dataset.type = typeof value; // Store the original type
        form.appendChild(label);
        form.appendChild(input);
    });

    const saveButton = document.createElement('button');
    saveButton.type = 'submit';
    saveButton.textContent = 'Save';

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', onCancel);

    form.appendChild(saveButton);
    form.appendChild(cancelButton);

    form.addEventListener('submit', e => {
        e.preventDefault();
        const updatedAttributes = {};
        Array.from(form.querySelectorAll('input, select')).forEach(input => {
            const originalType = input.dataset.type;
            let value = input.value;

            // Convert the value back to its original type
            if (originalType === 'boolean') {
                value = value === 'true';
            } else if (originalType === 'number') {
                value = parseFloat(value);
            }

            updatedAttributes[input.name] = value;
        });

        onSave(updatedAttributes);
    });

    container.appendChild(form);
}
