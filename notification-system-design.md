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

