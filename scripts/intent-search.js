import { bcgSolutions, marketplaceOffers } from './exchange-data.js';

const SIGNALS = [
  { id: 'ai', label: 'AI transformation', terms: ['ai', 'artificial intelligence', 'genai', 'generative ai', 'automation', 'machine learning'] },
  { id: 'value', label: 'Value realization', terms: ['value', 'roi', 'business case', 'opportunity', 'opportunities', 'use case', 'use cases', 'scale', 'roadmap', 'prioritize', 'priority'] },
  { id: 'data', label: 'Data & intelligence', terms: ['data', 'analytics', 'insight', 'intelligence', 'model', 'models', 'dataset', 'datasets', 'decision intelligence'] },
  { id: 'growth', label: 'Growth', terms: ['growth', 'revenue', 'gmv', 'commercial', 'sales', 'market share', 'new market'] },
  { id: 'customer', label: 'Customer engagement', terms: ['customer', 'customers', 'consumer', 'personalization', 'personalisation', 'retention', 'churn', 'loyalty', 'marketing'] },
  { id: 'marketplace', label: 'Marketplace', terms: ['marketplace', 'seller', 'sellers', 'buyer', 'buyers', 'platform business'] },
  { id: 'operations', label: 'Operations', terms: ['operations', 'operational', 'productivity', 'workflow', 'execution', 'efficiency', 'cost'] },
  { id: 'supply-chain', label: 'Supply chain', terms: ['supply chain', 'logistics', 'inventory', 'planning', 'network design', 'resilience'] },
  { id: 'frontline', label: 'Frontline & workforce', terms: ['frontline', 'workforce', 'labor', 'labour', 'scheduling', 'employee', 'employees', 'organization', 'organisation', 'operating model'] },
  { id: 'retail', label: 'Retail', terms: ['retail', 'retailer', 'store', 'stores', 'merchandising', 'assortment'] },
  { id: 'banking', label: 'Financial services', terms: ['bank', 'banking', 'financial services', 'relationship manager', 'wealth'] },
  { id: 'pricing', label: 'Pricing & promotion', terms: ['pricing', 'price', 'promotion', 'promotions', 'trade spend', 'revenue growth management', 'rgm'] },
  { id: 'climate', label: 'Climate transition', terms: ['climate', 'sustainability', 'emissions', 'decarbonization', 'decarbonisation', 'transition', 'net zero'] },
  { id: 'procurement', label: 'Procurement', terms: ['procurement', 'purchasing', 'supplier', 'suppliers', 'sourcing', 'should cost', 'po', 'invoice'] },
  { id: 'enterprise', label: 'Enterprise readiness', terms: ['enterprise', 'governance', 'approval', 'approvals', 'compliance', 'sso', 'access control', 'global'] },
  { id: 'agentic', label: 'Agentic workflows', terms: ['agent', 'agents', 'agentic', 'orchestration', 'autonomous'] },
];

const SOLUTION_SIGNALS = {
  'marketplace-accelerator': ['ai', 'marketplace', 'growth', 'customer', 'operations'],
  'data-intelligence-ai': ['ai', 'value', 'data', 'growth', 'customer', 'enterprise'],
  'deep-customer-engagement-ai': ['ai', 'customer', 'growth', 'data'],
  'supply-chain-ai': ['ai', 'operations', 'supply-chain', 'climate', 'value'],
  'frontline-ops-ai': ['ai', 'operations', 'frontline', 'retail', 'agentic', 'value'],
  'smart-banking-ai': ['ai', 'banking', 'customer', 'growth', 'data'],
  'retail-ai': ['ai', 'retail', 'pricing', 'customer', 'supply-chain', 'operations', 'value'],
  'revenue-growth-management-ai': ['ai', 'pricing', 'growth', 'customer', 'data', 'value'],
};

const SOLUTION_BOOSTS = {
  'data-intelligence-ai': 6,
};

const OFFER_SIGNALS = {
  1: ['ai', 'data', 'value', 'enterprise'],
  2: ['ai', 'value', 'enterprise'],
  3: ['climate', 'data', 'enterprise', 'value'],
  4: ['procurement', 'operations', 'enterprise', 'data'],
  5: ['customer', 'growth', 'data'],
  6: ['frontline', 'enterprise', 'ai', 'value'],
};

const OFFER_BOOSTS = {
  1: 8,
  2: 14,
};

