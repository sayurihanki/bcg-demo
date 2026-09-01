import { formatCurrency } from '../../scripts/exchange-data.js';
import {
  getWorkspace,
  getExchangePath,
  hydrateWorkspace,
  setProcurementMode,
  submitWorkspaceRequest,
} from '../../scripts/exchange.js';

const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'France',
  'Australia',
  'Singapore',
  'Other',
];

const escapeHTML = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

function totalMarkup(items) {
  const subtotal = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const includesCustom = items.some(({ price }) => price === null);
  if (!includesCustom) return formatCurrency(subtotal);
  return subtotal ? `${formatCurrency(subtotal)} + custom` : 'Custom quote';
}

function summaryMarkup(workspace) {
  const lines = workspace.items.map((item) => `
    <li class="exchange-checkout__item">
      <span class="exchange-checkout__swatch tone-${escapeHTML(item.tone)}" aria-hidden="true">${item.kind === 'bcg-x' ? 'X' : escapeHTML(item.id)}</span>
      <span class="exchange-checkout__item-copy">
        <small>${escapeHTML(item.eyebrow)}</small>
        <strong>${escapeHTML(item.title)}</strong>
        <span>${escapeHTML(item.format)}</span>
      </span>
      <b>${item.price === null ? 'Custom' : formatCurrency(item.price)}</b>
    </li>`).join('');
  return `
    <div class="exchange-checkout__summary-head">
      <span>YOUR PORTFOLIO</span>
      <a href="${getExchangePath('/cart')}">Edit</a>
    </div>
    <ol class="exchange-checkout__items">${lines}</ol>
    <div class="exchange-checkout__mode">
      <span><strong>Enterprise procurement</strong><small>PO, approvals, and invoice terms</small></span>
      <label><span class="sr-only">Enterprise procurement mode</span><input type="checkbox" data-procurement ${workspace.procurementMode ? 'checked' : ''}><i></i></label>
    </div>
    <div class="exchange-checkout__total">
      <span><small>PORTFOLIO COMMERCIALS</small><strong>Terms finalized after scope review</strong></span>
      <b>${totalMarkup(workspace.items)}</b>
    </div>
    <p class="exchange-checkout__summary-note">No payment is taken. BCG will validate scope, timing, and commercial terms before any commitment.</p>`;
}

function formMarkup(procurementMode) {
  return `
    <form class="exchange-checkout__form">
      <section aria-labelledby="contact-heading">
        <div class="exchange-checkout__section-head"><span>01</span><div><small>REQUEST OWNER</small><h2 id="contact-heading">Your details</h2></div></div>
        <div class="exchange-checkout__fields">
          <label><span>First name</span><input name="firstName" autocomplete="given-name" required></label>
          <label><span>Last name</span><input name="lastName" autocomplete="family-name" required></label>
          <label class="field-wide"><span>Work email</span><input name="email" type="email" autocomplete="email" required></label>
          <label class="field-wide"><span>Company</span><input name="company" autocomplete="organization" required></label>
          <label><span>Role / title</span><input name="title" autocomplete="organization-title" required></label>
          <label><span>Country</span><select name="country" autocomplete="country-name" required><option value="">Select country</option>${countries.map((country) => `<option>${country}</option>`).join('')}</select></label>
        </div>
      </section>
      <section aria-labelledby="request-heading">
        <div class="exchange-checkout__section-head"><span>02</span><div><small>${procurementMode ? 'PROCUREMENT DETAILS' : 'PROPOSAL DETAILS'}</small><h2 id="request-heading">${procurementMode ? 'Route your request' : 'Shape the proposal'}</h2></div></div>
        <div class="exchange-checkout__fields">
          ${procurementMode ? '<label><span>Purchase method</span><select name="purchaseMethod" required><option value="">Select method</option><option>Purchase order</option><option>Invoice</option><option>Corporate card</option><option>To be confirmed</option></select></label><label><span>Cost center <small>(optional)</small></span><input name="costCenter" autocomplete="off"></label>' : ''}
          <label><span>Target start</span><select name="targetStart" required><option value="">Select timing</option><option>Within 30 days</option><option>1–3 months</option><option>3–6 months</option><option>Exploring options</option></select></label>
          <label><span>Decision stage</span><select name="decisionStage" required><option value="">Select stage</option><option>Initial discovery</option><option>Building a business case</option><option>Ready for scope review</option><option>Ready for procurement</option></select></label>
          <label class="field-wide"><span>Context for BCG <small>(optional)</small></span><textarea name="notes" rows="4" placeholder="Share priorities, constraints, stakeholders, or target outcomes."></textarea></label>
        </div>
      </section>
      <label class="exchange-checkout__consent"><input type="checkbox" name="consent" required><span>I confirm I’m authorized to request a commercial and scope review for my organization.</span></label>
      <button class="exchange-checkout__submit" type="submit"><span>${procurementMode ? 'Submit for procurement review' : 'Request commercial proposal'}</span><b>\u2197</b></button>
      <p class="exchange-checkout__secure">SECURE ENTERPRISE REQUEST · NO PAYMENT TAKEN</p>
    </form>`;
}

