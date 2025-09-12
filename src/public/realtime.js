document.addEventListener('DOMContentLoaded', () => {
  const socket = io(); // conecta con el servidor de socket.io

  const listEl = document.getElementById('product-list');
  const form = document.getElementById('product-form');

  // Función para redibujar la lista
  const render = (products = []) => {
    listEl.innerHTML = '';
    products.forEach(p => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${p.title}</strong>
        — $${p.price}
        — Stock: ${p.stock}
        <em style="margin-left:auto;">ID: ${p.id}</em>
        <button class="delete-btn" data-id="${p.id}">Eliminar</button>
      `;
      listEl.appendChild(li);
    });
  };

  // Cuando el server manda actualización, redibujamos
  socket.on('products:update', (products) => {
    render(products);
  });

  // Enviar creación de producto por socket
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
      title: form.title.value.trim(),
      description: form.description.value.trim(),
      code: form.code.value.trim(),
      price: Number(form.price.value),
      status: form.status.checked,        // checkbox -> boolean
      stock: Number(form.stock.value),
      category: form.category.value.trim(),
      thumbnails: form.thumbnails.value
        ? form.thumbnails.value.split(',').map(s => s.trim()).filter(Boolean)
        : []
    };

    socket.emit('product:create', data);
    form.reset();
    form.status.checked = true; // lo dejo tildado por comodidad
  });

  // Click en eliminar (delegación)
  listEl.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const id = Number(e.target.dataset.id);
      socket.emit('product:delete', id);
    }
  });
});