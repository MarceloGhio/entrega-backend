import express from 'express';
import mongoose from 'mongoose';
import { engine } from 'express-handlebars';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Routers
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 1000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));

// Handlebars con helper multiply
app.engine('hbs', engine({
  extname: '.hbs',
  helpers: {
    multiply: (a, b) => a * b
  }
}));
app.set('view engine', 'hbs');
app.set('views', join(__dirname, 'views'));

// Routes
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// DB + Server
mongoose.connect('mongodb+srv://marce:12345@cluster0.xquv9ka.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('Conectado a MongoDB Atlas');
    app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
  })
  .catch(err => console.error('Error al conectar MongoDB:', err));