const SITE_CONTENT = [
  {
    id: 'enterprise-buying',
    title: 'Enterprise procurement workspace',
    description: 'See approval, access, invoicing, and governance options for an enterprise portfolio.',
    href: '/#enterprise',
    kind: 'Buying guide',
    action: 'Explore enterprise buying',
    signals: ['procurement', 'enterprise', 'operations'],
    keywords: 'purchase commercial terms proposal controls role based entitlements team access',
  },
  {
    id: 'agentic-path',
    title: 'An orchestrated path to value',
    description: 'See how an intent becomes an explainable, governed recommendation and commercial path.',
    href: '/#agentic',
    kind: 'How it works',
    action: 'Explore the agentic path',
    signals: ['agentic', 'ai', 'value', 'enterprise'],
    keywords: 'intent recommendation human approval responsible ai auditable actions',
  },
  {
    id: 'product-universe',
    title: 'The BCG X product universe',
    description: 'Compare industry-grade AI products and configure an enterprise pilot.',
    href: '/#bcg-products',
    kind: 'Product collection',
    action: 'Browse all BCG X products',
    signals: ['ai', 'value', 'enterprise'],
    boost: 3,
    keywords: 'catalog products compare pilot expertise solutions',
  },
  {
    id: 'marketplace',
    title: 'The BCG Exchange marketplace',
    description: 'Browse expert-led programs, intelligence subscriptions, and decision tools.',
    href: '/#marketplace',
    kind: 'Marketplace',
    action: 'Browse the marketplace',
    signals: ['value', 'growth', 'enterprise'],
    keywords: 'catalog offers expertise workshop subscription decision tools',
  },
];

const OFFER_ACTIONS = {
  1: 'Explore the signal pack',
  2: 'Explore the value sprint',
  3: 'Explore the transition lens',
  4: 'Explore the procurement suite',
  5: 'Explore customer insights',
  6: 'Explore the organization lab',
};

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'build', 'for', 'from', 'help', 'how', 'i',
  'identify', 'in', 'is', 'it', 'me', 'my', 'of', 'on', 'our', 'the', 'to', 'us', 'we',
  'where', 'with', 'would', 'like',
]);

const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const containsTerm = (text, term) => ` ${text} `.includes(` ${normalize(term)} `);

const catalog = [
  ...bcgSolutions.map((solution) => ({
    id: `solution-${solution.id}`,
    title: solution.name,
    description: solution.description,
    href: `/products/${solution.slug}`,
    kind: 'BCG X product',
    action: 'View product detail',
    signals: SOLUTION_SIGNALS[solution.slug],
    boost: SOLUTION_BOOSTS[solution.slug] || 0,
    keywords: `${solution.category} ${solution.metricLabel} ${solution.longDescription} ${solution.capabilities.flat().join(' ')} ${solution.outcomes.join(' ')}`,
  })),
  ...marketplaceOffers.map((offer) => ({
    id: `offer-${offer.id}`,
    title: offer.title,
    description: offer.description,
    href: `/#offer-${offer.id}`,
    kind: offer.format,
    action: OFFER_ACTIONS[offer.id],
    signals: OFFER_SIGNALS[offer.id],
    boost: OFFER_BOOSTS[offer.id] || 0,
    keywords: `${offer.eyebrow} ${offer.category} ${offer.badge || ''}`,
  })),
  ...SITE_CONTENT,
];

function detectSignals(query) {
  return SIGNALS.map((signal) => {
    const matchedTerms = signal.terms.filter((term) => containsTerm(query, term));
    const strength = matchedTerms.reduce((sum, term) => sum + (term.includes(' ') ? 3 : 1), 0);
    return { ...signal, strength };
  }).filter(({ strength }) => strength > 0).sort((a, b) => b.strength - a.strength);
}

function tokenize(value) {
  return normalize(value).split(' ').filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function scoreEntry(entry, query, queryTokens, signals) {
  const searchText = normalize(`${entry.title} ${entry.description} ${entry.keywords}`);
  const signalScore = signals.reduce((score, signal) => (
    score + (entry.signals.includes(signal.id) ? signal.strength * 8 : 0)
  ), 0);
  const boostApplies = signals.some(({ id }) => (
    ['ai', 'value'].includes(id) && entry.signals.includes(id)
  ));
  const tokenScore = queryTokens.reduce((score, token) => (
    score + (containsTerm(searchText, token) ? 2 : 0)
  ), 0);
  const phraseScore = containsTerm(searchText, query) ? 8 : 0;
  return signalScore + tokenScore + phraseScore + (boostApplies ? entry.boost || 0 : 0);
}

function resultReason(entry, signals) {
  const matches = signals.filter(({ id }) => entry.signals.includes(id)).slice(0, 2);
  if (!matches.length) return 'A useful starting point for exploring relevant BCG expertise.';
  return `Strong match for ${matches.map(({ label }) => label.toLowerCase()).join(' and ')}.`;
}

export function searchIntent(value, limit = 4) {
  const query = normalize(value);
  if (!query) return { signals: [], results: [] };
  const signals = detectSignals(query);
  const queryTokens = tokenize(query);
  const ranked = catalog.map((entry) => ({
    ...entry,
    matchesSignal: signals.some(({ id }) => entry.signals.includes(id)),
    reason: resultReason(entry, signals),
    score: scoreEntry(entry, query, queryTokens, signals),
  })).sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  const relevant = ranked.filter(({ matchesSignal, score }) => (
    signals.length ? matchesSignal || score >= 6 : score > 0
  ));
  const results = (relevant.length ? relevant : ranked).slice(0, limit);
  return { signals: signals.slice(0, 4), results };
}
