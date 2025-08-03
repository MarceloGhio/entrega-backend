import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const manager = new ProductManager();

router.get('/', async (req, res) => {
  const products = await manager.getAll();
  res.json(products);
});

router.get('/:pid', async (req, res) => {
  const product = await manager.getById(req.params.pid);
  res.json(product || { error: 'Producto no encontrado' });
});

router.post('/', async (req, res) => {
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;
  if (!title || !description || !code || !price || !status || !stock || !category) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  const product = await manager.addProduct({ title, description, code, price, status, stock, category, thumbnails });
  res.status(201).json(product);
});

router.put('/:pid', async (req, res) => {
  const update = req.body;
  delete update.id;
  const result = await manager.updateProduct(req.params.pid, update);
  res.json(result || { error: 'Producto no encontrado' });
});

router.delete('/:pid', async (req, res) => {
  const result = await manager.deleteProduct(req.params.pid);
  res.json(result);
});

export default router;
