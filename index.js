import express from 'express';
import loggingMiddleware from './logging-middleware/middleware.js';
import vehicleRouter from './vehicle-scheduler-be/vehicle.js';
import notificationRouter from './notification-app-be/notification.js';

const app = express();
app.use(express.json());
app.use(loggingMiddleware);

app.get('/', (req, res) => {
    res.json({ message: "Campus Evaluation Root API active" });
});

app.use('/vehicles', vehicleRouter);
app.use('/notifications', notificationRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Central Server active on port ${PORT}`);
});