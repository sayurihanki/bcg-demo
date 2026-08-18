export default function decorate(block) {
  block.innerHTML = '<section class="final-cta section-pad"><div class="cta-pattern" aria-hidden="true"></div><span class="eyebrow light">THE NEXT MOVE IS YOURS</span><h2>Turn your ambition<br>into <em>advantage.</em></h2><p>Let’s configure the right mix of intelligence, tools, and expertise for your organization.</p><div class="final-actions"><button class="primary-cta light-cta" type="button" data-ask>Start a conversation <span>↗</span></button><a class="text-cta light-text" href="#bcg-products">Explore BCG X products <span>→</span></a></div></section>';
  block.querySelector('[data-ask]').addEventListener('click', (event) => document.dispatchEvent(new CustomEvent('bcg-exchange:open-ask', { detail: { trigger: event.currentTarget } })));
}
