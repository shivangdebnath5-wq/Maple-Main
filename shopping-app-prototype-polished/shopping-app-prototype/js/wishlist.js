const KEY="marketlane-wishlist";
export function readWishlist(){try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch{return []}}
export function toggleWishlist(id){let list=readWishlist();list=list.includes(id)?list.filter(x=>x!==id):[...list,id];localStorage.setItem(KEY,JSON.stringify(list));return list}
