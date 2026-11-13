import { productArt } from "./shelves.js";

/* Floating wicker basket.
   - Shows one tiny illustrated thumbnail per unit in the basket (round-robin
     across products so variety shows first), up to MAX visible.
   - render() is driven entirely by the real basket data, so additions,
     removals and quantity changes always stay in sync.
   - fly() animates a product from where it was added into the basket. */

const MAX = 14;
/* [x, bottom, rotation, row] in fill order. Front rows get a higher z-index. */
const SLOTS = [
  [32, 34, -4, 0], [54, 34, 5, 0], [43, 40, 3, 1], [10, 34, -8, 0], [76, 34, 9, 0],
  [21, 40, -6, 1], [65, 40, 7, 1], [32, 46, 5, 2], [54, 46, -5, 2], [10, 46, -9, 2],
  [76, 46, 8, 2], [21, 52, -4, 3], [43, 52, 4, 3], [65, 52, -7, 3]
];

const BACK = `<svg class="bk-back" viewBox="0 0 104 104" aria-hidden="true" focusable="false">
  <path d="M16 66C12 8 92 8 88 66" fill="none" stroke="#6e4224" stroke-width="8.5" stroke-linecap="round"/>
  <path d="M16 66C12 8 92 8 88 66" fill="none" stroke="#c98f55" stroke-width="5.5" stroke-linecap="round"/>
  <path d="M16 66C12 8 92 8 88 66" fill="none" stroke="#f0d2a0" stroke-width="1.6" stroke-dasharray="3 4" stroke-linecap="round"/>
  <ellipse cx="52" cy="64" rx="45" ry="8" fill="#4a2c18"/>
</svg>`;

const FRONT = `<svg class="bk-front" viewBox="0 0 104 104" aria-hidden="true" focusable="false">
  <defs>
    <pattern id="bkWeave" width="12" height="10" patternUnits="userSpaceOnUse">
      <rect width="12" height="10" fill="#c58f55"/>
      <rect x=".5" y=".5" width="11" height="4" rx="2" fill="#dcab6f" stroke="#8a5a30" stroke-width=".8"/>
      <rect x="-5.5" y="5.5" width="11" height="4" rx="2" fill="#cf9b60" stroke="#8a5a30" stroke-width=".8"/>
      <rect x="6.5" y="5.5" width="11" height="4" rx="2" fill="#cf9b60" stroke="#8a5a30" stroke-width=".8"/>
    </pattern>
    <pattern id="bkCheck" width="8" height="8" patternUnits="userSpaceOnUse">
      <rect width="8" height="8" fill="#fbf1d9"/><rect width="4" height="4" fill="#d9806a"/><rect x="4" y="4" width="4" height="4" fill="#d9806a"/>
    </pattern>
    <linearGradient id="bkShade" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".18"/><stop offset=".35" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>
  </defs>
  <path d="M7 68h90l-7 30q-1 5-7 5H21q-6 0-7-5z" fill="url(#bkWeave)" stroke="#6e4224" stroke-width="2" stroke-linejoin="round"/>
  <path d="M7 68h90l-7 30q-1 5-7 5H21q-6 0-7-5z" fill="url(#bkShade)"/>
  <path d="M10 80h84M13 91h78" stroke="#6e4224" stroke-width="1.6" opacity=".5"/>
  <rect x="3" y="62" width="98" height="12" rx="6" fill="#b97f45" stroke="#6e4224" stroke-width="2"/>
  <path d="M10 68h84" stroke="#f0d2a0" stroke-width="2" stroke-dasharray="4 3" stroke-linecap="round"/>
  <path d="M9 74q-4 15 8 17l13-17z" fill="url(#bkCheck)" stroke="#a8553f" stroke-width="1.2" stroke-linejoin="round"/>
</svg>`;

const money = n => "₹" + n.toLocaleString("en-IN");

