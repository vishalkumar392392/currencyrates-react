# CurrencyRates.module.css — Property Reference

---

## `.container`

```css
padding: 16px;
```
Adds breathing room between the table and the edges of the page so it doesn't touch the viewport walls.

```css
font-family: Arial, sans-serif;
```
Sets a clean, neutral system font for the entire table. `sans-serif` is the fallback if Arial is unavailable.

```css
font-size: 13px;
```
Slightly smaller than the browser default (16px) because the table has many columns — tighter text fits more data without horizontal scrolling.

---

## `.tableWrapper`

```css
overflow-x: auto;
```
When the table is wider than the screen (11 columns), a horizontal scrollbar appears on the wrapper instead of breaking the page layout.

```css
overflow-y: auto;
```
When the table has many rows exceeding `max-height`, a vertical scrollbar appears inside the wrapper — the header stays visible (see sticky thead).

```css
max-height: 600px;
```
Caps the table height so it doesn't push other page content down. Combined with `overflow-y: auto`, rows scroll inside this fixed window.

```css
border: 1px solid #d0d0d0;
```
Draws a subtle grey border around the entire table container, giving it a card-like boundary.

```css
border-radius: 4px;
```
Slightly rounds the corners of the wrapper for a modern, soft look instead of sharp edges.

---

## `.table`

```css
width: 100%;
```
Stretches the table to fill the full width of `.tableWrapper` so columns distribute evenly.

```css
border-collapse: collapse;
```
Merges adjacent cell borders into a single line. Without this, each cell has a double border gap between it and its neighbour.

```css
white-space: nowrap;
```
Prevents cell content from wrapping onto a new line by default, keeping each row a single line tall. Individual elements can override this.

---

## `.table thead`

```css
position: sticky;
```
Takes the `thead` out of normal scroll flow so it can be pinned.

```css
top: 0;
```
Pins the header to the top edge of the scrollable `.tableWrapper`. As the user scrolls rows, the column headers stay visible.

```css
z-index: 1;
```
Ensures the sticky header renders on top of body rows that scroll beneath it. Without this, row content would bleed over the header.

---

## `.table th`

```css
background-color: #f5f5f5;
```
Light grey background distinguishes header cells from data rows and makes the sticky header visually solid (not transparent) as rows scroll under it.

```css
border: 1px solid #d0d0d0;
```
Draws grid lines around each header cell, consistent with the table wrapper border colour.

```css
padding: 8px 10px;
```
`8px` top/bottom and `10px` left/right — slightly more padding than data cells to give headers more visual weight.

```css
text-align: center;
```
Centers header text horizontally so it lines up above the centered data values below.

```css
font-weight: 600;
```
Semi-bold text makes headers stand out from the regular-weight data rows.

```css
color: #333;
```
Dark grey (not pure black) for softer, readable header text.

```css
max-width: 120px;
```
Caps each column width so wide labels don't stretch the table. Combined with wrapping below, long labels wrap within the cell.

```css
white-space: normal;
```
Overrides the `white-space: nowrap` set on `.table`, allowing header labels to wrap across multiple lines inside the 120px cap.

```css
word-break: break-word;
```
If a single word is longer than `max-width`, it breaks mid-word rather than overflowing the cell.

```css
line-height: 1.3;
```
Tightens line spacing for wrapped header text so two-line headers don't become too tall.

---

## `.table td`

```css
border: 1px solid #e0e0e0;
```
Slightly lighter than the header border (`#d0d0d0`) — data cell grid lines are subtler so the header border stands out more.

```css
padding: 6px 10px;
```
Compact vertical padding (`6px`) keeps rows tight; `10px` horizontal padding gives numbers space from cell walls.

```css
text-align: center;
```
Centers numeric values in all data cells for easy column-by-column comparison.

```css
color: #444;
```
Slightly lighter than the header text colour (`#333`) — data values are secondary to the headers visually.

```css
max-width: 120px;
```
Same cap as headers, so columns stay aligned and consistent in width.

```css
overflow: hidden;
```
Clips any text that exceeds `max-width` instead of overflowing into adjacent cells.

```css
text-overflow: ellipsis;
```
Replaces clipped overflow text with `…` so the user knows the value is truncated (e.g. "BRL BRAZIL R…").

```css
white-space: nowrap;
```
Keeps numeric values and currency names on a single line — required for `text-overflow: ellipsis` to work.

```css
position: relative;
```
Creates a positioning context for the absolutely positioned `.tooltipBox` child, so the tooltip appears relative to this cell.

```css
cursor: default;
```
Shows the standard arrow cursor on cells instead of the text I-beam, since cells are not editable.

---

## `.table td:first-child`

```css
text-align: left;
```
The first column holds the currency description (text), so left-align reads more naturally than center for labels.

---

## `.rowEven` / `.rowOdd`

```css
background-color: #ffffff;  /* even */
background-color: #f9f9f9;  /* odd */
```
Alternating white and very light grey rows (zebra striping) helps the eye track across a wide row without losing its place across 11 columns.

---

## `.table tbody tr:hover`

```css
background-color: #eef4fb;
```
A soft blue tint highlights the row under the cursor, making it easy to read across all columns for a specific currency.

---

## `.tooltipWrapper`

```css
position: relative;
```
Required so that the absolutely positioned `.tooltipBox` inside it is anchored to this element, not the page.

```css
display: block;
```
Makes the wrapper fill the full cell width so the tooltip centres correctly over the cell content.

```css
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
```
These three together truncate long values with `…` inside the wrapper. They mirror the `td` rules because the wrapper is the actual text container.

---

## `.tooltipWrapper:hover .tooltipBox`

```css
display: block;
```
Shows the tooltip only when the user hovers over the wrapper. The default state of `.tooltipBox` is `display: none`.

---

## `.tooltipBox`

```css
display: none;
```
Hidden by default — shown only on hover (see above).

```css
position: absolute;
```
Removes the tooltip from normal document flow so it floats over other content.

```css
top: calc(100% + 4px);
```
Places the tooltip 4px below the bottom edge of the cell so it doesn't overlap the truncated value.

```css
left: 50%;
transform: translateX(-50%);
```
`left: 50%` moves the tooltip's left edge to the cell's horizontal midpoint. `translateX(-50%)` shifts it back half its own width — the result is perfect horizontal centering over the cell.

```css
background: #fff;
border: 1px solid #ccc;
border-radius: 4px;
padding: 4px 10px;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
```
Styles the tooltip as a small floating card: white background, light border, rounded corners, compact padding, and a drop shadow to lift it above the table visually.

```css
font-size: 12px;
color: #333;
```
Slightly smaller than the table's base 13px so the tooltip looks like a secondary hint, not competing with cell content.

```css
z-index: 10;
```
Ensures the tooltip renders above the sticky header (`z-index: 1`) and all other content.

```css
pointer-events: none;
```
The tooltip itself cannot receive mouse events. Without this, moving the cursor onto the tooltip would keep triggering hover, causing a flicker loop.

```css
white-space: nowrap;
```
Prevents the full untruncated value inside the tooltip from wrapping — it always shows on one line.

---

## `.loading` / `.error`

```css
padding: 32px;
text-align: center;
font-size: 14px;
color: #666;
```
Centers the status message with generous padding so it doesn't look cramped. Slightly larger than table text (14px vs 13px) for legibility.

```css
color: #c0392b;  /* .error only */
```
Red colour on the error state makes it immediately distinguishable from the neutral loading state.
