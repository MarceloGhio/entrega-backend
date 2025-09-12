import { Router } from 'express';
import Cart from '../models/Cart.model.js';

const router = Router();

// Agregar un producto al carrito
// POST /api/carts/:cartId/product/:productId
router.post('/:cartId/product/:productId', async (req, res) => {
  const { cartId, productId } = req.params;

  try {
    let cart;

    // Si no hay cartId o no existe, crear uno nuevo
    if (!cartId || cartId === 'null') {
      cart = await Cart.create({ products: [] });
    } else {
      cart = await Cart.findById(cartId);
      if (!cart) cart = await Cart.create({ products: [] });
    }

    // Revisar si el producto ya está en el carrito
    const index = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (index !== -1) {
      cart.products[index].quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cart.save();

    res.status(200).json({
      status: 'success',
      message: 'Producto agregado al carrito',
      cartId: cart._id, // devolver el id para guardarlo en frontend
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Error al agregar producto al carrito',
    });
  }
});

// Ver un carrito por id
// GET /api/carts/:cartId
router.get('/:cartId', async (req, res) => {
  const { cartId } = req.params;
  try {
    const cart = await Cart.findById(cartId).populate('products.product');
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    res.json({ status: 'success', payload: cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Error al obtener carrito' });
  }
});

export default router;
