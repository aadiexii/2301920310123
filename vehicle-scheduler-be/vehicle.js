import express from 'express';
import axios from 'axios';

const router = express.Router();

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJlYzIzMDE3QGdsYml0bS5hYy5pbiIsImV4cCI6MTc4MjQ1NzU1OCwiaWF0IjoxNzgyNDU2NjU8LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiYzhiOTE5OTEtOTAxMy00NTdiLWFhZjMtMDRjODViZDFlZWQ3IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2hpdmFtIG9tcHJha2FzaCBzaGFybWEiLCJzdWIiOiJjNzBhOGFkMS1lOWY0LTQyNDAtODE5Yy0xNmEyZjExZTYzZjAifSwiZW1haWwiOiJlYzIzMDE3QGdsYml0bS5hYy5pbiIsIm5hbWUiOiJzaGl2YW0gb21wcmFrYXNoIHNoYXJtYSIsInJvbGxObyI6IjIzMDE5MjAzMTAxMjMiLCJhY2Nlc3NDb2RlIjoieHhrSm5rIiwiY2xpZW50SUQiOiJjNzBhOGFkMS1lOWY0LTQyNDAtODE5Yy0xNmEyZjExZTYzZjAiLCJjbGllbnRTZWNyZXQiOiJzemVYbVVYY3hyVmFnV3JYIn0.hK3o6-efiE6QafIBLJnbyUFWqP54Da-XWxpeeF7kSZY";
const BASE = "http://4.224.186.213/evaluation-service";

const headers = { Authorization: `Bearer ${TOKEN}` };

// 0/1 knapsack
function knapsack(vehicles, capacity) {
    const n = vehicles.length;
    const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        const { Duration, Impact } = vehicles[i - 1];
        for (let w = 0; w <= capacity; w++) {
            dp[i][w] = dp[i - 1][w];
            if (Duration <= w) {
                dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - Duration] + Impact);
            }
        }
    }

    // backtrack to find selected
    let w = capacity;
    const selected = [];
    for (let i = n; i > 0; i--) {
        if (dp[i][w] !== dp[i - 1][w]) {
            selected.push(vehicles[i - 1]);
            w -= vehicles[i - 1].Duration;
        }
    }

    return { totalImpact: dp[n][capacity], selected };
}

router.get('/schedule', async (req, res) => {
    try {
        const [depotsRes, vehiclesRes] = await Promise.all([
            axios.get(`${BASE}/depots`, { headers }),
            axios.get(`${BASE}/vehicles`, { headers })
        ]);

        const depots = depotsRes.data.depots;
        const vehicles = vehiclesRes.data.vehicles;

        const result = depots.map(depot => {
            const { ID, MechanicHours } = depot;
            const { totalImpact, selected } = knapsack(vehicles, MechanicHours);
            return {
                depotId: ID,
                mechanicHours: MechanicHours,
                totalImpact,
                scheduledVehicles: selected.map(v => v.TaskID)
            };
        });

        res.json({ result });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "something went wrong" });
    }
});

export default router;