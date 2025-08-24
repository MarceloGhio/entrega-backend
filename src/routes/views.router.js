import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const manager = new ProductManager();

// Redirigimos la raíz a /home por comodidad
router.get('/', (req, res) => res.redirect('/home'));

// Vista "home" -> lista que se actualiza al recargar (HTTP)
router.get('/home', async (req, res) => {
  const products = await manager.getAll();
  // Renderizamos la vista "home" y le pasamos los productos
  res.render('home', { products });
});

// Vista en tiempo real con WebSockets
router.get('/realtimeproducts', async (req, res) => {
  const products = await manager.getAll();
  res.render('realTimeProducts', { products });
});

export default router;
