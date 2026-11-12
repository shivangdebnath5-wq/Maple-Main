const KEY="marketlane-cart";
export function readCart(){try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch{return {}}}
export function saveCart(cart){localStorage.setItem(KEY,JSON.stringify(cart))}
export function addToCart(product,qty=1){const c=readCart();c[product.id]=(c[product.id]||0)+qty;saveCart(c);return c}
export function setQty(id,qty){const c=readCart();if(qty<=0)delete c[id];else c[id]=qty;saveCart(c);return c}
export function cartSummary(products){const c=readCart();let count=0,total=0;for(const [id,qty] of Object.entries(c)){const p=products.find(x=>x.id===id);if(p){count+=qty;total+=p.price*qty}}return {count,total,cart:c}}
