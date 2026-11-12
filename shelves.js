import { products, categories } from "./products.js";

const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const palette = p => ({main:p.color||"#c88b55",accent:p.accent||"#f1dfb8"});
function art(p){
  const {main,accent}=palette(p); const kind=p.kind||"box";
  const label=`<rect x="15" y="48" width="70" height="34" rx="3" fill="${accent}"/><path d="M22 58h56M22 64h42" stroke="#4c4439" stroke-width="2" opacity=".65"/><circle cx="50" cy="74" r="5" fill="${main}"/>`;
  let body="";
  if(kind==="bottle") body=`<path d="M40 13h20v10l8 9v61q0 8-8 8H40q-8 0-8-8V32l8-9z" fill="${main}" stroke="#65452f" stroke-width="2"/><rect x="42" y="5" width="16" height="10" rx="2" fill="#6a5039"/><path d="M34 43h32v34H34z" fill="${accent}"/>${label}`;
  else if(kind==="jar") body=`<rect x="28" y="29" width="44" height="65" rx="9" fill="${main}" stroke="#70442f" stroke-width="2"/><rect x="25" y="22" width="50" height="12" rx="3" fill="#b85d43"/><rect x="32" y="48" width="36" height="28" rx="3" fill="${accent}"/><circle cx="50" cy="62" r="9" fill="#c65c43"/><path d="M50 52l4-5" stroke="#63764e" stroke-width="3"/>`;
  else if(kind==="eggs") body=`<path d="M12 53q3-27 38-31 35 4 38 31v35H12z" fill="#d2bda0" stroke="#927b60" stroke-width="2"/><path d="M17 54h66v32H17z" fill="${main}"/>${[0,1,2,3,4,5].map((_,i)=>`<ellipse cx="${25+(i%3)*25}" cy="${59+Math.floor(i/3)*15}" rx="8" ry="10" fill="#f4e5c9" stroke="#c9b38e"/>`).join("")}`;
  else if(kind==="bread") body=`<path d="M10 75q-2-28 18-37 7-23 26-15 24-8 30 18 14 11 5 34-10 18-42 18H24q-13 0-14-18z" fill="${main}" stroke="#9b6335" stroke-width="2"/><path d="M34 43l-5 17m23-25-5 17m24-9-6 16" stroke="${accent}" stroke-width="5" stroke-linecap="round"/>`;
  else if(kind==="tech") body=`<rect x="15" y="27" width="70" height="60" rx="12" fill="${main}" stroke="#4b4b4a" stroke-width="3"/><circle cx="50" cy="57" r="17" fill="${accent}"/><circle cx="50" cy="57" r="10" fill="${main}"/><circle cx="26" cy="42" r="3" fill="${accent}"/><circle cx="74" cy="42" r="3" fill="${accent}"/>`;
  else if(kind==="book") body=`<path d="M18 15h58q7 0 7 7v73H25q-7 0-7-7z" fill="${main}" stroke="#554b3e" stroke-width="2"/><path d="M26 15v80" stroke="${accent}" stroke-width="5"/><path d="M38 37h33M38 45h26" stroke="${accent}" stroke-width="3"/><circle cx="56" cy="66" r="12" fill="${accent}"/>`;
  else if(kind==="shoe") body=`<path d="M12 69q16 0 24-27l14 5q7 19 28 22 12 2 12 13v8H14q-9-7-2-21z" fill="${main}" stroke="#6b5947" stroke-width="2"/><path d="M39 53l22 7M35 60l22 7" stroke="${accent}" stroke-width="3"/>`;
  else if(kind==="home") body=`<path d="M18 49L50 20l32 29v43H18z" fill="${main}" stroke="#70553e" stroke-width="2"/><path d="M12 51L50 15l38 36" fill="none" stroke="${accent}" stroke-width="7"/><rect x="43" y="62" width="15" height="30" fill="${accent}"/>`;
  else body=`<path d="M24 16h52l-4 80H28z" fill="${main}" stroke="#684a34" stroke-width="2"/><path d="M24 16l7-9h38l7 9" fill="${accent}" stroke="#684a34" stroke-width="2"/><path d="M32 42h36v31H32z" fill="${accent}"/><circle cx="50" cy="57" r="9" fill="${main}"/>`;
  return `<svg viewBox="0 0 100 112" role="img" aria-label="${esc(p.name)} illustration"><ellipse cx="51" cy="103" rx="34" ry="5" fill="#4c2c1b" opacity=".16"/>${body}</svg>`;
}
function tag(p){if(!p.tag)return "";return `<span class="product-tag ${esc(p.tagType||"")}">${esc(p.tag)}</span>`}
export function productMarkup(p){
 return `<article class="shelf-product" data-product="${esc(p.id)}" tabindex="0" role="button" aria-label="View ${esc(p.name)}"><button class="product-heart" data-heart="${esc(p.id)}" aria-label="Save ${esc(p.name)}">♡</button>${tag(p)}<div class="product-art">${art(p)}</div><span class="product-mini-name">${esc(p.name)}</span></article>`;
}
export function renderShelves({container,onProduct,onAdd,onHeart,compact=false}){
 const root=typeof container==="string"?document.querySelector(container):container;
 root.innerHTML=categories.map(([name,desc],i)=>{
   const items=products.filter(p=>p.category===name);
   if(!items.length)return `<section class="department" id="dept-${i}" data-category="${esc(name)}"><header class="department-head"><div><span class="department-kicker">DEPARTMENT ${String(i+1).padStart(2,"0")}</span><h3 class="department-title">${esc(name)}</h3><p class="department-desc">${esc(desc)}</p></div></header><div class="empty-category">This aisle is being stocked — more lovely finds coming soon.</div></section>`;
   return `<section class="department" id="dept-${i}" data-category="${esc(name)}"><header class="department-head"><div><span class="department-kicker">DEPARTMENT ${String(i+1).padStart(2,"0")}</span><h3 class="department-title">${esc(name)}</h3><p class="department-desc">${esc(desc)}</p></div><div class="department-actions"><button class="view-all" data-jump="${esc(name)}">View aisle ↗</button><button class="shelf-arrow" data-scroll="-1" aria-label="Scroll ${esc(name)} left">‹</button><button class="shelf-arrow" data-scroll="1" aria-label="Scroll ${esc(name)} right">›</button></div></header><div class="shelf-frame"><div class="shelf-scroll">${items.map(productMarkup).join("")}</div><div class="shelf-track"></div><div class="shelf-label-wrap"><span class="shelf-label">${esc(name)}</span><button class="shelf-add" data-add-category="${esc(name)}" aria-label="Add a popular ${esc(name)} item">+</button></div></div><div class="shelf-progress"><span></span></div></section>`;
 }).join("");
 root.querySelectorAll(".department").forEach(section=>{
   const scroller=section.querySelector(".shelf-scroll"); if(!scroller)return;
   const progress=section.querySelector(".shelf-progress span");
   const update=()=>{const max=scroller.scrollWidth-scroller.clientWidth;progress.style.width=max>0?`${Math.max(12,scroller.clientWidth/scroller.scrollWidth*100)}%`:"100%";progress.style.transform=`translateX(${max>0?scroller.scrollLeft/max*(100-scroller.clientWidth/scroller.scrollWidth*100):0}%)`};
   scroller.addEventListener("scroll",update,{passive:true});new ResizeObserver(update).observe(scroller);update();
 });
 root.addEventListener("click",e=>{
   const heart=e.target.closest("[data-heart]");if(heart){e.stopPropagation();onHeart(heart.dataset.heart,heart);return}
   const add=e.target.closest("[data-add-category]");if(add){const p=products.find(x=>x.category===add.dataset.addCategory);if(p)onAdd(p);return}
   const scroll=e.target.closest("[data-scroll]");if(scroll){const sc=scroll.closest(".department").querySelector(".shelf-scroll");sc.scrollBy({left:Number(scroll.dataset.scroll)*Math.max(250,sc.clientWidth*.75),behavior:"smooth"});return}
   const jump=e.target.closest("[data-jump]");if(jump){document.querySelector(`[data-category="${CSS.escape(jump.dataset.jump)}"]`)?.scrollIntoView({behavior:"smooth",block:"start"});return}
   const card=e.target.closest("[data-product]");if(card)onProduct(products.find(p=>p.id===card.dataset.product));
 });
 root.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches("[data-product]")){e.preventDefault();onProduct(products.find(p=>p.id===e.target.dataset.product))}});
}
export function renderChips(onSelect){
 const el=document.querySelector("#categoryChips");el.innerHTML=`<button class="category-chip active" data-chip="all">All departments</button>`+categories.map(([n])=>`<button class="category-chip" data-chip="${esc(n)}">${esc(n)}</button>`).join("");
 el.addEventListener("click",e=>{const b=e.target.closest("[data-chip]");if(!b)return;el.querySelectorAll(".category-chip").forEach(x=>x.classList.toggle("active",x===b));onSelect(b.dataset.chip)});
}