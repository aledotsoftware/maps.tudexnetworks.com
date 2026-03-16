
## 2024-03-07 - Add accessibility to div custom buttons
**Learning:** `<div>` or `<a>` elements acting as buttons need `role="button"`, `tabindex="0"`, `aria-label`, and `keydown` event listeners to provide full keyboard and screen reader support, unlike native `<button>` tags.
**Action:** When adding interactivity to non-button elements, always configure their ARIA roles and add explicit `keydown` support for `Enter` and `Space` keys to mimic native button behavior.

## 2024-05-18 - Dynamically rendered icon-only buttons
**Learning:** Icon-only buttons rendered dynamically through JavaScript often lack text context. When mapping over configurations to render buttons with icons (`<i class="..."></i>`), screen readers receive empty context unless `aria-label` or `title` is explicitly set and the decorative icon is hidden using `aria-hidden="true"`.
**Action:** When dynamically constructing `<button>` elements that only display an icon, always add `aria-label` (and optionally `title` for tooltip support) using the object's `name` or `label` property, and apply `aria-hidden="true"` to the inner `<i>` or `<img>` element.

## 2024-05-24 - Avoid redundant aria-labels on inner icons
**Learning:** Adding `aria-label` on inner `<i>` or `<img>` elements within a container (like `<button>`) that already has an `aria-label` creates redundant or confusing readouts for screen reader users. Screen readers often announce the container's label followed by the inner element's label.
**Action:** Apply `aria-label` only to the interactive parent container (e.g., the `<button>` or `<a>` with `role="button"`) to provide the necessary context, and use `aria-hidden="true"` on the inner decorative icon (`<i>` or `<img>`) to ensure it is ignored by screen readers.
