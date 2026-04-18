## 2024-04-02 - Testing headless playwright scripts
**Learning:** When testing Argenmap with Playwright in a headless environment, UI interactions (like clicking buttons that open modals) might fail due to visibility constraints or complex event logic.
**Action:** Use `page.evaluate()` to directly interact with the DOM elements via JavaScript (e.g., `document.getElementById('element-id').click()`) to bypass these issues.
## 2024-04-18 - Accessibility: Adding aria-expanded to Modals
**Learning:** For accessibility on elements that toggle popups or modals, the `aria-expanded` attribute is crucial to convey the open/closed state to screen readers.
**Action:** When adding modal toggling logic in vanilla JS, assure that `aria-expanded="false"` is initialized on the toggle button element, and properly toggle the attribute to `'true'` or `'false'` in the JavaScript opening/closing methods, along with ensuring decorative icons use `aria-hidden="true"`.
