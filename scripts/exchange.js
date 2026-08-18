const STORAGE_KEY = 'bcg-exchange-cart';
const STORAGE_VERSION = 2;
const CHANGE_EVENT = 'bcg-exchange:workspace-change';

let state = { version: STORAGE_VERSION, items: [], procurementMode: true };
let hydrated = false;

function normalizeItem(item) {
  if (!item || (typeof item.id !== 'number' && typeof item.id !== 'string')) return null;
  return {
    id: item.id,
    kind: item.kind || (Number(item.id) > 99 ? 'bcg-x' : 'offer'),
    slug: item.slug || null,
    title: item.title || item.name || 'Untitled item',
    description: item.description || '',
    tone: item.tone || 'lime',
    price: item.price === 0 || item.price === null ? null : Number(item.price || 0),
    format: item.format || item.access || 'Scope to confirm',
    config: item.config || null,
    eyebrow: item.eyebrow || '',
  };
}

function migrate(value) {
  const source = Array.isArray(value) ? { items: value, procurementMode: true } : value;
  if (!source || !Array.isArray(source.items)) return { ...state };
  return {
    version: STORAGE_VERSION,
    items: source.items.map(normalizeItem).filter(Boolean),
    procurementMode: source.procurementMode !== false,
  };
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // In-memory state intentionally remains available when storage is blocked.
  }
}

function emit(message = '') {
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, {
    detail: { state: getWorkspace(), message },
  }));
}

export function hydrateWorkspace() {
  if (hydrated) return getWorkspace();
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) state = migrate(JSON.parse(saved));
  } catch {
    state = { version: STORAGE_VERSION, items: [], procurementMode: true };
  }
  hydrated = true;
  persist();
  return getWorkspace();
}

export function getWorkspace() {
  return { ...state, items: state.items.map((item) => ({ ...item })) };
}

export function addWorkspaceItem(item) {
  hydrateWorkspace();
  const normalized = normalizeItem(item);
  if (!normalized) return;
  const exists = state.items.some(({ id }) => String(id) === String(normalized.id));
  state.items = [
    ...state.items.filter(({ id }) => String(id) !== String(normalized.id)), normalized,
  ];
  persist();
  emit(`${normalized.title} ${exists ? 'updated in' : 'added to'} your proposal`);
}

export function removeWorkspaceItem(id) {
  hydrateWorkspace();
  state.items = state.items.filter((item) => String(item.id) !== String(id));
  persist();
  emit('Item removed from your proposal');
}

export function setProcurementMode(enabled) {
  hydrateWorkspace();
  state.procurementMode = Boolean(enabled);
  persist();
  emit();
}

export function onWorkspaceChange(callback) {
  const listener = (event) => callback(event.detail);
  window.addEventListener(CHANGE_EVENT, listener);
  callback({ state: hydrateWorkspace(), message: '' });
  return () => window.removeEventListener(CHANGE_EVENT, listener);
}

export function formatPilotConfig(config) {
  const markets = config.markets === 1 ? 'market' : 'markets';
  return `${config.weeks}-week pilot · ${config.markets} ${markets} · ${config.seats} seats`;
}

export function solutionToWorkspaceItem(solution, config = null) {
  return {
    id: solution.id,
    kind: 'bcg-x',
    slug: solution.slug,
    title: solution.name,
    description: solution.description,
    tone: solution.tone,
    price: null,
    format: config ? formatPilotConfig(config) : 'Enterprise pilot · Scope to confirm',
    config,
    eyebrow: `BCG X · ${solution.category.toUpperCase()}`,
  };
}

export function offerToWorkspaceItem(offer) {
  return {
    id: offer.id,
    kind: 'offer',
    slug: null,
    title: offer.title,
    description: offer.description,
    tone: offer.tone,
    price: offer.price,
    format: offer.format,
    config: null,
    eyebrow: offer.eyebrow,
  };
}

export function showExchangeStatus(message) {
  let status = document.querySelector('.exchange-toast');
  if (!status) {
    status = document.createElement('div');
    status.className = 'exchange-toast';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    document.body.append(status);
  }
  status.textContent = `✓ ${message}`;
  status.classList.add('is-visible');
  window.clearTimeout(showExchangeStatus.timer);
  showExchangeStatus.timer = window.setTimeout(() => status.classList.remove('is-visible'), 3000);
}

export function createDialogController(dialog, { onClose } = {}) {
  let previousFocus;
  const focusableSelector = 'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function close() {
    dialog.hidden = true;
    document.body.classList.remove('exchange-dialog-open');
    document.removeEventListener('keydown', onKeydown);
    previousFocus?.focus();
    onClose?.();
  }

  function onKeydown(event) {
    if (event.key === 'Escape') {
      close();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll(focusableSelector)]
      .filter((node) => !node.hidden);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function open(trigger) {
    previousFocus = trigger || document.activeElement;
    dialog.hidden = false;
    document.body.classList.add('exchange-dialog-open');
    document.addEventListener('keydown', onKeydown);
    window.requestAnimationFrame(() => dialog.querySelector(focusableSelector)?.focus());
  }

  dialog.addEventListener('mousedown', (event) => {
    if (event.target === dialog) close();
  });
  dialog.querySelectorAll('[data-dialog-close]').forEach((button) => button.addEventListener('click', close));
  return { open, close };
}

export const WORKSPACE_EVENT = CHANGE_EVENT;
