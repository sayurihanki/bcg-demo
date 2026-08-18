import {
  createDialogController,
  getWorkspace,
  hydrateWorkspace,
  onWorkspaceChange,
  removeWorkspaceItem,
  setProcurementMode,
  showExchangeStatus,
} from '../../scripts/exchange.js';
import { formatCurrency } from '../../scripts/exchange-data.js';

function workspaceMarkup(workspace) {
  if (!workspace.items.length) {
    return '<div class="empty-cart"><div>+</div><h3>Your workspace is ready.</h3><p>Add products, configure a pilot, and route the complete request for commercial review.</p><button type="button" data-dialog-close data-scroll="bcg-products">Explore BCG X products</button></div>';
  }
  const subtotal = workspace.items.reduce((sum, item) => sum + (item.price || 0), 0);
  const custom = workspace.items.some((item) => item.price === null);
  let total = formatCurrency(subtotal);
  if (custom) total = subtotal ? `${formatCurrency(subtotal)} + custom` : 'Custom quote';
  const lines = workspace.items.map((item) => `<div class="cart-line"><div class="cart-swatch tone-${item.tone}">${item.kind === 'bcg-x' ? 'X' : item.id}</div><div><span>${item.eyebrow}</span><b>${item.title}</b><small>${item.format}</small></div><strong>${item.price === null ? 'Custom' : formatCurrency(item.price)}</strong><button type="button" data-remove-item="${item.id}" aria-label="Remove ${item.title}">×</button></div>`).join('');
  return `<div class="cart-list">${lines}</div><label class="procurement-toggle"><span><b>Enterprise procurement mode</b><small>Enable PO, approvals, and invoice terms</small></span><input type="checkbox" ${workspace.procurementMode ? 'checked' : ''}><i></i></label><div class="cart-total"><span><small>PORTFOLIO COMMERCIALS</small><b>BCG X product terms are finalized after scope review</b></span><strong>${total}</strong></div><button class="checkout-button" type="button">${workspace.procurementMode ? 'Submit for procurement review' : 'Request commercial proposal'}<span>↗</span></button><p class="secure-note">Secure enterprise request · No payment taken in this demo</p>`;
}

export default function decorate(block) {
  document.body.classList.add('bcg-exchange');
  hydrateWorkspace();
  const isPdp = window.location.pathname.split('/').filter(Boolean).length === 2;
  if (isPdp) document.body.classList.add('bcg-exchange-product');
  const navMarkup = isPdp
    ? '<a href="/#bcg-products">All products</a><a href="#capabilities">Capabilities</a><a href="#deployment">Deployment</a>'
    : '<a href="/#marketplace">Marketplace</a><a href="/#bcg-products">BCG X products</a><a href="/#enterprise">For enterprise</a><a href="/#agentic">Agentic commerce</a><a href="/#agenda">Demo agenda</a>';
  block.innerHTML = `
    <div class="site-header ${isPdp ? 'pdp-header' : ''}">
      <a class="brand" href="/${isPdp ? '#top' : '#top'}" aria-label="BCG Exchange home"><span class="brand-mark">BCG</span><span class="brand-divider"></span><span class="brand-name">Exchange</span></a>
      <nav class="nav-links" aria-label="Primary navigation">${navMarkup}</nav>
      <div class="header-actions"><button class="ask-button" type="button"><span class="spark">✦</span> Ask BCG</button><button class="cart-button" type="button"><span>Proposal</span><b>0</b></button><button class="menu-button" type="button" aria-label="Toggle menu" aria-expanded="false"><span></span><span></span></button></div>
    </div>
    <div class="overlay workspace-overlay" role="presentation" hidden><aside class="drawer cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title"><div class="drawer-head"><div><span class="eyebrow">YOUR WORKSPACE</span><h2 id="cart-title">Build your portfolio</h2></div><button type="button" data-dialog-close aria-label="Close proposal">×</button></div><div class="workspace-content"></div></aside></div>
    <div class="overlay ask-overlay" role="presentation" hidden><section class="ask-panel" role="dialog" aria-modal="true" aria-labelledby="ask-title"><button class="ask-close" type="button" data-dialog-close aria-label="Close BCG Answer">×</button><div class="ask-icon">✦</div><span class="eyebrow light">BCG ANSWER</span><h2 id="ask-title">What would you like to move forward?</h2><p>Describe your ambition, challenge, or decision. We’ll connect it to the most relevant BCG expertise.</p><label class="ask-input"><span>YOUR PRIORITY</span><textarea aria-label="Describe your business priority">Help us identify and scale the highest-value AI opportunities across our business.</textarea><button type="button" class="ask-submit" aria-label="Submit priority">↑</button></label><div class="prompt-options"><span>Try asking</span><button type="button">Where is AI creating value now?</button><button type="button">Build a climate transition path</button></div><small class="answer-note">This local demonstration does not transmit entered text.</small></section></div>`;

  const menu = block.querySelector('.nav-links');
  const menuButton = block.querySelector('.menu-button');
  menuButton.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menu.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
  }));

  const workspaceOverlay = block.querySelector('.workspace-overlay');
  const workspaceContent = block.querySelector('.workspace-content');
  const workspaceDialog = createDialogController(workspaceOverlay);
  const askOverlay = block.querySelector('.ask-overlay');
  const askDialog = createDialogController(askOverlay);
  block.querySelector('.cart-button').addEventListener('click', (event) => workspaceDialog.open(event.currentTarget));
  block.querySelector('.ask-button').addEventListener('click', (event) => askDialog.open(event.currentTarget));

  function renderWorkspace(workspace) {
    block.querySelector('.cart-button b').textContent = workspace.items.length;
    block.querySelector('.cart-button').setAttribute('aria-label', `Open proposal with ${workspace.items.length} items`);
    workspaceContent.innerHTML = workspaceMarkup(workspace);
    workspaceContent.querySelectorAll('[data-remove-item]').forEach((button) => button.addEventListener('click', () => removeWorkspaceItem(button.dataset.removeItem)));
    workspaceContent.querySelector('.procurement-toggle input')?.addEventListener('change', (event) => setProcurementMode(event.target.checked));
    workspaceContent.querySelector('.checkout-button')?.addEventListener('click', () => {
      workspaceDialog.close();
      showExchangeStatus(workspace.procurementMode ? 'Purchase request created for review' : 'Commercial proposal request prepared');
    });
    workspaceContent.querySelector('[data-scroll]')?.addEventListener('click', (event) => document.getElementById(event.currentTarget.dataset.scroll)?.scrollIntoView({ behavior: 'smooth' }));
  }

  onWorkspaceChange(({ state, message }) => {
    renderWorkspace(state);
    if (message) showExchangeStatus(message);
  });
  block.querySelector('.ask-submit').addEventListener('click', () => {
    askDialog.close();
    showExchangeStatus('Your personalized path is being assembled locally');
  });
  block.querySelectorAll('.prompt-options button').forEach((button) => button.addEventListener('click', () => {
    block.querySelector('.ask-input textarea').value = button.textContent;
  }));
  document.addEventListener('bcg-exchange:open-ask', (event) => askDialog.open(event.detail?.trigger));
  document.addEventListener('bcg-exchange:open-workspace', (event) => workspaceDialog.open(event.detail?.trigger));
  if (new URLSearchParams(window.location.search).get('cart') === '1') {
    window.requestAnimationFrame(() => workspaceDialog.open(block.querySelector('.cart-button')));
  }
  renderWorkspace(getWorkspace());
}
