# Findings & Decisions

## Requirements

### Must-Have
- Desktop app window (Electron) — no menubar requirement
- 4-quadrant Eisenhower Matrix layout
- Each quadrant has a label and contains link cards
- Drag a browser URL onto a quadrant → prompt for custom name → saves as a link card
- Link cards are clickable → opens URL in default browser
- Links persist between app launches (JSON file)
- Works with Google Drive URLs, Box URLs, any browser URL
- Custom display name per link (prompted on drop)

### Nice-to-Have
- Drag files from Finder → saved as local path link
- Move link cards between quadrants
- Reorder links within a quadrant
- Edit/delete links
- Light/dark mode

### Out of Scope (for now)
- Cloud sync
- Browser extension
- Menubar icon

## Research Findings

### Electron for Mac
- Electron bundles Chromium + Node.js — easy HTML/CSS/JS UI
- Drag-and-drop: `dragover` + `drop` events on quadrant divs capture `text/uri-list` (browser URL drops)
- Finder file drops captured via `event.dataTransfer.files`
- `shell.openExternal(url)` opens URL in default browser
- Persistence: `fs.writeFileSync` to a JSON file in `app.getPath('userData')`
- Packaging: `electron-builder` → produces `.app` for macOS

### Eisenhower Matrix Layout
- 2x2 CSS grid → 4 quadrants
- Classic labels:
  - Top-left: Urgent + Important (Do First)
  - Top-right: Not Urgent + Important (Schedule)
  - Bottom-left: Urgent + Not Important (Delegate)
  - Bottom-right: Not Urgent + Not Important (Eliminate)
- User may want custom labels — to confirm

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| Electron | Fast to build, web tech, drag-and-drop easy, packages to .app |
| 2x2 CSS grid | Simple layout for 4 quadrants, responsive |
| JSON in userData | Cross-restart persistence, no DB required |
| `shell.openExternal` | Correct Electron API to open URLs in browser |
| Custom name prompt | URLs not descriptive; modal/inline prompt on drop |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
|       |            |

## Resources
- Electron docs: https://www.electronjs.org/docs/latest
- electron-builder (packaging): https://www.electron.build
- Drag-and-drop in Electron renderer: standard HTML5 DataTransfer API
- `shell.openExternal`: https://www.electronjs.org/docs/latest/api/shell

## Visual/Browser Findings
-

---
*Update this file after every 2 view/browser/search operations*
