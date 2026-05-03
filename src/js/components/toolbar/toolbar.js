/**
 * Represents a class that handles the visibility toggling of map tools buttons.
 * @class
 */
class ToolbarVisibilityToggler {
  constructor() {}

  /**
   * Creates a button element and appends it to the right side of the map.
   *
   * @param {string} id - The ID of the button element.
   * @param {string} btnId - The ID of the parent div element.
   * @param {string} title - The title attribute of the button element.
   * @param {string} iconClass - The CSS class for the icon element.
   */
  createBtn(id, btnId, title, iconClass) {
    const elem = document.createElement("div");
    elem.className = "leaflet-bar leaflet-control";
    elem.id = btnId;
    elem.style = "cursor: pointer; border: none;";

    const elemIcon = document.createElement("button");
    elemIcon.type = "button";
    elemIcon.id = id;
    elemIcon.title = title;

    elemIcon.setAttribute("aria-label", title);
    elemIcon.setAttribute("aria-expanded", "true");
    elemIcon.dataset.baseTitle = title.replace("Esconder ", "").replace("Mostrar ", ""); // e.g. "herramientas"

    elemIcon.innerHTML = `<span id="map-toolbar-span" class="${iconClass}" aria-hidden="true"></span>`;
    elem.appendChild(elemIcon);

    // Event listener for keyboard support


    // Event listener to toggle visibility of map buttons on click
    elemIcon.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent click event propagation
      // If e.target isn't the outer div, we can fall back to 'elem' which is lexically scoped
      const targetElem = elem;
      const targetBtnId = targetElem.id || btnId;

      const btnToolId =
        targetBtnId === "hideBtnRight"
          ? ".leaflet-top.leaflet-right"
          : ".leaflet-top.leaflet-left";
      const btnTool = document.querySelector(btnToolId);

      // Iterate through each child node of the selected maps buttons and toggle visibility
      this.toggleToolbarVisibility(btnTool);

      const isHidden = btnTool.childNodes.length > 0 && Array.from(btnTool.childNodes).some(node => node.id !== "hideBtnRight" && node.id !== "hideBtnLeft" && node.hidden);

      const newAction = isHidden ? "Mostrar" : "Esconder";
      const newTitle = `${newAction} ${targetElem.dataset.baseTitle || targetBtnId.replace('hideBtn', 'herramientas')}`;
      targetElem.title = newTitle;
      targetElem.setAttribute("aria-label", newTitle);
      targetElem.setAttribute("aria-expanded", isHidden ? "false" : "true");
    });

    // Event listener to prevent zoom on double-click
    elemIcon.addEventListener("dblclick", (e) => {
      e.stopPropagation(); // Prevent double-click event propagation
    });

    // Append the created button to the right side of the map
    document.querySelector(".leaflet-top.leaflet-right").appendChild(elem);
  }

  /**
   * Toggles the visibility of the child nodes of the selected maps buttons.
   * @param {HTMLElement} btnTool - The button tool element.
   */
  toggleToolbarVisibility(btnTool) {
    // Iterate through each child node of the selected maps buttons and toggle visibility
    btnTool.childNodes.forEach((node) => {
      // Toggle visibility for nodes that are not "hideBtnRight" or "hideBtnLeft"
      if (node.id !== "hideBtnRight" && node.id !== "hideBtnLeft") {
        node.hidden = !node.hidden;
      }
    });
  }

  /**
   * Hides or shows the toolbar based on the provided parameter.
   * @param {HTMLElement} toolbar - The toolbar element.
   * @param {boolean} show - Whether to show or hide the toolbar.
   */
  hideToolbar(toolbar, show) {
    toolbar.childNodes.forEach((node) => {
      if (node.id !== "hideBtnRight" && node.id !== "hideBtnLeft") {
        node.hidden = !show;
      }
    });

    // Update the visibility toggler buttons to reflect state
    const rightBtn = document.getElementById("map-toolbar-icon-right");
    const leftBtn = document.getElementById("map-toolbar-icon-left");

    [rightBtn, leftBtn].forEach(btn => {
      if (btn) {
        const newAction = show ? "Esconder" : "Mostrar";
        const baseTitle = btn.dataset.baseTitle || (btn.id === 'hideBtnRight' ? 'herramientas de dibujo' : 'herramientas');
        const newTitle = `${newAction} ${baseTitle}`;
        btn.title = newTitle;
        btn.setAttribute("aria-label", newTitle);
        btn.setAttribute("aria-expanded", show ? "true" : "false");
      }
    });
  }

  /**
   * Creates the component.
   * This method creates two buttons for the map toolbar and sets the initial visibility of the toolbars.
   * @param {boolean} showToolbar - A boolean value to show the toolbar.
   */
  createComponent(showToolbar) {
    // Create the toolbar buttons
    this.createBtn(
      "map-toolbar-icon-left",
      "hideBtnLeft",
      "Esconder herramientas",
      "fa-solid fa-wrench",
    );
    this.createBtn(
      "map-toolbar-icon-right",
      "hideBtnRight",
      "Esconder herramientas de dibujo",
      "bx bxs-pencil",
    );

    // Use an arrow function to ensure the 'this' context is preserved
    window.onload = () => {
      // Set the initial visibility of the toolbars based on the showToolbar parameter
      const rightToolbar = document.querySelector(".leaflet-top.leaflet-right");
      const leftToolbar = document.querySelector(".leaflet-top.leaflet-left");

      this.hideToolbar(rightToolbar, showToolbar);
      this.hideToolbar(leftToolbar, showToolbar);
    };
  }
}
