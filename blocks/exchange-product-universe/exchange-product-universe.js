import { bcgSolutions } from '../../scripts/exchange-data.js';
import { addWorkspaceItem, onWorkspaceChange, solutionToWorkspaceItem } from '../../scripts/exchange.js';

const filters = ['All', 'Growth', 'Operations', 'Industry AI'];

function solutionCard(solution, index, ids) {
  return `<article class="solution-card solution-tone-${solution.tone}"><div class="solution-card-top"><span>${String(index + 1).padStart(2, '0')}</span><b>${solution.category}</b></div><div class="solution-glyph" aria-hidden="true"><div class="glyph-orbit"></div><strong>${solution.code}</strong><small>BCG X</small></div><div class="solution-card-copy"><h3><a href="/products/${solution.slug}">${solution.name}</a></h3><p>${solution.description}</p><div class="solution-proof"><strong>${solution.metric}</strong><span>${solution.metricLabel}</span></div><div class="solution-actions"><button type="button" data-solution="${solution.id}">${ids.has(String(solution.id)) ? 'Update proposal' : 'Add to proposal'}</button><a class="configure-link" href="/products/${solution.slug}">View PDP</a><a href="${solution.url}" target="_blank" rel="noreferrer" aria-label="View ${solution.name} on BCG.com">↗</a></div></div></article>`;
}

