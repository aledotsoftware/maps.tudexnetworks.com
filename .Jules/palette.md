## 2024-04-02 - Testing headless playwright scripts
**Learning:** When testing Argenmap with Playwright in a headless environment, UI interactions (like clicking buttons that open modals) might fail due to visibility constraints or complex event logic.
**Action:** Use `page.evaluate()` to directly interact with the DOM elements via JavaScript (e.g., `document.getElementById('element-id').click()`) to bypass these issues.

## 2024-05-14 - Interactive Elements Accessibility (Anchor to Button Refactor)
**Learning:** In vanilla JS applications like Argenmap, custom UI controls (like modal close buttons) often incorrectly use non-interactive `<a>` or `<div>` tags attached with `role="button"`, `tabindex="0"`, and custom `keydown` event listeners to simulate interactivity. This is a brittle anti-pattern.
**Action:** When encountering simulated buttons, refactor them to use native `<button type="button">` elements. This inherently provides correct keyboard support (Enter/Space to activate) and focusability, allowing the removal of redundant ARIA roles and custom keyboard event listeners. Always accompany this with CSS resets (e.g., `border: none; background: transparent; padding: 0; line-height: 1;`) and a clear `:focus-visible` ring to maintain visual parity while significantly improving accessibility.
