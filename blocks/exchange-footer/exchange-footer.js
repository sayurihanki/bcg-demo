export default function decorate(block) {
  if (window.location.pathname.startsWith('/products/')) {
    block.innerHTML = '<footer class="pdp-footer"><a class="brand" href="/"><span class="brand-mark">BCG</span><span class="brand-divider"></span><span class="brand-name">Exchange</span></a><span>BCG X product commerce concept · For demonstration</span><a href="/#bcg-products">Back to all products ↑</a></footer>';
    return;
  }
  block.innerHTML = '<footer class="exchange-footer"><div class="footer-brand"><span class="brand-mark">BCG</span><span>A demo concept for the future of expert commerce.</span></div><div class="footer-links"><a href="https://www.bcg.com/" target="_blank" rel="noreferrer">BCG.com ↗</a><a href="#agenda">Demo agenda</a><button type="button" data-ask>Contact</button></div><div class="footer-bottom"><span>© 2026 Boston Consulting Group</span><span>Concept experience · For demonstration</span></div></footer>';
  block.querySelector('[data-ask]').addEventListener('click', (event) => document.dispatchEvent(new CustomEvent('bcg-exchange:open-ask', { detail: { trigger: event.currentTarget } })));
}
