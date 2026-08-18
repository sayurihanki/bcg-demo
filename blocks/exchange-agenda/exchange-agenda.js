import { agendaItems } from '../../scripts/exchange-data.js';

export default function decorate(block) {
  const items = agendaItems.map((item, index) => `<article class="agenda-item"><div class="agenda-time">${item[0]}</div><div class="agenda-number">${item[1]}</div><div class="agenda-copy"><h3>${item[2]}</h3><p>${item[3]}</p><span>${item[5]}</span></div><div class="agenda-duration">${item[4]}</div><div class="agenda-dot" style="--delay:${index * 0.08}s"></div></article>`).join('');
  block.innerHTML = `<section class="agenda section-pad" id="agenda"><div class="agenda-intro"><span class="eyebrow">LIVE DEMONSTRATION · 90 MINUTES</span><h2>From framing<br>to <em>decision.</em></h2><p>A deliberately sequenced walkthrough of the experience, its architecture, and the choices that make it enterprise-ready.</p><div class="agenda-clock"><span>13:00</span><i></i><span>14:30</span></div></div><div class="agenda-list">${items}</div></section>`;
}