export default function decorate(block) {
  let active = 'All';
  let selected = bcgSolutions[0];
  let weeks = 12;
  let markets = 3;
  let seats = 50;
  let ids = new Set();
  block.innerHTML = '<section class="solution-universe section-pad" id="bcg-products"><div class="solution-heading"><div><span class="x-lockup">BCG <i>X</i></span><span class="eyebrow light">REAL PRODUCTS · READY TO CONFIGURE</span><h2>The product<br><em>universe.</em></h2></div><div class="solution-heading-copy"><p>Industry-grade AI products from BCG X—now discoverable, comparable, and ready to add to an enterprise proposal.</p><a href="https://www.bcg.com/x/product-library" target="_blank" rel="noreferrer">Explore the official product library <span>↗</span></a></div></div><div class="solution-filters" role="group" aria-label="Filter BCG X products"></div><div class="solution-grid"></div><div class="pilot-builder" id="pilot-builder"><div class="pilot-intro"><span class="eyebrow">CONFIGURE A PILOT</span><h3>Shape the first<br>move.</h3><p>Choose a real BCG X product, define a deployment envelope, and route a complete pilot request into your procurement workspace.</p><span class="commercial-note">Commercial terms are tailored by BCG. No public pricing is implied.</span></div><div class="pilot-form"><fieldset class="pilot-field product-choice"><legend>01 · SELECT PRODUCT</legend><div class="pilot-product-select"></div></fieldset><div class="pilot-controls"><fieldset class="pilot-field"><legend>02 · PILOT LENGTH</legend><div class="segmented-control" data-weeks></div></fieldset><fieldset class="pilot-field"><legend>03 · LAUNCH MARKETS</legend><div class="stepper"><button type="button" data-market="-1" aria-label="Reduce launch markets">−</button><strong data-market-count>3</strong><button type="button" data-market="1" aria-label="Add launch market">+</button></div></fieldset><fieldset class="pilot-field"><legend>04 · USER COHORT</legend><div class="segmented-control" data-seats></div></fieldset></div></div><aside class="pilot-summary" aria-label="Configured pilot summary"></aside></div><div class="open-source-strip"><div class="open-source-title"><span>OPEN SOURCE · RESPONSIBLE AI</span><h3>Build with BCG X, today.</h3></div><article><b>ARTKIT</b><p>Open-source GenAI testing and evaluation toolkit.</p><button type="button" data-artkit>Add to build list</button></article><article><b>Facet</b><p>Open-source model interpretability and explainability.</p><a href="https://www.bcg.com/x/product-library/facet-open-source-library-for-ai-model-explainability" target="_blank" rel="noreferrer">View product ↗</a></article></div></section>';
  const filterRow = block.querySelector('.solution-filters');
  const grid = block.querySelector('.solution-grid');
  const productSelect = block.querySelector('.pilot-product-select');
  const summary = block.querySelector('.pilot-summary');

  function renderPilot() {
    productSelect.innerHTML = bcgSolutions.map((solution) => `<button type="button" class="${selected.id === solution.id ? 'active' : ''}" data-select="${solution.id}"><span>${solution.code}</span>${solution.name.replace(' by BCG X', '')}</button>`).join('');
    block.querySelector('[data-weeks]').innerHTML = [8, 12, 16].map((value) => `<button type="button" class="${weeks === value ? 'active' : ''}" data-week="${value}">${value} weeks</button>`).join('');
    block.querySelector('[data-seats]').innerHTML = [25, 50, 100].map((value) => `<button type="button" class="${seats === value ? 'active' : ''}" data-seat="${value}">${value} seats</button>`).join('');
    block.querySelector('[data-market-count]').textContent = markets;
    summary.className = `pilot-summary solution-tone-${selected.tone}`;
    summary.innerHTML = `<div class="summary-head"><span>CONFIGURED PILOT</span><b>${selected.code}</b></div><h3>${selected.name}</h3><div class="summary-specs"><div><span>Launch window</span><b>${weeks} weeks</b></div><div><span>Initial scope</span><b>${markets} ${markets === 1 ? 'market' : 'markets'}</b></div><div><span>User cohort</span><b>${seats} seats</b></div><div><span>Commercials</span><b>Custom quote</b></div></div><ul><li>Executive alignment workshop</li><li>Data and platform readiness review</li><li>Configured product environment</li><li>Value case and scale roadmap</li></ul><button type="button" data-add-pilot>Add configured pilot <span>↗</span></button><a href="/products/${selected.slug}">Open the full product detail page</a>`;
    productSelect.querySelectorAll('[data-select]').forEach((button) => button.addEventListener('click', () => {
      selected = bcgSolutions.find(({ id }) => String(id) === button.dataset.select);
      renderPilot();
    }));
    block.querySelectorAll('[data-week]').forEach((button) => button.addEventListener('click', () => { weeks = Number(button.dataset.week); renderPilot(); }));
    block.querySelectorAll('[data-seat]').forEach((button) => button.addEventListener('click', () => { seats = Number(button.dataset.seat); renderPilot(); }));
    summary.querySelector('[data-add-pilot]').addEventListener('click', (event) => {
      addWorkspaceItem(solutionToWorkspaceItem(selected, { weeks, markets, seats }));
      document.dispatchEvent(new CustomEvent('bcg-exchange:open-workspace', { detail: { trigger: event.currentTarget } }));
    });
  }

  function renderGrid() {
    filterRow.innerHTML = filters.map((filter) => `<button type="button" class="${active === filter ? 'active' : ''}" data-filter="${filter}">${filter}<span>${filter === 'All' ? bcgSolutions.length : bcgSolutions.filter(({ category }) => category === filter).length}</span></button>`).join('');
    const visible = active === 'All' ? bcgSolutions : bcgSolutions.filter(({ category }) => category === active);
    grid.innerHTML = visible.map((solution, index) => solutionCard(solution, index, ids)).join('');
    filterRow.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => { active = button.dataset.filter; renderGrid(); }));
    grid.querySelectorAll('[data-solution]').forEach((button) => button.addEventListener('click', () => {
      const solution = bcgSolutions.find(({ id }) => String(id) === button.dataset.solution);
      addWorkspaceItem(solutionToWorkspaceItem(solution));
    }));
  }

  block.querySelectorAll('[data-market]').forEach((button) => button.addEventListener('click', () => {
    markets = Math.min(12, Math.max(1, markets + Number(button.dataset.market)));
    renderPilot();
  }));
  block.querySelector('[data-artkit]').addEventListener('click', () => addWorkspaceItem({
    id: 109,
    kind: 'bcg-x',
    slug: 'artkit',
    title: 'ARTKIT',
    description: 'Open-source toolkit for responsible GenAI testing and evaluation.',
    tone: 'mint',
    price: null,
    format: 'Open-source toolkit · Technical review',
    eyebrow: 'BCG X · RESPONSIBLE AI',
  }));
  onWorkspaceChange(({ state }) => {
    ids = new Set(state.items.map(({ id }) => String(id)));
    renderGrid();
  });
  renderPilot();
}
