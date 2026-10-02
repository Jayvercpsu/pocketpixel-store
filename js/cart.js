window.CellStore = window.CellStore || {};
(() => {
 const KEY='cellstore_cart', ORDERS='cellstore_orders', CUSTOMER='cellstore_customer';
 const safeParse=(value,fallback)=>{try{const parsed=JSON.parse(value);return parsed??fallback}catch{return fallback}};
 const loadCart=()=>{const c=safeParse(localStorage.getItem(KEY),[]);return Array.isArray(c)?c.filter(x=>x&&typeof x.id==='string'&&Number(x.qty)>0):[]};
 const saveCart=cart=>{localStorage.setItem(KEY,JSON.stringify(cart));window.dispatchEvent(new CustomEvent('cartchange'));return cart};
 const addToCart=(id,qty=1)=>{const cart=loadCart(),row=cart.find(x=>x.id===id);row?row.qty+=qty:cart.push({id,qty});return saveCart(cart)};
 const setQuantity=(id,qty)=>{let cart=loadCart();if(qty<=0)cart=cart.filter(x=>x.id!==id);else{const row=cart.find(x=>x.id===id);if(row)row.qty=qty}return saveCart(cart)};
 const removeFromCart=id=>saveCart(loadCart().filter(x=>x.id!==id));
 const clearCart=()=>saveCart([]);
 const cartDetails=()=>loadCart().map(row=>{const product=CellStore.products.find(p=>p.id===row.id);return product?{...row,product,lineTotal:product.price*row.qty}:null}).filter(Boolean);
 const totals=()=>{const subtotal=cartDetails().reduce((s,x)=>s+x.lineTotal,0),shipping=subtotal?150:0;return{subtotal,shipping,total:subtotal+shipping}};
 const saveOrder=order=>{const orders=safeParse(localStorage.getItem(ORDERS),[]);orders.unshift(order);localStorage.setItem(ORDERS,JSON.stringify(orders));localStorage.setItem('cellstore_last_order',order.orderNumber);return order};
 const loadOrders=()=>safeParse(localStorage.getItem(ORDERS),[]);
 const loadOrder=id=>loadOrders().find(o=>o.orderNumber===id)||null;
 const updateOrderStatus=(id,statusIndex)=>{const orders=loadOrders(),order=orders.find(o=>o.orderNumber===id);if(!order)return null;order.statusIndex=statusIndex;localStorage.setItem(ORDERS,JSON.stringify(orders));return order};
 Object.assign(CellStore,{KEYS:{cart:KEY,orders:ORDERS,customer:CUSTOMER},safeParse,loadCart,saveCart,addToCart,setQuantity,removeFromCart,clearCart,cartDetails,totals,saveOrder,loadOrders,loadOrder,updateOrderStatus});
})();
