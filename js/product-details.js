import { productMarkup } from "./shelves.js";
export function showProduct(product,add,wish,onWish){
 const modal=document.querySelector("#productModal"),content=document.querySelector("#productModalContent");
 const saved=wish.includes(product.id),off=product.mrp>product.price?Math.round((1-product.price/product.mrp)*100):0;
 const art=productMarkup(product).match(/<div class="product-art">([\s\S]*?)<\/div>/)?.[1]||"";
 content.innerHTML=`<div class="detail-layout"><div class="detail-visual"><div class="detail-art">${art}</div><span class="detail-stamp">A MARKET LANE FIND ✳</span></div><div class="detail-copy"><span class="eyebrow">${product.category.toUpperCase()} · ${product.brand.toUpperCase()}</span><h2>${product.name}</h2><div class="rating">★ ${product.rating} <span>(${product.reviews} little reviews)</span></div><div class="detail-price"><b>₹${product.price.toLocaleString("en-IN")}</b>${product.mrp>product.price?`<del>₹${product.mrp.toLocaleString("en-IN")}</del><span>${off}% OFF</span>`:""}</div><p class="detail-description">${product.description}</p>${product.offer?`<div class="offer-box">✦ ${product.offer}</div>`:""}<h4>A few details</h4><ul>${(product.details||[]).map(x=>`<li>${x}</li>`).join("")}</ul><div class="detail-actions"><button class="primary-button" id="detailAdd">Add to basket · ₹${product.price.toLocaleString("en-IN")} <span>＋</span></button><button class="detail-heart ${saved?"saved":""}" id="detailWish">${saved?"♥":"♡"}</button></div><small class="demo-note">Demo listing · No real stock or delivery promise.</small></div></div>`;
 modal.classList.remove("hidden");
 content.querySelector("#detailAdd").onclick=()=>{add(product,content.querySelector(".detail-art"));modal.classList.add("hidden")};
 content.querySelector("#detailWish").onclick=()=>{const b=content.querySelector("#detailWish");if(onWish)onWish(product.id);const on=b.classList.toggle("saved");b.textContent=on?"♥":"♡"};
}
