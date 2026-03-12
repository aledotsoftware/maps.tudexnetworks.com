
## 2024-03-07 - Add accessibility to div custom buttons
**Learning:** `<div>` or `<a>` elements acting as buttons need `role="button"`, `tabindex="0"`, `aria-label`, and `keydown` event listeners to provide full keyboard and screen reader support, unlike native `<button>` tags.
**Action:** When adding interactivity to non-button elements, always configure their ARIA roles and add explicit `keydown` support for `Enter` and `Space` keys to mimic native button behavior.

## 2024-05-18 - Dynamically rendered icon-only buttons
**Learning:** Icon-only buttons rendered dynamically through JavaScript often lack text context. When mapping over configurations to render buttons with icons (`<i class="..."></i>`), screen readers receive empty context unless `aria-label` or `title` is explicitly set and the decorative icon is hidden using `aria-hidden="true"`.
**Action:** When dynamically constructing `<button>` elements that only display an icon, always add `aria-label` (and optionally `title` for tooltip support) using the object's `name` or `label` property, and apply `aria-hidden="true"` to the inner `<i>` or `<img>` element.
