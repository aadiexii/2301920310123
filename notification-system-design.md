# Notification System Design

## Stage 1

### REST API Design for Campus Notification Platform

User actions the platform should support:
- View all notifications
- Mark a notification as read
- Get unread notification count

#### Endpoints

**GET /notifications**
Headers: `Authorization: Bearer <token>`
Response:
```json
{
  "notifications": [
    {
      "id": "uuid",
      "type": "Placement",
      "message": "string",
      "isRead": false,
      "createdAt": "2026-06-26T05:29:58Z"
    }
  ]
}
```

**PATCH /notifications/:id/read**
Headers: `Authorization: Bearer <token>`
Response:
```json
{ "message": "marked as read" }
```

**GET /notifications/unread/count**
Headers: `Authorization: Bearer <token>`
Response:
```json
{ "count": 5 }
```

For real-time I would use SSE (Server-Sent Events) since notifications are one-way server to client, no need for full duplex like websockets.

---

## Stage 2

### Database

I'd go with PostgreSQL. Data is structured, relations are simple and we need to filter by studentID and isRead a lot so SQL works well here.

#### Schema

```sql
CREATE TYPE notification_type AS ENUM ('Placement', 'Result', 'Event');

CREATE TABLE students (
  id UUID PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  type notification_type,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

Problems at scale: table grows very fast with 50k students. Without indexes every query is a full scan.

Fetch unread for a student:
```sql
SELECT * FROM notifications
WHERE student_id = $1 AND is_read = false
ORDER BY created_at DESC;
```

Students who got placement notification in last 7 days:
```sql
SELECT DISTINCT student_id FROM notifications
WHERE type = 'Placement'
AND created_at >= NOW() - INTERVAL '7 days';
```

---
