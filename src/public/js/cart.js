// src/public/js/cart.js
// Manejo simple de cartId en localStorage + funciones para agregar, eliminar y actualizar.

async function ensureCart() {
  let cartId = localStorage.getItem('cartId');
  if (!cartId) {
    const res = await fetch('/api/carts', { method: 'POST' });
    const data = await res.json();
    if (data && data.payload && data.payload._id) {
      cartId = data.payload._id;
      localStorage.setItem('cartId', cartId);
    }
  }
  return cartId;
}

export async function addToCart(pid) {
  try {
    const cid = await ensureCart();
    const res = await fetch(`/api/carts/${cid}/products/${pid}`, { method: 'POST' });
    const data = await res.json();
    if (data.status === 'success') {
      alert('Producto agregado al carrito');
    } else {
      alert('Error agregando al carrito: ' + (data.message || ''));
    }
  } catch (err) {
    console.error(err);
    alert('Error en la petición');
  }
}

// Se usa en templates como función global
window.addToCart = addToCart;

window.removeFromCart = async function (cid, pid) {
  try {
    const res = await fetch(`/api/carts/${cid}/products/${pid}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.status === 'success') {
      alert('Producto eliminado');
      location.reload();
    } else {
      alert('Error: ' + (data.message || ''));
    }
  } catch (err) {
    console.error(err);
  }
};

window.updateQuantity = async function (e, cid, pid) {
  e.preventDefault();
  const q = e.target.quantity.value;
  try {
    const res = await fetch(`/api/carts/${cid}/products/${pid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: Number(q) })
    });
    const data = await res.json();
    if (data.status === 'success') {
      alert('Cantidad actualizada');
      location.reload();
    } else {
      alert('Error: ' + (data.message || ''));
    }
  } catch (err) {
    console.error(err);
  }
};
