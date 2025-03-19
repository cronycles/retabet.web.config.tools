export function renderSectionEditor(container, attributes, onSave, onCancel, sectionName) {
    container.innerHTML = ''; // Clear the container

    const form = document.createElement('form');
    form.id = 'sectionEditorForm';

    const fields = {}; // Store references to input fields for easy updates

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
        fields[key] = input; // Save reference to the input field
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

    const restoreDefaultsButton = document.createElement('button');
    restoreDefaultsButton.type = 'button';
    restoreDefaultsButton.textContent = 'Restore Defaults';
    restoreDefaultsButton.addEventListener('click', () => {
        fetch('/api/sections')
            .then(res => res.json())
            .then(data => {
                const defaultAttributes = data[0].Configuration.Sections_CONF.Sections[sectionName];
                if (!defaultAttributes) {
                    console.error('Default attributes not found for section:', sectionName);
                    return;
                }

                // Update form fields with default attributes
                Object.entries(defaultAttributes).forEach(([key, value]) => {
                    if (fields[key]) {
                        if (fields[key].dataset.type === 'boolean') {
                            fields[key].value = value ? 'true' : 'false';
                        } else {
                            fields[key].value = value;
                        }
                    }
                });
            });
    });

    form.appendChild(saveButton);
    form.appendChild(cancelButton);
    form.appendChild(restoreDefaultsButton);

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
