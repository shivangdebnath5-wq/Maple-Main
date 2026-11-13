export const BASKET_KEY="marketlane-basket";
const KEY=BASKET_KEY;
const OLD_KEY="marketlane-cart";
export function readBasket(){try{let raw=localStorage.getItem(KEY);if(raw===null){const old=localStorage.getItem(OLD_KEY);if(old!==null){localStorage.setItem(KEY,old);localStorage.removeItem(OLD_KEY);raw=old}}return JSON.parse(raw||"{}")}catch{return {}}}
export function saveBasket(basket){localStorage.setItem(KEY,JSON.stringify(basket))}
export function addToBasket(product,qty=1){const c=readBasket();c[product.id]=(c[product.id]||0)+qty;saveBasket(c);return c}
export function setQty(id,qty){const c=readBasket();if(qty<=0)delete c[id];else c[id]=qty;saveBasket(c);return c}
export function basketSummary(products){const c=readBasket();let count=0,total=0;for(const [id,qty] of Object.entries(c)){const p=products.find(x=>x.id===id);if(p){count+=qty;total+=p.price*qty}}return {count,total,basket:c}}
