(() => {
  const canvas = document.querySelector('#drawing-canvas');
  if (!canvas) return;

  const wrap = document.querySelector('.studio__paper-wrap');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const status = document.querySelector('#studio-status');
  const toolButtons = [...document.querySelectorAll('[data-tool]')];
  const colorInput = document.querySelector('#studio-color');
  const sizeInput = document.querySelector('#studio-size');
  const sizeOutput = document.querySelector('.studio-size output');
  const textEntry = document.querySelector('.studio-text-entry');
  const textInput = document.querySelector('#studio-text');
  const undoButton = document.querySelector('#undo-button');
  const redoButton = document.querySelector('#redo-button');
  const galleryGrid = document.querySelector('#community-grid');
  const galleryDialog = document.querySelector('#gallery-dialog');
  const galleryForm = document.querySelector('#gallery-form');
  const galleryPreview = document.querySelector('#gallery-preview');
  const sendDialog = document.querySelector('#send-art-dialog');
  const sendPreview = document.querySelector('#send-art-preview');
  const previewDialog = document.querySelector('#art-preview-dialog');
  const previewImage = document.querySelector('#art-preview-image');
  const previewCaption = document.querySelector('#art-preview-caption');
  const customCursor = document.querySelector('.custom-cursor');
  const cursorHome = customCursor?.parentElement;
  const STORAGE_KEY = 'arsh-playground-gallery-v1';
  const LIKES_KEY = 'arsh-playground-likes-v1';
  const labels = { pencil:'Pencil ready. Draw freely.', eraser:'Eraser ready. Sweep over a mark.', rectangle:'Drag to draw a rectangle.', circle:'Drag to draw a circle.', triangle:'Drag to draw a triangle.', line:'Drag to draw a straight line.', text:'Tap the paper to place your text.', fill:'Fill mode is on. New shapes will be filled.' };
  let tool = 'pencil';
  let lastShape = 'rectangle';
  let filledShapes = false;
  let color = colorInput.value;
  let thickness = Number(sizeInput.value);
  let drawing = false;
  let activePointer = null;
  let start = null;
  let previous = null;
  let beforeShape = null;
  let history = [];
  let historyIndex = -1;
  let hasMarks = false;
  const boundSampleLikes = new WeakSet();

  const getDpr = () => Math.min(window.devicePixelRatio || 1, 2);
  const copySurface = () => {
    const copy = document.createElement('canvas');
    copy.width = canvas.width; copy.height = canvas.height;
    copy.getContext('2d').drawImage(canvas, 0, 0);
    return copy;
  };
  const updateHistoryButtons = () => {
    undoButton.disabled = historyIndex <= 0;
    redoButton.disabled = historyIndex >= history.length - 1;
  };
  const remember = () => {
    history = history.slice(0, historyIndex + 1);
    history.push(copySurface());
    if (history.length > 32) history.shift();
    historyIndex = history.length - 1;
    updateHistoryButtons();
  };
  const restore = (snapshot) => {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (snapshot) ctx.drawImage(snapshot, 0, 0, canvas.width, canvas.height);
    ctx.restore();
  };
  const refreshMarks = () => {
    hasMarks = ctx.getImageData(0, 0, canvas.width, canvas.height).data.some((value, i) => i % 4 === 3 && value > 0);
  };
  const resizeCanvas = () => {
    const rect = wrap.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = getDpr();
    const old = copySurface();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);
    if (old.width && old.height) ctx.drawImage(old, 0, 0, old.width, old.height, 0, 0, rect.width, rect.height);
    refreshMarks();
  };
  const pointFrom = (event) => {
    const rect = canvas.getBoundingClientRect();
    return { x:(event.clientX - rect.left) * (rect.width ? canvas.clientWidth / rect.width : 1), y:(event.clientY - rect.top) * (rect.height ? canvas.clientHeight / rect.height : 1), pressure:event.pressure || .5 };
  };
  const setPaint = (isErase = false) => {
    ctx.globalCompositeOperation = isErase ? 'destination-out' : 'source-over';
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = isErase ? thickness * 2.8 : thickness;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  };
  const drawShape = (from, to, preview = false) => {
    ctx.save(); setPaint(); ctx.beginPath();
    const width = to.x - from.x; const height = to.y - from.y;
    if (tool === 'rectangle') ctx.rect(from.x, from.y, width, height);
    else if (tool === 'circle') ctx.ellipse(from.x + width / 2, from.y + height / 2, Math.abs(width / 2), Math.abs(height / 2), 0, 0, Math.PI * 2);
    else if (tool === 'triangle') { ctx.moveTo(from.x + width / 2, from.y); ctx.lineTo(to.x, to.y); ctx.lineTo(from.x, to.y); ctx.closePath(); }
    else if (tool === 'line') { ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y); }
    if (filledShapes && tool !== 'line') { ctx.globalAlpha = preview ? .22 : .24; ctx.fill(); ctx.globalAlpha = preview ? .7 : 1; }
    ctx.stroke(); ctx.restore();
  };
  const selectTool = (next) => {
    if (next === 'fill') {
      filledShapes = !filledShapes;
      const fillButton = toolButtons.find((button) => button.dataset.tool === 'fill');
      fillButton?.setAttribute('aria-pressed', String(filledShapes));
      fillButton?.classList.toggle('is-selected', filledShapes);
      if (filledShapes && !['rectangle','circle','triangle','line'].includes(tool)) tool = lastShape;
      else if (!filledShapes && tool === 'line') tool = 'pencil';
      status.textContent = filledShapes ? `Fill mode is on. ${tool} shapes will be filled.` : 'Fill mode is off. Shapes will be outlines.';
    } else {
      tool = next;
      if (['rectangle','circle','triangle','line'].includes(tool)) lastShape = tool;
    }
    toolButtons.filter((button) => button.dataset.tool !== 'fill').forEach((button) => {
      const selected = button.dataset.tool === tool;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    textEntry.hidden = tool !== 'text';
    canvas.classList.toggle('is-eraser', tool === 'eraser');
    if (next !== 'fill') status.textContent = labels[tool];
  };
  const localArtwork = () => {
    const output = document.createElement('canvas');
    output.width = canvas.width; output.height = canvas.height;
    const out = output.getContext('2d');
    out.fillStyle = '#fffdf9'; out.fillRect(0, 0, output.width, output.height);
    out.strokeStyle = 'rgba(82,75,66,.12)'; out.lineWidth = getDpr();
    const grid = 28 * getDpr();
    for (let x = grid; x < output.width; x += grid) { out.beginPath(); out.moveTo(x, 0); out.lineTo(x, output.height); out.stroke(); }
    for (let y = grid; y < output.height; y += grid) { out.beginPath(); out.moveTo(0, y); out.lineTo(output.width, y); out.stroke(); }
    out.drawImage(canvas, 0, 0);
    return output.toDataURL('image/png');
  };
  const readGallery = () => { try { const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); return Array.isArray(data) ? data : []; } catch { return []; } };
  const readLikes = () => { try { const data = JSON.parse(localStorage.getItem(LIKES_KEY) || '{}'); return data && typeof data === 'object' ? data : {}; } catch { return {}; } };
  const dateLabel = (date) => new Intl.DateTimeFormat(undefined, { month:'short', day:'numeric', year:'numeric' }).format(new Date(date));
  document.querySelectorAll('[data-preview-days-ago]').forEach((time) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - Number(time.dataset.previewDaysAgo || 0));
    time.dateTime = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    time.textContent = dateLabel(date);
  });
  const createLocalCard = (entry, index) => {
    const article = document.createElement('article'); article.className = 'wall-card wall-card--creation'; article.style.setProperty('--card-tilt', `${[-1.5,1.2,-.8,1.8][index % 4]}deg`);
    const art = document.createElement('button'); art.type = 'button'; art.className = 'wall-card__art'; art.setAttribute('aria-label', `Preview ${entry.caption || 'visitor artwork'} by ${entry.creator || 'Anonymous'}`);
    const image = document.createElement('img'); image.src = entry.image; image.alt = `${entry.caption || 'Visitor artwork'}, created by ${entry.creator || 'Anonymous'}`; art.append(image);
    art.addEventListener('click', () => openPreview(entry.image, `${entry.caption || 'A little creation'} — ${entry.creator || 'Anonymous'}`));
    const meta = document.createElement('div'); meta.className = 'wall-card__meta';
    const marker = document.createElement('p'); marker.className = 'wall-card__label'; marker.textContent = 'SAVED ON THIS DEVICE';
    const title = document.createElement('h3'); title.textContent = entry.caption || 'A little creation';
    const details = document.createElement('p'); details.textContent = `Made by ${entry.creator || 'Anonymous'} · ${dateLabel(entry.date)}`;
    const like = makeLikeButton(`local-${entry.id}`, entry.likes || 0);
    meta.append(marker, title, details, like); article.append(art, meta); return article;
  };
  const makeLikeButton = (key, base = 0) => {
    const button = document.createElement('button'); button.className = 'wall-like'; button.type = 'button'; button.dataset.like = key;
    const likes = readLikes(); const liked = Boolean(likes[key]); button.setAttribute('aria-pressed', String(liked));
    button.innerHTML = `${liked ? '♥' : '♡'} <span>${liked ? 'Liked' : 'Like'}</span> <b>${base + Number(liked)}</b>`;
    button.addEventListener('click', () => {
      const updated = readLikes(); updated[key] = !updated[key]; localStorage.setItem(LIKES_KEY, JSON.stringify(updated));
      const count = Number(button.querySelector('b').textContent) + (updated[key] ? 1 : -1);
      button.setAttribute('aria-pressed', String(updated[key])); button.querySelector('span').textContent = updated[key] ? 'Liked' : 'Like'; button.querySelector('b').textContent = String(count); button.firstChild.textContent = updated[key] ? '♥ ' : '♡ ';
    });
    return button;
  };
  const renderGallery = () => {
    const samples = [...galleryGrid.querySelectorAll('.wall-card--sample')];
    galleryGrid.replaceChildren(...samples, ...readGallery().map(createLocalCard));
    galleryGrid.querySelectorAll('.wall-like[data-like^="sample-"]').forEach((button) => {
      const key = button.dataset.like; const liked = Boolean(readLikes()[key]); const base = Number(button.dataset.baseCount || 0);
      button.setAttribute('aria-pressed', String(liked)); button.querySelector('b').textContent = String(base + Number(liked));
      button.firstChild.textContent = liked ? '♥ ' : '♡ '; button.querySelector('span').textContent = liked ? 'Liked' : 'Like';
      if (boundSampleLikes.has(button)) return;
      boundSampleLikes.add(button);
      button.addEventListener('click', () => {
        const likes = readLikes(); likes[key] = !likes[key]; localStorage.setItem(LIKES_KEY, JSON.stringify(likes));
        const nextLiked = likes[key]; button.querySelector('b').textContent = String(base + Number(nextLiked)); button.setAttribute('aria-pressed', String(nextLiked)); button.querySelector('span').textContent = nextLiked ? 'Liked' : 'Like'; button.firstChild.textContent = nextLiked ? '♥ ' : '♡ ';
      });
    });
  };
  const showDialog = (dialog) => {
    if (customCursor) dialog.append(customCursor);
    dialog.showModal();
  };
  const openPreview = (image, caption) => { previewImage.src = image; previewCaption.textContent = caption; showDialog(previewDialog); };
  const returnCursorHome = () => {
    if (customCursor && cursorHome && customCursor.parentElement !== cursorHome) cursorHome.append(customCursor);
  };
  const undo = () => { if (historyIndex <= 0) return; historyIndex--; restore(history[historyIndex]); refreshMarks(); updateHistoryButtons(); status.textContent = 'Undid your last stroke.'; };
  const redo = () => { if (historyIndex >= history.length - 1) return; historyIndex++; restore(history[historyIndex]); refreshMarks(); updateHistoryButtons(); status.textContent = 'Brought that stroke back.'; };

  const resizeObserver = new ResizeObserver(resizeCanvas);
  resizeObserver.observe(wrap);
  window.addEventListener('resize', resizeCanvas, { passive:true });
  resizeCanvas(); remember();
  toolButtons.forEach((button) => button.addEventListener('click', () => selectTool(button.dataset.tool)));
  colorInput.addEventListener('input', () => { color = colorInput.value; document.querySelectorAll('.studio-swatch').forEach((swatch) => { swatch.classList.remove('is-current'); swatch.setAttribute('aria-pressed','false'); }); status.textContent = 'New colour picked. Make it yours.'; });
  document.querySelectorAll('.studio-swatch').forEach((swatch) => swatch.addEventListener('click', () => { color = swatch.dataset.color; colorInput.value = color; document.querySelectorAll('.studio-swatch').forEach((item) => { const selected = item === swatch; item.classList.toggle('is-current',selected); item.setAttribute('aria-pressed',String(selected)); }); }));
  sizeInput.addEventListener('input', () => { thickness = Number(sizeInput.value); sizeOutput.value = String(thickness); sizeOutput.textContent = String(thickness); });
  undoButton.addEventListener('click', undo); redoButton.addEventListener('click', redo);
  document.addEventListener('keydown', (event) => {
    const editing = event.target.matches('input,textarea,select,[contenteditable="true"]');
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z' && !editing) { event.preventDefault(); event.shiftKey ? redo() : undo(); }
  });
  const finishPointer = (cancelled = false) => {
    if (!drawing) return;
    const pointerId = activePointer;
    const isShape = ['rectangle','circle','triangle','line'].includes(tool);
    if (cancelled && isShape && beforeShape) restore(beforeShape);
    else if (cancelled && (tool === 'pencil' || tool === 'eraser')) remember();
    drawing = false; activePointer = null;
    if (pointerId !== null && canvas.hasPointerCapture(pointerId)) canvas.releasePointerCapture(pointerId);
    beforeShape = null; start = null; previous = null; refreshMarks();
  };
  canvas.addEventListener('pointerdown', (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    if (drawing) return;
    const point = pointFrom(event);
    if (tool === 'text') {
      const value = textInput.value.trim();
      if (!value) { status.textContent = 'Type a few words in the Text field first.'; textInput.focus(); return; }
      ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = color; ctx.font = `600 ${Math.max(16, thickness * 4)}px Inter, Arial, sans-serif`; ctx.textBaseline = 'top'; ctx.fillText(value, point.x, point.y); ctx.restore(); remember(); refreshMarks(); status.textContent = 'Your words are on the paper.'; return;
    }
    drawing = true; activePointer = event.pointerId; start = { ...point, pointerId:event.pointerId }; previous = point; canvas.setPointerCapture(event.pointerId);
    if (['rectangle','circle','triangle','line'].includes(tool)) beforeShape = copySurface();
    else { setPaint(tool === 'eraser'); ctx.beginPath(); ctx.moveTo(point.x, point.y); ctx.lineTo(point.x + .01, point.y + .01); ctx.stroke(); }
    event.preventDefault();
  });
  canvas.addEventListener('pointermove', (event) => {
    if (!drawing || event.pointerId !== activePointer) return;
    const point = pointFrom(event);
    if (['rectangle','circle','triangle','line'].includes(tool)) { restore(beforeShape); drawShape(start, point, true); }
    else { setPaint(tool === 'eraser'); if (tool === 'pencil' && event.pointerType === 'pen') ctx.lineWidth = Math.max(1, thickness * Math.max(.25, point.pressure)); ctx.beginPath(); ctx.moveTo(previous.x, previous.y); ctx.lineTo(point.x, point.y); ctx.stroke(); }
    previous = point; event.preventDefault();
  });
  canvas.addEventListener('pointerup', () => {
    if (!drawing) return;
    if (['rectangle','circle','triangle','line'].includes(tool) && previous && start && (Math.abs(previous.x - start.x) + Math.abs(previous.y - start.y) > 2)) {
      restore(beforeShape); drawShape(start, previous, false); remember();
    } else if (tool === 'pencil' || tool === 'eraser') remember();
    finishPointer(); status.textContent = 'Saved that mark to your canvas.';
  });
  canvas.addEventListener('pointercancel', () => finishPointer(true));
  canvas.addEventListener('lostpointercapture', () => finishPointer(true));
  undoButton.addEventListener('click', () => canvas.focus({ preventScroll:true }));
  redoButton.addEventListener('click', () => canvas.focus({ preventScroll:true }));
  document.querySelector('#clear-button').addEventListener('click', () => {
    if (!hasMarks) { status.textContent = 'Your paper is already clear.'; return; }
    if (!window.confirm('Clear this drawing and start fresh?')) return;
    ctx.clearRect(0,0,canvas.width,canvas.height); remember(); refreshMarks(); status.textContent = 'A fresh sheet, just for you.';
  });
  document.querySelector('#download-button').addEventListener('click', () => {
    const link = document.createElement('a'); link.href = localArtwork(); link.download = 'playground-creation.png'; link.click(); status.textContent = 'Your PNG download is ready.';
  });
  document.querySelector('#save-gallery-button').addEventListener('click', () => {
    if (!hasMarks) { status.textContent = 'Make a mark before saving your creation.'; return; }
    galleryPreview.src = localArtwork(); showDialog(galleryDialog); galleryForm.querySelector('[name="creator"]').focus();
  });
  galleryForm.addEventListener('submit', (event) => {
    event.preventDefault(); if (!hasMarks) return;
    const form = new FormData(galleryForm); const entries = readGallery();
    entries.unshift({ id:crypto.randomUUID?.() || String(Date.now()), creator:String(form.get('creator') || '').trim().slice(0,32) || 'Anonymous', caption:String(form.get('caption') || '').trim().slice(0,80) || 'A little creation', date:new Date().toISOString(), image:localArtwork(), likes:0 });
    try { localStorage.setItem(STORAGE_KEY,JSON.stringify(entries.slice(0,12))); } catch { status.textContent = 'Your browser storage is full. Download the PNG instead.'; return; }
    galleryDialog.close(); galleryForm.reset(); renderGallery(); status.textContent = 'Saved on this device. It is not public yet.';
    document.querySelector('.community').scrollIntoView({ behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block:'start' });
  });
  document.querySelector('#send-art-button').addEventListener('click', () => {
    sendPreview.src = localArtwork(); showDialog(sendDialog);
  });
  document.querySelectorAll('[data-close-dialog]').forEach((button) => button.addEventListener('click', () => document.getElementById(button.dataset.closeDialog)?.close()));
  document.querySelectorAll('.playground-dialog').forEach((dialog) => {
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('keydown', (event) => { if (event.key === 'Escape' && dialog.open) dialog.close(); });
    dialog.addEventListener('close', returnCursorHome);
  });
  galleryGrid.querySelectorAll('[data-sample-art]').forEach((button) => button.addEventListener('click', () => {
    const svg = button.querySelector('svg').outerHTML.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
    openPreview(`data:image/svg+xml,${encodeURIComponent(svg)}`, `${button.closest('.wall-card').querySelector('h3').textContent} · Studio sample artwork`);
  }));
  renderGallery();
})();
