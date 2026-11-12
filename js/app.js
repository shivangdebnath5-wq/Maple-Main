import { products, categories } from "./products.js";
import { renderShelves,renderChips,productArt } from "./shelves.js";
import { readCart,addToCart,setQty,cartSummary } from "./cart.js";
import { readWishlist,toggleWishlist } from "./wishlist.js";
import { showProduct } from "./product-details.js";

const $=s=>document.querySelector(s);let toastTimer;
function money(n){return "₹"+n.toLocaleString("en-IN")}
function toast(msg){const el=$("#toast");el.textContent=msg;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2200)}
function refreshHeader(){const s=cartSummary(products);$("#cartCount").textContent=s.count;$("#cartTotal").textContent=money(s.total);$("#wishlistCount").textContent=readWishlist().length}
function add(product){addToCart(product);refreshHeader();renderCart();toast(`${product.name} added to your bag`)}
function openDrawer(id){closePanels();$("#overlay").classList.remove("hidden");$(id).classList.remove("hidden")}
function closePanels(){["#cartDrawer","#wishlistDrawer","#notificationDrawer","#productModal"].forEach(s=>$(s).classList.add("hidden"));$("#overlay").classList.add("hidden")}
function renderCart(){
 const {cart,total,count}=cartSummary(products),el=$("#cartItems");$("#drawerCount").textContent=`(${count})`;$("#drawerSubtotal").textContent=money(total);
 $("#deliveryNote").textContent=total>=799?"Lovely! You've unlocked free demo delivery.":`Add ${money(799-total)} more to unlock free demo delivery.`;
 const entries=Object.entries(cart).filter(([id])=>products.some(p=>p.id===id));
 el.innerHTML=entries.length?entries.map(([id,qty])=>{const p=products.find(x=>x.id===id);return `<div class="cart-row"><div class="cart-thumb">${miniArt(p)}</div><div><h4>${p.name}</h4><small>${money(p.price)} · ${p.brand}</small><div class="qty-control"><button data-qty="${id}" data-delta="-1">−</button><b>${qty}</b><button data-qty="${id}" data-delta="1">+</button></div></div><b>${money(p.price*qty)}</b></div>`}).join(""):`<div class="empty-state"><b>Your bag is taking a little nap.</b>Find something lovely on the shelves and it will appear here.</div>`;
 el.querySelectorAll("[data-qty]").forEach(b=>b.onclick=()=>{setQty(b.dataset.qty,cart[b.dataset.qty]+Number(b.dataset.delta));renderCart();refreshHeader()});
}
function miniArt(p){return productArt(p)}
function renderWishlist(){const list=readWishlist().map(id=>products.find(p=>p.id===id)).filter(Boolean);$("#wishlistItems").innerHTML=list.length?list.map(p=>`<div class="wishlist-row"><div class="wishlist-thumb">${miniArt(p)}</div><div><h4>${p.name}</h4><small>${money(p.price)}</small></div><button class="remove-button" data-unwish="${p.id}">Remove</button></div>`).join(""):`<div class="empty-state"><b>Keep a little list.</b>Tap the heart on a product to save it for later.</div>`;$("#wishlistItems").querySelectorAll("[data-unwish]").forEach(b=>{b.onclick=()=>{toggleWishlist(b.dataset.unwish);renderWishlist();refreshHeader()}})}
function modalWish(id){const list=toggleWishlist(id),on=list.includes(id);document.querySelectorAll(`[data-heart="${CSS.escape(id)}"]`).forEach(b=>{b.classList.toggle("saved",on);b.textContent=on?"♥":"♡"});refreshHeader();toast(on?"Saved to your wishlist":"Removed from wishlist")}
function heart(id,button){const list=toggleWishlist(id);button.classList.toggle("saved",list.includes(id));button.textContent=list.includes(id)?"♥":"♡";refreshHeader();toast(list.includes(id)?"Saved to your wishlist":"Removed from wishlist")}
renderShelves({container:"#shelvesContainer",onProduct:p=>showProduct(p,add,readWishlist(),modalWish),onAdd:add,onHeart:heart});
readWishlist().forEach(id=>document.querySelectorAll(`[data-heart="${CSS.escape(id)}"]`).forEach(b=>{b.classList.add("saved");b.textContent="♥"}));
renderChips(name=>{if(name==="all"){$("#shelvesContainer").querySelectorAll(".department").forEach(x=>x.classList.remove("filtered-out"));return}$("#shelvesContainer").querySelectorAll(".department").forEach(x=>x.classList.toggle("filtered-out",x.dataset.category!==name));const target=document.querySelector(`[data-category="${CSS.escape(name)}"]`);target?.scrollIntoView({behavior:"smooth",block:"center"})});
$("#categoryChips").addEventListener("click",e=>{if(e.target.dataset.chip==="all")$("#shelvesContainer").querySelectorAll(".department").forEach(x=>x.classList.remove("filtered-out"))});
$("#cartOpen").onclick=()=>{renderCart();openDrawer("#cartDrawer")};
$("#wishlistOpen").onclick=()=>{renderWishlist();openDrawer("#wishlistDrawer")};
$("#notificationsOpen").onclick=()=>openDrawer("#notificationDrawer");
$("#overlay").onclick=closePanels;document.querySelectorAll("[data-close]").forEach(b=>b.onclick=closePanels);
$("#checkoutButton").onclick=()=>toast("Demo checkout — payment is not connected.");
$("#exploreButton").onclick=()=>$("#market").scrollIntoView({behavior:"smooth"});
$("#densityToggle").onclick=()=>{$("#shelvesContainer").classList.toggle("compact");$("#densityToggle").textContent=$("#shelvesContainer").classList.contains("compact")?"Comfortable shelves ↔":"Compact shelves ↔"};
const search=$("#searchInput"),suggestions=$("#searchSuggestions");
function searchProducts(q){return products.filter(p=>(p.name+" "+p.brand+" "+p.category).toLowerCase().includes(q.toLowerCase())).slice(0,7)}
search.addEventListener("input",()=>{const q=search.value.trim();if(!q){suggestions.classList.add("hidden");return}const matches=searchProducts(q);suggestions.innerHTML=matches.length?matches.map(p=>`<div class="suggestion" data-result="${p.id}"><span>${p.name}</span><b>${money(p.price)}</b></div>`).join(""):`<div class="suggestion">No products found</div>`;suggestions.classList.remove("hidden")});
suggestions.addEventListener("click",e=>{const item=e.target.closest("[data-result]");if(!item)return;const p=products.find(x=>x.id===item.dataset.result);suggestions.classList.add("hidden");search.value=p.name;showProduct(p,add,readWishlist(),modalWish)});
document.addEventListener("click",e=>{if(!e.target.closest(".searchbox"))suggestions.classList.add("hidden")});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closePanels();if(e.key==="/"&&!["INPUT","TEXTAREA"].includes(document.activeElement.tagName)){e.preventDefault();search.focus()}});
$("#mobileMenu").onclick=()=>$("#categoryChips").scrollIntoView({behavior:"smooth"});
$("#shelfCount").textContent=`${categories.length} departments`;
refreshHeader();renderCart();
