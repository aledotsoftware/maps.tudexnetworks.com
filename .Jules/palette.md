
## 2024-03-07 - Add accessibility to div custom buttons
**Learning:** `<div>` or `<a>` elements acting as buttons need `role="button"`, `tabindex="0"`, `aria-label`, and `keydown` event listeners to provide full keyboard and screen reader support, unlike native `<button>` tags.
**Action:** When adding interactivity to non-button elements, always configure their ARIA roles and add explicit `keydown` support for `Enter` and `Space` keys to mimic native button behavior.

## 2024-05-18 - Dynamically rendered icon-only buttons
**Learning:** Icon-only buttons rendered dynamically through JavaScript often lack text context. When mapping over configurations to render buttons with icons (`<i class="..."></i>`), screen readers receive empty context unless `aria-label` or `title` is explicitly set and the decorative icon is hidden using `aria-hidden="true"`.
**Action:** When dynamically constructing `<button>` elements that only display an icon, always add `aria-label` (and optionally `title` for tooltip support) using the object's `name` or `label` property, and apply `aria-hidden="true"` to the inner `<i>` or `<img>` element.

## 2024-06-18 - Screen reader announcements on nested elements
**Learning:** Adding `aria-label` to decorative elements like `<i>` inside an already accessible interactive parent container (like `<button aria-label="...">`) causes redundant and confusing announcements for screen reader users. The screen reader will announce the parent's label and then the child's label.
**Action:** When an interactive element has a descriptive `aria-label`, inner decorative elements (like icons) must use `aria-hidden="true"` instead of `aria-label` to prevent double announcements.

## 2024-03-21 - Dynamic aria-pressed attribute for custom toggle buttons
**Learning:** For custom vanilla JS toggle buttons (e.g., those activating map tools), applying `role="button"` and an initial `aria-pressed="false"` isn't enough; the `aria-pressed` attribute must be dynamically updated in the click/keydown handlers to accurately reflect the active state to screen readers, and styles should generally target the container to avoid overriding the native or ARIA behavior.
**Action:** Always ensure that toggle buttons have a dynamic update to their `aria-pressed` attribute (toggling between `"true"` and `"false"`) in the JavaScript code handling the state changes.

## 2024-05-18 - Announce Dynamic Numerical Indicators with aria-live
**Learning:** For dynamic numerical indicators (like zoom levels), simply updating the number inside a container isn't enough for screen readers. The element needs `aria-live="polite"` and `aria-atomic="true"` to announce changes. Also, wrapping the value with an `.sr-only` descriptive prefix ensures screen readers provide context (e.g., "Zoom: 5" instead of just "5"). Furthermore, avoid using anchor tags (`<a>`) without `href` as generic non-interactive containers; use `<div>` or `<span>` instead.
**Action:** When adding or fixing dynamic numeric values (like pagination, zoom levels, or counters), ensure they have `aria-live` and a visually hidden `.sr-only` label if context is missing.
