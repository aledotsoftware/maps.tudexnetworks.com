## 2024-04-02 - Testing headless playwright scripts
**Learning:** When testing Argenmap with Playwright in a headless environment, UI interactions (like clicking buttons that open modals) might fail due to visibility constraints or complex event logic.
**Action:** Use `page.evaluate()` to directly interact with the DOM elements via JavaScript (e.g., `document.getElementById('element-id').click()`) to bypass these issues.

## 2024-05-13 - Native Button Refactor
**Learning:** Custom UI elements in Argenmap often incorrectly use non-interactive tags like `<a>` or `<div>` for buttons with `role="button"`. Native buttons are preferred for accessibility because they get built-in keyboard accessibility, but they need their default styles reset.
**Action:** Refactor these to use native `<button type="button">` elements, resetting default styles (e.g., `border: none; padding: 0; background: transparent;`) to maintain the original layout.