function emptyMarkup() {
  return `
    <section class="exchange-checkout__empty">
      <span aria-hidden="true">+</span>
      <p>YOUR PORTFOLIO</p>
      <h1>Nothing to check out yet.</h1>
      <p>Add a BCG offer or configure a BCG X pilot before continuing.</p>
      <a href="/#bcg-products">Explore products <b>\u2197</b></a>
    </section>`;
}

function successMarkup(reference, procurementMode) {
  return `
    <section class="exchange-checkout__success" tabindex="-1">
      <div class="exchange-checkout__success-mark" aria-hidden="true">\u2713</div>
      <span>${procurementMode ? 'PROCUREMENT REQUEST' : 'COMMERCIAL PROPOSAL'}</span>
      <h1>Your portfolio is ready for review.</h1>
      <p>Reference <strong>${reference}</strong> has been prepared. In a connected experience, BCG would route this request to the appropriate commercial team.</p>
      <div><span><small>NEXT STEP</small><strong>Scope and commercial review</strong></span><span><small>PAYMENT</small><strong>None taken</strong></span></div>
      <a href="/">Return to BCG Exchange <b>\u2197</b></a>
      <small>This concept demonstration does not transmit personal or procurement data.</small>
    </section>`;
}

export default function decorate(block) {
  const workspace = hydrateWorkspace();
  block.innerHTML = '<div class="exchange-checkout"></div>';
  const checkout = block.querySelector('.exchange-checkout');

  if (!workspace.items.length) {
    checkout.innerHTML = emptyMarkup();
    return;
  }

  const render = () => {
    const current = getWorkspace();
    checkout.innerHTML = `
      <section class="exchange-checkout__intro" aria-labelledby="checkout-title">
        <span>SECURE ENTERPRISE CHECKOUT</span>
        <h1 id="checkout-title">Complete your<br><em>request.</em></h1>
        <p>Tell us who owns the request and how your organization wants to proceed. No payment or binding commitment is made here.</p>
        <ol aria-label="Checkout progress"><li class="complete"><span>1</span>Portfolio</li><li class="active"><span>2</span>Details</li><li><span>3</span>Review</li></ol>
      </section>
      <div class="exchange-checkout__layout">
        ${formMarkup(current.procurementMode)}
        <aside class="exchange-checkout__summary" aria-label="Portfolio summary">${summaryMarkup(current)}</aside>
      </div>`;

    checkout.querySelector('[data-procurement]').addEventListener('change', (event) => {
      setProcurementMode(event.target.checked);
      render();
    });

    checkout.querySelector('form').addEventListener('submit', (event) => {
      event.preventDefault();
      if (!event.currentTarget.reportValidity()) return;
      const button = event.currentTarget.querySelector('button[type="submit"]');
      button.disabled = true;
      button.querySelector('span').textContent = 'Preparing request\u2026';
      const { procurementMode } = getWorkspace();
      const reference = submitWorkspaceRequest();
      checkout.innerHTML = successMarkup(reference, procurementMode);
      const success = checkout.querySelector('.exchange-checkout__success');
      success.focus();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  render();
}
