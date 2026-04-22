## 2024-04-02 - Testing headless playwright scripts
**Learning:** When testing Argenmap with Playwright in a headless environment, UI interactions (like clicking buttons that open modals) might fail due to visibility constraints or complex event logic.
**Action:** Use `page.evaluate()` to directly interact with the DOM elements via JavaScript (e.g., `document.getElementById('element-id').click()`) to bypass these issues.
## 2024-04-18 - Accessibility: Adding aria-expanded to Modals
**Learning:** For accessibility on elements that toggle popups or modals, the `aria-expanded` attribute is crucial to convey the open/closed state to screen readers.
**Action:** When adding modal toggling logic in vanilla JS, assure that `aria-expanded="false"` is initialized on the toggle button element, and properly toggle the attribute to `'true'` or `'false'` in the JavaScript opening/closing methods, along with ensuring decorative icons use `aria-hidden="true"`.

## 2024-04-12 - Semantic buttons for collapsible sections
**Learning:** Collapsible section toggles (like layer groups) are often mistakenly implemented as `<div>` elements with click handlers, which breaks keyboard navigability and screen reader interaction. Simply adding `tabindex` and ARIA attributes isn't enough as it requires manual keydown handling for Space and Enter.
**Action:** Always use native `<button type="button">` elements for section toggles to ensure built-in keyboard support. When doing so, remember to reset default button styles (border, padding, background) and add `:focus-visible` styles with `outline-offset` to provide clear visual feedback without disrupting the layout. Combine this with `aria-expanded` to communicate state accurately to screen readers.

## 2024-04-22 - Replacing non-interactive tags with native buttons
**Learning:** Custom UI elements like "close modal" buttons are often incorrectly implemented as `<a>` tags with `role="button"` and `tabindex="0"`, requiring manual handling of `keydown` events for space/enter.
**Action:** Refactor these to native `<button type="button">` to ensure built-in keyboard accessibility and native event handling. Apply proper reset styles (`border: none; background: transparent; padding: 0; cursor: pointer;`) and explicitly define `:focus-visible` to guarantee keyboard focus indicators without relying on complex custom event listeners.
