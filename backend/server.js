require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');
const productRoutes = require('./routes/product.routes');
const cookRoutes = require('./routes/cook.routes');
const paymentRoutes = require('./routes/payment.routes');
const orderRoutes = require('./routes/order.routes');
const bookingRoutes = require('./routes/booking.routes');
const errorHandler = require('./middleware/error.middleware');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cooks', cookRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/bookings', bookingRoutes);

// Starting Route
app.get('/', (req, res) => {
    res.json({ message: "Welcome to Serve My Meal API", status: "Running" });
});

// Error Handler (Keep this after all routes)
app.use(errorHandler);

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
