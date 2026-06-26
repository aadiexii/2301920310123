// logging-middleware/middleware.js

export default function loggingMiddleware(req, res, next) {
    const time = new Date().toLocaleTimeString();
    // Simple log to track incoming api calls
    console.log(`[LOG] ${time} - ${req.method} requested on ${req.url}`);
    next();
}