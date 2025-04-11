export function renderSectionEditor(container, attributes, onSave, onCancel, sectionName) {
    container.innerHTML = ''; // Clear the container

    const form = document.createElement('form');
    form.id = 'sectionEditorForm';

    const fields = {}; // Store references to input fields for easy updates

    Object.entries(attributes).forEach(([key, value]) => {
        const label = document.createElement('label');
        label.textContent = key;

        let input;
        if (key === 'Args') {
            // Render a textarea for the Args attribute (serialized JSON)
            input = document.createElement('textarea');
            input.name = key;
            input.value = JSON.stringify(value, null, 2); // Serialize the object
            input.classList.add('args-input'); // Add a class for validation
        } else if (typeof value === 'boolean') {
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
        fetch('/api/pageSections/sections')
            .then(res => res.json())
            .then(data => {
                const defaultAttributes = data[sectionName];
                if (!defaultAttributes) {
                    console.error('Default attributes not found for section:', sectionName);
                    return;
                }

                // Update form fields with default attributes
                Object.entries(defaultAttributes).forEach(([key, value]) => {
                    if (fields[key]) {
                        if (key === 'Args') {
                            fields[key].value = JSON.stringify(value, null, 2); // Serialize the object
                        } else if (fields[key].dataset.type === 'boolean') {
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
        let isValid = true;

        Array.from(form.querySelectorAll('input, select, textarea')).forEach(input => {
            const originalType = input.dataset.type;
            let value = input.value;

            // Validate and convert the Args field
            if (input.name === 'Args') {
                try {
                    value = JSON.parse(value); // Parse the JSON string back to an object
                    input.classList.remove('error'); // Remove error styling if valid
                } catch (error) {
                    input.classList.add('error'); // Add error styling
                    alert('Invalid JSON format in Args field.');
                    isValid = false;
                    return;
                }
            } else if (originalType === 'boolean') {
                value = value === 'true';
            } else if (originalType === 'number') {
                value = parseFloat(value);
            }

            updatedAttributes[input.name] = value;
        });

        if (!isValid) return; // Prevent form submission if validation fails

        onSave(updatedAttributes);
    });

    container.appendChild(form);
}
