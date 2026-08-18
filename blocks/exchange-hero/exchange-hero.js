function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function decorate(block) {
  block.innerHTML = '<section class="hero" id="top"><div class="hero-glow hero-glow-one"></div><div class="hero-glow hero-glow-two"></div><div class="hero-content"><div class="hero-kicker"><span></span> BCG intelligence, ready to deploy</div><h1>Intelligence<br>you can <em>act on.</em></h1><p>Discover expert-led programs, decision tools, and always-on intelligence—configured for your ambition and ready for enterprise.</p><div class="hero-actions"><button class="primary-cta" type="button" data-scroll="marketplace">Explore the marketplace <span>↗</span></button><button class="text-cta" type="button" data-ask>Tell us your priority <span>→</span></button></div></div><div class="hero-visual" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="intelligence-card card-a"><span>LIVE SIGNAL</span><b>GenAI value realization</b><i>↑ 18%</i></div><div class="intelligence-card card-b"><span>CURATED FOR YOU</span><b>Five moves for your sector</b><small>06 / 08</small></div><div class="hero-sphere"><div class="sphere-core">BCG<span>IQ</span></div></div></div><div class="hero-foot"><span>Explore by ambition</span><div class="ambition-links"><button type="button" data-filter="AI & Digital">Scale AI</button><button type="button" data-filter="Climate">Lead the transition</button><button type="button" data-filter="Operations">Unlock productivity</button><button type="button" data-filter="Organization">Transform the organization</button></div></div></section><section class="proof-strip" aria-label="Marketplace statistics"><div><b>3,000+</b><span>BCG X experts</span></div><div><b>80</b><span>cities</span></div><div><b>82+</b><span>patents pending</span></div><div><b>30+</b><span>tech partnerships</span></div></section>';
  block.querySelector('[data-scroll]').addEventListener('click', () => scrollTo('marketplace'));
  block.querySelector('[data-ask]').addEventListener('click', (event) => document.dispatchEvent(new CustomEvent('bcg-exchange:open-ask', { detail: { trigger: event.currentTarget } })));
  block.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('bcg-exchange:marketplace-filter', { detail: button.dataset.filter }));
    scrollTo('marketplace');
  }));
}
