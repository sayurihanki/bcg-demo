import { formatCurrency } from '../../scripts/exchange-data.js';
import {
  getExchangePath,
  getWorkspace,
  hydrateWorkspace,
  onWorkspaceChange,
  removeWorkspaceItem,
  setProcurementMode,
} from '../../scripts/exchange.js';

const escapeHTML = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

function commercialTotal(items) {
  const subtotal = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const custom = items.some(({ price }) => price === null);
  if (!custom) return formatCurrency(subtotal);
  return subtotal ? `${formatCurrency(subtotal)} + custom` : 'Custom quote';
}

function emptyMarkup() {
  return `
    <section class="exchange-cart-page__empty">
      <div aria-hidden="true"><span></span><span></span><b>+</b></div>
      <span>YOUR WORKSPACE</span>
      <h1>Your portfolio<br>starts with <em>one move.</em></h1>
      <p>Explore BCG offers or configure a BCG X pilot. Everything you select will be ready here for enterprise review.</p>
      <a href="/#bcg-products">Explore BCG X products <b>\u2197</b></a>
    </section>`;
}

function itemMarkup(item, index) {
  return `
    <li class="exchange-cart-page__item">
      <span class="exchange-cart-page__index">${String(index + 1).padStart(2, '0')}</span>
      <span class="exchange-cart-page__swatch tone-${escapeHTML(item.tone)}" aria-hidden="true">${item.kind === 'bcg-x' ? 'X' : escapeHTML(item.id)}</span>
      <span class="exchange-cart-page__copy">
        <small>${escapeHTML(item.eyebrow)}</small>
        <strong>${escapeHTML(item.title)}</strong>
        <span>${escapeHTML(item.format)}</span>
      </span>
      <b>${item.price === null ? 'Custom quote' : formatCurrency(item.price)}</b>
      <button type="button" data-remove-item="${escapeHTML(item.id)}" aria-label="Remove ${escapeHTML(item.title)}">Remove <span>\u00d7</span></button>
    </li>`;
}

function populatedMarkup(workspace) {
  return `
    <section class="exchange-cart-page__hero" aria-labelledby="portfolio-title">
      <span>YOUR WORKSPACE · ${workspace.items.length} ${workspace.items.length === 1 ? 'SELECTION' : 'SELECTIONS'}</span>
      <h1 id="portfolio-title">Build your<br><em>portfolio.</em></h1>
      <p>Review the products, tools, and expertise you want to move forward. Commercial terms are confirmed after scope review.</p>
      <div aria-hidden="true"><strong>${String(workspace.items.length).padStart(2, '0')}</strong><span>items<br>selected</span></div>
    </section>
    <div class="exchange-cart-page__layout">
      <section class="exchange-cart-page__list" aria-labelledby="selection-title">
        <div class="exchange-cart-page__section-head"><span>01</span><div><small>PORTFOLIO CONTENTS</small><h2 id="selection-title">Your selections</h2></div><a href="/#bcg-products">Add another \u2197</a></div>
        <ol>${workspace.items.map(itemMarkup).join('')}</ol>
      </section>
      <aside class="exchange-cart-page__aside" aria-labelledby="commercials-title">
        <div class="exchange-cart-page__aside-head"><span>02</span><div><small>REQUEST PATH</small><h2 id="commercials-title">Commercial review</h2></div></div>
        <label class="exchange-cart-page__mode">
          <span><strong>Enterprise procurement</strong><small>Enable PO, approvals, and invoice terms</small></span>
          <input type="checkbox" data-procurement ${workspace.procurementMode ? 'checked' : ''}>
          <i></i>
        </label>
        <dl>
          <div><dt>Selected solutions</dt><dd>${workspace.items.length}</dd></div>
          <div><dt>Commercials</dt><dd>${commercialTotal(workspace.items)}</dd></div>
          <div><dt>Payment today</dt><dd>None</dd></div>
        </dl>
        <a class="exchange-cart-page__continue" href="${getExchangePath('/checkout')}"><span>Continue to secure request</span><b>\u2197</b></a>
        <p>BCG will validate scope, availability, and terms before any commitment is made.</p>
        <ul><li>Secure enterprise request</li><li>No payment taken</li><li>Human scope review</li></ul>
      </aside>
    </div>`;
}

export default function decorate(block) {
  hydrateWorkspace();
  block.innerHTML = '<div class="exchange-cart-page"></div>';
  const page = block.querySelector('.exchange-cart-page');

  const render = () => {
    const workspace = getWorkspace();
    page.innerHTML = workspace.items.length ? populatedMarkup(workspace) : emptyMarkup();
    page.querySelectorAll('[data-remove-item]').forEach((button) => button.addEventListener('click', () => {
      removeWorkspaceItem(button.dataset.removeItem);
    }));
    page.querySelector('[data-procurement]')?.addEventListener('change', (event) => {
      setProcurementMode(event.target.checked);
    });
  };

  onWorkspaceChange(render);
}
