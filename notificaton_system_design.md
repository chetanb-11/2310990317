# Stage 1

**Core Features:**
- Get user notifications (with pagination/filters).
- Mark specific/all notifications as read.
- Delete notifications.

**REST APIs:**
- `GET /api/v1/notifications?page=1&limit=20&status=unread` (Returns list & pagination)
- `PATCH /api/v1/notifications/:id/read` (Mark one as read)
- `POST /api/v1/notifications/read-all` (Mark all unread as read)

**Real-time (WebSockets):**
Clients connect to WebSockets via token. Backend maps `userId` to socket. On new events, backend saves to DB and emits `NEW_NOTIFICATION`. Client updates UI instantly.

---

# Stage 2

**Storage:** MongoDB (NoSQL)
**Why:** Handles high write volumes and unstructured metadata efficiently.
**Schema:** `{ _id, userId, type, title, message, isRead, metadata, createdAt, updatedAt }`

**Scaling Strategies:**
1. **Data size:** Add TTL indexes (delete unread after 90 days, read after 30 days).
2. **Read speed:** Use compound index `{ userId: 1, isRead: 1, createdAt: -1 }`.
3. **Mass broadcasts:** Use message queues (RabbitMQ/Kafka) + background workers for batch inserts.

**Queries:**
- Fetch: `find({userId: "X"}).sort({createdAt: -1}).limit(20)`
- Read: `updateOne({_id: "X"}, {$set: {isRead: true}})`
- Read-all: `updateMany({userId: "X", isRead: false}, {$set: {isRead: true}})`
- Delete: `deleteOne({_id: "X"})`

---

# Stage 3

**Slow SQL Query Analysis:**
`SELECT * FROM notifications WHERE studentID = 1042 AND isRead = false ORDER BY createdAt DESC;`
- **Issue:** Missing indexes cause full table scans and slow in-memory sorting.
- **Fix:** `CREATE INDEX idx_stu_read_time ON notifications (studentID, isRead, createdAt DESC);` changes cost from O(N log N) to O(log N).
- **Index every column?** No. It degrades write performance, wastes disk space, and confuses the query optimizer.

**SQL Query:** Students with Placement notifications in last 7 days:
```sql
SELECT DISTINCT studentID FROM notifications 
WHERE notificationType = 'Placement' 
AND createdAt >= NOW() - INTERVAL 7 DAY;
```

---

# Stage 4

**Problem:** Constant reads on page reloads overload the DB.

**Solutions & Tradeoffs:**

1. **Redis Cache (API caching)**
   - *Pros:* Offloads reads from DB; ultra-fast.
   - *Cons:* Infrastructure overhead; cache invalidation complexities.
2. **Client-Side Caching (Redux/Context + WebSockets)**
   - *Pros:* Zero API calls after first load; free.
   - *Cons:* Refreshing re-triggers fetch; complex reconnection sync.
3. **Timestamp Polling (`?last_fetched=timestamp`)**
   - *Pros:* Small payloads; fast indexed queries.
   - *Cons:* Still hits DB constantly; hard to sync read states across devices.

**Recommendation:** Client-side state + WebSockets, backed by Redis for extreme scaling.
