# Task Plan: Scratchpad Launcher — Eisenhower Matrix Link Launcher

## Goal
Build a Mac desktop app (Electron) with an Eisenhower Matrix (4-quadrant) layout where the user can drag-and-drop browser URLs into quadrants, assign custom names, move links between quadrants, delete links, and click to open them.

## Current Phase
Phase 3

## Phases

### Phase 1: Requirements & Discovery
- [x] Understand user intent
- [x] Decide tech stack — Electron chosen
- [x] Identify must-have vs nice-to-have features
- [x] Document findings in findings.md
- **Status:** complete

### Phase 2: Planning & Structure
- [x] Choose tech stack with rationale — Electron
- [x] Define data model (quadrants, links, custom names)
- [x] Design UI layout (4-quadrant grid, link cards, drag-drop zones)
- [x] Define persistence approach — JSON in userData
- [x] Confirm quadrant labels — classic Eisenhower
- [x] Confirm drag-between-quadrants — yes
- [x] Confirm delete links — yes
- **Status:** complete

### Phase 3: Implementation
- [ ] package.json — Electron project config
- [ ] main.js — main process, IPC, persistence
- [ ] preload.js — context bridge
- [ ] index.html — 4-quadrant UI structure
- [ ] style.css — styles
- [ ] renderer.js — drag-drop, link management, state
- [ ] npm install + smoke test
- **Status:** in_progress

### Phase 4: Testing & Verification
- [ ] Test drag-and-drop URL from browser
- [ ] Test drag-and-drop file from Finder
- [ ] Test drag link between quadrants
- [ ] Test delete link
- [ ] Test persistence across restarts
- [ ] Test Google Drive & Box URLs open correctly
- **Status:** pending

### Phase 5: Delivery
- [ ] Package as .app (optional — electron-builder)
- [ ] Review all features against requirements
- [ ] Deliver to user
- **Status:** pending

## Key Questions — All Resolved
1. ✅ Tech stack → Electron
2. ✅ No menubar required
3. ✅ Browser URLs primary, local paths secondary
4. ✅ Custom name prompted on drop
5. ✅ Classic Eisenhower quadrant labels
6. ✅ Drag between quadrants — yes
7. ✅ Delete links — yes
8. ✅ Node.js v25.8.1 installed

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| Electron | Cross-platform, fast to build, web tech, excellent drag-and-drop support |
| No menubar requirement | User can open via Dock/Spotlight; simpler to build |
| Eisenhower Matrix layout | 4 quadrants replace free-form sections; visual priority system |
| JSON persistence in userData | Cross-restart persistence, no DB required |
| Custom name prompt on drop | URLs not descriptive; user needs readable labels |
| preload.js context bridge | Modern Electron security pattern (contextIsolation on) |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
|       | 1       |            |

## Notes
- Classic quadrant labels: Urgent+Important, Not Urgent+Important, Urgent+Not Important, Not Urgent+Not Important
- Must run on macOS
- Node.js v25.8.1 installed
