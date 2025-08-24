console.log("App.js fue ejecutado");

import express from 'express';
import http from 'http';                // Necesario para levantar Socket.IO sobre el mismo servidor HTTP
import { Server as SocketIOServer } from 'socket.io';
import { engine } from 'express-handlebars';

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';

import ProductManager from './managers/ProductManager.js';
const productManager = new ProductManager();

const app = express();
const PORT = 1000;

// --- Middlewares base
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // por si algún form usa urlencoded

// --- Archivos estáticos (para servir /js/realtime.js)
app.use(express.static('src/public'));

// --- Handlebars (motor de vistas)
app.engine('handlebars', engine({ extname: '.handlebars' }));
app.set('view engine', 'handlebars');
app.set('views', 'src/views');

// --- Routers HTTP
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// --- Server HTTP + Socket.IO
const server = http.createServer(app);
const io = new SocketIOServer(server);

// Hacemos disponible "io" dentro de los handlers de Express (para emitir desde POST/DELETE)
app.set('io', io);

// --- Lógica de WebSocket
io.on('connection', async (socket) => {
  console.log('Cliente conectado por WebSocket:', socket.id);

  // Enviamos lista inicial al cliente que se conecta
  const products = await productManager.getAll();
  socket.emit('products:update', products);

  // Crear producto desde el formulario en tiempo real
  socket.on('product:create', async (data) => {
    // Validación mínima (mismos campos que tu API)
    const { title, description, code, price, status, stock, category, thumbnails } = data || {};
    if (!title || !description || !code || price == null || status == null || stock == null || !category) {
      return; // si falta algo, no hacemos nada (podrías emitir un error si querés)
    }
    await productManager.addProduct({
      title,
      description,
      code,
      price: Number(price),
      status: Boolean(status),
      stock: Number(stock),
      category,
      thumbnails: Array.isArray(thumbnails) ? thumbnails : []
    });

    // Enviamos a TODOS los clientes la lista actualizada
    const updated = await productManager.getAll();
    io.emit('products:update', updated);
  });

  // Eliminar producto desde el botón en la vista en tiempo real
  socket.on('product:delete', async (id) => {
    await productManager.deleteProduct(id);
    const updated = await productManager.getAll();
    io.emit('products:update', updated);
  });
});

// --- Levantar servidor
server.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

