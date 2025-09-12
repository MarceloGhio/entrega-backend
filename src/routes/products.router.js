import { Router } from 'express';
import Product from '../models/Product.model.js';

const router = Router();

// GET paginado
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filter = {};
    if (query) {
      if (query === 'available') filter.status = true;
      else filter.category = query;
    }

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
    };

    const result = await Product.paginate(filter, options);
    res.json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST crear producto
router.post('/', async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json({ status: 'success', payload: newProduct });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});

export default router;
