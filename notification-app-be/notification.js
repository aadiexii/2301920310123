import express from 'express';
import axios from 'axios';

const router = express.Router();

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJlYzIzMDE3QGdsYml0bS5hYy5pbiIsImV4cCI6MTc4MjQ1NDM5NiwiaWF0IjoxNzgyNDUzNDk2LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiN2Y3NmYwMmEtYmI0Ni00YjEwLWIwN2QtYWI4OTExMTVmYzRmIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2hpdmFtIG9tcHJha2FzaCBzaGFybWEiLCJzdWIiOiJjNzBhOGFkMS1lOWY0LTQyNDAtODE5Yy0xNmEyZjExZTYzZjAifSwiZW1haWwiOiJlYzIzMDE3QGdsYml0bS5hYy5pbiIsIm5hbWUiOiJzaGl2YW0gb21wcmFrYXNoIHNoYXJtYSIsInJvbGxObyI6IjIzMDE5MjAzMTAxMjMiLCJhY2Nlc3NDb2RlIjoieHhrSm5rIiwiY2xpZW50SUQiOiJjNzBhOGFkMS1lOWY0LTQyNDAtODE5Yy0xNmEyZjExZTYzZjAiLCJjbGllbnRTZWNyZXQiOiJzemVYbVVYY3hyVmFnV3JYIn0.sYbOvMc_U2Jc2PK9KCkJcSb3W7mlDGGiU17UAydSwl0";
const BASE = "http://4.224.186.213/evaluation-service";

const headers = { Authorization: `Bearer ${TOKEN}` };

const typeWeight = {
    Placement: 3,
    Result: 2,
    Event: 1
};

router.get('/priority', async (req, res) => {
    try {
        const response = await axios.get(`${BASE}/notifications`, { headers });
        const notifications = response.data.notifications;

        const now = Date.now();

        const scored = notifications.map(n => {
            const weight = typeWeight[n.Type] ?? 0;
            const age = (now - new Date(n.Timestamp).getTime()) / 1000 / 60; // minutes
            const score = weight * 10 - age * 0.1;
            return { ...n, score };
        });

        scored.sort((a, b) => b.score - a.score);

        const top10 = scored.slice(0, 10).map(({ score, ...rest }) => rest);

        res.json({ notifications: top10 });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "something went wrong" });
    }
});

export default router;