import { bcgSolutions, getSolution } from '../../scripts/exchange-data.js';
import { addWorkspaceItem, solutionToWorkspaceItem } from '../../scripts/exchange.js';

const deploymentCopy = [
  'Align on the baseline, ambition, and decision scope.',
  'Focus the product on a measurable, feasible value case.',
  'Configure the product, data, workflows, and governance.',
  'Industrialize adoption, ownership, and the path to scale.',
];

export default function decorate(block) {
  const authoredSlug = block.querySelector(':scope > div > div')?.textContent.trim();
  const slug = authoredSlug || window.location.pathname.split('/').filter(Boolean).at(-1);
  const solution = getSolution(slug) || bcgSolutions[0];
  const start = bcgSolutions.findIndex(({ id }) => id === solution.id);
  const related = [1, 2, 3].map((offset) => bcgSolutions[(start + offset) % bcgSolutions.length]);
  let weeks = 12;
  let markets = 3;
  let seats = 50;

  const capabilities = solution.capabilities.map(([title, description], index) => `<article><span>0${index + 1}</span><div class="capability-symbol">${solution.code}</div><h3>${title}</h3><p>${description}</p></article>`).join('');
  const outcomes = solution.outcomes.map((outcome, index) => `<div><span>0${index + 1}</span><h3>${outcome}</h3><i>↗</i></div>`).join('');
  const deployment = solution.deployment.map((step, index) => `<article><div class="deployment-index">0${index + 1}</div><div class="deployment-node"><span></span></div><h3>${step}</h3><p>${deploymentCopy[index]}</p></article>`).join('');
  const relatedMarkup = related.map((item) => `<a class="related-card related-tone-${item.tone}" href="/products/${item.slug}"><span>${item.category}</span><div><strong>${item.code}</strong><small>BCG X</small></div><h3>${item.shortName}</h3><p>${item.description}</p><b>View product ↗</b></a>`).join('');

  block.innerHTML = `<div class="pdp pdp-tone-${solution.tone}" id="top"><section class="pdp-hero"><div class="pdp-breadcrumb"><a href="/">BCG Exchange</a><span>/</span><a href="/#bcg-products">BCG X products</a><span>/</span><b>${solution.shortName}</b></div><div class="pdp-hero-grid"><div class="pdp-hero-copy"><span class="pdp-category">${solution.category} · BCG X PRODUCT</span><h1>${solution.shortName}</h1><p>${solution.description}</p><div class="pdp-hero-actions"><button type="button" data-configure>Configure a pilot <span>↗</span></button><a href="${solution.url}" target="_blank" rel="noreferrer">View on BCG.com <span>↗</span></a></div></div><div class="pdp-product-visual" aria-hidden="true"><div class="pdp-visual-grid"></div><div class="pdp-visual-orbit orbit-large"></div><div class="pdp-visual-orbit orbit-small"></div><strong>${solution.code}</strong><small>BCG X</small><div class="pdp-signal-card"><span>PRODUCT SIGNAL</span><b>${solution.metric}</b><small>${solution.metricLabel}</small></div></div></div></section><nav class="pdp-subnav" aria-label="On this page"><span>ON THIS PAGE</span><a href="#overview">Overview</a><a href="#capabilities">Capabilities</a><a href="#outcomes">Outcomes</a><a href="#deployment">Deployment</a><a href="#configure">Configure</a></nav><section class="pdp-overview pdp-section" id="overview"><div class="pdp-section-label"><span>01</span>PRODUCT OVERVIEW</div><div class="pdp-overview-copy"><h2>From a high-value use case<br>to a product that <em>scales.</em></h2><p>${solution.longDescription}</p></div><div class="pdp-overview-proof"><strong>${solution.metric}</strong><span>${solution.metricLabel}</span><small>BCG-reported product evidence or positioning. Results vary by context and deployment.</small></div></section><section class="pdp-capabilities pdp-section" id="capabilities"><div class="pdp-section-label"><span>02</span>WHAT IT DOES</div><div class="pdp-section-heading"><h2>One product.<br><em>Four connected capabilities.</em></h2><p>Configure the components around your highest-value decisions and existing technology environment.</p></div><div class="capability-grid">${capabilities}</div></section><section class="pdp-outcomes pdp-section" id="outcomes"><div class="pdp-section-label light"><span>03</span>VALUE CASE</div><div class="pdp-outcomes-grid"><div class="pdp-outcome-lead"><span>PRODUCT OUTCOME</span><strong>${solution.metric}</strong><p>${solution.metricLabel}</p></div><div class="pdp-outcome-list">${outcomes}</div></div></section><section class="pdp-deployment pdp-section" id="deployment"><div class="pdp-section-label"><span>04</span>HOW IT DEPLOYS</div><div class="pdp-section-heading"><h2>A pragmatic path<br>from <em>pilot to scale.</em></h2><p>BCG X products are configured around the client context, then embedded with the operating model and capabilities required to sustain value.</p></div><div class="deployment-path">${deployment}</div></section><section class="pdp-configure pdp-section" id="configure"><div class="pdp-configure-intro"><div class="pdp-section-label light"><span>05</span>CONFIGURE A PILOT</div><h2>Shape the first<br><em>move.</em></h2><p>Set an initial deployment envelope. BCG will validate the scope, required data, delivery model, and commercial terms.</p></div><div class="pdp-configure-form"><fieldset><legend>01 · PILOT LENGTH</legend><div class="pdp-segmented" data-weeks></div></fieldset><fieldset><legend>02 · LAUNCH MARKETS</legend><div class="pdp-stepper"><button type="button" data-market="-1" aria-label="Reduce markets">−</button><strong data-market-count>3</strong><button type="button" data-market="1" aria-label="Add market">+</button></div></fieldset><fieldset><legend>03 · USER COHORT</legend><div class="pdp-segmented" data-seats></div></fieldset></div><aside class="pdp-order-summary"></aside></section><section class="pdp-related pdp-section"><div class="pdp-section-label"><span>06</span>EXPLORE NEXT</div><div class="pdp-section-heading"><h2>Related BCG X<br><em>products.</em></h2></div><div class="related-grid">${relatedMarkup}</div></section></div>`;

  function renderConfig() {
    block.querySelector('[data-weeks]').innerHTML = [8, 12, 16].map((value) => `<button type="button" class="${weeks === value ? 'active' : ''}" data-week="${value}">${value} weeks</button>`).join('');
    block.querySelector('[data-seats]').innerHTML = [25, 50, 100].map((value) => `<button type="button" class="${seats === value ? 'active' : ''}" data-seat="${value}">${value} seats</button>`).join('');
    block.querySelector('[data-market-count]').textContent = markets;
    block.querySelector('.pdp-order-summary').innerHTML = `<div class="pdp-order-top"><span>YOUR CONFIGURATION</span><b>${solution.code}</b></div><h3>${solution.shortName}</h3><dl><div><dt>Pilot</dt><dd>${weeks} weeks</dd></div><div><dt>Markets</dt><dd>${markets}</dd></div><div><dt>Users</dt><dd>${seats}</dd></div><div><dt>Commercials</dt><dd>Custom quote</dd></div></dl><button type="button" data-add>Add pilot to proposal<span>↗</span></button><a href="/?cart=1">Open proposal workspace →</a><small>No payment is taken. This creates a scoped commercial request for BCG review.</small>`;
    block.querySelectorAll('[data-week]').forEach((button) => button.addEventListener('click', () => { weeks = Number(button.dataset.week); renderConfig(); }));
    block.querySelectorAll('[data-seat]').forEach((button) => button.addEventListener('click', () => { seats = Number(button.dataset.seat); renderConfig(); }));
    block.querySelector('[data-add]').addEventListener('click', (event) => {
      addWorkspaceItem(solutionToWorkspaceItem(solution, { weeks, markets, seats }));
      event.currentTarget.firstChild.textContent = 'Added to proposal ✓';
    });
  }

  block.querySelector('[data-configure]').addEventListener('click', () => block.querySelector('#configure').scrollIntoView({ behavior: 'smooth' }));
  block.querySelectorAll('[data-market]').forEach((button) => button.addEventListener('click', () => {
    markets = Math.min(12, Math.max(1, markets + Number(button.dataset.market)));
    renderConfig();
  }));
  renderConfig();
}
