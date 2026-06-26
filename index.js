// index.js (Root Directory)
import express from 'express';
import loggingMiddleware from './logging-middleware/middleware.js';
import vehicleRouter from './vehicle-scheduler-be/vehicle.js';

const app = express();
app.use(express.json());


app.get('/', (req, res) => {
    res.json({ message: "Campus Evaluation Root API active" });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Central Server active on port ${PORT}`);
});