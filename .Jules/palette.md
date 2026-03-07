
## 2024-03-07 - Add accessibility to div custom buttons
**Learning:** `<div>` or `<a>` elements acting as buttons need `role="button"`, `tabindex="0"`, `aria-label`, and `keydown` event listeners to provide full keyboard and screen reader support, unlike native `<button>` tags.
**Action:** When adding interactivity to non-button elements, always configure their ARIA roles and add explicit `keydown` support for `Enter` and `Space` keys to mimic native button behavior.
