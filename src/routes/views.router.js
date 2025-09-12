import { Router } from 'express';
import Product from '../models/Product.model.js';

const router = Router();

router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render('products', { products });
  } catch (err) {
    res.status(500).send('Error al cargar productos');
  }
});

export default router;
