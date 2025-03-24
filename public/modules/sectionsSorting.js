export function enableSectionSorting(panelName, selectedPage) {
    if (panelName && selectedPage) {
        const droppablePanelsContainer = document.getElementById("droppablePanelsContainer");
        var panelDiv = droppablePanelsContainer.querySelector(`[data-panel-name="${panelName}"]`);
        const sectionsUl = panelDiv.querySelector("ul");
        if (!sectionsUl) return;

        sectionsUl.addEventListener("dragstart", e => {
            e.dataTransfer.setData("text/plain", e.target.dataset.sectionName);
            e.target.classList.add("dragging");
        });

        sectionsUl.addEventListener("dragover", e => {
            e.preventDefault();
            const dragging = sectionsUl.querySelector(".dragging");
            const afterElement = getDragAfterElement(sectionsUl, e.clientY);
            if (afterElement == null) {
                sectionsUl.appendChild(dragging);
            } else {
                sectionsUl.insertBefore(dragging, afterElement);
            }
        });

        sectionsUl.addEventListener("dragend", e => {
            e.target.classList.remove("dragging");
            const newOrder = Array.from(sectionsUl.children)
                .filter(li => li.dataset.sectionName != null)
                .map(li => li.dataset.sectionName);

            // Update the backend with the new order
            fetch(`/api/pages/${selectedPage}/panels/${panelName}/sections/order`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order: newOrder }),
            }).catch(err => console.error("Failed to update section order:", err));
        });

        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll("li:not(.dragging)")];
            return draggableElements.reduce(
                (closest, child) => {
                    const box = child.getBoundingClientRect();
                    const offset = y - box.top - box.height / 2;
                    if (offset < 0 && offset > closest.offset) {
                        return { offset, element: child };
                    } else {
                        return closest;
                    }
                },
                { offset: Number.NEGATIVE_INFINITY }
            ).element;
        }
    }
}
