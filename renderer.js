const QUADRANT_IDS = [
  'urgent-important',
  'not-urgent-important',
  'urgent-not-important',
  'not-urgent-not-important'
]

const DEFAULT_STATE = {
  quadrants: {
    'urgent-important':         { links: [] },
    'not-urgent-important':     { links: [] },
    'urgent-not-important':     { links: [] },
    'not-urgent-not-important': { links: [] }
  }
}

let state = JSON.parse(JSON.stringify(DEFAULT_STATE))
let pendingDrop = null // { quadrantId, url }

// ── Utilities ────────────────────────────────────────────────────────────────

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function extractFirstUrl(uriList) {
  if (!uriList) return null
  return uriList.split('\n').map(u => u.trim()).find(u => u && !u.startsWith('#')) || null
}

// ── Persistence ───────────────────────────────────────────────────────────────

async function loadState() {
  const saved = await window.electronAPI.loadData()
  if (saved && saved.quadrants) {
    QUADRANT_IDS.forEach(qid => {
      if (saved.quadrants[qid]) {
        state.quadrants[qid].links = saved.quadrants[qid].links || []
      }
    })
  }
  renderAll()
}

function saveState() {
  window.electronAPI.saveData(state)
}

// ── Rendering ─────────────────────────────────────────────────────────────────

function renderAll() {
  QUADRANT_IDS.forEach(renderQuadrant)
}

function renderQuadrant(qid) {
  const container = document.getElementById(`links-${qid}`)
  if (!container) return
  container.innerHTML = ''
  state.quadrants[qid].links.forEach(link => {
    container.appendChild(createLinkCard(link, qid))
  })
}

function createLinkCard(link, qid) {
  const card = document.createElement('div')
  card.className = 'link-card'
  card.draggable = true
  card.dataset.linkId = link.id
  card.dataset.quadrant = qid

  const icon = document.createElement('span')
  icon.className = 'link-icon'
  icon.textContent = link.url.startsWith('file://') ? '📁' : '🔗'

  const name = document.createElement('span')
  name.className = 'link-name'
  name.textContent = link.name
  name.title = link.url

  const del = document.createElement('button')
  del.className = 'delete-btn'
  del.textContent = '×'
  del.title = 'Remove link'
  del.addEventListener('click', e => {
    e.stopPropagation()
    deleteLink(qid, link.id)
  })

  // Open link on click (not on drag)
  card.addEventListener('click', () => {
    window.electronAPI.openUrl(link.url)
  })

  // Drag this card to another quadrant
  card.addEventListener('dragstart', e => {
    e.dataTransfer.setData('application/x-link-card', JSON.stringify({
      linkId: link.id,
      sourceQuadrant: qid
    }))
    e.dataTransfer.effectAllowed = 'move'
    setTimeout(() => card.classList.add('dragging'), 0)
  })

  card.addEventListener('dragend', () => {
    card.classList.remove('dragging')
  })

  card.appendChild(icon)
  card.appendChild(name)
  card.appendChild(del)
  return card
}

// ── State mutations ───────────────────────────────────────────────────────────

function addLink(qid, name, url) {
  state.quadrants[qid].links.push({ id: generateId(), name, url })
  renderQuadrant(qid)
  saveState()
}

function deleteLink(qid, linkId) {
  state.quadrants[qid].links = state.quadrants[qid].links.filter(l => l.id !== linkId)
  renderQuadrant(qid)
  saveState()
}

function moveLink(linkId, fromQid, toQid) {
  if (fromQid === toQid) return
  const link = state.quadrants[fromQid].links.find(l => l.id === linkId)
  if (!link) return
  state.quadrants[fromQid].links = state.quadrants[fromQid].links.filter(l => l.id !== linkId)
  state.quadrants[toQid].links.push(link)
  renderQuadrant(fromQid)
  renderQuadrant(toQid)
  saveState()
}

// ── Drag and drop on quadrants ────────────────────────────────────────────────

function setupQuadrantDrop(quadrantEl) {
  const qid = quadrantEl.dataset.quadrant

  quadrantEl.addEventListener('dragover', e => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    quadrantEl.classList.add('drag-over')
  })

  // Remove highlight when truly leaving the quadrant (not just moving to a child)
  quadrantEl.addEventListener('dragleave', e => {
    if (!quadrantEl.contains(e.relatedTarget)) {
      quadrantEl.classList.remove('drag-over')
    }
  })

  quadrantEl.addEventListener('drop', e => {
    e.preventDefault()
    quadrantEl.classList.remove('drag-over')

    // 1. Internal card move
    const cardData = e.dataTransfer.getData('application/x-link-card')
    if (cardData) {
      const { linkId, sourceQuadrant } = JSON.parse(cardData)
      moveLink(linkId, sourceQuadrant, qid)
      return
    }

    // 2. File drop from Finder
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      const filePath = window.electronAPI.getPathForFile(file)
      if (filePath) {
        showModal(qid, `file://${filePath}`, file.name)
        return
      }
    }

    // 3. Hyperlink drop from a webpage
    const uriList = e.dataTransfer.getData('text/uri-list')
    const plain = e.dataTransfer.getData('text/plain')
    const url = extractFirstUrl(uriList) || (plain && plain.startsWith('http') ? plain.trim() : null)

    if (url) {
      showModal(qid, url, '')
    }
  })
}

// ── Add button ────────────────────────────────────────────────────────────────

document.querySelectorAll('.add-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    showModal(btn.dataset.quadrant)
  })
})

// ── Modal ─────────────────────────────────────────────────────────────────────

function showModal(qid, prefillUrl = '', prefillName = '') {
  pendingDrop = { quadrantId: qid, url: prefillUrl }
  const urlInput = document.getElementById('modal-url-input')
  const nameInput = document.getElementById('modal-name')
  urlInput.value = prefillUrl
  nameInput.value = prefillName
  document.getElementById('modal-overlay').classList.remove('hidden')
  // Focus URL field if empty, otherwise jump to name
  if (!prefillUrl) {
    urlInput.focus()
  } else {
    nameInput.focus()
    nameInput.select()
  }
}

function hideModal() {
  document.getElementById('modal-overlay').classList.add('hidden')
  pendingDrop = null
}

document.getElementById('modal-save').addEventListener('click', () => {
  const url = document.getElementById('modal-url-input').value.trim()
  const name = document.getElementById('modal-name').value.trim()
  if (!url || !name || !pendingDrop) return
  // Always use the current URL field value (user may have edited it)
  addLink(pendingDrop.quadrantId, name, url)
  hideModal()
})

document.getElementById('modal-cancel').addEventListener('click', hideModal)

;['modal-url-input', 'modal-name'].forEach(id => {
  document.getElementById(id).addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      // Tab from URL to name, or submit from name
      if (id === 'modal-url-input') {
        document.getElementById('modal-name').focus()
      } else {
        document.getElementById('modal-save').click()
      }
    }
    if (e.key === 'Escape') hideModal()
  })
})

// Close modal if clicking outside the modal box
document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modal-overlay')) hideModal()
})

// Keep pendingDrop.url in sync as user types in URL field
document.getElementById('modal-url-input').addEventListener('input', e => {
  if (pendingDrop) pendingDrop.url = e.target.value.trim()
})

// ── Document-level dragover (keep drop from being rejected) ───────────────────

document.addEventListener('dragover', e => e.preventDefault())

// ── Init ──────────────────────────────────────────────────────────────────────

document.querySelectorAll('.quadrant').forEach(setupQuadrantDrop)
loadState()
