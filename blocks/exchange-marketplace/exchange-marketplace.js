import { formatCurrency, marketplaceOffers } from '../../scripts/exchange-data.js';
import { addWorkspaceItem, offerToWorkspaceItem, onWorkspaceChange } from '../../scripts/exchange.js';

const filters = ['All', 'AI & Digital', 'Climate', 'Operations', 'Consumer', 'Organization'];

function cardMarkup(product, index, ids) {
  return `<article class="product-card tone-${product.tone}"><div class="product-top"><div class="product-number">0${index + 1}</div>${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}</div><div class="product-art" aria-hidden="true"><span class="art-grid"></span><b>${product.category.split(' ')[0]}</b></div><div class="product-copy"><span class="product-eyebrow">${product.eyebrow}</span><h3>${product.title}</h3><p>${product.description}</p><div class="product-meta"><span>${product.format}</span><b>From ${formatCurrency(product.price)}</b></div><div class="product-actions"><button class="add-button" type="button" data-offer="${product.id}">${ids.has(String(product.id)) ? 'In workspace' : 'Add to workspace'}</button><button class="round-button" type="button" data-ask aria-label="Learn more about ${product.title}">↗</button></div></div></article>`;
}

export default function decorate(block) {
  let active = 'All';
  let itemIds = new Set();
  block.innerHTML = '<section class="marketplace section-pad" id="marketplace"><div class="section-heading"><div><span class="eyebrow">THE BCG EXCHANGE</span><h2>Expertise, productized.</h2></div><p>Move from insight to impact with a curated catalog of tools, subscriptions, and expert-led experiences.</p></div><div class="filter-row" role="group" aria-label="Filter marketplace products"></div><div class="product-grid"></div><div class="catalog-callout"><div class="catalog-orb"><span>AI</span></div><div><span class="eyebrow">CAN’T FIND THE RIGHT FIT?</span><h3>Describe the outcome. We’ll assemble the expertise.</h3></div><button type="button" data-ask>Start with BCG Answer <span>↗</span></button></div></section>';
  const filterRow = block.querySelector('.filter-row');
  const grid = block.querySelector('.product-grid');

  function render() {
    filterRow.innerHTML = filters.map((filter) => `<button class="${active === filter ? 'active' : ''}" type="button" data-filter="${filter}">${filter}</button>`).join('');
    const visible = active === 'All' ? marketplaceOffers : marketplaceOffers.filter(({ category }) => category === active);
    grid.innerHTML = visible.map((product, index) => cardMarkup(product, index, itemIds)).join('');
    filterRow.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => {
      active = button.dataset.filter;
      render();
    }));
    grid.querySelectorAll('[data-offer]').forEach((button) => button.addEventListener('click', () => {
      const offer = marketplaceOffers.find(({ id }) => String(id) === button.dataset.offer);
      addWorkspaceItem(offerToWorkspaceItem(offer));
    }));
    grid.querySelectorAll('[data-ask]').forEach((button) => button.addEventListener('click', (event) => document.dispatchEvent(new CustomEvent('bcg-exchange:open-ask', { detail: { trigger: event.currentTarget } }))));
  }

  block.querySelector('.catalog-callout [data-ask]').addEventListener('click', (event) => document.dispatchEvent(new CustomEvent('bcg-exchange:open-ask', { detail: { trigger: event.currentTarget } })));
  document.addEventListener('bcg-exchange:marketplace-filter', (event) => {
    active = event.detail;
    render();
  });
  onWorkspaceChange(({ state }) => {
    itemIds = new Set(state.items.map(({ id }) => String(id)));
    render();
  });
}
