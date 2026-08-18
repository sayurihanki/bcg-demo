import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { agendaItems, bcgSolutions, marketplaceOffers } from './exchange-data.js';

const root = resolve('fixtures/bcg-exchange');
const mediaUrl = 'https://content.da.live/sayurihanki/bcg-demo/media/bcg-exchange/og-products.png';

const escape = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const cell = (content) => `<div>${content}</div>`;
const row = (...cells) => `<div>${cells.map(cell).join('')}</div>`;
const block = (name, rows) => `<div class="${name}">${rows.join('')}</div>`;
const section = (...blocks) => `<div>${blocks.join('')}</div>`;
const metadata = ({ title, description }) => block('metadata', [
  row('<strong>title</strong>', escape(title)),
  row('<strong>description</strong>', escape(description)),
  row('<strong>image</strong>', `<a href="${mediaUrl}">${mediaUrl}</a>`),
  row('<strong>template</strong>', 'bcg-exchange'),
  row('<strong>robots</strong>', 'noindex, nofollow'),
]);
const documentHtml = (sections) => `<!doctype html><html><head><meta charset="utf-8"></head><body><header></header><main>${sections.join('')}</main><footer></footer></body></html>\n`;

const homepage = documentHtml([
  section(block('exchange-header', [
    row('<strong>BCG Exchange</strong>', '<a href="#marketplace">Marketplace</a>'),
    ...['BCG X products', 'For enterprise', 'Agentic commerce', 'Demo agenda'].map((label) => row(`<a href="#${label.toLowerCase().replaceAll(' ', '-')}">${label}</a>`)),
    row('<strong>Ask BCG</strong>', '<strong>Proposal</strong>'),
  ])),
  section(block('exchange-hero', [
    row('<p>BCG intelligence, ready to deploy</p><h1>Intelligence you can <em>act on.</em></h1><p>Discover expert-led programs, decision tools, and always-on intelligence—configured for your ambition and ready for enterprise.</p>', '<a href="#marketplace">Explore the marketplace</a><br><a href="#ask-bcg">Tell us your priority</a>'),
    row('<strong>LIVE SIGNAL</strong><p>GenAI value realization</p>', '<strong>CURATED FOR YOU</strong><p>Five moves for your sector</p>'),
    ...['Scale AI', 'Lead the transition', 'Unlock productivity', 'Transform the organization'].map((label) => row(`<a href="#marketplace">${label}</a>`)),
    row('<strong>3,000+</strong><p>BCG X experts</p>', '<strong>80</strong><p>cities</p>', '<strong>82+</strong><p>patents pending</p>', '<strong>30+</strong><p>tech partnerships</p>'),
  ])),
  section(block('exchange-marketplace', marketplaceOffers.map((offer) => row(
    `<strong>${escape(offer.eyebrow)}</strong><p>${escape(offer.category)}</p>`,
    `<h3>${escape(offer.title)}</h3><p>${escape(offer.description)}</p>`,
    `<p>${escape(offer.format)}</p><strong>$${offer.price.toLocaleString('en-US')}</strong>`,
    `${offer.badge ? `<p>${escape(offer.badge)}</p>` : ''}<a href="#proposal">Add to workspace</a>`,
  )))),
  section(block('exchange-product-universe', bcgSolutions.map((solution) => row(
    `<strong>${solution.code}</strong><p>${escape(solution.category)}</p>`,
    `<h3>${escape(solution.name)}</h3><p>${escape(solution.description)}</p>`,
    `<strong>${escape(solution.metric)}</strong><p>${escape(solution.metricLabel)}</p>`,
    `<a href="/products/${solution.slug}">View PDP</a><br><a href="${solution.url}">View on BCG.com</a>`,
  )))),
  section(block('exchange-enterprise', [
    row('<h2>Fast for teams. <em>Frictionless</em> for procurement.</h2><p>Configure access, route approvals, and purchase globally—with the controls your organization already expects.</p>', '<a href="#proposal">Open procurement workspace</a>'),
    ...['Negotiated pricing and volume tiers', 'PO, invoice, card, and cost-center support', 'Role-based entitlements and SSO', 'Usage, renewal, and compliance controls'].map((feature, index) => row(`<strong>0${index + 1}</strong>`, `<p>${feature}</p>`)),
  ])),
  section(block('exchange-agentic', [
    row('<h2>One ambition. <em>An orchestrated path to value.</em></h2>', '<p>A governed BCG agent connects your intent to the right expertise, evidence, and buying workflow.</p>'),
    row('<strong>01 / INTENT</strong><p>Help our retail business identify and scale its highest-value AI opportunities.</p>', '<strong>02 / BCG AGENT</strong><p>Synthesizing context</p>', '<strong>03 / RECOMMENDATION</strong><p>Retail AI and Data Intelligence AI</p>'),
    row('<p>Human approval</p>', '<p>Explainable recommendations</p>', '<p>Contract-aware</p>', '<p>Auditable actions</p>'),
  ])),
  section(block('exchange-agenda', agendaItems.map((item) => row(`<time>${item[0]}</time>`, `<strong>${item[1]}</strong>`, `<h3>${item[2]}</h3><p>${item[3]}</p>`, `<p>${item[5]}</p><small>${item[4]}</small>`)))),
  section(block('exchange-cta', [row('<p>THE NEXT MOVE IS YOURS</p><h2>Turn your ambition into <em>advantage.</em></h2><p>Let’s configure the right mix of intelligence, tools, and expertise for your organization.</p>', '<a href="#ask-bcg">Start a conversation</a><br><a href="#bcg-products">Explore BCG X products</a>')])),
  section(block('exchange-footer', [
    row('<strong>BCG</strong><p>A demo concept for the future of expert commerce.</p>', '<a href="https://www.bcg.com/">BCG.com</a>'),
    row('<a href="#agenda">Demo agenda</a>'), row('<p>© 2026 Boston Consulting Group</p><p>Concept experience · For demonstration</p>'),
  ])),
  section(metadata({ title: 'BCG Exchange | Intelligence You Can Act On', description: 'Discover BCG intelligence, expert-led programs, and BCG X products configured for enterprise impact.' })),
]);