export function createBasketFab({ onOpen }) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.id = "basketFab";
  btn.className = "basket-fab is-empty";
  btn.innerHTML = `<span class="basket-fab-label" aria-hidden="true"></span><span class="basket-fab-inner">${BACK}<span class="bk-items" aria-hidden="true"></span>${FRONT}<b class="basket-fab-count" aria-hidden="true">0</b></span>`;
  document.body.appendChild(btn);
  btn.addEventListener("click", onOpen);

  const itemsEl = btn.querySelector(".bk-items");
  const countEl = btn.querySelector(".basket-fab-count");
  const labelEl = btn.querySelector(".basket-fab-label");
  const nodes = new Map();      // key -> element
  let lastCount = 0;

  const reduced = () => window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function tokensFor(entries) {
    const out = [];
    for (let r = 0; out.length < MAX; r++) {
      let any = false;
      for (const { product, qty } of entries) {
        if (qty > r) { any = true; if (out.length < MAX) out.push({ key: `${product.id}#${r}`, product }); }
      }
      if (!any) break;
    }
    return out;
  }

  /* Re-draw from real basket data. entries = [{ product, qty }].
     Returns the keys of thumbnails that are new. With hold:true the new
     thumbnails stay hidden until settle() is called (when a flying product lands). */
  function render(entries, { hold = false } = {}) {
    const tokens = tokensFor(entries);
    const wanted = new Set(tokens.map(t => t.key));
    const fresh = [];

    nodes.forEach((el, key) => {
      if (!wanted.has(key)) {
        nodes.delete(key);
        el.classList.add("leaving");
        el.dataset.leaving = "1";
        setTimeout(() => el.remove(), 320);
      }
    });

    tokens.forEach((t, i) => {
      const [x, y, rot, row] = SLOTS[i];
      let el = nodes.get(t.key);
      if (!el) {
        el = document.createElement("span");
        el.className = "bk-item" + (hold ? " hold" : " drop");
        el.dataset.key = t.key;
        el.dataset.id = t.product.id;
        el.innerHTML = productArt(t.product);
        itemsEl.appendChild(el);
        nodes.set(t.key, el);
        fresh.push(t.key);
      }
      el.style.left = x + "px";
      el.style.bottom = y + "px";
      el.style.zIndex = 5 - row;
      el.style.setProperty("--r", rot + "deg");
    });

    const count = entries.reduce((n, e) => n + e.qty, 0);
    const total = entries.reduce((n, e) => n + e.qty * e.product.price, 0);
    countEl.textContent = count > 99 ? "99+" : String(count);
    btn.classList.toggle("is-empty", count === 0);
    btn.dataset.count = String(count);
    labelEl.textContent = count ? `Basket · ${money(total)}` : "Your basket is empty";
    btn.setAttribute("aria-label", count
      ? `Open basket, ${count} ${count === 1 ? "item" : "items"}, ${money(total)}`
      : "Open basket, currently empty");
    if (count !== lastCount && count > 0) {
      countEl.classList.remove("tick"); void countEl.offsetWidth; countEl.classList.add("tick");
    }
    lastCount = count;
    return fresh;
  }

  function bounce() {
    btn.classList.remove("bounce");
    void btn.offsetWidth;
    btn.classList.add("bounce");
  }
  btn.addEventListener("animationend", e => { if (e.animationName === "basketBounce") btn.classList.remove("bounce"); });

  /* Reveal held thumbnails with a drop-in and give the basket a bounce. */
  function settle(keys = [], { withBounce = true } = {}) {
    keys.forEach(k => {
      const el = nodes.get(k);
      if (el && el.classList.contains("hold")) { el.classList.remove("hold"); el.classList.add("drop"); }
    });
    if (withBounce) bounce();
  }

  /* Fly a copy of the product art from `sourceEl` into the basket. */
  function fly(product, sourceEl, keys = []) {
    const src = sourceEl && sourceEl.getBoundingClientRect && sourceEl.getBoundingClientRect();
    if (!src || !src.width || reduced() || !Element.prototype.animate) { settle(keys); return; }

    const target = itemsEl.getBoundingClientRect();
    const size = Math.max(44, Math.min(76, src.width, src.height));
    const el = document.createElement("div");
    el.className = "fly-item";
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = productArt(product);
    const sx = src.left + src.width / 2, sy = src.top + src.height / 2;
    Object.assign(el.style, {
      left: sx - size / 2 + "px", top: sy - size * 0.55 + "px",
      width: size + "px", height: size * 1.1 + "px"
    });
    document.body.appendChild(el);

    const tx = target.left + target.width / 2 - sx;
    const ty = target.top + target.height * 0.28 - sy;
    const end = Math.max(.3, 30 / size);
    const lift = Math.min(ty, 0) - 70 - Math.min(80, Math.abs(tx) * .15);

    let done = false;
    const finish = () => { if (done) return; done = true; el.remove(); settle(keys); };
    const anim = el.animate([
      { transform: "translate(0,0) scale(1) rotate(0deg)", opacity: 1 },
      { transform: `translate(${tx * .5}px,${lift}px) scale(.82) rotate(-12deg)`, opacity: 1, offset: .45 },
      { transform: `translate(${tx}px,${ty}px) scale(${end}) rotate(14deg)`, opacity: .95 }
    ], { duration: 640, easing: "cubic-bezier(.45,.05,.35,1)", fill: "forwards" });
    anim.onfinish = finish;
    anim.oncancel = finish;
    setTimeout(finish, 1400); // failsafe so a thumbnail can never stay hidden
  }

  return { render, settle, fly, bounce, element: btn };
}
