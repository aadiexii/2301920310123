import axios from 'axios';

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJlYzIzMDE3QGdsYml0bS5hYy5pbiIsImV4cCI6MTc4MjQ1NzU1OCwiaWF0IjoxNzgyNDU2NjU4LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiYzhiOTE5OTEtOTAxMy00NTdiLWFhZjMtMDRjODViZDFlZWQ3IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2hpdmFtIG9tcHJha2FzaCBzaGFybWEiLCJzdWIiOiJjNzBhOGFkMS1lOWY0LTQyNDAtODE5Yy0xNmEyZjExZTYzZjAifSwiZW1haWwiOiJlYzIzMDE3QGdsYml0bS5hYy5pbiIsIm5hbWUiOiJzaGl2YW0gb21wcmFrYXNoIHNoYXJtYSIsInJvbGxObyI6IjIzMDE5MjAzMTAxMjMiLCJhY2Nlc3NDb2RlIjoieHhrSm5rIiwiY2xpZW50SUQiOiJjNzBhOGFkMS1lOWY0LTQyNDAtODE5Yy0xNmEyZjExZTYzZjAiLCJjbGllbnRTZWNyZXQiOiJzemVYbVVYY3hyVmFnV3JYIn0.hK3o6-efiE6QafIBLJnbyUFWqP54Da-XWxpeeF7kSZY";

const loggingMiddleware = async (req, res, next) => {
    const start = Date.now();

    res.on('finish', async () => {
        const duration = Date.now() - start;
        const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;
        
        try {
            await axios.post(
                'http://4.224.186.213/evaluation-service/logs',
                {
                    stack: "backend",
                    level: res.statusCode >= 500 ? "error" : "info",
                    package: "handler",
                    message
                },
                { headers: { Authorization: `Bearer ${TOKEN}` } }
            );
        } catch (e) {
            console.error("log api failed", e.message);
        }

        console.log(message);
    });

    next();
};

export default loggingMiddleware;