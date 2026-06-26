import fs from 'fs';
import path from 'path';

const logFile = fs.createWriteStream(path.resolve('logs.txt'), { flags: 'a' });

const loggingMiddleware = (req, res, next) => {
    const start = Date.now();
    const time = new Date().toISOString();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const log = `[${time}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms\n`;
        logFile.write(log);
        console.log(log.trim());
    });

    next();
};

export default loggingMiddleware;