async function save(relativePath, html) {
  const file = resolve(root, relativePath);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
}

await save('index.html', homepage);
await Promise.all(bcgSolutions.map(async (solution) => {
  const detailRows = [
    row(`<strong>${solution.slug}</strong>`, `<p>${escape(solution.category)} · BCG X product</p><h1>${escape(solution.shortName)}</h1>`, `<p>${escape(solution.description)}</p>`, `<a href="${solution.url}">View on BCG.com</a>`),
    row('<strong>Overview</strong>', `<p>${escape(solution.longDescription)}</p>`, `<strong>${escape(solution.metric)}</strong><p>${escape(solution.metricLabel)}</p>`),
    ...solution.capabilities.map(([title, description], index) => row(`<strong>Capability 0${index + 1}</strong>`, `<h3>${escape(title)}</h3><p>${escape(description)}</p>`)),
    row('<strong>Outcomes</strong>', `<ul>${solution.outcomes.map((outcome) => `<li>${escape(outcome)}</li>`).join('')}</ul>`),
    row('<strong>Deployment</strong>', `<ol>${solution.deployment.map((step) => `<li>${escape(step)}</li>`).join('')}</ol>`),
    row('<strong>Pilot options</strong>', '<p>8, 12, or 16 weeks</p>', '<p>1–12 markets</p>', '<p>25, 50, or 100 seats</p>'),
    row('<strong>Related products</strong>', ...bcgSolutions.filter(({ id }) => id !== solution.id).slice(0, 3).map((item) => `<a href="/products/${item.slug}">${escape(item.shortName)}</a>`)),
  ];
  const html = documentHtml([
    section(block('exchange-header', [row('<strong>BCG Exchange</strong>', '<a href="/#bcg-products">All products</a>'), row('<a href="#capabilities">Capabilities</a>'), row('<a href="#deployment">Deployment</a>'), row('<strong>Proposal workspace</strong>')])),
    section(block('exchange-product-detail', detailRows)),
    section(block('exchange-footer', [row('<strong>BCG Exchange</strong>', '<p>BCG X product commerce concept · For demonstration</p>', '<a href="/#bcg-products">Back to all products</a>')])),
    section(metadata({ title: `${solution.shortName} | BCG Exchange`, description: solution.description })),
  ]);
  await save(`products/${solution.slug}.html`, html);
}));

// eslint-disable-next-line no-console
console.log(`Generated 9 DA fixtures in ${root}`);
