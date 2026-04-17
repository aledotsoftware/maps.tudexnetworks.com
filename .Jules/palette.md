## 2024-04-02 - Testing headless playwright scripts
**Learning:** When testing Argenmap with Playwright in a headless environment, UI interactions (like clicking buttons that open modals) might fail due to visibility constraints or complex event logic.
**Action:** Use `page.evaluate()` to directly interact with the DOM elements via JavaScript (e.g., `document.getElementById('element-id').click()`) to bypass these issues.

## 2024-04-17 - Button flex layout stretching
**Learning:** When replacing `<a>` tags with native `<button>` elements, if the parent container is a flex container with default `align-items: stretch`, the button's `inline-block` behavior can cause it to stretch vertically to match the container's height, distorting the `focus-visible` ring.
**Action:** Explicitly set `align-self: center` (or equivalent layout constraints) on the converted `<button>` class in CSS to preserve its intended vertical size and focus ring proportions.
