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
    elem.title = title;
    elem.style = "cursor: pointer;";
    elem.setAttribute("role", "button");
    elem.setAttribute("tabindex", "0");
    elem.setAttribute("aria-label", title);
    elem.setAttribute("aria-expanded", "true");

    const elemIcon = document.createElement("a");
    elemIcon.id = id;
    elemIcon.innerHTML = `<span id="map-toolbar-span" class="${iconClass}" aria-hidden="true"></span>`;
    elem.appendChild(elemIcon);

    // Event listener for keyboard support
    elem.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        elem.click();
      }
    });

    // Event listener to toggle visibility of map buttons on click
    elem.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent click event propagation
      const btnToolId =
        id === "hideBtnRight"
          ? ".leaflet-top.leaflet-right"
          : ".leaflet-top.leaflet-left";
      const btnTool = document.querySelector(btnToolId);

      // Iterate through each child node of the selected maps buttons and toggle visibility
      this.toggleToolbarVisibility(btnTool, elem, id);
    });

    // Event listener to prevent zoom on double-click
    elem.addEventListener("dblclick", (e) => {
      e.stopPropagation(); // Prevent double-click event propagation
    });

    // Append the created button to the right side of the map
    document.querySelector(".leaflet-top.leaflet-right").appendChild(elem);
  }

  /**
   * Toggles the visibility of the child nodes of the selected maps buttons.
   * @param {HTMLElement} btnTool - The button tool element.
   * @param {HTMLElement} toggleBtn - The button element that was clicked.
   * @param {string} id - The id of the button element.
   */
  toggleToolbarVisibility(btnTool, toggleBtn, id) {
    let isHidden = false;
    // Iterate through each child node of the selected maps buttons and toggle visibility
    btnTool.childNodes.forEach((node) => {
      // Toggle visibility for nodes that are not "hideBtnRight" or "hideBtnLeft"
      if (node.id !== "hideBtnRight" && node.id !== "hideBtnLeft") {
        node.hidden = !node.hidden;
        isHidden = node.hidden;
      }
    });

    if (toggleBtn) {
      const isRight = id === "hideBtnRight";
      const title = isHidden
        ? (isRight ? "Mostrar herramientas de dibujo" : "Mostrar herramientas")
        : (isRight ? "Esconder herramientas de dibujo" : "Esconder herramientas");

      toggleBtn.title = title;
      toggleBtn.setAttribute("aria-label", title);
      toggleBtn.setAttribute("aria-expanded", isHidden ? "false" : "true");
    }
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

    // Update button attributes
    const isRight = toolbar.classList.contains("leaflet-right");
    const toggleBtnId = isRight ? "hideBtnRight" : "hideBtnLeft";
    const toggleBtn = document.getElementById(toggleBtnId);

    if (toggleBtn) {
      const title = !show
        ? (isRight ? "Mostrar herramientas de dibujo" : "Mostrar herramientas")
        : (isRight ? "Esconder herramientas de dibujo" : "Esconder herramientas");

      // Ensure we target the outer div container which has the ARIA attributes
      const containerBtn = toggleBtn.parentElement;
      if (containerBtn && containerBtn.classList.contains('leaflet-control')) {
        containerBtn.title = title;
        containerBtn.setAttribute("aria-label", title);
        containerBtn.setAttribute("aria-expanded", show ? "true" : "false");
      }
    }
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
